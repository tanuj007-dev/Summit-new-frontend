import React from 'react';

const ExploreMoreCategories = () => {
  const categories = [
    {
      name: 'Pressure Cooker',
      image: '/asset/images/PressureCooker.png'
    },
    {
      name: 'Cookware',
      image: '/asset/images/Cookware.png'
    },
    {
      name: 'Gas Stove',
      image: '/asset/images/GasStove.png'
    },
    {
      name: 'Mixer Grinder',
      image: '/asset/images/MixerGrinder.png'
    },
    {
      name: 'Gas Tandoor',
      image: '/asset/images/GasTandoor.png'
    }
  ];

  return (
    <div className="w-full px-4 py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
        Explore More Categories
      </h2>
      
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-8xl mx-auto">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer group transition-transform duration-300 hover:scale-105"
          >
            <div className="relative w-24 h-24 md:w-60 md:h-60 mb-3 md:mb-4">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
              <div className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm">
                <img
                  src="/asset/images/LogoS.png"
                  alt="Summit"
                  className="w-4 h-4 md:w-5 md:h-5"
                />
              </div>
            </div>
            <p className="text-sm md:text-base font-medium text-gray-800 text-center">
              {category.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreMoreCategories;
