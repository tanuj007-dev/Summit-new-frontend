// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { FaStar, FaRegStar } from "react-icons/fa";
// import { Share2, Users } from "lucide-react";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import FeedbackProduct from "./FeedbackProduct";
// import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
// import { FaCartPlus } from "react-icons/fa";
// import { TbArrowsCross } from "react-icons/tb";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { toast } from "react-toastify";

// const DetailProduct = ({ user, setaddcart, addToCart, buyNowHandle, isLoggedIn }) => {
//   const { id } = useParams();
//   const originalProduct = user.find((item) => item.id === id);
//   console.log("originalProduct", originalProduct);
//   console.log("users ", user);
//   const [selectedProduct, setSelectedProduct] = useState(originalProduct);
//   const navigate = useNavigate();
//   const [copied, setCopied] = useState(false);
//   const [scrollIndex, setScrollIndex] = useState(0);
//   const [scrollIndexMore, setScrollIndexMore] = useState(0);
//   const [selectedWeight, setSelectedWeight] = useState(null);
//   const [selectshape, setselectShape] = useState(null);
//   const [selectBottom, setselectBottom] = useState(null);
//   const tabs = ["Description", "Additional info", "Shipping Policy", "Refund Policy"];
//   const [activeTab, setActiveTab] = useState("Description");


//   const visibleCount = 4;
//   const itemWidth = 260;
//   const uniqueValues = (arr, key) => [...new Set(arr.map(p => p[key]).filter(Boolean))];

//   const bottomFilter = uniqueValues(user, 'bottom_type')
//   const [pincode, setPincode] = useState('');
//   const [estimatedDate, setEstimatedDate] = useState(null);
//   const [error, setError] = useState('');

//   const calculateDays = (pin) => {
//     const firstDigit = pin.charAt(0);
//     switch (firstDigit) {
//       case '1':
//         return 2;
//       case '2':
//         return 3;
//       case '3':
//       case '4':
//         return 4;
//       case '5':
//       case '6':
//         return 5;
//       case '7':
//       case '8':
//         return 6;
//       default:
//         return null;
//     }
//   };

//   const handleCheck = () => {
//     if (!/^\d{6}$/.test(pincode)) {
//       setError('Please enter a valid 6-digit pincode');
//       setEstimatedDate(null);
//       return;
//     }

//     setError('');
//     const days = calculateDays(pincode);
//     if (days === null) {
//       setEstimatedDate('Delivery not available for this pincode');
//       return;
//     }

//     // Add business days
//     const deliveryDate = new Date();
//     let added = 0;
//     while (added < days) {
//       deliveryDate.setDate(deliveryDate.getDate() + 1);
//       const day = deliveryDate.getDay();
//       if (day !== 0 && day !== 6) added++; // Skip Sat/Sun
//     }

//     const options = { weekday: 'short', month: 'short', day: 'numeric' };
//     const formatted = deliveryDate.toLocaleDateString('en-IN', options);
//     setEstimatedDate(`Estimated delivery by ${formatted}`);
//   };
//   console.log(bottomFilter);

//   useEffect(() => {
//     setSelectedProduct(originalProduct);
//   }, [originalProduct]);

//   useEffect(() => {
//     if (selectedProduct) {
//       // console.log(selectedProduct.bottom);
//       setselectShape(selectedProduct.shape);
//       setselectBottom(selectedProduct.bottom);
//       setSelectedWeight(selectedProduct.product_weight);
//     }
//   }, [selectedProduct]);
//   const handleAddToCart = (item) => {
//     addToCart(
//       {
//         id: item.id,
//         product_name: item.name,
//         product_price: item.price,
//       },
//       1
//     );
//     toast.success("Added to cart");

//   };
//   const handleNextMore = () => {
//     const maxIndex = morecategory.length * 5 - visibleCount;
//     setScrollIndexMore((prevIndex) =>
//       prevIndex >= maxIndex ? 0 : prevIndex + 1
//     );
//   };

//   const handlePrevMore = () => {
//     const maxIndex = morecategory.length * 5 - visibleCount;
//     setScrollIndexMore((prevIndex) =>
//       prevIndex <= 0 ? maxIndex : prevIndex - 1
//     );
//   };

//   const handleNext = () => {
//     const maxIndex = youMayLike.length * 5 - visibleCount;
//     setScrollIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
//   };

//   const handlePrev = () => {
//     const maxIndex = youMayLike.length * 5 - visibleCount;
//     setScrollIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
//   };

//   if (!user || user.length === 0) {
//     return <div>Loading...</div>;
//   }

//   const selectedsku = selectedProduct
//     ? user.filter(
//       (item) =>
//         item.product_description === selectedProduct.product_description
//     )
//     : [];



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

//   const hanlderPlainshap = () => {
//     // alert("plain");
//     setselectShape("plain");
//     const newProduct = user.find(
//       (item) =>
//         item.product_description === originalProduct.product_description &&
//         item.shape === "plain" &&
//         item.bottom == originalProduct.bottom &&
//         item.product_weight == originalProduct.product_weight
//     );

//     if (newProduct) {
//       navigate(`/879/DetailProduct/${newProduct.sno}`);
//       setSelectedProduct(newProduct);
//     }
//   };

//   const hanlderPanShap = () => {
//     setselectShape("pan");
//     const newProduct = user.find(
//       (item) =>
//         item.product_description === originalProduct.product_description &&
//         item.shape === "pan" &&
//         item.bottom_type == originalProduct.bottom
//       // && item.product_weight == originalProduct.product_weight
//     );
//     console.log(newProduct);
//     if (newProduct) {
//       navigate(`/879/DetailProduct/${newProduct.sno}`);
//       setSelectedProduct(newProduct);
//     }
//   };

//   const hanlderInduction = (type) => {
//     // alert("Induction");
//     setselectShape(type);
//     const newProduct = user.find(
//       (item) =>
//         item.product_description === originalProduct.product_description &&
//         item.bottom_type === type &&
//         item.shape == originalProduct.shape
//       // && item.product_weight == originalProduct.product_weight
//     );
//     console.log(newProduct);
//     if (newProduct) {
//       navigate(`/879/DetailProduct/${newProduct.sno}`);
//       setSelectedProduct(newProduct);
//     }
//   };

//   const hanlderNonInduction = () => {
//     // alert("Non-Induction");
//     setselectShape("Non-Induction");
//     const newProduct = user.find(
//       (item) =>
//         item.product_description === originalProduct.product_description &&
//         item.bottom === "Non-Induction" &&
//         item.shape == originalProduct.shape &&
//         item.product_weight == originalProduct.product_weight
//     );
//     if (newProduct) {
//       navigate(`/879/DetailProduct/${newProduct.sno}`);
//       setSelectedProduct(newProduct);
//     }
//   };

//   if (!selectedProduct) {
//     return <div>Product not found</div>;
//   }

//   const morecategory = user
//     .filter(
//       (item) => item.product_category !== selectedProduct.product_category
//     )
//     .reduce((acc, curr) => {
//       if (
//         !acc.find((item) => item.product_category === curr.product_category)
//       ) {
//         acc.push(curr);
//       }
//       return acc;
//     }, []);

//   const youMayLike = user.filter(
//     (item) =>
//       item.product_category === selectedProduct.product_category &&
//       item.sno !== selectedProduct.sno // exclude the current product
//   );

//   const handleAddCart = () => {
//     addToCart(
//       {
//         product_id: selectedProduct.id,
//         product_name: selectedProduct.name,
//         product_price: selectedProduct.price,
//         image: selectedProduct.images[0].url,
//       },
//       1
//     );
//   };

//   return (
//     <>
//       <div className="text-xs mb-2 py-2 bg-red-50 px-16 font-bold">
//         Home / {selectedProduct.product_category} /{" "}
//         {selectedProduct.product_sub_category} / <span className="text-[#B91508]">{selectedProduct.name}</span>
//       </div>
//       <div className="md:px-16 px-4 ">
//         <div className="w-full flex flex-col items- md:flex-row pb-10 gap-10">
//           <div className="w-[40%]">
//             <img
//               src={
//                 selectedProduct.images?.[0]?.url
//                   ? `https://api.summithomeappliance.com/php_admin_panel/${selectedProduct.images[0].url}`
//                   : '/asset/images/dummy-image-square.jpg'
//               }
//               alt={selectedProduct.name}
//               className="rounded-lg w-full shadow-lg"
//             />





//             <div className="mt-3">
//               <div className="flex flex-wra ">
//                 <div className="w-1/4">
//                   <div className="shadow-lg border-1 border-red-100 m-1 rounded-xl overflow-hidden">
//                     <img src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Aluminium/variant_114/1753788865_6888b1c1ef007.jpg" />
//                   </div>
//                 </div>
//                 <div className="w-1/4">
//                   <div className="shadow-lg border-1 border-red-100 m-1 rounded-xl overflow-hidden">
//                     <img src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" />
//                   </div>
//                 </div>
//                 <div className="w-1/4">
//                   <div className="shadow-lg border-1 border-red-100 m-1 rounded-xl overflow-hidden">
//                     <img src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" />
//                   </div>
//                 </div>
//                 <div className="w-1/4">
//                   <div className="shadow-lg border-1 border-red-100 m-1 rounded-xl overflow-hidden">
//                     <img src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" />
//                   </div>
//                 </div>
//               </div>
//             </div>

//           </div>
//           <div className="w-full md:w-[60%]">


//             <div className="w-full flex justify-between items-center">
//               <div>
//                 <span className="bg-[#B91508] text-white py-1 px-3 text-sm mr-1">
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
//                 </span>
//                 {/* <span className="bg-[#B91508] text-white py-1 px-3 text-sm">
//                 Blacko
//               </span>
//               <span className="bg-[#B91508] text-white py-1 px-3 text-sm">
//                 Desire
//               </span>
//               <span className="bg-[#B91508] text-white py-1 px-3 text-sm">
//                 Elite
//               </span> */}
//               </div>
//               <div className="flex items-center gap-0.5">
//                 <FaStar className="text-[#B91508]" />
//                 <FaStar className="text-[#B91508]" />
//                 <FaStar className="text-[#B91508]" />
//                 <FaStar className="text-[#B91508]" />
//                 <FaStar className="text-[#B91508]" />
//                 <span className="ml-3">0 reviews</span>{" "}
//                 {/* Copy button */}
//                 <div className="relative inline-block">
//                   <span
//                     className="font-bold"
//                     onClick={handleCopy}
//                   >
//                     <Share2 size={15} strokeWidth={2} />
//                   </span>

//                   {/* Tooltip */}
//                   {copied && (
//                     <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-90">
//                       Copied!
//                     </div>
//                   )}
//                 </div>


//               </div>{" "}
//             </div>


//             <h1 className="text-lg font-semibold mt-3">
//               {selectedProduct.name}
//             </h1>


//             <span className="bg-[#F5F5F7] text-xs rounded-sm text-[#636365] px-2 py-0.5 font-semibold">
//               SKU:  {selectedProduct.sku}
//             </span>


//             <div className="price">
//               <p className="font-bold text-xl mt-3">
//                 {" "}
//                 ₹{selectedProduct.price}


//                 <span className="bg-[#] rounded-sm text-[#919191] px-2 py-0.5 font-semibold">
//                   ₹   <span className="line-through decoration-2">{selectedProduct.price}</span>

//                 </span>
//                 <span className="bg-[#F5F5F7] rounded-sm text-[#B91508] px-2 py-0.5 font-semibold">
//                   50% Off{selectedProduct.product_discount}{" "}
//                   {selectedProduct.product_discount_type}
//                 </span>
//               </p>
//               <p className="text-xs mt-1">(Inclusive of all taxes)</p>
//             </div>





//             <div className="mt-3">
//               <h1 className="flex items-center">
//                 <span className="font-semibold">Capacity : </span>
//                 {/* <p className="ml-2 text-[#636365] "> </p> */}
//               </h1>
//               <div className="flex gap-2 flex-wrap mt-3 text-sm">
//                 {[
//                   ...new Map(
//                     selectedsku.slice() // clone array to avoid mutation
//                       .sort((a, b) => {
//                         const getSizeValue = (str) => parseFloat(str); // "2 Liters" => 2
//                         return getSizeValue(a.size) - getSizeValue(b.size);
//                       }).map((item) => [item.size, item])
//                   ).values(),
//                 ].map((item, index) => (
//                   <Link key={index} to={`/879/DetailProduct/${item.id}`}>
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
//                 ))}
//               </div>
//               <div></div>
//             </div>


//             <div className="mt-3 flex gap-8">
//               <div>
//                 <p className="font-semibold mb-2">Shape:</p>
//                 <span
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
//                 </span>
//               </div>
//               <div>
//                 <p className="font-semibold mb-2">Bottom:</p>
//                 {
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
//                 }
//               </div>
//             </div>


//             <div className="mt-3 flex md:justify- gap-5">
//               <button
//                 onClick={() => handleAddToCart(originalProduct)}
//                 className="bg-[#B91508] hover:bg-[#a21307] active:bg-[#7e0f06] text-white border border-[#B91508] px-8 md:px-15 py-2 font-semibold rounded-full cursor-pointer hover:shadow-md hover:scale-105 active:scale-95 transform transition-all duration-150"
//               >
//                 Add to cart
//               </button>
//               <button onClick={() => buyNowHandle(originalProduct)} className=" rounded-full  border-1 text-[#B91508]  border-[#B91508] px-8 md:px-15 py-2 font-semibold cursor-pointer">
//                 Buy Now
//               </button>
//             </div>

//             <div className="mt-5">
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
//             </div>


//             <div className="varieties">
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
//             </div>




//             {/* -------------------end--------------- */}
//           </div>
//         </div>

//         <div className="bg-[#FAFAFC] font-semibold items-center text-sm justify-center w-full grid-cols-2 grid md:grid-cols-3 gap-5 px-4 py-8 space-y-1 md:space-y-5 mt-5 rounded-sm">
//           <div className="flex justify-center items-center gap-2">
//             <img
//               src="/asset/iconvector/Vector.png"
//               alt=""
//               className="w-5 h-5"
//             />
//             <span>Premium Quality</span>
//           </div>
//           <div className="flex justify-center items-center gap-2">
//             <img
//               src="/asset/iconvector/basil_stack-solid.png"
//               alt=""
//               className="w-5 h-5"
//             />
//             <span>Long-lasting 3 Layer Body</span>
//           </div>

//           <div className="flex justify-center items-center gap-2">
//             <img
//               src="/asset/iconvector/emojione-monotone_pot-of-food.png"
//               className="w-5 h-5"
//               alt=""
//             />
//             <span>No Food Burning/Sticking</span>
//           </div>

//           <div className="flex justify-center items-center gap-2">
//             <img
//               src="/asset/iconvector/Vector (3).png"
//               alt=""
//               className="w-5 h-5"
//             />
//             <span>Super Easy to Clean</span>
//           </div>

//           <div className="flex justify-center items-center gap-2">
//             <img
//               src="/asset/iconvector/Vector (4).png"
//               alt=""
//               className="w-5 h-5"
//             />
//             <span>Even Heating & Fast Cooking</span>
//           </div>

//           <div className="flex justify-center items-center gap-2">
//             <img
//               src="/asset/iconvector/Vector (5).png"
//               alt=""
//               className="w-5 h-5"
//             />
//             <span> ISI & ISO 9001 Certified</span>
//           </div>
//         </div>







//         {/* ------------------product you may like ------------------ */}
//         <div className="mt-8">
//           {/* Tabs */}
//           <div className="flex justify-center text-xs md:text-lg text-gray-300">
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
//                       : "absolute bottom-[-1px] left-0 right-0 h-1 bg-gray-300"
//                   }
//                 />
//               </div>
//             ))}
//           </div>

//           {/* -------------------------conditional rendering---------------------------- */}

//           <div className=" p-4 mt-4">
//             {activeTab === "Description" &&
//               <div className="additional-info">



//                 <table class="mx-auto table-auto w-full md:w-1/2 md:table-fixed border-spacing-2 border-collapse border border-gray-400 ...">
//                   <tbody>
//                     <tr>
//                       <td class="border border-gray-300"><strong>HSN Code:</strong></td>
//                       <td class="border border-gray-300">{selectedProduct.hsn}</td>
//                     </tr>
//                     <tr>
//                       <td class="border border-gray-300"><strong> Product Weight:</strong></td>
//                       <td class="border border-gray-300">{selectedProduct.weight} kg</td>
//                     </tr>
//                     <tr>
//                       <td class="border border-gray-300"><strong>Dimensions:</strong></td>
//                       <td class="border border-gray-300">{selectedProduct.dimensions}</td>
//                     </tr>

//                     <tr>
//                       <td class="border border-gray-300"><strong>Package Dimensions:</strong></td>
//                       <td class="border border-gray-300">{selectedProduct.package_dimensions}</td>
//                     </tr>


//                     <tr>
//                       <td class="border border-gray-300"><strong>Material:</strong> </td>
//                       <td class="border border-gray-300">{selectedProduct.material}</td>
//                     </tr>

//                     <tr>
//                       <td class="border border-gray-300"><strong>Shape:</strong></td>
//                       <td class="border border-gray-300">{selectedProduct.shape}</td>
//                     </tr>

//                     <tr>
//                       <td class="border border-gray-300"><strong>Bottom Type:</strong></td>
//                       <td class="border border-gray-300">{selectedProduct.bottom_type}</td>
//                     </tr>

//                     <tr>
//                       <td class="border border-gray-300"><strong>Size:</strong></td>
//                       <td class="border border-gray-300">{selectedProduct.size}</td>
//                     </tr>

//                     <tr>
//                       <td class="border border-gray-300"><strong>Tax Rate:</strong></td>
//                       <td class="border border-gray-300">{selectedProduct.tax_rate}</td>
//                     </tr>

//                     <tr>
//                       <td class="border border-gray-300"><strong>Warranty:</strong></td>
//                       <td class="border border-gray-300">{selectedProduct.warranty}</td>
//                     </tr>


//                   </tbody>
//                 </table>
//               </div>}

//             {activeTab === "Additional info" && selectedProduct && (

//               <p>{selectedProduct.contents}</p>
//             )}
//             {activeTab === "Shipping Policy" && selectedProduct && (

//               <p>Shipping Policy Description.</p>
//             )}
//             {activeTab === "Refund Policy" && selectedProduct && (

//               <p>Refund Policy Description.</p>
//             )}

//             {activeTab === "Review" && <ShowReview product_id={product_id} />}
//             {activeTab === "Write feedback" && (
//               <ReviewTaken id={product_id} isLoggedIn={isLoggedIn} />
//             )}
//           </div>

//           {/* ------------------------------conditional rendering end ------------------------ */}
//         </div>
//         <div className="mt-5 relative">
//           <h1 className="text-center mb-8 text-2xl font-semibold">
//             You May Also Like
//           </h1>
//           <div className=" overflow-x-hidden ">
//             <div
//               className="flex flex-wrap px-4 py-2  "
//               style={{ transform: `translateX(-${scrollIndex * itemWidth}px)` }}
//             >
//               {user.slice(0, 4)?.map((item, index) => (
//                 <Link className="w-1/4 p-2" key={index} to={`/879/DetailProduct/${item.id}`}>
//                   <div style={{ boxShadow: "box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;" }}
//                     className="relative bg-white rounded-md shadow-md shadow-red-50 border-1 border-red-200 overflow-hidden"
//                     key={index}
//                   >
//                     <TbArrowsCross
//                       icon={regularHeart}
//                       style={{
//                         color: "gray",
//                         cursor: "pointer",
//                         fontSize: "20px",
//                       }}

//                       className="absolute top-2 right-10"
//                     />

//                     <FontAwesomeIcon
//                       icon={regularHeart}
//                       style={{
//                         color: "gray",
//                         cursor: "pointer",
//                         fontSize: "20px",
//                       }}
//                       className="absolute top-2 right-2"
//                     />
//                     <div
//                       style={{
//                         background: "#E03B2D",
//                         cursor: "pointer",

//                         color: "white",
//                       }}
//                       className="absolute top-2 left-0 px-3 rounded-r"
//                     >20% off</div>

//                     <div className="">
//                       <Link className="flex" to={`/879/DetailProduct/${item.id}`}>
//                         <img
//                           src={
//                             item.images?.[0]?.url
//                               ? `https://api.summithomeappliance.com/php_admin_panel/${item.images[0].url}`
//                               : '/asset/images/dummy-image-square.jpg'
//                           }
//                           alt={item.images?.[0]?.url ? item.name : 'No image available'}
//                           className="w-full rounded-lg mx-auto"
//                         />
//                       </Link>

//                       <div className="bg-red-50 flex flex-col items-center w-full p-2">


//                         <div className="">
//                           <img className="w-[50px] h-[50px] inline shadow border-1 border-red-500 rounded-full p-1 m-1" src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" alt="variant" />
//                           <img className="w-[50px] h-[50px] inline shadow rounded-full m-1" src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Aluminium/variant_114/1753788865_6888b1c1ef007.jpg" alt="variant" />
//                           <img className="w-[50px] h-[50px] inline shadow rounded-full m-1" src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" alt="variant" />
//                           <img className="w-[50px] h-[50px] inline shadow rounded-full m-1" src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Aluminium/variant_114/1753788865_6888b1c1ef007.jpg" alt="variant" />
//                         </div>

//                         <h5 className="text-sm font-semibold truncate w-40 mt-2">
//                           {item.name}
//                         </h5>
//                         <p className="text-sm font-semibold mt-2">
//                           <span className="font-normal text-[#3e3e3e]">
//                             M.R.P: 2000 {" "}
//                           </span>
//                           Rs. <span className="text-[#B91508] font-bold">{Math.floor(item.price)}</span>
//                         </p>
//                         <div className="flex justify-between w-full mt-3 px-2">
//                           <button className="w-30 rounded-full px-3 py-1 text-white bg-[#B91508] cursor-pointer  font-semibold mr-1"
//                           >
//                             Buy Now
//                           </button>
//                           <button
//                             className="w-30 rounded-full  px-3 py-1 color-white border-1 border-[#B91508] cursor-pointer ml-1 text-center"
//                           >
//                             <div className="flex items-center justify-center">
//                               <span className="inline text-[#B91508]">Cart</span> <FaCartPlus className="mx-1 text-[#B91508]" />
//                             </div>

//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>

//             <button
//               onClick={handlePrev}
//               className="absolute text-sm top-45 left-7 transform -translate-y-1/2 bg-[#E2E2E5] text-[#636365] px-2 py-0.5 text-center rounded-full z-10"
//             >
//               ❮
//             </button>

//             <button
//               onClick={handleNext}
//               className="absolute text-sm top-45 right-7 transform -translate-y-1/2 bg-[#E2E2E5] text-[#636365] px-2 py-0.5  rounded-full z-10"
//             >
//               ❯
//             </button>
//           </div>
//         </div>

//         {/* ---------------------Explore More category ------------------------- */}

//         <div className="my-15 relative">
//           <h1 className="text-center mb-8 text-2xl font-semibold">
//             Explore More Categories
//           </h1>

//           <div className="varieties">
//             <div className="flex gap-2">
//               <div className="w-1/6">
//                 <div className="shadow-lg border-1 border-red-100 bg-red-100 m-1 rounded-xl overflow-hidden px-3 pt-3">
//                   <img src="https://summithomeappliance.com/asset/images/categories/Outer%20Lid.jpg" />
//                   <p className="text-center font-bold  py-1 mt-1">Outer Lid</p>
//                 </div>
//               </div>
//               <div className="w-1/6">
//                 <div className="shadow-lg border-1 border-red-100 bg-red-100 m-1 rounded-xl overflow-hidden px-3 pt-3">
//                   <img src="https://summithomeappliance.com/asset/images/categories/Inner%20Lid.jpg" />
//                   <p className="text-center font-bold py-1 mt-1">Inner Lid</p>
//                 </div>
//               </div>
//               <div className="w-1/6">
//                 <div className="shadow-lg border-1 border-red-100 bg-red-100 m-1 rounded-xl overflow-hidden px-3 pt-3">
//                   <img src="https://summithomeappliance.com/asset/images/categories/Inner%20Lid.jpg" />
//                   <p className="text-center font-bold py-1 mt-1">Steel</p>
//                 </div>
//               </div>
//               <div className="w-1/6">
//                 <div className="shadow-lg border-1 border-red-100 bg-red-100 m-1 rounded-xl overflow-hidden px-3 pt-3">
//                   <img src="https://summithomeappliance.com/asset/images/categories/Inner%20Lid.jpg" />
//                   <p className="text-center font-bold py-1 mt-1">Aluminuim</p>
//                 </div>
//               </div>
//               <div className="w-1/6">
//                 <div className="shadow-lg border-1 border-red-100 bg-red-100 m-1 rounded-xl overflow-hidden px-3 pt-3">
//                   <img src="https://summithomeappliance.com/asset/images/categories/Inner%20Lid.jpg" />
//                   <p className="text-center font-bold py-1 mt-1">Triply</p>
//                 </div>
//               </div>
//               <div className="w-1/6">
//                 <div className="shadow-lg border-1 border-red-100 bg-red-100 m-1 rounded-xl overflow-hidden px-3 pt-3">
//                   <img src="https://summithomeappliance.com/asset/images/categories/Inner%20Lid.jpg" />
//                   <p className="text-center font-bold py-1 mt-1">Hard Anodised</p>
//                 </div>
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
//                 <Link key={index} to={`/879/DetailProduct/${item.sno}`}>
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
//       </div>


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

// export default DetailProduct;
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Share2, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FeedbackProduct from "./FeedbackProduct";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { FaCartPlus } from "react-icons/fa";
import { TbArrowsCross } from "react-icons/tb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { toast } from "react-toastify";

const DetailProduct = ({ user, setaddcart, addToCart, buyNowHandle, isLoggedIn }) => {
  const { id } = useParams();
  const originalProduct = user.find((item) => item.id === id);
  console.log("originalProduct", originalProduct);
  console.log("users ", user);
  const [selectedProduct, setSelectedProduct] = useState(originalProduct);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [scrollIndexMore, setScrollIndexMore] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectshape, setselectShape] = useState(null);
  const [selectBottom, setselectBottom] = useState(null);
  const tabs = ["Description", "Additional info", "Shipping Policy", "Refund Policy"];
  const [activeTab, setActiveTab] = useState("Description");


  const visibleCount = 4;
  const itemWidth = 260;
  const uniqueValues = (arr, key) => [...new Set(arr.map(p => p[key]).filter(Boolean))];

  const bottomFilter = uniqueValues(user, 'bottom_type')
  const [pincode, setPincode] = useState('');
  const [estimatedDate, setEstimatedDate] = useState(null);
  const [error, setError] = useState('');

  const calculateDays = (pin) => {
    const firstDigit = pin.charAt(0);
    switch (firstDigit) {
      case '1':
        return 2;
      case '2':
        return 3;
      case '3':
      case '4':
        return 4;
      case '5':
      case '6':
        return 5;
      case '7':
      case '8':
        return 6;
      default:
        return null;
    }
  };

  const handleCheck = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit pincode');
      setEstimatedDate(null);
      return;
    }

    setError('');
    const days = calculateDays(pincode);
    if (days === null) {
      setEstimatedDate('Delivery not available for this pincode');
      return;
    }

    // Add business days
    const deliveryDate = new Date();
    let added = 0;
    while (added < days) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      const day = deliveryDate.getDay();
      if (day !== 0 && day !== 6) added++; // Skip Sat/Sun
    }

    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const formatted = deliveryDate.toLocaleDateString('en-IN', options);
    setEstimatedDate(`Estimated delivery by ${formatted}`);
  };
  console.log(bottomFilter);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${baseURL}products/${id}`);
        setSelectedProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id, baseURL]);

  useEffect(() => {
    if (selectedProduct) {
      // console.log(selectedProduct.bottom);
      setselectShape(selectedProduct.shape);
      setselectBottom(selectedProduct.bottom);
      setSelectedWeight(selectedProduct.product_weight);
    }
  }, [selectedProduct]);
  const handleAddToCart = (item) => {
    addToCart(
      {
        id: item.id,
        product_name: item.name,
        product_price: item.price,
      },
      1
    );
    toast.success("Added to cart");

  };
  const handleNextMore = () => {
    const maxIndex = morecategory.length * 5 - visibleCount;
    setScrollIndexMore((prevIndex) =>
      prevIndex >= maxIndex ? 0 : prevIndex + 1
    );
  };

  const handlePrevMore = () => {
    const maxIndex = morecategory.length * 5 - visibleCount;
    setScrollIndexMore((prevIndex) =>
      prevIndex <= 0 ? maxIndex : prevIndex - 1
    );
  };

  const handleNext = () => {
    const maxIndex = youMayLike.length * 5 - visibleCount;
    setScrollIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const handlePrev = () => {
    const maxIndex = youMayLike.length * 5 - visibleCount;
    setScrollIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
  };

  if (!user || user.length === 0) {
    return <div>Loading...</div>;
  }

  const selectedsku = selectedProduct
    ? user.filter(
      (item) =>
        item.product_description === selectedProduct.product_description
    )
    : [];



  const handleCopy = () => {
    const currentUrl = window.location.href;

    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // hide after 1.5 sec
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const hanlderPlainshap = () => {
    // alert("plain");
    setselectShape("plain");
    const newProduct = user.find(
      (item) =>
        item.product_description === selectedProduct.product_description &&
        item.shape === "plain" &&
        item.bottom == selectedProduct.bottom &&
        item.product_weight == selectedProduct.product_weight
    );

    if (newProduct) {
      navigate(`/879/DetailProduct/${newProduct.sno}`);
      setSelectedProduct(newProduct);
    }
  };

  const hanlderPanShap = () => {
    setselectShape("pan");
    const newProduct = user.find(
      (item) =>
        item.product_description === selectedProduct.product_description &&
        item.shape === "pan" &&
        item.bottom_type == selectedProduct.bottom
      // && item.product_weight == selectedProduct.product_weight
    );
    console.log(newProduct);
    if (newProduct) {
      navigate(`/879/DetailProduct/${newProduct.sno}`);
      setSelectedProduct(newProduct);
    }
  };

  const hanlderInduction = (type) => {
    // alert("Induction");
    setselectShape(type);
    const newProduct = user.find(
      (item) =>
        item.product_description === selectedProduct.product_description &&
        item.bottom_type === type &&
        item.shape == selectedProduct.shape
      // && item.product_weight == selectedProduct.product_weight
    );
    console.log(newProduct);
    if (newProduct) {
      navigate(`/879/DetailProduct/${newProduct.sno}`);
      setSelectedProduct(newProduct);
    }
  };

  const hanlderNonInduction = () => {
    // alert("Non-Induction");
    setselectShape("Non-Induction");
    const newProduct = user.find(
      (item) =>
        item.product_description === selectedProduct.product_description &&
        item.bottom === "Non-Induction" &&
        item.shape == selectedProduct.shape &&
        item.product_weight == selectedProduct.product_weight
    );
    if (newProduct) {
      navigate(`/879/DetailProduct/${newProduct.sno}`);
      setSelectedProduct(newProduct);
    }
  };

  if (!selectedProduct) {
    return <div>Product not found</div>;
  }

  const morecategory = user
    .filter(
      (item) => item.product_category !== selectedProduct.product_category
    )
    .reduce((acc, curr) => {
      if (
        !acc.find((item) => item.product_category === curr.product_category)
      ) {
        acc.push(curr);
      }
      return acc;
    }, []);

  const youMayLike = user.filter(
    (item) =>
      item.product_category === selectedProduct.product_category &&
      item.sno !== selectedProduct.sno // exclude the current product
  );

  const handleAddCart = () => {
    addToCart(
      {
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        product_price: selectedProduct.price,
        image: selectedProduct.images[0].url,
      },
      1
    );
  };

  return (
    <>
      <div className="text-xs mb-2 py-2 bg-red-50 px-16 font-bold">
        Home / {selectedProduct.product_category} /{" "}
        {selectedProduct.product_sub_category} / <span className="text-[#B91508]">{selectedProduct.name}</span>
      </div>
      <div className="md:px-16 px-4 ">
        <div className="w-full flex flex-col items- md:flex-row pb-10 gap-10">
          <div className="w-[40%]">
            <img
              src={
                selectedProduct.images?.[0]?.url
                  ? `https://api.summithomeappliance.com/php_admin_panel/${selectedProduct.images[0].url}`
                  : '/asset/images/dummy-image-square.jpg'
              }
              alt={selectedProduct.name}
              className="rounded-lg w-full shadow-lg"
            />





            <div className="mt-3">
              <div className="flex flex-wra ">
                <div className="w-1/4">
                  <div className="shadow-lg border-1 border-red-100 m-1 rounded-xl overflow-hidden">
                    <img src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Aluminium/variant_114/1753788865_6888b1c1ef007.jpg" />
                  </div>
                </div>
                <div className="w-1/4">
                  <div className="shadow-lg border-1 border-red-100 m-1 rounded-xl overflow-hidden">
                    <img src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" />
                  </div>
                </div>
                <div className="w-1/4">
                  <div className="shadow-lg border-1 border-red-100 m-1 rounded-xl overflow-hidden">
                    <img src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" />
                  </div>
                </div>
                <div className="w-1/4">
                  <div className="shadow-lg border-1 border-red-100 m-1 rounded-xl overflow-hidden">
                    <img src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" />
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="w-full md:w-[60%]">


            <div className="w-full flex justify-between items-center">
              <div>
                <span className="bg-[#B91508] text-white py-1 px-3 text-sm mr-1">
                  Fine
                </span>
                <span className="bg-[#B91508] text-white py-1 px-3 text-sm m-1">
                  Prime
                </span>
                <span className="bg-[#B91508] text-white py-1 px-3 text-sm m-1">
                  Supreme
                </span>
                <span className="bg-[#B91508] text-white py-1 px-3 text-sm m-1">
                  Heavy
                </span>
                <span className="bg-[#B91508] text-white py-1 px-3 text-sm m-1">
                  Ultimate
                </span>
                {/* <span className="bg-[#B91508] text-white py-1 px-3 text-sm">
                Blacko
              </span>
              <span className="bg-[#B91508] text-white py-1 px-3 text-sm">
                Desire
              </span>
              <span className="bg-[#B91508] text-white py-1 px-3 text-sm">
                Elite
              </span> */}
              </div>
              <div className="flex items-center gap-0.5">
                <FaStar className="text-[#B91508]" />
                <FaStar className="text-[#B91508]" />
                <FaStar className="text-[#B91508]" />
                <FaStar className="text-[#B91508]" />
                <FaStar className="text-[#B91508]" />
                <span className="ml-3">0 reviews</span>{" "}
                {/* Copy button */}
                <div className="relative inline-block">
                  <span
                    className="font-bold"
                    onClick={handleCopy}
                  >
                    <Share2 size={15} strokeWidth={2} />
                  </span>

                  {/* Tooltip */}
                  {copied && (
                    <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-90">
                      Copied!
                    </div>
                  )}
                </div>


              </div>{" "}
            </div>


            <h1 className="text-lg font-semibold mt-3">
              {selectedProduct.name}
            </h1>


            <span className="bg-[#F5F5F7] text-xs rounded-sm text-[#636365] px-2 py-0.5 font-semibold">
              SKU:  {selectedProduct.sku}
            </span>


            <div className="price">
              <p className="font-bold text-xl mt-3">
                {" "}
                ₹{selectedProduct.price}


                <span className="bg-[#] rounded-sm text-[#919191] px-2 py-0.5 font-semibold">
                  ₹   <span className="line-through decoration-2">{selectedProduct.price}</span>

                </span>
                <span className="bg-[#F5F5F7] rounded-sm text-[#B91508] px-2 py-0.5 font-semibold">
                  50% Off{selectedProduct.product_discount}{" "}
                  {selectedProduct.product_discount_type}
                </span>
              </p>
              <p className="text-xs mt-1">(Inclusive of all taxes)</p>
            </div>





            <div className="mt-3">
              <h1 className="flex items-center">
                <span className="font-semibold">Capacity : </span>
                {/* <p className="ml-2 text-[#636365] "> </p> */}
              </h1>
              <div className="flex gap-2 flex-wrap mt-3 text-sm">
                {[
                  ...new Map(
                    selectedsku.slice() // clone array to avoid mutation
                      .sort((a, b) => {
                        const getSizeValue = (str) => parseFloat(str); // "2 Liters" => 2
                        return getSizeValue(a.size) - getSizeValue(b.size);
                      }).map((item) => [item.size, item])
                  ).values(),
                ].map((item, index) => (
                  <Link key={index} to={`/879/DetailProduct/${item.id}`}>
                    <p
                      onClick={() => setSelectedWeight(item.size)} // This updates the selected item
                      className={`${selectedWeight === item.size
                        ? "bg-[#B915080D] text-[#B91508] border-1 border-[#B91508]" // Red background when clicked
                        : "bg-[#F5F5F7] text-[#636365]" // Default background
                        } rounded-sm px-2 py-0.5 font-semibold`}
                    >
                      {item.size}
                    </p>
                  </Link>
                ))}
              </div>
              <div></div>
            </div>


            <div className="mt-3 flex gap-8">
              <div>
                <p className="font-semibold mb-2">Shape:</p>
                <span
                  className={`${selectshape === "plain"
                    ? "bg-[#B915080D] text-[#B91508] border-1 border-[#B91508]"
                    : "bg-[#F5F5F7] text-[#636365]"
                    }  rounded-md  px-2 py-0.5 font-semibold cursor-pointer`}
                  onClick={() => {
                    // setselectShape("plain");
                    hanlderPlainshap();
                  }}
                >
                  Plain
                </span>
                <span
                  className={`${selectshape == "pan"
                    ? "bg-[#B915080D] text-[#B91508] border-1 border-[#B91508]"
                    : "bg-[#F5F5F7] text-[#636365]"
                    }bg-[#F5F5F7]  rounded-md text-[#636365] px-2 py-0.5 font-semibold ml-2 cursor-pointer`}
                  onClick={() => {
                    // setselectShape("pan");
                    hanlderPanShap();
                  }}
                >
                  pan
                </span>
              </div>
              <div>
                <p className="font-semibold mb-2">Bottom:</p>
                {
                  bottomFilter.map((filter) => (
                    <>
                      <span
                        onClick={() => {
                          setselectBottom(filter);

                          hanlderInduction();
                        }}
                        className={`${selectBottom === filter
                          ? "bg-[#B915080D] text-[#B91508] border-1 border-[#B91508]"
                          : "bg-[#F5F5F7] text-[#636365]"
                          }bg-[#F5F5F7]  rounded-md text-[#636365] px-2 py-0.5 font-semibold ml-2 cursor-pointer`}
                      >
                        {filter}
                      </span>
                    </>
                  ))
                }
              </div>
            </div>


            <div className="mt-3 flex md:justify- gap-5">
              <button
                onClick={() => handleAddToCart(selectedProduct)}
                className="bg-[#B91508] hover:bg-[#a21307] active:bg-[#7e0f06] text-white border border-[#B91508] px-8 md:px-15 py-2 font-semibold rounded-full cursor-pointer hover:shadow-md hover:scale-105 active:scale-95 transform transition-all duration-150"
              >
                Add to cart
              </button>
              <button onClick={() => buyNowHandle(selectedProduct)} className=" rounded-full  border-1 text-[#B91508]  border-[#B91508] px-8 md:px-15 py-2 font-semibold cursor-pointer">
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
                    className="w-4 h-4"
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
                    className="w-4 h-4"
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
                    placeholder="Enter your Pin Code"
                    className="p-2 border-2 border-gray-300 placeholder:text-sm placeholder:font-semibold rounded-lg"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                  <button
                    className="rounded-lg border border-[#B91508] text-[#B91508] p-2 font-semibold"
                    onClick={handleCheck}
                  >
                    Check Now
                  </button>

                </div>
                <div className="text-[#636365]">
                  Enter pincode to view delivery details
                </div>


                {error && (
                  <div className="text-red-600 font-semibold">{error}</div>
                )}

                {estimatedDate && !error && (
                  <div className="text-green-700 font-semibold mt-2">
                    🚚 {estimatedDate}
                  </div>
                )}
              </div>
            </div>


            <div className="varieties">
              <h4 className="text-lg font-semibold mt-2">More Varieties</h4>
              <div className="flex flex-wra ">
                <div className="w-1/4">
                  <div className="shadow-lg border-1 border-red-100 m-1 rounded-md overflow-hidden">
                    <img src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Aluminium/variant_114/1753788865_6888b1c1ef007.jpg" />
                    <p className="text-center font-bold bg-red-200 py-1">Plain</p>
                  </div>
                </div>
                <div className="w-1/4">
                  <div className="shadow-lg border-1 border-red-100 m-1 rounded-md overflow-hidden">
                    <img src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" />
                    <p className="text-center font-bold bg-red-200 py-1">Pan</p>
                  </div>
                </div>
                <div className="w-1/4">
                  <div className="shadow-lg border-1 border-red-100 m-1 rounded-md overflow-hidden">
                    <img src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" />
                    <p className="text-center font-bold bg-red-200 py-1">C-Tura</p>
                  </div>
                </div>
                <div className="w-1/4">
                  <div className="shadow-lg border-1 border-red-100 m-1 rounded-md overflow-hidden">
                    <img src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" />
                    <p className="text-center font-bold bg-red-200 py-1">Handi</p>
                  </div>
                </div>
              </div>
            </div>




            {/* -------------------end--------------- */}
          </div>
        </div>

        <div className="bg-[#FAFAFC] font-semibold items-center text-sm justify-center w-full grid-cols-2 grid md:grid-cols-3 gap-5 px-4 py-8 space-y-1 md:space-y-5 mt-5 rounded-sm">
          <div className="flex justify-center items-center gap-2">
            <img
              src="/asset/iconvector/Vector.png"
              alt=""
              className="w-5 h-5"
            />
            <span>Premium Quality</span>
          </div>
          <div className="flex justify-center items-center gap-2">
            <img
              src="/asset/iconvector/basil_stack-solid.png"
              alt=""
              className="w-5 h-5"
            />
            <span>Long-lasting 3 Layer Body</span>
          </div>

          <div className="flex justify-center items-center gap-2">
            <img
              src="/asset/iconvector/emojione-monotone_pot-of-food.png"
              className="w-5 h-5"
              alt=""
            />
            <span>No Food Burning/Sticking</span>
          </div>

          <div className="flex justify-center items-center gap-2">
            <img
              src="/asset/iconvector/Vector (3).png"
              alt=""
              className="w-5 h-5"
            />
            <span>Super Easy to Clean</span>
          </div>

          <div className="flex justify-center items-center gap-2">
            <img
              src="/asset/iconvector/Vector (4).png"
              alt=""
              className="w-5 h-5"
            />
            <span>Even Heating & Fast Cooking</span>
          </div>

          <div className="flex justify-center items-center gap-2">
            <img
              src="/asset/iconvector/Vector (5).png"
              alt=""
              className="w-5 h-5"
            />
            <span> ISI & ISO 9001 Certified</span>
          </div>
        </div>







        {/* ------------------product you may like ------------------ */}
        <div className="mt-8">
          {/* Tabs */}
          <div className="flex justify-center text-xs md:text-lg text-gray-300">
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
                      : "absolute bottom-[-1px] left-0 right-0 h-1 bg-gray-300"
                  }
                />
              </div>
            ))}
          </div>

          {/* -------------------------conditional rendering---------------------------- */}

          <div className=" p-4 mt-4">
            {activeTab === "Description" &&
              <div className="additional-info">



                <table class="mx-auto table-auto w-full md:w-1/2 md:table-fixed border-spacing-2 border-collapse border border-gray-400 ...">
                  <tbody>
                    <tr>
                      <td class="border border-gray-300"><strong>HSN Code:</strong></td>
                      <td class="border border-gray-300">{selectedProduct.hsn}</td>
                    </tr>
                    <tr>
                      <td class="border border-gray-300"><strong> Product Weight:</strong></td>
                      <td class="border border-gray-300">{selectedProduct.weight} kg</td>
                    </tr>
                    <tr>
                      <td class="border border-gray-300"><strong>Dimensions:</strong></td>
                      <td class="border border-gray-300">{selectedProduct.dimensions}</td>
                    </tr>

                    <tr>
                      <td class="border border-gray-300"><strong>Package Dimensions:</strong></td>
                      <td class="border border-gray-300">{selectedProduct.package_dimensions}</td>
                    </tr>


                    <tr>
                      <td class="border border-gray-300"><strong>Material:</strong> </td>
                      <td class="border border-gray-300">{selectedProduct.material}</td>
                    </tr>

                    <tr>
                      <td class="border border-gray-300"><strong>Shape:</strong></td>
                      <td class="border border-gray-300">{selectedProduct.shape}</td>
                    </tr>

                    <tr>
                      <td class="border border-gray-300"><strong>Bottom Type:</strong></td>
                      <td class="border border-gray-300">{selectedProduct.bottom_type}</td>
                    </tr>

                    <tr>
                      <td class="border border-gray-300"><strong>Size:</strong></td>
                      <td class="border border-gray-300">{selectedProduct.size}</td>
                    </tr>

                    <tr>
                      <td class="border border-gray-300"><strong>Tax Rate:</strong></td>
                      <td class="border border-gray-300">{selectedProduct.tax_rate}</td>
                    </tr>

                    <tr>
                      <td class="border border-gray-300"><strong>Warranty:</strong></td>
                      <td class="border border-gray-300">{selectedProduct.warranty}</td>
                    </tr>


                  </tbody>
                </table>
              </div>}

            {activeTab === "Additional info" && selectedProduct && (

              <p>{selectedProduct.contents}</p>
            )}
            {activeTab === "Shipping Policy" && selectedProduct && (

              <p>Shipping Policy Description.</p>
            )}
            {activeTab === "Refund Policy" && selectedProduct && (

              <p>Refund Policy Description.</p>
            )}

            {activeTab === "Review" && <ShowReview product_id={product_id} />}
            {activeTab === "Write feedback" && (
              <ReviewTaken id={product_id} isLoggedIn={isLoggedIn} />
            )}
          </div>

          {/* ------------------------------conditional rendering end ------------------------ */}
        </div>
        <div className="mt-5 relative">
          <h1 className="text-center mb-8 text-2xl font-semibold">
            You May Also Like
          </h1>
          <div className=" overflow-x-hidden ">
            <div
              className="flex flex-wrap px-4 py-2  "
              style={{ transform: `translateX(-${scrollIndex * itemWidth}px)` }}
            >
              {user.slice(0, 4)?.map((item, index) => (
                <Link className="w-1/4 p-2" key={index} to={`/879/DetailProduct/${item.id}`}>
                  <div style={{ boxShadow: "box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;" }}
                    className="relative bg-white rounded-md shadow-md shadow-red-50 border-1 border-red-200 overflow-hidden"
                    key={index}
                  >
                    <TbArrowsCross
                      icon={regularHeart}
                      style={{
                        color: "gray",
                        cursor: "pointer",
                        fontSize: "20px",
                      }}

                      className="absolute top-2 right-10"
                    />

                    <FontAwesomeIcon
                      icon={regularHeart}
                      style={{
                        color: "gray",
                        cursor: "pointer",
                        fontSize: "20px",
                      }}
                      className="absolute top-2 right-2"
                    />
                    <div
                      style={{
                        background: "#E03B2D",
                        cursor: "pointer",

                        color: "white",
                      }}
                      className="absolute top-2 left-0 px-3 rounded-r"
                    >20% off</div>

                    <div className="">
                      <Link className="flex" to={`/879/DetailProduct/${item.id}`}>
                        <img
                          src={
                            item.images?.[0]?.url
                              ? `https://api.summithomeappliance.com/php_admin_panel/${item.images[0].url}`
                              : '/asset/images/dummy-image-square.jpg'
                          }
                          alt={item.images?.[0]?.url ? item.name : 'No image available'}
                          className="w-full rounded-lg mx-auto"
                        />
                      </Link>

                      <div className="bg-red-50 flex flex-col items-center w-full p-2">


                        <div className="">
                          <img className="w-[50px] h-[50px] inline shadow border-1 border-red-500 rounded-full p-1 m-1" src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" alt="variant" />
                          <img className="w-[50px] h-[50px] inline shadow rounded-full m-1" src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Aluminium/variant_114/1753788865_6888b1c1ef007.jpg" alt="variant" />
                          <img className="w-[50px] h-[50px] inline shadow rounded-full m-1" src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" alt="variant" />
                          <img className="w-[50px] h-[50px] inline shadow rounded-full m-1" src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Aluminium/variant_114/1753788865_6888b1c1ef007.jpg" alt="variant" />
                        </div>

                        <h5 className="text-sm font-semibold truncate w-40 mt-2">
                          {item.name}
                        </h5>
                        <p className="text-sm font-semibold mt-2">
                          <span className="font-normal text-[#3e3e3e]">
                            M.R.P: 2000 {" "}
                          </span>
                          Rs. <span className="text-[#B91508] font-bold">{Math.floor(item.price)}</span>
                        </p>
                        <div className="flex justify-between w-full mt-3 px-2">
                          <button className="w-30 rounded-full px-3 py-1 text-white bg-[#B91508] cursor-pointer  font-semibold mr-1"
                          >
                            Buy Now
                          </button>
                          <button
                            className="w-30 rounded-full  px-3 py-1 color-white border-1 border-[#B91508] cursor-pointer ml-1 text-center"
                          >
                            <div className="flex items-center justify-center">
                              <span className="inline text-[#B91508]">Cart</span> <FaCartPlus className="mx-1 text-[#B91508]" />
                            </div>

                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <button
              onClick={handlePrev}
              className="absolute text-sm top-45 left-7 transform -translate-y-1/2 bg-[#E2E2E5] text-[#636365] px-2 py-0.5 text-center rounded-full z-10"
            >
              ❮
            </button>

            <button
              onClick={handleNext}
              className="absolute text-sm top-45 right-7 transform -translate-y-1/2 bg-[#E2E2E5] text-[#636365] px-2 py-0.5  rounded-full z-10"
            >
              ❯
            </button>
          </div>
        </div>

        {/* ---------------------Explore More category ------------------------- */}

        <div className="my-15 relative">
          <h1 className="text-center mb-8 text-2xl font-semibold">
            Explore More Categories
          </h1>

          <div className="varieties">
            <div className="flex gap-2">
              <div className="w-1/6">
                <div className="shadow-lg border-1 border-red-100 bg-red-100 m-1 rounded-xl overflow-hidden px-3 pt-3">
                  <img src="https://summithomeappliance.com/asset/images/categories/Outer%20Lid.jpg" />
                  <p className="text-center font-bold  py-1 mt-1">Outer Lid</p>
                </div>
              </div>
              <div className="w-1/6">
                <div className="shadow-lg border-1 border-red-100 bg-red-100 m-1 rounded-xl overflow-hidden px-3 pt-3">
                  <img src="https://summithomeappliance.com/asset/images/categories/Inner%20Lid.jpg" />
                  <p className="text-center font-bold py-1 mt-1">Inner Lid</p>
                </div>
              </div>
              <div className="w-1/6">
                <div className="shadow-lg border-1 border-red-100 bg-red-100 m-1 rounded-xl overflow-hidden px-3 pt-3">
                  <img src="https://summithomeappliance.com/asset/images/categories/Inner%20Lid.jpg" />
                  <p className="text-center font-bold py-1 mt-1">Steel</p>
                </div>
              </div>
              <div className="w-1/6">
                <div className="shadow-lg border-1 border-red-100 bg-red-100 m-1 rounded-xl overflow-hidden px-3 pt-3">
                  <img src="https://summithomeappliance.com/asset/images/categories/Inner%20Lid.jpg" />
                  <p className="text-center font-bold py-1 mt-1">Aluminuim</p>
                </div>
              </div>
              <div className="w-1/6">
                <div className="shadow-lg border-1 border-red-100 bg-red-100 m-1 rounded-xl overflow-hidden px-3 pt-3">
                  <img src="https://summithomeappliance.com/asset/images/categories/Inner%20Lid.jpg" />
                  <p className="text-center font-bold py-1 mt-1">Triply</p>
                </div>
              </div>
              <div className="w-1/6">
                <div className="shadow-lg border-1 border-red-100 bg-red-100 m-1 rounded-xl overflow-hidden px-3 pt-3">
                  <img src="https://summithomeappliance.com/asset/images/categories/Inner%20Lid.jpg" />
                  <p className="text-center font-bold py-1 mt-1">Hard Anodised</p>
                </div>
              </div>

            </div>
          </div>




          {/* <div className=" overflow-x-hidden ">

            <div
              className="flex gap-6  w-max px-4 py-2  "
              style={{
                transform: `translateX(-${scrollIndexMore * itemWidth}px)`,
              }}
            >
              {morecategory.map((item, index) => (
                <Link key={index} to={`/879/DetailProduct/${item.sno}`}>
                  {" "}
                  <div
                    key={index}
                    className="w-60  shrink-0 bg-white rounded-lg p-2 shadow-md"
                  >
                    <img
                      src={`https://summithomeappliances.performdigimonetize.com/admin/${item.product_images}`}
                      alt=""
                      className="w-36 h-36 mx-auto"
                    />
                    <p className="font-semibold text-sm mt-2">
                      {item.product_description}
                    </p>
                    <p className="text-xs mt-1">
                      Fast heating | Non-reactive nature
                    </p>
                    <p className="flex mt-1 text-[#EE9E13] text-sm">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </p>
                    <p className="font-bold mt-1">₹{item.product_price}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="bg-[#E4F1E8] text-[#1E9531] font-semibold py-0.5 px-2 rounded-md">
                        ₹{item.product_discount} save
                      </p>
                      <button className="text-[#683208] border border-[#683208] rounded-md px-2 py-0.5">
                        Add +
                      </button>
                    </div>
                    <p className="text-xs mt-1">(incl. of all taxes)</p>
                  </div>
                </Link>
              ))}
            </div>

            <button
              onClick={handlePrevMore}
              className="absolute text-sm top-45 left-7 transform -translate-y-1/2 bg-[#E2E2E5] text-[#636365] px-2 py-0.5 text-center rounded-full z-10"
            >
              ❮
            </button>

            <button
              onClick={handleNextMore}
              className="absolute text-sm top-45 right-7 transform -translate-y-1/2 bg-[#E2E2E5] text-[#636365] px-2 py-0.5  rounded-full z-10"
            >
              ❯
            </button>
          </div> */}
        </div>
      </div>


      <style>
        {`
  td{
  padding:10px
  }
  `}
      </style>

    </>

  );
};

export default DetailProduct;
