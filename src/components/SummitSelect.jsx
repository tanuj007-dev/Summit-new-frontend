 import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "../axiosConfig";
import { CartContext } from "../context/CartContext";

const SummitSelect = ({ user }) => {
  const products = [
    {
      title: "2 Burner Gas Stove",
      price: "Rs. 999",
      oldPrice: "Rs. 2999",
      image: "/asset/images/1burner.png",
    },
    {
      title: "3 Burner Gas Stove",
      price: "Rs. 1999",
      oldPrice: "Rs. 4999",
      image: "/asset/images/2burner.png",
    },
    {
      title: "4 Burner Gas Stove",
      price: "Rs. 2999",
      oldPrice: "Rs. 5999",
      image: "/asset/images/3burner.png",
    },
    {
      title: "1 Burner Gas Stove",
      price: "Rs. 499",
      oldPrice: "Rs. 1499",
      image: "/asset/images/4burner.png",
    },
    {
      title: "2 Burner Gas Stove",
      price: "Rs. 999",
      oldPrice: "Rs. 2999",
      image: "/asset/images/1burner.png",
    },
    {
      title: "3 Burner Gas Stove",
      price: "Rs. 1999",
      oldPrice: "Rs. 4999",
      image: "/asset/images/2burner.png",
    },
    {
      title: "4 Burner Gas Stove",
      price: "Rs. 2999",
      oldPrice: "Rs. 5999",
      image: "/asset/images/3burner.png",
    },
    {
      title: "1 Burner Gas Stove",
      price: "Rs. 499",
      oldPrice: "Rs. 1499",
      image: "/asset/images/4burner.png",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Responsive slides per view
  const getSlidesToShow = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return 2; // sm breakpoint - 2 items on mobile
      if (width < 768) return 3; // md breakpoint - 3 items
      if (width < 1024) return 4; // lg breakpoint - 4 items
      return 5; // xl and above - 5 items
    }
    return 5; // default for SSR
  };
  
  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());
  
  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(getSlidesToShow());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const baseURL = import.meta.env.VITE_APP_API_BASE_URL;
  const imageURL = import.meta.env.VITE_APP_IMAGE_BASE_URL;
  const { handleAddToCart, handleBuyNow } = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`${baseURL}products`)
      .catch((e) => console.log("Error fetching Product Details:", e));
  }, []);

  return (
    <section className="w-full bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Section Title */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
        Summit Select
        </h2>
        <p className="text-[#636365] text-sm sm:text-base md:text-lg font-semibold mt-1">
        Handpicked Hits from every category
        </p>
      </div>

    

      {/* Slider Container */}
      <div className="relative  flex items-center">
        {/* Left Button */}
        <button
                 onClick={prevSlide}
                 className="absolute left-[-10px] sm:left-2 z-10 top-1/2 -translate-y-7/4 bg-gray-100 text-black p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-100 "
               >
                 <FaChevronLeft />
               </button>

        {/* Slider Track */}
        <div className="w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / slidesToShow}%)`,
            }}
          >
            {products.map((item, i) => (
              <div key={i} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 flex-shrink-0 px-2 sm:px-3">
                <div className="flex flex-col items-center w-full">
                  {/* IMAGE */}
                  <div className="relative w-full overflow-hidden rounded-2xl shadow-md">
                    <Link to={`/product-details/${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-[190px] sm:h-[180px] md:h-[220px] lg:h-[300px] object-cover rounded-2xl transition-transform duration-300 hover:scale-110"
                      />
                    </Link>
               <span className="absolute bottom-8 sm:bottom-10 left-0 bg-[#B91508] text-white text-[10px] sm:text-sm px-2 sm:px-3 py-1 rounded">
                      Sale
                    </span>
                  </div>

                  {/* TEXT + PRICE */}
                    <div className="text-center text-nowrap mt-3 sm:mt-4">
                    <h3 className="text-[18px] sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[14px] sm:text-sm text-gray-400 mb-2 sm:mb-3">
                      from{" "}
                      <span className="font-semibold text-black">
                        {item.price}
                      </span>{" "}
                      <span className="text-gray-400 line-through ml-1">
                        {item.oldPrice}
                      </span>
                    </p>
                  </div>

                  {/* BUTTONS */}
                 <div className="flex gap-1 sm:gap-3 justify-center mt-auto">
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className="bg-[#B91508] text-white text-nowrap text-[13px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-red-700 transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(item.id)}
                      className="text-[#B91508] text-[13px] sm:text-sm text-nowrap border-1 border-[#B91508] px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-[#B91508] hover:text-white transition"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Button */}
           <button
                  onClick={nextSlide}
                  className="absolute right-[-10px] sm:right-2 z-10 top-1/2 -translate-y-7/4 bg-gray-100 text-black p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-100 "
                >
                  <FaChevronRight />
                </button>
      </div>
    </section>
  );
};

export default SummitSelect;
