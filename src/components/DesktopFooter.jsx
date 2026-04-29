import React, { useEffect, useState } from "react";
import { FiPhoneCall } from "react-icons/fi";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { ToastContainer } from "react-toastify";
import deskFooterBg from "./assets/deskfooter.png";

// Helper function to convert footer link text to search-friendly format
const convertToSearchTerm = (text) => {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// Build product listing URL for footer links (shareable, works on new tab/refresh)
const getProductLink = (searchTerm, category) => {
  const categoryPath = convertToSearchTerm(category);
  const search = encodeURIComponent(searchTerm);
  return `/products/${categoryPath}?search=${search}`;
};

const DesktopFooter = () => {
  const [footerData, setFooterData] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/")
      .then((res) => {
        const data = res?.data;
        setFooterData(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Footer menu fetch error:", err));
  }, []);

  return (
    <footer className="hidden md:block">
      <div
        className="relative flex flex-wrap md:flex-nowrap space-x-0 md:space-x-25 md:bg-[length:100%_100%] bg-center bg-no-repeat h-[53vh] px-16 py-12 overflow-hidden bg-cover"
        style={{ backgroundImage: `url("${deskFooterBg}")` }}
      >
        {/* Dark gradient overlay from left to right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none"></div>

        {/* Content on top of overlay */}
        <div className="relative z-10 flex break-words sm:space-x-0 mt-5 w-full items-start">
          {/* Useful Links shifted to Left */}
          <div className="text-white order-1">
            <h1 className="text-[18px] font-semibold">Useful Links</h1>
            <ul className="text-[15px] space-y-2 mt-4">
              <li>
                <Link to="/blogs">Blogs</Link>
              </li>
              <li><Link to='/about'>About Us</Link> </li>
              <li>
                <Link to="/shipping-policy">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy & Policy</Link>
              </li>
              <li>
                <Link to="/terms-conditions">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/refund-policy">Return & Refund Policy</Link>
              </li>
              <li>
                <Link to="/grievance-redressal">Grievance Redressal</Link>
              </li>
            </ul>
          </div>

          {/* Contact Us in Middle */}
          <div className="text-white break-words max-w-xs order-2">
            <h1 className="text-[18px] font-semibold text-center md:text-left">Contact Us</h1>
            <div className="text-[15px] space-x-3 space-y-3 mt-4">
              <p className="flex items-center gap-2">
                <a href="">
                  <FiPhoneCall />
                </a>
                1800 419 6048
              </p>
              <p className="flex items-center gap-2">
                <a href="">
                  <FaEnvelope />
                </a>
                customercare@summithomeappliance.com
              </p>
              <p className="flex gap-2">
                <a href="">
                  <FaMapMarkerAlt className="mt-1" />
                </a>
                B-36 Krishna Vihar Loni <br />
                Ghaziabad-201102 UP <br />
                (INDIA)
              </p>
            </div>
          </div>

          {/* Logo shifted to bottom Right with extra nudge (shifted up slightly) */}

        </div>
      </div>

      {/* links and tags */}
      <div className="relative flex flex-wrap md:flex-nowrap h-full px-16 py-12 overflow-hidden">
        {/* Blurred Background Image */}
        <div className="absolute inset-0">
          <img
            src={deskFooterBg}
            alt="Background"
            className="w-full h-full object-cover blur-2xl scale-110"
          />
        </div>

        {/* Optional dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative text-white grid grid-cols-4 gap-12 mx-auto text-sm px-4">
          {/* Footer content sections */}
          <div className="text-white break-words">
            <h3 className="font-bold text-[18px] mb-2">Pressure Cooker</h3>
            <ul className="space-y-1 text-[14px]">
              <li><Link to={getProductLink('inner lid', 'pressure-cooker')} className="hover:underline text-left text-white">Inner Lid Pressure Cooker</Link></li>
              <li><Link to={getProductLink('outer lid', 'pressure-cooker')} className="hover:underline text-left text-white">Outer Lid Pressure Cooker</Link></li>
              <li><Link to={getProductLink('blacko', 'pressure-cooker')} className="hover:underline text-left text-white">Blacko Series Hard Anodised Pressure Cooker</Link></li>
              <li><Link to={getProductLink('desire', 'pressure-cooker')} className="hover:underline text-left text-white">Desire Series Stainless Steel Pressure Cooker</Link></li>
              <li><Link to={getProductLink('aluminium', 'pressure-cooker')} className="hover:underline text-left text-white">Aluminium Pressure Cooker</Link></li>
              <li><Link to={getProductLink('elite', 'pressure-cooker')} className="hover:underline text-left text-white">Elite Triply Pressure Cooker</Link></li>
              <li><Link to={getProductLink('2 litres', 'pressure-cooker')} className="hover:underline text-left text-white">2 Litres Pressure Cooker</Link></li>
              <li><Link to={getProductLink('3 litres', 'pressure-cooker')} className="hover:underline text-left text-white">3 Litres Pressure Cooker</Link></li>
              <li><Link to={getProductLink('5 litres', 'pressure-cooker')} className="hover:underline text-left text-white">5 Litres Pressure Cooker</Link></li>
              <li><Link to={getProductLink('5.5 litres', 'pressure-cooker')} className="hover:underline text-left text-white">5.5 Litres and Above Pressure Cooker</Link></li>
              <li><Link to={getProductLink('plain', 'pressure-cooker')} className="hover:underline text-left text-white">Plain Shape Pressure Cooker</Link></li>
              <li><Link to={getProductLink('handi', 'pressure-cooker')} className="hover:underline text-left text-white">Handi Shape Pressure Cooker</Link></li>
              <li><Link to={getProductLink('c-tura', 'pressure-cooker')} className="hover:underline text-left text-white">C-tura Shape Pressure Cooker</Link></li>
              <li><Link to={getProductLink('pan', 'pressure-cooker')} className="hover:underline text-left text-white">Pan Shape Pressure Cooker</Link></li>
              <li><Link to={getProductLink('ultimate', 'pressure-cooker')} className="hover:underline text-left text-white">Ultimate Series Jumbo Size Pressure Cooker</Link></li>
              <li><Link to={getProductLink('induction', 'pressure-cooker')} className="hover:underline text-left text-white">Induction Bottom Pressure Cooker</Link></li>
              <li><Link to={getProductLink('combi-pack', 'pressure-cooker')} className="hover:underline text-left text-white">Combi-Pack Pressure Cooker</Link></li>
            </ul>
          </div>

          {/* 2 col */}
          <div>
            <h3 className="font-semibold text-[18px] mb-2">Cookware</h3>
            <ul className="space-y-1 text-[14px]">
              <li><Link to={getProductLink('non-stick', 'cookware')} className="hover:underline text-left text-white">Non-Stick Cookware</Link></li>
              <li><Link to={getProductLink('honeycomb', 'cookware')} className="hover:underline text-left text-white">Honeycomb Cookware</Link></li>
              <li><Link to={getProductLink('triply', 'cookware')} className="hover:underline text-left text-white">Triply Cookware</Link></li>
              <li><Link to={getProductLink('sauce pans', 'cookware')} className="hover:underline text-left text-white">Sauce Pans</Link></li>
              <li><Link to={getProductLink('induction', 'cookware')} className="hover:underline text-left text-white">Induction Bottom Cookware</Link></li>
              <li><Link to={getProductLink('non-induction', 'cookware')} className="hover:underline text-left text-white">Non-Induction Bottom Cookware</Link></li>
              <li><Link to={getProductLink('dosa tawa', 'cookware')} className="hover:underline text-left text-white">Dosa Tawa</Link></li>
              <li><Link to={getProductLink('roti tawa', 'cookware')} className="hover:underline text-left text-white">Roti Tawa</Link></li>
              <li><Link to={getProductLink('frying pan', 'cookware')} className="hover:underline text-left text-white">Frying Pan</Link></li>
              <li><Link to={getProductLink('kadai', 'cookware')} className="hover:underline text-left text-white">Kadai</Link></li>
              <li><Link to={getProductLink('edge tawa', 'cookware')} className="hover:underline text-left text-white">Edge Tawa</Link></li>
              <li><Link to={getProductLink('idli cooker', 'cookware')} className="hover:underline text-left text-white">Aluminium Idli Cooker</Link></li>
              <li><Link to={getProductLink('multi kadai', 'cookware')} className="hover:underline text-left text-white">Aluminium Multi Kadai</Link></li>
              <li><Link to={getProductLink('glass lid', 'cookware')} className="hover:underline text-left text-white">Cookware with Glass Lid</Link></li>
              <li><Link to={getProductLink('tadka pan', 'cookware')} className="hover:underline text-left text-white">Tadka Pan</Link></li>
              <li><Link to={getProductLink('appampatra', 'cookware')} className="hover:underline text-left text-white">Appampatra</Link></li>
              <li><Link to={getProductLink('steel lid', 'cookware')} className="hover:underline text-left text-white">Cookware with Steel Lid</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[18px] mb-2">Kitchen Appliances</h3>
            <ul className="space-y-1 text-[14px]">
              <li><Link to={getProductLink('gas stove', 'kitchen-appliances')} className="hover:underline text-left text-white">Gas Stove</Link></li>
              <li><Link to={getProductLink('stainless steel', 'kitchen-appliances')} className="hover:underline text-left text-white">Stainless Steel Gas Stove</Link></li>
              <li><Link to={getProductLink('glass top', 'kitchen-appliances')} className="hover:underline text-left text-white">Glass Top Gas Stove</Link></li>
              <li><Link to={getProductLink('mixer grinder', 'kitchen-appliances')} className="hover:underline text-left text-white">Mixer Grinder</Link></li>
              <li><Link to={getProductLink('mixer grinder', 'kitchen-appliances')} className="hover:underline text-left text-white">Mixer Grinder Collections</Link></li>
              <li><Link to={getProductLink('2 burner', 'kitchen-appliances')} className="hover:underline text-left text-white">2 Burner Gas Stove</Link></li>
              <li><Link to={getProductLink('3 burner', 'kitchen-appliances')} className="hover:underline text-left text-white">3 Burner Gas Stove</Link></li>
              <li><Link to={getProductLink('750 watt', 'kitchen-appliances')} className="hover:underline text-left text-white">750 Watt Mixer Grinder</Link></li>
              <li><Link to={getProductLink('1000 watt', 'kitchen-appliances')} className="hover:underline text-left text-white">1000 Watt Mixer Grinder</Link></li>
              <li><Link to={getProductLink('3 jars', 'kitchen-appliances')} className="hover:underline text-left text-white">3 Jars Mixer Grinder</Link></li>
              <li><Link to={getProductLink('4 jars', 'kitchen-appliances')} className="hover:underline text-left text-white">4 Jars Mixer Grinder</Link></li>
              <li><Link to={getProductLink('5 jars', 'kitchen-appliances')} className="hover:underline text-left text-white">5 Jars Mixer Grinder</Link></li>
              <li><Link to={getProductLink('oval shape', 'kitchen-appliances')} className="hover:underline text-left text-white">Oval Shape Stainless Steel Gas Stove</Link></li>
              <li><Link to={getProductLink('450 watt', 'kitchen-appliances')} className="hover:underline text-left text-white">450 Watt Mixer Grinder</Link></li>
              <li><Link to={getProductLink('4 burner', 'kitchen-appliances')} className="hover:underline text-left text-white">4 Burner Gas Stove</Link></li>
              <li><Link to={getProductLink('induction', 'kitchen-appliances')} className="hover:underline text-left text-white">Induction Cooktop</Link></li>
              <li><Link to={getProductLink('hobb type', 'kitchen-appliances')} className="hover:underline text-left text-white">Hobb Type Glass Top Gas Stove</Link></li>
              <li><Link to={getProductLink('gas tandoor', 'kitchen-appliances')} className="hover:underline text-left text-white">Gas Tandoor</Link></li>
            </ul>
          </div>

          {/* 4 col - Customer Support */}
          <div>
            <h3 className="font-semibold text-[18px] mb-2">Customer Support</h3>
            <ul className="space-y-1 text-[14px]">
              <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link to="/trackShipment" className="hover:underline">Track Order</Link></li>
              <li><Link to="/refund-policy" className="hover:underline">Return & Refund Policy</Link></li>
              <li><Link to="/shipping-policy" className="hover:underline">Shipping Policy</Link></li>
              <li><Link to="/grievance-redressal" className="hover:underline">Grievance Redressal</Link></li>
              <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:underline">Terms & Conditions</Link></li>
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
            </ul>
          </div>


        </div>
      </div>
      <div className="">
        <div className=" px-4 md:px-16 bg-[#941007] text-white ">
          {/* <div className="flex text-[0.7rem] md:text-xs px-1 md:px-16 justify-between md:pb-2 pb-6 pt-6 ">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs md:text-sm">
                {(Array.isArray(footerData) ? footerData : []).slice(0, 4).map((main) => (
                  <div key={main.id}>
                    <h2 className="text-sm font-semibold ">
                      <Link
                          to={`/products/${main.id}`}
                          className="hover:underline"
                        > 
                        {main.name}
                        </Link>
                      </h2>
                    {main.sub_categories?.map((sub) => (
                      <>
                        <p className="font-medium text-white">
                          <Link
                            to={`/products/${main.id}/${sub.id}`}
                            className="hover:underline"
                          > 
                          {sub.name}
                        </Link>
                        </p>
                        {sub.series?.map((ser) => (
                          <>
                            <p className="text-gray-200"> 
                              <Link
                                    to={`/products/${main.id}/${sub.id}/${ser.id}`}
                                    className="hover:underline"
                                  >
                                    {ser.name} {sub.name}
                                    
                                  </Link>
                                  </p>
                            <ul className="md:space-y-1 space-y-0.5">
                              {ser.options?.map((opt) => (
                                <li key={opt.id}>
                                  <Link
                                    to={`/products/${main.id}/${sub.id}/${ser.id}/${opt.id}`}
                                    className="hover:underline"
                                  >
                                    {opt.name} {ser.name} {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </>
                         
                        ))}
                      </>
                    ))}
                  </div>
                ))}
              </div>
            </div> */}


          <div className="flex justify-between md:px-16 text-white   py-2  items-center">
            <div className="text-[14px]">
              Vardhman Industries ©{new Date().getFullYear()} | All rights
              reserved | Digital Partner Performdigi Monetize Pvt. Ltd.
            </div>
            <div className="text-[0.5rem] md:text-xs flex space-x-4 ">
              <Link
                to={"https://www.instagram.com/summit_home_appliances/?hl=en"}
              >
                {" "}
                <FaInstagram size={18} />
              </Link>
              <Link to={"https://www.facebook.com/summithomeappliance/"}>
                {" "}
                <FaFacebook size={18} />
              </Link>
              <Link to={"https://www.youtube.com/@summithomeappliance/shorts"}>
                {" "}
                <FaYoutube size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </footer>
  );
};

export default DesktopFooter;
