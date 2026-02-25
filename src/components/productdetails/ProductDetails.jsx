
import React, { useEffect, useRef, useState, useContext } from "react";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import {
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaChevronDown,
  FaShieldAlt,
  FaCcVisa,
  FaCcMastercard,
  FaCreditCard,
} from "react-icons/fa";
import { CartContext } from "../../context/CartContext";
import { IoShareSocial } from "react-icons/io5";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Blogs from "../Blogs";
import CategoryMegaMenu from "../header/CategoryMegaMenu";
import ExploreMoreCategories from '../ExploreMoreCategories';
import YouMayAlsoLike from '../YouMayAlsoLike';
/* -------------------- IMAGE HELPER -------------------- */
const getImageSrc = (img) => {
  if (!img) return "/asset/images/dummy-image-square.jpg";

  // S3 presigned URL (already full) or s3:// URI
  if (typeof img === "string") {
    if (img.startsWith("http")) return img;
    if (img.startsWith("s3://")) {
      return img.replace('s3://', 'https://').replace(/([^/]+)\//, '$1.s3.amazonaws.com/');
    }
  }

  // Image object case { url: "https://..." }
  if (typeof img === "object" && img.url) {
    return img.url;
  }

  return "/asset/images/dummy-image-square.jpg";
};

// Optimized image helper with quality and size parameters
const getOptimizedImageSrc = (img, width = 800, quality = 80) => {
  const originalSrc = getImageSrc(img);

  // If it's a local/relative path, return as-is
  if (!originalSrc.startsWith("http")) {
    return originalSrc;
  }

  // For S3/external URLs, you could add image optimization parameters
  // This depends on your image service (Cloudinary, AWS ImageOptim, etc.)
  // Example for Cloudinary: return `${originalSrc}?w=${width}&q=${quality}`;

  return originalSrc;
};

/* -------------------- IMAGE MAGNIFIER -------------------- */
const ImageMagnifier = ({
  src,
  className,
  alt,
  zoomLevel = 2.5,
  onLoad,
  onError,
  style,
  loading
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  // Loupe Configuration
  const DIAMETER = 200; // Size of the magnifying glass

  const handleMouseEnter = () => {
    // Only enable on desktop
    if (window.innerWidth >= 1024) setShowMagnifier(true);
  };

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const elem = imgRef.current;
    const { left, top, width, height } = elem.getBoundingClientRect();
    setImgSize({ width, height });

    // Cursor position relative to image
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Check if cursor is inside bounds
    if (x < 0 || y < 0 || x > width || y > height) {
      setShowMagnifier(false);
      return;
    }

    setZoomPos({ x, y });
    if (!showMagnifier && window.innerWidth >= 1024) setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  // Calculate Lens Position
  const r = DIAMETER / 2;
  let cx = zoomPos.x;
  let cy = zoomPos.y;

  // Clamp center so the lens stays strictly inside the image boundaries
  if (cx < r) cx = r;
  if (cx > imgSize.width - r) cx = imgSize.width - r;
  if (cy < r) cy = r;
  if (cy > imgSize.height - r) cy = imgSize.height - r;

  // Position of the loupe element
  const xPos = cx - r;
  const yPos = cy - r;

  // Background/Zoomed Image Position logic:
  // We want the point under the cursor (cx, cy) to be centered in the magnifying glass
  // The zoomed image is 'zoomLevel' times larger
  // We need to position the zoomed image so that the cursor point appears in the center of the lens
  const bgLeft = -(cx * zoomLevel) + r;
  const bgTop = -(cy * zoomLevel) + r;

  return (
    <div className="relative inline-block w-full h-full group cursor-crosshair">
      <img
        ref={imgRef}
        src={src}
        className={className}
        alt={alt}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onLoad={onLoad}
        onError={onError}
        style={style}
        loading={loading}
      />

      {showMagnifier && (
        <div
          style={{
            position: 'absolute',
            left: xPos,
            top: yPos,
            width: DIAMETER,
            height: DIAMETER,
            borderRadius: '50%',
            pointerEvents: 'none',
            border: '2px solid white',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            backgroundColor: '#fff',
            zIndex: 20
          }}
        >
          <div
            style={{
              width: imgSize.width * zoomLevel,
              height: imgSize.height * zoomLevel,
              transform: `translate(${bgLeft}px, ${bgTop}px)`,
              transformOrigin: 'top left',
              backgroundColor: 'white'
            }}
          >
            <img
              src={src}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              alt=""
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ProductDetails = () => {
  const { product_id } = useParams();
  const baseURL = import.meta.env.VITE_APP_API_BASE_URL ?? 'https://api.summithomeappliance.com';

  const { handleAddToCart, handleBuyNow } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewCount, setReviewCount] = useState(0);

  // Dropdown state for product details table
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Read more state for table description
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState(null);


  // Image loading optimization states
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [mainImageLoaded, setMainImageLoaded] = useState(false);

  // Helper function to truncate text by word count
  const truncateByWords = (text, limit) => {
    if (!text) return '';
    const words = text.split(/\s+/);
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(' ') + '...';
  };

  // Helper function to strip HTML tags for word counting
  const stripHtml = (html) => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Handle image load events
  const handleImageLoad = (imageId) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: true }));
  };

  const handleImageError = (imageId) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: 'error' }));
  };


  const mainSlider = useRef(null);
  const thumbSlider = useRef(null);

  /* -------------------- API CALL -------------------- */
  // only showing critical fixed parts (no repetition) 2

  useEffect(() => {
    if (!product_id) return;

    setLoading(true);

    axios
      .get(`${baseURL}/api/products/view/${product_id}`, {
        headers: { Accept: "application/json" },
        withCredentials: true,
      })
      .then((res) => {
        console.log("PRODUCT API 👉", res.data);

        // Handle both old and new API response structures
        let productData = res.data;

        // If response is wrapped in data property
        if (res.data?.data) {
          productData = res.data.data;
        }

        // Ensure product_id exists (either from id or product_id field)
        if (productData && !productData.product_id && productData.id) {
          productData.product_id = productData.id;
        }

        // If variants exist but no images array, create images from variants
        if (productData?.variants && Array.isArray(productData.variants) && !productData.images) {
          productData.images = productData.variants
            .map(v => v.image)
            .filter(img => img && img.startsWith('http')); // Only include S3 presigned URLs
        }

        setProduct(productData);

        // Generate random review count between 100-200
        const randomReviews = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
        setReviewCount(randomReviews);
      })
      .catch((err) => {
        console.error("Product fetch error:", err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [product_id]);







  /* -------------------- LOADING / ERROR -------------------- */
  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    console.error("Product is null or undefined");
    return <div className="text-center py-20 text-red-600">Product not found. Product ID: {product_id}</div>;
  }

  // Ensure product has an ID
  if (!product.product_id && product.id) {
    product.product_id = product.id;
  }

  if (!product.product_id) {
    console.error("Product missing product_id:", product);
    return <div className="text-center py-20 text-red-600">Invalid product data</div>;
  }



  /* -------------------- IMAGES COLLECTION -------------------- */
  const allImages = [];

  // Add main product image (S3 presigned URL)
  if (product.image || product.image_url) {
    allImages.push({
      id: "main",
      src: getImageSrc(product.image || product.image_url),
    });
  }

  // Add variant images if available
  if (Array.isArray(product.variants)) {
    // Add unique variant images
    const variantImages = new Set();
    product.variants.forEach((variant, index) => {
      if (variant.image && variant.image.startsWith('http')) {
        // Use variant detail_id if available, otherwise use index
        const imageId = variant.detail_id ? `variant-${variant.detail_id}` : `variant-${index}`;
        if (!variantImages.has(variant.image)) {
          variantImages.add(variant.image);
          allImages.push({
            id: imageId,
            src: getImageSrc(variant.image),
          });
        }
      }
    });
  }

  // Add additional images array if available
  if (Array.isArray(product.images)) {
    product.images.forEach((img, index) => {
      allImages.push({
        id: `img-${index}`,
        src: getImageSrc(img),
      });
    });
  }

  console.log('📷 All Images Collected:', allImages);
  console.log('📦 Product Data:', product);




  /* -------------------- SLIDER SETTINGS -------------------- */
  const mainSettings = {
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    asNavFor: thumbSlider.current,
  };

  const thumbSettings = {
    slidesToShow: window.innerWidth < 768 ? 4 : 5, // 4 on mobile, 5 on desktop
    slidesToScroll: 1,
    vertical: window.innerWidth < 768 ? false : true, // Horizontal on mobile, vertical on desktop
    arrows: false,
    focusOnSelect: true,
    asNavFor: mainSlider.current,
  };



  /* -------------------- JSX -------------------- */
  return (
    <div className="px-2 bg-white md:px-14">
      <CategoryMegaMenu />
      {/* Breadcrumb */}
      <div className="text-xs py-2 mb-3 bg-red-50 font-bold">
        Home / {product.category?.name || product.master_category || 'Products'} /{" "}
        <span className="text-[#B91508]">{product.name || product.product_name}</span>
      </div>

      <div className="flex mt-6 sm:mt-12 flex-col md:flex-row gap-4 md:gap-8">
        {/* ================= IMAGES ================= */}
        <div className="md:w-1/2 flex flex-col md:flex-row gap-2 md:gap-4">
          {allImages.length === 0 ? (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded">
              <div className="text-center">
                <p className="text-gray-600 mb-2">No images available</p>
                <p className="text-sm   text-gray-500">Product: {product.name || product.product_name}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Thumbnails - Vertical on desktop, horizontal on mobile */}
              <div className="order-2 md:order-1 w-full md:w-16 lg:w-[90px] relative md:max-h-[300px] lg:max-h-[450px] h-20 md:h-auto">
                {/* Mobile prev button */}
                <button
                  onClick={() => thumbSlider.current?.slickPrev()}
                  className="absolute -left-8 md:-top-8 md:left-1/2 top-1/2 md:-translate-y-0 -translate-y-1/2 md:-translate-x-1/2 bg-red-600 text-white p-1 rounded-full z-10"
                >
                  <FaChevronLeft className="md:hidden" />
                  <FaChevronUp className="hidden md:block" />
                </button>

                <Slider ref={thumbSlider} {...thumbSettings}>
                  {allImages.map((img) => (
                    <div key={img.id} className="p-1 cursor-pointer">
                      <div className="relative">
                        {!imageLoadingStates[img.id] && (
                          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
                        )}
                        <img
                          src={getOptimizedImageSrc(img.src, 150, 60)}
                          alt={`Thumbnail ${img.id}`}
                          className="border rounded w-full h-16 md:h-16 lg:h-20 object-cover"
                          loading="lazy"
                          onLoad={() => handleImageLoad(img.id)}
                          onError={() => handleImageError(img.id)}
                          style={{
                            opacity: imageLoadingStates[img.id] ? 1 : 0,
                            transition: 'opacity 0.3s ease-in-out'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </Slider>

                {/* Mobile next button */}
                <button
                  onClick={() => thumbSlider.current?.slickNext()}
                  className="absolute -right-8 md:static md:flex md:justify-center md:mt-3 top-1/2 -translate-y-1/2 md:translate-y-0 bg-red-600 text-white p-1 rounded-full z-10 ml-7"
                >
                  <FaChevronRight className="md:hidden" />
                  <FaChevronDown className="hidden md:block" />
                </button>
              </div>

              {/* Main Image */}
              <div className="order-1 md:order-2 relative w-full max-w-xl ">
                <button
                  onClick={() => mainSlider.current?.slickPrev()}
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-red-600 text-white p-1 sm:p-2 rounded-full z-10"
                >
                  <FaChevronLeft />
                </button>

                <button
                  onClick={() => mainSlider.current?.slickNext()}
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-red-600 text-white p-1 sm:p-2 rounded-full z-10"
                >
                  <FaChevronRight />
                </button>

                {allImages.length > 0 ? (
                  <Slider ref={mainSlider} {...mainSettings}>
                    {allImages.map((img, index) => (
                      <div key={img.id}>
                        <div className="relative">
                          {!imageLoadingStates[img.id] && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                          )}
                          <ImageMagnifier
                            src={getOptimizedImageSrc(img.src, 800, 80)}
                            alt={`Product image ${index + 1}`}
                            className="w-full max-h-[340px] sm:max-h-[350px] md:max-h-[550px] object-contain cursor-crosshair"
                            loading={index === 0 ? "eager" : "lazy"}
                            onLoad={() => handleImageLoad(img.id)}
                            onError={() => handleImageError(img.id)}
                            style={{
                              opacity: imageLoadingStates[img.id] ? 1 : 0,
                              transition: 'opacity 0.3s ease-in-out'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="relative">
                    {!mainImageLoaded && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                    )}
                    <ImageMagnifier
                      src="/asset/images/dummy-image-square.jpg"
                      alt="Product placeholder"
                      className="w-full max-h-[250px] sm:max-h-[350px] md:max-h-[450px] object-contain cursor-crosshair"
                      onLoad={() => setMainImageLoaded(true)}
                      style={{
                        opacity: mainImageLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ================= DETAILS ================= */}
        <div className="px-0 sm:px-2 ml-0 sm:ml-5 md:w-1/2 w-full">
          <div className="flex justify-between items-center gap-2 mb-2 flex-wrap">
            {/* <!-- Bestseller Badge --> */}
            <div className="relative mt-6 sm:mt-1 inline-block bg-[#C1121F] px-2 py-0.5 overflow-hidden rounded">
              <span className="relative z-10 items-center text-[11px] sm:text-[10px] font-bold uppercase tracking-wide text-white">
                Bestseller
              </span>
            </div>

            {/* <!-- Rating & Reviews --> */}
            <div className="flex items-center gap-1 mt-6 sm:mt-1 text-sm flex-wrap">
              {/* <!-- Stars --> */}
              <div className="flex items-center text-[#C1121F] text-lg sm:text-lg">
                ★★★★★
              </div>

              {/* <!-- Reviews --> */}
              <span className="text-gray-600 text-lg sm:text-lg">
                {reviewCount} reviews

              </span>
              <IoShareSocial className="text-gray-600 text-lg sm:text-lg cursor-pointer hover:text-[#B91508]" />
              {/* <!-- Share Icon (optional) --> */}

            </div>
          </div>



          <h1 className="text-xl sm:text-xl md:text-3xl font-semibold mt-4 sm:mt-0 ">
            {product.product_name?.toLowerCase()
              .replace(/^\w/, (c) => c.toUpperCase())}
          </h1>


          {/* Product Description Preview */}
          {(product.description || product.product_description || product.long_description) && (
            <div className="mt-3 mb-2">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {(() => {
                  const desc = product.description || product.product_description || product.long_description;
                  const plainText = stripHtml(desc);
                  const preview = truncateByWords(plainText, 30);
                  return preview;
                })()}
              </p>
              <button
                onClick={() => {
                  // Scroll to product details table smoothly
                  setTimeout(() => {
                    document.querySelector('.tabs-section')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }, 100);
                }}
                className="text-[#B91508] hover:text-[#a21307] font-medium text-sm mt-1 inline-block hover:underline"
              >
                View Product Details →
              </button>
            </div>
          )}
          <button className="text-xs sm:text-sm bg-gray-100 px-2 py-1 text-gray-600 mt-2">
            SKU: {product.product_id || 'SI1F'}
          </button>
          <p className="text-lg sm:text-xl font-bold mt-3">
            ₹ {product.mrp}
            <p className="text-xs text-[#777]">(Inclusive of all taxes)</p>
            {/* <p className="text-xl font-bold mt-3">
  ₹ {product.mrp}
</p> */}
            <div className="bg-[#FAFAFC] mt-3 items-center text-[12px] sm:text-xs justify-center w-full grid-cols-2 sm:grid-cols-3 grid md:grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-3 space-y-1 rounded-sm text-center">
              <div className="flex justify-start items-center gap-0.5 sm:gap-2 mb-0">
                <img
                  src="/asset/iconvector/Vector.png"
                  alt=""
                  className="size-3 sm:size-4"
                />
                <span>Premium Quality </span>
              </div>
              <div className="flex justify-start items-center gap-0.5 sm:gap-2 mb-0">
                <img
                  src="/asset/iconvector/basil_stack-solid.png"
                  alt=""
                  className="size-3 sm:size-4"
                />
                <span>Long-lasting 3 Layer Body</span>
              </div>

              <div className="flex justify-start items-center gap-0.5 sm:gap-2 mb-0">
                <img
                  src="/asset/iconvector/emojione-monotone_pot-of-food.png"
                  className="size-3 sm:size-4"
                  alt=""
                />
                <span>No Food Burning/Sticking</span>
              </div>

              <div className="flex justify-start items-center gap-0.5 sm:gap-2 mb-0">
                <img
                  src="/asset/iconvector/Vector (3).png"
                  alt=""
                  className="size-3 sm:size-4"
                />
                <span>Super Easy to Clean</span>
              </div>

              <div className="flex justify-start items-center gap-0.5 sm:gap-2 mb-0">
                <img
                  src="/asset/iconvector/Vector (4).png"
                  alt=""
                  className="size-3 sm:size-4"
                />
                <span>Heating & Fast Cooking</span>
              </div>

              <div className="flex justify-start items-center gap-0.5 sm:gap-2 mb-0">
                <img
                  src="/asset/iconvector/Vector (5).png"
                  alt=""
                  className="size-3 sm:size-4"
                />
                <span> ISI & ISO 9001 Certified</span>
              </div>
            </div>

            {/* Capacity Selection */}
            <div className="mt-3 flex items-center gap-2 flex-wrap text-sm sm:text-base">
              <h3 className="font-bold text-base sm:text-lg whitespace-nowrap">Capacity:</h3>
              <div className="flex items-center gap-2">
                {/* Extract capacity from product_name and show as single option */}
                {(() => {
                  const capacityMatch = product.product_name?.match(/\d+\.?\d*[Ll]/);
                  const capacity = capacityMatch ? capacityMatch[0] : '1L';
                  return (
                    <button
                      key={capacity}
                      className="px-3 sm:px-4 py-1 sm:py-2 rounded-md border text-xs sm:text-sm font-semibold border-[#B91508] text-[#B91508]"
                    >
                      {capacity}
                    </button>
                  );
                })()}
              </div>
            </div>


          </p>

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-4 mt-6 flex-wrap">
            <button
              onClick={() => {
                handleAddToCart({
                  product_id: product?.product_id || product?.id,
                  price: product?.mrp || product?.selling_price,
                  selling_price: product?.mrp,
                  product_name: product?.product_name,
                  image: product?.image,
                });
              }}
              className="bg-[#B91508] text-white px-8 sm:px-12 py-3 sm:py-3 text-nowrap rounded-full font-semibold text-[16px] hover:bg-[#a21307] transition-all"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                handleBuyNow({
                  product_id: product?.product_id || product?.id,
                  price: product?.mrp || product?.selling_price,
                  selling_price: product?.mrp,
                  product_name: product?.product_name,
                  image: product?.image,
                });
              }}
              className="border-2 border-[#B91508] text-[#B91508] px-8 sm:px-12 py-3 sm:py-3 text-nowrap rounded-full font-semibold text-[16px] hover:bg-[#B91508] hover:text-white transition-all"
            >
              Buy Now
            </button>

          </div>
          <div className="mt-6 pt-5 border-t border-dashed border-gray-200">
            <div className="flex flex-wrap items-center gap-y-4 gap-x-6 md:gap-x-8 text-[13px] sm:text-[14px] text-[#636365]">

              <div className="flex items-center gap-2">
                <img
                  src="/asset/iconvector/bitcoin-icons_tag-filled.png"
                  alt=""
                  className="size-5 opacity-80"
                />
                <span>Free shipping over ₹1199</span>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src="/asset/iconvector/hugeicons_delivery-return-01.png"
                  alt=""
                  className="size-5 opacity-80"
                />
                <span>7 Days Easy Returns</span>
              </div>

              {/* Secure Payment Badges */}
              <div className="flex items-center gap-2.5 pl-0 lg:pl-4 lg:border-l lg:border-gray-300">
                <div className="p-1.5 bg-gray-50 rounded-full text-[#B91508]">
                  <FaShieldAlt size={16} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-800">100% Secure Payment</span>
                  <div className="flex items-center gap-2 text-gray-400">
                    <FaCcVisa size={22} className="text-[#1A1F71] transition-colors" />
                    <FaCcMastercard size={22} className="text-[#EB001B] transition-colors" />
                    <FaCreditCard size={22} className="text-yellow-800 transition-colors" />
                  </div>
                </div>
              </div>

            </div>

            <div className="flex flex-col gap-2 mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 md:gap-4">
                <input
                  type="text"
                  placeholder="Enter Your Pin Code"
                  className="p-2 border-2 border-gray-300 placeholder:text-xs sm:placeholder:text-sm placeholder:font-semibold rounded w-full sm:w-auto text-sm"
                // value={pincode}
                // onChange={(e) => setPincode(e.target.value)}
                />
                <button
                  className="rounded border-2 border-[#B91508] text-[#B91508] p-2 font-semibold w-full md:w-auto hover:bg-[#B91508] hover:text-white transition-colors"
                // onClick={handleCheck}
                >
                  Check Now
                </button>
                <div className="text-[#636365] font-semibold text-[14px]">
                  Enter Pincode To View Delivery Details
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Product Details Dropdown Section */}
      <div className="tabs-section mt-6 sm:mt-8 px-0 sm:px-2">
        <div className="max-w-6xl mx-auto">
          {/* Dropdown Header */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <button
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">More Information</h3>
              <svg
                className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-600 transition-transform duration-300 ${isDetailsOpen ? 'rotate-180' : ''
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Collapsible Table Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isDetailsOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              <div className="border-t">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <tbody>
                      {/* Product Name & Description */}
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-800 text-sm sm:text-base bg-gray-50 w-1/3 sm:w-2/5">
                          Product Name & Description
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 text-sm sm:text-base">
                          <div className="space-y-2">
                            <div className="font-medium">{product.product_name || product.name || 'N/A'}</div>
                            {(product.description || product.product_description || product.long_description) && (
                              <div className="text-sm text-gray-600">
                                {(() => {
                                  const desc = product.description || product.product_description || product.long_description;
                                  const plainText = stripHtml(desc);
                                  const shouldTruncate = plainText.length > 150;

                                  return (
                                    <>
                                      {isDescriptionExpanded || !shouldTruncate
                                        ? plainText
                                        : plainText.substring(0, 150) + '...'}
                                      {shouldTruncate && (
                                        <button
                                          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                          className="text-[#B91508] hover:text-[#a21307] font-medium ml-1 hover:underline"
                                        >
                                          {isDescriptionExpanded ? 'Read Less' : 'Read More'}
                                        </button>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Manufacturer/Packer/Importer Name & Address */}
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-800 text-sm sm:text-base bg-gray-50">
                          Manufacturer/Packer/Importer Name & Address
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 text-sm sm:text-base">
                          {product.manufacturer || product.manufacturer_name || product.brand || 'Summit Home Appliance'}
                          {product.manufacturer_address && (
                            <div className="text-sm text-gray-600 mt-1">{product.manufacturer_address}</div>
                          )}
                        </td>
                      </tr>

                      {/* Country of Origin */}
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-800 text-sm sm:text-base bg-gray-50">
                          Country of Origin
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 text-sm sm:text-base">
                          {product.country_of_origin || product.origin_country || 'India'}
                        </td>
                      </tr>

                      {/* Net Quantity */}
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-800 text-sm sm:text-base bg-gray-50">
                          Net Quantity (Weight/Volume/Length/Number of pieces)
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 text-sm sm:text-base">
                          {(() => {
                            const capacityMatch = product.product_name?.match(/\d+\.?\d*[Ll]/);
                            const capacity = capacityMatch ? capacityMatch[0] : '';
                            const weight = product.weight || product.net_weight || '';
                            const quantity = product.quantity || product.net_quantity || '';
                            return capacity || weight || quantity || '1 Piece';
                          })()}
                        </td>
                      </tr>

                      {/* Maximum Retail Price (MRP) */}
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-800 text-sm sm:text-base bg-gray-50">
                          Maximum Retail Price (MRP) inclusive of all taxes
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 text-sm sm:text-base">
                          <span className="font-semibold text-[#B91508]">₹{product.mrp || product.selling_price || 'N/A'}</span>
                          <span className="text-xs text-gray-500 ml-2">(Inclusive of all taxes)</span>
                        </td>
                      </tr>

                      {/* Month & Year of Manufacture/Packing/Import */}
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-800 text-sm sm:text-base bg-gray-50">
                          Month & Year of Manufacture/Packing/Import
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 text-sm sm:text-base">
                          {product.manufacture_date || product.manufacturing_date || new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                        </td>
                      </tr>

                      {/* Customer Support Contact Details */}
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-800 text-sm sm:text-base bg-gray-50">
                          Customer Support Contact Details
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 text-sm sm:text-base">
                          <div className="space-y-1">
                            <div>Phone: {product.customer_care_phone || product.support_phone || '+91-XXXXXXXXXX'}</div>
                            <div>Email: {product.customer_care_email || product.support_email || 'support@summithomeappliance.com'}</div>
                          </div>
                        </td>
                      </tr>

                      {/* Dimensions of Product */}
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-800 text-sm sm:text-base bg-gray-50">
                          Dimensions of Product
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 text-sm sm:text-base">
                          {product.dimensions || product.dimension || product.size || 'N/A'}
                        </td>
                      </tr>

                      {/* Ingredients/Material Composition */}
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-800 text-sm sm:text-base bg-gray-50">
                          Ingredients/Material Composition
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 text-sm sm:text-base">
                          {product.material || product.material_name || product.composition || 'Premium Quality Material'}
                        </td>
                      </tr>

                      {/* Best Before/Expiry Date */}
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-800 text-sm sm:text-base bg-gray-50">
                          Best Before/Expiry Date
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 text-sm sm:text-base">
                          {product.expiry_date || product.best_before || 'Not Applicable'}
                        </td>
                      </tr>

                      {/* GST Compliance */}
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-800 text-sm sm:text-base bg-gray-50">
                          GST Compliance
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 text-sm sm:text-base">
                          Inclusive of all taxes
                        </td>
                      </tr>

                      {/* FSSAI License number */}
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-800 text-sm sm:text-base bg-gray-50">
                          FSSAI License number
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 text-sm sm:text-base">
                          {product.fssai_license || 'Not Applicable'}
                        </td>
                      </tr>

                      {/* Drug License */}
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-800 text-sm sm:text-base bg-gray-50">
                          Drug License (for medicines/cosmetics)
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 text-sm sm:text-base">
                          {product.drug_license || 'Not Applicable'}
                        </td>
                      </tr>

                      {/* BIS/ISI Mark */}
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-800 text-sm sm:text-base bg-gray-50">
                          BIS/ISI Mark
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 text-sm sm:text-base">
                          {product.bis_isi_mark || product.certifications || 'ISI Certified'}
                        </td>
                      </tr>

                      {/* Weight & Measurement Dept. Registration */}
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-800 text-sm sm:text-base bg-gray-50">
                          Weight & Measurement Dept. Registration (LMPC Importer License)
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 text-sm sm:text-base">
                          {product.lmpc_registration || 'Registered'}
                        </td>
                      </tr>

                      {/* SKU/Model Number */}
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-800 text-sm sm:text-base bg-gray-50">
                          SKU/Model Number
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 text-sm sm:text-base">
                          {product.product_id || product.sku || product.model_number || 'N/A'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-6xl mx-auto mt-8 sm:mt-12">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* FAQ Header */}
            <div className="bg-gradient-to-r from-[#B91508] to-[#8B0F06] px-4 sm:px-6 py-4 sm:py-5">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Frequently Asked Questions</h2>
              <p className="text-sm text-white/90 mt-1">Everything you need to know about this product</p>
            </div>

            {/* FAQ Items */}
            <div className="divide-y divide-gray-200">
              {(() => {
                // Dynamic FAQs based on product type/category
                const productName = product.product_name?.toLowerCase() || '';
                const isPressurecooker = productName.includes('pressure') || productName.includes('cooker');
                const isCookware = productName.includes('pan') || productName.includes('pot') || productName.includes('kadai');

                let faqs = [];

                if (isPressurecooker) {
                  faqs = [
                    {
                      question: "What is the capacity of this pressure cooker?",
                      answer: `This ${product.product_name} has a capacity of ${(() => {
                        const match = product.product_name?.match(/\d+\.?\d*[Ll]/);
                        return match ? match[0] : '1L';
                      })()}, making it perfect for ${(() => {
                        const match = product.product_name?.match(/(\d+\.?\d*)/);
                        const capacity = match ? parseFloat(match[0]) : 1;
                        if (capacity <= 2) return 'small families or individuals';
                        if (capacity <= 5) return 'medium-sized families (3-5 members)';
                        return 'large families (6+ members)';
                      })()}. It's ideal for cooking rice, dal, vegetables, and various Indian dishes efficiently.`
                    },
                    {
                      question: "Is this pressure cooker compatible with induction cooktops?",
                      answer: "Yes, this pressure cooker features a tri-ply bottom construction that makes it compatible with all types of cooktops including induction, gas, electric, and ceramic. The thick base ensures even heat distribution and prevents hot spots."
                    },
                    {
                      question: "What safety features does this pressure cooker have?",
                      answer: "This pressure cooker is equipped with multiple safety features including a pressure indicator, safety valve, gasket release system, and ISI certification. The precision weight valve ensures controlled pressure release, and the sturdy handles provide a secure grip during use."
                    },
                    {
                      question: "How do I clean and maintain this pressure cooker?",
                      answer: "Cleaning is easy! After each use, wash with mild soap and warm water. Avoid using abrasive scrubbers. The gasket should be cleaned separately and replaced every 12-18 months for optimal performance. Always ensure the pressure valve and vent are clear before use."
                    },
                    {
                      question: "What is the warranty period for this product?",
                      answer: "This pressure cooker comes with a manufacturer's warranty. The warranty covers manufacturing defects but does not cover damage from misuse, accidents, or normal wear and tear. Please retain your purchase receipt for warranty claims."
                    },
                    {
                      question: "Can I cook multiple items simultaneously in this cooker?",
                      answer: "Yes! You can use separator containers or steamer inserts to cook multiple dishes at once. This is perfect for preparing a complete meal - rice on the bottom and vegetables or dal in the separator - saving time and energy."
                    }
                  ];
                } else if (isCookware) {
                  faqs = [
                    {
                      question: "What material is this cookware made from?",
                      answer: `This ${product.product_name} is made from ${product.material || product.material_name || 'premium quality material'} with a durable non-stick coating. It's designed for long-lasting performance and easy cooking with minimal oil.`
                    },
                    {
                      question: "Is this cookware safe for health?",
                      answer: "Absolutely! Our cookware is made with food-grade materials and features a PFOA-free non-stick coating. It's completely safe for everyday cooking and meets all international safety standards including ISI certification."
                    },
                    {
                      question: "Can I use metal utensils with this cookware?",
                      answer: "We recommend using wooden, silicone, or nylon utensils to preserve the non-stick coating and extend the product's lifespan. Metal utensils may scratch the surface and reduce the effectiveness of the non-stick properties."
                    },
                    {
                      question: "Is this suitable for induction cooktops?",
                      answer: "Yes, this cookware features an induction-compatible base and works perfectly on all types of stovetops including gas, electric, ceramic, and induction. The thick base ensures even heat distribution for perfect cooking results."
                    },
                    {
                      question: "How should I clean and care for this cookware?",
                      answer: "Hand washing with mild soap and a soft sponge is recommended for longevity. Avoid abrasive cleaners and steel wool. Allow the cookware to cool before washing, and dry thoroughly before storing. Proper care will ensure years of excellent performance."
                    },
                    {
                      question: "What is the warranty coverage?",
                      answer: "This product comes with a manufacturer's warranty against manufacturing defects. The warranty does not cover damage from overheating, improper use, or normal wear and tear. Keep your purchase receipt for warranty service."
                    }
                  ];
                } else {
                  // Generic kitchen appliance FAQs
                  faqs = [
                    {
                      question: `What makes this ${product.product_name} special?`,
                      answer: `This ${product.product_name} is crafted with premium materials and features superior build quality. It's designed for durability, efficiency, and ease of use, making it an essential addition to your kitchen.`
                    },
                    {
                      question: "Is this product safe to use?",
                      answer: "Yes, this product is ISI certified and meets all safety standards. It's made with food-grade materials and undergoes rigorous quality testing to ensure safe and reliable performance for everyday use."
                    },
                    {
                      question: "What is included in the package?",
                      answer: `The package includes the ${product.product_name}, user manual with care instructions, and warranty card. All necessary components are included for immediate use.`
                    },
                    {
                      question: "How do I clean and maintain this product?",
                      answer: "Cleaning is simple - wash with mild soap and warm water after each use. Avoid harsh chemicals and abrasive scrubbers. Dry thoroughly before storing. Regular maintenance will ensure long-lasting performance."
                    },
                    {
                      question: "What is the warranty period?",
                      answer: "This product comes with a manufacturer's warranty covering manufacturing defects. The warranty does not cover damage from misuse, accidents, or normal wear. Please retain your purchase receipt for warranty claims."
                    },
                    {
                      question: "Is this suitable for daily use?",
                      answer: "Absolutely! This product is designed for regular, everyday use. Its durable construction and quality materials ensure it can handle daily cooking needs while maintaining excellent performance over time."
                    }
                  ];
                }

                return faqs.map((faq, index) => (
                  <div key={index} className="border-b last:border-b-0">
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-start justify-between hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#B91508] text-white flex items-center justify-center text-sm sm:text-base font-bold mt-0.5">
                          Q
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 pr-4">
                          {faq.question}
                        </h3>
                      </div>
                      <svg
                        className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-600 transition-transform duration-300 flex-shrink-0 ${openFaqIndex === index ? 'rotate-180' : ''
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-5 pl-12 sm:pl-16">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-sm sm:text-base font-bold">
                            A
                          </div>
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* FAQ Footer */}
            <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t">
              <p className="text-sm text-gray-600 text-center">
                Still have questions? Contact our customer support at{' '}
                <a href="mailto:support@summithomeappliance.com" className="text-[#B91508] hover:underline font-medium">
                  support@summithomeappliance.com
                </a>
                {' '}or call{' '}
                <a href="tel:+911234567890" className="text-[#B91508] hover:underline font-medium">
                  +91-XXXXXXXXXX
                </a>
              </p>
            </div>
          </div>
        </div>

        <YouMayAlsoLike currentProduct={product} />
        <ExploreMoreCategories />

        <Blogs />
      </div>
    </div>
  );
};

export default ProductDetails;


