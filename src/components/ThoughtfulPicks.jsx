import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "../axiosConfig";
import { CartContext } from "../context/CartContext";

const ThoughtfulPicks = () => {
  const products = [
    { title: "2 Burner Gas Stove", price: 999, oldPrice: 2999, image: "/asset/images/1burner.png" },
    { title: "3 Burner Gas Stove", price: 1999, oldPrice: 4999, image: "/asset/images/2burner.png" },
    { title: "4 Burner Gas Stove", price: 2999, oldPrice: 5999, image: "/asset/images/3burner.png" },
    { title: "1 Burner Gas Stove", price: 499, oldPrice: 1499, image: "/asset/images/4burner.png" },
    { title: "2 Burner Gas Stove", price: 999, oldPrice: 2999, image: "/asset/images/1burner.png" },
    { title: "3 Burner Gas Stove", price: 1999, oldPrice: 4999, image: "/asset/images/2burner.png" },
    { title: "4 Burner Gas Stove", price: 2999, oldPrice: 5999, image: "/asset/images/3burner.png" },
    { title: "1 Burner Gas Stove", price: 499, oldPrice: 1499, image: "/asset/images/4burner.png" },
  ];

  const filters = [
    { label: "Under ₹999", value: 999 },
    { label: "Under ₹1499", value: 1499 },
    { label: "Under ₹1999", value: 1999 },
    { label: "Under ₹2999", value: 2999 },
  ];

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeFilter, setActiveFilter] = useState("Under ₹2999");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [mouseStartX, setMouseStartX] = useState(0);
  const [mouseEndX, setMouseEndX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const minSwipeDistance = 30; // Reduced minimum distance for faster swipe detection

  // Touch handlers
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

  const { handleAddToCart, handleBuyNow } = useContext(CartContext);

  /* 🔹 Responsive slides */
  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(2);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(5);
      }
    };

    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  /* 🔹 Filter logic */
  const handleFilterClick = (value, label) => {
    setActiveFilter(label);
    setFilteredProducts(products.filter(p => p.price <= value));
    setCurrentIndex(0);
  };

  /* 🔹 Slider logic */
  const nextSlide = () => {
    if (currentIndex < filteredProducts.length - slidesToShow) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredProducts.length - slidesToShow);
    }
  };

  
  return (
    <section className="w-full bg-white py-6 px-2 sm:px-6 relative">

      {/* ===== Heading ===== */}
      <div className="text-center mb-2 sm:mb-6">
        <h2 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
          Thoughtful Picks by Price
        </h2>
        <p className="text-[#636365] text-sm sm:text-base md:text-lg mb-4 font-semibold mt-1">
          Gifting Made Simple, Shopping Made Smarter
        </p>
      </div>

      {/* ===== Filters ===== */}
      <div className="overflow-x-auto scrollbar-hide pb-2 mb-3 sm:mb-6">
        <div className="flex gap-1 justify-center sm:gap-3 min-w-max px-1">
          {filters.map(filter => (
            <button
              key={filter.value}
              onClick={() => handleFilterClick(filter.value, filter.label)}
              className={`rounded-full justify-center px-3 sm:px-4 md:px-5 py-1.5 text-sm sm:text-base md:text-lg transition-all whitespace-nowrap flex-shrink-0
                ${
                  activeFilter === filter.label
                    ? "bg-[#B91508] text-white shadow-md scale-105"
                    : "bg-[#E9E9EB] text-[#545455]"
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      

      {/* ===== Slider ===== */}
      <div className="relative flex flex-col mt-6">
        <div 
          className="w-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / slidesToShow}%)`,
            }}
          >
            {filteredProducts.map((item, i) => (
              <div
                key={i}
                className={`flex-shrink-0 px-2 ${
                  slidesToShow === 1
                    ? "w-full"
                    : slidesToShow === 2
                    ? "w-1/2"
                    : "w-1/5"
                }`}
              >
                <div className="max-w-[280px] mx-auto text-center">

                  {/* Image */}
                  <div className="relative rounded-2xl overflow-hidden shadow-md">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-[190px] sm:h-[200px] md:h-[260px] lg:h-[300px] object-cover rounded-2xl transition-transform duration-300 hover:scale-110"
                    />
                   <span className="absolute bottom-8 sm:bottom-10 left-0 bg-[#B91508] text-white text-[10px] sm:text-sm px-2 sm:px-3 py-1 rounded">
                      Sale
                    </span>
                  </div>

                  {/* Text */}
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

                  {/* Buttons */}
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
                width: `${((currentIndex + slidesToShow) / filteredProducts.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThoughtfulPicks;
