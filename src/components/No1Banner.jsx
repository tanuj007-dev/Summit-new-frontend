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
            <div className="mt-2 text-white/90 text-base sm:text-xl font-bold leading-snug">
              Healthy Cookware brand making premium quality,
              <br className="hidden sm:block" />
              toxin-free cookware accessible to all Indians.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default No1Banner;
