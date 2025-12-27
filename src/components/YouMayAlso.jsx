import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import axios from "axios";

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

const YouMayAlso = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
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

  const categories = [
    "all",
    "combos",
    "cookware",
    "pressure cooker",
    "steam cookware",
    "gas stove",
    "gas tandoor",
    "mixer grinder",
  ];

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
  useEffect(() => {
    const fetchProducts = async () => {
      try { setLoading(true);
        const response = await axios.get("https://mediumblue-finch-130496.hostingersite.com/api/products/view", {
          params: { search: "all" },
          withCredentials: true, // REQUIRED for session cookie
        });

        console.log("API Response:", response.data);

        // Handle different response structures
        let productsData = [];
        if (Array.isArray(response.data)) {
          productsData = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          productsData = response.data.data;
        } else if (response.data?.products && Array.isArray(response.data.products)) {
          productsData = response.data.products;
        }

        console.log("Products Data:", productsData);
        console.log("Products Count:", productsData.length);
        if (productsData.length > 0) {
          console.log("First Product Sample:", productsData[0]);
          console.log("Product Keys:", Object.keys(productsData[0]));
        }

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

            // Get category - try multiple possible fields
            const productCategory = (product.category?.toLowerCase() ||
              product.main_category?.toLowerCase() ||
              product.master_category?.toLowerCase() ||
              product.category_id?.toLowerCase() ||
              "all").trim();

            // Get variant ID for cart operations
            const variantId = product.variant_id ||
              product.product_variant_id ||
              (product.variants?.length > 0 ? product.variants[0].id : null) ||
              productId;

            const imageUrl = getProductImage(product);
            const price = getProductPrice(product);
            const oldPrice = getProductOldPrice(product);

            console.log(`Product ${index + 1}:`, {
              id: productId,
              name: productName,
              image: imageUrl,
              price: price,
              category: productCategory
            });

            return {
              id: productId,
              product_id: productId, // Add explicit product_id for cart API
              variantId: variantId,
              title: productName,
              price: price,
              oldPrice: oldPrice,
              image: imageUrl,
              category: productCategory,
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
              category: "all",
              product: product,
            };
          }
        });

        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  // === SLIDE ONE BY ONE ===
  const nextSlide = () => {
    if (filteredProducts.length <= itemsPerView) return;
    if (currentIndex < filteredProducts.length - itemsPerView) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (filteredProducts.length <= itemsPerView) return;
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(Math.max(0, filteredProducts.length - itemsPerView));
    }
  };

  return (
    <section className="w-full bg-white py-8 sm:py-8 px-2 sm:px-6 lg:px-8 relative">
      {/* ===== Heading ===== */}
      <div className="text-center mb-4 sm:mb-8">
        <h2 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
          Trending Kitchen Appliances
        </h2>
        <p className="text-[#636365] text-sm sm:text-base md:text-lg font-semibold mt-1">
          Our Best Sellers
        </p>
      </div>

      {/* ===== Clickable Category Buttons ===== */}
      <div className="w-full mx-auto flex justify-center text-[#545455] font-medium mb-6 sm:mb-8 lg:mb-10">
        <div className="overflow-x-auto scrollbar-hide pb-2">
          <div className="flex gap-3 sm:gap-4 md:gap-6 justify-center sm:justify-start min-w-max px-1">
            {categories.map((category, i) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentIndex(0);
                  }}
                  className={`rounded-full px-3 sm:px-4 md:px-5 py-1.5 text-sm sm:text-sm md:text-base transition-all whitespace-nowrap flex-shrink-0 ${isActive
                      ? "bg-[#B91508] text-white"
                      : "bg-[#E9E9EB] text-[#545455] hover:bg-[#d5d5d7]"
                    }`}
                >
                  {category
                    .split(" ")
                    .map((w) => w[0].toUpperCase() + w.slice(1))
                    .join(" ")}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== Slider Section ===== */}
      <div className="relative flex flex-col">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading products...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">No products found</div>
          </div>
        ) : (
          <>
            {/* Slider */}
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
                  transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
                }}
              >
                {filteredProducts.map((item, i) => {
                  // Get variant ID for cart operations
                  const variantId = item.variantId || item.id;

                  return (
                    <div
                      key={item.id || `product-${i}`}
                      className={`flex-shrink-0 px-2 flex flex-col items-center ${itemsPerView === 2 ? 'w-1/2' : itemsPerView === 3 ? 'w-1/3' : 'w-1/4 lg:w-1/5'
                        }`}
                    >
                      <div className="flex flex-col items-center w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px]">
                        {/* IMAGE */}
                        <div className="relative w-full overflow-hidden rounded-2xl shadow-md">
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

                        {/* TEXT + PRICE */}
                        <div className="text-center  mt-3 sm:mt-4">
                          <h3 className="text-[18px] sm:text-base md:text-lg lg:text-lg font-semibold text-gray-900 mb-1">
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

                        {/* BUTTONS */}
                        <div className="flex gap-1 sm:gap-3 justify-center mt-auto">
                          <button
                            onClick={() => variantId && handleAddToCart(item)}
                            disabled={!variantId}
                            className="bg-[#B91508] text-white text-nowrap text-[13px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => variantId && handleBuyNow(item)}
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
          </>
        )}

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
                    width: `${Math.min(((currentIndex + itemsPerView) / filteredProducts.length) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default YouMayAlso;
