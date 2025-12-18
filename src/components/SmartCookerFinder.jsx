import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import axios from "../axiosConfig";  // ⛔ Backend disabled for now
import { CartContext } from "../context/CartContext";
import { FaChevronDown } from "react-icons/fa";
const FilterSelect = ({ label, options }) => (
  <div className="relative  mt-2 inline-block">
    <select
      className="
        appearance-none
        bg-gray-50 border-2 border-gray-300
        text-gray-700
        text-[15px] sm:text-sm
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
        absolute right-5 top-1/2 -translate-y-1/2
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
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
 const [mouseStartX, setMouseStartX] = useState(0);
  const [mouseEndX, setMouseEndX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const minSwipeDistance = 30; // Minimum distance for a swipe to be registered

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    // Reset touch positions
    setTouchStartX(0);
    setTouchEndX(0);
  };

  // Mouse handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setMouseStartX(e.clientX);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setMouseEndX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const distance = mouseStartX - mouseEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    // Reset mouse positions and dragging state
    setMouseStartX(0);
    setMouseEndX(0);
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setMouseStartX(0);
      setMouseEndX(0);
    }
  };

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
    <section className="w-full bg-white py-8 sm:py-8 px-2 sm:px- lg:px-8 relative">

      {/* Heading */}
      <div className="text-center mb-1 sm:mb-8">
        <h2 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-semibold text-black">
          Smart Cooker Finder
        </h2>
        <p className="text-[#636365] text-sm sm:text-base md:text-lg font-semibold mt-1">
          Built for the Way You Cook
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col  sm:flex-row  items-start sm:items-center gap-4 mt-4 justify-center mb-6 sm:mb-8">
        <div className="w-full sm:w-auto  overflow-xcurated-auto scrollbar-hide pb-2">
          <div className="flex flex-wrap  gap-3 sm:gap-4 min-w-max px-1">
            <FilterSelect cla label="Sort by: Price" options={["Popularity", "Newest", "Price: Low to High", "Price: High to Low"]} />
            <FilterSelect label="Type: Inner Lid" options={["Inner Lid", "Outer Lid", "Both"]} />
            <FilterSelect label="Material: 2 Selected" options={["Aluminium", "Steel", "Copper", "Brass"]} />
            <FilterSelect label="Size: 2 Selected" options={["3L", "5L", "7L", "10L"]} />
            <FilterSelect label="Shape: All" options={["Handi", "Regular", "Round", "Square"]} />
            <FilterSelect label="Bottom: All" options={["Induction", "Gas", "Both"]} />
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-3 flex-shrink-0 w-full items-center justify-end sm:w-auto">
          <button className="bg-[#B91508] text-white text-sm sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg whitespace-nowrap">
            Apply
          </button>
          <button className="text-[#B91508] text-sm sm:text-sm font-medium hover:underline whitespace-nowrap border-1 border-[#B91508] px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-[#B91508] hover:text-white transition">
            Reset
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="relative flex flex-col">
        <div 
          className="w-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
          onMouseMove={handleTouchMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)` }}
          >
            {products.map((item) => (
              <div
                key={item.id}
                className={`flex-shrink-0 px-2 flex flex-col items-center ${
                  itemsPerView === 2 ? 'w-1/2' : itemsPerView === 3 ? 'w-1/3' : 'w-1/5'
                }`}
              >
                <div className="flex flex-col items-center w-full max-w-[180px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px]">
                  {/* Image */}
                  <div className="relative w-full overflow-hidden rounded-2xl shadow-md mb-2 sm:mb-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-[190px] sm:h-[160px] md:h-[200px] lg:h-[300px] object-cover rounded-2xl transition-transform duration-300 hover:scale-110"
                    />
                    <span className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-0 bg-[#B91508] text-white text-[8px] sm:text-sm px-2 sm:px-3 py-1 rounded">
                      Sale
                    </span>
                  </div>

                  {/* Text */}
                  <div className="text-center text-nowrap mt-2 sm:mt-3 md:mt-4">
                    <h3 className="text-[18px] sm:text-sm md:text-base lg:text-xl font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[14px] sm:text-xs md:text-sm text-gray-400 mb-2 sm:mb-3">
                      from <span className="font-semibold text-black">{item.price}</span>{" "}
                      <span className="text-gray-400 line-through ml-1">{item.oldPrice}</span>
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-1 sm:gap-3 justify-center ">
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

      </div>

      {/* Progress Bar */}
      <div className="mt-6 px-8">
        <div className="relative">
          {/* Progress Track */}
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            {/* Progress Fill */}
            <div 
             className="h-full bg-gray-400 transition-all duration-200 ease-out rounded-full"
              style={{
                width: `${((currentIndex + itemsPerView) / products.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartCookerFinder;
