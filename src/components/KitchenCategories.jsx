import React from "react";
import { useNavigate } from "react-router-dom";
import MagicBento from './MagicBento';

const categories = [
  { title: "Steam Cookware", image: "/asset/images/Untitled design (28).png", description: "Pure vapor cooking" },
  { title: "Gas Tandoor", image: "/asset/images/Untitled design (22).png", description: " Stovetop Smoky Perfection", imageClassName: "magic-bento-card__bg--zoomed" },
  { title: "Pressure Cooker", image: "/asset/images/9. SI5.5CIHA.jpeg", description: "Pressure-cooked Perfection" },
  { title: "Mixer Grinder", image: "/asset/images/Untitled design (27).png", description: "Versatile blend-and-grind" },
  { title: "Cookware", image: "/asset/images/Untitled design (21).png", description: "Even flame cooking" },

  { title: "Gas Stove", image: "/asset/images/7. S2BGD (1).jpg", description: "Precision flame cooking" },




];

export default function KitchenCategories() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    const formattedCategory = category.title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/products/${formattedCategory}`);
  };

  return (
    <section className="w-full relative py-16 sm:py-20 lg:py-24 px-3 sm:px-4 overflow-hidden bg-white">
      {/* Decorative bg elements to make transparency look better */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#941007]/10 rounded-full blur-[120px]" />
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#941007]/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header (mobile-first — matches Trends.jsx) */}
        <div className="text-center mb-10 sm:mb-14 md:mb-16 px-3 sm:px-4 max-w-5xl mx-auto">
          <span className="inline-block text-[#941007] text-[11px] sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2  opacity-90 px-1">
            Premium Experience
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-black tracking-tight text-balance max-w-[min(100%,40rem)] mx-auto mb-3 sm:mb-0 leading-[1.12] sm:leading-tight px-1">
            Curated Kitchen Essentials
          </h2>
          <p className="text-[#636365] text-[13px] sm:text-base md:text-[18px] font-semibold max-w-md sm:max-w-2xl mx-auto px-2 sm:px-4 mb-2 sm:mb-0 leading-snug">
            Only the Best - Popular categories
          </p>
          <p className="text-gray-400 text-[12px] sm:text-[14px] md:text-[16px] max-w-3xl sm:max-w-4xl mx-auto leading-relaxed px-2 sm:px-4 text-pretty">
            Revolutionizing your cooking space with state-of-the-art kitchenware and appliances.
          </p>
        </div>

        <MagicBento
          cardData={categories}
          textAutoHide={false}
          enableStars
          enableSpotlight
          enableBorderGlow={true}



          spotlightRadius={450}

          glowColor="148, 16, 7"
          particleCount={0}
          disableAnimations={false}
          onCardClick={handleCategoryClick}
        />
      </div>
    </section>
  );
}
