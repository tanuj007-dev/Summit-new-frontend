import axiosInstance from '../axiosConfig';
import { Link, useParams, useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { toast } from 'react-toastify';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import CategoryMegaMenu from './header/CategoryMegaMenu';
import LazyImage from './LazyImage';
import FilterSelect from './FilterSelect';
import { FaTruck, FaUndo, FaWallet } from "react-icons/fa";

const CategoryPage = ({ isLoggedIn, wishlist, handlewishlist }) => {
  const [products, setProducts] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [wishlistItems, setWishlist] = useState([]);
  const location = useLocation();
  const [searchParams] = useSearchParams();

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
    priceRange: [0, 10000],
  });
  const [maxPrice, setMaxPrice] = useState(10000);

  const [sortBy, setSortBy] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState('type'); // Product Type always open

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
    return '/asset/images/dummy-image-square.webp';
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
  const toSentenceCase = (text = "") => {
    return text
      .toLowerCase()
      .replace(/^\w/, (char) => char.toUpperCase());
  };

  const getProduct = async () => {
    try {
      // Check if we have search results from footer navigation
      if (location.state?.searchResults) {
        setProducts(location.state.searchResults);

        // Set filter options from the search results
        const productsData = location.state.searchResults;
        const uniqueValues = (arr, keys) => {
          const allValues = arr
            .flatMap(p => (Array.isArray(keys) ? keys.map(k => p[k]) : p[keys]))
            .filter(Boolean)
            .map(v => String(v).trim())
            .filter(v => v.length > 0);
          return [...new Set(allValues)].sort();
        };
        setFilterOptions({
          lid_type: uniqueValues(productsData, ['lid_type', 'subcat_name', 'type']),
          material: uniqueValues(productsData, ['material', 'material_name', 'series']),
          size: uniqueValues(productsData, ['size', 'net_quantity', 'capacity']),
          shape: uniqueValues(productsData, ['shape', 'product_shape', 'form']),
          bottom_type: uniqueValues(productsData, ['bottom_type', 'bottom', 'base_type']),
        });
        console.log('Search results filters set');
        return;
      }

      // Build API parameters based on route params and optional ?search= from footer links
      const searchQuery = searchParams.get('search');
      const params = {
        search: searchQuery && searchQuery.trim() ? searchQuery.trim() : (main ? mapRouteToSearch(main) : 'all'),
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

      // Extract unique values from products with fallback fields
      const uniqueValues = (arr, keys) => {
        const allValues = arr
          .flatMap(p => (Array.isArray(keys) ? keys.map(k => p[k]) : p[keys]))
          .filter(Boolean)
          .map(v => String(v).trim())
          .filter(v => v.length > 0);
        return [...new Set(allValues)].sort();
      };

      const filterOpts = {
        lid_type: uniqueValues(productsData, ['lid_type', 'subcat_name', 'type']),
        material: uniqueValues(productsData, ['material', 'material_name', 'series']),
        size: uniqueValues(productsData, ['size', 'net_quantity', 'capacity']),
        shape: uniqueValues(productsData, ['shape', 'product_shape', 'form']),
        bottom_type: uniqueValues(productsData, ['bottom_type', 'bottom', 'base_type']),
      };

      console.log('Filter Options Extracted:', filterOpts);
      console.log('Sample product keys:', productsData.length > 0 ? Object.keys(productsData[0]) : 'No products');
      console.log('First product for debugging:', productsData[0]);

      // Log field availability
      console.log('Field availability in products:', {
        lid_type: productsData.filter(p => p.lid_type).length,
        subcat_name: productsData.filter(p => p.subcat_name).length,
        material: productsData.filter(p => p.material).length,
        material_name: productsData.filter(p => p.material_name).length,
        size: productsData.filter(p => p.size).length,
        net_quantity: productsData.filter(p => p.net_quantity).length,
        shape: productsData.filter(p => p.shape).length,
        bottom_type: productsData.filter(p => p.bottom_type).length,
      });

      setFilterOptions(filterOpts);

      // Set Max Price for Filter
      if (productsData.length > 0) {
        const prices = productsData.map(p => getProductPrice(p)).filter(p => p !== null);
        if (prices.length > 0) {
          const absoluteMax = Math.ceil(Math.max(...prices));
          setMaxPrice(absoluteMax);
          setSelectedFilters(prev => ({ ...prev, priceRange: [0, absoluteMax] }));
        }
      }

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
  }, [main, subcat, series, seriesOption, productSize, location.search]);

  const filteredProducts = products?.filter(product => {
    try {
      const lidType = product.lid_type || product.subcat_name;
      const material = product.material || product.material_name;
      const size = product.size || product.net_quantity;
      const shape = product.shape;
      const bottomType = product.bottom_type;
      const productPrice = getProductPrice(product) || 0;

      return (
        (selectedFilters.lid_type.length === 0 || (lidType && selectedFilters.lid_type.includes(String(lidType).trim()))) &&
        (selectedFilters.material.length === 0 || (material && selectedFilters.material.includes(String(material).trim()))) &&
        (selectedFilters.size.length === 0 || (size && selectedFilters.size.includes(String(size).trim()))) &&
        (selectedFilters.shape.length === 0 || (shape && selectedFilters.shape.includes(String(shape).trim()))) &&
        (selectedFilters.bottom_type.length === 0 || (bottomType && selectedFilters.bottom_type.includes(String(bottomType).trim()))) &&
        (productPrice >= selectedFilters.priceRange[0] && productPrice <= selectedFilters.priceRange[1])
      );
    } catch (err) {
      console.error('Error filtering product:', product, err);
      return true;
    }
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
      priceRange: [0, maxPrice],
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
    // Extract product ID from multiple possible fields
    const productId = product?.id ||
      product?.product_id ||
      product?.product_variant_id ||
      product?.variant_id ||
      product?.detail_id ||
      product?.sku;

    // Extract price from multiple possible fields
    const productPrice = product?.price ||
      product?.selling_price ||
      product?.detail_price ||
      product?.mrp ||
      (product?.variants?.length > 0 ? product.variants[0].price : null);

    console.log("Adding to cart - Product:", { productId, productPrice, product });

    if (!productId) {
      toast.error("Product ID not found");
      console.error("Product data for debugging:", product);
      return;
    }

    if (!productPrice) {
      toast.error("Product price not available");
      return;
    }

    // Create a properly formatted product object for handleAddToCart
    const formattedProduct = {
      ...product,
      product_id: productId,
      id: productId,
      price: productPrice,
      selling_price: productPrice
    };

    try {
      handleAddToCart(formattedProduct);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart");
    }
  };

  return (
    <div className="px-2 bg-white md:px-10">
      {/* Add MegaMenu at the top */}
      <CategoryMegaMenu />



      {/* <h2 className="text-center text-xl font-semibold my-6">Shop By Category</h2> */}

      {/* Category Icons */}
      {/* <div className="flex flex-wrap justify-center gap-6 mb-10">
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
      </div> */}

      {/* Mobile Filters - Show only on screens smaller than lg */}
      <div className="lg:hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 mb-6 sm:mb-8 px-4 sm:px-6 animate-fade-in">
        <div className="w-full sm:flex-1 overflow-x-auto scrollbar-hide py-1">
          <div className="flex flex-nowrap gap-2 min-w-max">
            {/* Sort By */}
            <div className="relative group min-w-[90px]">
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "price-low-high") {
                    setSortBy("price-low-high");
                  } else if (value === "price-high-low") {
                    setSortBy("price-high-low");
                  } else {
                    setSortBy("");
                  }
                }}
                value={sortBy}
                className="appearance-none w-full max-w-[90px] text-[13px] sm:text-sm pl-3 pr-9 py-2 rounded-lg border border-gray-300 bg-white cursor-pointer hover:border-[#B91508] transition-all outline-none"
              >
                <option value="">Sort by Price</option>
                <option value="price-low-high">Low to High</option>
                <option value="price-high-low">High to Low</option>
              </select>
              <div className="absolute inset-y-0 right-1 flex items-center pr-2.5 pointer-events-none text-gray-400 group-hover:text-[#B91508] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* Type Filter */}
            {filterOptions.lid_type?.length > 0 && (
              <div className="relative group min-w-[80px]">
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      setSelectedFilters({ ...selectedFilters, lid_type: [value] });
                    } else {
                      setSelectedFilters({ ...selectedFilters, lid_type: [] });
                    }
                  }}
                  value={selectedFilters.lid_type[0] || ""}
                  className="appearance-none w-full max-w-[82px] text-[12px] sm:text-sm pl-3 pr-9 py-2 rounded-lg border border-gray-300 bg-white cursor-pointer hover:border-[#B91508] transition-all outline-none"
                >
                  <option value="">Type</option>
                  {filterOptions.lid_type?.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pr-2.5 pointer-events-none text-gray-400 group-hover:text-[#B91508] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            )}

            {/* Material Filter */}
            {filterOptions.material?.length > 0 && (
              <div className="relative group min-w-[80px]">
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      setSelectedFilters({ ...selectedFilters, material: [value] });
                    } else {
                      setSelectedFilters({ ...selectedFilters, material: [] });
                    }
                  }}
                  value={selectedFilters.material[0] || ""}
                  className="appearance-none w-full max-w-[98px] text-[13px] sm:text-sm pl-3 pr-9 py-2 rounded-lg border border-gray-300 bg-white cursor-pointer hover:border-[#B91508] transition-all outline-none"
                >
                  <option value="">Material</option>
                  {filterOptions.material?.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pr-2.5 pointer-events-none text-gray-400 group-hover:text-[#B91508] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            )}

            {/* Size Filter */}
            {filterOptions.size?.length > 0 && (
              <div className="relative group min-w-[78px]">
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      setSelectedFilters({ ...selectedFilters, size: [value] });
                    } else {
                      setSelectedFilters({ ...selectedFilters, size: [] });
                    }
                  }}
                  value={selectedFilters.size[0] || ""}
                  className="appearance-none w-full max-w-[78px] text-[13px] sm:text-sm pl-3 pr-9 py-2 rounded-lg border border-gray-300 bg-white cursor-pointer hover:border-[#B91508] transition-all outline-none"
                >
                  <option value="">Size</option>
                  {filterOptions.size?.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pr-2.5 pointer-events-none text-gray-400 group-hover:text-[#B91508] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 items-center justify-end sm:justify-start">
          <button
            onClick={applyFilters}
            className="flex-1 min-w-[80px] sm:max-w-[100px] bg-[#B91508] text-white text-sm font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-black transition-all active:scale-95"
          >
            Apply
          </button>
          <button
            onClick={resetFilters}
            className="flex-1 min-w-[80px] sm:max-w-[100px] text-[#B91508] text-sm font-bold border border-[#B91508] py-2 px-4 rounded-lg hover:bg-[#B91508] hover:text-white transition-all active:scale-95"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Desktop Layout with Sidebar - Show only on lg screens and above */}
      <div className="hidden lg:flex gap-6 mt-6">
        {/* Left Sidebar - Filters */}
        <div className="w-72 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg shadow-md flex flex-col">
            {/* Header */}
            <div className="bg-red-50 p-5 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                <p className="text-sm sm:text-sm text-gray-600">Showing {filteredProducts.length} results</p>
              </div>
            </div>

            {/* Filter Content */}
            <div className="flex-1">




              {/* Type Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => setShowFilterDropdown(showFilterDropdown === 'type' ? null : 'type')}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">Product Type</span>
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${showFilterDropdown === 'type' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showFilterDropdown === 'type' && (
                  <div className="px-5 pb-4 space-y-2">
                    {filterOptions.lid_type?.length > 0 ? (
                      filterOptions.lid_type.map((val) => (
                        <label key={val} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedFilters.lid_type.includes(val)}
                            onChange={() => handleFilterChange('lid_type', val)}
                            className="w-4 h-4 text-[#B91508] border-gray-300 rounded focus:ring-[#B91508]"
                          />
                          <span className="ml-3 text-sm text-gray-700">{val}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500 italic px-2">No options available</p>
                    )}
                  </div>
                )}
              </div>
              {/* Price Range Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => setShowFilterDropdown(showFilterDropdown === 'price' ? null : 'price')}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">Price Range</span>
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${showFilterDropdown === 'price' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showFilterDropdown === 'price' && (
                  <div className="px-5 pb-8 pt-2">
                    <div className="flex justify-between items-center mb-6">
                      <div className="bg-white border border-gray-200 rounded px-2 py-1 focus-within:border-[#B91508] transition-colors">
                        <span className="text-[10px] text-gray-400 block uppercase font-bold">Min</span>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-0.5">₹</span>
                          <input
                            type="number"
                            value={selectedFilters.priceRange[0]}
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value) || 0);
                              const newVal = Math.min(val, selectedFilters.priceRange[1] - 1);
                              setSelectedFilters(prev => ({ ...prev, priceRange: [newVal, prev.priceRange[1]] }));
                            }}
                            className="text-sm font-semibold text-gray-700 w-16 bg-transparent outline-none border-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                      </div>
                      <div className="h-[1px] w-4 bg-gray-300 mx-2"></div>
                      <div className="bg-white border border-gray-200 rounded px-2 py-1 text-right focus-within:border-[#B91508] transition-colors">
                        <span className="text-[10px] text-gray-400 block uppercase font-bold text-right">Max</span>
                        <div className="flex items-center justify-end">
                          <span className="text-sm text-gray-500 mr-0.5">₹</span>
                          <input
                            type="number"
                            value={selectedFilters.priceRange[1]}
                            onChange={(e) => {
                              const val = Math.min(maxPrice, parseInt(e.target.value) || 0);
                              const newVal = Math.max(val, selectedFilters.priceRange[0] + 1);
                              setSelectedFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], newVal] }));
                            }}
                            className="text-sm font-semibold text-gray-700 w-16 bg-transparent outline-none border-none p-0 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="relative w-full h-6 flex items-center group">
                      {/* Slider Track */}
                      <div className="absolute w-full h-1.5 bg-gray-200 rounded-full"></div>

                      {/* Active Range Highlight */}
                      <div
                        className="absolute h-1.5 bg-[#B91508] rounded-full transition-all"
                        style={{
                          left: `${(selectedFilters.priceRange[0] / maxPrice) * 100}%`,
                          width: `${((selectedFilters.priceRange[1] - selectedFilters.priceRange[0]) / maxPrice) * 100}%`
                        }}
                      ></div>

                      {/* Range Inputs (Double Range Trick) */}
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        step="10"
                        value={selectedFilters.priceRange[0]}
                        onChange={(e) => {
                          const value = Math.min(Number(e.target.value), selectedFilters.priceRange[1] - 100);
                          setSelectedFilters(prev => ({ ...prev, priceRange: [value, prev.priceRange[1]] }));
                        }}
                        className="absolute w-full appearance-none bg-transparent pointer-events-none z-30 h-1.5"
                        style={{
                          WebkitAppearance: 'none',
                        }}
                      />
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        step="10"
                        value={selectedFilters.priceRange[1]}
                        onChange={(e) => {
                          const value = Math.max(Number(e.target.value), selectedFilters.priceRange[0] + 100);
                          setSelectedFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], value] }));
                        }}
                        className="absolute w-full appearance-none bg-transparent pointer-events-none z-30 h-1.5"
                        style={{
                          WebkitAppearance: 'none',
                        }}
                      />
                    </div>

                    {/* Inline CSS for Custom Thumb Styling */}
                    <style dangerouslySetInnerHTML={{
                      __html: `
                      input[type=range]::-webkit-slider-thumb {
                        pointer-events: auto;
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        -webkit-appearance: none;
                        background: #ffffff;
                        border: 2px solid #B91508;
                        cursor: pointer;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        transition: all 0.2s;
                      }
                      input[type=range]::-webkit-slider-thumb:hover {
                        transform: scale(1.1);
                        box-shadow: 0 3px 6px rgba(0,0,0,0.15);
                      }
                      input[type=range]::-moz-range-thumb {
                        pointer-events: auto;
                        width: 14px;
                        height: 14px;
                        border-radius: 50%;
                        background: #ffffff;
                        border: 2px solid #B91508;
                        cursor: pointer;
                      }
                    `}} />
                  </div>
                )}
              </div>
              {/* Sort By Section */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => setShowFilterDropdown(showFilterDropdown === 'sort' ? 'type' : 'sort')}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">Sort By</span>
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${showFilterDropdown === 'sort' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showFilterDropdown === 'sort' && (
                  <div className="px-5 pb-4 space-y-2">

                    <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                      <input
                        type="radio"
                        name="sort"
                        checked={sortBy === "price-low-high"}
                        onChange={() => setSortBy("price-low-high")}
                        className="w-4 h-4 text-[#B91508] border-gray-300 focus:ring-[#B91508]"
                      />
                      <span className="ml-3 text-sm text-gray-700">Price: Low to High</span>
                    </label>
                    <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                      <input
                        type="radio"
                        name="sort"
                        checked={sortBy === "price-high-low"}
                        onChange={() => setSortBy("price-high-low")}
                        className="w-4 h-4 text-[#B91508] border-gray-300 focus:ring-[#B91508]"
                      />
                      <span className="ml-3 text-sm text-gray-700">Price: High to Low</span>
                    </label>
                  </div>
                )}
              </div>
              {/* Material Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => setShowFilterDropdown(showFilterDropdown === 'material' ? 'type' : 'material')}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">Product Material</span>
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${showFilterDropdown === 'material' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showFilterDropdown === 'material' && (
                  <div className="px-5 pb-4 space-y-2">
                    {filterOptions.material?.length > 0 ? (
                      filterOptions.material.map((val) => (
                        <label key={val} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedFilters.material.includes(val)}
                            onChange={() => handleFilterChange('material', val)}
                            className="w-4 h-4 text-[#B91508] border-gray-300 rounded focus:ring-[#B91508]"
                          />
                          <span className="ml-3 text-sm text-gray-700">{val}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500 italic px-2">No options available</p>
                    )}
                  </div>
                )}
              </div>

              {/* Size Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => setShowFilterDropdown(showFilterDropdown === 'size' ? 'type' : 'size')}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">Size</span>
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${showFilterDropdown === 'size' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showFilterDropdown === 'size' && (
                  <div className="px-5 pb-4 space-y-2">
                    {filterOptions.size?.length > 0 ? (
                      filterOptions.size.map((val) => (
                        <label key={val} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedFilters.size.includes(val)}
                            onChange={() => handleFilterChange('size', val)}
                            className="w-4 h-4 text-[#B91508] border-gray-300 rounded focus:ring-[#B91508]"
                          />
                          <span className="ml-3 text-sm text-gray-700">{val}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500 italic px-2">No options available</p>
                    )}
                  </div>
                )}
              </div>

              {/* Shape Filter */}


              {/* Apply and Reset Buttons */}
              <div className="p-5 border-t border-gray-200 bg-red-50">
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={resetFilters}
                    className="flex-1 bg-white text-gray-700 border border-gray-300 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => {
                      // Apply filters - filters are already applied on change
                      setShowFilterDropdown(null);
                    }}
                    className="flex-1 bg-[#B91508] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[#A01307] transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {/* Trust Indicators Bar - 3 Stacked Lines */}
                <div className="flex flex-col gap-4 py-2 text-[#B91508]">
                  <div className="flex items-center gap-3">
                    <FaWallet className="text-xl" />
                    <span className="font-bold text-[11px] tracking-wide uppercase">Free COD Available</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaTruck className="text-xl" />
                    <span className="font-bold text-[11px] tracking-wide uppercase">Free Shipping Above ₹ 1198</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaUndo className="text-xl" />
                    <span className="font-bold text-[11px] tracking-wide uppercase">Easy 7-Day Return</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Products */}
        <div className="flex-1 pb-20">


          {/* Product Grid */}
          <div className="w-full py-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
              {filteredProducts.map((product, i) => (
                <div className="flex justify-center">
                  <div
                    className="relative bg-[#fff4f4] rounded-[10px] border border-[#ffc5c5] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center p-1 sm:p-2 md:p-3 pb-5 w-full max-w-[180px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px]"
                    key={i}
                  >
                    {/* <div className="absolute top-1 sm:top-2 right-1 sm:right-2 w-6 sm:w-7 h-6 sm:h-7 bg-white rounded-full flex items-center justify-center z-10 shadow-md hover:shadow-lg transition-shadow">
                      <FontAwesomeIcon
                        icon={wishlistItems?.includes(parseInt(product.id || product.product_id || product.product_variant_id || product.detail_id)) ? solidHeart : regularHeart}
                        style={{
                          color: wishlistItems?.includes(parseInt(product.id || product.product_id || product.product_variant_id || product.detail_id)) ? "#E03B2D" : "#666",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                        onClick={() => handlewishlist && handlewishlist(product.id || product.product_id || product.product_variant_id || product.detail_id)}
                        className="hover:scale-110 transition-transform"
                      />
                    </div> */}

                    <Link to={`/product/${product.id || product.product_id || product.product_variant_id || product.detail_id}`}>
                      <div className="relative   w-full aspect-square overflow-hidden rounded-lg mb-1 sm:mb-2">
                        <LazyImage
                          src={getProductImage(product)}
                          alt={product.name || product.product_name || 'Product'}
                          className="w-full h-full object-cover rounded-lg transition-all duration-300 hover:scale-105"
                          onError={(e) => {
                            e.target.src = '/asset/images/dummy-image-square.jpg';
                          }}
                        />
                      </div>
                    </Link>

                    <Link to={`/product/${product.id || product.product_id || product.product_variant_id || product.detail_id}`}>
                      <h2 className="text-xs sm:text-sm font-semibold text-center hover:text-red-600 transition-colors cursor-pointer line-clamp-2 mb-1">
                        {toSentenceCase(product.name || product.product_name || "Product")}
                      </h2>

                    </Link>
                    <p className="text-xs sm:text-sm font-semibold text-center mb-1 sm:mb-2">
                      <span className="text-xs sm:text-sm font-normal text-[#AAAAAA]">From </span>
                      {getProductPrice(product) ? (
                        <>Rs. {getProductPrice(product)}</>
                      ) : (
                        <span className="text-gray-500">Price not available</span>
                      )}
                    </p>
                    <div className="flex justify-center items-center gap-1 w-full">
                      <button
                        onClick={() => handleAddToCartClick(product)}
                        className="bg-[#B91508] text-white text-nowrap text-[13px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add to cart
                      </button>
                      <button
                        onClick={() => {
                          // Extract product ID from multiple possible fields
                          const productId = product?.id ||
                            product?.product_id ||
                            product?.product_variant_id ||
                            product?.variant_id ||
                            product?.detail_id ||
                            product?.sku;

                          // Extract price from multiple possible fields
                          const productPrice = product?.price ||
                            product?.selling_price ||
                            product?.detail_price ||
                            product?.mrp ||
                            (product?.variants?.length > 0 ? product.variants[0].price : null);

                          if (!productId) {
                            toast.error("Product ID not found");
                            return;
                          }

                          if (!productPrice) {
                            toast.error("Product price not available");
                            return;
                          }

                          // Create a properly formatted product object
                          const formattedProduct = {
                            ...product,
                            product_id: productId,
                            id: productId,
                            price: productPrice,
                            selling_price: productPrice
                          };

                          handleBuyNow(formattedProduct);
                        }}
                        className="text-[#B91508] text-[13px] sm:text-sm text-nowrap border-1 border-[#B91508] px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-[#B91508] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>

              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Product Grid - Show only on screens smaller than lg */}
      <div className="lg:hidden w-full px-1 sm:px-4 md:px-6 py-1 sm:py-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 sm:gap-2 md:gap-3">
          {filteredProducts.map((product, i) => (
            <div className="flex justify-center" key={i}>
              <div
                className="relative bg-[#fff4f4] rounded-[10px] border border-[#ffc5c5] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center p-1 sm:p-2 md:p-3 pb-5 w-full max-w-[180px] sm:max-w-[200px] md:max-w-[240px]"
              >
                {/* <div className="absolute top-1 sm:top-2 right-1 sm:right-2 w-6 sm:w-7 h-6 sm:h-7 bg-white rounded-full flex items-center justify-center z-10 shadow-md hover:shadow-lg transition-shadow">
                  <FontAwesomeIcon
                    icon={wishlistItems?.includes(parseInt(product.id || product.product_id || product.product_variant_id || product.detail_id)) ? solidHeart : regularHeart}
                    style={{
                      color: wishlistItems?.includes(parseInt(product.id || product.product_id || product.product_variant_id || product.detail_id)) ? "#E03B2D" : "#666",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                    onClick={() => handlewishlist && handlewishlist(product.id || product.product_id || product.product_variant_id || product.detail_id)}
                    className="hover:scale-110 transition-transform"
                  />
                </div> */}

                <Link to={`/product/${product.id || product.product_id || product.product_variant_id || product.detail_id}`}>
                  <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-1 sm:mb-2">
                    <LazyImage
                      src={getProductImage(product)}
                      alt={product.name || product.product_name || 'Product'}
                      className="w-full h-full object-cover rounded-lg transition-all duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/asset/images/dummy-image-square.jpg';
                      }}
                    />
                  </div>
                </Link>

                <Link to={`/product/${product.id || product.product_id || product.product_variant_id || product.detail_id}`}>
                  <h2 className="text-xs sm:text-sm font-semibold text-center hover:text-red-600 transition-colors cursor-pointer line-clamp-2 mb-1">
                    {toSentenceCase(product.name || product.product_name || "Product")}
                  </h2>

                </Link>
                <p className="text-xs sm:text-sm font-semibold text-center mb-1 sm:mb-2">
                  <span className="text-xs sm:text-sm font-normal text-[#AAAAAA]">From </span>
                  {getProductPrice(product) ? (
                    <>Rs. {getProductPrice(product)}</>
                  ) : (
                    <span className="text-gray-500">Price not available</span>
                  )}
                </p>
                <div className="flex justify-center items-center gap-1 w-full">
                  <button
                    onClick={() => handleAddToCartClick(product)}
                    className="bg-[#B91508] text-white text-nowrap text-[13px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to cart
                  </button>
                  <button
                    onClick={() => {
                      // Extract product ID from multiple possible fields
                      const productId = product?.id ||
                        product?.product_id ||
                        product?.product_variant_id ||
                        product?.variant_id ||
                        product?.detail_id ||
                        product?.sku;

                      // Extract price from multiple possible fields
                      const productPrice = product?.price ||
                        product?.selling_price ||
                        product?.detail_price ||
                        product?.mrp ||
                        (product?.variants?.length > 0 ? product.variants[0].price : null);

                      if (!productId) {
                        toast.error("Product ID not found");
                        return;
                      }

                      if (!productPrice) {
                        toast.error("Product price not available");
                        return;
                      }

                      // Create a properly formatted product object
                      const formattedProduct = {
                        ...product,
                        product_id: productId,
                        id: productId,
                        price: productPrice,
                        selling_price: productPrice
                      };

                      handleBuyNow(formattedProduct);
                    }}
                    className="text-[#B91508] text-[13px] sm:text-sm text-nowrap border-1 border-[#B91508] px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-[#B91508] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default CategoryPage;
