import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaTrophy } from "react-icons/fa";
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
    { label: "Under ₹3999", value: 3999 },
    { label: "Under ₹4999", value: 4999 },
  ];

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeFilter, setActiveFilter] = useState("Under ₹2999");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(5);
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

  // Touch handlers
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

  /* 🔹 Responsive slides */
  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(2);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(3);
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
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-12 relative">

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
        <div className="flex gap-2 justify-center sm:gap-3 min-w-max px-1">
          {filters.map(filter => (
            <button
              key={filter.value}
              onClick={() => handleFilterClick(filter.value, filter.label)}
              className={`rounded-full justify-center text-[13px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 transition-all whitespace-nowrap flex-shrink-0
                ${activeFilter === filter.label
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
            style={{
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'pan-y pinch-zoom',
              userSelect: 'none'
            }}
          >
            <div
              className="flex"
              style={{
                transform: `translateX(calc(-${(currentIndex * 100) / slidesToShow}% + ${dragOffset}px))`,
                transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)',
                willChange: 'transform'
              }}
            >
              {filteredProducts.map((item, i) => {
                const variantId = item.variantId || item.id;

                return (
                  <div
                    key={item.id || `product-${i}`}
                    className={`flex-shrink-0 px-3 ${slidesToShow === 5
                      ? "w-1/5"
                      : slidesToShow === 4
                        ? "w-1/4"
                        : slidesToShow === 3
                          ? "w-1/3"
                          : slidesToShow === 2
                            ? "w-1/2"
                            : "w-full"
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
      {!loading && filteredProducts.length > slidesToShow && (
        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 mt-18 left-0 right-0 px-2 justify-between pointer-events-none" style={{ top: "50%", transform: "translateY(-50%)" }}>
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
