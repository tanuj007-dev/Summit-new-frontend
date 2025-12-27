import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "../axiosConfig";
import { CartContext } from "../context/CartContext";
import { FaChevronDown } from "react-icons/fa";

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
        text-gray-700
        text-[15px] sm:text-sm
        px-3 pr-7
        py-1.5
        rounded-full
        cursor-pointer
        w-auto
        min-w-[120px]
        max-w-[160px]
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [filters, setFilters] = useState({
    sort: "mrp",
    order: "asc",
    subcat_name: "",
    material_name: "",
    net_quantity: "",
    shape: "",
    bottom_type: "",
    per_page: 24,
    page: 1,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
 const [mouseStartX, setMouseStartX] = useState(0);
  const [mouseEndX, setMouseEndX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Image loading optimization states
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  
  const minSwipeDistance = 30; // Minimum distance for a swipe to be registered
  
  // Handle image load events
  const handleImageLoad = (imageId) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: true }));
  };
  
  const handleImageError = (imageId) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: 'error' }));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    // Reset touch positions
    setTouchStartX(0);
    setTouchEndX(0);
  };

  // Mouse handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setMouseStartX(e.clientX);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setMouseEndX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const distance = mouseStartX - mouseEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    // Reset mouse positions and dragging state
    setMouseStartX(0);
    setMouseEndX(0);
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setMouseStartX(0);
      setMouseEndX(0);
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
        setItemsPerView(4);
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
      
      // Build query parameters - only pressure cookers
      const params = {
        search: "pressure cooker",
        sort: filters.sort || "mrp",
        order: filters.order || "asc",
        per_page: filters.per_page || 24,
        page: filters.page || 1,
      };

      // Add optional filters only if they have values
      if (filters.subcat_name) {
        params.subcat_name = filters.subcat_name;
      }
      if (filters.material_name) {
        params.material_name = filters.material_name;
      }
      if (filters.net_quantity) {
        params.net_quantity = filters.net_quantity;
      }

      const response = await axios.get("https://api.summithomeappliance.com/api/products/view", {
        params: params,
        withCredentials: true, // REQUIRED for session cookie
      });
      
      console.log("SmartCookerFinder API Response:", response.data);
      
      // Handle different response structures
      let productsData = [];
      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        productsData = response.data.data;
      } else if (response.data?.products && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      }

      console.log("SmartCookerFinder Products Data:", productsData);

      // Transform API response to match component structure
      const transformedProducts = productsData.map((product, index) => {
        try {
          // Get product ID - try multiple possible fields
          const productId = product.id || 
                           product.product_id || 
                           product.product_variant_id || 
                           product.detail_id ||
                           `temp-id-${index}`;
          
          // Get product name - try multiple possible fields
          const productName = product.name || 
                             product.product_name || 
                             product.title || 
                             `Product ${index + 1}`;
          
          // Get variant ID for cart operations
          const variantId = product.variant_id || 
                          product.product_variant_id || 
                          (product.variants?.length > 0 ? product.variants[0].id : null) ||
                          productId;

          const imageUrl = getProductImage(product);
          const price = getProductPrice(product);
          const oldPrice = getProductOldPrice(product);

          return {
            id: productId,
            variantId: variantId,
            title: productName,
            price: price,
            oldPrice: oldPrice,
            image: imageUrl,
            product: product, // Keep original product data for reference
          };
        } catch (error) {
          console.error(`Error transforming product at index ${index}:`, error, product);
          // Return a fallback product object
          return {
            id: `error-${index}`,
            variantId: null,
            title: `Product ${index + 1}`,
            price: null,
            oldPrice: null,
            image: "/asset/images/dummy-image-square.jpg",
            product: product,
          };
        }
      });

      setProducts(transformedProducts);
      setCurrentIndex(0); // Reset slider to start
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch on mount, Apply button will trigger refetch

  // Handle filter changes
  const handleSortChange = (e) => {
    const value = e.target.value;
    if (!value || value === "") {
      // Reset to default
      setFilters({ ...filters, sort: "mrp", order: "asc" });
    } else if (value === "Price: Low to High") {
      setFilters({ ...filters, sort: "mrp", order: "asc" });
    } else if (value === "Price: High to Low") {
      setFilters({ ...filters, sort: "mrp", order: "desc" });
    } else if (value === "Popularity") {
      setFilters({ ...filters, sort: "popularity", order: "desc" });
    } else if (value === "Newest") {
      setFilters({ ...filters, sort: "created_at", order: "desc" });
    }
  };

  const handleSubcatChange = (e) => {
    const value = e.target.value;
    setFilters({ ...filters, subcat_name: value || "" });
  };

  const handleMaterialChange = (e) => {
    const value = e.target.value;
    // For multiple materials, join with comma
    setFilters({ ...filters, material_name: value || "" });
  };

  const handleSizeChange = (e) => {
    const value = e.target.value;
    // Convert size to net_quantity format (e.g., "5L" -> "5L")
    setFilters({ ...filters, net_quantity: value || "" });
  };

  const handleShapeChange = (e) => {
    const value = e.target.value;
    setFilters({ ...filters, shape: value || "" });
  };

  const handleBottomTypeChange = (e) => {
    const value = e.target.value;
    // Map UI values to API values
    let bottomType = "";
    if (value === "Induction") {
      bottomType = "Induction";
    } else if (value === "Gas") {
      bottomType = "Gas";
    } else if (value === "Both") {
      bottomType = "Both";
    }
    setFilters({ ...filters, bottom_type: bottomType });
  };

  // Apply filters - refetch with current filter state
  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      
      // Build query parameters using current filters state - only pressure cookers
      const params = {
        search: "pressure cooker",
        sort: filters.sort || "mrp",
        order: filters.order || "asc",
        per_page: filters.per_page || 24,
        page: filters.page || 1,
      };

      // Add optional filters only if they have values
      if (filters.subcat_name) {
        params.subcat_name = filters.subcat_name;
      }
      if (filters.material_name) {
        params.material_name = filters.material_name;
      }
      if (filters.net_quantity) {
        params.net_quantity = filters.net_quantity;
      }
      if (filters.shape) {
        params.shape = filters.shape;
      }
      if (filters.bottom_type) {
        params.bottom_type = filters.bottom_type;
      }

      const response = await axios.get("https://api.summithomeappliance.com/api/products/view", {
        params: params,
        withCredentials: true,
      });
      
      // Handle response and transform products (same logic as fetchProducts)
      let productsData = [];
      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        productsData = response.data.data;
      } else if (response.data?.products && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      }

      const transformedProducts = productsData.map((product, index) => {
        try {
          const productId = product.id || 
                           product.product_id || 
                           product.product_variant_id || 
                           product.detail_id ||
                           `temp-id-${index}`;
          
          const productName = product.name || 
                             product.product_name || 
                             product.title || 
                             `Product ${index + 1}`;
          
          const variantId = product.variant_id || 
                          product.product_variant_id || 
                          (product.variants?.length > 0 ? product.variants[0].id : null) ||
                          productId;

          return {
            id: productId,
            variantId: variantId,
            title: productName,
            price: getProductPrice(product),
            oldPrice: getProductOldPrice(product),
            image: getProductImage(product),
            product: product,
          };
        } catch (error) {
          console.error(`Error transforming product at index ${index}:`, error, product);
          return {
            id: `error-${index}`,
            variantId: null,
            title: `Product ${index + 1}`,
            price: null,
            oldPrice: null,
            image: "/asset/images/dummy-image-square.jpg",
            product: product,
          };
        }
      });

      setProducts(transformedProducts);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    const defaultFilters = {
      sort: "mrp",
      order: "asc",
      subcat_name: "",
      material_name: "",
      net_quantity: "",
      shape: "",
      bottom_type: "",
      per_page: 24,
      page: 1,
    };
    setFilters(defaultFilters);
    
    // Fetch with default filters
    setTimeout(async () => {
      try {
        setLoading(true);
        const params = {
          search: "pressure cooker",
          sort: defaultFilters.sort,
          order: defaultFilters.order,
          per_page: defaultFilters.per_page,
          page: defaultFilters.page,
        };

        const response = await axios.get("https://api.summithomeappliance.com/api/products/view", {
          params: params,
          withCredentials: true,
        });
        
        let productsData = [];
        if (Array.isArray(response.data)) {
          productsData = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          productsData = response.data.data;
        } else if (response.data?.products && Array.isArray(response.data.products)) {
          productsData = response.data.products;
        }

        const transformedProducts = productsData.map((product, index) => {
          try {
            const productId = product.id || 
                             product.product_id || 
                             product.product_variant_id || 
                             product.detail_id ||
                             `temp-id-${index}`;
            
            const productName = product.name || 
                               product.product_name || 
                               product.title || 
                               `Product ${index + 1}`;
            
            const variantId = product.variant_id || 
                            product.product_variant_id || 
                            (product.variants?.length > 0 ? product.variants[0].id : null) ||
                            productId;

            return {
              id: productId,
              variantId: variantId,
              title: productName,
              price: getProductPrice(product),
              oldPrice: getProductOldPrice(product),
              image: getProductImage(product),
              product: product,
            };
          } catch (error) {
            return {
              id: `error-${index}`,
              variantId: null,
              title: `Product ${index + 1}`,
              price: null,
              oldPrice: null,
              image: "/asset/images/dummy-image-square.jpg",
              product: product,
            };
          }
        });

        setProducts(transformedProducts);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 100);
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
    <section className="w-full bg-white py-8 sm:py-8 px-2 sm:px- lg:px-8 relative">

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
      <div className="flex flex-col  sm:flex-row  items-start sm:items-center gap-4 mt-4 justify-center mb-6 sm:mb-8">
        <div className="w-full sm:w-auto  overflow-x-auto scrollbar-hide pb-2">
          <div className="flex flex-wrap  gap-3 sm:gap-4 min-w-max px-1">
            <FilterSelect 
              label="Sort by: Price" 
              options={["Popularity", "Newest", "Price: Low to High", "Price: High to Low"]}
              onChange={handleSortChange}
            />
            <FilterSelect 
              label="Type: Inner Lid" 
              options={["Inner Lid", "Outer Lid", "Both"]}
              value={filters.subcat_name}
              onChange={handleSubcatChange}
            />
            <FilterSelect 
              label="Material" 
              options={["Aluminium", "Steel", "Stainless", "Plastic", "Copper", "Brass"]}
              value={filters.material_name}
              onChange={handleMaterialChange}
            />
            <FilterSelect 
              label="Size" 
              options={["3L", "5L", "7L", "10L", "500ml", "1L"]}
              value={filters.net_quantity}
              onChange={handleSizeChange}
            />
            <FilterSelect 
              label="Shape: All" 
              options={["Handi", "Regular", "Round", "Square"]}
              value={filters.shape}
              onChange={handleShapeChange}
            />
            <FilterSelect 
              label="Bottom: All" 
              options={["Induction", "Gas", "Both"]}
              value={filters.bottom_type}
              onChange={handleBottomTypeChange}
            />
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-3 flex-shrink-0 w-full items-center justify-end sm:w-auto">
          <button 
            onClick={handleApplyFilters}
            className="bg-[#B91508] text-white text-sm sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg whitespace-nowrap hover:bg-red-700 transition"
          >
            Apply
          </button>
          <button 
            onClick={handleResetFilters}
            className="text-[#B91508] text-sm sm:text-sm font-medium hover:underline whitespace-nowrap border-1 border-[#B91508] px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-[#B91508] hover:text-white transition"
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
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)` }}
            >
              {products.map((item, i) => {
                const variantId = item.variantId || item.id;
                
                return (
                  <div
                    key={item.id || `product-${i}`}
                    className={`flex-shrink-0 px-2 flex flex-col items-center ${
                      itemsPerView === 2 ? 'w-1/2' : itemsPerView === 3 ? 'w-1/3' : 'w-1/5'
                    }`}
                  >
                    <div className="flex flex-col items-center w-full max-w-[180px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px]">
                      {/* Image */}
                      <div className="relative w-full overflow-hidden rounded-2xl shadow-md mb-2 sm:mb-3">
                        <Link to={`/product-details/${item.id}`}>
                          <div className="relative">
                            {!imageLoadingStates[item.id] && (
                              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl" />
                            )}
                            <img
                              src={getOptimizedImageSrc(item.image, 400, 80)}
                              alt={item.title}
                              className="w-full h-[190px] sm:h-[160px] md:h-[200px] lg:h-[300px] object-cover rounded-2xl transition-all duration-300 hover:scale-110"
                              loading="lazy"
                              onLoad={() => handleImageLoad(item.id)}
                              onError={(e) => {
                                handleImageError(item.id);
                                e.target.src = "/asset/images/dummy-image-square.jpg";
                              }}
                              style={{ 
                                opacity: imageLoadingStates[item.id] ? 1 : 0,
                                transition: 'opacity 0.3s ease-in-out'
                              }}
                            />
                          </div>
                        </Link>
                        {item.oldPrice && item.price && item.oldPrice > item.price && (
                          <span className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-0 bg-[#B91508] text-white text-[8px] sm:text-sm px-2 sm:px-3 py-1 rounded">
                            Sale
                          </span>
                        )}
                      </div>

                      {/* Text */}
                      <div className="text-center mt-2 sm:mt-3 md:mt-4">
                        <h3 className="text-[18px] sm:text-sm md:text-base lg:text-xl font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-[14px] sm:text-xs md:text-sm text-gray-400 mb-2 sm:mb-3">
                          {item.price ? (
                            <>
                              from <span className="font-semibold text-black">Rs. {item.price}</span>{" "}
                              {item.oldPrice && item.oldPrice > item.price && (
                                <span className="text-gray-400 line-through ml-1">Rs. {item.oldPrice}</span>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-500">Price not available</span>
                          )}
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-1 sm:gap-3 justify-center ">
                        <button
                          onClick={() => variantId && handleAddToCart({
                            product_id: item.id,
                            id: item.id,
                            name: item.title,
                            title: item.title,
                            price: item.price,
                            image: item.image,
                            ...item
                          })}
                          disabled={!variantId}
                          className="bg-[#B91508] text-white text-nowrap text-[13px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => variantId && handleBuyNow({
                            product_id: item.id,
                            id: item.id,
                            name: item.title,
                            title: item.title,
                            price: item.price,
                            image: item.image,
                            ...item
                          })}
                          disabled={!variantId}
                          className="text-[#B91508] text-[13px] sm:text-sm text-nowrap border-1 border-[#B91508] px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-[#B91508] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

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
