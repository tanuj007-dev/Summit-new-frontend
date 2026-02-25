// import React, { useState, useEffect } from "react";
// import { Link, Navigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
// // import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
// import { TbArrowsCross } from "react-icons/tb";
// // import axios from '../../../axiosConfig';
// // import { toast } from "react-toastify";
// import { FaCartPlus } from "react-icons/fa";
// import axios from "axios";

// // axios.defaults.withCredentials = true; // Ensure credentials are sent




// const ProductCard = () => {

//     const [products, setProducts] = useState([]);
//     const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

//    useEffect(() => {
//   axios.get(
//     "http://127.0.0.1:8000/api/products/view",
//     {
//       params: {
//         search: "pressure",
//       },
//       withCredentials: true, // VERY IMPORTANT for session cookie
//     }
//   )
//   .then((res) => {
//     // API response check
//     if (res.data && Array.isArray(res.data.data)) {
//       setProducts(res.data.data);
//       console.log("Products:", res.data.data);
//     } else {
//       console.error("Unexpected API response", res.data);
//     }
//   })
//   .catch((err) => {
//     console.error("API Error:", err);
//   });
// }, []);


//     return (
//         <div className="px-4 py-5 md:px-16 md:py-16">
//             <div className="relative">
//                 <div className="md:w-full flex flex-col items-center ">
//                     <h2 className="md:text-[1.6rem] text-lg font-semibold">
//                         All Products
//                     </h2>
//                     {/* <p className="text-[#636365] md:text-lg font-semibold mt-1">
//                         Our Best Sellers
//                     </p> */}
//                 </div>

//                 {/* <div className="w-full  mx-auto mt-8 text-[#545455] font-medium flex flex-wrap justify-center gap-4 md:gap-6">
//           {categories.map((category) => {
//             const isDisabled = !categoriesWithProducts.includes(category);
//             const isSelected =
//               normalize(selectedCategory) === normalize(category);
//             return (
//               <div
//                 key={category}
//                 className={`rounded-full px-2 md:px-4 md:py-1.5 font-sans py-0.5 text-[0.625rem] md:text-sm  whitespace-nowrap text-center
//                   ${isSelected
//                     ? "bg-[#B91508] text-white"
//                     : isDisabled
//                       ? "bg-[#E9E9EB] text-[#545455] cursor-not-allowed"
//                       : "bg-[#E9E9EB] text-[#545455] cursor-pointer"
//                   }`}
//                 onClick={() => {
//                   if (!isDisabled) handlefilter(category);
//                 }}
//               >
//                 {category
//                   .split(" ")
//                   .map((w) => w[0].toUpperCase() + w.slice(1))
//                   .join(" ")}
//               </div>
//             );
//           })}
//         </div> */}

//                 <div className="mt-5">
//                     <div className="w-full">
//                         <div className="flex flex-wrap transition-transform duration-1000 ease-in-out" >

//                             {products.map((res, i) => (
//                                 <div className="w-1/4 p-2">
//                                     <div style={{ boxShadow: "box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;" }}
//                                         className="relative bg-white rounded-md shadow-md shadow-red-50 border-1 border-red-200 overflow-hidden"
//                                         key={i}
//                                     >
//                                         <TbArrowsCross
//                                             // icon={isInWishlist ? solidHeart : regularHeart}
//                                             icon={solidHeart}
//                                             style={{
//                                                 // color: isInWishlist ? "#E03B2D" : "gray",
//                                                 color: "#E03B2D",
//                                                 cursor: "pointer",
//                                                 fontSize: "20px",
//                                             }}

//                                             className="absolute top-2 right-10"
//                                         />

//                                         <FontAwesomeIcon
//                                             // icon={isInWishlist ? solidHeart : regularHeart}
//                                             icon={solidHeart}
//                                             style={{
//                                                 color: "#E03B2D",
//                                                 cursor: "pointer",
//                                                 fontSize: "20px",
//                                             }}
//                                             // onClick={() => handlewishlist(item.id)}
//                                             className="absolute top-2 right-2"
//                                         />
//                                         <div
//                                             style={{
//                                                 background: "#E03B2D",
//                                                 cursor: "pointer",

//                                                 color: "white",
//                                             }}
//                                             // onClick={() => handlewishlist(item.id)}
//                                             className="absolute top-2 left-0 px-3 rounded-r"
//                                         >{res.discount_percentage ? `${res.discount_percentage}% off` : 'New'}</div>

//                                         <div className="">
//                                             <Link className="flex"
//                                                 // to={`/879/DetailProduct/${item.id}`}
//                                                 to={`/product-details/${res.id}`}
//                                             >
//                                              <img
//   src={res.image_url || "/asset/images/dummy-image-square.jpg"}
//   alt={res.name}
//   className="w-full rounded-lg mx-auto"
//   style={{ maxHeight: "250px", objectFit: "contain" }}
// />

//                                             </Link>

//                                             <div className="bg-red-50 flex flex-col items-center w-full p-2">


//                                                 <div className="">
//                                                     {res.variants?.slice(0, 4).map((variant, index) => (
//                                                         <img 
//                                                             key={index}
//                                                             className="w-[50px] h-[50px] inline shadow border-1 border-red-500 rounded-full p-1 m-1" 
//                                                             src={variant.image_url || "/asset/images/dummy-image-square.jpg"} 
//                                                             alt={`${variant.attributes?.map(attr => attr.value).join(' ') || 'variant'}`}
//                                                         />
//                                                     ))}
//                                                 </div>

//                                                 <h5 className="text-sm font-semibold truncate mt-2">
//                                                     {res.name}
//                                                 </h5>
//                                                 <p className="text-sm font-semibold mt-2">
//                                                     <span className="font-normal text-[#3e3e3e]">
                                                  
//                                                     </span>
//                                                     Rs. <span className="text-[#B91508] font-bold">
//                                                         {res.variants?.[0]?.price ? Math.floor(res.variants[0].price) : 'N/A'}
//                                                     </span>
//                                                 </p>
//                                                 {/* <div className="flex justify-between w-full mt-3 px-2">
//                                                     <button className="w-30 rounded-full px-3 py-1 text-white bg-[#B91508] cursor-pointer  font-semibold mr-1"
//                                                     // onClick={() => buyNowHandle(item)}
//                                                     >
//                                                         Buy Now
//                                                     </button>
//                                                     <button
//                                                         className="w-30 rounded-full  px-3 py-1 color-white border-1 border-[#B91508] cursor-pointer ml-1 text-center"
//                                                     // onClick={() => handleAddToCart(item)}
//                                                     >
//                                                         <div className="flex items-center justify-center">
//                                                             <span className="inline text-[#B91508]">Cart</span> <FaCartPlus className="mx-1 text-[#B91508]" />
//                                                         </div>

//                                                     </button>
//                                                 </div> */}
//                                                     <button className="w-full rounded-full px-3 py-1 text-white bg-[#B91508] cursor-pointer  font-semibold mr-1"
//                                                     // onClick={() => buyNowHandle(item)}
//                                                     >
//                                                         View Details
//                                                     </button>
                                                  
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}

//                             {/* );
//                                 })
//                             ) : (
//                             <p className="text-center w-full">
//                                 No products found in this category.
//                             </p>
//                             )} */}
//                         </div>
//                     </div>


//                 </div>




                
//                 <div className="mt-5">
//                     <div className="w-full">
//                         <div className="flex flex-wrap transition-transform duration-1000 ease-in-out" >

//                             {products.map((product, i) =>
//                                 product.variants?.map((variant, j) => (
//                                     <div key={`${i}-${j}`} className="w-1/4 p-2">
//                                         <div
//                                             style={{
//                                                 boxShadow:
//                                                     "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
//                                             }}
//                                             className="relative bg-white rounded-md shadow-md shadow-red-50 border-1 border-red-200 overflow-hidden"
//                                         >
//                                             {/* Wishlist */}
//                                             <FontAwesomeIcon
//                                                 icon={solidHeart}
//                                                 style={{
//                                                     color: "#E03B2D",
//                                                     cursor: "pointer",
//                                                     fontSize: "20px",
//                                                 }}
//                                                 className="absolute top-2 right-2"
//                                             />

//                                             {/* Discount Tag */}
//                                             <div
//                                                 className="absolute top-2 left-0 px-3 rounded-r"
//                                                 style={{ background: "#E03B2D", color: "white" }}
//                                             >
//                                                 {product.discount_percentage ? `${product.discount_percentage}% off` : 'New'}
//                                             </div>

//                                             {/* Variant Image */}
//                                             <Link className="flex" to={`/product/${product.slug}/${variant.id}`}>
//                                                 <img
//                                                     src={variant.image_url || product.image_url || "/asset/images/dummy-image-square.jpg"}
//                                                     alt={product.name}
//                                                     className="w-full rounded-lg mx-auto"
//                                                     style={{ maxHeight: "250px" }}
//                                                 />
//                                             </Link>

//                                             {/* Product Info */}
//                                             <div className="bg-red-50 flex flex-col items-center w-full p-2">
//                                                 <h5 className="text-sm font-semibold truncate mt-2">
//                                                     {product.name}
//                                                 </h5>

//                                                 {/* Variant Attributes */}
//                                                 <p className="text-xs text-gray-600 mt-1">
//                                                     {variant.attributes.map((attr) => (
//                                                         <span key={attr.id} className="mr-1">
//                                                             <strong>{attr.attribute.name}:</strong> <span className="bg-[#B91508] px-3 text-[#fff]">{attr.value}</span><br />
//                                                         </span>
//                                                     ))}
//                                                 </p>

//                                                 {/* Price */}
//                                                 <p className="text-sm font-semibold mt-2">
//                                                     Rs.{" "}
//                                                     <span className="text-[#B91508] font-bold">
//                                                         {Math.floor(variant.price)}
//                                                     </span>
//                                                 </p>

//                                                 <div className="flex justify-between w-full mt-3 px-2">
//                                                     <button className="w-30 rounded-full px-3 py-1 text-white bg-[#B91508] cursor-pointer  font-semibold mr-1"
//                                                     // onClick={() => buyNowHandle(item)}
//                                                     >
//                                                         Buy Now
//                                                     </button>
//                                                     <button
//                                                         className="w-30 rounded-full  px-3 py-1 color-white border-1 border-[#B91508] cursor-pointer ml-1 text-center"
//                                                     // onClick={() => handleAddToCart(item)}
//                                                     >
//                                                         <div className="flex items-center justify-center">
//                                                             <span className="inline text-[#B91508]">Cart</span> <FaCartPlus className="mx-1 text-[#B91508]" />
//                                                         </div>

//                                                     </button>
//                                                 </div>


//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))
//                             )}


//                         </div>
//                     </div>


//                 </div>

//                 <div className="mt-5">
//                     <div className="w-full">
//                         <div className="flex flex-wrap transition-transform duration-1000 ease-in-out" >

//                             {products.map((product, i) =>
//                                 product.variants?.map((variant, j) => (
//                                     <div key={`${i}-${j}`} className="w-1/4 p-2">
//                                         <div
//                                             style={{
//                                                 boxShadow:
//                                                     "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
//                                             }}
//                                             className="relative bg-white rounded-md shadow-md shadow-red-50 border-1 border-red-200 overflow-hidden"
//                                         >
//                                             {/* Wishlist */}
//                                             <FontAwesomeIcon
//                                                 icon={solidHeart}
//                                                 style={{
//                                                     color: "#E03B2D",
//                                                     cursor: "pointer",
//                                                     fontSize: "20px",
//                                                 }}
//                                                 className="absolute top-2 right-2"
//                                             />

//                                             {/* Discount Tag */}
//                                             <div
//                                                 className="absolute top-2 left-0 px-3 rounded-r"
//                                                 style={{ background: "#E03B2D", color: "white" }}
//                                             >
//                                                 {product.discount_percentage ? `${product.discount_percentage}% off` : 'New'}
//                                             </div>

//                                             {/* Variant Image */}
//                                             <Link className="flex" to={`/product/${product.slug}/${variant.id}`}>
//                                                 <img
//                                                     src={variant.image_url || product.image_url || "/asset/images/dummy-image-square.jpg"}
//                                                     alt={product.name}
//                                                     className="w-full rounded-lg mx-auto"
//                                                     style={{ maxHeight: "250px" }}
//                                                 />
//                                             </Link>

//                                             {/* Product Info */}
//                                             <div className="bg-red-50 flex flex-col items-center w-full p-2">
//                                                 <h5 className="text-sm font-semibold text-center mt-2">
//                                                     {product.name} {variant.attributes.map((attr) => (
//                                                         <span key={attr.id} className="mr-1">
//                                                        {attr.value}
//                                                         </span>
//                                                     ))}
//                                                 </h5>
 

//                                                 {/* Price */}
//                                                 <p className="text-sm font-semibold mt-2">
//                                                     Rs.{" "}
//                                                     <span className="text-[#B91508] font-bold">
//                                                         {Math.floor(variant.price)}
//                                                     </span>
//                                                 </p>

//                                                 <div className="flex justify-between w-full mt-3 px-2">
//                                                     <button className="w-30 rounded-full px-3 py-1 text-white bg-[#B91508] cursor-pointer  font-semibold mr-1"
//                                                     // onClick={() => buyNowHandle(item)}
//                                                     >
//                                                         Buy Now
//                                                     </button>
//                                                     <button
//                                                         className="w-30 rounded-full  px-3 py-1 color-white border-1 border-[#B91508] cursor-pointer ml-1 text-center"
//                                                     // onClick={() => handleAddToCart(item)}
//                                                     >
//                                                         <div className="flex items-center justify-center">
//                                                             <span className="inline text-[#B91508]">Cart</span> <FaCartPlus className="mx-1 text-[#B91508]" />
//                                                         </div>

//                                                     </button>
//                                                 </div>


//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))
//                             )}


//                         </div>
//                     </div>


//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductCard;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../axiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";

/* =========================
   Helper functions
========================= */
const getProductImage = (product) => {
  if (product?.images?.length > 0 && product.images[0]?.url) {
    return product.images[0].url; // S3 presigned URL
  }
  return "/asset/images/dummy-image-square.jpg";
};

const getVariantImage = (variant) => {
  if (variant?.images?.length > 0 && variant.images[0]?.url) {
    return variant.images[0].url;
  }
  return "/asset/images/dummy-image-square.jpg";
};

const getProductPrice = (product) => {
  if (product?.variants?.length > 0) {
    return Math.floor(product.variants[0].price);
  }
  return "N/A";
};

/* =========================
   Component
========================= */
const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch random products without specific search term
    axiosInstance
      .get("/api/products/view", {
        params: { 
          per_page: 12, // Get 12 random products
          sort: 'random' // Try to sort randomly if API supports it
        }
      })
      .then((res) => {
        console.log("API RESPONSE 👉", res.data);
        const productsData = res.data?.data || res.data || [];
        setProducts(productsData);
      })
      .catch((err) => {
        console.error("API ERROR ❌", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* =========================
     Loading State
  ========================= */
  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 text-lg">
        Loading products...
      </div>
    );
  }

  /* =========================
     Empty State
  ========================= */
  if (!products.length) {
    return (
      <div className="py-20 text-center text-gray-500 text-lg">
        No products found
      </div>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="px-4 py-10 md:px-16">
      <h2 className="text-center text-2xl font-semibold mb-8">
        All Products
      </h2>

      <div className="flex flex-wrap">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3"
          >
            <div className="relative bg-white rounded-lg shadow-md border border-red-200 overflow-hidden">

              {/* Wishlist */}
              <FontAwesomeIcon
                icon={solidHeart}
                className="absolute top-2 right-2 text-[#B91508] cursor-pointer"
              />

              {/* Discount */}
              <div className="absolute top-2 left-0 px-3 py-1 text-xs bg-[#B91508] text-white rounded-r">
                {product.discount_percentage
                  ? `${product.discount_percentage}% OFF`
                  : "NEW"}
              </div>

              {/* Image */}
              <Link to={`/product-details/${product.id}`}>
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="w-full h-[250px] object-contain bg-white"
                />
              </Link>

              {/* Content */}
              <div className="bg-red-50 p-3 text-center">
                <h5 className="text-sm font-semibold truncate">
                  {product.name}
                </h5>

                {/* Variant Thumbnails */}
                <div className="flex justify-center gap-2 mt-2">
                  {product.variants?.slice(0, 4).map((variant) => (
                    <img
                      key={variant.id}
                      src={getVariantImage(variant)}
                      className="w-10 h-10 rounded-full border object-contain bg-white"
                      alt="variant"
                    />
                  ))}
                </div>

                {/* Price */}
                <p className="text-sm mt-2">
                  Rs.{" "}
                  <span className="font-bold text-[#B91508]">
                    {getProductPrice(product)}
                  </span>
                </p>

                {/* CTA */}
                <Link
                  to={`/product-details/${product.id}`}
                  className="block mt-3"
                >
                  <button className="w-full rounded-full px-4 py-1.5 bg-[#B91508] text-white font-medium">
                    View Details
                  </button>
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
