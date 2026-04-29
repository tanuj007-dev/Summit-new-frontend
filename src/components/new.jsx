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
                  sizes: ["1.5", "2L", "3L", "5L"],
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
              id: "aluminium",
              name: "Aluminium",
              options: [
                { id: "Fine", name: "Fine", sizes: ["1L", "2L", "3L", "5L"] },
                { id: "Prime", name: "Prime", sizes: ["3L", "5L", "5.5L"] },
                { id: "Supreme", name: "Supreme", sizes: ["1L", "1.5L", "2L", "3L", "5L", "5.5L", "7L", "8L", "10L", "12L", "15L"] },
                { id: "Ultimate", name: "Ultimate", sizes: ["18L", "20L", "22L"] },
                { id: "Heavy", name: "Heavy", sizes: ["5L", "5.5L"] },
              ],
            },
            {
              id: "hard-anodized-aluminium",
              name: "Hard Anodized Aluminium",
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
          name: "2 Burner Stoves",
          series: [
            {
              id: "metal-body-2-burner",
              name: "Metal Body",
              options: [
                { id: "c-mander", name: "C-Mander", burners: ["2-CI"], skus: ["S2BC"] },
                { id: "supreme-2b", name: "Supreme", burners: ["2-CI"], skus: ["S2BS"] },
                { id: "virtus-2-cp", name: "Virtus-2 CP", burners: ["2-BRASS"], skus: ["S2BVCP"] },
                { id: "pigeon", name: "Pigeon", burners: ["2-BRASS"], skus: ["S2BP"] },
                { id: "virtus-2", name: "Virtus-2", burners: ["2-BRASS"], skus: ["S2BV"] },
                { id: "virtus-2-18", name: "Virtus-2 1.8", burners: ["2-BRASS"], skus: ["S2BV1-8"] },
                { id: "oval-2-burner", name: "Oval", burners: ["2-BRASS"], skus: ["S2BO"] },
              ],
            },
            {
              id: "glass-top-2-burner",
              name: "Glass Top",
              options: [
                { id: "nano-glass-black", name: "Nano Glass (Black)", burners: ["2-BRASS"], skus: ["S2BNGB"] },
                { id: "nano-glass-digital", name: "Nano Glass (Digital)", burners: ["2-BRASS"], skus: ["S2BNGD"] },
                { id: "glass-2-burner-black", name: "Glass (Black)", burners: ["2-BRASS"], skus: ["S2BGB"] },
                { id: "glass-2-burner-digital", name: "Glass (Digital)", burners: ["2-BRASS"], skus: ["S2BGD"] },
              ],
            },
          ],
        },
        {
          id: "3-burner-stoves",
          name: "3 Burner Stoves",
          series: [
            {
              id: "metal-body-3-burner",
              name: "Metal Body",
              options: [
                { id: "triple-cook", name: "Triple Cook", burners: ["3-BRASS"], skus: ["S3BTC"] },
                { id: "oval-plain", name: "Oval-Plain", burners: ["3-BRASS"], skus: ["S3BO"] },
                { id: "oval-rainbow", name: "Oval-Rainbow", burners: ["3-BRASS"], skus: ["S3BOR"] },
                { id: "oval-step", name: "Oval-Step", burners: ["3-BRASS"], skus: ["S3BOS"] },
              ],
            },
            {
              id: "glass-top-3-burner",
              name: "Glass Top",
              options: [
                { id: "glass-3-burner-black", name: "Glass (Black)", burners: ["3-BRASS"], skus: ["S3BGB"] },
                { id: "glass-3-burner-digital", name: "Glass (Digital)", burners: ["3-BRASS"], skus: ["S3BGD"] },
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
                { id: "Nutri-Fit", name: "Nutri Fit", jars: ["2 Jar"], skus: ["SMGNF2"] },
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
                { id: "Ace", name: "Ace", jars: ["3 Jar", "4 Jar"], skus: ["SMGACE3", "SMGACE4"] },
                { id: "Elegant", name: "Elegant", jars: ["3 Jar", "4 Jar"], skus: ["SMGEG3", "SMGEG4"] },
              ],
            },
          ],
        },
        {
          id: "900w",
          name: "900 Watt",
          series: [
            {
              id: "curve",
              name: "Curve",
              options: [
                { id: "Curve", name: "Curve", jars: ["4 Jar", "5 Jar"], skus: ["SMGCV4", "SMGCV5"] },
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
                { id: "Alpha", name: "Alpha", jars: ["4 Jar", "5 Jar"], skus: ["SMGALP4", "SMGALP5"] },
                { id: "Royal", name: "Royal", jars: ["4 Jar"], skus: ["SMGRY4"] },
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

    /* ================= APPAMPATRA ================= */

    {
      id: "appampatra",
      name: "Appampatra",
      series: [
        {
          id: "fine",
          name: "Fine",
          options: [
            {
              id: "non-induction",
              name: "Non-Induction",
              sizes: ["SABF"]
            }
          ]
        },
        {
          id: "prime",
          name: "Prime",
          options: [
            {
              id: "non-induction",
              name: "Non-Induction",
              sizes: ["SABP"]
            }
          ]
        },
        {
          id: "grill-supreme",
          name: "Grill Supreme",
          options: [
            {
              id: "non-induction",
              name: "Non-Induction",
              sizes: ["SABGS"]
            }
          ]
        },
        {
          id: "grill-glass-supreme",
          name: "Grill Glass Supreme",
          options: [
            {
              id: "non-induction",
              name: "Non-Induction",
              sizes: ["SABGGS"]
            }
          ]
        },
        {
          id: "heavy",
          name: "Heavy",
          options: [
            {
              id: "non-induction",
              name: "Non-Induction",
              sizes: ["SABH"]
            }
          ]
        }
      ]
    },

    /* ================= PRIME DOSA TAWA ================= */

    {
      id: "prime-dosa-tawa",
      name: "Prime Dosa Tawa",
      series: [
        {
          id: "prime",
          name: "Prime",
          options: [
            {
              id: "non-induction",
              name: "Non-Induction",
              sizes: ["275mm", "300mm"]
            }
          ]
        }
      ]
    },

    /* ================= SUPREME DOSA TAWA ================= */

    {
      id: "supreme-dosa-tawa",
      name: "Supreme Dosa Tawa",
      series: [
        {
          id: "supreme",
          name: "Supreme",
          options: [
            {
              id: "non-induction",
              name: "Non-Induction",
              sizes: ["275mm", "300mm", "310mm"]
            },
            {
              id: "induction",
              name: "Induction",
              sizes: ["275mm", "300mm", "310mm"]
            }
          ]
        }
      ]
    },

    /* ================= HEAVY DOSA TAWA ================= */

    {
      id: "heavy-dosa-tawa",
      name: "Heavy Dosa Tawa",
      series: [
        {
          id: "heavy",
          name: "Heavy",
          options: [
            {
              id: "non-induction",
              name: "Non-Induction",
              sizes: ["275mm", "300mm", "310mm"]
            },
            {
              id: "induction",
              name: "Induction",
              sizes: ["275mm", "300mm", "310mm"]
            }
          ]
        }
      ]
    },

    /* ================= EDGE DOSA TAWA ================= */

    {
      id: "edge-dosa-tawa",
      name: "Edge Dosa Tawa",
      series: [
        {
          id: "smart",
          name: "Smart",
          options: [
            {
              id: "non-induction",
              name: "Non-Induction",
              sizes: ["280mm"]
            },
            {
              id: "induction",
              name: "Induction",
              sizes: ["280mm", "310mm"]
            }
          ]
        }
      ]
    },

    /* ================= CURVE ROTI TAWA ================= */

    {
      id: "curve-roti-tawa",
      name: "Curve Roti Tawa",
      series: [
        {
          id: "concave",
          name: "Concave",
          options: [
            {
              id: "non-induction",
              name: "Non-Induction",
              sizes: ["280mm", "310mm"]
            },
            {
              id: "induction",
              name: "Induction",
              sizes: ["280mm", "310mm"]
            }
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
          id: "Supreme",
          name: "Supreme",
          sizes: ["4 Plates", "5 Plates", "6 Plates"],
        },
        {
          id: "Prime",
          name: "Prime",
          sizes: ["4 Plates", "5 Plates", "6 Plates"],
        }
      ],
    },
    {
      id: "multi-kadai",
      name: "Multi Kadai",
      series: [
        {
          id: "Supreme",
          name: "Supreme",
          options: [
            {
              id: "Steel Lid",
              name: "Steel Lid",
              sizes: ["200mm", "220mm", "240mm", "260mm", "280mm", "300mm"],
            },
            {
              id: "Glass Lid",
              name: "Glass Lid",
              sizes: ["200mm", "220mm", "240mm", "260mm", "280mm", "300mm"],
            }
          ],
        }
      ],
    },
  ],
}

,

  {
  id: "spares",
  name: "Spares",

  sub_categories: [

    /* ================= GASKET ================= */

    {
      id: "gasket",
      name: "Gasket",
      image: "asset/spares/Gasket.png",
      series: [

        {
          id: "outer-lid",
          name: "Outer Lid",
          options: [
            { id: "baby", name: "Baby", sizes: ["1L", "1.5L"], variant: "Aluminium" },
            { id: "baby-ss", name: "Baby SS", sizes: ["1L", "1.5L"], variant: "Stainless Steel" },
            { id: "mini", name: "Mini", sizes: ["2L", "3L", "3.5L"], variant: "Aluminium" },
            { id: "mini-ss", name: "Mini SS", sizes: ["2L", "3L", "3.5L"], variant: "Stainless Steel" },
            { id: "junior", name: "Junior", sizes: ["4L", "5L", "5.5L"], variant: "Aluminium" },
            { id: "junior-ss", name: "Junior SS", sizes: ["4L", "5L", "5.5L"], variant: "Stainless Steel" },
            { id: "senior", name: "Senior", sizes: ["6.5L", "8L", "10L", "12L"] },
            { id: "jumbo", name: "Jumbo", sizes: ["16L", "18L", "20L", "24L"] }
          ]
        },

        {
          id: "inner-lid",
          name: "Inner Lid",
          options: [
            { id: "baby", name: "Baby", sizes: ["1L", "1.5L"] },
            { id: "baby-wide", name: "Baby Wide", sizes: ["2L"] },
            { id: "mini", name: "Mini", sizes: ["2L", "3L", "3.5L"] },
            { id: "mini-wide", name: "Mini Wide", sizes: ["3L", "3.5L"] },
            { id: "junior", name: "Junior", sizes: ["4L", "5L", "7L"] },
            { id: "senior", name: "Senior", sizes: ["8L", "10L", "12L"] },
            { id: "jumbo", name: "Jumbo", sizes: ["18L", "20L", "24L"] }
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
        {
          id: "inner",
          name: "Inner",
          sizes: ["Universal"]
        },
        {
          id: "outer",
          name: "Outer",
          sizes: ["Universal"]
        }
      ]
    },

    /* ================= WEIGHT (WHISTLE) ================= */

    {
      id: "weight",
      name: "Weight (Whistle)",
      image: "asset/spares/weight.png",
      series: [

        {
          id: "valve-assembly",
          name: "Weight Valve Assembly",
          options: [
            { id: "pvc", name: "PVC", sizes: ["Universal"] },
            { id: "apple", name: "Apple Type", sizes: ["Universal"] },
            { id: "stainless-steel", name: "Stainless Steel", sizes: ["Universal"] }
          ]
        },

        {
          id: "weight-set",
          name: "Weight Set",
          options: [
            { id: "inner", name: "Inner", sizes: ["All Inner Sizes"] },
            { id: "outer", name: "Outer", sizes: ["All Outer Sizes"] }
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
            { id: "inner", name: "Inner", sizes: ["Universal"] },
            { id: "outer", name: "Outer", sizes: ["Universal"] }
          ]
        },

        {
          id: "outer-handle",
          name: "Outer Handle",
          options: [
            { id: "small-set", name: "Small Set", sizes: ["1L", "1.5L", "2L", "3L", "3.5L"] },
            { id: "big-set", name: "Big Set", sizes: ["4L", "5L", "5.5L", "6.5L", "7.5L", "10L", "12L"] }
          ]
        },

        {
          id: "inner-handle",
          name: "Inner Handle",
          options: [
            { id: "small-set", name: "Small Set", sizes: ["1L", "1.5L", "2L"] },
            { id: "big-set", name: "Big Set", sizes: ["3L", "3.5L", "5L", "5.5L", "6.5L", "8L", "10L", "12L"] }
          ]
        },

        {
          id: "strip-handle",
          name: "Strip Handle",
          options: [
            { id: "inner", name: "Inner", sizes: ["Universal"] }
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
              <span className="text-xs text-gray-700 text-center whitespace-nowrap group-hover:text-[#941007] transition-colors">
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
                ? "text-[#941007] bg-red-50/50"
                : "text-gray-700 hover:text-[#941007] hover:bg-gray-50"
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
              <FaChevronDown className={`text-[16px] transition-transform duration-300 ${hoveredMain === main.id ? 'rotate-180 text-[#941007]' : 'text-gray-400'}`} />
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
                  <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-6 px-2">Sub   Categories</h3>
                  {main.sub_categories?.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={(e) => handleCategoryClick(sub.name.toLowerCase(), sub.name, e)}
                      className={`w-full group/sub flex items-center p-3 transition-all duration-300 ${hoveredSub === sub.id
                        ? "bg-red-50/50 border-l-4 border-[#941007] rounded-r-xl"
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
                          src={`/asset/images/${sub.name === "Inner Lid"
                            ? "inner"
                            : sub.name === "Outer Lid"
                              ? "outter"
                              : sub.name === "2 Burner" || sub.name === "2 Burner Stoves"
                                ? "2b"
                                : sub.name === "3 Burner" || sub.name === "3 Burner Stoves"
                                  ? "3b"
                                  : sub.name === 'Aluminium'
                                    ? "tandoor"
                                    : sub.name === 'Iron'
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
                                                : sub.name === "Appampatra Non-Stick" || sub.name === "Luxor Dosa Tawa" || sub.name === "Classic Dosa Tawa"
                                                  ? "tawa"
                                                  : sub.name === "Kadai"
                                                    ? "kadai"
                                                    : sub.name === "Frypan"
                                                      ? "frypan"
                                                      : sub.name === "Idli Cooker"
                                                        ? "idli"
                                                        : sub.name === "Multi Kadai"
                                                          ? "kadai"
                                                          : "pressure_cooker"
                            }.jpg`}
                          alt={sub.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="ml-4 text-left">
                        <h4 className={`font-bold text-[15px] transition-colors duration-300 ${hoveredSub === sub.id ? "text-[#941007]" : "text-gray-800"}`}>
                          {sub.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 font-medium opacity-70 mt-0.5">Explore Range</p>
                      </div>
                    </button>
                  ))}
                </div>

                

                {/* COLUMN 3 – BURNER, JARS, SKUs, or SIZES (burners when present, else jars, else skus, else sizes) – hidden for Cookware & Steam Cookware */}
                {main.id !== 'cookware' && (

                  <div className="w-[33%] pl-4">
                    {(() => {
                      const opts = main.sub_categories
                        ?.filter((s) => s.id === hoveredSub)
                        .flatMap((s) => s.series?.filter((ser) => ser.id === hoveredSeries) || [])
                        .flatMap((ser) => ser.options?.filter((o) => o.id === hoveredOption) || []);
                      const firstOpt = opts[0];
                      const items = firstOpt?.burners ?? firstOpt?.jars ?? firstOpt?.skus ?? firstOpt?.sizes ?? [];
                      const label = firstOpt?.burners ? "Burner" : firstOpt?.jars ? "Jars" : firstOpt?.skus ? "SKU / Variant" : "Available Sizes";
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
                                          const list = o.burners ?? o.jars ?? o.skus ?? o.sizes ?? [];
                                          const skus = o.skus;
                                          return list.map((item, i) => {
                                            const searchTerm = skus && skus[i] != null ? skus[i] : item;
                                            return (
                                              <button
                                                key={`${o.id}-${item}-${i}`}
                                                onClick={(e) => handleCategoryClick(String(searchTerm).toLowerCase(), searchTerm, e)}
                                                className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-[#941007] hover:text-white transition-all duration-300 font-bold text-xs shadow-sm border border-gray-100 hover:border-[#941007] hover:shadow-lg active:scale-95"
                                              >
                                                {item}
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
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoryMegaMenu;
