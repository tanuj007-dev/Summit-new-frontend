

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import axiosInstance from "../../axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import appampatraImg from "../assets/1. SABF.jpg";
import tadkapanImg from "../assets/1. STPSTIE.jpg";
import honeycombEliteImg from "../assets/1. STSHCTIE.jpg";
import multiKadaiImg from "../assets/1. SMK4S.jpg";
import gasketImg from "../assets/1. SGOS -(SENIOR GASKET).png";
import safetyValveImg from "../assets/1. Safety Valve Inner.png";
import weightWhistleImg from "../assets/1. Weight Set Innerlid.png";
import handleImg from "../assets/1. 1 to 3.5 Liters Main Handle.png";

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
                  id: "Ultimate",
                  name: "Ultimate",
                  sizes: ["16L", "20L", "24L"],
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
                { id: "Fine", name: "Fine", sizes: ["1L", "1.5L", "2L", "3L", "5L"] },
                { id: "Prime", name: "Prime", sizes: ["3L", "5L", "5.5L"] },
                { id: "Supreme", name: "Supreme", sizes: ["1L", "1.5L", "2L", "3L", "5L", "5.5L", "7L", "8L", "10L", "12L", "15L"] },
                { id: "Ultimate", name: "Ultimate", sizes: ["18L", "20L", "22L"] },
                { id: "Heavy", name: "Heavy", sizes: ["5L", "5.5L"] },
              ],
            },
            {
              id: "hard-anodized-alluminium",
              name: "Hard Anodized Alluminium",
              options: [
                { id: "Blacko", name: "Blacko", sizes: ["2L", "3L", "3.5L", "5L", "5.5L", "6.5L"] },
              ],
            },
            {
              id: "stainless-steel",
              name: "Stainless Steel",
              options: [
                { id: "Desire", name: "Desire", sizes: ["2L", "3L", "5L"] },

              ],
            },
            {
              id: "triply stainless-steel",
              name: "Triply Stainless Steel",
              options: [
                { id: "Elite", name: "Elite", sizes: ["2L", "3L", "5L"] },

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
          id: "2-burner-stoves",
          name: "Stainless Steel",
          series: [
            {
              id: "metal-body-2-burner",
              name: "2 Burner",
              options: [
                { id: "c-mander", name: "C-Mander", burners: ["2 Burner"], skus: ["S2BC"] },
                { id: "supreme-2b", name: "Supreme", burners: ["2 Burner"], skus: ["S2BS"] },
                { id: "virtus-2-cp", name: "Virtus-2 CP", burners: ["2-Burner"], skus: ["S2BVCP"] },
                { id: "pigeon", name: "Pigeon", burners: ["2 Burner"], skus: ["S2BP"] },
                { id: "virtus-2", name: "Virtus-2", burners: ["2-Burner"], skus: ["S2BV"] },
                { id: "virtus-2-18", name: "Virtus-2 1.8", burners: ["2-Burner"], skus: ["S2BV1-8"] },
                { id: "oval-2-burner", name: "Oval", burners: ["2 Burner"], skus: ["S2BO"] },
              ],
            },
            {
              id: "glass-top-2-burner",
              name: "3 Burner",
              options: [
                { id: "nano-glass-black", name: "Triple Cook", burners: ["3 Burner"], skus: ["S2BNGB"] },
                { id: "nano-glass-digital", name: "Oval-Plain", burners: ["3 Burner"], skus: ["S2BNGD"] },
                { id: "glass-2-burner-black", name: "Oval-Rainbow", burners: ["3 Burner"], skus: ["S2BGB"] },
                { id: "glass-2-burner-digital", name: "Oval-Step", burners: ["3 Burner"], skus: ["S2BGD"] },
              ],
            },
          ],
        },
        {
          id: "3-burner-stoves",
          name: "Glass Top",
          series: [
            {
              id: "metal-body-3-burner",
              name: "2 Burner",
              options: [
                { id: "triple-cook", name: "Nano Glass", burners: ["2 Burners"], skus: ["S3BTC"] },
                { id: "oval-plain", name: "Full Glass", burners: ["2 Burner"], skus: ["S3BO"] },
              ],
            },
            {
              id: "glass-top-3-burner",
              name: "3 Burner",
              options: [
                { id: "glass-3-burner-black", name: "Full Glass", burners: ["3 Burner"], skus: ["S3BGB"] },

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
          id: "galvanised-iron",
          name: "Galvanised Iron",
          series: [
            { id: "prime", name: "Prime", options: [{ id: "prime", name: "Prime", sizes: ["1.5kg"] }] },
            { id: "pep", name: "Pep", options: [{ id: "pep", name: "Pep", sizes: ["2Kg"] }] },
            { id: "posh", name: "Posh (Big)", options: [{ id: "posh", name: "Posh (Big)", sizes: ["2Kg"] }] },
            { id: "supreme", name: "Supreme", options: [{ id: "supreme", name: "Supreme", sizes: ["2.5Kg"] }] },
          ],
        },
        {
          id: "aluminium",
          name: "Aluminium",
          series: [
            { id: "gold", name: "Gold", options: [{ id: "gold", name: "Gold", sizes: ["2Kg"] }] },
            { id: "heavy", name: "Heavy", options: [{ id: "heavy", name: "Heavy", sizes: ["3Kg"] }] },
            { id: "elite", name: "Elite", options: [{ id: "elite", name: "Elite", sizes: ["3.5Kg"] }] },
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

              options: [
                { id: "Nutri-Fit", name: "Nutri Fit", jars: ["2 Jars"], skus: ["SMGNF2"] },
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

              options: [
                { id: "Ace", name: "Ace", jars: ["3 Jars", "4 Jars"], skus: ["SMGACE3", "SMGACE4"] },
                { id: "Elegant", name: "Elegant", jars: ["3 Jars", "4 Jars"], skus: ["SMGEG3", "SMGEG4"] },
                {


                  id: "Curve", name: "Curve", jars: ["4 Jars", "5 Jars"], skus: ["SMGCV4", "SMGCV5"]

                },
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

              options: [
                { id: "Alpha", name: "Alpha", jars: ["4 Jars", "5 Jars"], skus: ["SMGALP4", "SMGALP5"] },

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
          id: "non-stick-aluminium-cookware",
          name: "Non-Stick Aluminium Cookware",
          series: [
            {
              id: "appampatra",
              name: "Appampatra",
              options: [
                { id: "fine-ni", name: "Fine", sizes: ["12 Scoops Stainless Steel Lid"], skus: ["SABF"] },
                { id: "prime-ni", name: "Prime", sizes: ["12 Scoops Stainless Steel Lid"], skus: ["SABP"] },
                { id: "gs-ni", name: "Supreme", sizes: ["12 Scoops Stainless Steel Lid", "12 Scoops Glass Lid"], skus: ["SABGS"] },
                { id: "heavy-ni", name: "Heavy", sizes: ["12 Scoops Stainless Steel Lid"], skus: ["SABH"] }
              ]
            },
            {
              id: "tawa",
              name: "Tawa",
              options: [
                { id: "prime-tawa", name: "Prime Dosa Tawa", sizes: ["275mm", "300mm"], skus: ["STMP", "STBP"] },
                { id: "supreme-tawa", name: "Supreme Dosa Tawa", sizes: ["275mm", "300mm", "310mm"], skus: ["STMS", "STBS", "STXLS", "STMFS", "STBFS", "STXLFS"] },
                { id: "heavy-tawa", name: "Heavy Dosa Tawa", sizes: ["275mm", "300mm", "310mm"], skus: ["STMH", "STMIH", "STBH", "STBIH", "STXLH", "STXLIH", "STMFH", "STMFIH", "STBFH", "STBFIH", "STXLFH", "STXLFIH"] },
                { id: "edge-tawa", name: "Edge Smart Tawa", sizes: ["280mm", "300mm"], skus: ["STBFEG-2C", "STBFEG", "STBFIEG", "STXLFEG-2C", "STXLFEG", "STXLFIEG"] },
                { id: "curve-tawa", name: "Curve Roti Tawa", sizes: ["280mm", "310mm"], skus: ["STMFC", "STMFIC", "STBFC", "STBFIC"] }
              ]
            },
            {
              id: "kadai",
              name: "Kadai",
              options: [
                { id: "kadai-steel-ni", name: "With Stainless Steel Lid", sizes: ["200mm", "220mm", "240mm", "260mm", "280mm", "300mm"], skus: ["SKSS", "SKMS", "SKBS", "SKXLS", "SKXXLS", "SK3XLS"] },
                { id: "kadai-glass-ni", name: "With Glass Lid", sizes: ["200mm", "220mm", "240mm", "260mm", "280mm", "300mm"], skus: ["SKSGS", "SKMGS", "SKBGS", "SKXLGS", "SKXXLGS", "SK3XLGS"] }
              ]
            },
            {
              id: "frypan",
              name: "Frypan",
              options: [
                {
                  id: "frypan-wsl",
                  name: "With Stainless Steel Lid",
                  sizes: ["210mm", "240mm", "250mm", "275mm"],
                  skus: ["SFMWSL", "SFMWISL", "SFBWSL", "SFBIWSL", "SFVBWSL", "SFVBIWSL", "SFXLWSL", "SFXLIWSL"]
                },
                {
                  id: "frypan-wgl",
                  name: "With Glass Lid",
                  sizes: ["210mm", "240mm", "250mm", "275mm"],
                  skus: ["SFMWGL", "SFMWIGL", "SFBWGL", "SFBIGL", "SFVBWGL", "SFVBIGL", "SFXLWGL", "SFXLIGL"]
                }
              ]
            }
          ]
        },
        {
          id: "triply-stainless-steel-cookware",
          name: "Triply Stainless Steel Cookware",
          series: [
            {
              id: "triply-tasla",
              name: "",
              options: [
                { id: "et-tasla", name: "Tasla", sizes: ["160mm To 320mm"], skus: ["STSTIE"] }
              ]
            },
            {
              id: "triply-kadai",
              name: "",
              options: [
                { id: "et-kadai", name: "Kadai", sizes: ["160mm", "180mm", "200mm", "220mm", "240mm", "260mm", "280mm", "300mm", "320mm"], skus: ["SKXXSTIE", "SKXSTIE", "SKSTIE", "SKMTIE", "SKBTIE", "SKXLTIE", "SKXXLTIE", "SK3XLTIE", "SK4XLTIE"] }
              ]
            },
            {
              id: "triply-frypan",
              name: "",
              options: [
                { id: "et-frypan", name: "Frypan", sizes: ["180mm To 260mm"], skus: ["SFTIE"] }
              ]
            },
            {
              id: "triply-casserole",
              name: "",
              options: [
                { id: "et-casserole", name: "Casserole", sizes: ["180mm To 300mm"], skus: ["SCTIE"] }
              ]
            },
            {
              id: "triply-tadkapan",
              name: "",
              options: [
                { id: "tadkapan-sizes", name: "Tadkapan", sizes: ["10", "12", "14"], skus: ["STPSTIE", "STPMTIE", "STPBTIE"] }
              ]
            },
            {
              id: "triply-tope",
              name: "",
              options: [
                { id: "et-tope", name: "Tope", sizes: ["120mm To 240mm"], skus: ["STTIE"] }
              ]
            },
            {
              id: "triply-saucepan",
              name: "",
              options: [
                { id: "et-saucepan", name: "Saucepan", sizes: ["140mm To 300mm"], skus: ["STTIE"] }
              ]
            }
          ]
        },
        {
          id: "honeycomb-triply-stainless-steel-cookware",
          name: "Honeycomb Triply Stainless Steel Cookware",
          series: [
            {
              id: "honeycomb-elite",
              name: "Honeycomb Elite",
              options: [
                { id: "hc-kadai", name: "Kadai", sizes: ["220mm", "240mm"], skus: ["SKMHGTIE", "SKBHGTIE"] },
                { id: "hc-curve", name: "Curve Tawa", sizes: ["260mm", "280mm"], skus: ["STSHCTIE", "STMHCTIE"] },
                { id: "hc-tawa", name: "Tawa", sizes: ["280mm"], skus: ["STMHTIE"] },
                { id: "hc-frypan", name: "Frypan", sizes: ["240mm"], skus: ["SFMHGTIE"] }
              ]
            }
          ]
        }
      ]
    }
    ,

    {
      id: "steam-cookware",
      name: "Steam Cookware",
      sub_categories: [
        {
          id: "idli-cooker",
          name: "Idli Cooker",
          series: [
            {
              id: "prime",
              name: "Prime",
              options: [
                { id: "idli-prime-ni", name: "Non-Induction", sizes: ["4 Plates", "5 Plates", "6 Plates"], skus: ["SIC4P", "SIC5P", "SIC6P"] }
              ]
            },
            {
              id: "supreme",
              name: "Supreme",
              options: [
                { id: "idli-sup-ni", name: "Non-Induction", sizes: ["4 Plates", "5 Plates", "6 Plates"], skus: ["SIC4S", "SIC5S", "SIC6S"] },
                { id: "idli-sup-ind", name: "Induction", sizes: ["4 Plates", "5 Plates", "6 Plates"], skus: ["SIC4IS", "SIC5IS", "SIC6IS"] }
              ]
            }
          ],
        },
        {
          id: "multi-kadai",
          name: "Multi Kadai",
          series: [
            {
              id: "prime",
              name: "Prime",
              options: [
                { id: "mk-prime-ni", name: "Non-Induction", sizes: ["4 Plates"], skus: ["SMK4P"] }
              ]
            },
            {
              id: "supreme",
              name: "Supreme",
              options: [
                { id: "mk-sup-ni", name: "Non-Induction", sizes: ["4 Plates", "5 Plates"], skus: ["SMK4S", "SMK5S"] },
                { id: "mk-sup-ind", name: "Induction", sizes: ["4 Plates", "5 Plates"], skus: ["SMK4IS", "SMK5IS"] }
              ]
            }
          ],
        },
      ],
    }

    ,

    {
      id: "spares",
      name: "Pressure Cooker Spares",

      sub_categories: [

        /* ================= GASKET (Pressure Cooker Spares – catalog) ================= */
        {
          id: "gasket",
          name: "Gasket",
          image: "asset/spares/Gasket.png",
          series: [
            {
              id: "outer-lid",
              name: "Outer Lid",
              options: [
                { id: "baby", name: "Baby", sizes: ["1-1.5 L"], skus: ["SGOB"] },
                { id: "baby-ss", name: "Baby SS", sizes: ["1-1.5 L"], skus: ["SGOBSS"] },
                { id: "mini", name: "Mini", sizes: ["2-3.5 L"], skus: ["SGOM"] },
                { id: "mini-ss", name: "Mini SS", sizes: ["2-3.5 L"], skus: ["SGOMSS"] },
                { id: "junior", name: "Junior", sizes: ["4-5.5 L"], skus: ["SGOJ"] },
                { id: "junior-ss", name: "Junior SS", sizes: ["4-5.5 L"], skus: ["SGOJSS"] },
                { id: "senior", name: "Senior", sizes: ["6.5-12 L"], skus: ["SGOS"] },
                { id: "jumbo", name: "Jumbo", sizes: ["16-24 L"], skus: ["SGOJM"] }
              ]
            },
            {
              id: "inner-lid",
              name: "Inner Lid",
              options: [
                { id: "baby", name: "Baby", sizes: ["1-1.5 L"], skus: ["SGIB"] },
                { id: "baby-wide", name: "Baby Wide", sizes: ["2 L"], skus: ["SGIBW"] },
                { id: "mini", name: "Mini", sizes: ["2-3.5 L"], skus: ["SGIM"] },
                { id: "mini-wide", name: "Mini Wide", sizes: ["3-3.5 L"], skus: ["SGIMW"] },
                { id: "junior", name: "Junior", sizes: ["4-7 L"], skus: ["SGIJ"] },
                { id: "senior", name: "Senior", sizes: ["8-12 L"], skus: ["SGIS"] },
                { id: "jumbo", name: "Jumbo", sizes: ["18-24 L"], skus: ["SGLJM"] }
              ]
            }
          ]
        },

        /* ================= SAFETY VALVE ================= */
        {
          id: "safety-valve",
          name: "Safety Valve",
          image: "asset/spares/safety-values.png",
          series: [
            { id: "inner", name: "Inner", options: [{ id: "inner", name: "Inner", sizes: ["Inner"], skus: ["SSVI"] }] },
            { id: "outer", name: "Outer", options: [{ id: "outer", name: "Outer", sizes: ["Outer"], skus: ["SSVO"] }] }
          ]
        },

        /* ================= WEIGHT VALVE (WHISTLE) ================= */
        {
          id: "weight",
          name: "Weight (Whistle)",
          image: "asset/spares/weight.png",
          series: [
            {
              id: "valve-assembly",
              name: "Weight Valve Assembly",
              options: [
                { id: "pvc", name: "PVC", sizes: ["All Sizes"], skus: ["SWOP"] },
                { id: "apple", name: "Apple", sizes: ["All Sizes"], skus: ["SWOA"] },
                { id: "stainless-steel", name: "S.S (Stainless Steel)", sizes: ["All Sizes"], skus: ["SWOS"] }
              ]
            },
            {
              id: "weight-set",
              name: "Weight Set",
              options: [
                { id: "inner", name: "Weight Set Inner", sizes: ["All Inner Sizes"], skus: ["SWSI"] },
                { id: "outer", name: "Weight Set Outer", sizes: ["All Outer Sizes"], skus: ["SWSO"] }
              ]
            }
          ]
        },

        /* ================= HANDLE ================= */
        {
          id: "handle",
          name: "Handle",
          image: "asset/spares/hangle.png",
          series: [
            {
              id: "back-handle",
              name: "Back Handle",
              options: [
                { id: "inner", name: "Inner", sizes: ["Inner"], skus: ["SHUS"] },
                { id: "outer", name: "Outer", sizes: ["Outer"], skus: ["SHOJS"] }
              ]
            },
            {
              id: "outer-handle",
              name: "Outer Handle",
              options: [
                { id: "small-set", name: "Small Set", sizes: ["1L", "1.5L", "2L", "3L", "3.5L"], skus: ["SHOMR"] },
                { id: "big-set", name: "Big Set", sizes: ["4L", "5L", "5.5L", "6.5L", "7.5L", "10L", "12L"], skus: ["SHOJR"] }
              ]
            },
            {
              id: "inner-handle",
              name: "Inner Handle",
              options: [
                { id: "small-set", name: "Small Set", sizes: ["1L", "1.5L", "2L"], skus: ["SHIM"] },
                { id: "big-set", name: "Big Set", sizes: ["3L", "3.5L", "5L", "5.5L", "6.5L", "8L", "10L", "12L"], skus: ["SHIJ"] }
              ]
            },
            {
              id: "strip-handle",
              name: "Strip Handle",
              options: [
                { id: "inner", name: "Inner", sizes: ["Inner"], skus: ["SHUST"] }
              ]
            }
          ]
        }
      ]
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
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200 py-4 px-2 sm:px-4 ">
        <div className="flex overflow-x-scroll overflow-y-hidden space-x-6 pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {menuData.map((main) => (
            <button
              key={main.id}
              onClick={(e) => handleCategoryClick(main.name.toLowerCase(), main.name, e)}
              className="flex flex-col items-center min-w-fit space-y-2 group"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 p-3 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                <img
                  src={`/asset/images/${main.name === "Pressure Cooker"
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
                              : main.name === "Spares"
                                ? "Spares"
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
      <div className="hidden lg:flex category-nav sticky top-0 z-[100] items-center justify-center bg-white/95 backdrop-blur-md border-b border-gray-100 space-x-1 mt-0 text-sm font-medium py-1 shadow-sm">
        {/* Display all categories */}
        {menuData.map((main) => (
          <div
            key={main.id}
            className="group"
            onMouseEnter={() => setHoveredMain(main.id)}
            onMouseLeave={(e) => {
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
            {/* MAIN CATEGORY BUTTON */}
            <button
              onClick={(e) => handleCategoryClick(main.name.toLowerCase(), main.name, e)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${hoveredMain === main.id
                ? "text-red-600 bg-red-50/50"
                : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                }`}
              onMouseEnter={() => {
                setHoveredMain(main.id);
                // Auto-select first subcategory, series and option to ensure sizes show immediately
                if (main.sub_categories?.[0]) {
                  const firstSub = main.sub_categories[0];
                  setHoveredSub(firstSub.id);
                  if (firstSub.series?.[0]) {
                    const firstSer = firstSub.series[0];
                    setHoveredSeries(firstSer.id);
                    if (firstSer.options?.[0]) {
                      setHoveredOption(firstSer.options[0].id);
                    }
                  }
                }
              }}
            >
              <div className="w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <img
                  src={`/asset/images/${main.name === "Pressure Cooker"
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
              <span className=" tracking-tight">{main.name}</span>
              <FaChevronDown className={`text-[16px] transition-transform duration-300 ${hoveredMain === main.id ? 'rotate-180 text-red-500' : 'text-gray-400'}`} />
            </button>

            {/* MEGA MENU */}
            {hoveredMain === main.id && (
              <div
                data-mega-menu={main.id}
                className="
                  absolute
                  top-[85%]
                  left-1/2
                  -translate-x-1/2
                  bg-white
                  backdrop-blur-xl
                  shadow-[0_20px_50px_rgba(0,0,0,0.15)] 
                  z-[9999]
                  p-6
                  w-[1100px]
                  flex
                  space-x-6
                  max-h-[75vh]
                  overflow-y-auto
                  rounded-2xl
                  border border-gray-100/50
                  mt-0
                  animate-in 
                  fade-in 
                  slide-in-from-top-2
                  duration-300
                  before:content-['']
                  before:absolute
                  before:top-[-20px]
                  before:left-0
                  before:right-0
                  before:h-[20px]
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
                <div className="w-[33%] space-y-2 border-r border-gray-100 pr-4">
                  <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-6 px-2">Sub Categories</h3>
                  {main.sub_categories?.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={(e) => handleCategoryClick(sub.name.toLowerCase(), sub.name, e)}
                      className={`w-full group/sub flex items-center p-3 transition-all duration-300 ${hoveredSub === sub.id
                        ? "bg-red-50/50 border-l-4 border-red-500 rounded-r-xl"
                        : "hover:bg-gray-50 border-l-4 border-transparent rounded-xl"
                        }`}
                      onMouseEnter={() => {
                        setHoveredSub(sub.id);
                        // Auto-select first series and option when switching subcategories
                        if (sub.series?.[0]) {
                          setHoveredSeries(sub.series[0].id);
                          if (sub.series[0].options?.[0]) {
                            setHoveredOption(sub.series[0].options[0].id);
                          } else {
                            setHoveredOption(null);
                          }
                        } else {
                          setHoveredSeries(null);
                          setHoveredOption(null);
                        }
                      }}
                    >
                      <div className={`w-14 h-14 rounded-xl bg-white p-2 flex items-center justify-center shadow-sm border border-gray-100 transition-transform duration-300 group-hover/sub:scale-105 ${hoveredSub === sub.id ? 'ring-1 ring-red-100' : ''}`}>
                        <img
                          src={sub.id === "appampatra" ? appampatraImg : sub.id === "elite-tadkapan" ? tadkapanImg : sub.id === "honeycomb-elite" ? honeycombEliteImg : sub.id === "multi-kadai" ? multiKadaiImg : sub.id === "gasket" ? gasketImg : sub.id === "safety-valve" ? safetyValveImg : sub.id === "weight" ? weightWhistleImg : sub.id === "handle" ? handleImg : `/asset/images/${sub.id === "2-burner-stoves"
                            ? "2b"
                            : sub.id === "3-burner-stoves"
                              ? "3b"
                              : sub.name === "Inner Lid"
                                ? "inner"
                                : sub.name === "Outer Lid"
                                  ? "outter"
                                  : sub.name === "2 Burner" || sub.name === "2 Burner Stoves"
                                    ? "2b"
                                    : sub.name === "3 Burner" || sub.name === "3 Burner Stoves"
                                      ? "3b"
                                      : sub.name === 'Aluminium'
                                        ? "tandoor"
                                        : sub.name === 'Galvanised Iron' || sub.name === 'Galvanized Iron'
                                          ? "tandoor"
                                          : sub.name === "450 Watt"
                                            ? "450"
                                            : sub.name === "750 Watt"
                                              ? "750"
                                              : sub.name === "900 Watt"
                                                ? "750"
                                                : sub.name === "1000 Watt"
                                                  ? "1000"
                                                  : sub.name === "Tawa"
                                                    ? "tawa"
                                                    : sub.name === "Appampatra" || sub.name === "Appampatra Non-Stick" || sub.name === "Luxor Dosa Tawa" || sub.name === "Classic Dosa Tawa"
                                                      ? "tawa"
                                                      : sub.name === "Kadai"
                                                        ? "kadai"
                                                        : sub.name === "Fry Pan" || sub.name === "Frypan"
                                                          ? "frypan"
                                                          : sub.name === "Sauce Pan" || sub.name === "Handi"
                                                            ? "kadai"
                                                            : sub.name === "Supreme Kadai" || sub.name === "Elite Triply Stainless Steel" || sub.name === "Elite Triply Tadkapan" || sub.name === "Honeycomb Elite Triply"
                                                              ? "kadai"
                                                              : sub.name === "Idli Cooker"
                                                                ? "idli"
                                                                : sub.name === "Multi Kadai"
                                                                  ? "kadai"
                                                                  : /Dosa Tawa|Roti Tawa/i.test(sub.name)
                                                                    ? "tawa"
                                                                    : "pressure_cooker"
                            }.jpg`}
                          alt={sub.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const t = e.target;
                            if (main.id === "gas-stove") t.src = "/asset/images/GasStove.png";
                            else t.style.display = "none";
                          }}
                        />
                      </div>
                      <div className="ml-4 text-left">
                        <h4 className={`font-bold text-[15px] transition-colors duration-300 ${hoveredSub === sub.id ? "text-red-600" : "text-gray-800"}`}>
                          {sub.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 font-medium opacity-70 mt-0.5">Explore Range</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* COLUMN 2 – For Gas Stove / Gas Tandoor: only series names; else 34% */}
                <div className="space-y-6 px-4 w-[34%] border-r border-gray-100">
                  <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-6 px-2">
                    {main.id === "gas-tandoor" || main.id === "mixer-grinder" || main.id === "cookware" ? "Products" : "Featured Series"}
                  </h3>
                  {!hoveredSub && (
                    <div className="flex flex-col items-center justify-center h-48 opacity-40 px-10 text-center">
                      <p className="text-xs font-medium">Select a sub category</p>
                    </div>
                  )}
                  {(main.id === 'gas-stove' || main.id === 'gas-tandoor') ? (
                    main.sub_categories
                      ?.filter((s) => s.id === hoveredSub)
                      .flatMap((s) => s.series ?? [])
                      .map((ser) => (
                        <button
                          key={ser.id}
                          onClick={() => setHoveredSeries(ser.id)}
                          onMouseEnter={() => {
                            setHoveredSeries(ser.id);
                            if (ser.options?.[0]) setHoveredOption(ser.options[0].id);
                          }}
                          className={`w-full flex items-center space-x-2 px-4 py-3 rounded-xl text-left transition-all duration-200 ${hoveredSeries === ser.id
                            ? "bg-red-50 border-l-4 "
                            : "hover:bg-gray-50 border-l-4 border-transparent"
                            }`}
                        >
                          <span className={`w-2 h-2 rounded-full shrink-0 ${hoveredSeries === ser.id ? 'bg-red-600' : 'bg-gray-300'}`} />
                          <span className={`font-semibold text-[12px] tracking-wider ${hoveredSeries === ser.id ? 'text-red-600' : 'text-gray-900'}`}>
                            {ser.name}
                          </span>
                        </button>
                      ))
                  ) : (
                    main.sub_categories
                      .filter((s) => s.id === hoveredSub)
                      .flatMap((s) =>
                        s.series?.map((ser) => (
                          <div key={ser.id} className="space-y-3">
                            {ser.name && (
                              <div className="flex items-center space-x-2 px-2">
                                <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${hoveredSeries === ser.id ? 'bg-red-600' : 'bg-gray-300'}`}></span>
                                <h4 className={`font-semibold text-[12px] uppercase tracking-wider transition-colors duration-300 ${hoveredSeries === ser.id ? 'text-red-600' : 'text-gray-900'}`}>
                                  {ser.name}
                                </h4>
                              </div>
                            )}

                            <div className="flex flex-col space-y-1">
                              {ser.options?.map((opt) => (
                                <button
                                  key={opt.id}
                                  onClick={(e) => handleCategoryClick(opt.name.toLowerCase(), opt.name, e)}
                                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${hoveredOption === opt.id
                                    ? "bg-red-50 border-l-4 border-red-500 shadow-sm"
                                    : "hover:bg-gray-50 border-l-4 border-transparent"
                                    }`}
                                  onMouseEnter={() => {
                                    setHoveredOption(opt.id);
                                    setHoveredSeries(ser.id);
                                  }}
                                >
                                  <span className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-300 ${hoveredOption === opt.id ? 'bg-red-600' : 'bg-gray-300'}`} />
                                  <span className={`font-semibold text-[13px] tracking-wide transition-colors duration-300 ${hoveredOption === opt.id ? 'text-red-600' : 'text-gray-700'}`}>
                                    {opt.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))
                      )
                  )}
                </div>

                {/* COLUMN 3 – For Gas Stove: model names; Cookware/Steam Cookware: Available Sizes; else BURNER, JARS, SKUs, or SIZES */}
                <div className="w-[33%] pl-4">

                  {(() => {
                    if (main.id === 'gas-stove') {
                      const currentSeries = main.sub_categories
                        ?.filter((s) => s.id === hoveredSub)
                        .flatMap((s) => s.series?.filter((ser) => ser.id === hoveredSeries) || [])[0];
                      const options = currentSeries?.options ?? [];
                      return (
                        <>
                          <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-6 px-2">Model</h3>
                          {!hoveredSeries ? (
                            <div className="flex flex-col items-center justify-center h-48 opacity-40 px-10 text-center">
                              <p className="text-xs font-medium">Select a series</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-3">
                              {options.map((opt) => (
                                <button
                                  key={opt.id}
                                  onClick={(e) => handleCategoryClick(opt.name.toLowerCase(), opt.name, e)}
                                  onMouseEnter={() => setHoveredOption(opt.id)}
                                  className={`flex items-center justify-center px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm border transition-all duration-300 active:scale-95 ${hoveredOption === opt.id
                                    ? "bg-red-600 text-white border-red-600 shadow-lg"
                                    : "bg-gray-50 hover:bg-red-600 hover:text-white border-gray-100 hover:border-red-600 hover:shadow-lg"
                                    }`}
                                >
                                  {opt.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    }
                    const opts = main.sub_categories
                      ?.filter((s) => s.id === hoveredSub)
                      .flatMap((s) => s.series?.filter((ser) => ser.id === hoveredSeries) || [])
                      .flatMap((ser) => ser.options?.filter((o) => o.id === hoveredOption) || []);
                    const firstOpt = opts[0];
                    const isCookware = main.id === 'cookware' || main.id === 'steam-cookware' || main.id === 'spares';
                    const items = isCookware
                      ? (firstOpt?.sizes ?? firstOpt?.skus ?? [])
                      : (firstOpt?.burners ?? firstOpt?.jars ?? firstOpt?.skus ?? firstOpt?.sizes ?? []);
                    const label = isCookware
                      ? "Available Sizes"
                      : firstOpt?.burners ? "Burner" : firstOpt?.jars ? "Jars" : firstOpt?.skus ? "SKU / Variant" : "Available Sizes";
                    return (
                      <>
                        <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-6 px-2">{label}</h3>
                        {!hoveredOption ? (
                          <div className="flex flex-col items-center justify-center h-48 opacity-40 px-10 text-center">
                            <p className="text-xs font-medium">Select an option</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            {main.sub_categories
                              .filter((s) => s.id === hoveredSub)
                              .flatMap((s) =>
                                s.series
                                  ?.filter((ser) => ser.id === hoveredSeries)
                                  .flatMap((ser) =>
                                    ser.options
                                      ?.filter((o) => o.id === hoveredOption)
                                      .flatMap((o) => {
                                        const list = isCookware
                                          ? (o.sizes ?? o.skus ?? [])
                                          : (o.burners ?? o.jars ?? o.skus ?? o.sizes ?? []);
                                        const skus = o.skus;
                                        return list.map((item, i) => {
                                          const searchTerm = skus && skus[i] != null ? skus[i] : item;
                                          const displayText = isCookware && o.sizes && o.sizes[i] != null ? o.sizes[i] : item;
                                          return (
                                            <button
                                              key={`${o.id}-${item}-${i}`}
                                              onClick={(e) => handleCategoryClick(String(searchTerm).toLowerCase(), searchTerm, e)}
                                              className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-red-600 hover:text-white transition-all duration-300 font-bold text-xs shadow-sm border border-gray-100 hover:border-red-600 hover:shadow-lg active:scale-95"
                                            >
                                              {displayText}
                                            </button>
                                          );
                                        });
                                      })
                                  )
                              )}
                          </div>
                        )}
                      </>
                    );
                  })()}
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