import React from "react";

const categories = [
  { title: "Cookware", image: "/asset/images/cookware.jpg" },
  { title: "Gas Stove", image: "/asset/images/gasstove.jpg" },
  { title: "Electric Rice Cooker", image: "/asset/images/ricecooker.jpg" },
  { title: "Steam Cookware", image: "/asset/images/steamcookware.jpg" },
  { title: "Gas Tandoor", image: "/asset/images/gastandoor.jpg" },
  { title: "Pressure Cooker", image: "/asset/images/pressurecooker.jpg" },
  { title: "Mixer Grinder", image: "/asset/images/mixergrinder.jpg" },
];

export default function KitchenCategories() {
  return (
    <>
      {/* ================= DESKTOP VIEW ================= */}
      <section className="hidden md:block w-full bg-[#F5F5F7] py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-black">
            Curated Kitchen Essentials
          </h2>
          <p className="text-gray-500 text-[1.2rem] mt-1">
            Only the Best
          </p>
        </div>

        <div className="w-[95%] mx-auto grid grid-cols-3 gap-8 px-8">
          <CategoryCard {...categories[0]} height="h-64" />
          <div className="col-span-2">
            <CategoryCard {...categories[1]} height="h-64" />
          </div>

          {categories.slice(2, 5).map((item, index) => (
            <CategoryCard key={index} {...item} height="h-60" />
          ))}

          <div className="col-span-2">
            <CategoryCard {...categories[5]} height="h-64" />
          </div>

          <CategoryCard {...categories[6]} height="h-64" />
        </div>
      </section>

      {/* ================= MOBILE VIEW ================= */}
      <section className="block md:hidden bg-[#F5F5F7] py-6">
        <div className="text-center mb-6 px-4">
          <h2 className="text-lg font-semibold text-black">
            Curated Kitchen Essentials
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Only the Best
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 px-4">
          {categories.map((item, index) => (
            <div
              key={index}
              className={`relative rounded-xl overflow-hidden bg-white
                shadow-[0_8px_20px_rgba(0,0,0,0.12)]
                transition-all duration-300
                ${
                  index === categories.length - 1
                    ? "col-span-2"
                    : ""
                }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-36 object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              <h3 className="absolute bottom-2 left-2 text-white text-sm font-semibold">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function CategoryCard({ image, title, height }) {
  return (
    <div
      className="
        relative rounded-2xl overflow-hidden bg-white cursor-pointer
        shadow-[0_10px_25px_rgba(0,0,0,0.14)]
        transition-all duration-300
        hover:shadow-[0_18px_40px_rgba(0,0,0,0.2)]
        hover:-translate-y-1
        group
      "
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`w-full ${height} object-cover transform group-hover:scale-110 transition-transform duration-700`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>

      <h3 className="absolute bottom-3 left-4 text-white text-lg font-semibold drop-shadow-md">
        {title}
      </h3>
    </div>
  );
}
