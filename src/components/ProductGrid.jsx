import axiosInstance from '../axiosConfig';
import { Link, useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { toast } from 'react-toastify';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import CategoryMegaMenu from './header/CategoryMegaMenu';
import LazyImage from './LazyImage';

const CategoryPage = ({isLoggedIn,wishlist,handlewishlist}) => {
  const [products, setProducts] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [wishlistItems, setWishlist] = useState([]);
  const location = useLocation();

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

  // Get cart context
  const { handleAddToCart, handleBuyNow } = useContext(CartContext);

  // Support deep routes
  const { main, subcat, series, seriesOption, productSize } = useParams();

  // Helper function to get product image from S3 presigned URL
  const getProductImage = (product) => {
    // Try different possible image field structures
    if (product?.image) {
      return product.image; // Direct S3 presigned URL
    }
    if (product?.images?.length > 0) {
      // If images is an array of objects with url
      if (product.images[0]?.url) {
        return product.images[0].url;
      }
      // If images is an array of strings
      if (typeof product.images[0] === 'string') {
        return product.images[0];
      }
    }
    // Try variant images
    if (product?.variants?.length > 0) {
      const variant = product.variants[0];
      if (variant?.image) {
        return variant.image;
      }
      if (variant?.images?.length > 0) {
        if (variant.images[0]?.url) {
          return variant.images[0].url;
        }
        if (typeof variant.images[0] === 'string') {
          return variant.images[0];
        }
      }
    }
    return '/asset/images/dummy-image-square.jpg';
  };

  // Helper function to get product price
  const getProductPrice = (product) => {
    // Try different possible price field structures
    if (product?.variants?.length > 0 && product.variants[0]?.price) {
      return Math.floor(product.variants[0].price);
    }
    if (product?.price) {
      return Math.floor(product.price);
    }
    if (product?.mrp) {
      return Math.floor(parseFloat(product.mrp));
    }
    if (product?.selling_price) {
      return Math.floor(product.selling_price);
    }
    // Try to get from detail_id or other fields
    if (product?.detail_price) {
      return Math.floor(parseFloat(product.detail_price));
    }
    return null;
  };

  // Helper function to map route params to API search terms
  const mapRouteToSearch = (param) => {
    if (!param) return '';
    // Convert route format to search format
    // e.g., "Pressure-Cooker" -> "pressure cooker", "inner-lid" -> "inner lid"
    return param.replace(/-/g, ' ').toLowerCase();
  };

  // Helper function to map route params to API filter values
  const mapRouteToFilter = (param) => {
    if (!param) return '';
    // Convert route format to filter format
    // e.g., "inner-lid" -> "Inner Lid", "stainless-steel" -> "Stainless Steel"
    return param.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getProduct = async () => {
    try {
      // Check if we have search results from footer navigation
      if (location.state?.searchResults) {
        setProducts(location.state.searchResults);
        
        // Set filter options from the search results
        const productsData = location.state.searchResults;
        const uniqueValues = (arr, key) => [...new Set(arr.map(p => p[key]).filter(Boolean))];
        setFilterOptions({
          lid_type: uniqueValues(productsData, 'lid_type'),
          material: uniqueValues(productsData, 'material') || uniqueValues(productsData, 'material_name'),
          size: uniqueValues(productsData, 'size') || uniqueValues(productsData, 'net_quantity'),
          shape: uniqueValues(productsData, 'shape'),
          bottom_type: uniqueValues(productsData, 'bottom_type'),
        });
        return;
      }

      // Build API parameters based on route params
      const params = {
        search: main ? mapRouteToSearch(main) : 'all',
        sort: 'mrp',
        order: 'asc',
        per_page: 24,
        page: 1,
      };

      // Map route parameters to API filter parameters
      if (subcat) {
        // Map subcategory (e.g., "inner-lid" -> "Inner Lid")
        const subcatName = mapRouteToFilter(subcat);
        params.subcat_name = subcatName;
      }

      if (series) {
        // Series might map to material_name
        const seriesName = mapRouteToFilter(series);
        params.material_name = seriesName;
      }

      if (seriesOption) {
        // Series option might be part of the search or material
        const optionName = mapRouteToFilter(seriesOption);
        // You might want to append this to search or handle differently
        params.search = params.search ? `${params.search} ${optionName}` : optionName;
      }

      if (productSize) {
        // Product size maps to net_quantity
        params.net_quantity = productSize;
      }

      console.log('Fetching products with params:', params);
      
      // Use the existing axiosInstance which already has withCredentials: true for session cookies
      const res = await axiosInstance.get('/api/products/view', { params });
      console.log('API Response:', res.data);
      
      // Handle different response structures
      let productsData = [];
      if (Array.isArray(res.data)) {
        productsData = res.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        productsData = res.data.data;
      } else if (res.data?.products && Array.isArray(res.data.products)) {
        productsData = res.data.products;
      }

      console.log('Products Data:', productsData);
      if (productsData.length > 0) {
        console.log('First Product Sample:', productsData[0]);
        console.log('First Product Price Fields:', {
          price: productsData[0].price,
          mrp: productsData[0].mrp,
          selling_price: productsData[0].selling_price,
          variants: productsData[0].variants,
          detail_price: productsData[0].detail_price
        });
      }

      setProducts(productsData);

      const uniqueValues = (arr, key) => [...new Set(arr.map(p => p[key]).filter(Boolean))];
      setFilterOptions({
        lid_type: uniqueValues(productsData, 'lid_type'),
        material: uniqueValues(productsData, 'material') || uniqueValues(productsData, 'material_name'),
        size: uniqueValues(productsData, 'size') || uniqueValues(productsData, 'net_quantity'),
        shape: uniqueValues(productsData, 'shape'),
        bottom_type: uniqueValues(productsData, 'bottom_type'),
      });

      // Only fetch categories if we have a main category
      if (main) {
        try {
          const response = await axiosInstance.get(`getCategory.php?main=${main}`);
          setSubCategory(response.data);
        } catch (e) {
          console.error("Error fetching subcategories:", e);
          setSubCategory([]);
        }
      }
    } catch (e) {
      console.error("Error fetching products:", e);
      setProducts([]);
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
    // Get product properties with fallbacks for different API response structures
    const lidType = product.lid_type || product.subcat_name;
    const material = product.material || product.material_name;
    const size = product.size || product.net_quantity;
    const shape = product.shape;
    const bottomType = product.bottom_type;
    const productPrice = product.price || product.variants?.[0]?.price || product.mrp || 0;
    
    return (
      (selectedFilters.lid_type.length === 0 || selectedFilters.lid_type.includes(lidType)) &&
      (selectedFilters.material.length === 0 || selectedFilters.material.includes(material)) &&
      (selectedFilters.size.length === 0 || selectedFilters.size.includes(size)) &&
      (selectedFilters.shape.length === 0 || selectedFilters.shape.includes(shape)) &&
      (selectedFilters.bottom_type.length === 0 || selectedFilters.bottom_type.includes(bottomType))
    );
  }).sort((a, b) => {
    const priceA = a.price || a.variants?.[0]?.price || a.mrp || 0;
    const priceB = b.price || b.variants?.[0]?.price || b.mrp || 0;
    if (sortBy === "price-low-high") return priceA - priceB;
    if (sortBy === "price-high-low") return priceB - priceA;
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

  const handleAddToCartClick = (product) => {
    // Get the correct variant ID for cart operations
    const variantId = product.variant_id || 
                      product.product_variant_id || 
                      (product.variants?.length > 0 ? product.variants[0].id : null) ||
                      product.id || 
                      product.product_id || 
                      product.detail_id;
    
    console.log("Adding to cart - Product:", product);
    console.log("Extracted Variant ID:", variantId);
    
    if (!variantId) {
      toast.error("Product variant ID not found. Please check product details.");
      console.error("Product data for debugging:", {
        id: product.id,
        product_id: product.product_id,
        product_variant_id: product.product_variant_id,
        variant_id: product.variant_id,
        detail_id: product.detail_id,
        variants: product.variants,
        fullProduct: product
      });
      return;
    }

    // Use CartContext's handleAddToCart which expects product_variant_id
    try {
      handleAddToCart(variantId);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart");
    }
  };

  return (
    <div className="px-4 bg-white md:px-10">
      {/* Add MegaMenu at the top */}
      <CategoryMegaMenu />
      
      <h2 className="text-center text-xl font-semibold my-6">Shop By Category</h2>

      {/* Category Icons */}
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {subcategory.map((cat) => {
          const categoryImages = {
            "Hard Anodised": "/asset/images/categories/Hard Anodised.jpg",
            "Steel": "/asset/images/categories/Steel.jpg",
            "Aluminium": "/asset/images/categories/Aluminium.jpg",
            "Triply": "/asset/images/categories/Triply.jpg",
            "Inner Lid": "/asset/images/categories/Inner Lid.jpg",
            "Outer Lid": "/asset/images/categories/Outer Lid.jpg",
            "Clip On/Flip On": "/asset/images/categories/Clip On-Flip On.jpg",
          };
          const imageUrl = categoryImages[cat.name] || '/asset/images/dummy-image-square.jpg';

          return (
            <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center hover:shadow-md transition-shadow">
              <LazyImage 
                src={imageUrl}
                alt={cat.name} 
                className="w-16 h-16 object-contain mb-3"
              />
              <p className="text-sm font-medium text-gray-700">{cat.name}</p>
            </div>
          );
        })}
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {filteredProducts.map((product, i) => (
          <div
            className="relative bg-white rounded-md shadow-md p-4 flex flex-col items-center"
            key={i}
          >
            <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center z-10 shadow-md hover:shadow-lg transition-shadow">
            <FontAwesomeIcon
              icon={wishlistItems?.includes(parseInt(product.id || product.product_id || product.product_variant_id || product.detail_id)) ? solidHeart : regularHeart}
              style={{
                color: wishlistItems?.includes(parseInt(product.id || product.product_id || product.product_variant_id || product.detail_id)) ? "#E03B2D" : "#666",
                cursor: "pointer",
                fontSize: "16px",
              }}
              onClick={() => handlewishlist && handlewishlist(product.id || product.product_id || product.product_variant_id || product.detail_id)}
              className="hover:scale-110 transition-transform"
            />
            </div>

            <Link to={`/product/${product.id || product.product_id || product.product_variant_id || product.detail_id}`}>
              <LazyImage
                src={getProductImage(product)}
                alt={product.name || product.product_name || 'Product'}
                className="size-60 object-contain rounded-lg mx-auto"
                onError={(e) => {
                  e.target.src = '/asset/images/dummy-image-square.jpg';
                }}
              />
            </Link>

            <Link to={`/product/${product.id || product.product_id || product.product_variant_id || product.detail_id}`}>
              <h2 className="text-md font-semibold mt-3 text-center w-full hover:text-red-600 transition-colors cursor-pointer">
                {product.name || product.product_name || 'Product'}
              </h2>
            </Link>
            <p className="text-sm font-semibold mt-1 text-start">
              <span className="text-sm font-normal text-[#AAAAAA]">From </span>
              {getProductPrice(product) ? (
                <>Rs. {getProductPrice(product)}</>
              ) : (
                <span className="text-gray-500">Price not available</span>
              )}
            </p>    
            <div className="flex justify-around items-center w-full mt-3">
              <button 
                onClick={() => handleAddToCartClick(product)} 
                className="text-sm rounded-full px-3 py-1 text-white bg-[#B91508] cursor-pointer hover:bg-red-700 transition"
              >
                Add to cart 
              </button>
              <button 
                onClick={() => {
                  const variantId = product.variant_id || 
                                   product.product_variant_id || 
                                   (product.variants?.length > 0 ? product.variants[0].id : null) ||
                                   product.id || 
                                   product.product_id || 
                                   product.detail_id;
                  if (variantId) {
                    handleBuyNow(variantId);
                  } else {
                    toast.error("Product variant ID not found");
                  }
                }} 
                className="text-sm text-[#B91508] border-2 border-[#B91508] rounded-full px-3 py-1 font-semibold hover:text-red-700 transition"
              >
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
