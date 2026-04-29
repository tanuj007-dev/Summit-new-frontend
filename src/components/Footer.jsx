import React, { useEffect, useState } from "react";
import { FiPhoneCall } from "react-icons/fi";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { ToastContainer } from "react-toastify";
import mobFooterBg from "./assets/mobfooter.png";

// Helper function to convert footer link text to search-logo format
const convertToSearchTerm = (text) => {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// Build product listing URL for footer links (shareable, works on new tab/refresh)
const getProductLink = (searchTerm, category) => {
  const categoryPath = convertToSearchTerm(category);
  const search = encodeURIComponent(searchTerm);
  return `/products/${categoryPath}?search=${search}`;
};

const footerNavLinkClass =
  "block w-full rounded-sm py-1.5 text-left text-[12px] font-normal leading-snug text-white/90 wrap-break-word transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:text-[13px]";

const footerNavColClass =
  "flex min-w-0 flex-col rounded-xl border border-white/20 bg-black/35 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07)] backdrop-blur-sm sm:p-5";

const footerNavTitleClass =
  "mb-3 border-b border-white/30 pb-2.5 text-[13px] font-bold tracking-tight text-white sm:text-sm";

const Footer = () => {
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
    <footer className="md:hidden">

      <div className="relative flex min-h-[min(92vw,440px)] flex-wrap space-x-0 overflow-hidden px-4 py-10 sm:min-h-[480px] sm:py-12">
        <img
          src={mobFooterBg}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-[center_12%] sm:object-top"
        />

        {/* Tint for text contrast — lighter on narrow screens so the photo stays visible */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/50 via-black/20 to-transparent sm:from-black/65 sm:via-black/35" />

        <div className="relative z-10 mt-4 w-full gap-2 break-words">
          <div className="text-white break-words max-w-xs">
            <h1 className="font-semibold mt-4 text-[16px]">Contact Us</h1>
            <div className="text-[14px] space-x-2 space-y-2 mt-3">
              <p className="flex items-center gap-2">
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
              <p className="flex gap-2">
                {" "}
                <a href="">
                  <FaMapMarkerAlt className="mt-1" />
                </a>
                B-36 Krishna Vihar Loni <br />
                Ghaziabad-201102 UP <br />
                (INDIA)
              </p>
              <p className="flex items-center gap-2">
                {" "}
                <a href="">
                  <FaEnvelope />
                </a>
                customercare <br />
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
              <li>
                {" "}
                <Link to="/grievance-redressal">Grievance Redressal</Link>{" "}
              </li>
            </ul>

          </div>

          {/* Dark shadow from bottom */}



        </div>


      </div>
      {/* links and tags — height follows content; 2×2 grid avoids one ultra-tall row */}
      <div className="relative w-full max-w-full overflow-x-clip overflow-y-visible touch-pan-y px-4 py-8 sm:px-6 sm:py-10 md:px-12 md:py-12 lg:px-16">

        {/* 🔹 Blurred Background Image (clipped — no scale overflow / nested scroll) */}
        <div className="pointer-events-none absolute inset-0 min-h-full overflow-hidden" aria-hidden>
          <img
            src={mobFooterBg}
            alt=""
            className="h-full w-full object-cover blur-2xl opacity-60"
          />
        </div>

        {/* 🔹 Softer overlay so the blurred image reads through */}
        <div className="pointer-events-none absolute inset-0 min-h-full bg-black/25 sm:bg-black/25" aria-hidden />

        <nav
          className="relative z-10 mx-auto grid w-full min-w-0 max-w-6xl grid-cols-1 gap-4 overflow-visible text-white sm:grid-cols-2 sm:gap-5 md:gap-6 items-start"
          aria-label="Product categories and support"
        >
          <section className={footerNavColClass}>
            <h3 className={footerNavTitleClass}>Pressure Cooker</h3>
            <ul className="m-0 list-none space-y-0.5 p-0">
              <li><Link to={getProductLink('inner lid', 'pressure-cooker')} className={footerNavLinkClass}>Inner Lid Pressure Cooker</Link></li>
              <li><Link to={getProductLink('outer lid', 'pressure-cooker')} className={footerNavLinkClass}>Outer Lid Pressure Cooker</Link></li>
              <li><Link to={getProductLink('blacko', 'pressure-cooker')} className={footerNavLinkClass}>Blacko Series Hard Anodised Pressure Cooker</Link></li>
              <li><Link to={getProductLink('desire', 'pressure-cooker')} className={footerNavLinkClass}>Desire Series Stainless Steel Pressure Cooker</Link></li>
              <li><Link to={getProductLink('aluminium', 'pressure-cooker')} className={footerNavLinkClass}>Aluminium Pressure Cooker</Link></li>
              <li><Link to={getProductLink('elite', 'pressure-cooker')} className={footerNavLinkClass}>Elite Triply Pressure Cooker</Link></li>
              <li><Link to={getProductLink('2 litres', 'pressure-cooker')} className={footerNavLinkClass}>2 Litres Pressure Cooker</Link></li>
              <li><Link to={getProductLink('3 litres', 'pressure-cooker')} className={footerNavLinkClass}>3 Litres Pressure Cooker</Link></li>
              <li><Link to={getProductLink('5 litres', 'pressure-cooker')} className={footerNavLinkClass}>5 Litres Pressure Cooker</Link></li>
              <li><Link to={getProductLink('5.5 litres', 'pressure-cooker')} className={footerNavLinkClass}>5.5 Litres and Above Pressure Cooker</Link></li>
              <li><Link to={getProductLink('plain', 'pressure-cooker')} className={footerNavLinkClass}>Plain Shape Pressure Cooker</Link></li>
              <li><Link to={getProductLink('handi', 'pressure-cooker')} className={footerNavLinkClass}>Handi Shape Pressure Cooker</Link></li>
              <li><Link to={getProductLink('c-tura', 'pressure-cooker')} className={footerNavLinkClass}>C-tura Shape Pressure Cooker</Link></li>
              <li><Link to={getProductLink('pan', 'pressure-cooker')} className={footerNavLinkClass}>Pan Shape Pressure Cooker</Link></li>
              <li><Link to={getProductLink('ultimate', 'pressure-cooker')} className={footerNavLinkClass}>Ultimate Series Jumbo Size Pressure Cooker</Link></li>
              <li><Link to={getProductLink('induction', 'pressure-cooker')} className={footerNavLinkClass}>Induction Bottom Pressure Cooker</Link></li>
              <li><Link to={getProductLink('combi-pack', 'pressure-cooker')} className={footerNavLinkClass}>Combi-Pack Pressure Cooker</Link></li>
            </ul>
          </section>

          <section className={footerNavColClass}>
            <h3 className={footerNavTitleClass}>Cookware</h3>
            <ul className="m-0 list-none space-y-0.5 p-0">
              <li><Link to={getProductLink('non-stick', 'cookware')} className={footerNavLinkClass}>Non-Stick Cookware</Link></li>
              <li><Link to={getProductLink('honeycomb', 'cookware')} className={footerNavLinkClass}>Honeycomb Cookware</Link></li>
              <li><Link to={getProductLink('triply', 'cookware')} className={footerNavLinkClass}>Triply Cookware</Link></li>
              <li><Link to={getProductLink('sauce pans', 'cookware')} className={footerNavLinkClass}>Sauce Pans</Link></li>
              <li><Link to={getProductLink('induction', 'cookware')} className={footerNavLinkClass}>Induction Bottom Cookware</Link></li>
              <li><Link to={getProductLink('non-induction', 'cookware')} className={footerNavLinkClass}>Non-Induction Bottom Cookware</Link></li>
              <li><Link to={getProductLink('dosa tawa', 'cookware')} className={footerNavLinkClass}>Dosa Tawa</Link></li>
              <li><Link to={getProductLink('roti tawa', 'cookware')} className={footerNavLinkClass}>Roti Tawa</Link></li>
              <li><Link to={getProductLink('frying pan', 'cookware')} className={footerNavLinkClass}>Frying Pan</Link></li>
              <li><Link to={getProductLink('kadai', 'cookware')} className={footerNavLinkClass}>Kadai</Link></li>
              <li><Link to={getProductLink('edge tawa', 'cookware')} className={footerNavLinkClass}>Edge Tawa</Link></li>
              <li><Link to={getProductLink('idli cooker', 'cookware')} className={footerNavLinkClass}>Aluminium Idli Cooker</Link></li>
              <li><Link to={getProductLink('multi kadai', 'cookware')} className={footerNavLinkClass}>Aluminium Multi Kadai</Link></li>
              <li><Link to={getProductLink('glass lid', 'cookware')} className={footerNavLinkClass}>Cookware with Glass Lid</Link></li>
              <li><Link to={getProductLink('tadka pan', 'cookware')} className={footerNavLinkClass}>Tadka Pan</Link></li>
              <li><Link to={getProductLink('appampatra', 'cookware')} className={footerNavLinkClass}>Appampatra</Link></li>
              <li><Link to={getProductLink('steel lid', 'cookware')} className={footerNavLinkClass}>Cookware with Steel Lid</Link></li>
            </ul>
          </section>

          <section className={footerNavColClass}>
            <h3 className={footerNavTitleClass}>Kitchen Appliances</h3>
            <ul className="m-0 list-none space-y-0.5 p-0">
              <li><Link to={getProductLink('gas stove', 'kitchen-appliances')} className={footerNavLinkClass}>Gas Stove</Link></li>
              <li><Link to={getProductLink('stainless steel', 'kitchen-appliances')} className={footerNavLinkClass}>Stainless Steel Gas Stove</Link></li>
              <li><Link to={getProductLink('glass top', 'kitchen-appliances')} className={footerNavLinkClass}>Glass Top Gas Stove</Link></li>
              <li><Link to={getProductLink('mixer grinder', 'kitchen-appliances')} className={footerNavLinkClass}>Mixer Grinder</Link></li>
              <li><Link to={getProductLink('mixer grinder', 'kitchen-appliances')} className={footerNavLinkClass}>Mixer Grinder Collections</Link></li>
              <li><Link to={getProductLink('2 burner', 'kitchen-appliances')} className={footerNavLinkClass}>2 Burner Gas Stove</Link></li>
              <li><Link to={getProductLink('3 burner', 'kitchen-appliances')} className={footerNavLinkClass}>3 Burner Gas Stove</Link></li>
              <li><Link to={getProductLink('750 watt', 'kitchen-appliances')} className={footerNavLinkClass}>750 Watt Mixer Grinder</Link></li>
              <li><Link to={getProductLink('1000 watt', 'kitchen-appliances')} className={footerNavLinkClass}>1000 Watt Mixer Grinder</Link></li>
              <li><Link to={getProductLink('3 jars', 'kitchen-appliances')} className={footerNavLinkClass}>3 Jars Mixer Grinder</Link></li>
              <li><Link to={getProductLink('4 jars', 'kitchen-appliances')} className={footerNavLinkClass}>4 Jars Mixer Grinder</Link></li>
              <li><Link to={getProductLink('5 jars', 'kitchen-appliances')} className={footerNavLinkClass}>5 Jars Mixer Grinder</Link></li>
              <li><Link to={getProductLink('oval shape', 'kitchen-appliances')} className={footerNavLinkClass}>Oval Shape Stainless Steel Gas Stove</Link></li>
              <li><Link to={getProductLink('450 watt', 'kitchen-appliances')} className={footerNavLinkClass}>450 Watt Mixer Grinder</Link></li>
              <li><Link to={getProductLink('4 burner', 'kitchen-appliances')} className={footerNavLinkClass}>4 Burner Gas Stove</Link></li>
              <li><Link to={getProductLink('hobb type', 'kitchen-appliances')} className={footerNavLinkClass}>Hobb Type Glass Top Gas Stove</Link></li>
              <li><Link to={getProductLink('gas tandoor', 'kitchen-appliances')} className={footerNavLinkClass}>Gas Tandoor</Link></li>
            </ul>
          </section>

          <section className={footerNavColClass}>
            <h3 className={footerNavTitleClass}>Customer Support</h3>
            <ul className="m-0 list-none space-y-0.5 p-0">
              <li><Link to="/contact" className={footerNavLinkClass}>Contact Us</Link></li>
              <li><Link to="/trackShipment" className={footerNavLinkClass}>Track Order</Link></li>
              <li><Link to="/refund-policy" className={footerNavLinkClass}>Return & Refund Policy</Link></li>
              <li><Link to="/shipping-policy" className={footerNavLinkClass}>Shipping Policy</Link></li>
              <li><Link to="/grievance-redressal" className={footerNavLinkClass}>Grievance Redressal</Link></li>
              <li><Link to="/privacy-policy" className={footerNavLinkClass}>Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className={footerNavLinkClass}>Terms & Conditions</Link></li>
              <li><Link to="/about" className={footerNavLinkClass}>About Us</Link></li>
            </ul>
          </section>
        </nav>

        <div className="relative z-10 mx-auto mt-6 flex max-w-6xl flex-wrap items-center justify-center gap-3 px-2 pb-2">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex touch-manipulation items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-[0.98]"
          >
            <FaChevronUp className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Scroll to top
          </button>
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth",
              })
            }
            className="inline-flex touch-manipulation items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-[0.98]"
          >
            Scroll to bottom
            <FaChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden />
          </button>
        </div>
      </div>


      {/* ----------------Mountains end------------------ */}
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


          <div className="flex flex-col bg md:flex-row justify-between md:px-16 text-white py-6 items-center gap-4">
            <div className="text-[12px] text-center md:text-left order-2 md:order-1">
              Vardhman Industries ©{new Date().getFullYear()} | All rights
              reserved | Digital Partner Performdigi Monetize Pvt. Ltd.
            </div>
            <div className="text-[0.5rem] md:text-xs flex space-x-4 order-3">
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

