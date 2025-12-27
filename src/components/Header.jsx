import React, { useContext, useEffect, useState, useRef } from "react";
import {
  FaRandom,
  FaRegUser,
  FaRegHeart,
  FaWhatsapp,
  FaChevronDown,
} from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { MdLockOutline } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineLocalPhone } from "react-icons/md"; 
import { AiOutlineInfoCircle } from "react-icons/ai";
import { IoGiftOutline } from "react-icons/io5";
import { LiaCertificateSolid } from "react-icons/lia";
import { FiShoppingCart } from "react-icons/fi";
import { GiRiceCooker } from "react-icons/gi";
import { HiOutlineMenu } from "react-icons/hi";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { FaShop } from "react-icons/fa6";
import { FiPhoneCall } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { Link, Navigate } from "react-router-dom";
import AccountsPage from "./AccountsPage";
import Orders from "./Orders";
import { useNavigate } from "react-router-dom";
import axios from '.././axiosConfig';
//  import CategoryMegaMenu from  '../components/header/CategoryMegaMenu.jsx'
import { CartContext } from "../context/CartContext";
import { RxCross1 } from "react-icons/rx";
import Marquee from "./marquee/Marquee";
import { MdSearch } from "react-icons/md";
const Header = ({ addcart, isLoggedIn, handlelogout }) => {
  const [hide, setHide] = useState(true);
  const [activeindex, setActive] = useState(null);
  const [category, setCategory] = useState([]);

  const getCategories = async () => {

    try {
      const response = await axios.get("getMegaMenu.php");
      setCategory(response.data); // Now includes full hierarchy
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  useEffect(() => {
    getCategories();

  }, []);
  const items = [
    "Home",
    "Best Seller",
    "New Arrivals",
    "Pressure Cooker",
    
    "Contact US",
    "About Us",
   
    "ACCOUNT MAIN",
    // "ORDERS HISTORY",
    "MY WISHLIST",
    // "PROFILE SETTING",
    // "TRANSACTION",
    "MY CART",
    "Product Catalogue",
  ];
  const [searchProduct, setSearchProduct] = useState('');
  const [searchProductData, setSearchProductData] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();
  const searchTimeoutRef = useRef(null);

  const searchProducts = async (query) => {
    if (!query.trim()) {
      setSearchProductData([]);
      return;
    }

    try {
      setIsSearchLoading(true);
      console.log('🔍 Searching for:', query);
      
      // Use fetch with proper cookie handling
      const response = await fetch(`https://mediumblue-finch-130496.hostingersite.com/api/search?search=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // This includes cookies in the request
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Search API Response:', data);
      console.log('📋 Response fields:', data?.[0] ? Object.keys(data[0]) : 'N/A');
      
      // Handle different response structures
      let results = [];
      if (Array.isArray(data)) {
        results = data;
      } else if (Array.isArray(data?.data)) {
        results = data.data;
      } else if (Array.isArray(data?.results)) {
        results = data.results;
      } else if (data?.products && Array.isArray(data.products)) {
        results = data.products;
      }
      
      // Enrich results with variant data (MRP, first variant image)
      const enrichedResults = results.map(item => ({
        ...item,
        mrp: item.mrp || item.variants?.[0]?.mrp || item.price || item.product_price,
        variantImage: item.variants?.[0]?.image,
        defaultImage: item.image || item.product_images
      }));
      
      console.log('📦 Processed results count:', enrichedResults.length);
      console.log('🖼️ First result enriched:', enrichedResults[0]);
      setSearchProductData(enrichedResults);
    } catch (e) {
      console.error('❌ Search API Error:', e.message);
      setSearchProductData([]);
    } finally {
      setIsSearchLoading(false);
    }
  }
  
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Clear results if search is empty
    if (searchProduct === '') {
      setSearchProductData([]);
      return;
    }

    // Set new timeout for debounced search (500ms delay)
    setIsSearchLoading(true);
    searchTimeoutRef.current = setTimeout(() => {
      searchProducts(searchProduct);
    }, 500);

    // Cleanup on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchProduct]);


const getProductImage = (item) => {
  const img =
    item?.variants?.[0]?.image ||
    item?.image ||
    item?.product_images;

  if (!img) return "/asset/images/dummy-image-square.jpg";

  try {
    // Fix escaped S3 URLs (https:\/\/)
    return decodeURIComponent(img);
  } catch {
    return img;
  }
};


  const menuhandler = () => {
    setHide(!hide);
  };


  const { totalItems } = useContext(CartContext);



  return (
    <div className="relative">
       <Marquee />
      <header
        className=" hidden  md:flex justify-between items-center bg-[#F0F0F2] font-[Helvetica Now Display]  p-4 px-16 text-black "
      >
        
        <div className="flex gap-6 items-center text-sm w-96">
          <p>
            <a target="_blank" href="/asset/pdf/Summit Catalog 2025 cooker  Editable.pdf">Product Catalogue</a>
          </p>
          <p>
            <Link to={"/about"}>About us</Link>
          </p>
          <p>
            <Link to={"/contact"}>Contact us</Link>
          </p>
        </div>
        <div className="flex items-center justify-end w-96 space-x-4 text-sm">
          <p className="flex items-center ">

            <Link to="https://wa.me/919990555161" className="mr-1 flex items-center">
              <FaWhatsapp className="mr-1" />
              +91 9990555161
            </Link>
          </p>
          <div className="border-l h-5"></div>
          <p className="flex items-center">
            <a href="" className="mr-2">
              <FiPhoneCall />
            </a>
            1800 419 6048
          </p>
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-gradient-to-b from-white via-gray-50 to-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[9999] md:hidden overflow-y-auto flex flex-col ${
          hide ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <img src="/asset/images/Logo.png" alt="Summit" className="size-12" />
            </div>
            
          </div>
          <button
            onClick={() => setHide(true)}
            className="text-white hover:bg-red-800 p-1 rounded-full transition-colors"
          >
            <RxCross1 className="text-2xl" />
          </button>
        </div>
        
        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1">
          <ul className="space-y-2">
            {items.map((item, i) => {
              const routeMap = {
                "Home": "/",
                "Best Seller": "/",
                "New Arrivals": "/",
                "Pressure Cooker": "/",
                "Contact US": "/contact",
                "About Us": "/about",
                "ACCOUNT MAIN": isLoggedIn
                  ? "/accountsPage"
                  : "/login?redirectTo=" + encodeURIComponent("/accountsPage"),
                "MY CART": "/cart",
                "MY WISHLIST": "/wishlist",
              };

              if (item === "MY CART") {
                return (
                  <Link
                    key={i}
                    to={routeMap[item]}
                    onClick={() => {
                      setActive(i);
                      setHide(true);
                    }}
                  >
                    <li className="py-3 px-4 text-gray-700 hover:bg-red-50 rounded-lg cursor-pointer transition-all flex items-center justify-between font-medium border-l-4 border-transparent hover:border-red-600">
                      <span className="flex items-center gap-3">
                        <FiShoppingCart className="text-red-600" />
                        {item}
                      </span>
                      <span className="bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                        {totalItems}
                      </span>
                    </li>
                  </Link>
                );
              }
              if (item === "MY WISHLIST") {
                return (
                  <Link
                    key={i}
                    to={routeMap[item]}
                    onClick={() => {
                      setActive(i);
                      setHide(true);
                    }}
                  >
                    <li className="py-3 px-4 text-gray-700 hover:bg-red-50 rounded-lg cursor-pointer transition-all font-medium border-l-4 border-transparent hover:border-red-600 flex items-center gap-3">
                      <FaRegHeart className="text-red-600" />
                      {item}
                    </li>
                  </Link>
                );
              }

              if (item === "Product Catalogue") {
                return (
                  <a
                    key={i}
                    href="/asset/pdf/Summit Catalog 2025 cooker  Editable.pdf"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      setActive(i);
                      setHide(true);
                    }}
                  >
                    <li className="py-3 px-4 text-gray-700 hover:bg-red-50 rounded-lg cursor-pointer transition-all font-medium border-l-4 border-transparent hover:border-red-600 flex items-center gap-3">
                      <span className="text-red-600 text-xl"><IoDocumentTextOutline /></span>
                      {item}
                    </li>
                  </a>
                );
              }

              if (routeMap[item]) {
                return (
                  <Link
                    key={i}
                    to={routeMap[item]}
                    onClick={() => {
                      setActive(i);
                      setHide(true);
                    }}
                  >
                    <li className="py-3 px-4 text-gray-700 hover:bg-red-50 rounded-lg cursor-pointer transition-all font-medium border-l-4 border-transparent hover:border-red-600 flex items-center gap-3">
                      {item === "Home" && <span className="text-red-600 text-lg"><IoHomeOutline /></span>}
                      {item === "Best Seller" && <span className="text-red-600 text-lg"><LiaCertificateSolid /></span>}
                      {item === "New Arrivals" && <span className="text-red-600 text-lg"><IoGiftOutline /></span>}
                      {item === "Pressure Cooker" && <span className="text-red-600 text-lg"><GiRiceCooker /></span>}
                      {item === "Contact US" && <span className="text-red-600 text-lg"><MdOutlineLocalPhone /></span>}
                      {item === "About Us" && <span className="text-red-600 text-lg"><AiOutlineInfoCircle /></span>}
                      {item === "ACCOUNT MAIN" && <span className="text-red-600 text-lg"><CgProfile /></span>}
                      {item}
                    </li>
                  </Link>
                );
              }
              return (
                <div key={i}>
                  <li
                    className="py-3 px-4 text-gray-700 hover:bg-red-50 rounded-lg cursor-pointer transition-all font-medium border-l-4 border-transparent hover:border-red-600"
                    onClick={() => {
                      setActive(i);
                      setHide(true);
                    }}
                  >
                    {item}
                  </li>
                </div>
              );
            })}
          </ul>
        </nav>

        {/* Login/Logout Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <button
            onClick={() => {
              setActive(items.length);
              if (isLoggedIn) {
                handlelogout();
                setHide(true);
              }
              if (!isLoggedIn) {
                navigate("/login");
                setHide(true);
              }
            }}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
              isLoggedIn
                ? 'bg-gray-600 hover:bg-gray-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isLoggedIn ? (
              <>
                <span>🚪</span>
                LOG OUT
              </>
            ) : (
              <>
                <span className="text-white"><MdLockOutline /></span>
                LOG IN
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Overlay */}
      {!hide && (
        <div
          
          onClick={() => setHide(true)}
        />
      )}

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-white z-[10000] md:hidden flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3">
            <button
              onClick={() => {
                setShowMobileSearch(false);
                setSearchProduct('');
              }}
              className="text-gray-700 hover:text-gray-900"
            >
              <span className="text-2xl">←</span>
            </button>
            <input
              type="search"
              placeholder="Search products..."
              className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              autoFocus
            />
            {searchProduct && (
              <button
                onClick={() => setSearchProduct('')}
                className="text-gray-700 hover:text-gray-900 text-xl"
              >
                
              </button>
            )}
          </div>

          {/* Results Container */}
          <div className="flex-1 overflow-y-auto p-4">
            {searchProduct === '' ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MdSearch className="text-5xl mb-2 opacity-30" />
                <p className="text-sm">Start typing to search products</p>
              </div>
            ) : isSearchLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mb-2"></div>
                <p className="text-gray-500 text-sm">Searching...</p>
              </div>
            ) : searchProductData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="text-sm">No products found for "{searchProduct}"</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Search Results</h2>
                  <p className="text-sm text-gray-600">Found <span className="text-red-600 font-semibold">{searchProductData.length}</span></p>
                </div>
                
                {/* Products Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {searchProductData.slice(0, 6).map((item, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setShowMobileSearch(false);
                        setSearchProduct('');
                        navigate(`/product-details/${item.id || item.sno}`);
                      }}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg hover:border-red-400 transition-all flex flex-col"
                    >
                      {/* Product Image */}
                      <div className="w-full aspect-square  flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                        <img
                          src={item.image || item.product_images || '/asset/images/dummy-image-square.jpg'}
                          onError={(e) => {
                            e.target.src = '/asset/images/dummy-image-square.jpg';
                          }}
                          alt={item.name || item.product_name || 'Product'}
                          className="w-full h-full object-contain p-2"
                        />
                        {item.discount && (
                          <div className="absolute top-1 right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                            {item.discount}%
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-3 flex flex-col flex-grow">
                        <h3 className="text-xs font-bold text-gray-900 line-clamp-2 mb-1">
                          {item.name || item.product_name || 'Product'}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2 flex-grow">
                          {item.description || item.product_description || 'Quality product for your kitchen'}
                        </p>
                        <div className="flex items-center gap-1 pt-2 border-t border-gray-200">
                          <p className="text-sm font-bold text-red-600">
                            ₹{item.price || item.product_price || item.mrp || 'N/A'}
                          </p>
                          {(item.mrp && item.price && item.mrp !== item.price) && (
                            <p className="text-xs text-gray-400 line-through">
                              ₹{item.mrp}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Button */}
                <button
                  onClick={() => {
                    setShowMobileSearch(false);
                    navigate(`/products/all`);
                  }}
                  className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold text-sm mb-4 sticky bottom-0"
                >
                  VIEW ALL({searchProductData.length})
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* -----------------------Header End---------------------------------- */}
      <nav className="px-2 py-1.5 md:px-16  md:pt-5 bg-[#FAFAFC]">
        {/* ---------------------first nav bar--------------------- */}
        <div className="flex  items-center justify-between  w-full h-14">
          <div className="flex w-full space-x-5  md:w-[60%]">
            <div className="hidden md:block mb-4   ">
              <Link to={"/"}>
                {" "}
                <img
                  src="/asset/images/Logo.png"
                  alt=""
                  className="md:w-22 rounded-md"
                />
              </Link>
            </div>

            <div className="md:hidden flex justify-between w-full">
              <div>
                <Link to={"/"}>
                  <img src="/asset/images/LogoS.png" alt="" className="w-16" />
                </Link>
              </div>
              <div className="flex items-center  space-x-4">
                <button
                  onClick={() => setShowMobileSearch(true)}
                  className="bg-[#F1F1F1] rounded-full text-black p-2 w-10 h-10 flex items-center justify-center"
                >
                  <MdSearch className="w-5 h-5" />
                </button>
                <span className="relative">
                  <Link
                    to={"/cart"}
                    className="relative bg-[#F1F1F1] rounded-full p-2 text-gray-950 font-normal"
                  >
                    <ShoppingCartOutlinedIcon className="" />
                    {totalItems > 0 && (
                      <div className="text-white bg-red-700 text-xs absolute top-0 right-0 rounded-full px-1">
                        {totalItems}
                      </div>
                    )}
                  </Link>
                </span>
                <HiOutlineMenu
                  className="  w-7 h-7 text-[#1C1C1C]"
                  onClick={menuhandler}
                />
              </div>
            </div>
             <div className="hidden md:relative md:flex items-center justify-center w-full">
  {/* Search Icon */}
  <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-lg">
    <FiSearch />
  </span>

  {/* Search Input */}
  <input
    type="search"
    placeholder="Search for products"
    className="bg-white rounded-full w-full py-2 pl-10 pr-4 text-sm placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
    value={searchProduct}
    onChange={(e) => setSearchProduct(e.target.value)}
  />

  {/* Search Dropdown */}
  {searchProduct !== "" && (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl z-[999] p-4 max-h-[500px] overflow-y-auto border border-gray-200">
      
      {/* Loading */}
      {isSearchLoading ? (
        <div className="w-full flex justify-center items-center py-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-2"></div>
            <p className="text-gray-500 text-sm">Searching...</p>
          </div>
        </div>
      ) : searchProductData.length === 0 ? (
        <div className="w-full flex justify-center items-center py-8">
          <p className="text-gray-500 text-sm">
            No products found for "{searchProduct}"
          </p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
            <p className="text-sm text-gray-700 font-semibold">
              Found{" "}
              <span className="text-red-600">
                {searchProductData.length}
              </span>{" "}
              results
            </p>
            <button
              className="text-sm text-red-600 hover:text-red-700 font-semibold hover:underline"
              onClick={() =>
                navigate(`/products/all`)
              }
            >
              View All →
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {searchProductData.slice(0, 6).map((item, i) => (
              <Link
                key={i}
                to={`/product-details/${item.id}`}
                onClick={() => setSearchProduct("")}
                className="block group"
              >
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-200 hover:border-red-400 flex flex-col h-full">

                  {/* Image */}
                  <div className="relative w-full h-44 bg-gray-100 flex items-center justify-center">
                   <img
  src={getProductImage(item)}
  alt={item.name || "Product"}
  className="w-full h-full object-contain p-3"
  loading="lazy"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/asset/images/dummy-image-square.jpg";
  }}
/>

                  </div>

                  {/* Details */}
                  <div className="p-3 flex flex-col flex-grow">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-red-600">
                      {item.name || item.product_name || "Product"}
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-2 mb-3 flex-grow">
                      {item.description ||
                        item.product_description ||
                        "Quality product for your kitchen"}
                    </p>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                      <p className="text-base font-bold text-red-600">
                        ₹
                        {item.price ||
                          item.product_price ||
                          item.mrp ||
                          "N/A"}
                      </p>
                    </div>

                    <p className="text-xs text-red-600 font-semibold mt-2">
                      View Details →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )}
</div>

          </div>
          <div className="hidden md:flex items-center justify-between space-x-4 ">
            <a href="">
              {" "}
              {/* <FaRandom className="text-gray-500 font-normal" /> */}
            </a>
             <Link
              to={"/Wishlist"}
              className=" rounded-full p-2.5 text-gray-950 font-normal"
            >
             <FaRandom />
            </Link>
            <div className="border-l border-[#BEBEBE] h-6"></div>
            <Link
              to={"/Wishlist"}
              className="bg-[#F1F1F1] rounded-full p-2.5 text-gray-950 font-normal"
            >
              <FaRegHeart />
            </Link>
            <div className="border-l border-[#BEBEBE] h-6"></div>

            <Link
              to={"/trackShipment"}
              className="bg-[#F1F1F1] text-sm px-4 py-2 text-center rounded-full"
            >
              Track Shipment
            </Link>
            <Link
              to={"/Cart"}
              className="relative bg-[#F1F1F1] rounded-full p-2 text-gray-950 font-normal"
            >
              <ShoppingCartOutlinedIcon className="" />
              {totalItems > 0 && (
                <div className="text-white bg-red-700 text-xs absolute top-0 right-0 rounded-full px-1">
                  {totalItems}
                </div>
              )}
            </Link>

            <FaRegUser
              onClick={() => {
                if (!isLoggedIn) {
                  navigate("/login");
                } else {
                  navigate("/accountsPage");
                }
              }}
              className="cursor-pointer"
            />

            {/* </Link> */}
          </div>
        </div>


        {/* <CategoryMegaMenu /> */}




      </nav>
    </div>
  );
};

export default Header;
