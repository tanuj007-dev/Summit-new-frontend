import React, { useContext, useEffect, useState, useRef } from "react";
import {
  FaRandom,
  FaRegUser,
  FaRegHeart,
  FaWhatsapp,
  FaChevronDown,
  FaFire,
  FaUtensils,
  FaFacebookF,
  FaInstagram,
  FaYoutube
} from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { MdLockOutline, MdWaves, MdOutlineLocalPhone, MdSearch, MdOutlineBlender } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoDocumentTextOutline } from "react-icons/io5";
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
import { downloadProductCatalog } from "../utils/productCatalog";
//  import CategoryMegaMenu from  '../components/header/CategoryMegaMenu.jsx'
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { RxCross1 } from "react-icons/rx";
import Marquee from "./marquee/Marquee";
import blogIcon from './assets/mnav/blog.png';
import cookwareIcon from './assets/mnav/cookware.png';
import gasTandoorIcon from './assets/mnav/gas tandoor.png';
import homeIcon from './assets/mnav/home (1).png';
import mixerIcon from './assets/mnav/mixer (1).png';
import pressureCookerIcon from './assets/mnav/pressure-cooker (2).png';
import steamCookwareIcon from './assets/mnav/steam cookware.png';
import stoveIcon from './assets/mnav/stove.png';
import accountIcon from './assets/mnav/account main.png';
import catalogueIcon from './assets/mnav/catalogue.png';
import grievanceIcon from './assets/mnav/gravience redressal.png';
import wishlistIcon from './assets/mnav/wishlist.png';
import cartIcon from './assets/mnav/shopping-cart.png';
import contactIcon from './assets/mnav/contact.png';
import aboutIcon from './assets/mnav/about.png';
import newLogo from './assets/Untitled design (51).png';

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


    "Pressure Cooker",
    "Gas Tandoor",
    "Steam Cookware",
    "Cookware",
    "Gas Stove",
    "Mixer Grinder",

    "Account Main",
    "My Wishlist",
    "My Cart",
    "Product Catalogue",
    "Grievance Redressal",
    "Blogs",
    "Contact Us",
    "About Us",
  ];
  const [searchProduct, setSearchProduct] = useState('');
  const [searchProductData, setSearchProductData] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();
  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);

  const searchProducts = async (query) => {
    if (!query.trim()) {
      setSearchProductData([]);
      return;
    }

    try {
      setIsSearchLoading(true);
      console.log('🔍 Searching for:', query);

      // Use fetch with proper cookie handling
      const apiBase = import.meta.env.VITE_APP_API_BASE_URL ?? "https://api.summithomeappliance.com";
      const response = await fetch(`${apiBase}/api/search?search=${encodeURIComponent(query)}`, {
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

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchProduct('');
        setSearchProductData([]);
      }
    };

    // Only add listener if search is active
    if (searchProduct !== '') {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchProduct]);


  const getProductImage = (item) => {
    const img =
      item?.variants?.[0]?.image ||
      item?.image ||
      item?.product_images;

    if (!img) return "/asset/images/dummy-image-square.webp";

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
  const { wishlist } = useWishlist();

  const catalogLoginUrl = () =>
    `/login?catalog=1&redirectTo=${encodeURIComponent(
      `${window.location.pathname}${window.location.search}`
    )}`;

  return (
    <div className="relative z-[95]">
      <Marquee />
      <header
        className=" hidden  md:flex justify-between items-center bg-[#F0F0F2] font-[Helvetica Now Display]  p-4 px-16 text-black "
      >

        <div className="flex gap-6 items-center text-sm w-96">
          <p>
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => void downloadProductCatalog()}
                className="cursor-pointer hover:underline bg-transparent border-0 p-0 font-inherit text-inherit"
              >
                Product Catalogue
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate(catalogLoginUrl())}
                className="hover:underline text-left bg-transparent border-0 p-0 font-inherit text-inherit cursor-pointer"
              >
                Product Catalogue
              </button>
            )}
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

      <div
        className={`fixed font-gotham top-0 right-0 h-full w-full sm:w-96 bg-white/70 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out z-[9999] md:hidden overflow-y-auto flex flex-col ${hide ? 'translate-x-full' : 'translate-x-0'
          }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 text-white p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-28 h-14   rounded-full flex  justify-center">
              <img src={newLogo} alt="Summit" className="h-16 w-26 object-contain" />
            </div>

          </div>
          <button
            onClick={() => setHide(true)}
            className="text-white bg-[#941007] p-1 rounded-full transition-colors"
          >
            <RxCross1 className="text-2xl" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1">
          <ul className=" text-[20px] space-y-1">
            {items.map((item, i) => {
              const routeMap = {
                "Home": "/",

                "New Arrivals": "/",
                "Pressure Cooker": "/products/pressure-cooker",
                "Gas Tandoor": "/products/gas-tandoor",
                "Steam Cookware": "/products/steam-cookware",
                "Cookware": "/products/cookware",
                "Gas Stove": "/products/gas-stove",
                "Mixer Grinder": "/products/mixer-grinder",
                "Contact Us": "/contact",
                "About Us": "/about",
                "Account Main": isLoggedIn
                  ? "/accountsPage"
                  : "/login?redirectTo=" + encodeURIComponent("/accountsPage"),
                "My Cart": "/cart",
                "My Wishlist": "/wishlist",
                "Grievance Redressal": "/grievance-redressal",
                "Blogs": "/all-blogs",
              };

              if (item === "My Cart") {
                return (
                  <Link
                    key={i}
                    to={routeMap[item]}
                    onClick={() => {
                      setActive(i);
                      setHide(true);
                    }}
                  >
                    <li className="py-2.5 px-4 text-gray-700 hover:bg-red-50 rounded-lg cursor-pointer transition-all flex items-center justify-between font-medium border-l-4 border-transparent hover:border-[#941007]">
                      <span className="flex items-center gap-3">
                        <img src={cartIcon} alt="" className="w-9 h-9 object-contain" />
                        {item}
                      </span>
                      <span className="bg-[#941007] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                        {totalItems}
                      </span>
                    </li>
                  </Link>
                );
              }
              if (item === "My Wishlist") {
                return (
                  <Link
                    key={i}
                    to={routeMap[item]}
                    onClick={() => {
                      setActive(i);
                      setHide(true);
                    }}
                  >
                    <li className="py-3 px-4 text-gray-700 hover:bg-red-50 rounded-lg cursor-pointer transition-all font-medium border-l-4 border-transparent hover:border-[#941007] flex items-center justify-between gap-3">
                      <span className="flex items-center gap-3">
                        <img src={wishlistIcon} alt="" className="w-9 h-9 object-contain" />
                        {item}
                      </span>
                      {wishlist.length > 0 && (
                        <span className="bg-[#941007] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                          {wishlist.length}
                        </span>
                      )}
                    </li>
                  </Link>
                );
              }

              if (item === "Product Catalogue") {
                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (isLoggedIn) {
                        void downloadProductCatalog();
                      } else {
                        navigate(catalogLoginUrl());
                      }
                      setActive(i);
                      setHide(true);
                    }}
                  >
                    <li className="py-2.5 px-4 text-gray-700 hover:bg-red-50 rounded-lg cursor-pointer transition-all font-medium border-l-4 border-transparent hover:border-[#941007] flex items-center gap-3">
                      <img src={catalogueIcon} alt="" className="w-9 h-9 object-contain" />
                      {item}
                    </li>
                  </div>
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
                    <li className="py-3  px-4 text-gray-700 hover:bg-red-50 rounded-lg cursor-pointer transition-all font-medium border-l-4 border-transparent hover:border-[#941007] flex items-center gap-3">
                      {item === "Home" && <img src={homeIcon} alt="" className="w-9 h-9 object-contain" />}
                      {item === "New Arrivals" && <span className="text-[#941007] text-lg"><IoGiftOutline size={28} /></span>}
                      {item === "Pressure Cooker" && <img src={pressureCookerIcon} alt="" className="w-9 h-9 object-contain" />}
                      {item === "Gas Tandoor" && <img src={gasTandoorIcon} alt="" className="w-9 h-9 object-contain" />}
                      {item === "Steam Cookware" && <img src={steamCookwareIcon} alt="" className="w-9 h-9 object-contain" />}
                      {item === "Cookware" && <img src={cookwareIcon} alt="" className="w-9 h-9 object-contain" />}
                      {item === "Gas Stove" && <img src={stoveIcon} alt="" className="w-9 h-9 object-contain" />}
                      {item === "Mixer Grinder" && <img src={mixerIcon} alt="" className="w-9 h-9 object-contain" />}
                      {item === "Contact Us" && <img src={contactIcon} alt="" className="w-9 h-9 object-contain" />}
                      {item === "About Us" && <img src={aboutIcon} alt="" className="w-9 h-9 object-contain" />}
                      {item === "Account Main" && <img src={accountIcon} alt="" className="w-9 h-9 object-contain" />}
                      {item === "My Wishlist" && <img src={wishlistIcon} alt="" className="w-9 h-9 object-contain" />}
                      {item === "My Cart" && <img src={cartIcon} alt="" className="w-9 h-9 object-contain" />}
                      {item === "Product Catalogue" && <img src={catalogueIcon} alt="" className="w-9 h-9 object-contain" />}
                      {item === "Grievance Redressal" && <img src={grievanceIcon} alt="" className="w-9 h-9 object-contain" />}
                      {item === "Blogs" && <img src={blogIcon} alt="" className="w-9 h-9 object-contain" />}
                      {item}
                    </li>
                  </Link>
                );
              }
              return (
                <div key={i}>
                  <li
                    className="py-2.5 px-4 text-gray-700 hover:bg-red-50 rounded-lg cursor-pointer transition-all font-medium border-l-4 border-transparent hover:border-[#941007]"
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

        {/* Social Media Icons */}
        <div className="p-4 border-t border-gray-100 flex flex-col items-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Follow Us</p>
          <div className="flex items-center justify-center gap-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#941007] hover:bg-[#941007] hover:text-white transition-all">
              <FaFacebookF size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#941007] hover:bg-[#941007] hover:text-white transition-all">
              <FaInstagram size={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#941007] hover:bg-[#941007] hover:text-white transition-all">
              <FaYoutube size={20} />
            </a>
            <a href="https://wa.me/919990555161" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#941007] hover:bg-[#941007] hover:text-white transition-all">
              <FaWhatsapp size={20} />
            </a>
          </div>
        </div>

        {/* Login/Logout Button */}
        <div className="sticky bottom-0  bg-white border-t border-gray-200 p-4 shadow-lg">
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
            className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${isLoggedIn
              ? 'bg-[#941007] hover:bg-[#941007]'
              : 'bg-[#941007] hover:bg-[#941007]'
              }`}
          >
            {isLoggedIn ? (
              <>
                <span className="text-white bg-[#941007] text-[20px]"><MdLockOutline /></span>
                <p> LOG OUT</p>
              </>
            ) : (
              <>
                <span className="text-white bg-[#941007] text-[20px]"><MdLockOutline /></span>
                <p> LOG IN</p>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Overlay */}
      {!hide && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-md z-[9998] md:hidden"
          onClick={() => setHide(true)}
        />
      )}

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-xl z-[10000] md:hidden flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 flex items-center gap-3">
            <button
              onClick={() => {
                setShowMobileSearch(false);
                setSearchProduct('');
              }}
              className="text-gray-700 hover:text-gray-900 "
            >
              <span className="text-4xl">←</span>
            </button>
            <input
              type="search"
              placeholder="Search products..."
              className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#941007]"
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
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#941007] mb-2"></div>
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
                  <p className="text-sm text-gray-600">Found <span className="text-[#941007] font-semibold">{searchProductData.length}</span></p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {searchProductData.slice(0, 6).map((item, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setShowMobileSearch(false);
                        setSearchProduct('');
                        const productId = item.id || item.sno || item.product_id || item.detail_id;
                        navigate(`/product-details/${productId}`);
                      }}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg hover:border-[#941007] transition-all flex flex-col"
                    >
                      {/* Product Image */}
                      <div className="w-full aspect-square  flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                        <img
                          src={item.image || item.product_images || '/asset/images/dummy-image-square.webp'}
                          onError={(e) => {
                            e.target.src = '/asset/images/dummy-image-square.webp';
                          }}
                          alt={item.name || item.product_name || 'Product'}
                          className="w-full h-full object-contain p-2"
                        />
                        {item.discount && (
                          <div className="absolute top-1 right-1 bg-[#941007] text-white text-xs font-bold px-1.5 py-0.5 rounded">
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
                          <p className="text-sm font-bold text-[#941007]">
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
      <nav className="px-2 py-1.5 md:px-16 md:pt-5 bg-[#FAFAFC]/80 backdrop-blur-md sticky top-0 z-[1000] border-b border-gray-200/50">
        {/* ---------------------first nav bar--------------------- */}
        <div className="flex  items-center justify-between  w-full h-16">
          <div className="flex w-full space-x-5   md:w-[60%]">
            <div className="hidden md:block mb-4">
              <Link to={"/"}>
                {" "}
                <img
                  src={newLogo}
                  alt="Summit"
                  className="md:w-24 object-contain"
                />
              </Link>
            </div>

            <div className="md:hidden flex justify-between w-full">
              <div>
                <Link to={"/"}>
                  <img src={newLogo} alt="Summit" className="w-16 object-contain" />
                </Link>
              </div>
              <div className="flex items-center  space-x-4">
                <button
                  onClick={() => setShowMobileSearch(true)}
                  className="bg-[#F1F1F1] rounded-full text-black p-2 w-10 h-10 flex items-center justify-center"
                >
                  <MdSearch className="w-6 h-6" />
                </button>
                <span className="relative">
                  <Link
                    to={"/cart"}
                    className="relative bg-[#F1F1F1] rounded-full p-2 text-gray-950 font-normal"
                  >
                    <ShoppingCartOutlinedIcon className="" />
                    {totalItems > 0 && (
                      <div className="text-white bg-[#941007] text-xs absolute top-0 right-0 rounded-full px-1">
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
            <div ref={searchContainerRef} className="hidden md:relative md:flex items-center justify-center w-full">
              {/* Search Icon */}
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-lg">
                <FiSearch />
              </span>

              {/* Search Input */}
              <input
                type="search"
                placeholder="Search for products"
                className="bg-white rounded-full w-full py-2 pl-10 pr-4 text-sm placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#941007]"
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
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#941007] mb-2"></div>
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
                          <span className="text-[#941007]">
                            {searchProductData.length}
                          </span>{" "}
                          results
                        </p>
                        <button
                          className="text-sm text-[#941007] hover:text-[#941007] font-semibold hover:underline"
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
                            to={`/product-details/${item.id || item.sno || item.product_id || item.detail_id}`}
                            onClick={() => setSearchProduct("")}
                            className="block group"
                          >
                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-200 hover:border-[#941007] flex flex-col h-full">

                              {/* Image */}
                              <div className="relative w-full h-44  flex items-center justify-center">
                                <img
                                  src={getProductImage(item)}
                                  alt={item.name || "Product"}
                                  className="w-full h-full object-contain p-3"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/asset/images/dummy-image-square.webp";
                                  }}
                                />

                              </div>

                              {/* Details */}
                              <div className="p-3 flex flex-col flex-grow">
                                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#941007]">
                                  {item.name || item.product_name || "Product"}
                                </h3>

                                <p className="text-xs text-gray-600 line-clamp-2 mb-3 flex-grow">
                                  {item.description ||
                                    item.product_description ||
                                    "Quality product for your kitchen"}
                                </p>

                                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                                  <p className="text-base font-bold text-[#941007]">
                                    ₹
                                    {item.price ||
                                      item.product_price ||
                                      item.mrp ||
                                      "N/A"}
                                  </p>
                                </div>

                                <p className="text-xs text-[#941007] font-semibold mt-2">
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
            {/* <Link
              to={"/Wishlist"}
              className=" rounded-full p-2.5 text-gray-950 font-normal"
            >
             <FaRandom />
            </Link> */}
            {/* <div className="border-l border-[#BEBEBE] h-6"></div> */}
            {/* <Link
              to={"/Wishlist"}
              className="bg-[#F1F1F1] rounded-full p-2.5 text-gray-950 font-normal"
            >
              <FaRegHeart />
            </Link> */}
            {/* <div className="border-l border-[#BEBEBE] h-6"></div> */}

            <Link
              to={"/trackShipment"}
              className="bg-[#F1F1F1] text-sm px-4 py-2 text-center rounded-full"
            >
              Track Shipment
            </Link>
            <Link
              to={"/wishlist"}
              className="relative bg-[#F1F1F1] rounded-full p-2 text-gray-950 font-normal hover:bg-gray-200 transition-colors"
            >
              <FaRegHeart size={20} />
              {wishlist.length > 0 && (
                <div className="text-white bg-[#941007] text-[10px] absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {wishlist.length}
                </div>
              )}
            </Link>
            <Link
              to={"/Cart"}
              className="relative bg-[#F1F1F1] rounded-full p-2 text-gray-950 font-normal"
            >
              <ShoppingCartOutlinedIcon className="" />
              {totalItems > 0 && (
                <div className="text-white bg-[#941007] text-xs absolute top-0 right-0 rounded-full px-1">
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
