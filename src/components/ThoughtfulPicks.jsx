import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
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

const ThoughtfulPicks = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = [
    { label: "Under ₹999", value: 999 },
    { label: "Under ₹1499", value: 1499 },
    { label: "Under ₹1999", value: 1999 },
    { label: "Under ₹2999", value: 2999 },
  ];

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeFilter, setActiveFilter] = useState("Under ₹2999");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [mouseStartX, setMouseStartX] = useState(0);
  const [mouseEndX, setMouseEndX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Image loading optimization states
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  const minSwipeDistance = 30; // Reduced minimum distance for faster swipe detection
  
  // Handle image load events
  const handleImageLoad = (imageId) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: true }));
  };
  
  const handleImageError = (imageId) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: 'error' }));
  };

  // Touch handlers
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
    // return "/asset/images/dummy-image-square.jpg";
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
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://mediumblue-finch-130496.hostingersite.com/api/products/view", {
          params: { search: "all" },
          withCredentials: true, // REQUIRED for session cookie
        });
        
        console.log("ThoughtfulPicks API Response:", response.data);
        
        // Handle different response structures
        let productsData = [];
        if (Array.isArray(response.data)) {
          productsData = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          productsData = response.data.data;
        } else if (response.data?.products && Array.isArray(response.data.products)) {
          productsData = response.data.products;
        }

        console.log("ThoughtfulPicks Products Data:", productsData);
        console.log("ThoughtfulPicks First Product Sample:", productsData[0]);

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
        // Initialize filtered products with all products
        setFilteredProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* 🔹 Responsive slides */
  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(2);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(5);
      }
    };

    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  /* 🔹 Filter logic */
  const handleFilterClick = (value, label) => {
    setActiveFilter(label);
    const filtered = products.filter(p => p.price !== null && p.price <= value);
    setFilteredProducts(filtered);
    setCurrentIndex(0);
  };

  /* 🔹 Slider logic */
  const nextSlide = () => {
    if (filteredProducts.length <= slidesToShow) return;
    if (currentIndex < filteredProducts.length - slidesToShow) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (filteredProducts.length <= slidesToShow) return;
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(Math.max(0, filteredProducts.length - slidesToShow));
    }
  };

  
  return (
    <section className="w-full bg-white py-6 px-2 sm:px-6 relative">

      {/* ===== Heading ===== */}
      <div className="text-center mb-2 sm:mb-6">
        <h2 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
          Thoughtful Picks by Price
        </h2>
        <p className="text-[#636365] text-sm sm:text-base md:text-lg mb-4 font-semibold mt-1">
          Gifting Made Simple, Shopping Made Smarter
        </p>
      </div>

      {/* ===== Filters ===== */}
      <div className="overflow-x-auto scrollbar-hide pb-2 mb-3 sm:mb-6">
        <div className="flex gap-1 justify-center sm:gap-3 min-w-max px-1">
          {filters.map(filter => (
            <button
              key={filter.value}
              onClick={() => handleFilterClick(filter.value, filter.label)}
              className={`rounded-full justify-center px-3 sm:px-4 md:px-5 py-1.5 text-sm sm:text-base md:text-lg transition-all whitespace-nowrap flex-shrink-0
                ${
                  activeFilter === filter.label
                    ? "bg-[#B91508] text-white shadow-md scale-105"
                    : "bg-[#E9E9EB] text-[#545455]"
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      

      {/* ===== Slider ===== */}
      <div className="relative flex flex-col mt-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading products...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
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
              style={{
                transform: `translateX(-${(currentIndex * 100) / slidesToShow}%)`,
              }}
            >
              {filteredProducts.map((item, i) => {
                const variantId = item.variantId || item.id;
                
                return (
                  <div
                    key={item.id || `product-${i}`}
                    className={`flex-shrink-0 px-2 ${
                      slidesToShow === 1
                        ? "w-full"
                        : slidesToShow === 2
                        ? "w-1/2"
                        : "w-1/5"
                    }`}
                  >
                    <div className="max-w-[280px] mx-auto text-center">

                      {/* Image */}
                      <div className="relative rounded-2xl overflow-hidden shadow-md">
                        <Link to={`/product-details/${item.id}`}>
                          <div className="relative">
                            {!imageLoadingStates[item.id] && (
                              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl" />
                            )}
                            <img
                              src={getOptimizedImageSrc(item.image, 400, 80)}
                              alt={item.title}
                              className="w-full h-[190px] sm:h-[200px] md:h-[260px] lg:h-[300px] object-cover rounded-2xl transition-all duration-300 hover:scale-110"
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
                          <span className="absolute bottom-8 sm:bottom-10 left-0 bg-[#B91508] text-white text-[10px] sm:text-sm px-2 sm:px-3 py-1 rounded">
                            Sale
                          </span>
                        )}
                      </div>

                      {/* Text */}
                      <div className="text-center mt-3 sm:mt-4">
                        <h3 className="text-[18px] sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-[14px] sm:text-sm text-gray-400 mb-2 sm:mb-3">
                          {item.price ? (
                            <>
                              from{" "}
                              <span className="font-semibold text-black">
                                Rs. {item.price}
                              </span>
                              {item.oldPrice && item.oldPrice > item.price && (
                                <span className="text-gray-400 line-through ml-1">
                                  Rs. {item.oldPrice}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-500">Price not available</span>
                          )}
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-1 sm:gap-3 justify-center mt-auto">
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
      {!loading && filteredProducts.length > 0 && (
        <div className="mt-6 px-8">
          <div className="relative">
            {/* Progress Track */}
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              {/* Progress Fill */}
              <div 
                className="h-full bg-gray-400 transition-all duration-200 ease-out rounded-full"
                style={{
                  width: `${Math.min(((currentIndex + slidesToShow) / filteredProducts.length) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ThoughtfulPicks;
