import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaTrophy, FaCartPlus } from "react-icons/fa";
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

const ThoughtfulPicks = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = [
    { label: "Under ₹499", value: 499 },
    { label: "Under ₹999", value: 999 },
    { label: "Under ₹1499", value: 1499 },
    { label: "Under ₹1999", value: 1999 },
    { label: "Above ₹1999", value: 1999 },

  ];

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeFilter, setActiveFilter] = useState("Under ₹1999");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(2);
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

  // Touch handlers – only start drag after threshold so button taps register as clicks
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
        const response = await axios.get("api/products/view", {
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

  /* 🔹 Responsive slides (match Trends: 2 on mobile/tablet, 5 on desktop) */
  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth < 640) setSlidesToShow(2);
      else if (window.innerWidth < 1024) setSlidesToShow(2);
      else setSlidesToShow(5);
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

  /* 🔹 Slider logic – native scroll (same as SmartCookerFinder) */
  const scrollContainerRef = useRef(null);

  const nextSlide = () => {
    const el = scrollContainerRef.current;
    if (!el || filteredProducts.length <= slidesToShow) return;
    el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
  };

  const prevSlide = () => {
    const el = scrollContainerRef.current;
    if (!el || filteredProducts.length <= slidesToShow) return;
    el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
  };


  return (
    <section className="font-gotham w-full bg-white py-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* ===== Heading (mobile-first — matches Trends / KitchenCategories) ===== */}
        <div className="text-center mb-10 sm:mb-12 md:mb-14 px-3 sm:px-4 max-w-5xl mx-auto">
          <span className="inline-block text-[#941007] text-[11px] sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 opacity-90 px-1">
            Smart Budget Choices
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-black tracking-tight text-balance max-w-[min(100%,40rem)] mx-auto mb-3 sm:mb-0 leading-[1.12] sm:leading-tight px-1">
            Thoughtful Picks by Price
          </h2>
          <p className="text-[#636365] text-[13px] sm:text-base md:text-[18px] font-semibold max-w-md sm:max-w-2xl mx-auto px-2 sm:px-4 mb-2 sm:mb-0 leading-snug">
            Gifting Made Simple, Shopping Made Smarter
          </p>
          <p className="text-gray-400 text-[12px] sm:text-[14px] md:text-[16px] max-w-3xl sm:max-w-4xl mx-auto leading-relaxed px-2 sm:px-4 text-pretty">
            From festive gifts to personal upgrades—explore quality cookware and kitchen essentials that suit your budget, without compromising on style or substance.
          </p>
        </div>

        {/* ===== Filters (Trends-style: full-bleed scroll on mobile) ===== */}
        <div className="w-full overflow-x-auto scrollbar-hide mb-6 sm:mb-8 px-4 -mx-4 sm:mx-0 sm:px-0">
          <div className="flex flex-nowrap sm:flex-wrap justify-center gap-2 sm:gap-3 min-w-max sm:min-w-0 px-1 sm:px-0">
            {filters.map(filter => (
              <button
                key={filter.value}
                onClick={() => handleFilterClick(filter.value, filter.label)}
                className={`rounded-full justify-center text-[13px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 transition-all whitespace-nowrap shrink-0
                ${activeFilter === filter.label
                    ? "bg-[#941007] text-white shadow-md scale-105"
                    : "bg-[#E9E9EB] text-[#545455]"
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== Filter description (below filters, when a filter is selected) ===== */}
        {activeFilter && (() => {
          const content = activeFilter === "Under ₹499"
            ? { heading: "Everyday Essentials Under ₹499", para: "Perfect for giveaways, Diwali hampers, or quick kitchen upgrades." }
            : activeFilter === "Under ₹999"
              ? { heading: "Gifts That Impress – Under ₹999", para: "Corporate-ready, budget-friendly, and full of utility." }
              : activeFilter === "Under ₹1499"
                ? { heading: "Smart Buys Under ₹1499", para: "Ideal for wedding return gifts, new homeowners, or festival gifting." }
                : activeFilter === "Under ₹1999"
                  ? { heading: "Premium Picks Under ₹1999", para: "Big value for small budgets—perfect for employee gifts or celebrations." }
                  : activeFilter === "Above ₹1999"
                    ? { heading: "Festive Favorites & Luxe Kitchenware Above 1999", para: "For those who want to give (or get) something truly special." }
                    : { heading: `Everyday Essentials ${activeFilter}`, para: "Perfect for giveaways, Diwali hampers, or quick kitchen upgrades." };
          return (
            <div className="mb-6 text-center">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {content.heading}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                {content.para}
              </p>
            </div>
          );
        })()}

        {/* ===== Content Area (Trends-style: relative group for nav) ===== */}
        <div className="relative group w-full">
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
              ref={scrollContainerRef}
              className="flex w-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory py-2 -mx-1 sm:-mx-4 px-1 sm:px-4 scrollbar-hide"
              style={{
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none"
              }}
              onScroll={() => {
                const el = scrollContainerRef.current;
                if (!el) return;
                const pageWidth = el.clientWidth;
                const idx = pageWidth > 0 ? Math.round(el.scrollLeft / pageWidth) : 0;
                const next = Math.min(Math.max(0, idx), Math.max(0, filteredProducts.length - slidesToShow));
                setCurrentIndex((prev) => (prev === next ? prev : next));
              }}
            >
              {filteredProducts.map((item, i) => {
                const variantId = item.variantId || item.id;
                return (
                  <div
                    key={item.id || `product-${i}`}
                    className="shrink-0 px-2 sm:px-3 snap-start"
                    style={{ width: `${100 / Math.max(1, slidesToShow)}%` }}
                  >
                    {/* CARD — mobile matches Trends / SmartCookerFinder reference */}
                    <div className="group/card flex flex-col h-full bg-white transition-shadow duration-300 hover:shadow-lg rounded-2xl sm:rounded-lg overflow-hidden border border-gray-100 sm:border-transparent shadow-sm hover:border-gray-200">

                      {/* IMAGE SECTION */}
                      <div className="relative aspect-square w-full bg-[#FAFAFA] overflow-hidden border-b border-gray-100">
                        <Link to={`/product-details/${item.id || item.sno || item.product_id || item.detail_id}`} className="block w-full h-full">
                          <div className="w-full h-full relative p-3 sm:p-4 flex items-center justify-center">
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
                        {/* Wishlist Icon */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToWishlist(item.product || item);
                          }}
                          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform duration-300 hover:bg-white"
                        >
                          <FontAwesomeIcon
                            icon={isInWishlist(item.id || item.product_id) ? solidHeart : regularHeart}
                            className={isInWishlist(item.id || item.product_id) ? "text-red-600" : "text-gray-400"}
                            style={{ fontSize: "14px" }}
                          />
                        </button>
                      </div>

                      {/* CONTENT SECTION */}
                      <div className="font-gotham p-3 flex flex-col grow text-left">

                        {/* Title */}
                        <p className="font-bold font-gotham text-gray-900 text-xs sm:text-[18px] leading-snug line-clamp-2 min-h-0 sm:min-h-10 mb-1.5 uppercase tracking-tight sm:normal-case sm:tracking-normal">
                          {item.title}
                        </p>

                        {/* Best Seller / Stats */}
                        <div className="flex items-center gap-1 sm:gap-1.5 mb-2 text-[9px] sm:text-xs text-gray-500 flex-wrap">
                          <span className="flex items-center gap-0.5 font-bold text-[#941007] uppercase tracking-wide shrink-0">
                            <FaTrophy className="text-[#941007] shrink-0" size={10} />
                            BESTSELLER
                          </span>
                          <span className="text-gray-300 select-none shrink-0" aria-hidden>
                            |
                          </span>
                          <span className="truncate text-gray-500">1k+ bought</span>
                        </div>

                        {/* Reviews */}
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                          <div className="flex text-amber-500 text-[11px] sm:text-sm">
                            {[...Array(5)].map((_, k) => <span key={k}>★</span>)}
                          </div>
                          <span className="text-[9px] sm:text-xs text-gray-500 pt-0.5">20 Reviews</span>
                        </div>

                        {/* Price & Actions */}
                        <div className="mt-auto pt-2 border-t border-gray-100 sm:border-gray-50 flex flex-col gap-2">
                          <div className="flex justify-between items-baseline">
                            <div className="flex flex-col">
                              <div className="flex items-baseline gap-1">
                                <span className="text-base sm:text-lg font-black text-gray-900 tracking-tight">N/A</span>
                              </div>
                              <span className="text-[9px] sm:text-[10px] text-gray-500 leading-none" />
                            </div>
                            <div className="text-right">
                              <span className="block text-[10px] sm:text-[11px] font-semibold text-gray-800" />
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap">
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
                                    ...item
                                  });
                                }
                              }}
                              className="flex-1 min-w-0 min-h-[40px] sm:min-h-[36px] bg-white hover:bg-[#941007] text-[#941007] border border-[#941007] hover:text-white text-[10px] sm:text-xs font-bold py-1.5 sm:py-1.5 px-0 sm:px-2 rounded-full sm:rounded-md shadow-sm active:scale-95 transition-all text-center touch-manipulation select-none inline-flex items-center justify-center gap-1"
                            >
                              <FaCartPlus className="w-4 h-4 shrink-0 sm:w-2.5 sm:h-2.5" aria-hidden />
                              <span className="hidden sm:inline whitespace-nowrap">Add to cart</span>
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
                                    ...item
                                  });
                                }
                              }}
                              className="flex-1 min-w-0 min-h-[40px] sm:min-h-[36px] bg-[#941007] text-white border border-[#941007] text-[10px] sm:text-xs font-bold py-1 sm:py-1.5 px-0.5 sm:px-2 rounded-full sm:rounded-md shadow-sm hover:shadow-red-200 active:scale-95 transition-all text-center touch-manipulation select-none inline-flex flex-col sm:flex-row items-center justify-center leading-[1.1] sm:leading-normal" >
                              <span className="flex flex-col sm:hidden items-center justify-center font-bold">
                                <span>Buy</span>
                                <span>Now</span>
                              </span>
                              <span className="hidden sm:inline truncate">Buy Now</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Navigation Arrows (Desktop only – Trends-style) */}
          {!loading && filteredProducts.length > slidesToShow && (
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

        {/* Progress Bar (Trends-style) */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mt-6 sm:mt-8 px-4 sm:px-0 max-w-md mx-auto">
            <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#941007] transition-all duration-300 ease-out rounded-full"
                style={{
                  width: `${Math.min(((currentIndex + slidesToShow) / filteredProducts.length) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ThoughtfulPicks;
