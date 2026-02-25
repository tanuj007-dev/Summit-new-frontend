import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";

const categories = [
  { title: "Cookware", image: "/asset/images/cookware.jpg", count: "12+ Items" },
  { title: "Gas Stove", image: "/asset/images/gasstove.jpg", count: "8+ Models" },
  { title: "Electric Rice Cooker", image: "/asset/images/ricecooker.jpg", count: "5+ Variants" },
  { title: "Steam Cookware", image: "/asset/images/steamcookware.jpg", count: "Premium Selection" },
  { title: "Gas Tandoor", image: "/asset/images/gastandoor.jpg", count: "Best Seller" },
  { title: "Pressure Cooker", image: "/asset/images/pressurecooker.jpg", count: "Multiple Sizes" },
  { title: "Mixer Grinder", image: "/asset/images/mixergrinder.jpg", count: "High Performance" },
];

export default function KitchenCategories() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryTitle) => {
    const formattedCategory = categoryTitle.toLowerCase().replace(/\s+/g, '-');
    navigate(`/products/${formattedCategory}`);
  };

  return (
    <section className="w-full relative py-20 md:py-24 px-4 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#B91508]/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-80 h-80 bg-[#B91508]/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-14 md:mb-16">
          <span className="inline-block text-[#B91508] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Explore by category
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight max-w-2xl mx-auto">
            Curated Kitchen Essentials
          </h2>
          <p className="text-gray-500 text-lg md:text-xl mt-4 font-medium max-w-xl mx-auto">
            Elevate your cooking with our premium selection
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="w-12 h-0.5 bg-[#B91508] rounded-full" />
            <div className="w-20 h-1 bg-[#B91508] rounded-full" />
            <div className="w-12 h-0.5 bg-[#B91508] rounded-full" />
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-3 gap-5 auto-rows-[320px]">
          <div
            onClick={() => handleCategoryClick(categories[0].title)}
            className="row-span-1 cursor-pointer group rounded-3xl overflow-hidden relative bg-gray-100 ring-1 ring-black/5 shadow-lg hover:shadow-2xl hover:ring-[#B91508]/30 hover:scale-[1.02] active:scale-[0.99] transition-all duration-500 ease-out"
          >
            <CategoryCardContent item={categories[0]} />
          </div>
          <div
            onClick={() => handleCategoryClick(categories[1].title)}
            className="col-span-2 row-span-1 cursor-pointer group rounded-3xl overflow-hidden relative bg-gray-100 ring-1 ring-black/5 shadow-lg hover:shadow-2xl hover:ring-[#B91508]/30 hover:scale-[1.02] active:scale-[0.99] transition-all duration-500 ease-out"
          >
            <CategoryCardContent item={categories[1]} />
          </div>
          {categories.slice(2, 5).map((item, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(item.title)}
              className="cursor-pointer group rounded-3xl overflow-hidden relative bg-gray-100 ring-1 ring-black/5 shadow-lg hover:shadow-2xl hover:ring-[#B91508]/30 hover:scale-[1.02] active:scale-[0.99] transition-all duration-500 ease-out"
            >
              <CategoryCardContent item={item} />
            </div>
          ))}
          <div
            onClick={() => handleCategoryClick(categories[5].title)}
            className="col-span-2 row-span-1 cursor-pointer group rounded-3xl overflow-hidden relative bg-gray-100 ring-1 ring-black/5 shadow-lg hover:shadow-2xl hover:ring-[#B91508]/30 hover:scale-[1.02] active:scale-[0.99] transition-all duration-500 ease-out"
          >
            <CategoryCardContent item={categories[5]} />
          </div>
          <div
            onClick={() => handleCategoryClick(categories[6].title)}
            className="row-span-1 cursor-pointer group rounded-3xl overflow-hidden relative bg-gray-100 ring-1 ring-black/5 shadow-lg hover:shadow-2xl hover:ring-[#B91508]/30 hover:scale-[1.02] active:scale-[0.99] transition-all duration-500 ease-out"
          >
            <CategoryCardContent item={categories[6]} />
          </div>
        </div>

        {/* Mobile Grid Layout */}
        <div className="grid md:hidden grid-cols-2 gap-4">
          {categories.map((item, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(item.title)}
              className={`cursor-pointer group rounded-2xl overflow-hidden relative ring-1 ring-black/5 shadow-md hover:shadow-xl hover:ring-[#B91508]/20 active:scale-[0.98] transition-all duration-300 h-52 ${index === categories.length - 1 ? 'col-span-2' : ''}`}
            >
              <CategoryCardContent item={item} mobile />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCardContent({ item, mobile = false }) {
  return (
    <>
      <div className="absolute inset-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>
      {/* Premium overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/85 transition-colors duration-500" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(185,21,8,0.08)_0%,transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 text-left">
        <p className="text-white/80 text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em] mb-1.5 opacity-90 group-hover:text-white transition-colors duration-300">
          {item.count}
        </p>
        <h3 className={`text-white font-bold tracking-tight leading-tight drop-shadow-sm ${mobile ? 'text-base' : 'text-xl md:text-2xl lg:text-3xl'}`}>
          {item.title}
        </h3>
        <div className="flex items-center gap-2 mt-3 text-white/90 text-sm font-semibold group-hover:gap-3 transition-all duration-300">
          <span>Shop Now</span>
          <FaArrowRight className="text-[#B91508] w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>

      {/* Top-edge highlight on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </>
  );
}
