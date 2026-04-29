import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import mobileSlide1 from './assets/mnav/1.png';
import mobileSlide2 from './assets/Untitled design (26).jpg';

const slides = [
  {
    title: "Pressure Cooker",
    description:
      "Range of Pressure Cookers that makes your work easy and convenient.",
    buttonText: "Shop Now",
    image: "/asset/images/ChatGPT Image Feb 6, 2026, 02_11_57 PM.png",
    mobileImage: mobileSlide1,
    link: "/products/3",
  },
  {
    title: "Smart Kitchen Tools",
    description:
      "Explore our premium kitchen tools that simplify your daily tasks.",
    buttonText: "Explore Now",
    image: "/asset/images/ChatGPT Image Feb 6, 2026, 02_16_17 PM.png",
    mobileImage: mobileSlide2,
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
      {/* Mobile Version - Full background image with dark overlay */}
      <div className="md:hidden relative w-full h-[400px] overflow-hidden bg-gray-900">
        {/* Mobile Slider Wrapper */}
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="relative w-full h-full flex-shrink-0 flex flex-col justify-center px-8 text-white bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.mobileImage || slide.image}')` }}
            >
              {/* Dark Overlay for Text Readability */}
              <div className="absolute inset-0 bg-black/40 transition-opacity" />
              
              {/* Foreground Text */}
              <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-3xl text-center font-semibold mb-4 drop-shadow-md">
                  {slide.title}
                </h2>
                <p className="text-lg mb-6 text-center leading-relaxed drop-shadow-md">
                  {slide.description}
                </p>
                <div className="w-full flex justify-center">
                  <Link
                    to={slide.link}
                    className="bg-white text-[#1d2939] font-bold px-8 py-2.5 rounded-full hover:bg-[#941007] hover:text-white transition-colors duration-300 shadow-md hover:shadow-lg tracking-wide uppercase text-sm"
                  >
                    {slide.buttonText}
                  </Link>
                </div>
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
      <div className="hidden md:block relative w-full h-[600px] overflow-hidden bg-gradient-to-br from-[#941007] via-[#941007] to-[#8B0000]">
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
              <div className="w-1/2 flex flex-col justify-center px-24 text-black bg-white relative overflow-hidden">
                {/* Red Gradient Accents in Corners */}
                <div 
                  className="absolute top-[-15%] left-[-15%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none" 
                  style={{ background: "radial-gradient(circle, #941007 0%, transparent 70%)", opacity: 0.12 }}
                />
                <div 
                  className="absolute bottom-[-15%] right-[-15%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none" 
                  style={{ background: "radial-gradient(circle, #8B0000 0%, transparent 70%)", opacity: 0.08 }}
                />

                <div className="relative z-10">
                  {/* Subtle Accent Mark */}
                  <div className="w-12 h-1 bg-[#941007] mb-8" />

                  <h2 className="text-6xl font-semibold mb-8 tracking-tighter leading-[0.9] text-black uppercase">
                    {slide.title}
                  </h2>
                  <p className="text-2xl text-gray-500 font-light mb-12 leading-relaxed max-w-lg">
                    {slide.description}
                  </p>

                  {/* High-End Action Button */}
                  <div className="flex justify-start">
                    <Link
                      to={slide.link}
                      className="group flex items-center gap-6"
                    >
                      <span className="text-sm font-bold tracking-[3px] uppercase text-black group-hover:text-[#941007] transition-colors duration-300">
                        {slide.buttonText}
                      </span>
                      <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center transition-all duration-300 group-hover:bg-[#941007] group-hover:border-[#941007] group-hover:text-white group-hover:shadow-[0_10px_20px_rgba(148,16,7,0.2)]">
                        <FaChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </div>
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
