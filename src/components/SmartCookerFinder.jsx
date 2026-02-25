import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaChevronDown, FaTrophy } from "react-icons/fa";
import axios from "../axiosConfig";
import { CartContext } from "../context/CartContext";


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

const FilterSelect = ({ label, options, value, onChange, defaultValue }) => (
  <div className="relative  mt-2 inline-block">
    <select
      value={value !== undefined && value !== null && value !== "" ? value : ""}
      onChange={onChange}
      className="
        appearance-none
        bg-gray-50 border-2 border-gray-300
        text-gray-700 text-[13px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded-full
        cursor-pointer
        w-auto
        min-w-[90px] sm:min-w-[120px]
        max-w-[90px] sm:max-w-[150px]
        focus:outline-none
        focus:ring-2 focus:ring-[#B91508]
      "
    >
      <option value="">{label}</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>{opt}</option>
      ))}
    </select>

    <FaChevronDown
      className="
        absolute right-5 top-1/2 -translate-y-1/2
        text-gray-400 text-[10px]
        pointer-events-none
      "
    />
  </div>
);



const SmartCookerFinder = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]); // This will hold the filtered and transformed products
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    sort: "",
    subcat_name: "",
    shape: "",
    material_name: "",
    net_quantity: "",
    // bottom_type: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    subcat_name: [],
    shape: [],
    material_name: [],
    net_quantity: [],
    // bottom_type: [],
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [mouseStartX, setMouseStartX] = useState(0);
  const [mouseEndX, setMouseEndX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [touchStartTime, setTouchStartTime] = useState(0);

  // Image loading optimization states
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  const minSwipeDistance = 20; // Reduced for easier swiping
  const velocityThreshold = 0.3; // pixels per millisecond

  // Handle image load events
  const handleImageLoad = (imageId) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: true }));
  };

  const handleImageError = (imageId) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: 'error' }));
  };

  const handleTouchStart = (e) => {
    const clientX = e.touches[0].clientX;
    setTouchStartX(clientX);
    setTouchEndX(clientX);
    setTouchStartTime(Date.now());
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    setTouchEndX(currentX);
    const offset = (currentX - touchStartX) * 1.2; // 1.2x multiplier for more sensitive drag
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    const distance = touchStartX - touchEndX;
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

    // Reset touch positions
    setTouchStartX(0);
    setTouchEndX(0);
    setTouchStartTime(0);
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

  // Update items per view based on screen size
  React.useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2);
      } else if (window.innerWidth < 768) {
        setItemsPerView(3);
      } else {
        setItemsPerView(5);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
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
        // bottom_type: uniqueValues(productsData, ['bottom_type', 'bottom', 'base_type']),
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

    let filtered = allProducts.filter(product => {
      const lidType = product.lid_type || product.subcat_name || product.type;
      const productMaterial = getProductMaterial(product); // Extract material from product
      const size = product.size || product.net_quantity || product.capacity;
      const productShape = getProductShape(product); // Extract shape from product name
      const bottom = product.bottom_type || product.bottom || product.base_type;

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
      const matchesSize = !filters.net_quantity || (size && String(size).trim() === filters.net_quantity);
      const matchesShape = !filters.shape || (productShape && productShape === filters.shape);
      const matchesBottom = !filters.bottom_type || (bottom && String(bottom).trim() === filters.bottom_type);

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
    setFilters({
      sort: "",
      subcat_name: "",
      shape: "",
      material_name: "",
      net_quantity: "",
      bottom_type: "",
    });
  };

  const nextSlide = () => {
    if (products.length <= itemsPerView) return;
    if (currentIndex < products.length - itemsPerView) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (products.length <= itemsPerView) return;
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(Math.max(0, products.length - itemsPerView));
    }
  };

  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-12 relative">

      {/* Heading */}
      <div className="text-center mb-1 sm:mb-8">
        <h2 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-semibold text-black">
          Smart Cooker Finder
        </h2>
        <p className="text-[#636365] text-sm sm:text-base md:text-lg font-semibold mt-1">
          Built for the Way You Cook
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col  sm:flex-row  items-start sm:items-center gap-1 mt-4 justify-center mb-6 sm:mb-8">
        <div className="w-full sm:w-auto   overflow-x-auto scrollbar-hide pb-2">
          <div className="flex flex-wrap  gap-3 sm:gap-4 min-w-max px-1">
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
              onChange={handleSubcatChange}
            />
            <FilterSelect
              label="Shape"
              options={filterOptions.shape}
              value={filters.shape}
              onChange={handleShapeChange}
            />
            <FilterSelect
              label="Material"
              options={filterOptions.material_name}
              value={filters.material_name}
              onChange={handleMaterialChange}
            />
            <FilterSelect
              label="Size"
              options={filterOptions.net_quantity}
              value={filters.net_quantity}
              onChange={handleSizeChange}
            />
            {/* <FilterSelect
              label="Bottom"
              options={filterOptions.bottom_type}
              value={filters.bottom_type}
              onChange={handleBottomTypeChange}
            /> */}
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 flex-shrink-0 w-full items-center justify-end sm:w-auto">
          <button
            onClick={handleApplyFilters}
            className="bg-[#B91508] text-white  text-[13px] sm:text-sm px-4 sm:px-4 py-1 sm:py-2 rounded-full whitespace-nowrap hover:bg-red-700 transition"
          >
            Apply
          </button>
          <button
            onClick={handleResetFilters}
            className="text-[#B91508] text-sm sm:text-sm font-medium hover:underline whitespace-nowrap border-1 border-[#B91508] px-4 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-[#B91508] hover:text-white transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="relative flex flex-col">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">No products found</div>
          </div>
        ) : (
          <div
            className="w-full overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'pan-y pinch-zoom',
              userSelect: 'none'
            }}
          >
            <div
              className="flex"
              style={{
                transform: `translateX(calc(-${(currentIndex * 100) / itemsPerView}% + ${dragOffset}px))`,
                transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)',
                willChange: 'transform'
              }}
            >
              {products.map((item, i) => {
                const variantId = item.variantId || item.id;

                return (
                  <div
                    key={item.id || `product-${i}`}
                    className={`flex-shrink-0 px-3 ${itemsPerView === 2 ? "w-1/2" :
                      itemsPerView === 3 ? "w-1/3" : "w-1/5"
                      }`}
                  >
                    {/* "AMAZON/QUICK COMMERCE" STYLE CARD */}
                    <div className="group/card flex flex-col h-full bg-white transition-transform duration-300 hover:shadow-lg rounded-lg overflow-hidden border border-transparent hover:border-gray-200">

                      {/* IMAGE SECTION */}
                      <div className="relative aspect-square w-full bg-[#FAFAFA] overflow-hidden">
                        <Link to={`/product-details/${item.id}`} className="block w-full h-full">
                          <div className="w-full h-full relative p-4 flex items-center justify-center">
                            {!imageLoadingStates[item.id] && (
                              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                            )}
                            <img
                              src={getOptimizedImageSrc(item.image, 400, 80)}
                              alt={item.title}
                              className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover/card:scale-105 ${imageLoadingStates[item.id] ? 'opacity-100' : 'opacity-0'}`}
                              loading="lazy"
                              onLoad={() => handleImageLoad(item.id)}
                              onError={(e) => {
                                handleImageError(item.id);
                                e.target.src = "/asset/images/dummy-image-square.jpg";
                              }}
                              style={{
                                transition: 'opacity 0.3s ease-in-out'
                              }}
                            />
                          </div>
                        </Link>
                      </div>

                      {/* CONTENT SECTION */}
                      <div className="p-3 flex flex-col flex-grow text-left">

                        {/* Title */}
                        <h3 className="font-bold text-gray-900 text-[15px] leading-snug line-clamp-2 min-h-[2.5rem] mb-1">
                          {item.title
                            ?.toLowerCase()
                            .replace(/^\w/, (c) => c.toUpperCase())}
                        </h3>

                        {/* Bestseller / Stats Badge (Mock Data) */}
                        <div className="flex items-center gap-1.5 mb-1.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-bold text-[#B91508]">
                            <FaTrophy className="text-[#B91508]" /> BESTSELLER
                          </span>
                          <span className="w-0.5 h-3 bg-gray-300"></span>
                          <span className="truncate">1k+ bought last month</span>
                        </div>

                        {/* Reviews */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-amber-500 text-sm">
                            {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                          </div>
                          <span className="text-xs text-gray-500 pt-0.5">20 Reviews</span>
                        </div>

                        {/* Price & Actions Section: STACKED for Responsive */}
                        <div className="mt-auto pt-2 border-t border-gray-50 flex flex-col gap-2">

                          {/* Row 1: Prices & EMI Text */}
                          <div className="flex justify-between items-baseline">
                            <div className="flex flex-col">
                              <div className="flex items-baseline gap-1">
                                <span className="text-base sm:text-lg font-black text-gray-900">
                                  ₹{item.price?.toLocaleString()}
                                </span>
                                {item.oldPrice && item.oldPrice > item.price && (
                                  <span className="text-[10px] sm:text-xs text-gray-400 line-through decoration-gray-400">
                                    ₹{item.oldPrice?.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] sm:text-[10px] text-gray-500 leading-none">(incl. taxes)</span>
                            </div>

                            <div className="text-right">
                              <span className="block text-[10px] sm:text-[11px] font-semibold text-gray-800">
                                or ₹{Math.round((item.price || 999) / 4)}/mo
                              </span>
                            </div>
                          </div>

                          {/* Row 2: Buttons (Side by Side) */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const variantId = item.variantId || item.id;
                                if (variantId) {
                                  handleAddToCart({
                                    product_id: item.id,
                                    id: item.id,
                                    name: item.title,
                                    title: item.title,
                                    price: item.price,
                                    image: item.image,
                                    ...item
                                  });
                                }
                              }}
                              className="flex-1 bg-white hover:bg-[#B91508] text-[#B91508] border border-[#B91508] hover:text-white text-[10px] sm:text-xs font-bold py-1.5 rounded-md shadow-sm active:scale-95 transition-all text-center"
                            >
                              Add +
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const variantId = item.variantId || item.id;
                                if (variantId) {
                                  handleBuyNow({
                                    product_id: item.id,
                                    id: item.id,
                                    name: item.title,
                                    title: item.title,
                                    price: item.price,
                                    image: item.image,
                                    ...item
                                  });
                                }
                              }}
                              className="flex-1 bg-[#B91508] text-white border border-[#B91508] text-[10px] sm:text-xs font-bold py-1.5 rounded-md shadow-sm hover:shadow-red-200 active:scale-95 transition-all text-center truncate px-1"
                            >
                              Buy on EMI
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Navigation Buttons - Desktop Only */}
      {!loading && products.length > itemsPerView && (
        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2  mt-18  left-0 right-0 px-2 justify-between pointer-events-none" style={{ top: "50%", transform: "translateY(-50%)" }}>
          <button
            onClick={prevSlide}
            className="bg-gray-100 hover:bg-gray-100 text-[#B91508] p-2 sm:p-3 rounded-full shadow-lg transition pointer-events-auto"
            aria-label="Previous"
          >
            <FaChevronLeft className="text-lg sm:text-xl" />
          </button>
          <button
            onClick={nextSlide}
            className="bg-gray-100 hover:bg-gray-100 text-[#B91508] p-2 sm:p-3 rounded-full shadow-lg transition pointer-events-auto"
            aria-label="Next"
          >
            <FaChevronRight className="text-lg sm:text-xl" />
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {!loading && products.length > 0 && (
        <div className="mt-6 px-8">
          <div className="relative">
            {/* Progress Track */}
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              {/* Progress Fill */}
              <div
                className="h-full bg-gray-400 transition-all duration-200 ease-out rounded-full"
                style={{
                  width: `${Math.min(((currentIndex + itemsPerView) / products.length) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SmartCookerFinder;
