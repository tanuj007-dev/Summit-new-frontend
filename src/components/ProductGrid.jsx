import axiosInstance from '../axiosConfig';
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { toast } from 'react-toastify';
import axios from 'axios';

const CategoryPage = ({addToCart,buyNowHandle,isLoggedIn,wishlist,handlewishlist}) => {
  const [products, setProducts] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [wishlistItems, setWishlist] = useState([]);

  const [filterOptions, setFilterOptions] = useState({
    lid_type: [],
    material: [],
    size: [],
    shape: [],
    bottom_type: [],
  });

  const [selectedFilters, setSelectedFilters] = useState({
    lid_type: [],
    material: [],
    size: [],
    shape: [],
    bottom_type: [],
  });

  const [sortBy, setSortBy] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(null);

  // Support deep routes
  const { main, subcat, series, seriesOption, productSize } = useParams();

  const getProduct = async () => {
    try {
      // Use the new API endpoint with search parameter based on category
      let searchQuery = '';
      
      // Build search query based on route params
      if (main) {
        searchQuery = main;
      } else if (subcat) {
        searchQuery = subcat;
      } else if (series) {
        searchQuery = series;
      } else if (seriesOption) {
        searchQuery = seriesOption;
      } else if (productSize) {
        searchQuery = productSize;
      }
      
      console.log('Fetching products with search query:', searchQuery);
      
      // Create a custom axios instance for the new API endpoint
      const newApiInstance = axios.create({
        baseURL: 'http://127.0.0.1:8000',
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        timeout: 10000,
      });
      
      // Use the new API endpoint
      const res = await newApiInstance.get(`/api/products/view?search=${searchQuery}`);
      console.log('API Response:', res.data);
      const productsData = res.data;

      setProducts(productsData);

      const uniqueValues = (arr, key) => [...new Set(arr.map(p => p[key]).filter(Boolean))];
      setFilterOptions({
        lid_type: uniqueValues(productsData, 'lid_type'),
        material: uniqueValues(productsData, 'material'),
        size: uniqueValues(productsData, 'size'),
        shape: uniqueValues(productsData, 'shape'),
        bottom_type: uniqueValues(productsData, 'bottom_type'),
      });

      // Only fetch categories if we have a main category
      if (main) {
        const response = await axiosInstance.get(`getCategory.php?main=${main}`);
        setSubCategory(response.data);
      }
    } catch (e) {
      console.error("Error fetching products:", e);
    }
  };

  useEffect(() => {
    getProduct();
    axiosInstance.get("/wishlistupload.php?action=get")
      .then((res) => {
        if (Array.isArray(res.data)) {
          const productIds = res.data.map((item) => parseInt(item.product_id));
          setWishlist(productIds);
        }
      })
      .catch((err) => console.error("Failed to load wishlist:", err));
  }, [main, subcat, series, seriesOption, productSize]);

  const filteredProducts = products?.filter(product => {
    return (
      (selectedFilters.lid_type.length === 0 || selectedFilters.lid_type.includes(product.lid_type)) &&
      (selectedFilters.material.length === 0 || selectedFilters.material.includes(product.material)) &&
      (selectedFilters.size.length === 0 || selectedFilters.size.includes(product.size)) &&
      (selectedFilters.shape.length === 0 || selectedFilters.shape.includes(product.shape)) &&
      (selectedFilters.bottom_type.length === 0 || selectedFilters.bottom_type.includes(product.bottom_type)) &&
      (!subcat || product.sub_category_id === subcat) &&
      (!series || product.series_id === series) &&
      (!seriesOption || product.series_option_id === seriesOption) &&
      (!productSize || product.size?.toLowerCase() === productSize.toLowerCase())
    );
  }).sort((a, b) => {
    if (sortBy === "price-low-high") return a.price - b.price;
    if (sortBy === "price-high-low") return b.price - a.price;
    return 0;
  });

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => {
      const currentValues = prev[filterType];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [filterType]: currentValues.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          [filterType]: [...currentValues, value]
        };
      }
    });
  };

  const applyFilters = () => {
    setShowFilterDropdown(null);
  };

  const resetFilters = () => {
    setSelectedFilters({
      lid_type: [],
      material: [],
      size: [],
      shape: [],
      bottom_type: [],
    });
    setSortBy("");
    setShowFilterDropdown(null);
  };

  const getFilterDisplayText = (filterType) => {
    const values = selectedFilters[filterType];
    if (values.length === 0) return "All";
    if (values.length === 1) return values[0];
    return `${values.length} Selected`;
  };

  const handleAddToCart = (item) => {
    addToCart(
      {
        id: item.id,
        product_name: item.name,
        product_price: item.price,
      },
      1
    );
    toast.success("Added to cart");
  };

  return (
    <div className="px-4 bg-white md:px-10">
      <h2 className="text-center text-xl font-semibold my-6">Shop By Category</h2>

      {/* Category Icons */}
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {subcategory.map((cat) => (
          <div key={cat.id} className="text-center">
            <img 
              src={cat.name.trim() ? `/asset/images/categories/${cat.name.trim()}.jpg` : '/asset/images/dummy-image-square.jpg'} 
              alt={cat.name} 
              className="w-20 h-20 object-contain mx-auto"
              onError={(e) => {
                e.target.src = 'components/assets/Pressure-Cooker/Aluminium.jpg';
              }}
            />
            <p className="text-sm mt-2 font-medium">{cat.name}</p>
          </div>
        ))}
      </div>

      {/* Results */}
    

      {/* Filters */}
      <div className="border-b pb-4 mb-6">
        <div className="flex flex-wrap items-center justify-center gap-10 text-sm">
          {/* Sort By */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(showFilterDropdown === 'sort' ? null : 'sort')}
              className="flex items-center gap-2 px-4 py-2 border rounded-full bg-[#E9E9EB] hover:bg-gray-50"
            >
              <span className="text-gray-600">Sort by:</span>
              <span className="font-medium">
                {sortBy === "price-low-high" ? "Price: Low to High" : 
                 sortBy === "price-high-low" ? "Price: High to Low" : "Featured"}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showFilterDropdown === 'sort' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => { setSortBy(""); setShowFilterDropdown(null); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Featured
                  </button>
                  <button
                    onClick={() => { setSortBy("price-low-high"); setShowFilterDropdown(null); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => { setSortBy("price-high-low"); setShowFilterDropdown(null); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Price: High to Low
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Type Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(showFilterDropdown === 'lid_type' ? null : 'lid_type')}
              className="flex items-center gap-2 px-4 py-2 border rounded-full bg-[#E9E9EB] hover:bg-gray-50"
            >
              <span className="text-gray-600">Type:</span>
              <span className="font-medium">{getFilterDisplayText('lid_type')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showFilterDropdown === 'lid_type' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                <div className="py-1 max-h-60 overflow-y-auto">
                  {filterOptions.lid_type?.map((val) => (
                    <label key={val} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.lid_type.includes(val)}
                        onChange={() => handleFilterChange('lid_type', val)}
                        className="mr-3"
                      />
                      {val}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Material Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(showFilterDropdown === 'material' ? null : 'material')}
              className="flex items-center gap-2 px-4 py-2 border rounded-full bg-[#E9E9EB] hover:bg-gray-50"
            >
              <span className="text-gray-600">Material:</span>
              <span className="font-medium">{getFilterDisplayText('material')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showFilterDropdown === 'material' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                <div className="py-1 max-h-60 overflow-y-auto">
                  {filterOptions.material?.map((val) => (
                    <label key={val} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.material.includes(val)}
                        onChange={() => handleFilterChange('material', val)}
                        className="mr-3"
                      />
                      {val}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Size Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(showFilterDropdown === 'size' ? null : 'size')}
              className="flex items-center gap-2 px-4 py-2 border rounded-full bg-[#E9E9EB] hover:bg-gray-50"
            >
              <span className="text-gray-600">Size:</span>
              <span className="font-medium">{getFilterDisplayText('size')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showFilterDropdown === 'size' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                <div className="py-1 max-h-60 overflow-y-auto">
                  {filterOptions.size?.map((val) => (
                    <label key={val} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.size.includes(val)}
                        onChange={() => handleFilterChange('size', val)}
                        className="mr-3"
                      />
                      {val}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Shape Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(showFilterDropdown === 'shape' ? null : 'shape')}
              className="flex items-center gap-2 px-4 py-2 border bg-[#E9E9EB] rounded-full hover:bg-gray-50"
            >
              <span className="text-gray-600">Shape:</span>
              <span className="font-medium">{getFilterDisplayText('shape')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showFilterDropdown === 'shape' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                <div className="py-1 max-h-60 overflow-y-auto">
                  {filterOptions.shape?.map((val) => (
                    <label key={val} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.shape.includes(val)}
                        onChange={() => handleFilterChange('shape', val)}
                        className="mr-3"
                      />
                      {val}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(showFilterDropdown === 'bottom_type' ? null : 'bottom_type')}
              className="flex items-center gap-2 px-4 py-2 border bg-[#E9E9EB] rounded-full hover:bg-gray-50"
            >
              <span className="text-gray-600">Bottom:</span>
              <span className="font-medium">{getFilterDisplayText('bottom_type')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showFilterDropdown === 'bottom_type' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                <div className="py-1 max-h-60 overflow-y-auto">
                  {filterOptions.bottom_type?.map((val) => (
                    <label key={val} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.bottom_type.includes(val)}
                        onChange={() => handleFilterChange('bottom_type', val)}
                        className="mr-3"
                      />
                      {val}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="bg-[#B91508] text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Apply
            </button>
            <button
              onClick={resetFilters}
              className="border border-gray-300 px-6 py-2 rounded-full hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
            <div className="flex justify-between items-center  ">
        <p className="text-sm text-gray-600">
          {filteredProducts.length} results found
        </p>
      </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="w-full px-4 md:px-10 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {filteredProducts.map((product, i) => (
          <div
            className="relative bg-white rounded-md shadow-md p-4 flex flex-col items-center"
            key={i}
          >
            <div className="absolute top-3 right-3 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={wishlistItems?.includes(parseInt(product.id)) ? solidHeart : regularHeart}
              style={{
                color: wishlistItems?.includes(parseInt(product.id)) ? "#E03B2D" : "gray",
                cursor: "pointer",
                fontSize: "16px",
              }}
              onClick={() => handlewishlist(product.id)}
            />
            </div>

            <Link to={`/879/DetailProduct/${product.id}`}>
              <img
                src={
                  product.images?.[0]?.url
                    ? `https://api.summithomeappliance.com/php_admin_panel/${product.images[0].url}`
                    : '/asset/images/dummy-image-square.jpg'
                }
                alt={product.name}
                className="size-60 object-contain rounded-lg mx-auto"
              />
            </Link>

            <h2 className="text-md font-semibold  mt-3 text-center w-full">
              {product.name}
            </h2>
            <p className="text-sm font-semibold mt-1 text-start">
              <span className="text-sm font-normal text-[#AAAAAA]">From </span>
              Rs. {Math.floor(product.price)}
            </p>    
            <div className="flex justify-around items-center w-full mt-3">
              <button onClick={()=>handleAddToCart(product)} className="text-sm rounded-full px-3 py-1 text-white bg-[#B91508] cursor-pointer">
                Add to cart 
              </button>
              <button onClick={()=>buyNowHandle(product)} className="text-sm text-[#B91508] font-semibold">
                Buy Now
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
