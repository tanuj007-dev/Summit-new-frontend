import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ExploreMoreCategories = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = [
    {
      name: 'Pressure Cooker',
      image: '/asset/images/9. SI5.5CIHA.jpeg'
    },
    {
      name: 'Cookware',
      image: '/asset/images/Untitled design (21).png'
    },
    {
      name: 'Gas Stove',
      image: '/asset/images/7. S2BGD (1).jpg'
    },
    {
      name: 'Mixer Grinder',
      image: '/asset/images/Untitled design (27).png'
    },
    {
      name: 'Gas Tandoor',
      image: '/asset/images/Untitled design (22).png'
    },
    {
      name: 'Steam Cookware',
      image: '/asset/images/Untitled design (28).png'
    }
  ];

  const handleCategoryClickWithAPI = async (categoryName) => {
    try {
      setLoading(true);
      const baseURL = import.meta.env.VITE_APP_API_BASE_URL ?? 'https://api.summithomeappliance.com';

      const response = await axios.get(`${baseURL}/api/search`, {
        params: { search: categoryName.toLowerCase() },
        withCredentials: true
      });

      let productsData = [];
      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        productsData = response.data.data;
      } else if (response.data?.products && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      }

      navigate(`/products/${categoryName.toLowerCase().replace(/\s+/g, '-')}`, {
        state: { searchResults: productsData, searchQuery: categoryName }
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      navigate(`/products/${categoryName.toLowerCase().replace(/\s+/g, '-')}`);
    } finally {
      setLoading(false);
    }
  };


  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    afterChange: (current) => setCurrentSlide(current),
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-10 py-12 md:py-16">
      <h2 className="text-2xl sm:text-4xl text-center md:text-5xl lg:text-5xl font-bold text-black tracking-tight mx-auto mb-3 sm:mb-0 leading-[1.12] sm:leading-tight px-1 font-['Playfair_Display',_serif]">
        Explore More Categories
      </h2>

      <div className="relative group mt-10">
        <Slider {...settings}>
          {categories.map((category, index) => (
            <div key={index} className="px-3">
              <div
                onClick={() => handleCategoryClickWithAPI(category.name)}
                className="flex flex-col items-center cursor-pointer group/item"
              >
                <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-2xl shadow-sm border border-gray-100 group-hover/item:shadow-xl transition-all duration-300">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                    style={{ opacity: loading ? 0.6 : 1 }}
                  />
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <div className="animate-spin text-[#941007]">⏳</div>
                    </div>
                  )}
                </div>
                <p className="text-sm md:text-lg font-bold text-gray-800 text-center uppercase tracking-wide group-hover/item:text-[#941007] transition-colors">
                  {category.name}
                </p>
              </div>
            </div>
          ))}
        </Slider>

        {/* Progress Bar */}
        <div className="mt-12 flex justify-center">
          <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#941007] transition-all duration-500 ease-out"
              style={{
                width: `${((currentSlide + 1) / categories.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreMoreCategories;
