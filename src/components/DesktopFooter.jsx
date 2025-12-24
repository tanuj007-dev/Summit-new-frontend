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
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { ToastContainer, toast } from "react-toastify";

// Helper function to convert footer link text to search-friendly format
const convertToSearchTerm = (text) => {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

const DesktopFooter = () => {
  const [footerData, setFooterData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/")
      .then((res) => setFooterData(res.data || []))
      .catch((err) => console.error("Footer menu fetch error:", err));
  }, []);

  // Function to handle footer link clicks with API integration
  const handleFooterLinkClick = async (searchTerm, category) => {
    try {
      console.log('Testing search term:', searchTerm);
      
      // Try multiple search term variations to find one that works
      const searchVariations = [
        searchTerm,
        searchTerm.replace(/\s+/g, ' ').toLowerCase(),
        searchTerm.split(' ')[0], // Try just the first word
        searchTerm.replace(/\s+/g, ''), // Try without spaces
        searchTerm.replace(/cooker$/, ''), // Try without 'cooker'
        searchTerm.replace(/pressure cooker$/, 'pressure'), // Try just 'pressure'
      ];
      
      let products = [];
      let workingSearchTerm = '';
      
      for (const term of searchVariations) {
        console.log('Trying search term:', term);
        try {
          const response = await axiosInstance.get('/api/products/view', {
            params: { search: term }
          });
          
          const responseData = response.data?.data || response.data || [];
          if (responseData.length > 0) {
            products = responseData;
            workingSearchTerm = term;
            console.log('Found products with term:', term, 'Count:', products.length);
            break;
          }
        } catch (error) {
          console.log('Search failed for term:', term, error);
          continue;
        }
      }
      
      if (products.length > 0) {
        // Navigate to ProductGrid with the search term
        const categoryPath = convertToSearchTerm(category);
        navigate(`/products/${categoryPath}`, { 
          state: { 
            searchResults: products,
            searchTerm: workingSearchTerm 
          }
        });
      } else {
        toast.info(`No products found for "${searchTerm}". Tried variations: ${searchVariations.join(', ')}`);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products. Please try again.");
    }
  };

  return (
    <footer className="hidden md:block">
      <div className="relative flex flex-wrap md:flex-nowrap space-x-0 md:space-x-25 bg-[url('/asset/images/FooterMountains.png')] md:bg-[length:100%_100%] bg-center bg-no-repeat h-[70vh] px-16 py-12 overflow-hidden">
        <div>
          <img
            src="/asset/images/Logo.png"
            alt=""
            className="w-30"
          />
        </div>
        <div className="flex md:justify-between break-words sm:space-x-0 mt-5 w-full">
          <div className="text-white break-words max-w-xs">
            <h1 className="text-[18px] font-semibold">Contact Us</h1>
            <div className="text-[15px] space-x-3 space-y-3 mt-4">
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
            <h1 className=" text-[18px] font-semibold">Useful Links</h1>
            <ul className="text-[15px] space-y-2 mt-4">
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
          {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none"></div> */}
          
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
          <div className="text-white break-words">
  <h3 className="font-bold text-[18px] mb-2">Pressure Cooker</h3>
  <ul className="space-y-1 text-[14px]">
    <li><button onClick={() => handleFooterLinkClick('inner lid', 'pressure-cooker')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Inner Lid Pressure Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('outer lid', 'pressure-cooker')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Outer Lid Pressure Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('clip on', 'pressure-cooker')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Clip On/Flip On Pressure Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('hard anodised', 'pressure-cooker')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Hard Anodised Pressure Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('stainless steel', 'pressure-cooker')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Stainless Steel Pressure Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('aluminium', 'pressure-cooker')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Aluminium Pressure Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('triply', 'pressure-cooker')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Triply Pressure Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('2 litre', 'pressure-cooker')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">2 Litre Pressure Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('3 litre', 'pressure-cooker')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">3 Litre Pressure Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('5 litre', 'pressure-cooker')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">5 Litre Pressure Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('5.5 litre', 'pressure-cooker')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">5.5 Litre and Above Pressure Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('straight', 'pressure-cooker')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Straight Pressure Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('handi', 'pressure-cooker')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Handi Pressure Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('pan', 'pressure-cooker')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Pan Pressure Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('pressure', 'pressure-cooker')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Pressure Cooker Collections</button></li>
  </ul>
</div>

          {/* 2 col */}
             <div>
  <h3 className="font-semibold text-[18px] mb-2">Cookware</h3>
  <ul className="space-y-1 text-[14px]">
    <li><button onClick={() => handleFooterLinkClick('non-stick', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Non-Stick Cookware</button></li>
    <li><button onClick={() => handleFooterLinkClick('ceramic', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Ceramic Non-Stick Cookware</button></li>
    <li><button onClick={() => handleFooterLinkClick('triply', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Triply Cookware</button></li>
    <li><button onClick={() => handleFooterLinkClick('hard anodised', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Hard Anodised Cookware</button></li>
    <li><button onClick={() => handleFooterLinkClick('stainless steel', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Stainless Steel Cookware</button></li>
    <li><button onClick={() => handleFooterLinkClick('cast iron', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Cast Iron Cookware</button></li>
    <li><button onClick={() => handleFooterLinkClick('dosa tawa', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Dosa Tawa</button></li>
    <li><button onClick={() => handleFooterLinkClick('roti tawa', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Roti Tawa</button></li>
    <li><button onClick={() => handleFooterLinkClick('frying pan', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Frying Pan</button></li>
    <li><button onClick={() => handleFooterLinkClick('kadai', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Kadai</button></li>
    <li><button onClick={() => handleFooterLinkClick('casserole', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Casserole</button></li>
    <li><button onClick={() => handleFooterLinkClick('idli maker', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Idli Maker</button></li>
    <li><button onClick={() => handleFooterLinkClick('paniyarakkal', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Paniyarakkal</button></li>
    <li><button onClick={() => handleFooterLinkClick('grill pan', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Grill Pan</button></li>
    <li><button onClick={() => handleFooterLinkClick('tadka pan', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Tadka Pan</button></li>
    <li><button onClick={() => handleFooterLinkClick('appachetty', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Appachetty</button></li>
    <li><button onClick={() => handleFooterLinkClick('deep pot', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Deep Pot</button></li>
    <li><button onClick={() => handleFooterLinkClick('biryani pot', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Biryani Pot</button></li>
    <li><button onClick={() => handleFooterLinkClick('milk pan', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Milk Pan</button></li>
    <li><button onClick={() => handleFooterLinkClick('sauce pans', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Sauce Pans</button></li>
    <li><button onClick={() => handleFooterLinkClick('induction', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Induction Base Cookware</button></li>
    <li><button onClick={() => handleFooterLinkClick('non-induction', 'cookware')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Non-Induction Base Cookware</button></li>
  </ul>
</div>
  <div>
  <h3 className="font-semibold text-[18px] mb-2">Kitchen Appliances</h3>
  <ul className="space-y-1 text-[14px]">
    <li><button onClick={() => handleFooterLinkClick('gas stove', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Gas Stove</button></li>
    <li><button onClick={() => handleFooterLinkClick('stainless steel', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Stainless Steel Gas Stove</button></li>
    <li><button onClick={() => handleFooterLinkClick('glass top', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Glass Top Gas Stove</button></li>
    <li><button onClick={() => handleFooterLinkClick('convertible hob', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Convertible Hob Gas Stove</button></li>
    <li><button onClick={() => handleFooterLinkClick('combination hob', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Combination Hob Gas Stove</button></li>
    <li><button onClick={() => handleFooterLinkClick('2 burner', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">2 Burner Gas Stove</button></li>
    <li><button onClick={() => handleFooterLinkClick('3 burner', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">3 Burner Gas Stove</button></li>
    <li><button onClick={() => handleFooterLinkClick('4 burner', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">4 Burner Gas Stove</button></li>
    <li><button onClick={() => handleFooterLinkClick('5 burner', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">5 Burner Gas Stove</button></li>
    <li><button onClick={() => handleFooterLinkClick('svachh', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Svachh Gas Stove</button></li>
    <li><button onClick={() => handleFooterLinkClick('non-svachh', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Non-Svachh Gas Stove</button></li>
    <li><button onClick={() => handleFooterLinkClick('cooktop', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Cooktop</button></li>
    <li><button onClick={() => handleFooterLinkClick('induction', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Induction Cooktop</button></li>
    <li><button onClick={() => handleFooterLinkClick('infrared', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Infrared Cooktop</button></li>
    <li><button onClick={() => handleFooterLinkClick('cooktop', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Cooktop Collections</button></li>
    <li><button onClick={() => handleFooterLinkClick('1200 watt', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">1200 Watt Cooktop</button></li>
    <li><button onClick={() => handleFooterLinkClick('1200 watt', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">1200 Watt to 1500 Watt Cooktop</button></li>
    <li><button onClick={() => handleFooterLinkClick('1600 watt', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">1600 Watt to 1800 Watt Cooktop</button></li>
    <li><button onClick={() => handleFooterLinkClick('1900 watt', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">1900 Watt to 2000 Watt Cooktop</button></li>
    <li><button onClick={() => handleFooterLinkClick('2000 watt', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">2000 Watt and Above Cooktop</button></li>
    <li><button onClick={() => handleFooterLinkClick('rice cooker', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Rice Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('open type', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Open Type Rice Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('close type', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Close Type Rice Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('0.4 litre', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">0.4 Litre to 0.6 Litre Rice Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('0.7 litre', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">0.7 Litre to 1 Litre Rice Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('1.1 litre', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">1.1 Litre to 1.8 Litre Rice Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('2 litre', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">2 Litre to 4.2 Litre Rice Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('stainless steel', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Stainless Steel Rice Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('aluminium', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Aluminium Rice Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('triply', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Triply Rice Cooker</button></li>
    <li><button onClick={() => handleFooterLinkClick('otg oven', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">OTG Oven</button></li>
    <li><button onClick={() => handleFooterLinkClick('air fryer', 'kitchen-appliances')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Air Fryer</button></li>
  </ul>
</div> 

 {/* 4 col */}

   <div>
  <h3 className="font-semibold text-[18px] mb-2">Food Preparation Appliances</h3>
  <ul className="space-y-1 text-[14px]">
    <li><button onClick={() => handleFooterLinkClick('mixer grinder', 'food-preparation')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Mixer Grinder</button></li>
    <li><button onClick={() => handleFooterLinkClick('mixer grinder', 'food-preparation')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Mixer Grinder Collections</button></li>
    <li><button onClick={() => handleFooterLinkClick('juicer mixer', 'food-preparation')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Juicer Mixer Grinder</button></li>
    <li><button onClick={() => handleFooterLinkClick('food processor', 'food-preparation')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Food Processor</button></li>
    <li><button onClick={() => handleFooterLinkClick('500 watt', 'food-preparation')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">500 Watt to 550 Watt Mixer Grinder</button></li>
    <li><button onClick={() => handleFooterLinkClick('750 watt', 'food-preparation')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">750 Watt Mixer Grinder</button></li>
    <li><button onClick={() => handleFooterLinkClick('1000 watt', 'food-preparation')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">1000 Watt Mixer Grinder</button></li>
    <li><button onClick={() => handleFooterLinkClick('2 to 3 jars', 'food-preparation')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">2 to 3 Jars Mixer Grinder</button></li>
    <li><button onClick={() => handleFooterLinkClick('4 jars', 'food-preparation')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">4 Jars Mixer Grinder</button></li>
    <li><button onClick={() => handleFooterLinkClick('5 jars', 'food-preparation')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">5 Jars Mixer Grinder</button></li>
    <li><button onClick={() => handleFooterLinkClick('6 jars', 'food-preparation')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">6 Jars Mixer Grinder</button></li>
    <li><button onClick={() => handleFooterLinkClick('6+ jars', 'food-preparation')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">6+ Jars Mixer Grinder</button></li>
    <li><button onClick={() => handleFooterLinkClick('wet grinder', 'food-preparation')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Wet Grinder</button></li>
    <li><button onClick={() => handleFooterLinkClick('hand blender', 'food-preparation')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Hand Blender</button></li>
    <li><button onClick={() => handleFooterLinkClick('hand mixer', 'food-preparation')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Hand Mixer</button></li>
    <li><button onClick={() => handleFooterLinkClick('electric chopper', 'food-preparation')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Electric Chopper</button></li>
    <li><button onClick={() => handleFooterLinkClick('grain grinder', 'food-preparation')} className="hover:underline text-left text-white bg-transparent border-none cursor-pointer">Grain Grinder</button></li>
  </ul>
</div>
        </div>
      </div>
        <div className="">
              <div className=" px-4 md:px-16 bg-gray-800 text-white ">
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
