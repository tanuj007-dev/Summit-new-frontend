// import React, { useContext, useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { FaStar, FaRegStar, FaChevronLeft, FaChevronRight, FaChevronUp, FaChevronDown } from "react-icons/fa";
// import { Share2, Users } from "lucide-react";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import FeedbackProduct from "../FeedbackProduct";
// import { faHeart, faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
// import { FaCartPlus } from "react-icons/fa";
// import { TbArrowsCross } from "react-icons/tb";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';

// import { toast } from "react-toastify";
// import axios from "axios";
// import Blogs from "../Blogs";



// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { CartContext } from "../../context/CartContext";

// const ProductDetails = () => {

//   const [copied, setCopied] = useState(false);
//   const tabs = ["Description", "Additional info", "Reviews", "Refund Policy"];
//   const [activeTab, setActiveTab] = useState("Description");

//   // const visibleCount = 4;
//   // const [pincode, setPincode] = useState('');
//   // const [estimatedDate, setEstimatedDate] = useState(null);
//   // const [error, setError] = useState('');
//   // const [bigImage, setBigImage] = useState('/asset/images/dummy-image-square.jpg');
//   // const calculateDays = (pin) => {
//   //   const firstDigit = pin.charAt(0);
//   //   switch (firstDigit) {
//   //     case '1':
//   //       return 2;
//   //     case '2':
//   //       return 3;
//   //     case '3':
//   //     case '4':
//   //       return 4;
//   //     case '5':
//   //     case '6':
//   //       return 5;
//   //     case '7':
//   //     case '8':
//   //       return 6;
//   //     default:
//   //       return null;
//   //   }
//   // };

//   const handleCopy = () => {
//     const currentUrl = window.location.href;

//     navigator.clipboard.writeText(currentUrl)
//       .then(() => {
//         setCopied(true);
//         setTimeout(() => setCopied(false), 1500); // hide after 1.5 sec
//       })
//       .catch((err) => {
//         console.error('Failed to copy: ', err);
//       });
//   };



//   /*----------------new code---------------------*/
//   const param = useParams();
//   const baseURL = import.meta.env.VITE_APP_API_BASE_URL;
//   const imageURL = import.meta.env.VITE_APP_IMAGE_BASE_URL;
//   const [product, setProduct] = useState({});
//   const [activeProductVariant, setActiveProductVariant] = useState(0);
//   const { handleAddToCart, handleBuyNow } = useContext(CartContext);
//   // axios.defaults.withCredentials=true;
//   // console.log("Param",param);

//   useEffect(() => {
//     /////for slider Image 
//     setNav1(mainSlider.current);
//     setNav2(thumbSlider.current);


//     ////for product fetch
//     axios.get(`${baseURL}products/${param.slug}`)
//       .then((res) => {
//         setProduct(res.data);
//         // setActiveProductVariant(res.data);
//         // console.log("ressss", res.data);
//       }).catch((e) => console.log("Error in fetching Product Details : ", e));

//   }, [param.slug]);

//   if (!product) {
//     return <div>Product not found</div>;
//   }

//   //*--------------------------------------neww---------------------------*//
//   const mainSlider = useRef(null);
//   const thumbSlider = useRef(null);

//   const [nav1, setNav1] = useState(null);
//   const [nav2, setNav2] = useState(null);
//   const [activeIndex, setActiveIndex] = useState(0);

//   // Flatten images
//   const allImages = [];
//   product?.variants?.forEach((variant) => {
//     if (variant.image) allImages.push({ src: variant.image, id: `v-${variant.id}` });
//     variant?.images?.forEach((img) => {
//       if (img.image) allImages.push({ src: img.image, id: `i-${img.id}` });
//     });
//   });

//   const mainSettings = {
//     asNavFor: nav2,
//     arrows: true,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     infinite: true,
//     beforeChange: (oldIndex, newIndex) => setActiveIndex(newIndex),
//   };

//   const thumbSettings = {
//     asNavFor: nav1,
//     slidesToShow: 5.2,
//     slidesToScroll: 1,
//     vertical: true,
//     focusOnSelect: true,
//     arrows: false,
//     infinite: false,
//   };

//   return (
//     <>
//       {/* <div className="text-xs mb-2 py-2 bg-red-50 px-16 font-bold">
//         Home / {selectedProduct.product_category} /{" "}
//         {selectedProduct.product_sub_category} / <span className="text-[#B91508]">{selectedProduct.name}</span>
//       </div> */}
//       <div className="text-xs mb-2 py-2 bg-red-50 px-16 font-bold">
//         Home / {product?.category?.name} /{" "} <span className="text-[#B91508]">{product?.name}</span>
//       </div>
//       <div className="md:px-16 px-4">
//         <div className="w-full flex flex-col items- md:flex-row pb-10 overflow-visible">
//           <div className="w-full md:w-[55%]">

//             <div className="flex gap-4 pt-9 overflow-hidden">
//               {/* Vertical Thumbnails */}
//               <div className="w-[95px] max-h-[500px] relative">
//                 {/* Up arrow */}
//                 <button
//                   onClick={() => thumbSlider.current.slickPrev()}
//                   className="absolute -top-9 left-1/2 -translate-x-1/2 z-10 text-white p-2 rounded-full text-sm bg-red-700 text-2xl"
//                 >
//                   <FaChevronUp />
//                 </button>

//                 <Slider {...thumbSettings} ref={thumbSlider}>
//                   {allImages.map((img, idx) => (
//                     <div
//                       key={img.id}
//                       className={`p-1 cursor-pointer border-2 rounded-md ${idx === activeIndex ? "border-red-600" : "border-transparent"
//                         }`}
//                     >
//                       <img
//                         src={`${imageURL}${img.src}`}
//                         alt={`thumb-${idx}`}
//                         className="w-full"
//                       />
//                     </div>
//                   ))}
//                 </Slider>

//                 {/* Down arrow */}
//                 <button
//                   onClick={() => thumbSlider.current.slickNext()}
//                   className="absolute -bottom-20 left-1/2 -translate-x-1/2 z-10 text-white p-2 rounded-full text-sm bg-red-700 text-2xl"
//                 >
//                   <FaChevronDown />
//                 </button>
//               </div>

//               {/* Main Horizontal Slider */}
//               <div className="w-[80%] max-h-[500px] relative">
//                 {/* Left arrow */}
//                 <button
//                   onClick={() => mainSlider.current.slickPrev()}
//                   className="absolute top-1/2 -left-2 -translate-y-1/2 z-10 text-white p-2 rounded-full text-sm bg-red-700 text-3xl"
//                 >
//                   <FaChevronLeft />
//                 </button>

//                 {/* Right arrow */}
//                 <button
//                   onClick={() => mainSlider.current.slickNext()}
//                   className="absolute top-1/2 -right-2 -translate-y-1/2 z-10 text-white p-2 rounded-full text-sm bg-red-700 text-3xl"
//                 >
//                   <FaChevronRight />
//                 </button>

//                 <Slider {...mainSettings} ref={mainSlider}>
//                   {allImages.map((img) => (
//                     <div key={img.id}>
//                       <img className="max-h-[500px] w-full object-contain"
//                         src={`${imageURL}${img.src}`}
//                         alt="product"
//                       />
//                     </div>
//                   ))}
//                 </Slider>
//               </div>
//             </div>


//           </div>
//           <div className="w-full md:w-[45%]">


//             <div className="sticky top-0">



//               <div className="w-full flex justify-between items-center">
//                 <div>
//                   <span className="bg-[#B91508] text-white py-1 px-3 text-sm mr-1">
//                     {product?.category?.name}
//                   </span>
//                   {/* <span className="bg-[#B91508] text-white py-1 px-3 text-sm mr-1">
//                   Fine
//                 </span>
//                 <span className="bg-[#B91508] text-white py-1 px-3 text-sm m-1">
//                   Prime
//                 </span>
//                 <span className="bg-[#B91508] text-white py-1 px-3 text-sm m-1">
//                   Supreme
//                 </span>
//                 <span className="bg-[#B91508] text-white py-1 px-3 text-sm m-1">
//                   Heavy
//                 </span>
//                 <span className="bg-[#B91508] text-white py-1 px-3 text-sm m-1">
//                   Ultimate
//                 </span> */}

//                 </div>
//                 <div className="flex items-center gap-0.5">
//                   <FaStar className="text-[#B91508]" />
//                   <FaStar className="text-[#B91508]" />
//                   <FaStar className="text-[#B91508]" />
//                   <FaStar className="text-[#B91508]" />
//                   <FaStar className="text-[#B91508]" />
//                   <span className="ml-3">0 reviews</span>{" "}
//                   {/* Copy button */}
//                   <div className="relative inline-block">
//                     <span
//                       className="font-bold"
//                       onClick={handleCopy}
//                     >
//                       <Share2 size={15} strokeWidth={2} />
//                     </span>

//                     {/* Tooltip */}
//                     {copied && (
//                       <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-90">
//                         Copied!
//                       </div>
//                     )}
//                   </div>


//                 </div>{" "}
//               </div>


//               <h1 className="text-lg font-semibold mt-3">
//                 {product.name}&nbsp;
//                 {product?.variants?.map((variantGroup, i) =>
//                 (variantGroup?.attributes?.map((attr, j) => (
//                   <span key={j}>{(i == 0) ? "" : "/"}{attr.value}</span>
//                 ))
//                 )
//                 )}

//               </h1>


//               <span className="bg-[#F5F5F7] text-xs rounded-sm text-[#636365] px-2 py-0.5 font-semibold">
//                 SKU: &nbsp;
//                 {/* {selectedProduct.sku} */}
//                 {product?.variants?.[activeProductVariant]?.sku}
//               </span>


//               <div className="price">
//                 <p className="font-bold text-xl mt-3">
//                   <span className="bg-[#] rounded-sm text-[#919191] pr-2 py-0.5 font-semibold">
//                     ₹
//                     {/* <span className="line-through decoration-2">{selectedProduct.price}</span> */}
//                     <span className="line-through decoration-2">{product?.variants?.[activeProductVariant]?.mrp}</span>

//                   </span>  {" "}
//                   ₹ {product?.variants?.[activeProductVariant]?.price}



//                   <span className="ml-3 bg-[#F5F5F7] rounded-sm text-[#B91508] px-2 py-0.5 font-semibold">
//                     {Math.floor(100 - parseInt(((product?.variants?.[activeProductVariant]?.price) / (product?.variants?.[activeProductVariant]?.mrp)) * 100))}% Off
//                   </span>
//                 </p>
//                 <p className="text-xs mt-1">(Inclusive of all taxes)</p>
//               </div>




//               <div className="bg-[#FAFAFC] items-center text-xs justify-center w-full grid-cols-2 grid md:grid-cols-3 gap-2 p-3 space-y-1  mt-2 rounded-sm text-center">
//                 <div className="flex justify-start items-center gap-2 mb-0">
//                   <img
//                     src="/asset/iconvector/Vector.png"
//                     alt=""
//                     className="w-4 h-4"
//                   />
//                   <span> </span>
//                 </div>
//                 <div className="flex justify-start items-center gap-2 mb-0">
//                   <img
//                     src="/asset/iconvector/basil_stack-solid.png"
//                     alt=""
//                     className="w-4 h-4"
//                   />
//                   <span>Long-lasting 3 Layer Body</span>
//                 </div>

//                 <div className="flex justify-start items-center gap-2 mb-0">
//                   <img
//                     src="/asset/iconvector/emojione-monotone_pot-of-food.png"
//                     className="w-4 h-4"
//                     alt=""
//                   />
//                   <span>No Food Burning/Sticking</span>
//                 </div>

//                 <div className="flex justify-start items-center gap-2 mb-0">
//                   <img
//                     src="/asset/iconvector/Vector (3).png"
//                     alt=""
//                     className="w-4 h-4"
//                   />
//                   <span>Super Easy to Clean</span>
//                 </div>

//                 <div className="flex justify-start items-center gap-2 mb-0">
//                   <img
//                     src="/asset/iconvector/Vector (4).png"
//                     alt=""
//                     className="w-4 h-4"
//                   />
//                   <span>Heating & Fast Cooking</span>
//                 </div>

//                 <div className="flex justify-start items-center gap-2 mb-0">
//                   <img
//                     src="/asset/iconvector/Vector (5).png"
//                     alt=""
//                     className="w-4 h-4"
//                   />
//                   <span> ISI & ISO 9001 Certified</span>
//                 </div>
//               </div>




//               <div className="mt-2">

//                 <div className="varieties">
//                   <h4 className="text-xl font-semibold mt-2">More Varieties</h4>
//                   <div className="flex flex-wrap">
//                     {product.variants?.map((variant, key) => {
//                       // Shape = main label
//                       const shapeAttr = variant.attributes.find(
//                         (attr) => attr.attribute.name === "Shape"
//                       );

//                       // Other attributes inline
//                       const otherAttrs = variant.attributes.filter(
//                         (attr) => attr.attribute.name !== "Shape"
//                       );

//                       return (
//                         <div
//                           key={variant.id}
//                           className="w-1/4 text-center cursor-pointer" onClick={() => setActiveProductVariant(key)}
//                         >
//                           <div className="shadow-md border border-gray-200 m-2 rounded-md overflow-hidden hover:shadow-lg transition">
//                             {shapeAttr && <>
//                               {/* Variant Image */}
//                               <img onLoad={() => setBigImage(imageURL + variant.image)}
//                                 src={(variant.image) ? imageURL + variant.image : "/asset/images/dummy-image-square.jpg"}
//                                 alt={product.name}
//                                 className="w-full max-h-[100px] object-cover"
//                               />

//                               {/* Shape Label */}
//                               <p className="text-center font-semibold text-sm bg-gray-100 py-1">
//                                 {shapeAttr ? shapeAttr.value : "Variant"}
//                               </p> </>}

//                             {/* Other attributes inline like Amazon */}
//                             <div className={((activeProductVariant == key) ? "bg-[#B91508] text-white" : "bg-[#F5F5F7]text-gray-700") + " px-2 py-1 text-xs  font-bold"}>
//                               <p>
//                                 {otherAttrs.map((attr, idx) => (
//                                   <span className={((activeProductVariant == key) ? "text-white" : "text-[#B91508]") + " text-sm  px-3 py-2 display-block rounded-sm"} key={attr.id}>
//                                     {attr.value}
//                                     {idx < otherAttrs.length - 1 ? " | " : ""}
//                                   </span>
//                                 ))}
//                               </p>

//                               {/* Price */}
//                               <p className={((activeProductVariant == key) ? "text-white" : "text-[#B91508]") + " font-bold text-lg mt-1"}>
//                                 ₹ {variant.price}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}


//                     {/* <div class="w-1/4 text-center cursor-pointer">
//                     <div class="shadow-md border border-gray-200 m-2 rounded-md overflow-hidden hover:shadow-lg transition">
//                       <div class="px-2 py-1 text-xs text-white font-bold bg-[#B91508]">
//                         <p>
//                           <span class="text-sm  px-3 py-2 display-block rounded-sm">2.5L</span>
//                         </p>
//                         <p class="font-bold text-lg text-white mt-1">₹ 1450</p>
//                       </div>
//                     </div>
//                   </div> */}


//                   </div>
//                 </div>

//                 <h1 className="flex items-center">
//                   {/* <span className="font-semibold">Capacity : </span> */}
//                   {/* <p className="ml-2 text-[#636365] "> </p> */}
//                 </h1>
//                 <div className="flex gap-2 flex-wrap text-sm">
//                   {/* {[
//                   ...new Map(
//                     selectedsku.slice() // clone array to avoid mutation
//                       .sort((a, b) => {
//                         const getSizeValue = (str) => parseFloat(str); // "2 Liters" => 2
//                         return getSizeValue(a.size) - getSizeValue(b.size);
//                       }).map((item) => [item.size, item])
//                   ).values(),
//                 ].map((item, index) => (
//                   <Link key={index} to={`/879/ProductDetails/${item.id}`}>
//                     <p
//                       onClick={() => setSelectedWeight(item.size)} // This updates the selected item
//                       className={`${selectedWeight === item.size
//                         ? "bg-[#B915080D] text-[#B91508] border-1 border-[#B91508]" // Red background when clicked
//                         : "bg-[#F5F5F7] text-[#636365]" // Default background
//                         } rounded-sm px-2 py-0.5 font-semibold`}
//                     >
//                       {item.size}
//                     </p>
//                   </Link>
//                 ))} */}
//                 </div>
//                 <div></div>
//               </div>


//               <div className="flex gap-8">
//                 <div>
//                   {/* <p className="font-semibold mb-2">Shape:</p> */}
//                   {/* <span
//                   className={`${selectshape === "plain"
//                     ? "bg-[#B915080D] text-[#B91508] border-1 border-[#B91508]"
//                     : "bg-[#F5F5F7] text-[#636365]"
//                     }  rounded-md  px-2 py-0.5 font-semibold cursor-pointer`}
//                   onClick={() => {
//                     // setselectShape("plain");
//                     hanlderPlainshap();
//                   }}
//                 >
//                   Plain
//                 </span>
//                 <span
//                   className={`${selectshape == "pan"
//                     ? "bg-[#B915080D] text-[#B91508] border-1 border-[#B91508]"
//                     : "bg-[#F5F5F7] text-[#636365]"
//                     }bg-[#F5F5F7]  rounded-md text-[#636365] px-2 py-0.5 font-semibold ml-2 cursor-pointer`}
//                   onClick={() => {
//                     // setselectShape("pan");
//                     hanlderPanShap();
//                   }}
//                 >
//                   pan
//                 </span> */}
//                 </div>
//                 <div>
//                   {/* <p className="font-semibold mb-2">Bottom:</p> */}
//                   {/* {
//                   bottomFilter.map((filter) => (
//                     <>
//                       <span
//                         onClick={() => {
//                           setselectBottom(filter);

//                           hanlderInduction();
//                         }}
//                         className={`${selectBottom === filter
//                           ? "bg-[#B915080D] text-[#B91508] border-1 border-[#B91508]"
//                           : "bg-[#F5F5F7] text-[#636365]"
//                           }bg-[#F5F5F7]  rounded-md text-[#636365] px-2 py-0.5 font-semibold ml-2 cursor-pointer`}
//                       >
//                         {filter}
//                       </span>
//                     </>
//                   ))
//                   }*/}
//                 </div>
//               </div>


//               <div className="mt-2 flex md:justify- gap-5">
//                 <button
//                   onClick={() => handleAddToCart(product?.variants?.[activeProductVariant]?.id)}
//                   className="bg-[#B91508] hover:bg-[#a21307] active:bg-[#7e0f06] text-white border border-[#B91508] px-8 md:px-15 py-2 font-semibold rounded-full cursor-pointer hover:shadow-md hover:scale-105 active:scale-95 transform transition-all duration-150"
//                 >
//                   Add to cart
//                 </button>
//                 <button onClick={() => handleBuyNow(product?.variants?.[activeProductVariant]?.id)} className=" rounded-full  border-1 text-[#B91508]  border-[#B91508] px-8 md:px-15 py-2 font-semibold cursor-pointer">
//                   Buy Now
//                 </button>
//               </div>

//               {/* <div className="mt-5">
//               <div className="flex gap-5">
//                 <div className="flex items-center text-lg text-[#636365] gap-1">
//                   {" "}
//                   <img
//                     src="/asset/iconvector/bitcoin-icons_tag-filled.png"
//                     alt=""
//                     className="w-4 h-4"
//                   />
//                   <p className="text-[#636365] text-sm">
//                     Free shipping on orders ₹1199 & above
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   {" "}
//                   <img
//                     src="/asset/iconvector/hugeicons_delivery-return-01.png"
//                     alt=""
//                     className="w-4 h-4"
//                   />
//                   <p className="text-[#636365] text-sm">
//                     Easy returns within 7 days
//                   </p>
//                 </div>
//               </div>

//               <div className="flex flex-col gap-2 mt-4">
//                 <div className="flex items-center gap-4">
//                   <input
//                     type="text"
//                     placeholder="Enter your Pin Code"
//                     className="p-2 border-2 border-gray-300 placeholder:text-sm placeholder:font-semibold rounded-lg"
//                     value={pincode}
//                     onChange={(e) => setPincode(e.target.value)}
//                   />
//                   <button
//                     className="rounded-lg border border-[#B91508] text-[#B91508] p-2 font-semibold"
//                     onClick={handleCheck}
//                   >
//                     Check Now
//                   </button>

//                 </div>
//                 <div className="text-[#636365]">
//                   Enter pincode to view delivery details
//                 </div>


//                 {error && (
//                   <div className="text-red-600 font-semibold">{error}</div>
//                 )}

//                 {estimatedDate && !error && (
//                   <div className="text-green-700 font-semibold mt-2">
//                     🚚 {estimatedDate}
//                   </div>
//                 )}
//               </div>
//             </div> */}


//               {/* <div className="varieties">
//               <h4 className="text-lg font-semibold mt-2">More Varieties</h4>
//               <div className="flex flex-wra ">
//                 <div className="w-1/4">
//                   <div className="shadow-lg border-1 border-red-100 m-1 rounded-md overflow-hidden">
//                     <img src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Aluminium/variant_114/1753788865_6888b1c1ef007.jpg" />
//                     <p className="text-center font-bold bg-red-200 py-1">Plain</p>
//                   </div>
//                 </div>
//                 <div className="w-1/4">
//                   <div className="shadow-lg border-1 border-red-100 m-1 rounded-md overflow-hidden">
//                     <img src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" />
//                     <p className="text-center font-bold bg-red-200 py-1">Pan</p>
//                   </div>
//                 </div>
//                 <div className="w-1/4">
//                   <div className="shadow-lg border-1 border-red-100 m-1 rounded-md overflow-hidden">
//                     <img src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" />
//                     <p className="text-center font-bold bg-red-200 py-1">C-Tura</p>
//                   </div>
//                 </div>
//                 <div className="w-1/4">
//                   <div className="shadow-lg border-1 border-red-100 m-1 rounded-md overflow-hidden">
//                     <img src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" />
//                     <p className="text-center font-bold bg-red-200 py-1">Handi</p>
//                   </div>
//                 </div>
//               </div>
//             </div> */}



//             </div>
//             {/* -------------------end--------------- */}
//           </div>
//         </div>




//         <div className="mt-8">
//           {/* Tabs */}
//           <div className="flex justify-center text-xs md:text-lg text-black">
//             {tabs.map((tab) => (
//               <div
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className="relative md:px-12 px-2 py-2 cursor-pointer"
//               >
//                 <div className={`${activeTab === tab ? "text-red-700" : ""}`}>
//                   {tab}
//                 </div>
//                 {/* Red underline on active tab, full gray underline already exists */}
//                 <div
//                   className={
//                     activeTab === tab
//                       ? "absolute bottom-[-1px] left-0 right-0 h-1 bg-red-700"
//                       : "absolute bottom-[-1px] left-0 right-0 h-1 bg-gray-200"
//                   }
//                 />
//               </div>
//             ))}
//           </div>

//           {/* -------------------------conditional rendering---------------------------- */}

//           <div className=" p-4 mt-4">
//             {activeTab === "Description" &&
//               <div className="additional-info text-xs">



//                 <table class="mx-auto table-auto w-full md:w-1/2 md:table-fixed border-spacing-2 border-collapse border border-gray-400 ...">
//                   <tbody>
//                     <tr>
//                       <td class="border border-gray-300"><strong>HSN Code:</strong></td>
//                       {/* <td class="border border-gray-300">{selectedProduct.hsn}</td> */}
//                       <td class="border border-gray-300">HSCSDCODEDE</td>
//                     </tr>
//                     <tr>
//                       <td class="border border-gray-300"><strong> Product Weight:</strong></td>
//                       {/* <td class="border border-gray-300">{selectedProduct.weight} kg</td> */}
//                       <td class="border border-gray-300">50 kg</td>
//                     </tr>
//                     <tr>
//                       <td class="border border-gray-300"><strong>Dimensions:</strong></td>
//                       {/* <td class="border border-gray-300">{selectedProduct.dimensions}</td> */}
//                       <td class="border border-gray-300">50x60x70</td>
//                     </tr>

//                     <tr>
//                       <td class="border border-gray-300"><strong>Package Dimensions:</strong></td>
//                       {/* <td class="border border-gray-300">{selectedProduct.package_dimensions}</td> */}
//                       <td class="border border-gray-300">Package Di</td>
//                     </tr>


//                     <tr>
//                       <td class="border border-gray-300"><strong>Material:</strong> </td>
//                       {/* <td class="border border-gray-300">{selectedProduct.material}</td> */}
//                       <td class="border border-gray-300">steel</td>
//                     </tr>

//                     <tr>
//                       <td class="border border-gray-300"><strong>Shape:</strong></td>
//                       {/* <td class="border border-gray-300">{selectedProduct.shape}</td> */}
//                       <td class="border border-gray-300">Shape</td>
//                     </tr>

//                     <tr>
//                       <td class="border border-gray-300"><strong>Bottom Type:</strong></td>
//                       {/* <td class="border border-gray-300">{selectedProduct.bottom_type.trim()}</td> */}
//                       <td class="border border-gray-300">plain</td>
//                     </tr>

//                     <tr>
//                       <td class="border border-gray-300"><strong>Size:</strong></td>
//                       {/* <td class="border border-gray-300">{selectedProduct.size}</td> */}
//                       <td class="border border-gray-300">Sizes</td>
//                     </tr>

//                     <tr>
//                       <td class="border border-gray-300"><strong>Tax Rate:</strong></td>
//                       {/* <td class="border border-gray-300">{selectedProduct.tax_rate}</td> */}
//                       <td class="border border-gray-300">Tax</td>
//                     </tr>

//                     <tr>
//                       <td class="border border-gray-300"><strong>Warranty:</strong></td>
//                       {/* <td class="border border-gray-300">{selectedProduct.warranty}</td> */}
//                       <td class="border border-gray-300">1 Years</td>
//                     </tr>


//                   </tbody>
//                 </table>
//               </div>}

//             {activeTab === "Additional info" && product && (

//               <div className="bg-white shadow-md rounded-md p-6 max-w-4xl mx-auto mt-10" dangerouslySetInnerHTML={{ __html: product?.description }} />)}
//             {activeTab === "Reviews" && product && (

//               <section className="bg-white shadow-md rounded-md p-6 max-w-4xl mx-auto mt-10">
              

                 
//               </section>
//             )}
//             {activeTab === "Refund Policy" && product && (

//               <section className="bg-white shadow-md rounded-md p-6 max-w-4xl mx-auto mt-10">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-4">Refund & Exchange Policy</h1>

//                 <h2 className="text-xl font-semibold text-gray-700 mb-2">Who Is Eligible For a Refund</h2>
//                 <p className="text-gray-700 mb-4">
//                   Our refund policy is <strong>15 Days</strong>. Unfortunately, we can’t offer you a refund or exchange after this period.
//                   To be eligible for a return:
//                 </p>
//                 <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
//                   <li>The item must be unused and in the same condition that you received it.</li>
//                   <li>The item must be in the original packaging.</li>
//                   <li>A receipt or proof of purchase is required to complete your return.</li>
//                 </ul>

//                 <h2 className="text-xl font-semibold text-gray-700 mb-2">When Refund Is Available</h2>
//                 <p className="text-gray-700 mb-4">
//                   Once your return is received and inspected, we will notify you via email. You will be informed about the approval or rejection of your refund.
//                   If approved, the refund will be processed, and a credit will automatically be applied to your original method of payment within a few business days.
//                 </p>

//                 <h2 className="text-xl font-semibold text-gray-700 mb-2">How To Exchange Products?</h2>
//                 <p className="text-gray-700 mb-4">
//                   We only replace items if they are <strong>defective or damaged</strong>. If you need to exchange an item for the same product, please:
//                 </p>
//                 <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
//                   <li>Email us at <a href="mailto:retail@physiozoom.com" className="text-blue-600 underline">retail@summithomeappliance.com</a></li>
//                   <li>Or submit an exchange request via your “<strong>My Account</strong>” dashboard.</li>
//                 </ul>

//                 <h3 className="text-lg font-medium text-gray-700 mb-2">Product will be replaced only if the following conditions are met:</h3>
//                 <ul className="list-disc list-inside text-gray-700 space-y-1">
//                   <li>The product was not customized after purchase.</li>
//                   <li>The product is not destroyed or physically damaged.</li>
//                   <li>The replacement request is made within <strong>7 days</strong> of receiving the product.</li>
//                   <li>The item is returned in its original packaging.</li>
//                   <li>All conditions must meet the company’s official return and replacement policies.</li>
//                 </ul>
//               </section>
//             )}

//             {activeTab === "Review" && <ShowReview product_id={product_id} />}
//             {activeTab === "Write feedback" && (
//               <ReviewTaken id={product_id} isLoggedIn={isLoggedIn} />
//             )}
//           </div>

//           {/* ------------------------------conditional rendering end ------------------------ */}
//         </div>




//         {/* ------------------product you may like ------------------ */}


//         <div className="mt-5 relative">
//           <h1 className="text-center mb-8 text-2xl font-semibold">
//             You May Also Like
//           </h1>

//           <div className="w-full">
//             <div className="flex flex-wrap transition-transform duration-1000 ease-in-out" >


//               {product?.related?.map((product, i) => (


//                 <div key={`${i}`} className="w-full md:w-1/4 p-2">
//                   <div
//                     style={{
//                       boxShadow:
//                         "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
//                     }}
//                     className="relative bg-white rounded-md shadow-md shadow-red-50 border-1 border-red-200 overflow-hidden"
//                   >
//                     {/* Wishlist */}
//                     <FontAwesomeIcon
//                       icon={faHeart}
//                       style={{
//                         color: "#E03B2D",
//                         cursor: "pointer",
//                         fontSize: "20px",
//                       }}
//                       className="absolute top-2 right-2"
//                     />

//                     {/* Discount Tag */}
//                     <div
//                       className="absolute top-2 left-0 px-3 rounded-r"
//                       style={{ background: "#E03B2D", color: "white" }}
//                     >
//                       {Math.floor(100 - parseInt(((product?.variants?.[0]?.price) / (product?.variants?.[0]?.mrp)) * 100))}% off
//                     </div>

//                     {/* Variant Image */}
//                     <Link className="flex" to={`/product-details/${product.id}`}>
//                       <img
//                         src={(product?.variants[0]?.image) ? (`${imageURL}${product?.variants[0]?.image}`) : "/asset/images/dummy-image-square.jpg"}
//                         alt={product.name}
//                         className="w-full rounded-lg mx-auto"
//                         style={{ maxHeight: "250px" }}
//                       />
//                     </Link>

//                     {/* Product Info */}
//                     <div className="bg-red-50 flex flex-col items-center w-full p-2">
//                       <Link className="flex" to={`/product-details/${product.id}`}>
//                         <h5 className="text-sm font-semibold text-center mt-2">
//                           {product.name}&nbsp;{product?.variants?.map((variantGroup, i) =>
//                           (variantGroup?.attributes?.map((attr, j) => (
//                             <span key={j}>{(i == 0) ? "" : "/"}{attr.value}</span>
//                           ))
//                           )
//                           )}
//                         </h5>
//                       </Link>
//                       {/* {product?.variants?.map((variant, j) => (
//                                                 {
//                                                     variant.attributes.map((attr) => (
//                                                         <span key={attr.id} className="mr-1">
//                                                             {attr.value}
//                                                         </span>))
//                                                 }
//                                             ))} */}
//                       {/* Price */}
//                       < p className="text-sm font-semibold mt-2" >
//                         <span className="bg-[#] rounded-sm text-[#919191] pr-2 py-0.5 font-semibold">
//                           ₹
//                           {/* <span className="line-through decoration-2">{selectedProduct.price}</span> */}
//                           <span className="line-through decoration-2">{product?.variants?.[0]?.mrp}</span>

//                         </span>  {" "}
//                         ₹ 
//                         < span className="text-[#B91508] font-bold" >
//                           {Math.floor(product?.variants[0]?.price)}
//                         </span>
//                       </p>

//                       <div className="flex justify-between w-full mt-3 px-2">
//                         <button
//                           className="w-30 rounded-full  px-3 py-1 color-white border-1 border-[#B91508] cursor-pointer ml-1 text-center"
//                           onClick={() => handleAddToCart(product?.variants[0]?.id)}
//                         >
//                           <div className="flex items-center justify-center">
//                             <span className="inline text-[#B91508]">Cart</span> <FaCartPlus className="mx-1 text-[#B91508]" />
//                           </div>

//                         </button>
//                         <button className="w-30 rounded-full px-3 py-1 text-white bg-[#B91508] cursor-pointer  font-semibold mr-1"
//                           onClick={() => handleBuyNow(product?.variants?.[0]?.id)}
//                         >
//                           Buy Now
//                         </button>

//                       </div>


//                     </div>
//                   </div>
//                 </div>

//               )
//               )}




//             </div>
//           </div>



//         </div>

//         {/* ---------------------Explore More category ------------------------- */}

//         <div className="my-15 relative">
//           <h2 className="text-center mb-8 text-2xl font-semibold">
//             Explore More Categories
//           </h2>

//           <div className="varieties">
//             <div className="flex gap-2">


//               <div className="w-1/5">
//                 <Link to={`/category/pressure-cooker`}>
//                   <div className="m-1 rounded-xl overflow-hidden">
//                     <img src={imageURL + "assets/category/pressure-cooker.png"} />
//                   </div>
//                   <p className="text-center font-bold  py-1 mt-1">Pressure Cooker</p>
//                 </Link>
//               </div>

//               <div className="w-1/5">
//                 <Link to={`/category/cookware`}>
//                   <div className="m-1 rounded-xl overflow-hidden">
//                     <img src={imageURL + "assets/category/cookware.png"} />
//                   </div>
//                   <p className="text-center font-bold  py-1 mt-1">Cookware</p>
//                 </Link>
//               </div>

//               <div className="w-1/5">
//                 <Link to={`/category/gas-stove`}>
//                   <div className="m-1 rounded-xl overflow-hidden">
//                     <img src={imageURL + "assets/category/gas-stove.png"} />
//                   </div>
//                   <p className="text-center font-bold  py-1 mt-1">Gas Stove</p>
//                 </Link>
//               </div>

//               <div className="w-1/5">
//                 <Link to={`/category/mixer-grinder`}>
//                   <div className="m-1 rounded-xl overflow-hidden">
//                     <img src={imageURL + "assets/category/mixer-grinder.png"} />
//                   </div>
//                   <p className="text-center font-bold  py-1 mt-1">Mixer Grinder</p>
//                 </Link>
//               </div>

//               <div className="w-1/5">
//                 <Link to={`/category/gas-tandoor`}>
//                   <div className="m-1 rounded-xl overflow-hidden">
//                     <img src={imageURL + "assets/category/gas-tandoor.png"} />
//                   </div>
//                   <p className="text-center font-bold  py-1 mt-1">Gas Tandoor</p>
//                 </Link>
//               </div>


//             </div>
//           </div>




//           {/* <div className=" overflow-x-hidden ">

//             <div
//               className="flex gap-6  w-max px-4 py-2  "
//               style={{
//                 transform: `translateX(-${scrollIndexMore * itemWidth}px)`,
//               }}
//             >
//               {morecategory.map((item, index) => (
//                 <Link key={index} to={`/879/ProductDetails/${item.sno}`}>
//                   {" "}
//                   <div
//                     key={index}
//                     className="w-60  shrink-0 bg-white rounded-lg p-2 shadow-md"
//                   >
//                     <img
//                       src={`https://summithomeappliances.performdigimonetize.com/admin/${item.product_images}`}
//                       alt=""
//                       className="w-36 h-36 mx-auto"
//                     />
//                     <p className="font-semibold text-sm mt-2">
//                       {item.product_description}
//                     </p>
//                     <p className="text-xs mt-1">
//                       Fast heating | Non-reactive nature
//                     </p>
//                     <p className="flex mt-1 text-[#EE9E13] text-sm">
//                       {[...Array(5)].map((_, i) => (
//                         <FaStar key={i} />
//                       ))}
//                     </p>
//                     <p className="font-bold mt-1">₹{item.product_price}</p>
//                     <div className="flex justify-between items-center mt-1">
//                       <p className="bg-[#E4F1E8] text-[#1E9531] font-semibold py-0.5 px-2 rounded-md">
//                         ₹{item.product_discount} save
//                       </p>
//                       <button className="text-[#683208] border border-[#683208] rounded-md px-2 py-0.5">
//                         Add +
//                       </button>
//                     </div>
//                     <p className="text-xs mt-1">(incl. of all taxes)</p>
//                   </div>
//                 </Link>
//               ))}
//             </div>

//             <button
//               onClick={handlePrevMore}
//               className="absolute text-sm top-45 left-7 transform -translate-y-1/2 bg-[#E2E2E5] text-[#636365] px-2 py-0.5 text-center rounded-full z-10"
//             >
//               ❮
//             </button>

//             <button
//               onClick={handleNextMore}
//               className="absolute text-sm top-45 right-7 transform -translate-y-1/2 bg-[#E2E2E5] text-[#636365] px-2 py-0.5  rounded-full z-10"
//             >
//               ❯
//             </button>
//           </div> */}
//         </div>



//       </div >



//       <Blogs />




//       <style>
//         {`
//   td{
//   padding:10px
//   }
//   `}
//       </style>

//     </>

//   );
// };

// export default ProductDetails;
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
    slidesToShow: 5,
    slidesToScroll: 1,
    vertical: true,
    arrows: false,
    focusOnSelect: true,
    asNavFor: mainSlider.current,
  };

 

  /* -------------------- JSX -------------------- */
  return (
    <div className="px-4 bg-white md:px-16">
      <CategoryMegaMenu />
      {/* Breadcrumb */}
      <div className="text-xs py-2 mb-3 bg-red-50 font-bold">
        Home / {product.master_category} /{" "}
        <span className="text-[#B91508]">{product.product_name}</span>
      </div>

      <div className="flex mt-12 flex-col md:flex-row gap-8">
        {/* ================= IMAGES ================= */}
        <div className="md:w-1/2 flex gap-4">
          {/* Thumbnails */}
          <div className="w-[90px] relative max-h-[450px]">
            <button
              onClick={() => thumbSlider.current?.slickPrev()}
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-600 text-white p-1 rounded-full z-10"
            >
              <FaChevronUp />
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
                      className="border rounded w-full h-20 object-cover"
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

            <button
              onClick={() => thumbSlider.current?.slickNext()}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-red-600 text-white p-1 rounded-full z-10"
            >
              <FaChevronDown />
            </button>
          </div>

          {/* Main Image */}
          <div className="relative w-full max-w-xl ">
            <button
              onClick={() => mainSlider.current?.slickPrev()}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-red-600 text-white p-2 rounded-full z-10"
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={() => mainSlider.current?.slickNext()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 text-white p-2 rounded-full z-10"
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
                        className="w-full max-h-[450px] object-contain"
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
                  className="w-full max-h-[450px] object-contain"
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
        <div className=" ml-5 md:w-1/2">
<div class="flex justify-between items-center gap-2 mb-2">
  {/* <!-- Bestseller Badge --> */}
  <div class="relative inline-block bg-[#C1121F] px-2 py-0.5 overflow-hidden rounded">
    <span class="relative z-10 text-[10px] font-bold uppercase tracking-wide text-white">
      Bestseller
    </span>
  </div>

  {/* <!-- Rating & Reviews --> */}
  <div class="flex items-center gap-1 text-sm">
    {/* <!-- Stars --> */}
    <div class="flex items-center text-[#C1121F] text-lg">
      ★★★★★
    </div>

    {/* <!-- Reviews --> */}
    <span class="text-gray-600 text-lg">
      0 reviews
      
    </span>
 <IoShareSocial  size={20} className="text-gray-600" />
    {/* <!-- Share Icon (optional) --> */}
     
  </div>
</div>



          <h1 className="text-2xl font-semibold">
            {product.product_name}
          </h1>

          <button className="text-sm bg-gray-100 px-2  text-gray-600 mt-1">
            SKU: {product.product_id || 'SI1F'}
          </button>

          <p className="text-xl font-bold mt-3">
        ₹ {product.mrp}
<p className=" text-xs text-[#777]">(Inclusive of all taxes)</p>
            {/* <p className="text-xl font-bold mt-3">
  ₹ {product.mrp}
</p> */}
  <div className="bg-[#FAFAFC] mt-3 items-center text-sm justify-center w-full grid-cols-2 grid md:grid-cols-3 gap-3 p-3 space-y-1   rounded-sm text-center">
                 <div className="flex justify-start items-center gap-2 mb-0">
                  <img
                    src="/asset/iconvector/Vector.png"
                    alt=""
                    className="w-4 h-4"
                  />
                  <span>Premium Quality </span>
                </div>
                <div className="flex justify-start items-center gap-2 mb-0">
                  <img
                    src="/asset/iconvector/basil_stack-solid.png"
                    alt=""
                    className="w-4 h-4"
                  />
                  <span>Long-lasting 3 Layer Body</span>
                </div>

                <div className="flex justify-start items-center gap-2 mb-0">
                  <img
                    src="/asset/iconvector/emojione-monotone_pot-of-food.png"
                    className="w-4 h-4"
                    alt=""
                  />
                  <span>No Food Burning/Sticking</span>
                </div>

                <div className="flex justify-start items-center gap-2 mb-0">
                  <img
                    src="/asset/iconvector/Vector (3).png"
                    alt=""
                    className="w-4 h-4"
                  />
                  <span>Super Easy to Clean</span>
                </div>

                <div className="flex justify-start items-center gap-2 mb-0">
                  <img
                    src="/asset/iconvector/Vector (4).png"
                    alt=""
                    className="w-4 h-4"
                  />
                  <span>Heating & Fast Cooking</span>
                </div>

                <div className="flex justify-start items-center gap-2 mb-0">
                  <img
                    src="/asset/iconvector/Vector (5).png"
                    alt=""
                    className="w-4 h-4"
                  />
                  <span> ISI & ISO 9001 Certified</span>
                </div>
              </div>

              {/* Capacity Selection */} 
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-lg whitespace-nowrap">Capacity:</h3>
                <div className="flex items-center gap-2">
                  {/* Extract capacity from product_name and show as single option */}
                  {(() => {
                    const capacityMatch = product.product_name?.match(/\d+\.?\d*[Ll]/);
                    const capacity = capacityMatch ? capacityMatch[0] : '1L';
                    return (
                      <button
                        key={capacity}
                        className="px-4 py-2 rounded-md border text-sm font-semibold border-[#B91508] text-[#B91508]"
                      >
                        {capacity}
                      </button>
                    );
                  })()}
                </div>
              </div>


          </p>

        

          {/* Buttons */}
          <div className="flex gap-4 mt-3">
            <button
              onClick={() => handleAddToCart(product.product_id)
}
              className="bg-[#B91508] text-white px-6 py-2 rounded-full font-semibold text-base"
            >
              Add to Cart
            </button>

            <button
              onClick={() => handleBuyNow(product.product_id)}
              className="border border-[#B91508] text-[#B91508] px-6 py-2 rounded-full font-semibold text-base"
            >
              Buy Now
            </button>
           
          </div>
            <div className="mt-5">
               <div className="flex gap-5">
                 <div className="flex items-center text-lg text-[#636365] gap-1">
                   {" "}
                   <img
                     src="/asset/iconvector/bitcoin-icons_tag-filled.png"
                     alt=""
                     className="size-5"
                   />
                   <p className="text-[#636365] text-sm">
                     Free shipping on orders ₹1199 & above
                   </p>
                 </div>
                 <div className="flex items-center gap-1">
                   {" "}
                   <img
                     src="/asset/iconvector/hugeicons_delivery-return-01.png"
                     alt=""
                     className="size-5"
                   />
                   <p className="text-[#636365] text-sm">
                     Easy returns within 7 days
                  </p>
                 </div>
               </div>

               <div className="flex flex-col gap-2 mt-4">
                 <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Enter Your Pin Code"
                    className="p-2 border-2 border-gray-300 placeholder:text-sm placeholder:font-semibold rounded"
                    // value={pincode}
                    // onChange={(e) => setPincode(e.target.value)}
                  />
                  <button
                    className="rounded border-2 border-[#B91508] text-[#B91508] p-2 font-semibold"
                    // onClick={handleCheck}
                  >
                    Check Now
                  </button>
                   <div className="text-[#636365]">
                  Enter Pincode To View Delivery Details
                </div>
                </div>
                
              </div>
              </div>

        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-8">
        {/* Tabs */}
        <div className="flex justify-center gap-5 text-sm md:text-lg text-black">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative md:px-12 px-2 py-2 cursor-pointer"
            >
              <div className={`${activeTab === tab ? "text-red-700" : ""}`}>
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
        <div className="p-4 mt-4">
          {activeTab === "Description" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Product Description</h3>
                <div className="text-gray-700 leading-relaxed space-y-4">
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
                <div className="mt-8 pt-6 border-t">
                  <h4 className="text-md font-semibold mb-4 text-gray-800">Key Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">HSN Code</div>
                        <div className="text-gray-600">{product.hsn_code || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Weight</div>
                        <div className="text-gray-600">{product.weight || product.net_weight || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Dimensions</div>
                        <div className="text-gray-600">{product.dimensions || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Material</div>
                        <div className="text-gray-600">{product.material || product.material_name || 'N/A'}</div>
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
            <div className="bg-white text-[#B91508] p-8 rounded-lg max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Left Side - Review Stats */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4">Verified Customer Reviews</h3>
                  
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex text-3xl">
                      {'★'.repeat(5)}{'☆'.repeat(0)}
                    </div>
                    <div>
                      <div className="text-3xl font-bold">
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
                      <div className="text-sm text-gray-600">out of 5</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Based on {(() => {
                      const reviews = {
                        'SI1F': { rating: 4.76, total: 41, distribution: [35, 4, 1, 0, 1] },
                        'SI2F': { rating: 4.82, total: 67, distribution: [58, 6, 2, 1, 0] },
                        'SI3F': { rating: 4.65, total: 23, distribution: [18, 3, 1, 1, 0] },
                        'SI4F': { rating: 4.91, total: 89, distribution: [82, 5, 2, 0, 0] },
                        'SI5F': { rating: 4.58, total: 34, distribution: [26, 5, 2, 1, 0] },
                        'default': { rating: 4.73, total: 52, distribution: [43, 6, 2, 1, 0] }
                      };
                      const key = product.product_id || 'default';
                      return reviews[key]?.total || reviews.default.total;
                    })()} reviews
                  </p>
                  
                  {/* Rating Distribution */}
                  <div className="space-y-3">
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
                      const distribution = reviews[key]?.distribution || reviews.default.distribution;
                      const total = reviews[key]?.total || reviews.default.total;
                      
                      return distribution.map((count, index) => {
                        const starRating = 5 - index;
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        
                        return (
                          <div key={starRating} className="flex items-center gap-3">
                            <div className="flex text-md w-20">
                              {starRating}{'★'.repeat(1)}
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-5 overflow-hidden">
                              <div 
                                className="bg-[#B91508] h-full rounded-full transition-all duration-500" 
                                style={{width: `${percentage}%`}}
                              ></div>
                            </div>
                            <span className="text-sm w-8 text-right">{count}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
                
                {/* Right Side - Action Buttons */}
                <div className="flex flex-col gap-4">
                  <button className="bg-[#B91508] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#a21307] transition-colors">
                    Write A Review
                  </button>
                  <button className="border border-[#B91508] text-[#B91508] px-8 py-3 rounded-full font-semibold hover:bg-[#B91508] hover:text-white transition-colors">
                    Ask A Question
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Refund Policy" && (
            <div className="text-start p-8 text-gray-600 max-w-4xl mx-auto ">
              <p>We want you to love your new pressure cooker! If you're not satisfied, you may return or exchange the product within 7 days of delivery. Items must be unused, in original packaging, and include all accessories. Returns due to defects or damage will be fully covered. For other returns, shipping charges may apply. To initiate a return or exchange, please contact our support team at [Your Email or Contact Link].</p>
            </div>
          )}
        </div>
        
          <Blogs />
      </div>
    </div>
  );
};

export default ProductDetails;


