import React from "react";

const No1Banner = () => {
  return (
    <section className="bg-white py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-linear-to-r from-[#941007] via-[#8B0000] to-[#500a04] border border-white/10 px-6 py-6 sm:py-8 shadow-xl overflow-hidden group">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rotate-45 translate-x-16 -translate-y-16 group-hover:translate-x-14 group-hover:-translate-y-14 transition-transform duration-700" />
          
          <div className="text-center relative z-10 max-w-4xl mx-auto">
            {/* Minimal Brand Tag */}
            <span className="text-white text-[10px] uppercase tracking-[0.6em] font-bold mb-2 block">Since 1995</span>
            
            <h2 className="text-white text-2xl sm:text-3xl font-black uppercase tracking-tight mb-4 leading-none">
              Everything Your Kitchen Needs
            </h2>
            
            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-medium max-w-7xl mx-auto opacity-90">
               From a quick student snack to a grand family feast, our range makes healthy cooking easy for everyone. Whisk a treat in the Mixer Grinder, steam a light bite in the Steam Cookware, or host a party with the Gas Tandoor and our efficient Gas Stove. Whether it’s a nutritious tiffin from the Pressure Cooker or a favorite recipe in our premium Cookware. We bring simple, high-quality joy to every Indian kitchen and every generation.
            </p>

            {/* Accent Bar */}
            <div className="flex justify-center mt-6">
              <div className="h-0.5 w-10 bg-white/20 rounded-full group-hover:w-16 transition-all duration-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default No1Banner;
