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

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import axiosInstance from "../../axiosConfig";
import { ToastContainer, toast } from "react-toastify";

const CategoryMegaMenu = () => {
  const navigate = useNavigate();
  
  // Function to handle category clicks with API integration
  const handleCategoryClick = async (searchTerm, category, event) => {
    // Prevent default link behavior
    if (event) {
      event.preventDefault();
    }
    
    try {
      console.log('Testing search term:', searchTerm);
      
      // Try multiple search term variations to find one that works
      const searchVariations = [
        searchTerm,
        searchTerm.replace(/\s+/g, ' ').toLowerCase(),
        searchTerm.split(' ')[0], // Try just first word
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
        const categoryPath = category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
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
  
  // Static categories data with correct API identifiers
  const staticCategories = [
    {
      id: "Pressure-Cooker",
      name: "Pressure Cooker",
      sub_categories: [
        {
          id: "outer-lid",
          name: "Outer Lid",
          series: [
            {
              id: "aluminium",
              name: "Aluminium",
              options: [
                {
                  id: "Prime",
                  name: "Prime",
                  sizes: ["1.5L", "2L", "3L", "5L"],
                },
                {
                  id: "Supreme",
                  name: "Supreme",
                  sizes: [
                    "1L",
                    "1.5L",
                    "2L",
                    "3L",
                    "4L",
                    "5L",
                    "6.5L",
                    "7.5L",
                    "10L",
                    "12L",
                  ],
                },
                {
                  id: "Heavy",
                  name: "Heavy",
                  sizes: ["3.5L", "5.5L", "7.5L", "10L", "12L"],
                },
              ],
            },
            {
              id: "stainless-steel",
              name: "Stainless Steel",
              options: [
                {
                  id: "Desire",
                  name: "Desire",
                  sizes: ["1.5L", "2L", "3L", "5L"],
                },
              ],
            },
            {
              id: "triply stainless-steel",
              name: "Triply Stainless Steel",
              options: [{ id: "elite", name: "Elite", sizes: ["1.5L", "2L", "3L", "5L"], }],
            },
          ],
        },
        {
          id: "inner-lid",
          name: "Inner Lid",
          series: [
            {
              id: "alluminium",
              name: "Alluminium",
              options: [
                { id: "Ultimate", name: "Ultimate", sizes: ["3L", "5L", "16L", "20L", "24L", "18L", "22L"] },
                { id: "Fine", name: "Fine", sizes: ["7L", "10L", "1L", "1.5L", "2L", "3L", "5L"] },
                { id: "Prime", name: "Prime", sizes: ["7L", "10L", "3L", "5L", "5.5L"] },
                { id: "Supreme", name: "Supreme", sizes: ["1L", "1.5L", "2L", "3L", "5L", "5.5L", "7L", "8L", "10L", "12L", "15L"] },
                { id: "Heavy", name: "Heavy", sizes: ["5L", "5.5L"] },
              ],
            },
            {
              id: "hard-anodized-alluminium",
              name: "Hard Anodized Alluminium",
              options: [
                { id: "Blacko", name: "Blacko", sizes: ["3L", "5L"] },
              ],
            },
            {
              id: "stainless-steel",
              name: "Stainless Steel",
              options: [
                { id: "Desire", name: "Desire", sizes: ["3L", "5L"] },
               
              ],
            },
            {
              id: "triply stainless-steel",
              name: "Triply Stainless Steel",
              options: [
                { id: "Elite", name: "Elite", sizes: ["3L", "5L"] },
                
              ],
            },
          ],
        },
      ],
    },
   {
  id: "gas-stove",
  name: "Gas Stove",
  sub_categories: [
    {
      id: "2-burner",
      name: "2 Burner",
      series: [
        {
          id: "glass",
          name: "Glass Top",
          options: [
            { id: "Supreme", name: "Supreme", sizes: ["2 Burner"] },
            { id: "Virtus-2", name: "Virtus 2", sizes: ["2 Burner"] },
            { id: "Oval", name: "Oval", sizes: ["2 Burner"] },
          ],
        },
      ],
    },
    {
      id: "3-burner",
      name: "3 Burner",
      series: [
        {
          id: "glass",
          name: "Glass Top",
          options: [
            { id: "Virtus-3", name: "Virtus 3", sizes: ["3 Burner"] },
            { id: "Triple-Cook", name: "Triple Cook", sizes: ["3 Burner"] },
          ],
        },
      ],
    },
  ],
},

    {
  id: "gas-tandoor",
  name: "Gas Tandoor",
  sub_categories: [
    {
      id: "aluminium",
      name: "Aluminium",
      series: [
        {
          id: "prime",
          name: "Prime",
          options: [
            {
              id: "unassembled",
              name: "Unassembled",
              sizes: ["1.5 KG", "2 KG"],
            },
            {
              id: "assembled",
              name: "Assembled",
              sizes: ["2.5 KG"],
            },
          ],
        },
        {
          id: "papdi",
          name: "Papdi",
          options: [
            {
              id: "unassembled",
              name: "Unassembled",
              sizes: ["2 KG"],
            },
            {
              id: "assembled",
              name: "Assembled",
              sizes: ["2.5 KG"],
            },
          ],
        },
        {
          id: "packing",
          name: "Packing",
          options: [
            {
              id: "bulk",
              name: "Bulk Packing",
              sizes: ["2 KG", "2.5 KG"],
            },
          ],
        },
        {
          id: "supreme",
          name: "Supreme",
          options: [
            {
              id: "assembled",
              name: "Assembled",
              sizes: ["3 KG"],
            },
          ],
        },
      ],
    },
    {
      id: "iron",
      name: "Iron",
      series: [
        {
          id: "cook",
          name: "Cook",
          options: [
            {
              id: "assembled",
              name: "Assembled",
              sizes: ["2 KG", "3 KG"],
            },
          ],
        },
        {
          id: "heavy",
          name: "Heavy",
          options: [
            {
              id: "assembled",
              name: "Assembled",
              sizes: ["3 KG", "3.5 KG"],
            },
          ],
        },
        {
          id: "elite",
          name: "Elite",
          options: [
            {
              id: "assembled",
              name: "Assembled",
              sizes: ["3.5 KG"],
            },
          ],
        },
      ],
    },
  ],
},

  {
  id: "mixer-grinder",
  name: "Mixer Grinder",
  sub_categories: [
    {
      id: "450w",
      name: "450 Watt",
      series: [
        {
          id: "entry",
          name: "Entry Range",
          options: [
            { id: "Nutri-Fit", name: "Nutri Fit", sizes: ["2 Jar"] },
          ],
        },
      ],
    },
    {
      id: "750w",
      name: "750 Watt",
      series: [
        {
          id: "mid",
          name: "Mid Range",
          options: [
            { id: "Ace", name: "Ace", sizes: ["3 Jar"] },
            { id: "Elegant", name: "Elegant", sizes: ["3 Jar"] },
          ],
        },
      ],
    },
    {
      id: "1000w",
      name: "1000 Watt",
      series: [
        {
          id: "premium",
          name: "Premium Range",
          options: [
            { id: "Royal", name: "Royal", sizes: ["4 Jar"] },
          ],
        },
      ],
    },
  ],
},

   {
  id: "cookware",
  name: "Cookware",
  sub_categories: [
    {
      id: "tawa",
      name: "Tawa",
      series: [
        {
          id: "non-stick",
          name: "Non Stick",
          options: [
            { id: "Dosa-Tawa", name: "Dosa Tawa", sizes: ["24cm", "26cm", "28cm"] },
            { id: "Roti-Tawa", name: "Roti Tawa", sizes: ["24cm", "26cm"] },
          ],
        },
      ],
    },
    {
      id: "kadai",
      name: "Kadai",
      series: [
        {
          id: "non-stick",
          name: "Non Stick",
          options: [
            { id: "Steel-Lid", name: "Steel Lid", sizes: ["2L", "3L", "5L"] },
            { id: "Glass-Lid", name: "Glass Lid", sizes: ["2L", "3L", "5L"] },
          ],
        },
      ],
    },
    {
      id: "frypan",
      name: "Frypan",
      series: [
        {
          id: "non-stick",
          name: "Non Stick",
          options: [
            { id: "Classic", name: "Classic Frypan", sizes: ["20cm", "24cm", "28cm"] },
          ],
        },
      ],
    },
  ],
},

   {
  id: "steam-cookware",
  name: "Steam Cookware",
  sub_categories: [
    {
      id: "idli-cooker",
      name: "Idli Cooker",
      series: [
        {
          id: "aluminium",
          name: "Aluminium",
          options: [
            { id: "4-plate", name: "4 Plates", sizes: ["Standard"] },
            { id: "5-plate", name: "5 Plates", sizes: ["Standard"] },
            { id: "6-plate", name: "6 Plates", sizes: ["Standard"] },
          ],
        },
      ],
    },
  ],
}

  ];

  const [menuData] = useState(staticCategories);
  const [hoveredMain, setHoveredMain] = useState(null);
  const [hoveredSub, setHoveredSub] = useState(null);
  const [hoveredSeries, setHoveredSeries] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null);

  return (
    <>
      {/* Mobile Category View */}
     <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200 py-4 px-4">
  <div className="flex overflow-x-scroll overflow-y-hidden space-x-6 pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {menuData.map((main) => (
            <button
              key={main.id}
              onClick={(e) => handleCategoryClick(main.name.toLowerCase(), main.name, e)}
              className="flex flex-col items-center min-w-fit space-y-2 group"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 p-3 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                <img
                  src={`/asset/images/${
                    main.name === "Pressure Cooker"
                      ? "PressureCooker"
                      : main.name === "Gas Stove"
                      ? "GasStove"
                      : main.name === "Gas Tandoor"
                      ? "GasTandoor"
                      : main.name === "Mixer Grinder"
                      ? "MixerGrinder"
                      : main.name === "Steam Cookware"
                      ? "Steam Cookware"
                      : main.name === "Cookware"
                      ? "Cookware"
                      : "Others"
                  }.png`}
                  alt={main.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs text-gray-700 text-center whitespace-nowrap group-hover:text-red-600 transition-colors">
                {main.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Category View */}
      <div className="hidden lg:flex category-nav overflow-x-auto scrollbar-hide sticky top-0 z-50 items-center justify-center space-x-2 mt-2 text-sm font-medium pb-2">
        {/* Display all categories */}
        {menuData.map((main) => (
          <div
            key={main.id}
            className="relative group"
            onMouseEnter={() => setHoveredMain(main.id)}
            onMouseLeave={(e) => {
              // Check if mouse is moving to mega menu
              const relatedTarget = e.relatedTarget;
              if (!relatedTarget || !relatedTarget.closest(`[data-mega-menu="${main.id}"]`)) {
                setHoveredMain(null);
                setHoveredSub(null);
                setHoveredSeries(null);
                setHoveredOption(null);
              }
            }}
          >
            {/* MAIN CATEGORY BUTTON */}
            <button
              onClick={(e) => handleCategoryClick(main.name.toLowerCase(), main.name, e)}
              className="flex text-nowrap  items-center space-x-1 cursor-pointer px-3 py-1 hover:text-red-600 transition"
              onMouseEnter={() => setHoveredMain(main.id)}
            >
              <img
                src={`/asset/images/${
                  main.name === "Pressure Cooker"
                    ? "PressureCooker"
                    : main.name === "Gas Stove"
                    ? "GasStove"
                    : main.name === "Gas Tandoor"
                    ? "GasTandoor"
                    : main.name === "Mixer Grinder"
                    ? "MixerGrinder"
                    : main.name === "Steam Cookware"
                    ? "Steam Cookware"
                    : main.name === "Cookware"
                    ? "Cookware"
                    : "Others"
                }.png`}
                alt={main.name}
                className="w-10 h-10 object-contain"
              />
              <span>{main.name}</span>
              <FaChevronDown className="text-xs text-gray-400" />
            </button>

            {/* MEGA MENU */}
            {hoveredMain === main.id && (
   <div
  data-mega-menu={main.id}
  className="
    fixed
    top-[150px]
    left-1/2
    -translate-x-1/2
    bg-[#FAFAFC]
    shadow-lg 
    z-[9999]
    mt-18
    p-6
    w-[1400px]
    flex
    space-x-6
    max-h-[70vh]
    overflow-y-auto
  "
  onMouseEnter={() => setHoveredMain(main.id)}
  onMouseLeave={() => {
    setHoveredMain(null);
    setHoveredSub(null);
    setHoveredSeries(null);
    setHoveredOption(null);
  }}
  style={{ pointerEvents: 'auto' }}
>



                {/* COLUMN 1 – SUBCATEGORIES */}
                <div className="w-1/3 space-y-4 border-r border-[#D9D9D9] pr-6">
                  {main.sub_categories?.map((sub) => (
                    <button
                      onClick={(e) => handleCategoryClick(sub.name.toLowerCase(), sub.name, e)}
                      className={`block cursor-pointer p-3 rounded-lg transition-colors ${
                        hoveredSub === sub.id
                          ? "bg-red-50 border border-red-200"
                          : "hover:bg-gray-50"
                      }`}
                      onMouseEnter={() => {
                        setHoveredSub(sub.id);
                        setHoveredSeries(null);
                        setHoveredOption(null);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={`/asset/images/${
                            sub.name === "Inner Lid"
                              ? "cooker1"
                              : sub.name === "Outer Lid"
                              ? "cooker2"
                              : sub.name === "2 Burner"
                              ? "S2BC"
                              : sub.name === "3 Burner"
                              ? "S3BTC"
                              : "pressurecooker"
                          }.jpg`}
                          alt={sub.name}
                          className="w-12 h-12 object-contain"
                        />
                        <div className="flex-1">
                          <h4
                            className={`font-semibold text-sm mb-1 ${
                              hoveredSub === sub.id
                                ? "text-red-600"
                                : "text-gray-800"
                            }`}
                          >
                            {sub.name}
                          </h4>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {sub.name === "Inner Lid"
                              ? "Traditional design with secure locking mechanism for safe cooking"
                              : sub.name === "Outer Lid"
                              ? "Modern convenience with easy one-hand operation"
                              : "Quality pressure cooker for your kitchen needs"}
                          </p>
                        </div>
                        <div className="text-gray-400 hover:text-gray-600">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* COLUMN 2 – SERIES + OPTIONS */}
                <div className="w-1/3 space-y-6 border-r border-[#D9D9D9] px-6">
                  {main.sub_categories
                    .filter((s) => s.id === hoveredSub)
                    .flatMap((s) =>
                      s.series?.map((ser) => (
                        <button
                          onClick={(e) => handleCategoryClick(ser.name.toLowerCase(), ser.name, e)}
                          className="block cursor-pointer"
                          onMouseEnter={() => {
                            setHoveredSeries(ser.id);
                            setHoveredOption(null);
                          }}
                        >
                          <h4
                            className={`font-semibold text-sm mb-2 ${
                              hoveredSeries === ser.id
                                ? "text-red-600"
                                : "text-gray-900"
                            }`}
                          >
                            {ser.name}{" "}
                            <span className="text-gray-500 font-normal">
                              based series
                            </span>
                          </h4>
                          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                            {ser.name === "Aluminium"
                              ? "Lightweight and budget-friendly — perfect for fast everyday cooking."
                              : ser.name === "Hard Anodized"
                              ? "Scratch-proof and stylish — long-lasting cookers with premium looks."
                              : ser.name === "Stainless Steel"
                              ? "Strong, rust-free & elegant — built for performance and durability."
                              : ser.name === "Triply"
                              ? "Triple-layered for even cooking — top-tier pressure perfection."
                              : "Quality construction for reliable cooking performance"}
                          </p>
                          <div className="space-y-2">
                            {ser.options?.map((opt) => (
                              <button
                                onClick={(e) => handleCategoryClick(opt.name.toLowerCase(), opt.name, e)}
                                className={`block text-sm cursor-pointer px-3 py-2 rounded-md transition-colors ${
                                  hoveredOption === opt.id
                                    ? "bg-red-100 text-red-700 font-medium border border-red-200"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                                onMouseEnter={() => setHoveredOption(opt.id)}
                              >
                                {opt.name}
                              </button>
                            ))}
                          </div>
                        </button>
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
                                <button
                                  onClick={(e) => handleCategoryClick(size.toLowerCase(), size, e)}
                                  className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                >
                                  <span className="text-sm text-gray-700 group-hover:text-red-600">
                                    {size}
                                  </span>
                                  <svg
                                    className="w-4 h-4 text-gray-400 group-hover:text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </button>
                              ))
                            )
                        )
                    )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoryMegaMenu;
