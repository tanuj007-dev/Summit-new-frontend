import React, { useContext, useEffect, useState } from "react";
import {
  FaRandom,
  FaRegUser,
  FaRegHeart,
  FaWhatsapp,
  FaChevronDown,
} from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
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
  const navigate = useNavigate();


  const searchProducts = async () => {
    try {
      const response = await axios.get(`/globalSearch.php?search=${searchProduct}`);
      if (response?.data?.length)
        setSearchProductData(response.data);
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => {
    searchProducts();
  }, [searchProduct]);




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
        className={`fixed top-0 right-0 h-full w-80 text-lg bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[9999] md:hidden overflow-hidden ${
          hide ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4 border-b">
          <button
            onClick={() => setHide(true)}
            className="text-gray-600 hover:text-gray-900 text-3xl font-light"
          >
           <RxCross1 />
          </button>
        </div>
        
        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-1">
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
                    <li className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors flex items-center justify-between">
                      <span>{item}</span>
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
                    <li className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
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
                    <li className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
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
                    <li className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                      {item}
                    </li>
                  </Link>
                );
              }
              return (
                <div key={i}>
                  <li
                    className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
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
            
            {/* Login/Logout */}
            <li
              className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
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
            >
              {isLoggedIn ? "LOG OUT" : "LOG IN"}
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Overlay */}
      {!hide && (
        <div
          
          onClick={() => setHide(true)}
        />
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
                <MdSearch  className="bg-[#F1F1F1]   rounded-full text-black p-2 w-10 h-10 " />
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
            <div className="hidden md:relative md:flex items-center justify-center w-full md:w-1/1">
              {/* Search input with icon */}
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-lg">
                <FiSearch  />
              </span>
              <input
                type="search"
                placeholder="Search for products"
                className="bg-white rounded-full w-full py-2 pl-10 pr-4 text-sm placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                onChange={(e) => setSearchProduct(e.target.value)}
              />

              {/* Search dropdown panel */}
              {searchProduct !== '' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 p-4 max-h-[400px] overflow-y-auto animate-fade-in">
                  {/* View All link */}
                  <div className="flex justify-end mb-2">
                    <button
                      className="text-sm text-red-600 hover:underline font-medium"
                      onClick={() => navigate(`/search?query=${searchProduct}`)}
                    >
                      {/* View All */}
                    </button>
                  </div>

                  {/* Products list */}
                  <div className="flex flex-wrap justify-center gap-4">
                    {searchProductData.length === 0 ? (
                      <div className="w-full flex justify-center items-center py-10">
                        <p className="text-gray-500 text-sm">No products found in this category.</p>
                      </div>
                    ) : (
                      searchProductData.map((item, i) => (
                        <div
                          key={i}
                          className="w-full sm:w-52 md:w-60 bg-gray-50 border rounded-lg p-3 shadow hover:shadow-md transition-all"
                        >
                          <Link to={`/879/DetailProduct/${item.sno}`}>
                            <img
                              src={`https://summithomeappliances.performdigimonetize.com/admin/${item.product_images}`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/asset/images/dummy-image-square.jpg'; // fallback image
                              }}
                              alt={item.product_name || 'Product Image'}
                              className="w-full h-36 object-contain rounded"
                            />

                          </Link>
                          <h3 className="text-sm font-semibold mt-2 text-center truncate">
                            {item.product_name}
                          </h3>
                          <p className="text-sm font-medium text-center text-red-700">
                            Rs. {item.product_price}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
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
