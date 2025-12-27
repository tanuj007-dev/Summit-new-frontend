import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExploreMoreCategories = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [loading, setLoading] = useState(false);

  const minSwipeDistance = 30;

  const categories = [
    {
      name: 'Pressure Cooker',
      image: '/asset/1.png'
    },
    {
      name: 'Cookware',
      image: '/asset/2.png'
    },
    {
      name: 'Gas Stove',
      image: '/asset/3.png'
    },
    {
      name: 'Mixer Grinder',
      image: '/asset/4.png'
    },
    {
      name: 'Gas Tandoor',
      image: '/asset/5.png'
    }
  ];

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2);
      } else if (window.innerWidth < 768) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
        setCurrentIndex(0); // Reset index for desktop
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStartX(0);
    setTouchEndX(0);
  };

  const nextSlide = () => {
    if (categories.length <= itemsPerView) return;
    if (currentIndex < categories.length - itemsPerView) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (categories.length <= itemsPerView) return;
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(Math.max(0, categories.length - itemsPerView));
    }
  };

  const handleCategoryClick = (categoryName) => {
    // Navigate to product grid with category as search parameter
    navigate(`/product-grid?search=${encodeURIComponent(categoryName.toLowerCase())}`);
  };

  const handleCategoryClickWithAPI = async (categoryName) => {
    try {
      setLoading(true);
      
      // Fetch products from API based on category
      const response = await axios.get('https://mediumblue-finch-130496.hostingersite.com/api/products/view', {
        params: {
          search: categoryName.toLowerCase()
        },
        withCredentials: true // Include cookies for session
      });

      console.log('API Response:', response.data);

      // Handle different response structures
      let productsData = [];
      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        productsData = response.data.data;
      } else if (response.data?.products && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      }

      console.log('Products fetched:', productsData.length);

      // Navigate to products page with category name as main parameter and pass products data
      navigate(`/products/${categoryName.toLowerCase()}`, {
        state: {
          searchResults: productsData,
          searchQuery: categoryName
        }
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to regular navigation if API fails
      navigate(`/products/${categoryName.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-8xl px-2 py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
        Explore More Categories
      </h2>
      
      {/* Desktop View - Grid Layout */}
      <div className="hidden md:flex flex-wrap justify-center gap-4 md:gap-8 max-w-8xl mx-auto">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClickWithAPI(category.name)}
            className="flex flex-col items-center cursor-pointer group transition-transform duration-300 hover:scale-105"
          >
            <div className="relative w-24 h-24 md:w-60 md:h-60 mb-3 md:mb-4">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover rounded-lg shadow-md"
                style={{ opacity: loading ? 0.6 : 1 }}
              />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                  <div className="animate-spin">⏳</div>
                </div>
              )}
            </div>
            <p className="text-sm md:text-base font-medium text-gray-800 text-center">
              {category.name}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile View - Carousel */}
      <div className="md:hidden">
        <div
          className="w-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: 'grab' }}
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
            }}
          >
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClickWithAPI(category.name)}
                className={`flex-shrink-0 flex flex-col items-center cursor-pointer ${
                  itemsPerView === 2 ? 'w-1/2' : 'w-1/3'
                } px-2`}
              >
                <div className="relative w-32 h-32 mb-3">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                    style={{ opacity: loading ? 0.6 : 1 }}
                  />
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                      <div className="animate-spin">⏳</div>
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800 text-center">
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 px-8">
          <div className="relative">
            {/* Progress Track */}
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              {/* Progress Fill */}
              <div
                className="h-full bg-gray-400 transition-all duration-200 ease-out rounded-full"
                style={{
                  width: `${Math.min(((currentIndex + itemsPerView) / categories.length) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreMoreCategories;
