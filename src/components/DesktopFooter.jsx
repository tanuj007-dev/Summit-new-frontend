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

const DesktopFooter = () => {
  const [footerData, setFooterData] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/getFooterMenu.php")
      .then((res) => setFooterData(res.data || []))
      .catch((err) => console.error("Footer menu fetch error:", err));
  }, []);

  return (
    <footer className="hidden md:block">
      <div className="relative flex flex-wrap md:flex-nowrap space-x-0 md:space-x-32 bg-[url('/asset/images/FooterMountains.png')] md:bg-[length:100%_100%] bg-center bg-no-repeat h-[80vh] px-16 py-12 overflow-hidden">
        <div>
          <img
            src="/asset/images/Logo.png"
            alt=""
            className="w-24"
          />
        </div>
        <div className="flex md:justify-between break-words sm:space-x-0 mt-5 w-full">
          <div className="text-white break-words max-w-xs">
            <h1 className="font-semibold">Contact Us</h1>
            <div className="text-sm space-x-3 space-y-3 mt-4">
              <p className="flex items-center gap-1">
                {" "}
                <a href="">
                  <FiPhoneCall />
                </a>
                1800 419 6048
              </p>
              <p className="flex items-center gap-1">
                {" "}
                <a href="">
                  <FaEnvelope />
                </a>
                customercare@summithomeappliance.com
              </p>
              <p className="flex gap-1">
                {" "}
                <a href="">
                  <FaMapMarkerAlt className="mt-1" />
                </a>
                B-36 Krishna Vihar Loni <br />
                Ghaziabad-201102 UP <br />
                (INDIA)
              </p>
            </div>
          </div>
          <div className="text-white order-1 md:order-2 -mt-6 md:mt-0">
            <h1 className="font-semibold">Useful Links</h1>
            <ul className="text-sm space-y-2 mt-4">
              <li>
                <Link to="/blogs">Blogs</Link>
              </li>
              <li><Link to='/about'>About Us</Link> </li>
              <li>
                {" "}
                <Link to="/shipping-policy">Shipping Policy</Link>{" "}
              </li>
              <li>
                {" "}
                <Link to="/privacy-policy">Privacy & Policy</Link>{" "}
              </li>
              <li>
                {" "}
                <Link to="/terms-conditions">Terms & Conditions</Link>{" "}
              </li>
              <li>
                {" "}
                <Link to="/refund-policy">Return & Refund Policy</Link>{" "}
              </li>
            </ul>
          </div>
          
          {/* Dark shadow from bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none"></div>
          
        </div>
      </div>
      
      {/* links and tags */}
      <div className="relative flex flex-wrap md:flex-nowrap h-[120vh] px-16 py-12 overflow-hidden">
        {/* Blurred Background Image */}
        <div className="absolute inset-0">
          <img
            src="/asset/images/FooterMountains.png"
            alt="Background"
            className="w-full h-full object-cover blur-2xl scale-110"
          />
        </div>

        {/* Optional dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative text-white grid grid-cols-4 gap-12 mx-auto text-sm px-4">
          {/* Footer content sections */}
        </div>
      </div>
    </footer>
  );
};

export default DesktopFooter;
