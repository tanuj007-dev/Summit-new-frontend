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
    <>
      {/* Mobile Version - Only text and button */}
      <div className="md:hidden relative w-full h-[400px] overflow-hidden bg-gradient-to-r from-[#b8896d] via-[#cfa78d] to-[#e1c1ad]">
        {/* Mobile Slider Wrapper */}
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="w-full h-full flex-shrink-0 flex flex-col justify-center px-8 text-white"
            >
              <h2 className="text-3xl text-center font-bold mb-4">
                {slide.title}
              </h2>
              <p className="text-lg mb-6 text-center leading-relaxed">
                {slide.description}
              </p>
              <div className="w-full flex justify-center">
                <Link
                  to={slide.link}
                  className="border-2 border-white text-white px-8 py-2 rounded-full hover:bg-white hover:text-black transition duration-300"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 mt-8 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition"
        >
          <FaChevronLeft size={16} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 mt-8 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition"
        >
          <FaChevronRight size={16} />
        </button>
      </div>

      {/* Desktop Version - Full slider with images */}
      <div className="hidden md:block relative w-full h-[600px] overflow-hidden bg-gradient-to-r from-[#b8896d] via-[#cfa78d] to-[#e1c1ad]">
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
              <div className="w-1/2 flex flex-col justify-center px-24 text-white bg-[#C09D88]">
                <h2 className="text-5xl font-bold mb-4 px-12">
                  {slide.title}
                </h2>
                <p className="text-3xl mb-6 leading-10 px-12">
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

        {/* Desktop Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition"
        >
          <FaChevronLeft size={18} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition"
        >
          <FaChevronRight size={18} />
        </button>
      </div>
    </>
  );
};

export default HeroSlider;
