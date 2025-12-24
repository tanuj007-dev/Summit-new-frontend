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

const Footer = () => {
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
    <footer className="md:hidden">
         
      <div className="relative flex flex-wrap space-x-0 bg-[url('/asset/images/FooterMountains.png')] bg-[length:200%_100%] bg-center bg-no-repeat     min-h-fit
 px-4 py-12 overflow-hidden ">

        <div className="absolute top-4 left-4">
          <img
            src="/asset/images/Logo.png"
            alt=""
            className="w-12 "
          />
          
        </div>
          
        <div className=" gap-2 break-words mt-4 w-full">
          <div className="text-white break-words max-w-xs">
            <h1 className="font-semibold mt-4 text-[16px]">Contact Us</h1>
            <div className="text-[14px] space-x-2 space-y-1 mt-1">
              <p className="flex items-center gap-1">
                {" "}
                <a href="">
                  <FiPhoneCall />
                </a>
                1800 419 6048
              </p>
              {/* <p className="flex items-center gap-1">
                {" "}
                <a href="">
                  <FaEnvelope />
                </a>
                customercare@summithomeappliance.com
              </p> */}
              <p className="flex gap-1">
                {" "}
                <a href="">
                  <FaMapMarkerAlt className="mt-1" />
                </a>
                B-36 Krishna Vihar Loni 
                Ghaziabad-201102 UP 
                (INDIA)
              </p>
              <p className="flex items-center gap-1">
                {" "}
                <a href="">
                  <FaEnvelope />
                </a>
                customercare
                  @summithomeappliance.com
              </p>
            </div>
            
          </div>
          <div className="text-white order-1 mt-6">
            <h1 className="font-semibold text-nowrap text-[16px]">Useful Links</h1>
            <ul className="text-[14px] text-nowrap space-y-2 mt-4">
              <li>
                <Link to="/blogs">Blogs</Link>
              </li>
              <li><Link to='/about'>About Us</Link> </li>
              <li className="">
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
           
            
               
        </div>

        
      </div>
      {/* links and tags  */}
    <div className="relative flex flex-wrap md:flex-nowrap min-h-fit
 md:h-[120vh] px-4 py-12 md:px-16 overflow-hidden">
  
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
  <div className="relative text-white  grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-14 mx-auto ">
   {/* 1 col */}
   <div >
  <h3 className="font-bold mb-2">Pressure Cooker</h3>
  <ul className="space-y-1 text-[13px] whitespace-normal sm:text-nowrap
">
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
  <h3 className="font-semibold mb-2">Cookware</h3>
  <ul className="space-y-1 text-[13px] whitespace-normal sm:text-nowrap
">
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

          {/* 3 col */}
{/* 
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
</div> */}

 {/* 4 col */}

  {/* <div>
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
</div> */}

   
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

          
          <div className="flex justify-between md:px-16 text-white   py-4  items-center">
            <div className="text-[12px]">
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
 
