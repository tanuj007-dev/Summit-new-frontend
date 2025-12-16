import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const slides = [
  {
    title: "Pressure Cooker",
    description:
      "Range of Pressure Cookers that makes your work easy and convenient.",
    buttonText: "Shop Now",
    image: "/asset/images/17957013f7ef8ff01cdb34224096a756c3844bf5.png",
    link: "/products/3",
  },
  {
    title: "Smart Kitchen Tools",
    description:
      "Explore our premium kitchen tools that simplify your daily tasks.",
    buttonText: "Explore Now",
    image: "/asset/images/slide3.png",
    link: "/products/3",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-gradient-to-r from-[#b8896d] via-[#cfa78d] to-[#e1c1ad]">
      {/* Wrapper for all slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="flex w-full h-[600px] flex-shrink-0"
          >
            {/* Left content section */}
        <div className="w-1/2 flex flex-col justify-center px-10 md:px-24 text-white bg-[#C09D88]">
  <h2 className="text-4xl md:text-5xl font-bold mb-4 md:px-12">
    {slide.title}
  </h2>
  <p className="text-lg md:text-3xl mb-6 leading-8 md:leading-10 md:px-12">
    {slide.description}
  </p>

  {/* Button Centered */}
  <div className="w-full flex justify-start px-12 mt-4">
    <Link
      to={slide.link}
      className="border-2 border-white text-white px-12 py-3 rounded-full hover:bg-white hover:text-black transition duration-300"
    >
      {slide.buttonText}
    </Link>
  </div>
</div>

            {/* Right image section */}
            <div className="w-1/2 h-full bg-white flex items-center justify-center">
              <img
                src={slide.image}
                alt={slide.title}
                className="object-cover w-full h-full rounded-none"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Left button */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition"
      >
        <FaChevronLeft size={18} />
      </button>

      {/* Right button */}
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition"
      >
        <FaChevronRight size={18} />
      </button>

      {/* Dots
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full ${
              i === current ? "bg-white" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div> */}
    </div>
  );
};

export default HeroSlider;
