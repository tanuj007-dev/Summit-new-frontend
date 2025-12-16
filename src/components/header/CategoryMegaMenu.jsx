// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { FaChevronDown } from "react-icons/fa";

// const CategoryMegaMenu = () => {
//   const [menuData, setMenuData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [hoveredMain, setHoveredMain] = useState(null);
//   const [hoveredSub, setHoveredSub] = useState(null);
//   const [hoveredSeries, setHoveredSeries] = useState(null);
//   const [hoveredOption, setHoveredOption] = useState(null);

//   useEffect(() => {
//     const fetchMenuData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get("https://api.summithomeappliance.com/php_controllar/controllers/getMegaMenu.php");
//         setMenuData(response.data);
//         setError(null);
//       } catch (err) {
//         console.error("Menu fetch error:", err);
//         setError("Failed to load menu data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMenuData();
//   }, []);

//   return (
//     <div className="category-nav  hidden lg:flex items-center justify-center space-x-2 mt-2 text-sm font-medium pb-2">

//       {/* Static Categories */}
//       {[
//         { name: "Cookware", img: "Cookware.png", link: "category/cookware" },
//         { name: "Gas Stove", img: "GasStove.png", link: "category/gas-stove" },
//         { name: "Gas Tandoor", img: "GasTandoor.png", link: "category/gas-tandoor" },
//         { name: "Mixer Grinder", img: "MixerGrinder.png", link: "category/mixer-grinder" },
//         { name: "Pressure Cooker", img: "PressureCooker.png", link: "category/Pressure-Cooker" },
//         { name: "Steam Cookware", img: "steam.png", link: "category/steam-cookware" },
//         { name: "Others", img: "other.png", link: "category/others" },
//       ].map((item, index) => (
//         <div key={index} className="relative group">
//           <div className="relative flex flex-col items-center group-hover:translate-y-[6px] transition-all duration-150">
//             <Link to={`/${item.link}`}>
//               <div className="flex items-center space-x-1 cursor-pointer text-black px-3 py-1 hover:text-red-700">
//                 <img src={`/asset/images/${item.img}`} alt={item.name} className="w-10 h-6" />
//                 <span>{item.name}</span>
//                 <FaChevronDown className="ml-1 text-xs text-gray-400" />
//               </div>
//             </Link>
//           </div>
//         </div>
//       ))}

//       {/* Dynamic Mega Menu */}
//       {menuData.map((main) => (
//         <div
//           key={main.id}
//           className="relative group"
//           onMouseEnter={() => setHoveredMain(main.id)}
//           onMouseLeave={() => {
//             setHoveredMain(null);
//             setHoveredSub(null);
//             setHoveredSeries(null);
//             setHoveredOption(null);
//           }}
//         >
//           {hoveredMain === main.id && (
//             <div className="absolute top-full z-50 bg-[#FAFAFC] p-6 border border-gray-200 space-x-6 mega-menu flex left-1/2 -translate-x-1/2 w-[950px] shadow-lg">
//               {/* Column 1: Subcategories */}
//               <div className="w-1/4 space-y-3 border-r pr-4">
//                 {main.sub_categories?.map((sub) => (
//                   <div
//                     key={sub.id}
//                     className="cursor-pointer group"
//                     onMouseEnter={() => setHoveredSub(sub.id)}
//                   >
//                     <h4 className="font-semibold text-gray-800 text-sm">
//                       <Link to={`/products/${main.id}/${sub.id}`}>{sub.name}</Link>
//                     </h4>
//                   </div>
//                 ))}
//               </div>

//               {/* Column 2: Series + Options */}
//               <div className="w-1/2 space-y-4 border-r border-gray-200 px-6">
//                 {main.sub_categories
//                   ?.filter((sub) => sub.id === hoveredSub)
//                   .flatMap((sub) =>
//                     sub.series?.map((ser) => (
//                       <div key={ser.id}>
//                         <h4 className="font-semibold text-sm text-gray-900">
//                           <Link to={`/products/${main.id}/${sub.id}/${ser.id}`}>{ser.name}</Link>
//                         </h4>
//                         <ul className="space-y-1">
//                           {ser.options?.map((opt) => (
//                             <li key={opt.id}>
//                               <Link to={`/products/${main.id}/${sub.id}/${ser.id}/${opt.id}`}>
//                                 {opt.name}
//                               </Link>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     ))
//                   )}
//               </div>

//               {/* Column 3: Sizes */}
//               <div className="w-1/4 pl-2 space-y-2">
//                 {main.sub_categories
//                   ?.filter((sub) => sub.id === hoveredSub)
//                   .flatMap((sub) =>
//                     sub.series
//                       ?.filter((ser) => ser.id === hoveredSeries)
//                       .flatMap((ser) =>
//                         ser.options
//                           ?.filter((opt) => opt.id === hoveredOption)
//                           .flatMap((opt) =>
//                             opt.sizes?.map((size, index) => (
//                               <div key={index} className="text-sm text-gray-700 hover:text-red-600">
//                                 <Link to={`/products/${main.id}/${sub.id}/${ser.id}/${opt.id}/${size}`}>
//                                   {size}
//                                 </Link>
//                               </div>
//                             ))
//                           )
//                       )
//                   )}
//               </div>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CategoryMegaMenu;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";

const CategoryMegaMenu = () => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredMain, setHoveredMain] = useState(null);
  const [hoveredSub, setHoveredSub] = useState(null);
  const [hoveredSeries, setHoveredSeries] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/api/mega-menu");
        setMenuData(response.data);
        setError(null);
      } catch (err) {
        console.error("Menu fetch error:", err);
        setError("Failed to load menu data");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  return (
    <div className="category-nav hidden lg:flex items-center justify-center space-x-2  mt-2 text-sm font-medium pb-2">
      {loading ? (
        <div className="flex items-center justify-center w-full py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
          <span className="ml-2 text-gray-600">Loading menu...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center w-full py-4">
          <span className="text-red-600">{error}</span>
        </div>
      ) : (
        menuData.map((main) => (
        <div
          key={main.id}
          className="relative group"
          onMouseEnter={() => setHoveredMain(main.id)}
          onMouseLeave={() => {
            setHoveredMain(null);
            setHoveredSub(null);
            setHoveredSeries(null);
            setHoveredOption(null);
          }}
        >
          {/* MAIN CATEGORY BUTTON */}
          <Link 
            to={`/products/${main.id}`}
            className="flex items-center space-x-1 cursor-pointer px-3 py-1 hover:text-red-600 transition"
          >
            <img
              src={`/asset/images/${main.name}.png`}
              alt={main.name}
              className="w-10 h-10 object-contain"
            />
            <span>{main.name}</span>
            <FaChevronDown className="text-xs text-gray-400" />
          </Link>

          {/* MEGA MENU */}
          {hoveredMain === main.id && (
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 bg-[#FAFAFC] shadow-lg  
              z-50 p-6 w-[1400px] flex space-x-6"
            >
              {/* COLUMN 1 – SUBCATEGORIES */}
              <div className="w-1/3 space-y-4 border-r border-[#D9D9D9] pr-6">
                {main.sub_categories?.map((sub) => (
                  <Link
                    to={`/products/${main.id}/${sub.id}`}
                    className={`block cursor-pointer p-3 rounded-lg transition-colors ${
                      hoveredSub === sub.id ? "bg-red-50 border border-red-200" : "hover:bg-gray-50"
                    }`}
                    onMouseEnter={() => {
                      setHoveredSub(sub.id);
                      setHoveredSeries(null);
                      setHoveredOption(null);
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={`/asset/images/${sub.name.toLowerCase().replace(' ', '-')}.png`}
                        alt={sub.name}
                        className="w-12 h-12 object-contain"
                      />
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm mb-1 ${
                          hoveredSub === sub.id ? "text-red-600" : "text-gray-800"
                        }`}>
                          {sub.name}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {sub.name === 'Inner Lid' 
                            ? 'Traditional design with secure locking mechanism for safe cooking'
                            : sub.name === 'Outer Lid'
                            ? 'Modern convenience with easy one-hand operation'
                            : 'Quality pressure cooker for your kitchen needs'
                          }
                        </p>
                      </div>
                      <div className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* COLUMN 2 – SERIES + OPTIONS */}
              <div className="w-1/3 space-y-6 border-r border-[#D9D9D9] px-6">
                {main.sub_categories
                  .filter((s) => s.id === hoveredSub)
                  .flatMap((s) =>
                    s.series?.map((ser) => (
                        <Link
                          to={`/products/${main.id}/${s.id}/${ser.id}`}
                          className="block cursor-pointer"
                          onMouseEnter={() => {
                            setHoveredSeries(ser.id);
                            setHoveredOption(null);
                          }}
                        >
                        <h4
                          className={`font-semibold text-sm mb-2 ${
                            hoveredSeries === ser.id ? "text-red-600" : "text-gray-900"
                          }`}
                        >
                          {ser.name} <span className="text-gray-500 font-normal">based series</span>
                        </h4>
                        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                          {ser.name === 'Aluminium'
                            ? 'Lightweight and budget-friendly — perfect for fast everyday cooking.'
                            : ser.name === 'Hard Anodized'
                            ? 'Scratch-proof and stylish — long-lasting cookers with premium looks.'
                            : ser.name === 'Stainless Steel'
                            ? 'Strong, rust-free & elegant — built for performance and durability.'
                            : ser.name === 'Triply'
                            ? 'Triple-layered for even cooking — top-tier pressure perfection.'
                            : 'Quality construction for reliable cooking performance'
                          }
                        </p>
                        <div className="space-y-2">
                          {ser.options?.map((opt) => (
                            <Link
                              to={`/products/${main.id}/${s.id}/${ser.id}/${opt.id}`}
                              className={`block text-sm cursor-pointer px-3 py-2 rounded-md transition-colors ${
                                hoveredOption === opt.id
                                  ? "bg-red-100 text-red-700 font-medium border border-red-200"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                              onMouseEnter={() => setHoveredOption(opt.id)}
                            >
                              {opt.name}
                            </Link>
                          ))}
                        </div>
                        </Link>
                    ))
                  )}
              </div>

              {/* COLUMN 3 – SIZES */}
              <div className="w-1/3 space-y-3 pl-6">
                {main.sub_categories
                  .filter((s) => s.id === hoveredSub)
                  .flatMap((s) =>
                    s.series
                      ?.filter((ser) => ser.id === hoveredSeries)
                      .flatMap((ser) =>
                        ser.options
                          ?.filter((o) => o.id === hoveredOption)
                          .flatMap((o) =>
                            o.sizes?.map((size, i) => (
                              <Link
                                to={`/products/${main.id}/${s.id}/${ser.id}/${o.id}/${size}`}
                                className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                              >
                                <span className="text-sm text-gray-700 group-hover:text-red-600">{size}</span>
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            ))
                          )
                      )
                  )}
              </div>
            </div>
          )}
        </div>
      ))
      )}
    </div>
  );
};

export default CategoryMegaMenu;

