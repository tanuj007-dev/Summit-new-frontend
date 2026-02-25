import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaArrowRight, FaTrophy } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import axiosInstance from "../axiosConfig";

/* -------------------- IMAGE OPTIMIZATION -------------------- */
import OptimizedImage from './OptimizedImage';
import { getOptimizedS3ImageUrl } from '../utils/s3ImageOptimizer';

// Optimized image helper
const getOptimizedImageSrc = (img, width = 400, quality = 80) => {
  if (!img) return "/asset/images/dummy-image-square.jpg";
  if (!img.startsWith("http")) return img;
  return getOptimizedS3ImageUrl(img, { width, quality });
};

const Trends = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingProductIds, setTrendingProductIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(5);

  // Touch/Drag Logic
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startDragX, setStartDragX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(0);

  const containerRef = useRef(null);
  const minSwipeDistance = 20; // Reduced for easier swiping
  const velocityThreshold = 0.3; // pixels per millisecond

  // Image loading optimization states
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  // Helper functions
  const handleImageLoad = (imageId) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: true }));
  };

  const handleImageError = (imageId) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: 'error' }));
  };

  // Adjust items per view responsive
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) setItemsPerView(2); // Mobile: 2 items
      else if (window.innerWidth < 1024) setItemsPerView(2); // Tablet: 3 items
      else setItemsPerView(5); // Desktop: 5 items
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const { handleAddToCart, handleBuyNow } = useContext(CartContext);

  const categories = [
    "all",
    "cookware",
    "pressure cooker",
    "steam cookware",
    "gas stove",
    "gas tandoor",
    "mixer grinder",
  ];

  // Pressure Cooker: show only these product_id values when filter is active
  const PRESSURE_COOKER_PRODUCT_IDS = [
    "SI1S",
    "SI1IS",
    "SI1F",
    "SI1IF",
    "SI1.5F",
    "SI2F",
    "SO3P",
    "SO5P",
    "SO3.5H",
    "SO5.5H",
    "SO3TIE",
  ];

  // Cookware: show only these product_id values when filter is active
  const COOKWARE_PRODUCT_IDS = [
    "SABF",
    "STMP",
    "STBP",
    "STMFEC",
    "STMFC",
    "SKBTIE",
    "SKMHGTIE",
    "STSHCTIE",
    "STMHTIE",
    "SFMHGTIE",
    "SFBS",
  ];

  // Mixer Grinder
  const MIXER_GRINDER_PRODUCT_IDS = ["SMGNF2", "SMGALP4"];

  // Gas Stove
  const GAS_STOVE_PRODUCT_IDS = ["S3BOS", "S3BGD", "S2BNGB"];

  // Gas Tandoor
  const GAS_TANDOOR_PRODUCT_IDS = ["SGTPRA", "SGTPA", "SGTSA", "SGTPBA"];

  // Steam Cookware
  const STEAM_COOKWARE_PRODUCT_IDS = ["SIC4P", "SIC5IS", "SMK4IS", "SMK4S", "SMK4P"];

  /* ---------------- API & DATA TRANSFORMATION ---------------- */
  // ... (keeping data fetching logic similar but cleaner)
  const getProductImage = (product) => {
    if (!product) return "/asset/images/dummy-image-square.jpg";
    const from = (src) => (src && typeof src === "string" && src.trim() ? src.trim() : null);
    if (from(product.image)) return product.image;
    if (from(product.image_url)) return product.image_url;
    if (product.product_images) {
      const pm = product.product_images;
      const u = Array.isArray(pm) ? (pm[0]?.url ?? pm[0]) : pm;
      if (from(u)) return u;
    }
    if (product?.images?.length > 0) {
      const u = product.images[0]?.url ?? product.images[0];
      if (from(typeof u === "string" ? u : u?.url)) return typeof u === "string" ? u : u?.url;
    }
    if (product?.variants?.length > 0) {
      const v = product.variants[0];
      if (from(v?.image)) return v.image;
      if (from(v?.image_url)) return v.image_url;
      if (v?.images?.length > 0) {
        const u = v.images[0]?.url ?? v.images[0];
        if (from(typeof u === "string" ? u : u?.url)) return typeof u === "string" ? u : u?.url;
      }
    }
    return "/asset/images/dummy-image-square.jpg";
  };

  const safeNum = (v) => {
    if (v == null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? Math.floor(n) : null;
  };

  // Parse price from strings like "₹ 440.00", "₹ 1,010.00", "1000", etc.
  const parsePrice = (v) => {
    if (v == null || v === "") return null;
    if (typeof v === "number" && Number.isFinite(v)) return Math.floor(v);
    const s = String(v).trim();
    if (!s) return null;
    // Strip currency symbols (₹, Rs, etc.) and commas; keep digits and decimal dot
    const cleaned = s.replace(/[\u20B9\u20A8Rs,\s]/gi, "").replace(/(\d)\s+(\d)/g, "$1$2");
    const num = parseFloat(cleaned);
    return Number.isFinite(num) ? Math.floor(num) : null;
  };

  const getProductPrice = (product) => {
    if (!product) return null;
    const fromVariant = product?.variants?.length > 0 && product.variants[0]?.price != null
      ? parsePrice(product.variants[0].price) : null;
    if (fromVariant != null) return fromVariant;
    const candidates = [
      product.price,
      product.selling_price,
      product.mrp,
      product.detail_price,
      product.original_price,
    ];
    for (const c of candidates) {
      const n = parsePrice(c);
      if (n != null) return n;
    }
    return null;
  };

  const getProductOldPrice = (product) => {
    if (product?.variants?.length > 0) {
      const v = parsePrice(product.variants[0]?.original_price) ?? parsePrice(product.variants[0]?.mrp);
      if (v != null) return v;
    }
    const op = parsePrice(product?.original_price);
    if (op != null) return op;
    const mrp = parsePrice(product?.mrp);
    const price = parsePrice(product?.price);
    if (mrp != null && price != null && mrp > price) return mrp;
    return null;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let ids = [];
        let trendingList = [];

        try {
          const trendingRes = await axiosInstance.get("/api/products/view/trending?search=");
          const body = trendingRes.data;
          if (body?.success === false) {
            ids = [];
            trendingList = [];
          } else {
            const raw = body?.data ?? body;
            trendingList = Array.isArray(raw) ? raw : [];
            ids = trendingList
              .map((item) =>
                typeof item === "string"
                  ? item.trim()
                  : String(item?.product_id ?? item?.id ?? "").trim()
              )
              .filter(Boolean);
          }
          setTrendingProductIds(ids);

          if (trendingList.length > 0 && trendingList.some((item) => typeof item === "object" && item !== null)) {
            let viewData = [];
            const parseViewBody = (vb) => {
              if (Array.isArray(vb)) return vb;
              if (vb?.data && Array.isArray(vb.data)) return vb.data;
              if (vb?.data?.products && Array.isArray(vb.data.products)) return vb.data.products;
              if (vb?.products && Array.isArray(vb.products)) return vb.products;
              return [];
            };
            try {
              const viewRes = await axiosInstance.get("/api/products/view", { params: { search: "all" } });
              viewData = parseViewBody(viewRes.data);
              if (viewData.length === 0) {
                try {
                  const axios = (await import("axios")).default;
                  const base = import.meta.env.VITE_APP_API_BASE_URL ?? "https://api.summithomeappliance.com";
                  const fallback = await axios.get(`${base}/api/products/view`, { params: { search: "all" }, withCredentials: true });
                  viewData = parseViewBody(fallback.data);
                } catch (_) {}
              }
            } catch (_) {}
            const viewByProductId = new Map();
            const hasImageOrPrice = (obj) =>
              (obj?.image || obj?.images?.length || obj?.variants?.[0]?.image) ||
              (obj?.price != null || obj?.mrp != null || obj?.selling_price != null || obj?.detail_price != null || obj?.variants?.[0]?.price != null);
            viewData.forEach((v) => {
              const keys = [
                v.product_id,
                v.id,
                v.product_variant_id,
                v.detail_id,
                v.sku,
                v.variants?.[0]?.id,
              ]
                .filter(Boolean)
                .map((k) => String(k).toUpperCase().trim());
              keys.forEach((key) => {
                const existing = viewByProductId.get(key);
                if (!existing || (hasImageOrPrice(v) && !hasImageOrPrice(existing))) {
                  viewByProductId.set(key, v);
                }
              });
            });
            const normalizeName = (s) => String(s ?? "").toLowerCase().trim().replace(/\s+/g, " ");
            const viewByProductName = new Map();
            viewData.forEach((v) => {
              const name = normalizeName(v.product_name ?? v.name ?? v.title ?? "");
              if (name) {
                const existing = viewByProductName.get(name);
                if (!existing || hasImageOrPrice(v)) viewByProductName.set(name, v);
              }
            });
            const fromTrending = trendingList.map((p, i) => {
              const pid = p.product_id ?? p.id ?? `pid-${i}`;
              const pidKey = String(pid).toUpperCase().trim();
              const pName = normalizeName(p.product_name ?? p.name ?? "");
              let viewProduct = viewByProductId.get(pidKey);
              if (!viewProduct && viewData.length > 0) {
                viewProduct = viewData.find(
                  (v) =>
                    pidKey === String(v.product_id ?? "").toUpperCase().trim() ||
                    pidKey === String(v.id ?? "").toUpperCase().trim() ||
                    String(v.id ?? "").toUpperCase().includes(pidKey) ||
                    String(v.product_id ?? "").toUpperCase().includes(pidKey)
                );
              }
              if (!viewProduct && pName) {
                viewProduct = viewByProductName.get(pName);
                if (!viewProduct) {
                  viewProduct = viewData.find((v) => {
                    const vName = normalizeName(v.product_name ?? v.name ?? v.title);
                    return vName === pName || (vName && pName && (vName.includes(pName) || pName.includes(vName)));
                  });
                }
              }
              if (!viewProduct) viewProduct = p;
              const name = viewProduct.product_name ?? viewProduct.name ?? viewProduct.title ?? p.product_name ?? p.name ?? `Product ${i + 1}`;
              const cat = (viewProduct.category_id ?? viewProduct.category ?? viewProduct.main_category ?? p.category_id ?? "all").toLowerCase();
              return {
                id: pid,
                variantId: viewProduct.variant_id ?? (viewProduct.variants?.length ? viewProduct.variants[0].id : pid),
                title: name,
                price: getProductPrice(viewProduct) ?? parsePrice(p?.price ?? p?.mrp ?? p?.selling_price),
                oldPrice: getProductOldPrice(viewProduct),
                image: (() => {
                  const viewImg = getProductImage(viewProduct);
                  const dummy = "/asset/images/dummy-image-square.jpg";
                  return (viewImg && viewImg !== dummy) ? viewImg : getProductImage(p);
                })(),
                category: cat,
                product: viewProduct,
              };
            });
            setProducts(fromTrending);
            return;
          }
        } catch (trendingErr) {
          if (trendingErr?.response?.status !== 404) {
            console.warn("Trending endpoint failed, using view + trending_flag fallback", trendingErr?.response?.status || trendingErr.message);
          }
          ids = [];
        }

        const response = await axiosInstance.get("/api/products/view", {
          params: { search: "all" },
        });
        const resBody = response.data;
        let data = [];
        if (Array.isArray(resBody)) data = resBody;
        else if (resBody?.data && Array.isArray(resBody.data)) data = resBody.data;
        else if (resBody?.products && Array.isArray(resBody.products)) data = resBody.products;

        const transformed = data.map((p, i) => {
          const pid = p.id || p.product_id || `pid-${i}`;
          const name = p.name || p.product_name || p.title || `Product ${i + 1}`;
          const cat = (p.category || p.main_category || "all").toLowerCase();
          const vid = p.variant_id || (p.variants?.length ? p.variants[0].id : pid);
          return {
            id: pid,
            variantId: vid,
            title: name,
            price: getProductPrice(p),
            oldPrice: getProductOldPrice(p),
            image: getProductImage(p),
            category: cat,
            product: p,
          };
        });

        if (ids.length > 0) {
          const idSet = new Set(ids.map((id) => String(id).toUpperCase().trim()));
          const filtered = transformed.filter((item) => {
            const itemId = String(item.id ?? item.product?.product_id ?? "").toUpperCase().trim();
            return itemId && idSet.has(itemId);
          });
          setProducts(filtered);
        } else {
          const byTrendingFlag = transformed.filter((item) => {
            const flag = item.product?.trending_flag;
            return flag === 1 || flag === true || flag === "1";
          });
          setProducts(byTrendingFlag);
        }
      } catch (e) {
        console.error("Trending fetch error", e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ---------------- FILTERING ---------------- */
  const filteredProducts = products.filter(p => {
    if (selectedCategory === 'all') return true;
    const cat = selectedCategory.toLowerCase();

    // Pressure cooker: render only products with these product_id values
    if (cat === 'pressure cooker') {
      const pid = p.product?.product_id ?? p.id ?? '';
      const pidStr = String(pid).toUpperCase();
      return PRESSURE_COOKER_PRODUCT_IDS.some(
        id => id.toUpperCase() === pidStr
      );
    }

    // Cookware: render only products with these product_id values
    if (cat === 'cookware') {
      const pid = p.product?.product_id ?? p.id ?? '';
      const pidStr = String(pid).toUpperCase();
      return COOKWARE_PRODUCT_IDS.some(id => id.toUpperCase() === pidStr);
    }

    // Steam cookware: render only products with these product_id values
    if (cat === 'steam cookware') {
      const pid = p.product?.product_id ?? p.id ?? '';
      const pidStr = String(pid).toUpperCase();
      return STEAM_COOKWARE_PRODUCT_IDS.some(id => id.toUpperCase() === pidStr);
    }

    // Gas stove: render only products with these product_id values
    if (cat === 'gas stove') {
      const pid = p.product?.product_id ?? p.id ?? '';
      const pidStr = String(pid).toUpperCase();
      return GAS_STOVE_PRODUCT_IDS.some(id => id.toUpperCase() === pidStr);
    }

    // Gas tandoor: render only products with these product_id values
    if (cat === 'gas tandoor') {
      const pid = p.product?.product_id ?? p.id ?? '';
      const pidStr = String(pid).toUpperCase();
      return GAS_TANDOOR_PRODUCT_IDS.some(id => id.toUpperCase() === pidStr);
    }

    // Mixer grinder: render only products with these product_id values
    if (cat === 'mixer grinder') {
      const pid = p.product?.product_id ?? p.id ?? '';
      const pidStr = String(pid).toUpperCase();
      return MIXER_GRINDER_PRODUCT_IDS.some(id => id.toUpperCase() === pidStr);
    }

    // Fallback for any other category
    const meta = [
      p.category,
      p.product?.subcat_name,
      p.product?.master_category?.toLowerCase(),
      p.title.toLowerCase()
    ].join(' ');
    return meta.includes(cat);
  }).sort((a, b) => {
    // Sort logic if needed
    return 0;
  });

  /* ---------------- SLIDER LOGIC ---------------- */
  const maxIndex = Math.max(0, filteredProducts.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(e.touches[0].clientX);
    setTouchStartTime(Date.now());
    setIsSwiping(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    setTouchEndX(currentX);
    const offset = (currentX - touchStartX) * 1.2; // 1.2x multiplier for more sensitive drag
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;

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

    setTouchStartX(0);
    setTouchEndX(0);
    setTouchStartTime(0);
    setIsSwiping(false);
    setDragOffset(0);
  };

  // Mouse handlers for desktop drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartDragX(e.clientX);
    setTouchStartTime(Date.now());
    setDragOffset(0);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const offset = currentX - startDragX;
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const distance = -dragOffset;
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

    setIsDragging(false);
    setStartDragX(0);
    setTouchStartTime(0);
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setStartDragX(0);
      setTouchStartTime(0);
      setDragOffset(0);
    }
  };

  // Safe reset if index out of bounds after filter change
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, itemsPerView]);


  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Background Decor (Optional) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2"></div>

      {/* ===== Header ===== */}
      <div className="flex flex-col items-center text-center mb-12">
        <span className="text-[#B91508] font-bold text-sm tracking-widest uppercase mb-2">Our Best Sellers</span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Trending Kitchen Essentials
        </h2>
        <div className="w-16 h-1 bg-[#B91508] rounded-full"></div>
      </div>

      {/* ===== Minimal Tabs ===== */}
      <div className="w-full overflow-x-auto scrollbar-hide mb-8 sm:mb-10 px-4 -mx-4 sm:mx-0 sm:px-0">
        <div className="flex flex-nowrap sm:flex-wrap items-center sm:justify-center gap-3 sm:gap-4 min-w-max sm:min-w-0 px-1 sm:px-0">
          {categories.map((cat, i) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={i}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform flex-shrink-0 
                    ${active
                    ? "bg-[#B91508] text-white shadow-lg shadow-red-200 scale-105"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            )
          })}
        </div>
      </div>

      {/* ===== Content Area ===== */}
      <div className="relative group w-full">

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B91508]"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400">
            <p>No products found in this category.</p>
            <button onClick={() => setSelectedCategory('all')} className="mt-4 text-[#B91508] underline">View All</button>
          </div>
        ) : (
          <>
            {/* Navigation Arrows (Desktop) */}
            <button
              onClick={prevSlide}
              className="hidden lg:flex absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-xl border border-gray-100 items-center justify-center text-gray-700 hover:text-[#B91508] hover:scale-110 transition-all duration-300"
            >
              <FaChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              className="hidden lg:flex absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-xl border border-gray-100 items-center justify-center text-gray-700 hover:text-[#B91508] hover:scale-110 transition-all duration-300"
            >
              <FaChevronRight size={18} />
            </button>

            {/* Slider Window */}
            <div
              className="overflow-hidden py-4 -mx-4 px-4"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              style={{ 
                touchAction: 'pan-y pinch-zoom',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none'
              }}
            >
              <div
                className="flex"
                style={{
                  transform: `translateX(calc(-${currentIndex * (100 / itemsPerView)}% + ${dragOffset}px))`,
                  transition: (isDragging || isSwiping) ? 'none' : 'transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)',
                  willChange: 'transform'
                }}
              >
                {filteredProducts.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex-shrink-0 px-2 sm:px-3 ${itemsPerView === 5
                      ? "w-1/5"
                      : itemsPerView === 3
                        ? "w-1/3"
                        : itemsPerView === 2
                          ? "w-1/2" // Mobile 2 cols
                          : "w-full"
                      }`}
                  >
                    {/* CARD */}
                    <div className="group/card flex flex-col h-full bg-white transition-transform duration-300 hover:shadow-lg rounded-lg overflow-hidden border border-transparent hover:border-gray-200">

                      {/* IMAGE SECTION */}
                      <div className="relative aspect-square w-full bg-[#FAFAFA] overflow-hidden">
                        <Link to={`/product-details/${item.id}`} className="block w-full h-full">
                          <div className="w-full h-full relative p-4 flex items-center justify-center">
                            {!imageLoadingStates[item.id] && (
                              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                            )}
                            <OptimizedImage
                              src={getOptimizedImageSrc(item.image || "/asset/images/dummy-image-square.jpg", 400, 80)}
                              alt={item.title}
                              width={400}
                              height={400}
                              className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover/card:scale-105 ${imageLoadingStates[item.id] ? 'opacity-100' : 'opacity-0'}`}
                              onLoad={() => handleImageLoad(item.id)}
                              onError={() => handleImageError(item.id)}
                            />
                          </div>
                        </Link>
                      </div>

                      {/* CONTENT SECTION */}
                      <div className="p-3 flex flex-col flex-grow text-left">

                        {/* Title */}
                        <h3 className="font-bold text-gray-900 text-[13px] sm:text-[15px] leading-snug line-clamp-2 min-h-[2.5rem] mb-1">
                          {item.title}
                        </h3>

                        {/* Best Seller / Stats */}
                        <div className="flex items-center gap-1.5 mb-1.5 text-[10px] sm:text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-bold text-[#B91508]">
                            <FaTrophy className="text-[#B91508]" /> BESTSELLER
                          </span>
                          <span className="hidden sm:inline w-0.5 h-3 bg-gray-300"></span>
                          <span className="truncate hidden sm:block">1k+ bought</span>
                        </div>

                        {/* Reviews */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-amber-500 text-[10px] sm:text-sm">
                            {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                          </div>
                          <span className="text-[10px] sm:text-xs text-gray-500 pt-0.5">20 Reviews</span>
                        </div>

                        {/* Price & Actions Section: STACKED for Responsive */}
                        <div className="mt-auto pt-2 border-t border-gray-50 flex flex-col gap-2">

                          {/* Row 1: Prices & EMI Text */}
                          <div className="flex justify-between items-baseline">
                            <div className="flex flex-col">
                              <div className="flex items-baseline gap-1">
                                <span className="text-base sm:text-lg font-black text-gray-900">
                                  {(() => {
                                    const p = item.product;
                                    const raw =
                                      item.price ??
                                      p?.price ??
                                      p?.selling_price ??
                                      p?.mrp ??
                                      p?.detail_price ??
                                      (p?.variants?.length ? p.variants[0]?.price : null);
                                    const displayPrice = parsePrice(raw);
                                    return displayPrice != null ? `₹${displayPrice.toLocaleString()}` : "₹—";
                                  })()}
                                </span>
                                {(() => {
                                  const p = item.product;
                                  const displayPrice = parsePrice(item.oldPrice ?? p?.original_price ?? p?.mrp);
                                  const mainPrice = item.price ?? (item.product && getProductPrice(item.product));
                                  if (displayPrice == null || mainPrice == null || displayPrice <= mainPrice) return null;
                                  return (
                                    <span className="text-[10px] sm:text-xs text-gray-400 line-through decoration-gray-400">
                                      ₹{displayPrice.toLocaleString()}
                                    </span>
                                  );
                                })()}
                              </div>
                              <span className="text-[9px] sm:text-[10px] text-gray-500 leading-none">(incl. taxes)</span>
                            </div>

                            <div className="text-right">
                              <span className="block text-[10px] sm:text-[11px] font-semibold text-gray-800">
                                {(() => {
                                  const p = item.product;
                                  const raw = item.price ?? p?.price ?? p?.selling_price ?? p?.mrp ?? p?.detail_price ?? (p?.variants?.length ? p.variants[0]?.price : null);
                                  const num = parsePrice(raw);
                                  return num != null ? `or ₹${Math.round(num / 4)}/mo` : "";
                                })()}
                              </span>
                            </div>
                          </div>

                          {/* Row 2: Buttons (Side by Side) */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); item.variantId && handleAddToCart(item); }}
                              className="flex-1 bg-white hover:bg-[#B91508] text-[#B91508] border border-[#B91508] hover:text-white text-[10px] sm:text-xs font-bold py-1.5 rounded-md shadow-sm active:scale-95 transition-all text-center"
                            >
                              Add +
                            </button>
                            <button className="flex-1 bg-[#B91508] text-white border border-[#B91508] text-[10px] sm:text-xs font-bold py-1.5 rounded-md shadow-sm hover:shadow-red-200 active:scale-95 transition-all text-center truncate px-1">
                              Buy on EMI
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 relative h-1 bg-gray-100 rounded-full max-w-sm mx-auto overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-[#B91508] transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(((currentIndex + itemsPerView) / filteredProducts.length) * 100, 100)}%` }}
              />
            </div>
          </>
        )}
      </div>

    </section>
  );
};

export default Trends;
