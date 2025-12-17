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
    <section className="w-full bg-white py-6 px-4 sm:px-6 relative">

      {/* ===== Heading ===== */}
      <div className="text-center mb-2 sm:mb-6">
        <h2 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
          Thoughtful Picks by Price
        </h2>
        <p className="text-[#636365] text-sm sm:text-base md:text-lg font-semibold mt-1">
          Gifting Made Simple, Shopping Made Smarter
        </p>
      </div>

      {/* ===== Filters ===== */}
      <div className="overflow-x-auto scrollbar-hide pb-2 mb-3 sm:mb-6">
        <div className="flex gap-1 sm:gap-3 min-w-max px-1">
          {filters.map(filter => (
            <button
              key={filter.value}
              onClick={() => handleFilterClick(filter.value, filter.label)}
              className={`rounded-full px-3 sm:px-4 md:px-5 py-1.5 text-[16px] sm:text-sm md:text-base transition-all whitespace-nowrap flex-shrink-0
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

      <p className="text-center text-[12px] mb-3 sm:text-sm text-gray-500  sm:mb-8">
        Festive Favorites & Luxe Kitchenware — something truly special.
      </p>

      {/* ===== Slider ===== */}
      <div className="relative flex items-center">

        {/* Prev */}
       <button
                 onClick={prevSlide}
                 className="absolute left-[-10px] sm:left-2 z-10 top-1/2 -translate-y-7/4 bg-white text-black p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-100 "
               >
                 <FaChevronLeft />
               </button>

        {/* Track */}
        <div className="w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / slidesToShow}%)`,
            }}
          >
            {filteredProducts.map((item, i) => (
              <div
                key={i}
                className={`flex-shrink-0 px-3 ${
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

        {/* Next */}
       <button
                onClick={nextSlide}
                className="absolute right-[-10px] sm:right-2 z-10 top-1/2 -translate-y-7/4 bg-white text-black p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-100 "
              >
                <FaChevronRight />
              </button>

      </div>
    </section>
  );
};

export default ThoughtfulPicks;
