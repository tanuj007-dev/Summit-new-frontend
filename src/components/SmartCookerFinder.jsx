import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import axios from "../axiosConfig";  // ⛔ Backend disabled for now
import { CartContext } from "../context/CartContext";
import { FaChevronDown } from "react-icons/fa";
const FilterSelect = ({ label, options }) => (
  <div className="relative inline-block">
    <select
      className="
        appearance-none
        bg-white border border-gray-300
        text-gray-700
        text-[11px] sm:text-sm
        px-3 pr-7
        py-1.5
        rounded-full
        cursor-pointer
        w-auto
        min-w-[120px]
        max-w-[160px]
        focus:outline-none
        focus:ring-2 focus:ring-[#B91508]
      "
    >
      <option>{label}</option>
      {options.map((opt, i) => (
        <option key={i}>{opt}</option>
      ))}
    </select>

    <FaChevronDown
      className="
        absolute right-2 top-1/2 -translate-y-1/2
        text-gray-400 text-[10px]
        pointer-events-none
      "
    />
  </div>
);



const SmartCookerFinder = () => {
  // ✅ Static cooker data (as per your screenshot)
  const staticCookers = [
    {
      id: 1,
      title: "Prime Aluminium 5L",
      price: "Rs. 2170",
      oldPrice: "Rs. 2999",
      image: "/asset/images/cooker1.png",
    },
    {
      id: 2,
      title: "Prime Aluminium 5.5L",
      price: "Rs. 2330",
      oldPrice: "Rs. 4099",
      image: "/asset/images/cooker2.png",
    },
    {
      id: 3,
      title: "Supreme Aluminium 5L",
      price: "Rs. 2380",
      oldPrice: "Rs. 5099",
      image: "/asset/images/cooker3.png",
    },
    {
      id: 4,
      title: "Heavy Aluminium 5L",
      price: "Rs. 2770",
      oldPrice: "Rs. 3499",
      image: "/asset/images/cooker4.png",
    },
    {
      id: 1,
      title: "Prime Aluminium 5L",
      price: "Rs. 2170",
      oldPrice: "Rs. 2999",
      image: "/asset/images/cooker1.png",
    },
    {
      id: 2,
      title: "Prime Aluminium 5.5L",
      price: "Rs. 2330",
      oldPrice: "Rs. 4099",
      image: "/asset/images/cooker2.png",
    },
    {
      id: 3,
      title: "Supreme Aluminium 5L",
      price: "Rs. 2380",
      oldPrice: "Rs. 5099",
      image: "/asset/images/cooker3.png",
    },
    {
      id: 4,
      title: "Heavy Aluminium 5L",
      price: "Rs. 2770",
      oldPrice: "Rs. 3499",
      image: "/asset/images/cooker4.png",
    },
  ];

  const [products] = useState(staticCookers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Update items per view based on screen size
  React.useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2);
      } else if (window.innerWidth < 768) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const { handleAddToCart, handleBuyNow } = useContext(CartContext);

  // ⛔ Backend request paused (will enable later)
  // /*
  // useEffect(() => {
  //   axios.get(`${baseURL}products`).then(...);
  // }, []);
  // */

  const nextSlide = () => {
    if (currentIndex < products.length - itemsPerView) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(products.length - itemsPerView);
    }
  };

  return (
    <section className="w-full bg-[#F5F5F7] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative">

      {/* Heading */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-black">
          Smart Cooker Finder
        </h2>
        <p className="text-gray-500 text-sm sm:text-base md:text-lg mt-1">
          Built for the Way You Cook
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 justify-center mb-6 sm:mb-8">
        <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide pb-2">
          <div className="flex flex-wrap gap-3 sm:gap-4 min-w-max px-1">
            <FilterSelect label="Sort by: Price" options={["Popularity", "Newest", "Price: Low to High", "Price: High to Low"]} />
            <FilterSelect label="Type: Inner Lid" options={["Inner Lid", "Outer Lid", "Both"]} />
            <FilterSelect label="Material: 2 Selected" options={["Aluminium", "Steel", "Copper", "Brass"]} />
            <FilterSelect label="Size: 2 Selected" options={["3L", "5L", "7L", "10L"]} />
            <FilterSelect label="Shape: All" options={["Handi", "Regular", "Round", "Square"]} />
            <FilterSelect label="Bottom: All" options={["Induction", "Gas", "Both"]} />
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-3 flex-shrink-0 w-full items-center justify-center sm:w-auto">
          <button className="bg-[#B91508] text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg whitespace-nowrap">
            Apply
          </button>
          <button className="text-[#B91508] text-xs sm:text-sm font-medium hover:underline whitespace-nowrap">
            Reset
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="relative flex items-center">

        {/* Prev Button */}
        <button
          onClick={prevSlide}
          className="absolute left-[-10px] sm:left-2 z-10 top-1/2 -translate-y-7/4 bg-white text-black p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-100"
        >
          <FaChevronLeft />
        </button>

        <div className="w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)` }}
          >
            {products.map((item) => (
              <div
                key={item.id}
                className={`flex-shrink-0 px-2 flex flex-col items-center ${
                  itemsPerView === 2 ? 'w-1/2' : itemsPerView === 3 ? 'w-1/3' : 'w-1/5'
                }`}
              >
                <div className="flex flex-col items-center w-full max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px]">
                  {/* Image */}
                  <div className="relative w-full overflow-hidden rounded-2xl shadow-md mb-2 sm:mb-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-[160px] sm:h-[160px] md:h-[200px] lg:h-[300px] object-cover rounded-2xl transition-transform duration-300 hover:scale-110"
                    />
                    <span className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-0 bg-[#B91508] text-white text-[8px] sm:text-sm px-2 sm:px-3 py-1 rounded">
                      Sale
                    </span>
                  </div>

                  {/* Text */}
                  <div className="text-center text-nowrap mt-2 sm:mt-3 md:mt-4">
                    <h3 className="text-sm sm:text-sm md:text-base lg:text-xl font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-2 sm:mb-3">
                      from <span className="font-semibold text-black">{item.price}</span>{" "}
                      <span className="text-gray-400 line-through ml-1">{item.oldPrice}</span>
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-1 sm:gap-3 justify-center mt-auto">
                    <button 
                      onClick={() => handleAddToCart(item.id)}
                      className="bg-[#B91508] text-white text-nowrap text-[10px] sm:text-xs px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-red-700 transition"
                    >
                      Add to cart
                    </button>
                    <button 
                      onClick={() => handleBuyNow(item.id)}
                      className="text-[#B91508] text-nowrap text-[10px] sm:text-xs px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-[#B91508] hover:text-white transition"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={nextSlide}
          className="absolute right-[-10px] sm:right-2 z-10 top-1/2 -translate-y-7/4 bg-white text-black p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-100"
        >
          <FaChevronRight />
        </button>

      </div>
    </section>
  );
};

export default SmartCookerFinder;
