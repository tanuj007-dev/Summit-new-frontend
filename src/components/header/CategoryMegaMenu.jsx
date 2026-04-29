

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
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
import sparesIcon from "../../assets/Untitled design (17).png";
import gasketIcon from "../../assets/Untitled design (18).png";
import safetyValveIcon from "../../assets/Untitled design (19).png";
import handleIcon from "../../assets/Untitled design (20).png";
import mixer450Img from "../../assets/1. SMGNF2.jpg";
import mixer750Img from "../../assets/1. SMGACE3 (1).jpg";
import mixer1000Img from "../../assets/1. SMGALP4.jpg";
import { staticCategories } from "../../data/staticCategoryCatalog";

const CategoryMegaMenu = () => {
  const navigate = useNavigate();

  const [menuData] = useState(staticCategories);
  const [hoveredMain, setHoveredMain] = useState(null);
  const [hoveredSub, setHoveredSub] = useState(null);
  const [hoveredSeries, setHoveredSeries] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [mobileOpenMainId, setMobileOpenMainId] = useState(null);
  const [mobileStep, setMobileStep] = useState(1);

  const closeMobileMega = () => {
    setMobileStep(1);
    setMobileOpenMainId(null);
    setHoveredMain(null);
    setHoveredSub(null);
    setHoveredSeries(null);
    setHoveredOption(null);
  };

  const openMobileMega = (main) => {
    setMobileStep(1);
    setMobileOpenMainId(main.id);
    setHoveredMain(main.id);
    const firstSub = main.sub_categories?.[0];
    if (firstSub) {
      setHoveredSub(firstSub.id);
      const firstSer = firstSub.series?.[0];
      if (firstSer) {
        setHoveredSeries(firstSer.id);
        if (firstSer.options?.[0]) setHoveredOption(firstSer.options[0].id);
        else setHoveredOption(null);
      } else {
        setHoveredSeries(null);
        setHoveredOption(null);
      }
    } else {
      setHoveredSub(null);
      setHoveredSeries(null);
      setHoveredOption(null);
    }
  };

  // Function to handle category clicks with API integration
  const handleCategoryClick = (searchTerm, category, event, mainId, extraPaths = []) => {
    // Prevent default link behavior
    if (event) {
      event.preventDefault();
    }

    // Close menus upon selection and navigate
    closeMobileMega();

    const formattedMainId = mainId ? mainId.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : '';
    const categoryPath = category.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Build the segments list
    const segments = [];
    if (formattedMainId) segments.push(formattedMainId);
    
    // Add extra segments (subcat, series, etc)
    if (Array.isArray(extraPaths)) {
      extraPaths.forEach(p => {
        if (p) {
          const formatted = p.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          if (formatted && formatted !== formattedMainId) {
            segments.push(formatted);
          }
        }
      });
    }

    // Add final category if it's not already in segments
    if (categoryPath && !segments.includes(categoryPath)) {
      segments.push(categoryPath);
    }

    navigate(`/products/${segments.join('/')}`);
  };

  return (
    <>
      {/* Mobile Category View */}
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200 py-4 px-2 sm:px-4 ">
        <div className="flex overflow-x-scroll overflow-y-hidden space-x-6 pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {menuData.map((main) => (
            <button
              key={main.id}
              onClick={() => openMobileMega(main)}
              className={`flex flex-col items-center min-w-fit space-y-2 group ${mobileOpenMainId === main.id ? "opacity-100 ring-2 ring-[#941007] ring-offset-2 rounded-2xl" : ""}`}
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 p-3 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                <img
                  src={main.id === "spares"
                    ? sparesIcon
                    : `/asset/images/${main.id === "Pressure-Cooker"
                      ? "PressureCooker"
                      : main.id === "gas-stove"
                        ? "GasStove"
                        : main.id === "gas-tandoor"
                          ? "GasTandoor"
                          : main.id === "mixer-grinder"
                            ? "MixerGrinder"
                            : main.id === "steam-cookware"
                              ? "Steam Cookware"
                              : main.id === "cookware"
                                ? "Cookware"
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

      {/* Mobile Mega Menu Panel – full details when a category is opened */}
      {mobileOpenMainId && (
        <>
          <button
            type="button"
            className="lg:hidden fixed inset-0 z-[9997] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={closeMobileMega}
            aria-label="Close menu"
          />
          <div className="lg:hidden fixed inset-x-0 bottom-0 top-[12vh] z-[9998] bg-white/85 backdrop-blur-2xl rounded-t-[2rem] overflow-y-auto shadow-[0_-20px_60px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-full duration-300">
            {(() => {
              const main = menuData.find((m) => m.id === mobileOpenMainId);
              if (!main) return null;
              const isGasStove = main.id === "gas-stove";
              const isGasTandoor = main.id === "gas-tandoor";
              const isCookware = main.id === "cookware" || main.id === "steam-cookware" || main.id === "spares";
              const opts = main.sub_categories
                ?.filter((s) => s.id === hoveredSub)
                .flatMap((s) => s.series?.filter((ser) => ser.id === hoveredSeries) || [])
                .flatMap((ser) => ser.options?.filter((o) => o.id === hoveredOption) || []);
              const firstOpt = opts[0];
              const items = isCookware
                ? (firstOpt?.sizes ?? firstOpt?.skus ?? [])
                : (firstOpt?.burners ?? firstOpt?.jars ?? firstOpt?.skus ?? firstOpt?.sizes ?? []);
              const label = isCookware
                ? "Available Sizes"
                : firstOpt?.burners ? "Burner" : firstOpt?.jars ? "Jars" : firstOpt?.skus ? "SKU / Variant" : "Available Sizes";
              const currentSeries = main.sub_categories
                ?.filter((s) => s.id === hoveredSub)
                .flatMap((s) => s.series?.filter((ser) => ser.id === hoveredSeries) || [])[0];
              const gasStoveOptions = currentSeries?.options ?? [];
              return (
                <>
                  <div className="sticky top-0 z-10 flex items-center justify-between bg-white/40 backdrop-blur-xl border-b border-gray-200/50 px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      {mobileStep > 1 && (
                        <button onClick={() => setMobileStep(prev => prev - 1)} className="p-1 rounded-full text-gray-600 hover:bg-gray-100">
                          <FaChevronLeft className="w-5 h-5" />
                        </button>
                      )}
                      <h2 className="text-lg font-bold text-gray-900">{main.name}</h2>
                    </div>
                    <button
                      type="button"
                      onClick={closeMobileMega}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                      aria-label="Close menu"
                    >
                      <RxCross1 className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="px-3 py-4 pb-12 w-full">
                    {/* Sub Categories */}
                    {mobileStep === 1 && (
                      <section className="animate-[fadeIn_0.3s_ease-in-out]">
                        <h3 className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-3 px-1">Sub Categories</h3>
                        <div className="flex flex-col gap-2">
                          {main.sub_categories?.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => {
                                setHoveredSub(sub.id);
                                const firstSer = sub.series?.[0];
                                if (firstSer) {
                                  setHoveredSeries(firstSer.id);
                                  if (firstSer.options?.[0]) setHoveredOption(firstSer.options[0].id);
                                  else setHoveredOption(null);
                                } else {
                                  setHoveredSeries(null);
                                  setHoveredOption(null);
                                }
                                setMobileStep(2);
                              }}
                              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all border shadow-sm ${hoveredSub === sub.id ? "bg-red-50/90 border-red-200 backdrop-blur-md" : "bg-white/60 border-white/50 backdrop-blur-md"}`}
                            >
                              <div className="w-16 h-16 rounded-lg bg-white/50 p-1.5 flex items-center justify-center border border-white/60 shadow-sm shrink-0">
                                <img
                                  src={sub.id === "gasket" ? gasketIcon : sub.id === "safety-valve" ? safetyValveIcon : sub.id === "weight" ? sparesIcon : sub.id === "handle" ? handleIcon : sub.id === "pressure-cooker-spares" ? sparesIcon : (main.id === "Pressure-Cooker" && sub.id === "outer-lid") ? "/asset/images/inner.jpg" : (main.id === "Pressure-Cooker" && sub.id === "inner-lid") ? "/asset/images/outter.jpg" : sub.name?.includes("450") ? mixer450Img : sub.name?.includes("750") || sub.name?.includes("900") ? mixer750Img : sub.name?.includes("1000") ? mixer1000Img : sub.image ? `/${sub.image}` : sub.id === "appampatra" || sub.id === "non-stick-aluminium-cookware" ? appampatraImg : sub.id === "triply-stainless-steel-cookware" || sub.id === "elite-tadkapan" ? tadkapanImg : sub.id === "honeycomb-triply-stainless-steel-cookware" || sub.id === "honeycomb-elite" ? honeycombEliteImg : sub.id === "multi-kadai" ? multiKadaiImg : `/asset/images/${sub.id === "2-burner-stoves" ? "2b" : sub.id === "3-burner-stoves" ? "3b" : sub.id === "inner-lid" || sub.name === "Inner Lid" || sub.name === "Inner Lid Type" ? "outter" : sub.id === "outer-lid" || sub.name === "Outer Lid" || sub.name === "Outer Lid Type" ? "inner" : sub.name === "2 Burners" || sub.name === "2 Burner Stoves" ? "2b" : sub.name === "3 Burners" || sub.name === "3 Burner Stoves" ? "3b" : sub.name === 'Aluminium' || sub.name === 'Aluminium Base' ? "tandoor" : sub.name === 'Galvanised Iron Base' || sub.name === 'Galvanized Iron Base' ? "tandoor" : sub.name?.includes("450") ? "450" : sub.name?.includes("750") ? "450" : sub.name?.includes("900") ? "450" : sub.name?.includes("1000") ? "1000" : sub.name === "Tawa" ? "tawa" : sub.name === "Appampatra" || sub.name === "Appampatra Non-Stick" || sub.name === "Luxor Dosa Tawa" || sub.name === "Classic Dosa Tawa" ? "tawa" : sub.name === "Kadai" ? "kadai" : sub.name === "Fry Pan" || sub.name === "Frypan" ? "frypan" : sub.name === "Sauce Pan" || sub.name === "Handi" ? "kadai" : sub.name === "Supreme Kadai" || sub.name === "Elite Triply Stainless Steel" || sub.name === "Elite Triply Tadkapan" || sub.name === "Honeycomb Elite Triply" ? "kadai" : sub.name === "Idli Cooker" ? "idli" : sub.name === "Multi Kadai" ? "kadai" : /Dosa Tawa|Roti Tawa/i.test(sub.name) ? "tawa" : main.id === "Pressure-Cooker" ? "PressureCooker" : "pressure_cooker"}.jpg`}
                                  alt=""
                                  className="w-full h-full object-contain"
                                  onError={(e) => { e.target.style.display = "none"; }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className={`font-semibold text-sm ${hoveredSub === sub.id ? "text-[#941007]" : "text-gray-800"}`}>{sub.name}</span>
                                <p className="text-[10px] text-gray-500 font-medium opacity-70 mt-0.5 leading-tight">
                                  {sub.name === "Inner Lid Type" || sub.id === "inner-lid"
                                    ? "The lid sits inside the cooker's mouth and locks against the rim from the bottom—an ultra-secure design that uses internal pressure to stay naturally locked."
                                    : sub.name === "Outer Lid Type" || sub.id === "outer-lid"
                                      ? "The lid sits on top and covers the cooker's mouth like a cap, locking from the outside—providing more internal space and a wide rim for mess-free pouring and easier cleaning."
                                      : sub.name === "Pressure Cooker Spares" || sub.id === "pressure-cooker-spares"
                                        ? "Genuine parts to restore peak pressure performance and extend your cooker’s life."
                                        : sub.name === "Galvanised Iron Base" || sub.name === "Galvanized Iron Base"
                                          ? "Rugged, high-stability base built to withstand intense heat without warping."
                                          : sub.name === "Aluminium Base"
                                            ? "Ultra-conductive base for instant heat transfer and faster, fuel-efficient roasting."
                                            : sub.name === "Idli Cooker" || sub.name === "Idly Cooker"
                                              ? "Premium aluminium construction for rapid steam generation and perfectly fluffy idlies."
                                              : sub.name === "Multi Kadai" || sub.id === "multi-kadai"
                                                ? "Versatile aluminium design for efficient multi-cooking—from steaming idlies to making fresh dhoklas."
                                                : sub.id === "non-stick-aluminium-cookware" || sub.name === "Non-Stick Aluminium Cookware"
                                                  ? "Efficient aluminium construction with a premium non-stick coating for healthy, low-oil cooking and easy cleaning."
                                                  : sub.id === "triply-stainless-steel-cookware" || sub.name === "Triply Stainless Steel Series" || sub.name === "Triply Stainless Steel Cookware"
                                                    ? "Advanced three-layer bonded construction for uniform heat distribution—prevents food burning and ensures professional results."
                                                    : sub.id === "honeycomb-triply-stainless-steel-cookware" || sub.name === "Honeycomb Triply Stainless Steel Series" || sub.name === "Honeycomb Triply Stainless Steel Cookware"
                                                      ? "The ultimate hybrid: honeycomb-textured surface for scratch-resistance and effortless food release with the strength of triply steel."
                                                      : sub.id === "glass-top-gas-stoves" || sub.name === "Glass Top Gas Stoves" || sub.name === "Glass Top"
                                                        ? "Elegant toughened glass finish with high-efficiency brass burners—designed to add a modern touch to your kitchen."
                                                        : sub.id === "stainless-steel-gas-stoves" || sub.name === "Stainless Steel Gas Stoves" || sub.name === "Stainless Steel"
                                                          ? "Classic heavy-duty stainless steel body with a rust-proof finish for maximum durability and effortless daily cleaning."
                                                          : sub.id === "450-watts" || sub.name === "450 Watts"
                                                            ? "Compact and energy-efficient motor—ideal for everyday liquidizing, light grinding, and making fresh chutneys."
                                                            : sub.id === "750-watts" || sub.name === "750 Watts"
                                                              ? "Powerful all-rounder performance for effortless dry grinding and smooth batters—the perfect fit for a busy kitchen."
                                                              : sub.id === "1000-watts" || sub.name === "1000 Watts"
                                                                ? "Professional-grade high-torque motor for heavy-duty grinding of tough spices and large batches in seconds."
                                                                : "Explore Range"}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </section>
                    )}
                    {/* Series / Products */}
                    {mobileStep === 2 && (
                      <section className="animate-[fadeIn_0.3s_ease-in-out]">
                        <h3 className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-3 px-1">
                          {isGasTandoor || main.id === "mixer-grinder" || main.id === "cookware" ? "Products" : "Featured Series"}
                        </h3>
                        {(isGasStove || isGasTandoor)
                          ? main.sub_categories?.filter((s) => s.id === hoveredSub).flatMap((s) => s.series ?? []).map((ser) => (
                            <button
                              key={ser.id}
                              onClick={() => {
                                setHoveredSeries(ser.id);
                                if (ser.options?.[0]) setHoveredOption(ser.options[0].id);
                                else setHoveredOption(null);
                                setMobileStep(3);
                              }}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left border shadow-sm ${hoveredSeries === ser.id ? "bg-red-50 border-red-200" : "bg-white border-gray-100"}`}
                            >
                              <span className="w-2 h-2 rounded-full shrink-0 bg-[#941007]" />
                              <span className={`font-semibold text-sm ${hoveredSeries === ser.id ? "text-[#941007]" : "text-gray-900"}`}>{ser.name}</span>
                            </button>
                          ))
                          : main.sub_categories?.filter((s) => s.id === hoveredSub).flatMap((s) =>
                            s.series?.map((ser) => (
                              <div key={ser.id} className={`mb-3 rounded-2xl overflow-hidden transition-all duration-300 border ${hoveredSeries === ser.id ? "border-red-100 bg-red-50/20 shadow-sm" : "border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]"}`}>
                                {ser.name && (
                                  <div className="p-1.5">
                                    <button
                                      onClick={() => {
                                        setHoveredSeries(ser.id);
                                        if (ser.options?.[0]) setHoveredOption(ser.options[0].id);
                                        else setHoveredOption(null);
                                        setMobileStep(3);
                                      }}
                                      className={`w-full flex items-center justify-between gap-2 p-3 rounded-[12px] text-left transition-colors ${hoveredSeries === ser.id ? "bg-red-50/80" : "bg-transparent"}`}
                                    >
                                      <div className="flex flex-col flex-1">
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full bg-[#941007]" />
                                          <span className={`font-bold text-[13px] uppercase tracking-wide ${hoveredSeries === ser.id ? "text-[#941007]" : "text-[#1d2939]"}`}>{ser.name}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-400 font-medium mt-1 leading-snug line-clamp-2 pl-4">
                                          {ser.name === "Appampatra" && hoveredSub === "non-stick-aluminium-cookware" ? "Specialized non-stick cavities for perfectly crispy, low-oil appams." :
                                            ser.name === "Tawa" && hoveredSub === "non-stick-aluminium-cookware" ? "Wide, flat surface with a premium non-stick coating." :
                                              ser.name === "Kadai" && hoveredSub === "non-stick-aluminium-cookware" ? "Deep-body aluminium construction for healthy sautéing." :
                                                ser.name === "Frypan" && hoveredSub === "non-stick-aluminium-cookware" ? "Essential tool for quick vegetable stir-fries." :
                                                  (ser.name === "Aluminium" || ser.name === "Aluminium") ? "Lightweight, budget-friendly, and perfect for fast everyday cooking." :
                                                    ser.name === "Stainless Steel" ? "Hygienic, rust-free, and built for long-lasting performance." :
                                                      (ser.name === "Triply Stainless Steel" || ser.name === "Triply Stainless-Steel") ? "The gold standard: three-layered construction for even heating." :
                                                        ser.name === "Kadai" && hoveredSub === "honeycomb-triply-stainless-steel-cookware" ? "The ultimate scratch-resistant deep Kadai." :
                                                          ser.name === "Tawa" && hoveredSub === "honeycomb-triply-stainless-steel-cookware" ? "Advanced honeycomb texture for effortless release." :
                                                            ser.name === "Frypan" && hoveredSub === "honeycomb-triply-stainless-steel-cookware" ? "Superior hybrid surface for healthy, low-oil stir-fries." :
                                                              "Explore our premium selection."}
                                        </p>
                                      </div>
                                    </button>
                                  </div>
                                )}
                                {ser.options && ser.options.length > 0 && (
                                  <div className="flex flex-col border-t border-gray-100 bg-gray-50/30">
                                    {ser.options.map((opt) => (
                                      <button
                                        key={opt.id}
                                        onClick={() => {
                                          setHoveredSeries(ser.id);
                                          setHoveredOption(opt.id);
                                          setMobileStep(3);
                                        }}
                                        className="group w-full flex flex-row items-center justify-between px-5 py-3.5 border-b border-gray-100/60 last:border-none hover:bg-red-50 transition-colors text-left"
                                      >
                                        <div className="flex flex-col flex-1 pr-4">
                                          <span className="font-semibold text-[13px] text-[#344054] tracking-wide">{opt.name}</span>
                                          <p className="text-[10px] text-gray-500 font-medium opacity-80 mt-0.5 leading-tight line-clamp-2">
                                            {main.id === "Pressure-Cooker" && opt.name === "Fine" ? "Our most lightweight and budget-friendly aluminium range for effortless everyday cooking." :
                                              main.id === "Pressure-Cooker" && opt.name === "Prime" ? "Thicker aluminium construction for enhanced durability and superior heat distribution." :
                                                main.id === "Pressure-Cooker" && opt.name === "Supreme" ? "The ultimate versatile range, available from 1L to 15L with heavy-duty performance." :
                                                  main.id === "Pressure-Cooker" && opt.name === "Ultimate" ? "Extra-large capacity cookers designed for commercial kitchens and big family feasts." :
                                                    main.id === "Pressure-Cooker" && opt.name === "Heavy" ? "Built for generations: our heaviest-gauge aluminium for maximum strength and longevity." :
                                                      hoveredSub === "triply-stainless-steel-cookware" && opt.name === "Tasla" ? "Versatile triply construction for uniform heating—perfect for kneading, sautéing, or serving fresh meals." :
                                                        hoveredSub === "triply-stainless-steel-cookware" && opt.name === "Kadai" ? "Deep, three-layered body for even heat distribution—ideal for slow-cooking flavor-rich curries and dals." :
                                                          hoveredSub === "triply-stainless-steel-cookware" && opt.name === "Frypan" ? "Superior heat control for perfectly browned cutlets and stir-fried vegetables with minimal sticking." :
                                                            hoveredSub === "triply-stainless-steel-cookware" && opt.name === "Tope" ? "Energy-efficient design that retains heat longer—the healthy choice for boiling milk or simmering soups." :
                                                              hoveredSub === "triply-stainless-steel-cookware" && opt.name === "Casserole" ? "Premium triply build with a precision-fit lid to lock in moisture and keep your dishes warm and nutritious." :
                                                                hoveredSub === "triply-stainless-steel-cookware" && opt.name === "Tadkapan" ? "Robust three-layer design for quick, even heating—essential for the perfect aromatic tempering of your dals." :
                                                                  hoveredSub === "triply-stainless-steel-cookware" && opt.name === "Saucepan" ? "Fast-heating triply steel with a stay-cool handle, designed for making the perfect tea or simmering sauces." :
                                                                    "Select option to view available sizes and variants."}
                                          </p>
                                        </div>
                                        <FaChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-300 group-hover:text-[#941007] group-hover:translate-x-0.5 transition-all" />
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                      </section>
                    )}
                    {/* Column 3: Model / Sizes / SKUs */}
                    {mobileStep === 3 && hoveredSub !== "safety-valve" && (
                      <section className="animate-[fadeIn_0.3s_ease-in-out]">
                        <h3 className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-3 px-1">
                          {main.id === "gas-stove" ? "Model" : label}
                        </h3>
                        {main.id === "gas-stove" ? (
                          <div className="flex flex-col gap-3 px-1">
                            {gasStoveOptions.map((opt) => (
                              <button
                                key={opt.id}
                                onClick={(e) => handleCategoryClick(opt.name.toLowerCase(), opt.name, e, main.id, [hoveredSub])}
                                className="w-full flex flex-row items-center justify-between px-5 py-4 rounded-2xl font-bold text-[13px] bg-white/60 backdrop-blur-md border border-white/50 text-[#1d2939] hover:bg-red-50 hover:text-[#941007] hover:border-red-200 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.03)] focus:scale-95 active:bg-red-100"
                              >
                                <span>{opt.name}</span>
                                <FaChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#941007]" />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3 px-1">
                            {main.sub_categories
                              ?.filter((s) => s.id === hoveredSub)
                              .flatMap((s) =>
                                s.series?.filter((ser) => ser.id === hoveredSeries).flatMap((ser) =>
                                  ser.options?.filter((o) => o.id === hoveredOption).flatMap((o) => {
                                    const list = isCookware ? (o.sizes ?? o.skus ?? []) : (o.burners ?? o.jars ?? o.skus ?? o.sizes ?? []);
                                    const skus = o.skus;
                                    return list.map((item, i) => {
                                      const searchTerm = skus && skus[i] != null ? skus[i] : item;
                                      const displayText = isCookware && o.sizes && o.sizes[i] != null ? o.sizes[i] : item;
                                      return (
                                        <button
                                          key={`${o.id}-${item}-${i}`}
                                          onClick={(e) => handleCategoryClick(String(searchTerm).toLowerCase(), searchTerm, e, main.id, [hoveredSub, hoveredSeries, hoveredOption])}
                                          className="group w-full flex flex-row items-center justify-between px-5 py-4 rounded-2xl font-bold text-[14px] bg-white/60 backdrop-blur-md border border-white/50 text-[#1d2939] hover:bg-red-50 hover:text-[#941007] hover:border-red-200 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.03)] focus:scale-95 active:bg-red-100"
                                        >
                                          <span>{displayText}</span>
                                          <FaChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#941007] group-hover:translate-x-0.5 transition-all duration-300" />
                                        </button>
                                      );
                                    });
                                  })
                                )
                              )}
                          </div>
                        )}
                      </section>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </>
      )}

      {/* Desktop: dim page behind mega menu (below nav z-[100], above page content) */}
      {hoveredMain && !mobileOpenMainId && (
        <div
          className="fixed inset-0 z-[90] hidden bg-black/20 backdrop-blur-md transition-opacity duration-300 lg:block pointer-events-none"
          aria-hidden
        />
      )}

      {/* Desktop Category View */}
      <div className="hidden lg:flex category-nav sticky top-4 z-[100] w-fit mx-auto items-center justify-center bg-white/90 backdrop-blur-lg border border-gray-200/50 space-x-1 text-sm font-medium py-2 px-6 shadow-xl rounded-full transition-all duration-300">
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
              onClick={(e) => handleCategoryClick(main.name.toLowerCase(), main.name, e, main.id)}
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
                  src={main.id === "spares"
                    ? sparesIcon
                    : `/asset/images/${main.id === "Pressure-Cooker"
                      ? "PressureCooker"
                      : main.id === "gas-stove"
                        ? "GasStove"
                        : main.id === "gas-tandoor"
                          ? "GasTandoor"
                          : main.id === "mixer-grinder"
                            ? "MixerGrinder"
                            : main.id === "steam-cookware"
                              ? "Steam Cookware"
                              : main.id === "cookware"
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
                  backdrop-blur-none
                  shadow-[0_20px_50px_rgba(0,0,0,0.15)] 
                  z-[9999]
                  p-6
                  w-[1300px]
                  flex
                  space-x-6
                  max-h-[75vh]
                  overflow-hidden
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
                  style-[webkit-scrollbar:w-1]
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
                <div className="w-[33%] space-y-2 border-r border-gray-100 pr-4 overflow-y-auto max-h-[calc(75vh-3rem)] scrollbar-hide">
                  <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-6 px-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#941007]" />
                    Sub Categories
                  </h3>
                  {main.sub_categories?.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={(e) => handleCategoryClick(sub.name.toLowerCase(), sub.name, e, main.id)}
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
                      <div className={`w-20 h-20 shrink-0 rounded-xl bg-white p-2 flex items-center justify-center shadow-sm border border-gray-100 transition-transform duration-300 group-hover/sub:scale-105 ${hoveredSub === sub.id ? 'ring-1 ring-red-100' : ''}`}>
                        <img
                          src={sub.id === "gasket" ? gasketIcon : sub.id === "safety-valve" ? safetyValveIcon : sub.id === "weight" ? sparesIcon : sub.id === "handle" ? handleIcon : sub.id === "pressure-cooker-spares" ? sparesIcon : (main.id === "Pressure-Cooker" && sub.id === "outer-lid") ? "/asset/images/inner.jpg" : (main.id === "Pressure-Cooker" && sub.id === "inner-lid") ? "/asset/images/outter.jpg" : sub.name.includes("450") ? mixer450Img : sub.name.includes("750") || sub.name.includes("900") ? mixer750Img : sub.name.includes("1000") ? mixer1000Img : sub.image ? `/${sub.image}` : sub.id === "appampatra" || sub.id === "non-stick-aluminium-cookware" ? appampatraImg : sub.id === "triply-stainless-steel-cookware" || sub.id === "elite-tadkapan" ? tadkapanImg : sub.id === "honeycomb-triply-stainless-steel-cookware" || sub.id === "honeycomb-elite" ? honeycombEliteImg : sub.id === "multi-kadai" ? multiKadaiImg : `/asset/images/${sub.id === "2-burner-stoves"
                            ? "2b"
                            : sub.id === "3-burner-stoves"
                              ? "3b"
                              : sub.id === "inner-lid" || sub.name === "Inner Lid" || sub.name === "Inner Lid Type"
                                ? "outter"
                                : sub.id === "outer-lid" || sub.name === "Outer Lid" || sub.name === "Outer Lid Type"
                                  ? "inner"
                                  : sub.name === "2 Burners" || sub.name === "2 Burner Stoves"
                                    ? "2b"
                                    : sub.name === "3 Burners" || sub.name === "3 Burner Stoves"
                                      ? "3b"
                                      : sub.name === 'Aluminium' || sub.name === 'Aluminium Base'
                                        ? "tandoor"
                                        : sub.name === 'Galvanised Iron Base' || sub.name === 'Galvanized Iron Base'
                                          ? "tandoor"
                                          : sub.name.includes("450")
                                            ? "450"
                                            : sub.name.includes("750")
                                              ? "450"
                                              : sub.name.includes("900")
                                                ? "450"
                                                : sub.name.includes("1000")
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
                        <h4 className={`font-bold text-[15px] transition-colors duration-300 ${hoveredSub === sub.id ? "text-[#941007]" : "text-gray-800"}`}>
                          {sub.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 font-medium opacity-70 mt-0.5">
                          {sub.name === "Inner Lid Type"
                            ? "The lid sits inside the cooker's mouth and locks against the rim from the bottom—an ultra-secure design that uses internal pressure to stay naturally locked."
                            : sub.name === "Outer Lid Type"
                              ? "The lid sits on top and covers the cooker's mouth like a cap, locking from the outside—providing more internal space and a wide rim for mess-free pouring and easier cleaning."
                              : sub.name === "Pressure Cooker Spares"
                                ? "Genuine parts to restore peak pressure performance and extend your cooker’s life."
                                : sub.name === "Galvanised Iron Base" || sub.name === "Galvanized Iron Base"
                                  ? "Rugged, high-stability base built to withstand intense heat without warping."
                                  : sub.name === "Aluminium Base"
                                    ? "Ultra-conductive base for instant heat transfer and faster, fuel-efficient roasting."
                                    : sub.name === "Idli Cooker" || sub.name === "Idly Cooker"
                                      ? "Premium aluminium construction for rapid steam generation and perfectly fluffy idlies."
                                      : sub.name === "Multi Kadai"
                                        ? "Versatile aluminium design for efficient multi-cooking—from steaming idlies to making fresh dhoklas."
                                        : sub.id === "non-stick-aluminium-cookware" || sub.name === "Non-Stick Aluminium Cookware"
                                          ? "Efficient aluminium construction with a premium non-stick coating for healthy, low-oil cooking and easy cleaning."
                                          : sub.id === "triply-stainless-steel-cookware" || sub.name === "Triply Stainless Steel Series" || sub.name === "Triply Stainless Steel Cookware"
                                            ? "Advanced three-layer bonded construction for uniform heat distribution—prevents food burning and ensures professional results."
                                            : sub.id === "honeycomb-triply-stainless-steel-cookware" || sub.name === "Honeycomb Triply Stainless Steel Series" || sub.name === "Honeycomb Triply Stainless Steel Cookware"
                                              ? "The ultimate hybrid: honeycomb-textured surface for scratch-resistance and effortless food release with the strength of triply steel."
                                              : sub.id === "glass-top-gas-stoves" || sub.name === "Glass Top Gas Stoves" || sub.name === "Glass Top"
                                                ? "Elegant toughened glass finish with high-efficiency brass burners—designed to add a modern touch to your kitchen."
                                                : sub.id === "stainless-steel-gas-stoves" || sub.name === "Stainless Steel Gas Stoves" || sub.name === "Stainless Steel"
                                                  ? "Classic heavy-duty stainless steel body with a rust-proof finish for maximum durability and effortless daily cleaning."
                                                  : sub.id === "450-watts" || sub.name === "450 Watts"
                                                    ? "Compact and energy-efficient motor—ideal for everyday liquidizing, light grinding, and making fresh chutneys."
                                                    : sub.id === "750-watts" || sub.name === "750 Watts"
                                                      ? "Powerful all-rounder performance for effortless dry grinding and smooth batters—the perfect fit for a busy kitchen."
                                                      : sub.id === "1000-watts" || sub.name === "1000 Watts"
                                                        ? "Professional-grade high-torque motor for heavy-duty grinding of tough spices and large batches in seconds."
                                                        : "Explore Range"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* COLUMN 2 – For Gas Stove / Gas Tandoor: only series names; else 34% */}
                <div className={`space-y-6 px-4 overflow-y-auto max-h-[calc(75vh-3rem)] scrollbar-hide ${hoveredSub === 'safety-valve' ? 'w-[67%]' : 'w-[34%] border-r border-gray-100'}`}>
                  <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-6 px-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#941007]" />
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
                          className={`w-full flex items-center space-x-2 px-4 py-3 rounded-xl text-left transition-all duration-200 ${hoveredSeries === ser.id ? "bg-red-50 border-l-4 border-[#941007]" : "hover:bg-gray-50 border-l-4 border-transparent"}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${hoveredSeries === ser.id ? 'bg-[#941007]' : 'bg-gray-400'}`} />
                          <div className="flex flex-col">
                            <span className={`font-semibold text-[12px] tracking-wider ${hoveredSeries === ser.id ? 'text-[#941007]' : 'text-gray-900'}`}>
                              {ser.name}
                            </span>
                            {main.id === "gas-tandoor" && (
                              <div className="flex flex-col">
                                {ser.name === "Prime" && (
                                  <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                    "Compact 1.5kg budget-friendly design—perfect for quick, everyday roasting."
                                  </p>
                                )}
                                {ser.name === "Pep" && (
                                  <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                    "Sturdier 2kg regular-size build with a thicker body for better durability and heat."
                                  </p>
                                )}
                                {ser.name === "Gold" && (
                                  <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                    "Premium 2kg regular-size build with an aluminium base for fast, even heat transfer."
                                  </p>
                                )}
                                {ser.id === "posh" && (
                                  <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                    "Big-size body for better steam flow and smoky flavor—lightweight and budget-friendly."
                                  </p>
                                )}
                                {ser.name === "Supreme" && (
                                  <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                    "Heavy-duty 2.5kg big-body design for increased steam circulation and professional results."
                                  </p>
                                )}
                                {ser.name === "Heavy" && (
                                  <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                    "Jumbo 3kg body for maximum steam flow, delivering that authentic deep-smoky flavor."
                                  </p>
                                )}
                                {ser.name === "Elite" && (
                                  <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                    "The ultimate 3.5kg powerhouse: extra-thick Jumbo body and lid for the best-in-class Tandoori experience."
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </button>
                      ))
                  ) : (
                    main.sub_categories
                      .filter((s) => s.id === hoveredSub)
                      .flatMap((s) =>
                        s.series?.map((ser) => (
                          <div key={ser.id} className="space-y-3">
                            {ser.name && (
                              <button
                                onClick={(e) => handleCategoryClick(ser.name.toLowerCase(), ser.name, e, main.id, [hoveredSub])}
                                className="flex items-start space-x-2 px-2 text-left w-full group"
                              >
                                {main.id !== "Pressure-Cooker" && (
                                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${hoveredSeries === ser.id ? 'bg-[#941007]' : 'bg-gray-400'}`} />
                                )}
                                <div className="flex flex-col">
                                  <h4 className={`font-semibold text-[12px] uppercase tracking-wider transition-colors duration-300 ${hoveredSeries === ser.id ? 'text-[#941007]' : 'text-gray-900'}`}>
                                    {ser.name}
                                  </h4>
                                  {(ser.name === "Aluminium" || ser.name === "Aluminium") && (
                                    <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed normal-case tracking-normal max-w-[350px]">
                                      "Lightweight, budget-friendly, and perfect for fast everyday cooking."
                                    </p>
                                  )}
                                  {ser.name === "Stainless Steel" && (
                                    <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed normal-case tracking-normal max-w-[350px]">
                                      "Hygienic, rust-free, and built for long-lasting performance and shine."
                                    </p>
                                  )}
                                  {(ser.name === "Triply Stainless Steel" || ser.name === "Triply Stainless-Steel") && (
                                    <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed normal-case tracking-normal max-w-[350px]">
                                      "The gold standard: three-layered construction for even heating and no burning."
                                    </p>
                                  )}
                                  {ser.name === "Appampatra" && hoveredSub === "non-stick-aluminium-cookware" && (
                                    <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed normal-case tracking-normal max-w-[350px]">
                                      "Specialized non-stick cavities for perfectly crispy, low-oil appams and paniyarams that release effortlessly."
                                    </p>
                                  )}
                                  {ser.name === "Tawa" && hoveredSub === "non-stick-aluminium-cookware" && (
                                    <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed normal-case tracking-normal max-w-[350px]">
                                      "Wide, flat surface with a premium non-stick coating—perfect for making smooth, oil-free rotis, parathas, and dosas."
                                    </p>
                                  )}
                                  {ser.name === "Kadai" && hoveredSub === "non-stick-aluminium-cookware" && (
                                    <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed normal-case tracking-normal max-w-[350px]">
                                      "Deep-body aluminium construction for healthy sautéing and preparing flavor-rich curries with minimal oil."
                                    </p>
                                  )}
                                  {ser.name === "Frypan" && hoveredSub === "non-stick-aluminium-cookware" && (
                                    <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed normal-case tracking-normal max-w-[350px]">
                                      "An essential everyday tool for quick vegetable stir-fries and golden-brown cutlets with a mess-free surface."
                                    </p>
                                  )}

                                  {/* Honeycomb Triply Descriptions */}
                                  {ser.name === "Kadai" && hoveredSub === "honeycomb-triply-stainless-steel-cookware" && (
                                    <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed normal-case tracking-normal max-w-[350px]">
                                      "The ultimate scratch-resistant deep Kadai—perfect for heavy-duty sautéing and slow-cooking rich, flavor-packed curries."
                                    </p>
                                  )}
                                  {ser.name === "Tawa" && hoveredSub === "honeycomb-triply-stainless-steel-cookware" && (
                                    <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed normal-case tracking-normal max-w-[350px]">
                                      "Advanced honeycomb texture for effortless release—ideal for making perfectly crisp, oil-free dosas and parathas with metal-spoon safety."
                                    </p>
                                  )}
                                  {ser.name === "Frypan" && hoveredSub === "honeycomb-triply-stainless-steel-cookware" && (
                                    <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed normal-case tracking-normal max-w-[350px]">
                                      "Superior hybrid surface for healthy, low-oil vegetable stir-fries and golden-brown snacks with maximum durability."
                                    </p>
                                  )}
                                  {ser.name === "Prime" && hoveredSub === "idli-cooker" && (
                                    <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed normal-case tracking-normal max-w-[350px]">
                                      "Lightweight aluminium build with acid-washed idly plates and bakelite handles—efficient and budget-friendly."
                                    </p>
                                  )}
                                  {ser.name === "Supreme" && hoveredSub === "idli-cooker" && (
                                    <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed normal-case tracking-normal max-w-[350px]">
                                      "Premium heavy-gauge aluminium with anodised idly plates and reinforced steel-rod handles for long-lasting use."
                                    </p>
                                  )}
                                  {ser.name === "Prime" && hoveredSub === "multi-kadai" && (
                                    <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed normal-case tracking-normal max-w-[350px]">
                                      "Versatile lightweight design with acid-washed plates for Idly, Momos, and Dhokla—the complete budget-friendly snack maker."
                                    </p>
                                  )}
                                  {ser.name === "Supreme" && hoveredSub === "multi-kadai" && (
                                    <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed normal-case tracking-normal max-w-[350px]">
                                      "Heavy-duty multi-cooker with premium anodised plates for Idly, Momos, and Dhokla, featuring extra-strong steel-rod handles."
                                    </p>
                                  )}
                                </div>
                              </button>
                            )}

                            <div className="flex flex-col space-y-1">
                              {ser.options?.map((opt) => (
                                <button
                                  key={opt.id}
                                  onClick={(e) => handleCategoryClick(opt.name.toLowerCase(), opt.name, e, main.id, [hoveredSub, ser.id])}
                                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${hoveredOption === opt.id
                                    ? "bg-red-50 border-l-4 border-[#941007] shadow-sm"
                                    : "hover:bg-gray-50 border-l-4 border-transparent"
                                    }`}
                                  onMouseEnter={() => {
                                    setHoveredOption(opt.id);
                                    setHoveredSeries(ser.id);
                                  }}
                                >
                                  {main.id === "Pressure-Cooker" && (
                                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${hoveredOption === opt.id ? 'bg-[#941007]' : 'bg-gray-400'}`} />
                                  )}
                                  <div className="flex flex-col">
                                    <span className={`font-semibold text-[13px] tracking-wide transition-colors duration-300 ${hoveredOption === opt.id ? 'text-[#941007]' : 'text-gray-700'}`}>
                                      {opt.name}
                                    </span>
                                    {(main.id === "Pressure-Cooker") && (
                                      <div className="flex flex-col">
                                        {opt.name === "Fine" && (
                                          <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                            "Our most lightweight and budget-friendly aluminium range for effortless everyday cooking."
                                          </p>
                                        )}
                                        {opt.name === "Prime" && (
                                          <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                            "Thicker aluminium construction for enhanced durability and superior heat distribution."
                                          </p>
                                        )}
                                        {opt.name === "Supreme" && (
                                          <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                            "The ultimate versatile range, available from 1L to 15L with heavy-duty performance."
                                          </p>
                                        )}
                                        {opt.name === "Ultimate" && (
                                          <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                            "Extra-large capacity cookers designed for commercial kitchens and big family feasts."
                                          </p>
                                        )}
                                        {opt.name === "Heavy" && (
                                          <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                            "Built for generations: our heaviest-gauge aluminium for maximum strength and longevity."
                                          </p>
                                        )}
                                      </div>
                                    )}
                                    {hoveredSub === "triply-stainless-steel-cookware" && opt.name === "Tasla" && (
                                      <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                        "Versatile triply construction for uniform heating—perfect for kneading, sautéing, or serving fresh meals."
                                      </p>
                                    )}
                                    {hoveredSub === "triply-stainless-steel-cookware" && opt.name === "Kadai" && (
                                      <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                        "Deep, three-layered body for even heat distribution—ideal for slow-cooking flavor-rich curries and dals."
                                      </p>
                                    )}
                                    {hoveredSub === "triply-stainless-steel-cookware" && opt.name === "Frypan" && (
                                      <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                        "Superior heat control for perfectly browned cutlets and stir-fried vegetables with minimal sticking."
                                      </p>
                                    )}
                                    {hoveredSub === "triply-stainless-steel-cookware" && opt.name === "Tope" && (
                                      <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                        "Energy-efficient design that retains heat longer—the healthy choice for boiling milk or simmering soups."
                                      </p>
                                    )}
                                    {hoveredSub === "triply-stainless-steel-cookware" && opt.name === "Casserole" && (
                                      <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                        "Premium triply build with a precision-fit lid to lock in moisture and keep your dishes warm and nutritious."
                                      </p>
                                    )}
                                    {hoveredSub === "triply-stainless-steel-cookware" && opt.name === "Tadkapan" && (
                                      <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                        "Robust three-layer design for quick, even heating—essential for the perfect aromatic tempering of your dals."
                                      </p>
                                    )}
                                    {hoveredSub === "triply-stainless-steel-cookware" && opt.name === "Saucepan" && (
                                      <p className="text-[11px] text-gray-500 font-medium opacity-80 mt-1 leading-relaxed max-w-[350px]">
                                        "Fast-heating triply steel with a stay-cool handle, designed for making the perfect tea or simmering sauces."
                                      </p>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))
                      )
                  )}
                </div>

                {/* COLUMN 3 – For Gas Stove: model names; Cookware/Steam Cookware: Available Sizes; else BURNER, JARS, SKUs, or SIZES */}
                {hoveredSub !== 'safety-valve' && (
                  <div className="w-[33%] pl-4 overflow-y-auto max-h-[calc(75vh-3rem)] scrollbar-hide">

                    {(() => {
                      if (main.id === 'gas-stove') {
                        const currentSeries = main.sub_categories
                          ?.filter((s) => s.id === hoveredSub)
                          .flatMap((s) => s.series?.filter((ser) => ser.id === hoveredSeries) || [])[0];
                        const options = currentSeries?.options ?? [];
                        return (
                          <>
                            <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-6 px-2 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#941007]" />
                              Model
                            </h3>
                            {!hoveredSeries ? (
                              <div className="flex flex-col items-center justify-center h-48 opacity-40 px-10 text-center">
                                <p className="text-xs font-medium">Select a series</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-3">
                                {options.map((opt) => (
                                  <button
                                    key={opt.id}
                                    onClick={(e) => handleCategoryClick(opt.name.toLowerCase(), opt.name, e, main.id, [hoveredSub, hoveredSeries])}
                                    onMouseEnter={() => setHoveredOption(opt.id)}
                                    className={`flex items-center justify-center px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm border transition-all duration-300 active:scale-95 ${hoveredOption === opt.id
                                      ? "bg-[#941007] text-white border-[#941007] shadow-lg"
                                      : "bg-gray-50 hover:bg-[#941007] hover:text-white border-gray-100 hover:border-[#941007] hover:shadow-lg"
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
                      const isCookware = main.id === 'cookware' || main.id === 'steam-cookware' || main.id === 'spares' || (main.id === 'Pressure-Cooker' && hoveredSub === 'pressure-cooker-spares');
                      const label = isCookware
                        ? "Available Sizes"
                        : firstOpt?.burners ? "Burner" : firstOpt?.jars ? "Jars" : firstOpt?.skus ? "SKU / Variant" : "Available Sizes";
                      return (
                        <>
                          <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-6 px-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#941007]" />
                            {label}
                          </h3>
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
                                                onClick={(e) => handleCategoryClick(String(searchTerm).toLowerCase(), searchTerm, e, main.id, [hoveredSub, hoveredSeries, hoveredOption])}
                                                className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-[#941007] hover:text-white transition-all duration-300 font-bold text-xs shadow-sm border border-gray-100 hover:border-[#941007] hover:shadow-lg active:scale-95"
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
