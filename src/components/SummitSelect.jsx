//  import React, { useState, useEffect, useContext } from "react";
// import { Link } from "react-router-dom";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import axios from "../axiosConfig";
// import { CartContext } from "../context/CartContext";

// const SummitSelect = ({ user }) => {
//   const products = [
//     {
//       title: "2 Burner Gas Stove",
//       price: "Rs. 999",
//       oldPrice: "Rs. 2999",
//       image: "/asset/images/1burner.png",
//     },
//     {
//       title: "3 Burner Gas Stove",
//       price: "Rs. 1999",
//       oldPrice: "Rs. 4999",
//       image: "/asset/images/2burner.png",
//     },
//     {
//       title: "4 Burner Gas Stove",
//       price: "Rs. 2999",
//       oldPrice: "Rs. 5999",
//       image: "/asset/images/3burner.png",
//     },
//     {
//       title: "1 Burner Gas Stove",
//       price: "Rs. 499",
//       oldPrice: "Rs. 1499",
//       image: "/asset/images/4burner.png",
//     },
//     {
//       title: "2 Burner Gas Stove",
//       price: "Rs. 999",
//       oldPrice: "Rs. 2999",
//       image: "/asset/images/1burner.png",
//     },
//     {
//       title: "3 Burner Gas Stove",
//       price: "Rs. 1999",
//       oldPrice: "Rs. 4999",
//       image: "/asset/images/2burner.png",
//     },
//     {
//       title: "4 Burner Gas Stove",
//       price: "Rs. 2999",
//       oldPrice: "Rs. 5999",
//       image: "/asset/images/3burner.png",
//     },
//     {
//       title: "1 Burner Gas Stove",
//       price: "Rs. 499",
//       oldPrice: "Rs. 1499",
//       image: "/asset/images/4burner.png",
//     },
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [touchStartX, setTouchStartX] = useState(0);
//   const [touchEndX, setTouchEndX] = useState(0);
//   const [mouseStartX, setMouseStartX] = useState(0);
//   const [mouseEndX, setMouseEndX] = useState(0);
//   const [isDragging, setIsDragging] = useState(0);

//   const minSwipeDistance = 30; // Reduced minimum distance for faster swipe detection

//   // Touch handlers
//   const handleTouchStart = (e) => {
//     setTouchStartX(e.targetTouches[0].clientX);
//   };

//   const handleTouchMove = (e) => {
//     setTouchEndX(e.targetTouches[0].clientX);
//   };

//   const handleTouchEnd = () => {
//     const distance = touchStartX - touchEndX;
//     const isLeftSwipe = distance > minSwipeDistance;
//     const isRightSwipe = distance < -minSwipeDistance;

//     if (isLeftSwipe) {
//       nextSlide();
//     } else if (isRightSwipe) {
//       prevSlide();
//     }

//     // Reset touch positions
//     setTouchStartX(0);
//     setTouchEndX(0);
//   };

//   // Mouse handlers
//   const handleMouseDown = (e) => {
//     setIsDragging(true);
//     setMouseStartX(e.clientX);
//     e.preventDefault();
//   };

//   const handleMouseMove = (e) => {
//     if (!isDragging) return;
//     setMouseEndX(e.clientX);
//   };

//   const handleMouseUp = () => {
//     if (!isDragging) return;
    
//     const distance = mouseStartX - mouseEndX;
//     const isLeftSwipe = distance > minSwipeDistance;
//     const isRightSwipe = distance < -minSwipeDistance;

//     if (isLeftSwipe) {
//       nextSlide();
//     } else if (isRightSwipe) {
//       prevSlide();
//     }

//     // Reset mouse positions and dragging state
//     setMouseStartX(0);
//     setMouseEndX(0);
//     setIsDragging(false);
//   };

//   const handleMouseLeave = () => {
//     if (isDragging) {
//       setIsDragging(false);
//       setMouseStartX(0);
//       setMouseEndX(0);
//     }
//   };

//   // Responsive slides per view
//   const getSlidesToShow = () => {
//     if (typeof window !== 'undefined') {
//       const width = window.innerWidth;
//       if (width < 640) return 2; // sm breakpoint - 2 items on mobile
//       if (width < 768) return 3; // md breakpoint - 3 items
//       if (width < 1024) return 4; // lg breakpoint - 4 items
//       return 5; // xl and above - 5 items
//     }
//     return 5; // default for SSR
//   };
  
//   const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());
  
//   useEffect(() => {
//     const handleResize = () => {
//       setSlidesToShow(getSlidesToShow());
//     };
    
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const nextSlide = () => {
//     if (currentIndex < products.length - slidesToShow) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       setCurrentIndex(0);
//     }
//   };

//   const prevSlide = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     } else {
//       setCurrentIndex(products.length - slidesToShow);
//     }
//   };

//   const baseURL = import.meta.env.VITE_APP_API_BASE_URL;
//   const imageURL = import.meta.env.VITE_APP_IMAGE_BASE_URL;
//   const { handleAddToCart, handleBuyNow } = useContext(CartContext);

//   useEffect(() => {
//     axios
//       .get(`${baseURL}products`)
//       .catch((e) => console.log("Error fetching Product Details:", e));
//   }, []);

//   return (
//     <section className="w-full bg-white py-6 sm:py-8 px-2 sm:px-6 lg:px-8 relative">
//       {/* Section Title */}
//       <div className="text-center mb-6 sm:mb-8">
//         <h2 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
//         Summit Select
//         </h2>
//         <p className="text-[#636365] text-sm sm:text-base md:text-lg font-semibold mt-1">
//         Handpicked Hits from every category
//         </p>
//       </div>

    

//       {/* Slider Container */}
//       <div className="relative flex flex-col">
//         <div 
//           className="w-full overflow-hidden"
//           onTouchStart={handleTouchStart}
//           onTouchMove={handleTouchMove}
//           onTouchEnd={handleTouchEnd}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           onMouseLeave={handleMouseLeave}
//           style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
//         >
//           <div
//             className="flex transition-transform duration-300 ease-out"
//             style={{
//               transform: `translateX(-${(currentIndex * 100) / slidesToShow}%)`,
//             }}
//           >
//             {products.map((item, i) => (
//               <div key={i} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 flex-shrink-0 px-2 sm:px-3">
//                 <div className="flex flex-col items-center w-full">
//                   {/* IMAGE */}
//                   <div className="relative w-full overflow-hidden rounded-2xl shadow-md">
//                     <Link to={`/product-details/${item.id}`}>
//                       <img
//                         src={item.image}
//                         alt={item.title}
//                         className="w-full h-[190px] sm:h-[180px] md:h-[220px] lg:h-[300px] object-cover rounded-2xl transition-transform duration-300 hover:scale-110"
//                       />
//                     </Link>
//                <span className="absolute bottom-8 sm:bottom-10 left-0 bg-[#B91508] text-white text-[10px] sm:text-sm px-2 sm:px-3 py-1 rounded">
//                       Sale
//                     </span>
//                   </div>

//                   {/* TEXT + PRICE */}
//                     <div className="text-center text-nowrap mt-3 sm:mt-4">
//                     <h3 className="text-[18px] sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-1">
//                       {item.title}
//                     </h3>
//                     <p className="text-[14px] sm:text-sm text-gray-400 mb-2 sm:mb-3">
//                       from{" "}
//                       <span className="font-semibold text-black">
//                         {item.price}
//                       </span>{" "}
//                       <span className="text-gray-400 line-through ml-1">
//                         {item.oldPrice}
//                       </span>
//                     </p>
//                   </div>

//                   {/* BUTTONS */}
//                  <div className="flex gap-1 sm:gap-3 justify-center mt-auto">
//                     <button
//                       onClick={() => handleAddToCart(item.id)}
//                       className="bg-[#B91508] text-white text-nowrap text-[13px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-red-700 transition"
//                     >
//                       Add to Cart
//                     </button>
//                     <button
//                       onClick={() => handleBuyNow(item.id)}
//                       className="text-[#B91508] text-[13px] sm:text-sm text-nowrap border-1 border-[#B91508] px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-[#B91508] hover:text-white transition"
//                     >
//                       Buy Now
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>

//       {/* Progress Bar */}
//       <div className="mt-6 px-8">
//         <div className="relative">
//           {/* Progress Track */}
//           <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
//             {/* Progress Fill */}
//             <div 
//               className="h-full bg-gray-400 transition-all duration-200 ease-out rounded-full"
//               style={{
//                 width: `${((currentIndex + slidesToShow) / products.length) * 100}%`
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

  // export default SummitSelect;

import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "../axiosConfig";
import { CartContext } from "../context/CartContext";

const SummitSelect = () => {
  const { handleAddToCart, handleBuyNow } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseStartX, setMouseStartX] = useState(0);
  const [mouseEndX, setMouseEndX] = useState(0);

  const minSwipeDistance = 30;

  /* ---------------- SLIDES RESPONSIVE ---------------- */
  const getSlidesToShow = () => {
    const width = window.innerWidth;
    if (width < 640) return 2;
    if (width < 768) return 3;
    if (width < 1024) return 4;
    return 5;
  };

  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());

  useEffect(() => {
    const resize = () => setSlidesToShow(getSlidesToShow());
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ---------------- API CALL ---------------- */
  const searchValue = "pressure";
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`/api/products/view?search=${searchValue}`, {
 
  withCredentials: true,  
});


         
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Product fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ---------------- SLIDER LOGIC ---------------- */
  const nextSlide = () => {
    if (currentIndex < products.length - slidesToShow) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(products.length - slidesToShow);
    }
  };

  /* ---------------- TOUCH & MOUSE ---------------- */
  const handleTouchStart = (e) => setTouchStartX(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEndX(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    const dist = touchStartX - touchEndX;
    if (dist > minSwipeDistance) nextSlide();
    if (dist < -minSwipeDistance) prevSlide();
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setMouseStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) setMouseEndX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    const dist = mouseStartX - mouseEndX;
    if (dist > minSwipeDistance) nextSlide();
    if (dist < -minSwipeDistance) prevSlide();
    setIsDragging(false);
  };

  /* ---------------- UI ---------------- */
  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  // Debug: Log products data
  console.log('Products data:', products);

  return (
    <section className="w-full bg-white py-8 px-4">
      {/* TITLE */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold">Summit Select</h2>
        <p className="text-gray-500">Handpicked Hits from every category</p>
      </div>

      {/* SLIDER */}
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: `translateX(-${(currentIndex * 100) / slidesToShow}%)`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.product_id}
              className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 px-2 flex-shrink-0"
            >
              <div className="text-center">
                {/* IMAGE */}
                <Link to={`/product-details/${product.product_id}`}>
                  <img
                    src={product.image}   
                    alt={product.product_name}
                    className="w-full h-[260px] object-contain rounded-xl hover:scale-105 transition"
                    onError={(e) => {
                      console.log('Image failed to load:', product.image);
                      console.log('Product data:', product);
                      console.log('Error details:', e);
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', product.image);
                    }}
                  />
                </Link>

                {/* TEXT */}
                <h3 className="mt-3 font-semibold text-lg">
                  {product.product_name}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {" "}
                  <span className="text-black font-semibold">
                   ₹{product.mrp}
                  </span>{" "}
                 
                </p>

                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {product.description}
                </p>

                {/* BUTTONS */}
                <div className="flex justify-center gap-3 mt-3">
                  <button
                    onClick={() => handleAddToCart(product.product_id)}
                    className="bg-[#B91508] text-white px-4 py-2 rounded-full text-sm"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(product.product_id)}
                    className="border border-[#B91508] text-[#B91508] px-4 py-2 rounded-full text-sm hover:bg-[#B91508] hover:text-white"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
            
      {/* PROGRESS BAR */}
      <div className="mt-6 px-10">
        <div className="h-1 bg-gray-200 rounded-full">
          <div
            className="h-full bg-gray-400 rounded-full"
            style={{
              width: `${((currentIndex + slidesToShow) / products.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default SummitSelect;
