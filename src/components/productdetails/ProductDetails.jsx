
import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import {
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaChevronDown,
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

  // S3 presigned URL (already full)
  if (typeof img === "string" && img.startsWith("http")) {
    return img;
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

const ProductDetails = () => {
  const { product_id } = useParams();
  const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

  const { handleAddToCart, handleBuyNow } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewCount, setReviewCount] = useState(0);
  
  // Tabs functionality
  const [activeTab, setActiveTab] = useState("Description");
  const tabs = ["Description", "Additional info", "Reviews", "Refund Policy"];
  
  // Description truncation state
  const [showFullDescription, setShowFullDescription] = useState(false);
  const WORD_LIMIT = 50; // Set word limit to 50 words
  
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
    .get(`http://127.0.0.1:8000/api/products/view/${product_id}`, {
      headers: { Accept: "application/json" },
      withCredentials: true,
    })
    .then((res) => {
  console.log("PRODUCT API 👉", res.data);
  setProduct(res.data); // 🔥 DIRECT
  // Generate random review count between 100-200
  const randomReviews = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
  setReviewCount(randomReviews);
})

    .catch(() => setProduct(null))
    .finally(() => setLoading(false));
}, [product_id]);
  
 

 



  /* -------------------- LOADING / ERROR -------------------- */
  if (loading) {
    return <div className="text-center py-20">Loading product...</div>;
  }

 if (!product || !product.product_id) {
  return <div className="text-center py-20">Product not found</div>;
}



  /* -------------------- IMAGES COLLECTION -------------------- */
const allImages = [];

if (product.image) {
  allImages.push({
    id: "main",
    src: product.image,
  });
}

if (Array.isArray(product.images)) {
  product.images.forEach((img, index) => {
    allImages.push({
      id: `img-${index}`,
      src: img,
    });
  });
}


   

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
    <div className="px-2 bg-white md:px-16">
      <CategoryMegaMenu />
      {/* Breadcrumb */}
      <div className="text-xs py-2 mb-3 bg-red-50 font-bold">
        Home / {product.master_category} /{" "}
        <span className="text-[#B91508]">{product.product_name}</span>
      </div>

      <div className="flex mt-6 sm:mt-12 flex-col md:flex-row gap-4 md:gap-8">
        {/* ================= IMAGES ================= */}
        <div className="md:w-1/2 flex flex-col md:flex-row gap-2 md:gap-4">
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
                      <img
                        src={getOptimizedImageSrc(img.src, 800, 80)}
                        alt={`Product image ${index + 1}`}
                        className="w-full max-h-[250px] sm:max-h-[350px] md:max-h-[450px] object-contain"
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
                <img
                  src="/asset/images/dummy-image-square.jpg"
                  alt="Product placeholder"
                  className="w-full max-h-[250px] sm:max-h-[350px] md:max-h-[450px] object-contain"
                  onLoad={() => setMainImageLoaded(true)}
                  style={{ 
                    opacity: mainImageLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* ================= DETAILS ================= */}
        <div className="px-0 sm:px-2 ml-0 sm:ml-5 md:w-1/2 w-full">
<div className="flex justify-between items-center gap-2 mb-2 flex-wrap">
  {/* <!-- Bestseller Badge --> */}
  <div className="relative mt-6 sm:mt-1 inline-block bg-[#C1121F] px-2 py-0.5 overflow-hidden rounded">
    <span className="relative z-10 items-center text-[7px] sm:text-[10px] font-bold uppercase tracking-wide text-white">
      Bestseller
    </span>
  </div>

  {/* <!-- Rating & Reviews --> */}
  <div className="flex items-center gap-1 mt-6 sm:mt-1 text-sm flex-wrap">
    {/* <!-- Stars --> */}
    <div className="flex items-center text-[#C1121F] text-xs sm:text-lg">
      ★★★★★
    </div>

    {/* <!-- Reviews --> */}
    <span className="text-gray-600 text-xs sm:text-lg">
      {reviewCount} reviews
      
    </span>
 <IoShareSocial  className="text-gray-600 text-xs sm:text-lg cursor-pointer hover:text-[#B91508]" />
    {/* <!-- Share Icon (optional) --> */}
     
  </div>
</div>



          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mt-4 sm:mt-0">
            {product.product_name}
          </h1>

          <button className="text-xs sm:text-sm bg-gray-100 px-2 py-1 text-gray-600 mt-2">
            SKU: {product.product_id || 'SI1F'}
          </button>

          <p className="text-lg sm:text-xl font-bold mt-3">
        ₹ {product.mrp}
<p className="text-xs text-[#777]">(Inclusive of all taxes)</p>
            {/* <p className="text-xl font-bold mt-3">
  ₹ {product.mrp}
</p> */}
  <div className="bg-[#FAFAFC] mt-3 items-center text-[10px] sm:text-sm justify-center w-full grid-cols-2 sm:grid-cols-3 grid md:grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-3 space-y-1 rounded-sm text-center">
    <div className="flex justify-start items-center gap-0.5 sm:gap-2 mb-0">
      <img
        src="/asset/iconvector/Vector.png"
        alt=""
        className="size-3 sm:size-4"
      />
      <span className="text-xs sm:text-sm">Premium Quality </span>
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
              className="bg-[#B91508] text-white px-8 sm:px-12 py-3 sm:py-3 text-nowrap rounded-full font-semibold text-sm sm:text-base hover:bg-[#a21307] transition-all"
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
              className="border-2 border-[#B91508] text-[#B91508] px-8 sm:px-12 py-3 sm:py-3 text-nowrap rounded-full font-semibold text-sm sm:text-base hover:bg-[#B91508] hover:text-white transition-all"
            >
              Buy Now
            </button>
           
          </div>
            <div className="mt-5">
               <div className="flex flex-wrap gap-3 sm:gap-5">
                 <div className="flex items-center text-sm sm:text-lg text-[#636365] gap-1">
                   {" "}
                   <img
                     src="/asset/iconvector/bitcoin-icons_tag-filled.png"
                     alt=""
                     className="size-4 sm:size-5"
                   />
                   <p className="text-[#636365] text-xs sm:text-sm">
                     Free shipping on orders ₹1199 & above
                   </p>
                 </div>
                 <div className="flex items-center gap-1">
                   {" "}
                   <img
                     src="/asset/iconvector/hugeicons_delivery-return-01.png"
                     alt=""
                     className="size-4 sm:size-5"
                   />
                   <p className="text-[#636365] text-xs sm:text-sm">
                     Easy returns within 7 days
                  </p>
                 </div>
               </div>

               <div className="flex flex-col gap-2 mt-4">
                 <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 md:gap-4">
                   <div className="text-[#636365] font-semibold text-xs sm:text-sm lg:hidden">
  Enter Pincode To View Delivery Details
</div>

                  <input
                    type="text"
                    placeholder="Enter Your Pin Code"
                    className="p-2 border-2 border-gray-300 placeholder:text-xs sm:placeholder:text-sm placeholder:font-semibold rounded w-full sm:w-auto text-sm"
                    // value={pincode}
                    // onChange={(e) => setPincode(e.target.value)}
                  />
                  <button
                    className="rounded border-2 border-[#B91508] text-[#B91508] p-2 font-semibold w-full md:w-auto"
                    // onClick={handleCheck}
                  >
                    Check Now
                  </button>
                </div>
               <div className="hidden md:block text-[#636365] font-semibold text-sm">
  Enter Pincode To View Delivery Details
</div>

              </div>
              </div>

        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-6 sm:mt-8 px-0 sm:px-2">
        {/* Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:justify-center gap-2 sm:gap-3 md:gap-5 text-xs sm:text-sm md:text-lg text-black border-b border-gray-300">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-2 sm:px-4 md:px-12 py-2 sm:py-3 cursor-pointer text-center whitespace-nowrap text-xs sm:text-base"
            >
              <div className={`${activeTab === tab ? "text-red-700 font-semibold" : "text-gray-600"}`}>
                {tab}
              </div>
              {/* Red underline on active tab, full gray underline already exists */}
              <div
                className={
                  activeTab === tab
                    ? "absolute bottom-[-1px] left-0 right-0 h-1 bg-red-700"
                    : "absolute bottom-[-1px] left-0 right-0 h-1 bg-gray-200"
                }
              />
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-2 sm:p-4 px-0 sm:px-2 mt-3 sm:mt-4">
          {activeTab === "Description" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">Product Description</h3>
                <div className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed space-y-3 sm:space-y-4">
                  {product.description ? (
                    <>
                      {showFullDescription ? (
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                      ) : (
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: truncateByWords(stripHtml(product.description), WORD_LIMIT) 
                          }} 
                        />
                      )}
                      {stripHtml(product.description).split(/\s+/).length > WORD_LIMIT && (
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm mt-2 inline-block"
                        >
                          {showFullDescription ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </>
                  ) : product.product_description ? (
                    <>
                      {showFullDescription || product.product_description.split(/\s+/).length <= WORD_LIMIT ? (
                        <p>{product.product_description}</p>
                      ) : (
                        <p>{truncateByWords(product.product_description, WORD_LIMIT)}</p>
                      )}
                      {product.product_description.split(/\s+/).length > WORD_LIMIT && (
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm mt-2 inline-block"
                        >
                          {showFullDescription ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </>
                  ) : product.long_description ? (
                    <>
                      {showFullDescription || product.long_description.split(/\s+/).length <= WORD_LIMIT ? (
                        <p>{product.long_description}</p>
                      ) : (
                        <p>{truncateByWords(product.long_description, WORD_LIMIT)}</p>
                      )}
                      {product.long_description.split(/\s+/).length > WORD_LIMIT && (
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm mt-2 inline-block"
                        >
                          {showFullDescription ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No detailed description available for this product.</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Please contact our support team for more information about this product.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Product Specifications */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
                  <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">Key Specifications</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-6 sm:w-8 h-6 sm:h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-3 sm:w-4 h-3 sm:h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-xs sm:text-sm text-gray-700">HSN Code</div>
                        <div className="text-xs sm:text-sm text-gray-600">{product.hsn_code || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-6 sm:w-8 h-6 sm:h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-3 sm:w-4 h-3 sm:h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-xs sm:text-sm text-gray-700">Weight</div>
                        <div className="text-xs sm:text-sm text-gray-600">{product.weight || product.net_weight || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-xs sm:text-sm text-gray-700">Dimensions</div>
                        <div className=" text-xs sm:text-sm text-gray-600">{product.dimensions || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-xs sm:text-sm text-gray-700">Material</div>
                        <div className=" text-xs sm:text-sm text-gray-600">{product.material || product.material_name || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Additional info" && (
            <div className="text-center text-gray-600">
              <p>Additional information will be displayed here.</p>
            </div>
          )}

          {activeTab === "Reviews" && (
            <div className="bg-white text-[#B91508] p-3 sm:p-6 md:p-8 rounded-lg max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 items-start md:items-center">
                {/* Left Side - Review Stats */}
                <div className="flex-1 w-full">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">Verified Customer Reviews</h3>
                  
                  <div className="flex items-start gap-2 sm:gap-4 mb-2">
                    <div className="flex text-lg sm:text-2xl md:text-3xl">
                      {'★'.repeat(5)}{'☆'.repeat(0)}
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                        {(() => {
                          const reviews = {
                            'SI1F': { rating: 4.76, total: 41, distribution: [35, 4, 1, 0, 1] },
                            'SI2F': { rating: 4.82, total: 67, distribution: [58, 6, 2, 1, 0] },
                            'SI3F': { rating: 4.65, total: 23, distribution: [18, 3, 1, 1, 0] },
                            'SI4F': { rating: 4.91, total: 89, distribution: [82, 5, 2, 0, 0] },
                            'SI5F': { rating: 4.58, total: 34, distribution: [26, 5, 2, 1, 0] },
                            'default': { rating: 4.73, total: 52, distribution: [43, 6, 2, 1, 0] }
                          };
                          const key = product.product_id || 'default';
                          return reviews[key]?.rating || reviews.default.rating;
                        })()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">out of 5</div>
                    </div>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    Based on {reviewCount} reviews
                  </p>
                  
                  {/* Rating Distribution */}
                  <div className="space-y-2 sm:space-y-3">
                    {(() => {
                      // Generate distribution based on random review count
                      // Assume 85% are 5-star, 10% are 4-star, 3% are 3-star, 2% are 2-star, 0% are 1-star
                      const distribution = [
                        Math.round(reviewCount * 0.85), // 5-star
                        Math.round(reviewCount * 0.10), // 4-star
                        Math.round(reviewCount * 0.03), // 3-star
                        Math.round(reviewCount * 0.02), // 2-star
                        0 // 1-star
                      ];
                      const total = reviewCount;
                      
                      return distribution.map((count, index) => {
                        const starRating = 5 - index;
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        
                        return (
                          <div key={starRating} className="flex items-center gap-2 sm:gap-3">
                            <div className="flex text-xs sm:text-sm md:text-base w-16 sm:w-20">
                              {starRating}{'★'.repeat(1)}
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-4 sm:h-5 overflow-hidden">
                              <div 
                                className="bg-[#B91508] h-full rounded-full transition-all duration-500" 
                                style={{width: `${percentage}%`}}
                              ></div>
                            </div>
                            <span className="text-xs sm:text-sm w-6 sm:w-8 text-right">{count}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
                
                {/* Right Side - Action Buttons */}
                <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 w-full md:w-auto">
                  <button className="bg-[#B91508] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-sm md:text-base hover:bg-[#a21307] transition-colors">
                    Write A Review
                  </button>
                  <button className="border border-[#B91508] text-[#B91508] px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-sm md:text-base hover:bg-[#B91508] hover:text-white transition-colors">
                    Ask A Question
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Refund Policy" && (
            <div className="text-start p-3 sm:p-6 md:p-8 text-xs sm:text-sm md:text-base text-gray-600 max-w-4xl mx-auto ">
            </div>
          )}
        </div>
          <YouMayAlsoLike currentProduct={product} />
          <ExploreMoreCategories />

          <Blogs />
      </div>
    </div>
  );
};

export default ProductDetails;


