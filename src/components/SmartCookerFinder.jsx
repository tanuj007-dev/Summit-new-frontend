import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaChevronDown, FaTrophy, FaCartPlus } from "react-icons/fa";
import axios from "../axiosConfig";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";


/* -------------------- IMAGE OPTIMIZATION -------------------- */
// Optimized image helper with quality and size parameters
const getOptimizedImageSrc = (img, width = 400, quality = 80) => {
  if (!img) return "/asset/images/dummy-image-square.jpg";

  // If it's a local/relative path, return as-is
  if (!img.startsWith("http")) {
    return img;
  }

  // For S3/external URLs, you could add image optimization parameters
  // This depends on your image service (Cloudinary, AWS ImageOptim, etc.)
  // Example for Cloudinary: return `${img}?w=${width}&q=${quality}`;

  return img;
};

const FilterSelect = ({ label, options, value, onChange, onFocus }) => {
  const hasValue = value !== undefined && value !== null && value !== "";
  return (
    <div className="relative mt-0 sm:mt-1 w-full min-w-0 lg:mt-2 lg:w-auto lg:inline-block lg:shrink-0">
      <select
        value={hasValue ? value : ""}
        onChange={onChange}
        onFocus={onFocus}
        aria-label={label}
        className={`
        appearance-none
        bg-gray-50 border-2 rounded-full
        text-gray-700 text-[12px] sm:text-sm
        pl-3 pr-7 sm:pl-4 sm:pr-9 py-2.5 sm:py-2
        cursor-pointer w-full min-w-0 min-h-[44px] sm:min-h-0
        lg:w-auto lg:min-w-[120px] lg:max-w-[170px]
        focus:outline-none focus:ring-2 focus:ring-[#941007]
        ${hasValue ? "border-[#941007]" : "border-gray-300"}
      `}
      >
        <option value="">{label}</option>
        {(Array.isArray(options) ? options : []).map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>

      <FaChevronDown
        className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"
      />
    </div>
  );
};

const SizeMeterDropdown = ({ value, onChange, onFocus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // Detached node check for React re-renders
        if (e.target.ownerDocument && !e.target.ownerDocument.body.contains(e.target)) return;
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative mt-0 sm:mt-1 w-full min-w-0 lg:mt-2 lg:w-auto lg:inline-block lg:shrink-0" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) onFocus();
        }}
        className={`
          appearance-none bg-gray-50 border-2 rounded-full text-left text-gray-700 text-[12px] sm:text-sm pl-3 pr-7 sm:pl-4 sm:pr-9 py-2.5 sm:py-2
          cursor-pointer w-full min-w-0 min-h-[44px] sm:min-h-0 lg:w-auto lg:min-w-[120px] lg:max-w-[170px]
          focus:outline-none focus:ring-2 focus:ring-[#941007] relative
          ${value ? "border-[#941007]" : "border-gray-300"}
        `}
      >
        <span className="truncate block pr-4">
          {value ? `Size: ${value}L` : "Size"}
        </span>
        <FaChevronDown
          className={`absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      
      {isOpen && (
        <div 
          className="absolute z-50 top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl p-4"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div className="w-full flex justify-between text-[11px] text-gray-500 mb-3 font-medium">
            <span>1L</span>
            <span>40L</span>
          </div>
          <input
            type="range"
            min="1"
            max="40"
            step="0.5"
            value={value || 1}
            onChange={(e) => onChange(e.target.value)}
            className="w-full cursor-pointer accent-[#941007]"
          />
          <div className="mt-4 text-[13px] font-bold text-gray-800 text-center">
            {value || 1} Litres
          </div>
          {parseFloat(value || 1) > 24 && (
            <div className="mt-4 text-[11px] leading-tight text-[#941007] text-center font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">
              Products for &gt;24L have not been added yet, stay tuned for more updates.
            </div>
          )}
          {value && (
            <button 
              type="button"
              onClick={() => onChange("")}
              className="mt-4 w-full text-center text-[11px] text-gray-500 hover:text-gray-800 underline transition-colors font-medium"
            >
              Clear Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};



const SmartCookerFinder = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]); // This will hold the filtered and transformed products
  const [loading, setLoading] = useState(true);
  const { addToWishlist, isInWishlist } = useWishlist();

  // Filter states
  const [filters, setFilters] = useState({
    sort: "",
    subcat_name: "",
    shape: "",
    material_name: "",
    net_quantity: "",
    bottom_type: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    subcat_name: [],
    shape: [],
    material_name: [],
    net_quantity: [],
    bottom_type: ["Induction compatible", "Non induction compatible"],
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(() =>
    typeof window !== "undefined" ? (window.innerWidth < 1024 ? 2 : 5) : 2
  );
  const [isLg, setIsLg] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
  );
  const [activeFilterKey, setActiveFilterKey] = useState(null);

  const filterDescriptions = {
    type: "Inner lids are compact and safe, outer lids are easier to open and often used in larger sizes.",
    shape: "Choose a shape that suits your cooking style—from traditional to compact.",
    material: "Each material has its benefits—choose based on durability, heat distribution, or preference.",
    size: "Select the right size based on your family size or recipe needs.",
    bottom: "Make sure your pressure cooker suits your cooktop.",
  };
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [mouseStartX, setMouseStartX] = useState(0);
  const [mouseEndX, setMouseEndX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const touchStartXRef = useRef(0);

  // Image loading optimization states
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  const minSwipeDistance = 20;
  const velocityThreshold = 0.3;
  const dragThreshold = 8;

  // Handle image load events
  const handleImageLoad = (imageId) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: true }));
  };

  const handleImageError = (imageId) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: 'error' }));
  };

  const handleTouchStart = (e) => {
    const x = e.touches[0].clientX;
    touchStartXRef.current = x;
    setTouchStartX(x);
    setTouchEndX(x);
    setTouchStartTime(Date.now());
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    const startX = touchStartXRef.current;
    const move = currentX - startX;
    if (!isSwiping) {
      if (Math.abs(move) > dragThreshold) setIsSwiping(true);
      else return;
    }
    e.preventDefault();
    setTouchEndX(currentX);
    setDragOffset(move);
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    const distance = touchStartX - touchEndX;
    const timeElapsed = Date.now() - touchStartTime;
    const velocity = timeElapsed > 0 ? Math.abs(distance) / timeElapsed : 0;
    const isLeftSwipe = distance > minSwipeDistance || (velocity > velocityThreshold && distance > 5);
    const isRightSwipe = distance < -minSwipeDistance || (velocity > velocityThreshold && distance < -5);
    if (isLeftSwipe) nextSlide();
    else if (isRightSwipe) prevSlide();
    setTouchStartX(0);
    setTouchEndX(0);
    setTouchStartTime(0);
    setIsSwiping(false);
    setDragOffset(0);
  };

  // Mouse handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setMouseStartX(e.clientX);
    setMouseEndX(e.clientX);
    setTouchStartTime(Date.now());
    setDragOffset(0);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    setMouseEndX(currentX);
    const offset = currentX - mouseStartX;
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const distance = mouseStartX - mouseEndX;
    const timeElapsed = Date.now() - touchStartTime;
    const velocity = Math.abs(distance) / timeElapsed;

    // Check velocity for fast swipes or distance for slower swipes
    const isLeftSwipe = distance > minSwipeDistance || (velocity > velocityThreshold && distance > 5);
    const isRightSwipe = distance < -minSwipeDistance || (velocity > velocityThreshold && distance < -5);

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    // Reset mouse positions and dragging state
    setMouseStartX(0);
    setMouseEndX(0);
    setIsDragging(false);
    setTouchStartTime(0);
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setMouseStartX(0);
      setMouseEndX(0);
      setTouchStartTime(0);
      setDragOffset(0);
    }
  };

  // Below lg: horizontal carousel, 2 cards per view; lg+: 5 vertical tiles
  React.useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(5);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsLg(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const { handleAddToCart, handleBuyNow } = useContext(CartContext);

  // Helper function to get product image from S3 presigned URL
  const getProductImage = (product) => {
    // Try different possible image field structures
    if (product?.image) {
      return product.image; // Direct S3 presigned URL
    }
    if (product?.images?.length > 0) {
      // If images is an array of objects with url
      if (product.images[0]?.url) {
        return product.images[0].url;
      }
      // If images is an array of strings
      if (typeof product.images[0] === 'string') {
        return product.images[0];
      }
    }
    // Try variant images
    if (product?.variants?.length > 0) {
      const variant = product.variants[0];
      if (variant?.image) {
        return variant.image;
      }
      if (variant?.images?.length > 0) {
        if (variant.images[0]?.url) {
          return variant.images[0].url;
        }
        if (typeof variant.images[0] === 'string') {
          return variant.images[0];
        }
      }
    }
    return "/asset/images/dummy-image-square.jpg";
  };

  // Helper function to get product price
  const getProductPrice = (product) => {
    // Try different possible price field structures
    if (product?.variants?.length > 0 && product.variants[0]?.price) {
      return Math.floor(product.variants[0].price);
    }
    if (product?.price) {
      return Math.floor(product.price);
    }
    if (product?.mrp) {
      return Math.floor(parseFloat(product.mrp));
    }
    if (product?.selling_price) {
      return Math.floor(product.selling_price);
    }
    return null;
  };

  // Helper function to get product old price (if available)
  const getProductOldPrice = (product) => {
    // Try different possible old price field structures
    if (product?.variants?.length > 0) {
      if (product.variants[0]?.original_price) {
        return Math.floor(product.variants[0].original_price);
      }
      if (product.variants[0]?.mrp) {
        return Math.floor(parseFloat(product.variants[0].mrp));
      }
    }
    if (product?.original_price) {
      return Math.floor(product.original_price);
    }
    if (product?.mrp && product?.price && parseFloat(product.mrp) > parseFloat(product.price)) {
      return Math.floor(parseFloat(product.mrp));
    }
    return null;
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Helper to extract products array from response
      const extractProducts = (response) => {
        if (Array.isArray(response.data)) {
          return response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        } else if (response.data?.products && Array.isArray(response.data.products)) {
          return response.data.products;
        }
        return [];
      };

      // Helper function to fetch all pages
      const fetchAllPages = async (search) => {
        let allProducts = [];
        let page = 1;
        let hasMorePages = true;

        while (hasMorePages) {
          try {
            const response = await axios.get("/api/products/view", {
              params: {
                search: search,
                per_page: 100,
                page: page,
              },
              withCredentials: true,
            });

            const products = extractProducts(response);

            if (products.length === 0) {
              hasMorePages = false;
            } else {
              allProducts = allProducts.concat(products);
              page++;
            }
          } catch (error) {
            console.error(`Error fetching page ${page} for search "${search}":`, error);
            hasMorePages = false;
          }
        }

        return allProducts;
      };

      // Fetch all pressure cooker products (all pages)
      const pressureCookerProducts = await fetchAllPages("pressure cooker");

      // Merge products and remove duplicates based on detail_id
      const allProductsMap = new Map();

      // Add pressure cooker products
      pressureCookerProducts.forEach(product => {
        const id = product.detail_id || product.id || product.product_id;
        if (id && !allProductsMap.has(id)) {
          allProductsMap.set(id, product);
        }
      });

      const productsData = Array.from(allProductsMap.values());

      console.log("Total products fetched:", productsData.length);
      console.log("Pressure cooker products:", pressureCookerProducts.length);

      setAllProducts(productsData);

      // Extract unique values for filters
      const uniqueValues = (arr, keys) => {
        const allValues = arr
          .flatMap(p => (Array.isArray(keys) ? keys.map(k => p[k]) : p[keys]))
          .filter(Boolean)
          .map(v => String(v).trim())
          .filter(v => v.length > 0);
        return [...new Set(allValues)].sort();
      };

      // Custom function to extract shape from product name
      const extractShapeFromProduct = (product) => {
        const productName = (product.product_name || product.name || '').toLowerCase();
        const shapeKeywords = ['plain', 'handi', 'c-tura', 'ctura', 'pan'];

        for (const keyword of shapeKeywords) {
          if (productName.includes(keyword)) {
            // Capitalize first letter and return
            if (keyword === 'ctura') return 'C-tura';
            return keyword.charAt(0).toUpperCase() + keyword.slice(1);
          }
        }
        return null;
      };

      // Extract unique shapes from product names
      const uniqueShapes = productsData
        .map(p => extractShapeFromProduct(p))
        .filter(Boolean)
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .sort();

      // Custom function to extract material from product
      const extractMaterialFromProduct = (product) => {
        const productName = (product.product_name || product.name || '').toLowerCase();
        const materialField = (product.material || product.material_name || product.series || '').toLowerCase();

        // Check for Hard Anodised in product name or material field
        if (productName.includes('hard anodised') || productName.includes('hard anodized') ||
          materialField.includes('hard anodised') || materialField.includes('hard anodized')) {
          return 'Hard Anodised';
        }

        // Check for Aluminium
        if (productName.includes('aluminium') || productName.includes('aluminum') ||
          materialField.includes('aluminium') || materialField.includes('aluminum')) {
          return 'Aluminium';
        }

        // Check for Stainless Steel
        if (productName.includes('stainless') || productName.includes('steel') ||
          materialField.includes('stainless') || materialField.includes('steel')) {
          return 'Stainless Steel';
        }

        // Return the material field value if it exists
        if (product.material_name) return product.material_name;
        if (product.material) return product.material;
        if (product.series) return product.series;

        return null;
      };

      // Extract unique materials
      const uniqueMaterials = productsData
        .map(p => extractMaterialFromProduct(p))
        .filter(Boolean)
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .sort();

      // Always include 'Hard Anodised' in the material options
      if (!uniqueMaterials.includes('Hard Anodised')) {
        uniqueMaterials.push('Hard Anodised');
        uniqueMaterials.sort();
      }

      setFilterOptions({
        subcat_name: ['Inner Lid', 'Outer Lid'], // Only show Inner Lid and Outer Lid options
        shape: uniqueShapes,
        material_name: uniqueMaterials,
        net_quantity: uniqueValues(productsData, ['size', 'net_quantity', 'capacity']),
        bottom_type: ['Induction compatible', 'Non induction compatible'],
      });

    } catch (error) {
      console.error("Error fetching products:", error);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Helper function to check if a product is an "inner lid" type
  const isInnerLidProduct = (product) => {
    const lidType = product.lid_type || product.subcat_name || product.type || product.series_name || '';
    const productName = product.name || product.product_name || product.title || '';

    const lidTypeStr = String(lidType).toLowerCase();
    const productNameStr = String(productName).toLowerCase();

    // Check if the product is an inner lid type (checking various fields)
    return lidTypeStr.includes('innerlid') ||
      lidTypeStr.includes('inner lid') ||
      lidTypeStr.includes('inner-lid') ||
      productNameStr.includes('innerlid') ||
      productNameStr.includes('inner lid') ||
      productNameStr.includes('inner-lid');
  };

  // Helper function to check if a product is an "outer lid" type
  const isOuterLidProduct = (product) => {
    const lidType = product.lid_type || product.subcat_name || product.type || product.series_name || '';
    const productName = product.name || product.product_name || product.title || '';

    const lidTypeStr = String(lidType).toLowerCase();
    const productNameStr = String(productName).toLowerCase();

    // Check if the product is an outer lid type (checking various fields)
    return lidTypeStr.includes('outerlid') ||
      lidTypeStr.includes('outer lid') ||
      lidTypeStr.includes('outer-lid') ||
      productNameStr.includes('outerlid') ||
      productNameStr.includes('outer lid') ||
      productNameStr.includes('outer-lid');
  };

  // Helper function to extract shape from product name
  const getProductShape = (product) => {
    const productName = (product.product_name || product.name || '').toLowerCase();
    const shapeKeywords = ['plain', 'handi', 'c-tura', 'ctura', 'pan'];

    for (const keyword of shapeKeywords) {
      if (productName.includes(keyword)) {
        // Capitalize first letter and return
        if (keyword === 'ctura') return 'C-tura';
        return keyword.charAt(0).toUpperCase() + keyword.slice(1);
      }
    }
    return null;
  };

  // Helper function to extract material from product
  const getProductMaterial = (product) => {
    const productName = (product.product_name || product.name || '').toLowerCase();
    const materialField = (product.material || product.material_name || product.series || '').toLowerCase();

    // Check for Hard Anodised in product name or material field
    if (productName.includes('hard anodised') || productName.includes('hard anodized') ||
      materialField.includes('hard anodised') || materialField.includes('hard anodized')) {
      return 'Hard Anodised';
    }

    // Check for Aluminium
    if (productName.includes('aluminium') || productName.includes('aluminum') ||
      materialField.includes('aluminium') || materialField.includes('aluminum')) {
      return 'Aluminium';
    }

    // Check for Stainless Steel
    if (productName.includes('stainless') || productName.includes('steel') ||
      materialField.includes('stainless') || materialField.includes('steel')) {
      return 'Stainless Steel';
    }

    // Return the material field value if it exists
    if (product.material_name) return product.material_name;
    if (product.material) return product.material;
    if (product.series) return product.series;

    return null;
  };

  // Update products when allProducts or filters change
  useEffect(() => {
    if (allProducts.length === 0) {
      setProducts([]);
      return;
    }

    // Helper: derive Induction compatible / Non induction compatible from product for bottom filter
    const getBottomInductionType = (p) => {
      const raw = (p.bottom_type || p.bottom || p.base_type || p.induction || p.induction_compatible || "").toString().toLowerCase();
      const name = (p.product_name || p.name || p.title || "").toString().toLowerCase();
      if (raw.includes("induction") || name.includes("induction")) return "Induction compatible";
      if (raw.includes("non") && raw.includes("induction")) return "Non induction compatible";
      if (raw.includes("gas") || name.includes("gas only") || raw === "non induction") return "Non induction compatible";
      return null;
    };

    let filtered = allProducts.filter(product => {
      const lidType = product.lid_type || product.subcat_name || product.type;
      const productMaterial = getProductMaterial(product); // Extract material from product
      const size = product.size || product.net_quantity || product.capacity;
      const productShape = getProductShape(product); // Extract shape from product name
      const bottom = product.bottom_type || product.bottom || product.base_type;
      const bottomInductionType = getBottomInductionType(product);

      // Handle "Inner Lid" and "Outer Lid" filter selections
      let matchesSubcat = true;
      if (filters.subcat_name) {
        if (filters.subcat_name === 'Inner Lid') {
          matchesSubcat = isInnerLidProduct(product);
        } else if (filters.subcat_name === 'Outer Lid') {
          matchesSubcat = isOuterLidProduct(product);
        } else {
          // Fallback to exact match for other values (if any)
          matchesSubcat = lidType && String(lidType).trim() === filters.subcat_name;
        }
      }

      const matchesMaterial = !filters.material_name || (productMaterial && productMaterial === filters.material_name);
      
      let matchesSize = true;
      if (filters.net_quantity) {
        const selectedSizeNum = parseFloat(filters.net_quantity);
        let productSizeNum = NaN;
        const pName = String(product.product_name || product.name || product.title || "").toLowerCase();
        if (pName) {
          const sizeMatch = pName.match(/([\d.]+)\s*(?:l|liters?|litres?)\b/i);
          if (sizeMatch) {
            productSizeNum = parseFloat(sizeMatch[1]);
          }
        }
        if (isNaN(productSizeNum)) {
          productSizeNum = parseFloat(size);
        }
        matchesSize = !isNaN(productSizeNum) && productSizeNum === selectedSizeNum;
      }

      const matchesShape = !filters.shape || (productShape && productShape === filters.shape);
      // Bottom filter: Induction compatible / Non induction compatible (or exact match for legacy bottom_type values)
      let matchesBottom = true;
      if (filters.bottom_type) {
        if (filters.bottom_type === "Induction compatible" || filters.bottom_type === "Non induction compatible") {
          // Match when product has same type, or when type is unknown (show in both)
          matchesBottom = bottomInductionType === filters.bottom_type || bottomInductionType === null;
        } else {
          matchesBottom = (bottom && String(bottom).trim() === filters.bottom_type);
        }
      }

      return matchesSubcat && matchesMaterial && matchesSize && matchesShape && matchesBottom;
    });

    // Handle Sorting
    if (filters.sort) {
      filtered.sort((a, b) => {
        const priceA = getProductPrice(a) || 0;
        const priceB = getProductPrice(b) || 0;

        if (filters.sort === "Price: Low to High") return priceA - priceB;
        if (filters.sort === "Price: High to Low") return priceB - priceA;
        if (filters.sort === "Popularity") {
          return (b.popularity || 0) - (a.popularity || 0);
        }
        if (filters.sort === "Newest") {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
        return 0;
      });
    }

    // Reorder products: 5 inner lid first, then outer lid products, then other products, then remaining inner lid
    const innerLidProducts = filtered.filter(product => isInnerLidProduct(product));
    const outerLidProducts = filtered.filter(product => isOuterLidProduct(product));
    const otherProducts = filtered.filter(product => !isInnerLidProduct(product) && !isOuterLidProduct(product));

    // Take first 5 inner lid products
    const firstFiveInnerLid = innerLidProducts.slice(0, 5);
    // Remaining inner lid products
    const remainingInnerLid = innerLidProducts.slice(5);

    // Reordered array: 5 inner lid + outer lid + other products + remaining inner lid
    const reorderedProducts = [...firstFiveInnerLid, ...outerLidProducts, ...otherProducts, ...remainingInnerLid];

    // Transform API response to match component structure
    const transformedProducts = reorderedProducts.map((product, index) => {
      const productId = product.id || product.product_id || product.product_variant_id || product.detail_id || `temp-id-${index}`;
      const productName = product.name || product.product_name || product.title || `Product ${index + 1}`;
      const variantId = product.variant_id || product.product_variant_id || (product.variants?.length > 0 ? product.variants[0].id : null) || productId;

      return {
        id: productId,
        variantId: variantId,
        title: productName,
        price: getProductPrice(product),
        oldPrice: getProductOldPrice(product),
        image: getProductImage(product),
        product: product,
      };
    });

    setProducts(transformedProducts);
    setCurrentIndex(0);
  }, [allProducts, filters]);

  // Handle filter changes
  const handleSortChange = (e) => {
    setFilters(prev => ({ ...prev, sort: e.target.value }));
  };

  const handleSubcatChange = (e) => {
    setFilters(prev => ({ ...prev, subcat_name: e.target.value }));
  };

  const handleMaterialChange = (e) => {
    setFilters(prev => ({ ...prev, material_name: e.target.value }));
  };

  const handleSizeChange = (e) => {
    setFilters(prev => ({ ...prev, net_quantity: e.target.value }));
  };

  const handleShapeChange = (e) => {
    setFilters(prev => ({ ...prev, shape: e.target.value }));
  };

  const handleBottomTypeChange = (e) => {
    setFilters(prev => ({ ...prev, bottom_type: e.target.value }));
  };

  // For backward compatibility or manual trigger
  const handleApplyFilters = () => {
    // Current logic automatically applies filters via useEffect
    // But we can trigger a re-fetch if we want to ensure latest data
    fetchProducts();
  };

  const handleResetFilters = () => {
    setActiveFilterKey(null);
    setFilters({
      sort: "",
      subcat_name: "",
      shape: "",
      material_name: "",
      net_quantity: "",
      bottom_type: "",
    });
  };

  const scrollContainerRef = useRef(null);

  React.useEffect(() => {
    setCurrentIndex(0);
    const el = scrollContainerRef.current;
    if (el) el.scrollLeft = 0;
  }, [itemsPerView]);

  const nextSlide = () => {
    const el = scrollContainerRef.current;
    if (!el || products.length <= itemsPerView) return;
    el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
  };

  const prevSlide = () => {
    const el = scrollContainerRef.current;
    if (!el || products.length <= itemsPerView) return;
    el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
  };

  const renderCookerCard = (item) => (
    <div className="group/card flex flex-col h-full min-h-0 items-stretch bg-white transition-shadow duration-300 hover:shadow-lg rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm">
      <div className="relative w-full shrink-0 aspect-square bg-[#FAFAFA] overflow-hidden border-b border-gray-100">
        <Link to={`/product-details/${item.id || item.sno || item.product_id || item.detail_id}`} className="block w-full h-full">
          <div className="w-full h-full relative flex items-center justify-center p-3 sm:p-4 lg:p-6">
            {!imageLoadingStates[item.id] && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
            <img
              src={getOptimizedImageSrc(item.image, 400, 80)}
              alt={item.title}
              className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover/card:scale-105 ${imageLoadingStates[item.id] ? "opacity-100" : "opacity-0"}`}
              loading="lazy"
              onLoad={() => handleImageLoad(item.id)}
              onError={(e) => {
                handleImageError(item.id);
                e.target.src = "/asset/images/dummy-image-square.jpg";
              }}
              style={{ transition: "opacity 0.3s ease-in-out" }}
            />
          </div>
        </Link>
        {/* Wishlist Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToWishlist(item.product || item);
          }}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform duration-300 hover:bg-white"
        >
          <FontAwesomeIcon
            icon={isInWishlist(item.id || item.product_id) ? solidHeart : regularHeart}
            className={isInWishlist(item.id || item.product_id) ? "text-red-600" : "text-gray-400"}
            style={{ fontSize: "14px" }}
          />
        </button>
      </div>

      <div className="font-gotham flex flex-col text-left min-w-0 justify-between p-3 sm:p-3.5 lg:p-4 flex-1 grow">
        <p className="font-bold font-gotham text-gray-900 text-xs sm:text-sm lg:text-[15px] leading-snug min-h-0 mb-2 uppercase tracking-tight line-clamp-2 lg:min-h-11 break-words">
          {item.title}
        </p>

        <div className="flex items-center gap-1 sm:gap-1.5 mb-2 text-[9px] sm:text-[11px] text-gray-500 flex-wrap">
          <span className="flex items-center gap-0.5 font-bold text-[#941007] uppercase tracking-wide shrink-0">
            <FaTrophy className="text-[#941007] shrink-0" size={10} />
            BESTSELLER
          </span>
          <span className="text-gray-300 select-none shrink-0" aria-hidden>
            |
          </span>
          <span className="truncate text-gray-500">1k+ bought</span>
        </div>

        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <div className="flex text-amber-500 text-[11px] sm:text-sm lg:text-base">
            {[...Array(5)].map((_, k) => (
              <span key={k}>★</span>
            ))}
          </div>
          <span className="text-[9px] sm:text-xs text-gray-500 pt-0.5">20 Reviews</span>
        </div>

        <div className="mt-auto border-t border-gray-100 flex flex-col pt-2 sm:pt-2.5 gap-2">
          <div className="flex justify-between items-baseline gap-1 min-w-0">
            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg lg:text-2xl font-black text-gray-900 truncate tracking-tight">
                  N/A
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-gray-500 leading-none" />
            </div>
            <div className="text-right shrink-0">
              <span className="block text-[10px] sm:text-[11px] font-semibold text-gray-800" />
            </div>
          </div>
          <div className="flex flex-row flex-wrap items-stretch gap-1 sm:gap-1.5 lg:gap-2">
            <button
              type="button"
              aria-label="Add to cart"
              onClick={(e) => {
                e.stopPropagation();
                if (item.variantId || item.id) {
                  handleAddToCart({
                    product_id: item.id,
                    id: item.id,
                    name: item.title,
                    title: item.title,
                    price: item.price,
                    image: item.image,
                    ...item,
                  });
                }
              }}
              className="flex-1 min-w-0 min-h-[40px] sm:min-h-[36px] lg:min-h-[36px] bg-white hover:bg-[#941007] text-[#941007] border border-[#941007] hover:text-white text-[9px] sm:text-[10px] lg:text-xs font-bold py-1.5 sm:py-2 lg:py-1.5 px-0 sm:px-2 rounded-full shadow-sm active:scale-95 transition-all text-center touch-manipulation select-none inline-flex items-center justify-center gap-0.5 sm:gap-1 leading-tight"
            >
              <FaCartPlus className="w-4 h-4 shrink-0 sm:w-2.5 sm:h-2.5" aria-hidden />
              <span className="hidden sm:inline text-center">Add to cart</span>
            </button>
            <button
              type="button"
              aria-label="Buy now"
              onClick={(e) => {
                e.stopPropagation();
                if (item.variantId || item.id) {
                  handleBuyNow({
                    product_id: item.id,
                    id: item.id,
                    name: item.title,
                    title: item.title,
                    price: item.price,
                    image: item.image,
                    ...item,
                  });
                }
              }}
              className="flex-1 min-w-0 min-h-[40px] sm:min-h-[36px] lg:min-h-[36px] bg-[#941007] text-white border border-[#941007] text-[9px] sm:text-[10px] lg:text-xs font-bold py-1 sm:py-2 lg:py-1.5 px-0.5 sm:px-2 rounded-full shadow-sm hover:shadow-red-200 active:scale-95 transition-all text-center touch-manipulation select-none inline-flex flex-col sm:flex-row items-center justify-center leading-[1.1] sm:leading-tight gap-0 sm:gap-0"
            >
              <span className="flex flex-col sm:hidden items-center justify-center font-bold">
                <span>Buy</span>
                <span>Now</span>
              </span>
              <span className="hidden sm:inline">Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="font-gotham w-full bg-white py-12 sm:py-16 lg:py-20 px-3 sm:px-6 lg:px-12 relative">
      <div className="max-w-[1400px] mx-auto w-full min-w-0">
        {/* ===== Heading (mobile-first — text only; filters stay fully available below) ===== */}
        <div className="text-center mb-10 sm:mb-14 md:mb-16 px-3 sm:px-4 max-w-5xl mx-auto">
          <span className="inline-block text-[#941007] text-[11px] sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 opacity-90 px-1">
            Peak Culinary Performance
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-black tracking-tight text-balance max-w-[min(100%,40rem)] mx-auto mb-3 sm:mb-0 leading-[1.12] sm:leading-tight px-1">
            Smart Cooker Finder
          </h2>
          <p className="text-[#636365] text-[13px] sm:text-base md:text-[18px] font-semibold max-w-md sm:max-w-2xl mx-auto px-2 sm:px-4 mb-2 sm:mb-0 leading-snug">
            Built for the Way You Cook
          </p>
          {activeFilterKey && filterDescriptions[activeFilterKey] && (
          <div className="text-center max-w-5xl mx-auto">
            <p className="text-gray-400 text-[12px] sm:text-[14px] md:text-[16px] max-w-3xl sm:max-w-4xl mx-auto leading-relaxed text-pretty">
              {filterDescriptions[activeFilterKey]}
            </p>
          </div>
        )}
        </div>

        {/* ===== Filter description (context when a filter is focused) ===== */}
        

        {/* ===== All filters: grid on mobile (always visible) · flex-wrap on large screens ===== */}
        <div className="w-full mb-6 sm:mb-8 min-w-0 relative z-20">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:flex lg:flex-wrap lg:justify-center lg:gap-3 w-full">
            <FilterSelect
              label="Sort By"
              options={["Popularity", "Newest", "Price: Low to High", "Price: High to Low"]}
              value={filters.sort}
              onChange={handleSortChange}
            />
            <FilterSelect
              label="Type"
              options={filterOptions.subcat_name}
              value={filters.subcat_name}
              onChange={(e) => { handleSubcatChange(e); setActiveFilterKey("type"); }}
              onFocus={() => setActiveFilterKey("type")}
            />
            <FilterSelect
              label="Shape"
              options={filterOptions.shape}
              value={filters.shape}
              onChange={(e) => { handleShapeChange(e); setActiveFilterKey("shape"); }}
              onFocus={() => setActiveFilterKey("shape")}
            />
            <FilterSelect
              label="Material"
              options={filterOptions.material_name}
              value={filters.material_name}
              onChange={(e) => { handleMaterialChange(e); setActiveFilterKey("material"); }}
              onFocus={() => setActiveFilterKey("material")}
            />
            <SizeMeterDropdown
              value={filters.net_quantity}
              onChange={(val) => setFilters(prev => ({ ...prev, net_quantity: val }))}
              onFocus={() => setActiveFilterKey("size")}
            />
            <FilterSelect
              label="Bottom"
              options={filterOptions.bottom_type}
              value={filters.bottom_type}
              onChange={(e) => { handleBottomTypeChange(e); setActiveFilterKey("bottom"); }}
              onFocus={() => setActiveFilterKey("bottom")}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 mt-4 sm:mt-6 relative z-20">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="min-h-[44px] bg-[#941007] text-white text-[13px] sm:text-sm px-8 sm:px-10 py-2.5 rounded-full whitespace-nowrap hover:bg-[#941007] transition touch-manipulation shadow-sm active:scale-95"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="min-h-[44px] text-[#941007] text-sm font-medium border-2 border-[#941007] px-8 sm:px-10 py-2 rounded-full hover:bg-[#941007] hover:text-white transition touch-manipulation active:scale-95"
          >
            Reset
          </button>
        </div>

        {/* ===== Products: carousel — vertical cards (image top, content below) all breakpoints ===== */}
        <div className="relative group w-full min-w-0 z-0 mt-10 pt-6 border-t border-gray-100">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">No products found</div>
          </div>
        ) : (
          <div className="relative w-full min-w-0">
            <div
              ref={scrollContainerRef}
              className="w-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory py-3 -mx-3 px-3 sm:-mx-2 sm:px-2 lg:-mx-4 lg:px-4 scrollbar-hide touch-pan-x"
              style={{
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              onScroll={() => {
                const el = scrollContainerRef.current;
                if (!el) return;
                const pageWidth = el.clientWidth;
                const idx = pageWidth > 0 ? Math.round(el.scrollLeft / pageWidth) : 0;
                const next = Math.min(Math.max(0, idx), Math.max(0, products.length - itemsPerView));
                setCurrentIndex((prev) => (prev === next ? prev : next));
              }}
            >
              <div
                className="flex flex-row flex-nowrap items-stretch gap-2 sm:gap-2.5 lg:gap-0 w-full"
              >
                {products.map((item, i) => {
                  const slideStyle = isLg
                    ? { flex: `0 0 ${100 / itemsPerView}%`, maxWidth: `${100 / itemsPerView}%` }
                    : {
                        flex: "0 0 auto",
                        width: "min(calc(50vw - 1.75rem), 12.5rem)",
                        maxWidth: "min(calc(50vw - 1.75rem), 12.5rem)",
                      };
                  return (
                    <div
                      key={item.id || `product-${i}`}
                      className="shrink-0 snap-start min-w-0 box-border first:pl-0 last:pr-0 lg:px-3"
                      style={slideStyle}
                    >
                      {renderCookerCard(item)}
                    </div>
                  );
                })}
              </div>
            </div>

            {products.length > itemsPerView && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  className="hidden lg:flex absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-xl border border-gray-100 items-center justify-center text-gray-700 hover:text-[#941007] hover:scale-110 transition-all duration-300"
                  aria-label="Previous"
                >
                  <FaChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="hidden lg:flex absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-xl border border-gray-100 items-center justify-center text-gray-700 hover:text-[#941007] hover:scale-110 transition-all duration-300"
                  aria-label="Next"
                >
                  <FaChevronRight size={18} />
                </button>
              </>
            )}
          </div>
        )}

        {/* Progress bar (all breakpoints when carousel) */}
        {!loading && products.length > 0 && (
          <div className="mt-5 sm:mt-6 lg:mt-8 px-1 sm:px-4 w-full max-w-none lg:max-w-md lg:mx-auto">
            <div className="relative h-2 lg:h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#941007] transition-all duration-300 ease-out rounded-full"
                style={{
                  width: `${Math.min(((currentIndex + itemsPerView) / products.length) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
      </div>
    </section>
  );
};

export default SmartCookerFinder;
