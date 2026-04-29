/** Category tree from mega menu — shared by nav and product detail size hints. */
export const staticCategories = [

    {
      id: "Pressure-Cooker",
      name: "Pressure Cooker",
      sub_categories: [
        {
          id: "outer-lid",
          name: "Outer Lid Type",
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
              description: "Hygienic, rust-free, and built for long-lasting performance and shine.",
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
              description: "The gold standard: three-layered construction for even heating and no burning.",
              options: [{ id: "elite", name: "Elite", sizes: ["1.5L", "2L", "3L", "5L"], }],
            },
          ],
        },
        {
          id: "inner-lid",
          name: "Inner Lid Type",
          series: [
            {
              id: "aluminium",
              name: "Aluminium",
              options: [
                { id: "Fine", name: "Fine", sizes: ["1L", "1.5L", "2L", "3L", "5L"] },
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
              description: "Hygienic, rust-free, and built for long-lasting performance and shine.",
              options: [
                { id: "Desire", name: "Desire", sizes: ["2L", "3L", "5L"] },

              ],
            },
            {
              id: "triply stainless-steel",
              name: "Triply Stainless Steel",
              description: "The gold standard: three-layered construction for even heating and no burning.",
              options: [
                { id: "Elite", name: "Elite", sizes: ["2L", "3L", "5L"] },

              ],
            },
          ],
        },
        {
          id: "pressure-cooker-spares",
          name: "Pressure Cooker Spares",
          series: [
            {
              id: "gasket",
              name: "Gasket",
              options: [
                { id: "outer-baby", name: "Outer Lid - Baby", sizes: ["1-1.5L Aluminium", "1-1.5L Stainless Steel"], skus: ["SGOB"] },
                { id: "outer-mini", name: "Outer Lid - Mini", sizes: ["2-3.5L Aluminium", "2-3.5L Stainless Steel"], skus: ["SGOM"] },
                { id: "outer-junior", name: "Outer Lid - Junior", sizes: ["4-5.5L Aluminium", "4-5.5L Stainless Steel"], skus: ["SGOJ"] },
                { id: "outer-senior", name: "Outer Lid - Senior", sizes: ["6.5-12L Aluminium"], skus: ["SGOS"] },
                { id: "outer-jumbo", name: "Outer Lid - Jumbo", sizes: ["16-24L Aluminium"], skus: ["SGOJM"] },
                { id: "inner-baby", name: "Inner Lid - Baby", sizes: ["1-1.5L"], skus: ["SGIB"] },
                { id: "inner-baby-wide", name: "Inner Lid - Baby Wide", sizes: ["2L"], skus: ["SGIBW"] },
                { id: "inner-mini", name: "Inner Lid - Mini", sizes: ["2-3.5L"], skus: ["SGIM"] },
                { id: "inner-mini-wide", name: "Inner Lid - Mini Wide", sizes: ["3-3.5L"], skus: ["SGIMW"] },
                { id: "inner-junior", name: "Inner Lid - Junior", sizes: ["4-7L"], skus: ["SGIJ"] },
                { id: "inner-senior", name: "Inner Lid - Senior", sizes: ["8-12L"], skus: ["SGIS"] },
                { id: "inner-jumbo", name: "Inner Lid - Jumbo", sizes: ["18-24L"], skus: ["SGLJM"] },
              ],
            },
            {
              id: "safety-valve",
              name: "Safety Valve",
              options: [
                { id: "safety-valve-inner", name: "For Inner Lid Pressure Cooker", sizes: ["Inner"], skus: ["SSVI"] },
                { id: "safety-valve-outer", name: "For Outer Lid Pressure Cooker", sizes: ["Outer"], skus: ["SSVO"] },
              ],
            },
            {
              id: "weight",
              name: "Weight (Whistle)",
              options: [
                { id: "weight-pvc", name: "PVC", sizes: ["All Pressure Cooker Sizes"], skus: ["SWOP"] },
                { id: "weight-apple", name: "Apple", sizes: ["All Pressure Cooker Sizes"], skus: ["SWOA"] },
                { id: "weight-stainless-steel", name: "S.S (Stainless Steel)", sizes: ["All Pressure Cooker Sizes"], skus: ["SWOS"] },
                { id: "weight-set-inner", name: "Weight Set - For Inner Lid", sizes: ["All InnerLid Pressure Cooker Sizes"], skus: ["SWSI"] },
                { id: "weight-set-outer", name: "Weight Set - For Outer Lid", sizes: ["All OuterLid Pressure Cooker Sizes"], skus: ["SWSO"] },
              ],
            },
            {
              id: "handle",
              name: "Handle",
              options: [
                { id: "back-inner", name: "Back Handle - For Inner Lid", sizes: ["5-8L", "8-15L"], skus: ["SHUS"] },
                { id: "back-outer", name: "Back Handle - For Outer Lid", sizes: ["3L", "5-12L", "16-24L"], skus: ["SHOJS"] },
                { id: "outer-small-set", name: "OuterLid Handle - Small Set", sizes: ["1L", "1.5L", "2L", "3L", "3.5L"], skus: ["SHOMR"] },
                { id: "outer-big-set", name: "OuterLid Handle - Big Set", sizes: ["5L", "5.5L", "6.5L", "7.5L", "10L", "12L"], skus: ["SHOJR"] },
                { id: "strip-handle", name: "InnerLid - Strip Handle", sizes: ["1-15L", "18L-22L"], skus: ["SHIST"] },
                { id: "inner-small-set", name: "InnerLid Handle - Small Set", sizes: ["1L", "1.5L", "2L"], skus: ["SHIM"] },
                { id: "inner-big-set", name: "InnerLid Handle - Big Set", sizes: ["3L", "3.5L", "5L", "5.5L", "6.5L", "8L", "10L", "12L", "15L"], skus: ["SHIJ"] },
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
          id: "galvanised-iron-base",
          name: "Galvanised Iron Base",
          series: [
            { id: "prime", name: "Prime", options: [{ id: "prime", name: "Prime", sizes: ["1.5kg"] }] },
            { id: "pep", name: "Pep", options: [{ id: "pep", name: "Pep", sizes: ["2Kg"] }] },
            { id: "posh", name: "Posh (Big)", options: [{ id: "posh", name: "Posh (Big)", sizes: ["2Kg"] }] },
            { id: "supreme", name: "Supreme", options: [{ id: "supreme", name: "Supreme", sizes: ["2.5Kg"] }] },
          ],
        },
        {
          id: "aluminium",
          name: "Aluminium Base",
          series: [
            { id: "gold", name: "Gold", options: [{ id: "gold", name: "Gold", sizes: ["2Kg"] }] },
            { id: "heavy", name: "Heavy", options: [{ id: "heavy", name: "Heavy", sizes: ["3Kg"] }] },
            { id: "elite", name: "Elite", options: [{ id: "elite", name: "Elite", sizes: ["3.5Kg"] }] },
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
              id: "prime",
              name: "Prime",
              options: [
                { id: "idli-prime-ni", name: "Non-Induction Bottom", sizes: ["4 Plates", "5 Plates", "6 Plates"], skus: ["SIC4P", "SIC5P", "SIC6P"] }
              ]
            },
            {
              id: "supreme",
              name: "Supreme",
              options: [
                { id: "idli-sup-ni", name: "Non-Induction Bottom", sizes: ["4 Plates", "5 Plates", "6 Plates"], skus: ["SIC4S", "SIC5S", "SIC6S"] },
                { id: "idli-sup-ind", name: "Induction Bottom", sizes: ["4 Plates", "5 Plates", "6 Plates"], skus: ["SIC4IS", "SIC5IS", "SIC6IS"] }
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
                { id: "mk-prime-ni", name: "Non-Induction Bottom", sizes: ["4 Plates"], skus: ["SMK4P"] }
              ]
            },
            {
              id: "supreme",
              name: "Supreme",
              options: [
                { id: "mk-sup-ni", name: "Non-Induction Bottom", sizes: ["4 Plates", "5 Plates"], skus: ["SMK4S", "SMK5S"] },
                { id: "mk-sup-ind", name: "Induction Bottom", sizes: ["4 Plates", "5 Plates"], skus: ["SMK4IS", "SMK5IS"] }
              ]
            }
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
                { id: "fine-tawa", name: "Fine Dosa Tawa", sizes: ["275mm", "300mm"], skus: ["STMF", "STBF"] },
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
              id: "hc-kadai-series",
              name: "Kadai",
              options: [
                { id: "hc-kadai", name: "With Glass Lid", sizes: ["220mm", "240mm"], skus: ["SKMHGTIE", "SKBHGTIE"] }
              ]
            },
            {
              id: "hc-tawa-series",
              name: "Tawa",
              options: [

                { id: "hc-curve", name: "Curve Roti Tawa", sizes: ["260mm", "280mm"], skus: ["STSHCTIE", "STMHCTIE"] },
                { id: "hc-tawa", name: "Dosa Tawa", sizes: ["280mm"], skus: ["STMHTIE"] }
              ]
            },
            {
              id: "hc-frypan-series",
              name: "Frypan",
              options: [
                { id: "hc-frypan", name: "With Glass Lid", sizes: ["240mm"], skus: ["SFMHGTIE"] }
              ]
            }
          ]
        }
      ]
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
              name: "2 Burners",
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
              name: "3 Burners",
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
              name: "2 Burners",
              options: [
                { id: "triple-cook", name: "Nano Glass", burners: ["2 Burners"], skus: ["S3BTC"] },
                { id: "oval-plain", name: "Full Glass", burners: ["2 Burner"], skus: ["S3BO"] },
              ],
            },
            {
              id: "glass-top-3-burner",
              name: "3 Burners",
              options: [
                { id: "glass-3-burner-black", name: "Full Glass", burners: ["3 Burner"], skus: ["S3BGB"] },

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
          name: "450 Watts",
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
          name: "750 Watts",
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
          name: "1000 Watts",
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
    }
  ];
