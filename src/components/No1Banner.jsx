import React from "react";

const No1Banner = () => {
  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#B91508] px-6 py-6 sm:px-10 sm:py-7 shadow-sm">
          <div className="text-center">
            <div className="text-white text-2xl sm:text-3xl font-semibold leading-tight">
              India's{" "}
              <span className="inline-flex items-center justify-center rounded-md bg-white px-4 py-1 text-[#0B3D36]">
                No.1
              </span>
            </div>
            <div className="mt-2 text-white/90 text-base sm:text-[15px] font-bold leading-snug">
              From a student’s quick snack to a grand family feast, our range makes healthy cooking easy for everyone. Whisk a treat in the Mixer Grinder, prepare a light bite in the Steam Cookware, or host a party with the Gas Tandoor. Whether it’s a nutritious tiffin from the Pressure Cooker or a favorite recipe in our premium Cookware, we bring simple, high-quality joy to every Indian kitchen and every generation.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default No1Banner;
