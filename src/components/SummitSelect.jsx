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
  const slidesToShow = 4;

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
    <section className="w-full bg-white py-10 px-6 relative">
      {/* Section Title */}
      <div className="md:w-full mb-4 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-semibold">
        Summit Select
        </h2>
        <p className="text-[#636365] mb-4 text-[1.2rem] mt-1">
        Handpicked Hits from every category
        </p>
      </div>

    

      {/* Slider Container */}
      <div className="relative  flex items-center">
        {/* Left Button */}
        <button
          onClick={prevSlide}
          className="absolute left-0 z-10 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-100"
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
              <div key={i} className="w-1/5 flex-shrink-0 px-3">
                <div className="flex flex-col items-center w-full max-w-[280px] mx-auto">
                  {/* IMAGE */} 
                  <div className="relative w-full overflow-hidden rounded-2xl shadow-md">
                    <Link to="#">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-[280px] h-[300px] object-cover rounded-2xl transition-transform duration-300 hover:scale-110"
                      />
                    </Link>
                    <span className="absolute bottom-10 bg-[#B91508] text-white text-md px-3 py-1 rounded">
                      Sale
                    </span>
                  </div>

                  {/* TEXT + PRICE */}
                  <div className="text-center mt-4">
                    <h3 className="text-base sm:text-xl md:text-xl font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-md text-gray-400 mb-3">
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
                  <div className="flex gap-3 justify-center mt-auto">
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className="bg-[#B91508] text-white text-sm px-4 py-1 rounded-full hover:bg-red-700 transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(item.id)}
                      className="text-[#B91508] text-sm px-4 py-2 rounded-full hover:bg-[#B91508] hover:text-white transition"
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
          className="absolute right-0 z-10 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default SummitSelect;
