 import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { CartContext } from "../context/CartContext";

const Trends = () => {
  const allProducts = [
    { title: "2 Burner Gas Stove", price: "Rs. 999", oldPrice: "Rs. 2999", image: "/asset/images/1burner.png", category: "gas stove" },
    { title: "3 Burner Gas Stove", price: "Rs. 1999", oldPrice: "Rs. 4999", image: "/asset/images/2burner.png", category: "gas stove" },
    { title: "4 Burner Gas Stove", price: "Rs. 2999", oldPrice: "Rs. 5999", image: "/asset/images/3burner.png", category: "gas stove" },
    { title: "4 Burner Gas Stove", price: "Rs. 2999", oldPrice: "Rs. 5999", image: "/asset/images/4burner.png", category: "gas stove" },
    { title: "Pressure Cooker 5L", price: "Rs. 1899", oldPrice: "Rs. 2999", image: "/asset/images/1burner.png", category: "pressure cooker" },
    { title: "Non-stick Kadhai", price: "Rs. 1599", oldPrice: "Rs. 2599", image: "/asset/images/2burner.png", category: "cookware" },
    { title: "Gas Tandoor", price: "Rs. 999", oldPrice: "Rs. 1999", image: "/asset/images/3burner.png", category: "gas tandoor" },
    { title: "Mixer Grinder Pro", price: "Rs. 2399", oldPrice: "Rs. 3499", image: "/asset/images/4burner.png", category: "mixer grinder" },
  ];

  const [products] = useState(allProducts);
  const [selectedCategory, setSelectedCategory] = useState("all");
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

  const categories = [
    "all",
    "combos",
    "cookware",
    "pressure cooker",
    "steam cookware",
    "gas stove",
    "gas tandoor",
    "mixer grinder",
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  // === SLIDE ONE BY ONE ===
  const nextSlide = () => {
    if (currentIndex < filteredProducts.length - itemsPerView) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredProducts.length - itemsPerView);
    }
  };

  return (
    <section className="w-full bg-white py-8 sm:py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* ===== Heading ===== */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
          Trending Kitchen Appliances
        </h2>
        <p className="text-[#636365] text-sm sm:text-base md:text-lg font-semibold mt-1">
          Our Best Sellers
        </p>
      </div>

      {/* ===== Clickable Category Buttons ===== */}  
      <div className="w-full mx-auto flex justify-center text-[#545455] font-medium mb-6 sm:mb-8 lg:mb-10">
        <div className="overflow-x-auto scrollbar-hide pb-2">
          <div className="flex gap-3 sm:gap-4 md:gap-6 justify-center sm:justify-start min-w-max px-1">
            {categories.map((category, i) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentIndex(0);
                  }}
                  className={`rounded-full px-3 sm:px-4 md:px-5 py-1.5 text-[16px] sm:text-sm md:text-base transition-all whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? "bg-[#B91508] text-white"
                      : "bg-[#E9E9EB] text-[#545455] hover:bg-[#d5d5d7]"
                  }`}
                >
                  {category
                    .split(" ")
                    .map((w) => w[0].toUpperCase() + w.slice(1))
                    .join(" ")}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== Slider Section ===== */}
      <div className="relative flex items-center">
        {/* Prev Button */}
        <button
          onClick={prevSlide}
          className="absolute left-[-10px] sm:left-2 z-10 top-1/2 -translate-y-7/4 bg-white text-black p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-100 "
        >
          <FaChevronLeft />
        </button>

        {/* Slider */}
        <div className="w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
            }}
          >
            {filteredProducts.map((item, i) => (
              <div
                key={i}
                className={`flex-shrink-0 px-2 flex flex-col items-center ${
                  itemsPerView === 2 ? 'w-1/2' : itemsPerView === 3 ? 'w-1/3' : 'w-1/4 lg:w-1/5'
                }`}
              >
                <div className="flex flex-col items-center w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px]">
                  {/* IMAGE */}
                  <div className="relative w-full overflow-hidden rounded-2xl shadow-md">
                    <Link to={`/product-details/${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-[190px] sm:h-[200px] md:h-[260px] lg:h-[300px] object-cover rounded-2xl transition-transform duration-300 hover:scale-110"
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

        {/* Next Button */}
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

export default Trends;
