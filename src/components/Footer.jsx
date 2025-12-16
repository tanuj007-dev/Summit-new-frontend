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

const Footer = () => {
  const [footerData, setFooterData] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/getFooterMenu.php")
      .then((res) => setFooterData(res.data || []))
      .catch((err) => console.error("Footer menu fetch error:", err));
  }, []);
  return (
    <footer>
      <div className="relative flex flex-wrap md:flex-nowrap space-x-0 md:space-x-32 bg-[url('/asset/images/FooterMountains.png')] md:bg-[length:100%_100%] bg-[length:180%_100%] bg-center bg-no-repeat h-[40%vh] md:h-[80vh] px-4 py-12 md:px-16 overflow-hidden ">
        <div>
          <img
            src="/asset/images/Logo.png"
            alt=""
            className="w-20 sm:w-24 rounded-lg"
          />
        </div>
        <div className="flex md:justify-between break-words sm:space-x-0 mt-5 w-full">
          <div className="text-white  break-words  max-w-xs">
            <h1 className="font-semibold">Contact Us</h1>
            <div className="text-[0.7rem] md:text-sm space-x-3 space-y-1 md:space-y-3 mt-4">
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
            <h1 className="font-semibold ">Useful Links</h1>
            <ul className="text-[0.7rem] md:text-sm space-y-2 mt-4">
              <li>
                <Link to="/blogs">Blogs</Link>
              </li>
              {/* <li><Link to='/about'>About Us</Link> </li> */}
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
        </div>

        <div></div>
      </div>
      {/* links and tags  */}
    <div className="relative flex flex-wrap md:flex-nowrap h-[40vh] md:h-[120vh] px-4 py-12 md:px-16 overflow-hidden">
  
  {/* 🔹 Blurred Background Image */}
  <div className="absolute inset-0">
    <img
      src="/asset/images/FooterMountains.png"
      alt="Background"
      className="w-full h-full object-cover blur-2xl scale-110"
    />
  </div>

  {/* 🔹 Optional dark overlay for better contrast */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* 🔹 Content */}
  <div className="relative text-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mx-auto text-sm px-4">
   {/* 1 col */}
   <div >
  <h3 className="font-bold mb-2">Pressure Cooker</h3>
  <ul className="space-y-1">
    <li>Inner Lid Pressure Cooker</li>
    <li>Outer Lid Pressure Cooker</li>
    <li>Clip On/Flip On Pressure Cooker</li>
    <li>Hard Anodised Pressure Cooker</li>
    <li>Stainless Steel Pressure Cooker</li>
    <li>Aluminium Pressure Cooker</li>
    <li>Triply Pressure Cooker</li>
    <li>2 Litre Pressure Cooker</li>
    <li>3 Litre Pressure Cooker</li>
    <li>5 Litre Pressure Cooker</li>
    <li>5.5 Litre and Above Pressure Cooker</li>
    <li>Straight Pressure Cooker</li>
    <li>Handi Pressure Cooker</li>
    <li>Pan Pressure Cooker</li>
    <li>Pressure Cooker Collections</li>
  </ul>
</div>

          {/* 2 col */}
             <div>
  <h3 className="font-semibold mb-2">Cookware</h3>
  <ul className="space-y-1">
    <li>Non-Stick Cookware</li>
    <li>Ceramic Non-Stick Cookware</li>
    <li>Triply Cookware</li>
    <li>Hard Anodised Cookware</li>
    <li>Stainless Steel Cookware</li>
    <li>Cast Iron Cookware</li>
    <li>Dosa Tawa</li>
    <li>Roti Tawa</li>
    <li>Frying Pan</li>
    <li>Kadai</li>
    <li>Casserole</li>
    <li>Idli Maker</li>
    <li>Paniyarakkal</li>
    <li>Grill Pan</li>
    <li>Tadka Pan</li>
    <li>Appachetty</li>
    <li>Deep Pot</li>
    <li>Biryani Pot</li>
    <li>Milk Pan</li>
    <li>Sauce Pans</li>
    <li>Induction Base Cookware</li>
    <li>Non-Induction Base Cookware</li>
  </ul>
</div>

          {/* 3 col */}

         <div>
  <h3 className="font-semibold mb-2">Kitchen Appliances</h3>
  <ul className="space-y-1">
    <li>Gas Stove</li>
    <li>Stainless Steel Gas Stove</li>
    <li>Glass Top Gas Stove</li>
    <li>Convertible Hob Gas Stove</li>
    <li>Combination Hob Gas Stove</li>
    <li>2 Burner Gas Stove</li>
    <li>3 Burner Gas Stove</li>
    <li>4 Burner Gas Stove</li>
    <li>5 Burner Gas Stove</li>
    <li>Svachh Gas Stove</li>
    <li>Non-Svachh Gas Stove</li>
    <li>Cooktop</li>
    <li>Induction Cooktop</li>
    <li>Infrared Cooktop</li>
    <li>Cooktop Collections</li>
    <li>1200 Watt Cooktop</li>
    <li>1200 Watt to 1500 Watt Cooktop</li>
    <li>1600 Watt to 1800 Watt Cooktop</li>
    <li>1900 Watt to 2000 Watt Cooktop</li>
    <li>2000 Watt and Above Cooktop</li>
    <li>Rice Cooker</li>
    <li>Open Type Rice Cooker</li>
    <li>Close Type Rice Cooker</li>
    <li>0.4 Litre to 0.6 Litre Rice Cooker</li>
    <li>0.7 Litre to 1 Litre Rice Cooker</li>
    <li>1.1 Litre to 1.8 Litre Rice Cooker</li>
    <li>2 Litre to 4.2 Litre Rice Cooker</li>
    <li>Stainless Steel Rice Cooker</li>
    <li>Aluminium Rice Cooker</li>
    <li>Triply Rice Cooker</li>
    <li>OTG Oven</li>
    <li>Air Fryer</li>
  </ul>
</div>

 {/* 4 col */}

  <div>
  <h3 className="font-semibold mb-2">Food Preparation Appliances</h3>
  <ul className="space-y-1">
    <li>Mixer Grinder</li>
    <li>Mixer Grinder Collections</li>
    <li>Juicer Mixer Grinder</li>
    <li>Food Processor</li>
    <li>500 Watt to 550 Watt Mixer Grinder</li>
    <li>750 Watt Mixer Grinder</li>
    <li>1000 Watt Mixer Grinder</li>
    <li>2 to 3 Jars Mixer Grinder</li>
    <li>4 Jars Mixer Grinder</li>
    <li>5 Jars Mixer Grinder</li>
    <li>6 Jars Mixer Grinder</li>
    <li>6+ Jars Mixer Grinder</li>
    <li>Wet Grinder</li>
    <li>Hand Blender</li>
    <li>Hand Mixer</li>
    <li>Electric Chopper</li>
    <li>Grain Grinder</li>
  </ul>
</div>

   
  </div>
</div>


      {/* ----------------Mountains end------------------ */}
      <div className="">
        <div className=" px-4 md:px-16 bg-gray-700 text-white ">
          {/* <div className="flex text-[0.7rem] md:text-xs px-1 md:px-16 justify-between md:pb-2 pb-6 pt-6 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs md:text-sm">
          {footerData.slice(0, 4).map((main) => (
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

          
          <div className="flex justify-between md:px-16 text-white px-6  py-4 md:text-xs items-center">
            <div className="text-[0.5rem] md:text-sm">
              Vardhman Industries ©{new Date().getFullYear()} | All rights
              reserved
            </div>
            <div className="text-[0.6rem] md:text-xs flex space-x-4 ">
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
      <div></div>
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

export default Footer;

// bg-[url('/asset/images/FooterMountains.png')]
