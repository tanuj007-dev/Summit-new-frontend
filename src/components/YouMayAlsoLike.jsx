import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaTrophy, FaCartPlus } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import axios from "../axiosConfig";

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

const YouMayAlsoLike = ({ currentProduct = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Update items per view based on screen size (match reference: 5 cards on large)
  React.useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2);
      } else if (window.innerWidth < 768) {
        setItemsPerView(3);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(4);
      } else {
        setItemsPerView(5);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const { handleAddToCart, handleBuyNow } = useContext(CartContext);
  const { addToWishlist, isInWishlist } = useWishlist();

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

  // Fetch relevant products (same category or all with client-side filter)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Build category search: support category as object { name, slug } or string
        const catObj = currentProduct?.category;
        const categoryStr = typeof catObj === "string"
          ? catObj
          : (catObj?.name || catObj?.slug || currentProduct?.master_category || currentProduct?.main_category || "all");
        const searchQuery = String(categoryStr).trim() || "all";

        let productsData = [];

        // First try: fetch by category/search
        try {
          const response = await axios.get("/api/products/view", {
            params: { search: searchQuery.toLowerCase() },
            withCredentials: true,
          });
          if (Array.isArray(response.data)) {
            productsData = response.data;
          } else if (response.data?.data && Array.isArray(response.data.data)) {
            productsData = response.data.data;
          } else if (response.data?.products && Array.isArray(response.data.products)) {
            productsData = response.data.products;
          }
        } catch (e) {
          console.warn("YouMayAlsoLike category fetch failed:", e?.message);
        }

        // Fallback: if no or few results, fetch all and filter by category
        const currentId = currentProduct?.product_id || currentProduct?.id;
        if (productsData.length < 4) {
          try {
            const res = await axios.get("/api/products/view", {
              params: { search: "all" },
              withCredentials: true,
            });
            let all = [];
            if (Array.isArray(res.data)) all = res.data;
            else if (res.data?.data && Array.isArray(res.data.data)) all = res.data.data;
            else if (res.data?.products && Array.isArray(res.data.products)) all = res.data.products;
            const catLower = searchQuery.toLowerCase();
            const sameCategory = all.filter((p) => {
              const pCat = (p.category?.name || p.category?.slug || p.master_category || p.main_category || p.category || "").toString().toLowerCase();
              return pCat && (pCat === catLower || pCat.includes(catLower) || catLower.includes(pCat));
            });
            if (sameCategory.length > 0) productsData = sameCategory;
            else if (all.length > 0) productsData = all;
          } catch (e2) {
            console.warn("YouMayAlsoLike fallback fetch failed:", e2?.message);
          }
        }

        // Filter out the current product and limit to 16 for "You May Also Like"
        let filteredData = productsData
          .filter(
            (p) => String(p.id || p.product_id || p.detail_id || "").trim() !== String(currentId || "").trim()
          )
          .slice(0, 16);

        // Transform API response to match component structure
        const transformedProducts = filteredData.map((product, index) => {
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
  }, [currentProduct?.product_id, currentProduct?.category, currentProduct?.master_category, currentProduct?.main_category]);

  // === SLIDE ONE BY ONE ===
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
    <section className="w-full bg-white py-8 sm:py-8 px-2 sm:px-6 lg:px-8 relative">
      {/* ===== Heading ===== */}
      <div className="text-center mb-4 sm:mb-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-black tracking-tight mx-auto mb-3 sm:mb-0 leading-[1.12] sm:leading-tight px-1 font-['Playfair_Display',_serif]">
          You May Also Like 

        </h2>

      </div>

      {/* ===== Slider Section ===== */}
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
                {products.map((item, i) => {
                  // Get variant ID for cart operations
                  const variantId = item.variantId || item.id;

                  return (
                    <div
                      key={item.id || `product-${i}`}
                      className={`shrink-0 px-2 flex justify-center ${itemsPerView === 2 ? 'w-1/2' : itemsPerView === 3 ? 'w-1/3' : itemsPerView === 4 ? 'w-1/4' : 'w-1/5'
                        }`}
                    >
                      <div className="flex flex-col items-center w-full max-w-[180px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[260px] bg-white pb-4 p-2 sm:p-3 transition-shadow">
                        {/* IMAGE */}
                        <div className="relative w-full overflow-hidden rounded-lg">
                          <Link to={`/product-details/${item.id || item.sno || item.product_id || item.detail_id}`}>
                            <div className="relative">
                              {!imageLoadingStates[item.id] && (
                                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                              )}

                              <img
                                src={getOptimizedImageSrc(item.image, 400, 80)}
                                alt={item.title}
                                className="w-full h-[160px] sm:h-[180px] md:h-[200px] lg:h-[220px] object-contain bg-gray-50 rounded-lg transition-all duration-300 hover:scale-[1.02]"
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
                            <span className="absolute bottom-2 left-2 bg-[#941007] text-white text-[10px] sm:text-xs px-2 py-0.5 rounded">
                              Sale
                            </span>
                          )}


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

                        {/* TITLE */}
                        <Link to={`/product-details/${item.id || item.sno || item.product_id || item.detail_id}`} className="w-full mt-2 sm:mt-3 text-left">
                          <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
                            {item.title}
                          </h3>
                        </Link>


                        {/* BESTSELLER + 1k+ bought */}
                        <div className="flex items-center gap-1.5 mt-1.5 text-[10px] sm:text-xs text-gray-500 w-full">
                          <span className="flex items-center gap-0.5 font-semibold text-[#941007]">
                            <FaTrophy className="size-3 text-[#941007]" /> BESTSELLER
                          </span>
                          <span className="text-gray-400">|</span>
                          <span>1k+ bought</span>
                        </div>


                        {/* STARS + REVIEWS */}
                        <div className="flex items-center gap-1 mt-1 w-full">
                          <span className="flex text-amber-400" aria-hidden>
                            {[...Array(5)].map((_, k) => (
                              <span key={k} className="text-[10px] sm:text-xs">★</span>
                            ))}
                          </span>
                          <span className="text-[10px] sm:text-xs text-gray-500">20 Reviews</span>
                        </div>


                        {/* PRICE */}
                        <div className="w-full mt-1.5 text-left">
                          <p className="text-xs sm:text-sm text-gray-600">
                            {item.price ? (
                              <>
                                from{" "}
                                <span className="font-semibold text-gray-900">Rs. {item.price}</span>
                                {item.oldPrice && item.oldPrice > item.price && (
                                  <span className="text-gray-400 line-through ml-1 text-xs">Rs. {item.oldPrice}</span>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </p>
                        </div>


                        {/* BUTTONS: Add to (outline) + Buy Now (solid) */}
                        <div className="flex gap-2 w-full mt-3">
                          <button
                            onClick={() => variantId && handleAddToCart(item)}
                            disabled={!variantId}
                            className="flex-1 flex items-center justify-center gap-1 border border-[#941007] text-[#941007] text-[11px] sm:text-xs py-2 rounded-lg hover:bg-[#941007] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaCartPlus className="size-3.5" /> Add to
                          </button>
                          <button
                            onClick={() => variantId && handleBuyNow(item)}
                            disabled={!variantId}
                            className="flex-1 bg-[#941007] text-white text-[11px] sm:text-xs py-2 rounded-lg hover:bg-[#941007] transition disabled:opacity-50 disabled:cursor-not-allowed"
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


            {/* Navigation Buttons - Desktop Only */}
            {!loading && products.length > itemsPerView && (
              <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 px-2 justify-between pointer-events-none z-10">
                <button
                  onClick={prevSlide}
                  className="bg-white hover:bg-gray-100 text-[#941007] p-3 rounded-full shadow-lg transition pointer-events-auto border border-gray-100"
                  aria-label="Previous"
                >
                  <FaChevronLeft className="text-xl" />
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-white hover:bg-gray-100 text-[#941007] p-3 rounded-full shadow-lg transition pointer-events-auto border border-gray-100"
                  aria-label="Next"
                >
                  <FaChevronRight className="text-xl" />
                </button>
              </div>
            )}
          </>
        )}


        {/* Progress Bar */}
        {!loading && products.length > 0 && (
          <div className="mt-2 sm:mt-6 px-8">
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
      </div>
    </section>
  );
};

export default YouMayAlsoLike;
