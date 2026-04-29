import axiosInstance from '../axiosConfig';
import { Link, useParams, useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState, useContext, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { toast } from 'react-toastify';
import { CartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CategoryMegaMenu from './header/CategoryMegaMenu';
import innerlidShopImg from './assets/WhatsApp Image 2026-04-16 at 5.36.20 PM.jpeg';
import outerlidShopImg from './assets/1. SO5S.jpg';
import aluminiumShopImg from './assets/Untitled design (6).jpg';
import Loading from './Loading';
import hardAnodisedShopImg from './assets/Untitled design (11).jpg';
import stainlessSteelShopImg from './assets/Untitled design (10).jpg';
import triplyStainlessShopImg from './assets/Untitled design (5).jpg';
import gasTandoorShopImg1 from "./assets/gas-tandoor-shop-1.jpg";
import gasTandoorShopImg2 from "./assets/gas-tandoor-shop-2.jpg";
import gasTandoorShopImg3 from "./assets/gas-tandoor-shop-3.jpg";
import gasTandoorShopImg4 from "./assets/gas-tandoor-shop-4.jpg";
import steamIdliCookerShopImg from "../assets/1. SIC4S.jpg";
import steamMultiKadaiShopImg from "../assets/1. SMK4S (1).jpg";
import cwNonStickShopImg from "../assets/Untitled design (14).jpg";
import cwTriplyShopImg from "../assets/1. SKSTIE.jpg";
import cwHoneycombShopImg from "../assets/1. STSHCTIE (1).jpg";
import cwAppampatraShopImg from "../assets/1. SABF (1).jpg";
import cwTawaShopImg from "../assets/1. STMFC.jpg";
import cwKadaiShopImg from "../assets/1. SKSGS (1).jpg";
import cwFrypanShopImg from "../assets/1. SFSS.jpg";
import cwTaslaShopImg from "../assets/1. STSTIE.jpg";
import cwCasseroleShopImg from "../assets/1. SCTIE.jpg";
import cwTadkaPanShopImg from "../assets/1. STPSTIE (1).jpg";
import cwTopeShopImg from "../assets/Untitled design (15).jpg";
import gsStainlessTopShopImg from "../assets/1. S3BGS.jpg";
import gs3BurnerShopImg from "../assets/1. S3BGD (1).jpg";
import gs2BurnerShopImg from "../assets/1. S2BP.jpg";
import gsGlassTopShopImg from "../assets/1. S2BGB.jpg";
import mg450wShopImg from "../assets/1. SMGNF2 (1).jpg";
import mg750wShopImg from "../assets/1. SMGACE3 (2).webp";
import mg1000wShopImg from "../assets/1. SMGALP4 (1).jpg";
import mg3JarsShopImg from "../assets/1. SMGEG3.jpg";
import mg4JarsShopImg from "../assets/1. SMGACE4 (3).webp";
import mg5JarsShopImg from "../assets/1. SMGALP5.jpg";
import LazyImage from './LazyImage';
import { FaTruck, FaUndo, FaWallet, FaStar, FaTrophy, FaShoppingCart, FaChevronRight, FaChevronLeft } from "react-icons/fa";

/** Shared with SmartCookerFinder — unique option values from product keys */
const uniqueValues = (arr, keys) => {
  const allValues = arr
    .flatMap((p) => (Array.isArray(keys) ? keys.map((k) => p[k]) : p[keys]))
    .filter(Boolean)
    .map((v) => String(v).trim())
    .filter((v) => v.length > 0);
  return [...new Set(allValues)].sort();
};

/** Cookware Size pill — collect from product + variants (same keys as dropdown). */
const COOKWARE_SIZE_FIELD_KEYS = ["size", "net_quantity", "capacity", "product_size", "detail_size"];

const pushCookwareSizeToken = (set, v) => {
  if (v == null) return;
  const s = String(v).trim();
  if (s) set.add(s);
};

const collectCookwareSizeTokensForProduct = (p) => {
  const set = new Set();
  for (const k of COOKWARE_SIZE_FIELD_KEYS) pushCookwareSizeToken(set, p?.[k]);
  const vars = p?.variants;
  if (Array.isArray(vars)) {
    for (const v of vars) {
      for (const k of COOKWARE_SIZE_FIELD_KEYS) pushCookwareSizeToken(set, v?.[k]);
    }
  }
  return set;
};

const uniqueCookwareSizesFromProducts = (productsData) => {
  if (!Array.isArray(productsData) || productsData.length === 0) return [];
  const all = new Set();
  for (const p of productsData) {
    collectCookwareSizeTokensForProduct(p).forEach((s) => all.add(s));
  }
  return [...all].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
};

const productMatchesCookwareSizeFilters = (product, selectedSizes) => {
  if (!selectedSizes?.length) return true;
  const tokens = collectCookwareSizeTokensForProduct(product);
  return selectedSizes.some((s) => tokens.has(String(s).trim()));
};

const isInnerLidProduct = (product) => {
  const lidType = product.lid_type || product.subcat_name || product.type || product.series_name || "";
  const productName = product.name || product.product_name || product.title || "";
  const lidTypeStr = String(lidType).toLowerCase();
  const productNameStr = String(productName).toLowerCase();
  return (
    lidTypeStr.includes("innerlid") ||
    lidTypeStr.includes("inner lid") ||
    lidTypeStr.includes("inner-lid") ||
    productNameStr.includes("innerlid") ||
    productNameStr.includes("inner lid") ||
    productNameStr.includes("inner-lid")
  );
};

const isOuterLidProduct = (product) => {
  const lidType = product.lid_type || product.subcat_name || product.type || product.series_name || "";
  const productName = product.name || product.product_name || product.title || "";
  const lidTypeStr = String(lidType).toLowerCase();
  const productNameStr = String(productName).toLowerCase();
  return (
    lidTypeStr.includes("outerlid") ||
    lidTypeStr.includes("outer lid") ||
    lidTypeStr.includes("outer-lid") ||
    productNameStr.includes("outerlid") ||
    productNameStr.includes("outer lid") ||
    productNameStr.includes("outer-lid")
  );
};

/** Shape filter choices for Pressure Cooker (fixed list, exact labels). */
const PC_SHAPE_FILTER_OPTIONS = ["Plain", "C-tura", "Handi", "Pan"];

/**
 * Maps a product to one of `PC_SHAPE_FILTER_OPTIONS` using name + shape fields.
 * Order: C-tura → Handi → Pan (word-ish) → Plain — so specific shapes win over generic wording.
 */
const getPressureCookerShapeForFilter = (product) => {
  const name = (product.product_name || product.name || product.title || "").toLowerCase();
  const sf = (product.shape || product.product_shape || product.form || "").toLowerCase();
  const hay = `${name} ${sf}`;

  if (hay.includes("c-tura") || hay.includes("ctura") || hay.includes("c tura")) return "C-tura";
  if (hay.includes("handi")) return "Handi";
  if (/\bpan\b/i.test(hay)) return "Pan";
  if (hay.includes("plain")) return "Plain";

  return null;
};

const getProductShape = (product) => getPressureCookerShapeForFilter(product);

/** Bottom / induction filter choices for Pressure Cooker (fixed list, exact labels). */
const PC_BOTTOM_FILTER_OPTIONS = ["Non-Induction Compatible", "Induction Compatible"];

/** Material filter choices for Pressure Cooker (fixed list, exact labels). */
const PC_MATERIAL_FILTER_OPTIONS = [
  "Aluminium",
  "Hard Anodised Aluminium",
  "Stainless Steel",
  "Triply Stainless Steel",
];

/**
 * Maps a product to one of `PC_MATERIAL_FILTER_OPTIONS` for filter matching.
 * Order: triply → hard anodised → plain aluminium → stainless.
 */
const getPressureCookerMaterialForFilter = (product) => {
  const name = (product.product_name || product.name || product.title || "").toLowerCase();
  const mat = (product.material || product.material_name || product.series || "").toLowerCase();
  const hay = `${name} ${mat}`;

  const triply =
    /\btriply\b/i.test(hay) ||
    /\btri-ply\b/i.test(hay) ||
    /\b3[\s-]?ply\b/i.test(hay) ||
    hay.includes("three ply") ||
    hay.includes("3ply") ||
    hay.includes("triclad") ||
    hay.includes("tri clad");
  if (triply) return "Triply Stainless Steel";

  if (
    name.includes("hard anodised") ||
    name.includes("hard anodized") ||
    mat.includes("hard anodised") ||
    mat.includes("hard anodized")
  ) {
    return "Hard Anodised Aluminium";
  }

  if (
    name.includes("aluminium") ||
    name.includes("aluminum") ||
    mat.includes("aluminium") ||
    mat.includes("aluminum")
  ) {
    return "Aluminium";
  }

  if (name.includes("stainless") || mat.includes("stainless")) {
    return "Stainless Steel";
  }
  if (
    (name.includes("steel") && !name.includes("alumin") && !name.includes("aluminium")) ||
    (mat.includes("steel") && !mat.includes("alumin") && !mat.includes("aluminium"))
  ) {
    return "Stainless Steel";
  }

  return null;
};

const getBottomInductionType = (p) => {
  const raw = (p.bottom_type || p.bottom || p.base_type || p.induction || p.induction_compatible || "")
    .toString()
    .toLowerCase();
  const name = (p.product_name || p.name || p.title || "").toString().toLowerCase();
  const hay = `${raw} ${name}`;

  if (raw.includes("non") && raw.includes("induction")) return "Non-Induction Compatible";
  if (raw === "non induction" || hay.includes("non induction")) return "Non-Induction Compatible";
  if (raw.includes("gas") || name.includes("gas only")) return "Non-Induction Compatible";

  if (raw.includes("induction") || name.includes("induction")) return "Induction Compatible";

  return null;
};

const buildPressureCookerFilterOptions = (productsData) => {
  return {
    lid_type: ["Inner Lid", "Outer Lid"],
    material: [...PC_MATERIAL_FILTER_OPTIONS],
    size: uniqueValues(productsData, ["size", "net_quantity", "capacity"]),
    shape: [...PC_SHAPE_FILTER_OPTIONS],
    bottom_type: [...PC_BOTTOM_FILTER_OPTIONS],
    cw_material: [],
    cw_cookware: [],
    cw_size: [],
    cw_bottom: [],
    gs_top: [],
    gs_burners: [],
    mg_watts: [],
    mg_jars: [],
  };
};

/** Order of filter pills in ProductGrid (mobile + desktop). */
const FILTER_BAR_PILL_ORDER = ["Lid Type", "Material", "Size", "Shape", "Bottom"];

/** Pressure cooker — shop-by tiles (URLs under `/products/pressure-cooker/...`). */
const PRESSURE_COOKER_SHOP_CATEGORIES = [
  { urlSegment: "innerlid", label: "Inner Lid", image: innerlidShopImg },
  { urlSegment: "outerlid", label: "Outer Lid", image: outerlidShopImg },
  { urlSegment: "aluminium", label: "Aluminium", image: aluminiumShopImg },
  { urlSegment: "hard-anodised-aluminium", label: "Hard Anodised Aluminium", image: hardAnodisedShopImg },
  { urlSegment: "stainless-steel", label: "Stainless Steel", image: stainlessSteelShopImg },
  { urlSegment: "triply-stainless-steel", label: "Triply Stainless Steel", image: triplyStainlessShopImg },
];

/**
 * Gas Tandoor — shop-by tiles (`subcat` route segment → `mapRouteToFilter` → API `subcat_name`).
 * Images: `./assets/gas-tandoor-shop-1.jpg` … `4.jpg` (copies of `src/assets/Untitled design/1–4.jpg` for reliable Vite bundling).
 */
const GAS_TANDOOR_SHOP_CATEGORY_ITEMS = [
  { label: "Regular Size", to: "/products/gas-tandoor/regular-size", image: gasTandoorShopImg1 },
  { label: "Jumbo Size", to: "/products/gas-tandoor/jumbo-size", image: gasTandoorShopImg2 },
  { label: "Galvanised Iron Bottom", to: "/products/gas-tandoor/galvanised-iron-bottom", image: gasTandoorShopImg3 },
  { label: "Aluminium Bottom", to: "/products/gas-tandoor/aluminium-bottom", image: gasTandoorShopImg4 },
];

/** Gas Tandoor product grid — only these pills (plus Sort). */
const GAS_TANDOOR_FILTER_PILL_ORDER = ["Size", "Bottom", "Weight", "Accessories"];

const GT_SIZE_OPTIONS = ["Regular Size", "Jumbo Size"];
const GT_BOTTOM_OPTIONS = ["Galvanised Iron", "Aluminium"];
const GT_WEIGHT_OPTIONS = ["1.5kg", "2kg", "2.5kg", "3kg", "3.5kg"];
const GT_ACCESSORIES_OPTIONS = [
  "Without grill stick and spatula",
  "With grill sticks and spatulas",
];

const buildGasTandoorFilterOptions = () => ({
  lid_type: [],
  material: [],
  size: [],
  shape: [],
  bottom_type: [],
  gt_size: [...GT_SIZE_OPTIONS],
  gt_bottom: [...GT_BOTTOM_OPTIONS],
  gt_weight: [...GT_WEIGHT_OPTIONS],
  gt_accessories: [...GT_ACCESSORIES_OPTIONS],
  sc_type: [],
  sc_plates: [],
  sc_bottom: [],
  cw_material: [],
  cw_cookware: [],
  cw_size: [],
  cw_bottom: [],
  gs_top: [],
  gs_burners: [],
  mg_watts: [],
  mg_jars: [],
});

const gasTandoorProductHaystack = (p) =>
  [
    p?.product_name,
    p?.name,
    p?.title,
    p?.subcat_name,
    p?.material_name,
    p?.series,
    p?.product_id,
    p?.sku,
    p?.description,
  ]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase())
    .join(" ");

/** Weight bucket from name/SKU (1.5kg … 3.5kg). */
const getGasTandoorWeightBucket = (p) => {
  const h = gasTandoorProductHaystack(p);
  if (/3\.5\s*kg|3,5\s*kg|\belite\b/i.test(h)) return "3.5kg";
  if (/3\.0\s*kg|3kg\b|\bheavy\b|sgtha/i.test(h)) return "3kg";
  if (/2\.5\s*kg|\bsupreme\b/i.test(h)) return "2.5kg";
  if (/1\.5\s*kg|1\.5kg|\bprime\b|sgtpra/i.test(h)) return "1.5kg";
  if (/\b2\s*kg\b|2kg|\bpep\b|\bposh\b|\bgold\b/i.test(h)) return "2kg";
  return null;
};

const getGasTandoorSizeBucket = (p) => {
  const h = gasTandoorProductHaystack(p);
  const w = getGasTandoorWeightBucket(p);
  if (w === "3kg" || w === "3.5kg" || w === "2.5kg") return "Jumbo Size";
  if (/jumbo|heavy|elite|posh|supreme/i.test(h)) return "Jumbo Size";
  if (w === "1.5kg" || w === "2kg") return "Regular Size";
  if (/regular|prime|pep|gold|compact|1\.5/i.test(h)) return "Regular Size";
  return null;
};

const getGasTandoorBottomBucket = (p) => {
  const h = gasTandoorProductHaystack(p);
  if (/galvan|galvanis|iron\s*base|gi\s*base/i.test(h)) return "Galvanised Iron";
  if (/aluminium|aluminum|alu\s*base/i.test(h)) return "Aluminium";
  if (/gold|heavy|elite/i.test(h)) return "Aluminium";
  if (/prime|pep|posh|supreme/i.test(h)) return "Galvanised Iron";
  return null;
};

const getGasTandoorAccessoriesBucket = (p) => {
  const h = gasTandoorProductHaystack(p);
  if (/without.*(grill|spat|stick|access)|no\s*(grill|spat|stick)/i.test(h)) {
    return "Without grill stick and spatula";
  }
  if (/with\s*(grill|spat|stick|access)|grill\s*stick|spatul|combo\s*kit/i.test(h)) {
    return "With grill sticks and spatulas";
  }
  return "Without grill stick and spatula";
};

/** Gas Stove — shop-by + filters (`/products/gas-stove/...`). */
const GAS_STOVE_SHOP_CATEGORY_ITEMS = [
  { label: "Stainless steel Top", to: "/products/gas-stove/2-burner-stoves", image: gsStainlessTopShopImg },
  { label: "GlassTop", to: "/products/gas-stove/3-burner-stoves", image: gsGlassTopShopImg },
  { label: "2 Burners", to: "/products/gas-stove/2-burner-stoves/metal-body-2-burner", image: gs2BurnerShopImg },
  { label: "3 Burners", to: "/products/gas-stove/3-burner-stoves", image: gs3BurnerShopImg },
];

const GAS_STOVE_FILTER_PILL_ORDER = ["Top", "Burners"];

const GS_TOP_OPTIONS = ["Stainless Steel", "Glass"];
const GS_BURNERS_OPTIONS = ["3 Burners", "4 Burners"];

const buildGasStoveFilterOptions = () => ({
  lid_type: [],
  material: [],
  size: [],
  shape: [],
  bottom_type: [],
  gt_size: [],
  gt_bottom: [],
  gt_weight: [],
  gt_accessories: [],
  sc_type: [],
  sc_plates: [],
  sc_bottom: [],
  cw_material: [],
  cw_cookware: [],
  cw_size: [],
  cw_bottom: [],
  gs_top: [...GS_TOP_OPTIONS],
  gs_burners: [...GS_BURNERS_OPTIONS],
  mg_watts: [],
  mg_jars: [],
});

const gasStoveProductHaystack = (p) =>
  [
    p?.product_name,
    p?.name,
    p?.title,
    p?.subcat_name,
    p?.material_name,
    p?.series,
    p?.product_id,
    p?.sku,
    p?.description,
    p?.burners,
    p?.burner,
  ]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase())
    .join(" ");

const getGasStoveTopBucket = (p) => {
  const h = gasStoveProductHaystack(p);
  const sku = String(p?.sku || "").toLowerCase();
  const hay = `${h} ${sku}`;
  if (/glass|nano\s*glass|full\s*glass|glass\s*top|s2bngb|s2bngd|s2bgb|s2bgd|s3bgb|s3bgd/.test(hay)) return "Glass";
  if (/stainless|metal\s*body|metal-body|s2bc|s2bs|s2bp|s2bv|s2bo|s3btc|s3bo/.test(hay)) return "Stainless Steel";
  if (/3\s*burner\s*stoves/.test(h) && /glass/.test(h)) return "Glass";
  if (/2\s*burner\s*stoves/.test(h) && /stainless/.test(h)) return "Stainless Steel";
  return null;
};

const getGasStoveBurnersBucket = (p) => {
  const h = gasStoveProductHaystack(p);
  const sku = String(p?.sku || "").toLowerCase();
  const hay = `${h} ${sku}`;
  if (/\bs4b|4\s*burner/.test(hay)) return "4 Burners";
  if (/\bs3b|3\s*burner/.test(hay)) return "3 Burners";
  if (/\bs2b|2\s*burner/.test(hay)) return "2 Burners";
  return null;
};

/** Mixer Grinder — shop-by + filters (`/products/mixer-grinder/...`). */
const MIXER_GRINDER_SHOP_CATEGORY_ITEMS = [
  { label: "450 Watts", to: "/products/mixer-grinder/450w", image: mg450wShopImg },
  { label: "750 Watts", to: "/products/mixer-grinder/750w", image: mg750wShopImg },
  { label: "1000 Watts", to: "/products/mixer-grinder/1000w", image: mg1000wShopImg },
  { label: "With 3 Jars", to: "/products/mixer-grinder?search=3%20jars", image: mg3JarsShopImg },
  { label: "With 4 Jars", to: "/products/mixer-grinder?search=4%20jars", image: mg4JarsShopImg },
  { label: "With 5 Jars", to: "/products/mixer-grinder?search=5%20jars", image: mg5JarsShopImg },
];

const MIXER_GRINDER_FILTER_PILL_ORDER = ["Watts", "No. Of Jars"];

const MG_WATTS_OPTIONS = ["450W", "750W", "1000W"];
const MG_JARS_OPTIONS = ["3Jars", "4Jars", "5Jars"];

const buildMixerGrinderFilterOptions = () => ({
  lid_type: [],
  material: [],
  size: [],
  shape: [],
  bottom_type: [],
  gt_size: [],
  gt_bottom: [],
  gt_weight: [],
  gt_accessories: [],
  sc_type: [],
  sc_plates: [],
  sc_bottom: [],
  cw_material: [],
  cw_cookware: [],
  cw_size: [],
  cw_bottom: [],
  gs_top: [],
  gs_burners: [],
  mg_watts: [...MG_WATTS_OPTIONS],
  mg_jars: [...MG_JARS_OPTIONS],
});

const mixerProductHaystack = (p) => {
  const jarBits = [];
  const j = p?.jars;
  if (Array.isArray(j)) jarBits.push(...j.map(String));
  else if (j) jarBits.push(String(j));
  const vars = p?.variants;
  if (Array.isArray(vars)) {
    for (const v of vars) {
      if (Array.isArray(v?.jars)) jarBits.push(...v.jars.map(String));
      else if (v?.jars) jarBits.push(String(v.jars));
    }
  }
  return [
    p?.product_name,
    p?.name,
    p?.title,
    p?.subcat_name,
    p?.material_name,
    p?.series,
    p?.product_id,
    p?.sku,
    p?.description,
    p?.watt,
    p?.watts,
    p?.power,
    ...jarBits,
  ]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase())
    .join(" ");
};

const getMixerWattsBucket = (p) => {
  const h = mixerProductHaystack(p);
  const sku = String(p?.sku || "").toUpperCase();
  if (/\b1000\b|\b1000w\b|1000\s* watts|smgalp|alpha/i.test(`${h} ${sku}`)) return "1000W";
  if (/\b750\b|\b750w\b|750\s* watts|smgace|smgeg|smgcv/i.test(`${h} ${sku}`)) return "750W";
  if (/\b450\b|\b450w\b|450\s* watts|smgnf|nutri/i.test(`${h} ${sku}`)) return "450W";
  return null;
};

const getMixerJarsBucket = (p) => {
  const h = mixerProductHaystack(p);
  const sku = String(p?.sku || "").toUpperCase();
  const jm = sku.match(/SMG(?:ACE|EG|CV|ALP)(\d)\b/);
  if (jm) {
    const n = parseInt(jm[1], 10);
    if (n === 3) return "3Jars";
    if (n === 4) return "4Jars";
    if (n === 5) return "5Jars";
  }
  if (/5\s*jars?|five\s*jars?/.test(h)) return "5Jars";
  if (/4\s*jars?|four\s*jars?/.test(h)) return "4Jars";
  if (/3\s*jars?|three\s*jars?/.test(h)) return "3Jars";
  return null;
};

/** Steam Cookware — shop-by + filters (routes: `steam-cookware/idli-cooker`, `multi-kadai`). */
const STEAM_COOKWARE_SHOP_CATEGORY_ITEMS = [
  { label: "Idli Cooker", to: "/products/steam-cookware/idli-cooker", image: steamIdliCookerShopImg },
  { label: "Multi Kadai", to: "/products/steam-cookware/multi-kadai", image: steamMultiKadaiShopImg },
];

const STEAM_COOKWARE_FILTER_PILL_ORDER = ["Type", "Plates", "Bottom"];

const SC_TYPE_OPTIONS = ["Idli Cooker", "Multi Kadai"];
const SC_PLATES_OPTIONS = ["4 Plates", "5 Plates", "6 Plates"];
const SC_BOTTOM_OPTIONS = [
  "Non-Induction Compatible Bottom",
  "Induction Compatible Bottom",
];

const buildSteamCookwareFilterOptions = () => ({
  lid_type: [],
  material: [],
  size: [],
  shape: [],
  bottom_type: [],
  gt_size: [],
  gt_bottom: [],
  gt_weight: [],
  gt_accessories: [],
  sc_type: [...SC_TYPE_OPTIONS],
  sc_plates: [...SC_PLATES_OPTIONS],
  sc_bottom: [...SC_BOTTOM_OPTIONS],
  cw_material: [],
  cw_cookware: [],
  cw_size: [],
  cw_bottom: [],
  gs_top: [],
  gs_burners: [],
  mg_watts: [],
  mg_jars: [],
});

const steamProductHaystack = (p) =>
  [
    p?.product_name,
    p?.name,
    p?.title,
    p?.subcat_name,
    p?.material_name,
    p?.series,
    p?.product_id,
    p?.sku,
    p?.description,
    p?.net_quantity,
    p?.size,
  ]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase())
    .join(" ");

const getSteamTypeBucket = (p) => {
  const h = steamProductHaystack(p);
  if (/multi\s*kadai|multi-kadai|\bsmk\b|smk\d/i.test(h)) return "Multi Kadai";
  if (/idli|idli\s*cooker|\bsic\b|sic\d/i.test(h)) return "Idli Cooker";
  return null;
};

const getSteamPlatesBucket = (p) => {
  const h = steamProductHaystack(p);
  if (/6\s*plates?|six\s*plates|sic6|6\s*plate\b/i.test(h)) return "6 Plates";
  if (/5\s*plates?|five\s*plates|sic5|5\s*plate\b/i.test(h)) return "5 Plates";
  if (/4\s*plates?|four\s*plates|sic4|smk4|4\s*plate\b/i.test(h)) return "4 Plates";
  return null;
};

const getSteamBottomBucket = (p) => {
  const h = steamProductHaystack(p);
  const raw = (p?.bottom_type || p?.base_type || p?.induction || "").toString().toLowerCase();
  if (raw.includes("non") && raw.includes("induction")) return "Non-Induction Compatible Bottom";
  if (/non.?induction compatible bottom|non-induction/i.test(h)) return "Non-Induction Compatible Bottom";
  if (/sic\d+is|smk\d+is|induction compatible bottom|induction bottom/i.test(h)) {
    return "Induction Compatible Bottom";
  }
  if (/induction/i.test(h) && !/non/i.test(h)) return "Induction Compatible Bottom";
  return "Non-Induction Compatible Bottom";
};

/** Cookware — shop-by + filters (`/products/cookware/...`). */
const COOKWARE_SHOP_CATEGORY_ITEMS = [
  { label: "Non-Stick Cookware", to: "/products/cookware/non-stick-aluminium-cookware", image: cwNonStickShopImg },
  { label: "Triply Stainless Steel Cookware", to: "/products/cookware/triply-stainless-steel-cookware", image: cwTriplyShopImg },
  {
    label: "Honeycomb Triply Stainless Steel Cookware",
    to: "/products/cookware/honeycomb-triply-stainless-steel-cookware",
    image: cwHoneycombShopImg,
  },
  { label: "Appampatra", to: "/products/cookware/non-stick-aluminium-cookware/appampatra", image: cwAppampatraShopImg },
  { label: "Tawa", to: "/products/cookware/non-stick-aluminium-cookware/tawa", image: cwTawaShopImg },
  { label: "Kadai", to: "/products/cookware/non-stick-aluminium-cookware/kadai", image: cwKadaiShopImg },
  { label: "Frypan", to: "/products/cookware/non-stick-aluminium-cookware/frypan", image: cwFrypanShopImg },
  { label: "Tasla", to: "/products/cookware/triply-stainless-steel-cookware/triply-tasla", image: cwTaslaShopImg },
  { label: "Casserole", to: "/products/cookware/triply-stainless-steel-cookware/triply-casserole", image: cwCasseroleShopImg },
  { label: "TadkaPan", to: "/products/cookware/triply-stainless-steel-cookware/triply-tadkapan", image: cwTadkaPanShopImg },
  { label: "Tope", to: "/products/cookware/triply-stainless-steel-cookware/triply-tope", image: cwTopeShopImg },
];

const COOKWARE_FILTER_PILL_ORDER = ["Material", "Cookware", "Size", "Bottom"];

const CW_MATERIAL_OPTIONS = [
  "Non-Stick Cookware",
  "Triply Stainless Steel",
  "Honeycomb Triply Stainless Steel",
];
const CW_COOKWARE_OPTIONS = [
  "Appampatra",
  "Tawa",
  "Kadai",
  "Frypan",
  "Tasla",
  "Casserole",
  "TadkaPan",
  "Tope",
];
const CW_BOTTOM_OPTIONS = [
  "Non-Induction Compatible Bottom",
  "Induction Compatible Bottom",
];

const buildCookwareFilterOptions = (productsData = []) => ({
  lid_type: [],
  material: [],
  size: [],
  shape: [],
  bottom_type: [],
  gt_size: [],
  gt_bottom: [],
  gt_weight: [],
  gt_accessories: [],
  sc_type: [],
  sc_plates: [],
  sc_bottom: [],
  cw_material: [...CW_MATERIAL_OPTIONS],
  cw_cookware: [...CW_COOKWARE_OPTIONS],
  cw_size: uniqueCookwareSizesFromProducts(productsData),
  cw_bottom: [...CW_BOTTOM_OPTIONS],
  gs_top: [],
  gs_burners: [],
  mg_watts: [],
  mg_jars: [],
});

const cookwareProductHaystack = (p) =>
  [
    p?.product_name,
    p?.name,
    p?.title,
    p?.subcat_name,
    p?.material_name,
    p?.series,
    p?.product_id,
    p?.sku,
    p?.description,
    p?.category,
    p?.bottom_type,
    p?.base_type,
  ]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase())
    .join(" ");

const getCookwareMaterialBucket = (p) => {
  const h = cookwareProductHaystack(p);
  if (/honeycomb|\bhgtie\b|\bhctie\b|\bhc[\s-]*kadai|\bhc[\s-]*tawa|\bhc[\s-]*frypan|mhgtie|bhgtie|shctie|stmhtie|skmhgtie|skbhgtie|sfmhgtie/i.test(h)) {
    return "Honeycomb Triply Stainless Steel";
  }
  if (
    /\btriply\b/i.test(h) ||
    /\b(st|sk|sf|sc|stp|stt)tie\b/i.test(h) ||
    /ststie|sktie|sftie|sctie|stptie|stttie|skxxstie|skxstie|skmtie|skbtie|skxltie|skxxltie|sk3xltie|sk4xltie/i.test(h)
  ) {
    return "Triply Stainless Steel";
  }
  if (
    /non[\s-]*stick|nonstick|appampatra|appam|sabf|sabp|sabgs|sabh|dosa tawa|roti tawa|curve tawa|edge smart|stm[fmbxl]|stb[fmbxl]|stxl|skss|skms|skbs|skxls|sfmw|sfbw|sfvbw|sfxlw/i.test(h)
  ) {
    return "Non-Stick Cookware";
  }
  return null;
};

const getCookwarePieceBucket = (p) => {
  const h = cookwareProductHaystack(p);
  if (/appampatra|appam|\bsab[fphgs]/i.test(h)) return "Appampatra";
  if (/tadka|tadkapan|stpstie|stpmtie|stpbtie/i.test(h)) return "TadkaPan";
  if (/casserole|sctie/i.test(h)) return "Casserole";
  if (/\btasla\b|ststie/i.test(h)) return "Tasla";
  if (/\btope\b|saucepan|\bstttie\b/i.test(h) && !/tadka/i.test(h)) return "Tope";
  if (/frypan|fry pan|sfmw|sfbw|sfvbw|sfxlw|sfmhgtie/i.test(h)) return "Frypan";
  if (/\btawa\b|dosa|roti tawa|curve|stshctie|stmhctie|stmhtie|stmfc|stbfc|stbfeg/i.test(h)) return "Tawa";
  if (
    /\bkadai\b|skxxstie|skxstie|skstie|skmtie|skbtie|skxltie|skxxltie|sk3xltie|sk4xltie|skss|skms|skbs|skxls|skxxls|sk3xls|skmhgtie|skbhgtie/i.test(h)
  )
    return "Kadai";
  return null;
};

const getCookwareBottomBucket = (p) => {
  const h = cookwareProductHaystack(p);
  const raw = (p?.bottom_type || p?.base_type || p?.induction || "").toString().toLowerCase();
  if (raw.includes("non") && raw.includes("induction")) return "Non-Induction Compatible Bottom";
  if (/non.?induction compatible bottom|non-induction|gas only/i.test(h)) return "Non-Induction Compatible Bottom";
  if (/induction compatible bottom|induction bottom|with induction|for induction/i.test(h)) return "Induction Compatible Bottom";
  if (/induction/i.test(h) && !/non[\s-]*induction/i.test(h)) return "Induction Compatible Bottom";
  return "Non-Induction Compatible Bottom";
};

/** Default sort when the grid loads and after Reset. */
const DEFAULT_SORT_BY = "popularity";

/** Sort dropdown — matches common shop UX; values drive `sortBy` + `.sort()` below. */
const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "best-selling", label: "Best Selling" },
  { value: "alpha-asc", label: "Alphabetically, A-Z" },
  { value: "alpha-desc", label: "Alphabetically, Z-A" },
  { value: "price-low-high", label: "Price, low to high" },
  { value: "price-high-low", label: "Price, high to low" },
  { value: "date-new-old", label: "Date, new to old" },
  { value: "date-old-new", label: "Date, old to new" },
];

const productSortName = (p) =>
  String(p?.product_name || p?.name || p?.title || "").trim();

const productDateMs = (p) => {
  const raw = p?.created_at || p?.updated_at || p?.createdAt || p?.modified_at;
  const t = raw ? new Date(raw).getTime() : 0;
  return Number.isFinite(t) ? t : 0;
};

const bestSellingScore = (p) =>
  Number(p?.sold_count ?? p?.sales_count ?? p?.units_sold ?? p?.popularity ?? 0);

/** Filter dropdown row labels — title case for display (values stay unchanged for state/API). */
const toTitleCaseDropdown = (s) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/\b[a-z]/g, (c) => c.toUpperCase());

/** Walk up from `node` and collect elements that can scroll (overflow not visible). */
const getScrollableAncestors = (node) => {
  const list = [];
  let p = node?.parentElement;
  while (p && p !== document.body) {
    const st = window.getComputedStyle(p);
    if (/(auto|scroll|overlay)/.test(st.overflowX) || /(auto|scroll|overlay)/.test(st.overflowY)) {
      list.push(p);
    }
    p = p.parentElement;
  }
  return list;
};

/** Custom Sort by pill + list; dropdown is portaled to body so mobile overflow-x strips cannot clip it. */
function SortByCustomDropdown({ variant, sortBy, setSortBy, isOpen, onToggle, onClose, containerRef, fillWidth, menuPanelRef }) {
  const current = SORT_OPTIONS.find((o) => o.value === sortBy) ?? SORT_OPTIONS[0];
  const isDesktop = variant === "desktop";
  const mobileFill = !isDesktop && fillWidth;
  const [menuCoords, setMenuCoords] = useState(null);

  useLayoutEffect(() => {
    if (!isOpen) {
      setMenuCoords(null);
      return;
    }
    const el = containerRef?.current;
    if (!el) {
      setMenuCoords(null);
      return;
    }
    const measure = () => {
      const r = el.getBoundingClientRect();
      const margin = 12;
      const vw = window.innerWidth;
      const minW = Math.max(r.width, 224);
      let left = r.left;
      if (left + minW > vw - margin) {
        left = Math.max(margin, vw - minW - margin);
      }
      const width = Math.min(minW, vw - 2 * margin);
      setMenuCoords({ top: r.bottom + 6, left, width });
    };
    measure();
    const scrollParents = getScrollableAncestors(el);
    scrollParents.forEach((n) => n.addEventListener("scroll", measure, true));
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      scrollParents.forEach((n) => n.removeEventListener("scroll", measure, true));
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [isOpen, sortBy, containerRef]);

  const sortListPortal =
    isOpen &&
    menuCoords &&
    typeof document !== "undefined" &&
    createPortal(
      <ul
        ref={menuPanelRef}
        role="listbox"
        aria-label="Sort products by"
        className="pointer-events-auto fixed z-[320] max-h-[min(70vh,22rem)] list-none overflow-y-auto rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl"
        style={{
          top: menuCoords.top,
          left: menuCoords.left,
          width: menuCoords.width,
          minWidth: Math.min(224, menuCoords.width),
        }}
      >
        {SORT_OPTIONS.map((opt) => (
          <li key={opt.value} role="option" aria-selected={sortBy === opt.value} className="list-none">
            <label className="group flex cursor-pointer items-center rounded-xl px-2 py-2.5 transition-colors hover:bg-[#FEF2F2] focus-within:bg-[#FEF2F2]">
              <input
                type="checkbox"
                checked={sortBy === opt.value}
                onChange={() => {
                  setSortBy(opt.value);
                  onClose();
                }}
                className="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-[#941007] focus:ring-2 focus:ring-[#941007]/30"
              />
              <span className="ml-3 text-left text-[13px] font-medium leading-snug text-gray-800 transition-colors group-hover:text-gray-950">
                {opt.label}
              </span>
            </label>
          </li>
        ))}
      </ul>,
      document.body
    );

  return (
    <>
      <div
        ref={containerRef}
        className={
          isDesktop
            ? `relative shrink-0 ${isOpen ? "z-[130]" : ""}`
            : `relative shrink-0 ${mobileFill ? "w-full min-w-0" : ""} ${isOpen ? "z-[130]" : ""}`
        }
      >
      <div
        className={
          isDesktop
            ? "inline-flex items-stretch overflow-visible rounded-full border border-[#941007] bg-[#941007] text-white shadow-sm"
            : mobileFill
              ? "flex w-full min-w-0 items-stretch overflow-visible rounded-full border border-[#941007] bg-[#941007] text-white shadow-sm ring-1 ring-[#941007]/40"
              : "inline-flex w-max max-w-none shrink-0 items-stretch overflow-visible rounded-full border border-[#941007] bg-[#941007] text-white shadow-sm ring-1 ring-[#941007]/40"
        }
      >
        <span
          className={
            isDesktop
              ? "flex shrink-0 items-center border-r border-white/25 px-2.5 py-1.5 text-[13px] font-medium text-white underline decoration-white/50 underline-offset-2"
              : "flex shrink-0 items-center whitespace-nowrap border-r border-white/25 px-2.5 py-1.5 text-[13px] font-medium text-white underline decoration-white/50 underline-offset-2"
          }
        >
          Sort by:
        </span>
        <div className={isDesktop ? "relative min-w-0 flex-1" : mobileFill ? "relative min-w-0 flex-1" : "relative shrink-0"}>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label={`Sort by, ${current.label} selected`}
            className={
              isDesktop
                ? "relative flex h-full min-h-[36px] w-full min-w-[6.5rem] items-center justify-between gap-1 px-2 py-1.5 pr-7 text-left text-[13px] font-medium text-white outline-none transition hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/40"
                : mobileFill
                  ? "relative flex min-h-[44px] w-full min-w-0 items-center justify-between gap-1 px-2 py-1.5 pr-7 text-left text-[13px] font-medium text-white outline-none transition hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/40"
                  : "relative flex min-h-[44px] w-max max-w-none items-center justify-between gap-1 px-2 py-1.5 pr-7 text-left text-[13px] font-medium text-white outline-none transition hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/40"
            }
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            <span className={isDesktop || mobileFill ? "min-w-0 flex-1 truncate" : "whitespace-nowrap"}>{current.label}</span>
            <svg
              className={`pointer-events-none absolute right-1.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 shrink-0 transition-transform sm:right-2 ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
      {sortListPortal}
    </>
  );
}

const resolveMainCategory = (routeMain, currentProducts, locState) => {
  let currentMain = routeMain?.toLowerCase().replace(/[-_]/g, " ") || "";
  
  // Direct matches
  if (["pressure cooker", "gas tandoor", "steam cookware", "cookware", "gas stove", "mixer grinder"].includes(currentMain)) {
    return currentMain;
  }
  
  // Check for partial matches in route slug
  if (currentMain.includes("pressure cooker") || currentMain.includes("innerlid") || currentMain.includes("outerlid")) return "pressure cooker";
  if (currentMain.includes("tandoor")) return "gas tandoor";
  if (currentMain.includes("stove")) return "gas stove";
  if (currentMain.includes("mixer") || currentMain.includes("grinder")) return "mixer grinder";
  if (currentMain.includes("steam") || currentMain.includes("idli") || currentMain.includes("multi kadai")) return "steam cookware";
  if (currentMain.includes("cookware")) return "cookware";

  if (locState?.parentCategoryId) {
    const parent = locState.parentCategoryId.toLowerCase().replace(/[-_]/g, " ");
    if (["pressure cooker", "gas tandoor", "steam cookware", "cookware", "gas stove", "mixer grinder"].includes(parent)) return parent;
    if (parent.includes("pressure cooker") || parent.includes("innerlid") || parent.includes("outerlid")) return "pressure cooker";
    if (parent.includes("tandoor")) return "gas tandoor";
    if (parent.includes("stove")) return "gas stove";
    if (parent.includes("mixer") || parent.includes("grinder")) return "mixer grinder";
    if (parent.includes("steam") || parent.includes("idli")) return "steam cookware";
    if (parent.includes("cookware")) return "cookware";
  }

  if (currentProducts?.length > 0) {
    const p = currentProducts[0];
    const cat = String(p.category || p.category_name || p.main_category || p.master_category || "").toLowerCase();
    const n = String(p.product_name || p.name || p.title || "").toLowerCase();
    if (cat.includes("pressure") || n.includes("pressure cooker") || n.includes("innerlid") || n.includes("outerlid")) return "pressure cooker";
    if (cat.includes("tandoor") || n.includes("tandoor")) return "gas tandoor";
    if (cat.includes("stove") || n.includes("stove")) return "gas stove";
    if (cat.includes("mixer") || n.includes("mixer")) return "mixer grinder";
    if (cat.includes("steam") || n.includes("idli") || n.includes("dhokla") || cat.includes("maker")) return "steam cookware";
    if (cat.includes("cookware") || n.includes("tawa") || n.includes("kadai") || n.includes("pan") || n.includes("tasla") || n.includes("tope") || n.includes("casserole")) return "cookware";
  }

  if (locState?.searchTerm) {
    const term = locState.searchTerm.toLowerCase();
    if (term.includes("pressure") || term.includes("cooker") || term.includes("innerlid") || term.includes("outerlid")) return "pressure cooker";
    if (term.includes("tandoor")) return "gas tandoor";
    if (term.includes("stove")) return "gas stove";
    if (term.includes("mixer")) return "mixer grinder";
    if (term.includes("steam") || term.includes("idli") || term.includes("dhokla") || term.includes("maker")) return "steam cookware";
    if (term.includes("cookware") || term.includes("tawa") || term.includes("kadai") || term.includes("pan") || term.includes("tasla") || term.includes("tope") || term.includes("casserole")) return "cookware";
  }
  
  return currentMain;
};

const CategoryPage = ({ isLoggedIn, wishlist, handlewishlist }) => {
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlist] = useState([]);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const [filterOptions, setFilterOptions] = useState({
    lid_type: [],
    material: [],
    size: [],
    shape: [],
    bottom_type: [],
    gt_size: [],
    gt_bottom: [],
    gt_weight: [],
    gt_accessories: [],
    sc_type: [],
    sc_plates: [],
    sc_bottom: [],
    cw_material: [],
    cw_cookware: [],
    cw_size: [],
    cw_bottom: [],
    gs_top: [],
    gs_burners: [],
    mg_watts: [],
    mg_jars: [],
  });

  const [selectedFilters, setSelectedFilters] = useState({
    lid_type: [],
    material: [],
    size: [],
    shape: [],
    bottom_type: [],
    gt_size: [],
    gt_bottom: [],
    gt_weight: [],
    gt_accessories: [],
    sc_type: [],
    sc_plates: [],
    sc_bottom: [],
    cw_material: [],
    cw_cookware: [],
    cw_size: [],
    cw_bottom: [],
    gs_top: [],
    gs_burners: [],
    mg_watts: [],
    mg_jars: [],
    priceRange: [0, 10000],
  });
  const [maxPrice, setMaxPrice] = useState(10000);

  const [sortBy, setSortBy] = useState(DEFAULT_SORT_BY);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(null);
  const [filterDropdownCoords, setFilterDropdownCoords] = useState(null);
  const filterTriggerRefs = useRef({});
  const sortMenuRef = useRef(null);
  const sortMenuPanelRef = useRef(null);
  const filterPanelRef = useRef(null);
  const filterBarScrollRef = useRef(null);
  const mobileFilterBarScrollRef = useRef(null);
  const shopCategoryScrollRef = useRef(null);
  /** Width of mobile filter scroller — one slide per filter (preview). */
  const [mobileFilterSnapWidth, setMobileFilterSnapWidth] = useState(null);
  /** Desktop filter row is separate DOM — render one layout so dropdown anchor refs stay correct. */
  const [desktopFilterBar, setDesktopFilterBar] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
  );

  // Get cart context
  const { handleAddToCart, handleBuyNow } = useContext(CartContext);
  const { addToWishlist, isInWishlist } = useWishlist();

  // Support deep routes
  const { main: routeMain, subcat, series, seriesOption, productSize } = useParams();

  const main = resolveMainCategory(routeMain, products, location.state);

  // Helper function to get product image from S3 presigned URL
  const getProductImage = (product) => {
    // Try different possible image field structures
    if (product?.image) {
      return product.image; // Direct S3 presigned URL
    }
    if (product?.images?.length > 0) {
      // If images is an array of objects with url
      if (product.images[0]?.url) {
        return product.images[0].url;
      }
      // If images is an array of strings
      if (typeof product.images[0] === 'string') {
        return product.images[0];
      }
    }
    // Try variant images
    if (product?.variants?.length > 0) {
      const variant = product.variants[0];
      if (variant?.image) {
        return variant.image;
      }
      if (variant?.images?.length > 0) {
        if (variant.images[0]?.url) {
          return variant.images[0].url; 
        }
        if (typeof variant.images[0] === 'string') {
          return variant.images[0];
        }
      }
    }
    return '/asset/images/dummy-image-square.webp';
  };

  // Helper function to get product price
  const getProductPrice = (product) => {
    // Try different possible price field structures
    if (product?.variants?.length > 0 && product.variants[0]?.price) {
      return Math.floor(product.variants[0].price);
    }
    if (product?.price) {
      return Math.floor(product.price);
    }
    if (product?.mrp) {
      return Math.floor(parseFloat(product.mrp));
    }
    if (product?.selling_price) {
      return Math.floor(product.selling_price);
    }
    // Try to get from detail_id or other fields
    if (product?.detail_price) {
      return Math.floor(parseFloat(product.detail_price));
    }
    return null;
  };

  // Helper function to map route params to API search terms
  const mapRouteToSearch = (param) => {
    if (!param) return '';
    // Convert route format to search format
    // e.g., "Pressure-Cooker" -> "pressure cooker", "inner-lid" -> "inner lid"
    return param.replace(/[-_]/g, ' ').toLowerCase();
  };

  // Helper function to map route params to API filter values
  const mapRouteToFilter = (param) => {
    if (!param) return '';
    if (param.toLowerCase() === 'innerlid') return 'Inner Lid';
    if (param.toLowerCase() === 'outerlid') return 'Outer Lid';
    // Convert route format to filter format
    // e.g., "inner-lid" -> "Inner Lid", "stainless-steel" -> "Stainless Steel"
    return param.split(/[-_]/).map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };
  const toSentenceCase = (text = "") => {
    return text
      .toLowerCase()
      .replace(/^\w/, (char) => char.toUpperCase());
  };

  const getProduct = async () => {
    setIsLoading(true);
    // Map route parameters to initial filter state
    const subcatName = mapRouteToFilter(subcat);
    const seriesName = mapRouteToFilter(series);
    const optionName = mapRouteToFilter(seriesOption);
    const mainNorm = main?.toLowerCase().replace(/[-_]/g, " ") || "";

    const initialFilters = {
      lid_type: [],
      material: [],
      size: [],
      shape: [],
      bottom_type: [],
      gt_size: [],
      gt_bottom: [],
      gt_weight: [],
      gt_accessories: [],
      sc_type: [],
      sc_plates: [],
      sc_bottom: [],
      cw_material: [],
      cw_cookware: [],
      cw_size: [],
      cw_bottom: [],
      gs_top: [],
      gs_burners: [],
      mg_watts: [],
      mg_jars: [],
      priceRange: [0, maxPrice > 0 ? maxPrice : 10000],
    };

    if (subcatName) {
      const materials = ["Aluminium", "Hard Anodised Aluminium", "Stainless Steel", "Triply Stainless Steel", "Glass"];
      if (mainNorm === "pressure cooker") {
        if (materials.includes(subcatName)) initialFilters.material = [subcatName];
        else if (subcatName.includes("Lid")) initialFilters.lid_type = [subcatName];
        else initialFilters.lid_type = [subcatName]; // Default fallback
      } else if (mainNorm === "cookware") {
        if (materials.includes(subcatName)) initialFilters.cw_material = [subcatName];
        else initialFilters.cw_cookware = [subcatName];
      } else if (mainNorm === "gas stove") {
        initialFilters.gs_top = [subcatName];
      } else if (mainNorm === "mixer grinder") {
        initialFilters.mg_watts = [subcatName];
      }
    }

    if (seriesName) {
      if (mainNorm === "pressure cooker") initialFilters.material = [seriesName];
      else if (mainNorm === "cookware") initialFilters.cw_material = [seriesName];
      else if (mainNorm === "gas tandoor") initialFilters.gt_size = [seriesName];
    }

    if (optionName) {
      if (mainNorm === "gas stove") initialFilters.gs_burners = [optionName];
      else if (mainNorm === "mixer grinder") initialFilters.mg_jars = [optionName];
    }

    if (productSize) {
      if (mainNorm === "pressure cooker") initialFilters.size = [productSize];
      else if (mainNorm === "cookware") initialFilters.cw_size = [productSize];
      else if (mainNorm === "gas tandoor") initialFilters.gt_size = [productSize];
    }

    setSelectedFilters(initialFilters);

    try {
      // Check if we have search results from footer navigation
      if (location.state?.searchResults) {
        setProducts(location.state.searchResults);

        const productsData = location.state.searchResults;
        const mainNorm = main?.toLowerCase().replace(/[-_]/g, " ") || "";
        const isPc = mainNorm === "pressure cooker";
        const isGt = mainNorm === "gas tandoor";
        const isSt = mainNorm === "steam cookware";
        const isCw = mainNorm === "cookware";
        const isGs = mainNorm === "gas stove";
        const isMg = mainNorm === "mixer grinder";
        setFilterOptions(
          isPc
            ? buildPressureCookerFilterOptions(productsData)
            : isGt
              ? buildGasTandoorFilterOptions()
              : isGs
                ? buildGasStoveFilterOptions()
                : isMg
                  ? buildMixerGrinderFilterOptions()
                  : isSt
                    ? buildSteamCookwareFilterOptions()
                    : isCw
                      ? buildCookwareFilterOptions(productsData)
                      : {
                    lid_type: uniqueValues(productsData, ["lid_type", "subcat_name", "type"]),
                    material: uniqueValues(productsData, ["material", "material_name", "series"]),
                    size: uniqueValues(productsData, ["size", "net_quantity", "capacity"]),
                    shape: uniqueValues(productsData, ["shape", "product_shape", "form"]),
                    bottom_type: uniqueValues(productsData, ["bottom_type", "bottom", "base_type"]),
                    gt_size: [],
                    gt_bottom: [],
                    gt_weight: [],
                    gt_accessories: [],
                    sc_type: [],
                    sc_plates: [],
                    sc_bottom: [],
                    cw_material: [],
                    cw_cookware: [],
                    cw_size: [],
                    cw_bottom: [],
                    gs_top: [],
                    gs_burners: [],
                    mg_watts: [],
                    mg_jars: [],
                  }
        );
        console.log("Search results filters set");
        return;
      }

      // Build API parameters based on route params and optional ?search= from footer links
      const searchQuery = searchParams.get('search');
      const params = {
        search: searchQuery && searchQuery.trim() ? searchQuery.trim() : (routeMain ? mapRouteToSearch(routeMain) : 'all'),
        sort: 'mrp',
        order: 'asc',
      };

      // Map route parameters to API filter parameters
      if (subcat) {
        // Map subcategory (e.g., "inner-lid" -> "Inner Lid")
        const subcatName = mapRouteToFilter(subcat);
        const materials = ["Aluminium", "Hard Anodised Aluminium", "Stainless Steel", "Triply Stainless Steel", "Glass"];
        if (materials.includes(subcatName)) {
          params.material_name = subcatName;
        } else {
          params.subcat_name = subcatName;
        }
      }

      if (series) {
        // Series might map to material_name
        const seriesName = mapRouteToFilter(series);
        params.material_name = seriesName;
      }

      if (seriesOption) {
        // Series option might be part of the search or material
        const optionName = mapRouteToFilter(seriesOption);
        // You might want to append this to search or handle differently
        params.search = params.search ? `${params.search} ${optionName}` : optionName;
      }

      if (productSize) {
        // Product size maps to net_quantity
        params.net_quantity = productSize;
      }

      console.log('Fetching products with params:', params);

      let productsData = [];
      let currentPage = 1;
      let hasMorePages = true;

      // Loop to fetch all pages to remove client-side pagination limits
      while (hasMorePages) {
        try {
          const pageParams = { ...params, per_page: 100, page: currentPage };
          const res = await axiosInstance.get('/api/products/view', { params: pageParams });
          
          let pageData = [];
          if (Array.isArray(res.data)) {
            pageData = res.data;
          } else if (res.data?.data && Array.isArray(res.data.data)) {
            pageData = res.data.data;
          } else if (res.data?.products && Array.isArray(res.data.products)) {
            pageData = res.data.products;
          }

          if (pageData.length === 0) {
            hasMorePages = false;
          } else {
            productsData = productsData.concat(pageData);
            currentPage++;
          }
        } catch (err) {
          console.error(`Error fetching page ${currentPage}:`, err);
          hasMorePages = false;
        }
      }

      console.log('Products Data:', productsData);
      if (productsData.length > 0) {
        console.log('First Product Sample:', productsData[0]);
        console.log('First Product Price Fields:', {
          price: productsData[0].price,
          mrp: productsData[0].mrp,
          selling_price: productsData[0].selling_price,
          variants: productsData[0].variants,
          detail_price: productsData[0].detail_price
        });
      }

      setProducts(productsData);

      const mainNorm = main?.toLowerCase().replace(/[-_]/g, " ") || "";
      const isPc = mainNorm === "pressure cooker";
      const isGt = mainNorm === "gas tandoor";
      const isSt = mainNorm === "steam cookware";
      const isCw = mainNorm === "cookware";
      const isGs = mainNorm === "gas stove";
      const isMg = mainNorm === "mixer grinder";
      const filterOpts = isPc
        ? buildPressureCookerFilterOptions(productsData)
        : isGt
          ? buildGasTandoorFilterOptions()
          : isGs
            ? buildGasStoveFilterOptions()
            : isMg
              ? buildMixerGrinderFilterOptions()
              : isSt
                ? buildSteamCookwareFilterOptions()
                : isCw
                  ? buildCookwareFilterOptions(productsData)
                  : {
                lid_type: uniqueValues(productsData, ["lid_type", "subcat_name", "type"]),
                material: uniqueValues(productsData, ["material", "material_name", "series"]),
                size: uniqueValues(productsData, ["size", "net_quantity", "capacity"]),
                shape: uniqueValues(productsData, ["shape", "product_shape", "form"]),
                bottom_type: uniqueValues(productsData, ["bottom_type", "bottom", "base_type"]),
                gt_size: [],
                gt_bottom: [],
                gt_weight: [],
                gt_accessories: [],
                sc_type: [],
                sc_plates: [],
                sc_bottom: [],
                cw_material: [],
                cw_cookware: [],
                cw_size: [],
                cw_bottom: [],
                gs_top: [],
                gs_burners: [],
                mg_watts: [],
                mg_jars: [],
              };

      console.log('Filter Options Extracted:', filterOpts);
      console.log('Sample product keys:', productsData.length > 0 ? Object.keys(productsData[0]) : 'No products');
      console.log('First product for debugging:', productsData[0]);

      // Log field availability
      console.log('Field availability in products:', {
        lid_type: productsData.filter(p => p.lid_type).length,
        subcat_name: productsData.filter(p => p.subcat_name).length,
        material: productsData.filter(p => p.material).length,
        material_name: productsData.filter(p => p.material_name).length,
        size: productsData.filter(p => p.size).length,
        net_quantity: productsData.filter(p => p.net_quantity).length,
        shape: productsData.filter(p => p.shape).length,
        bottom_type: productsData.filter(p => p.bottom_type).length,
      });

      setFilterOptions(filterOpts);

      // Set Max Price for Filter
      if (productsData.length > 0) {
        const prices = productsData.map(p => getProductPrice(p)).filter(p => p !== null);
        if (prices.length > 0) {
          const absoluteMax = Math.ceil(Math.max(...prices));
          setMaxPrice(absoluteMax);
          setSelectedFilters(prev => ({ ...prev, priceRange: [0, absoluteMax] }));
        }
      }

    } catch (e) {
      console.error("Error fetching products:", e);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
    axiosInstance.get("/wishlistupload.php?action=get")
      .then((res) => {
        if (Array.isArray(res.data)) {
          const productIds = res.data.map((item) => parseInt(item.product_id));
          setWishlist(productIds);
        }
      })
      .catch((err) => console.error("Failed to load wishlist:", err));
  }, [routeMain, subcat, series, seriesOption, productSize, location.search, location.key]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktopFilterBar(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /** Map visible pill label (or legacy slug) → selectedFilters / filterOptions key */
  const filterPillToKey = (pill) => {
    if (!pill) return null;
    const mainNorm = main?.toLowerCase().replace(/[-_]/g, " ") || "";
    if (mainNorm === "cookware") {
      const cwMap = { Material: "cw_material", Cookware: "cw_cookware", Size: "cw_size", Bottom: "cw_bottom" };
      if (cwMap[pill]) return cwMap[pill];
    }
    if (mainNorm === "steam cookware") {
      const scMap = { Type: "sc_type", Plates: "sc_plates", Bottom: "sc_bottom" };
      if (scMap[pill]) return scMap[pill];
    }
    if (mainNorm === "gas tandoor") {
      const gtMap = {
        Size: "gt_size",
        Bottom: "gt_bottom",
        Weight: "gt_weight",
        Accessories: "gt_accessories",
      };
      if (gtMap[pill]) return gtMap[pill];
    }
    if (mainNorm === "gas stove") {
      const gsMap = { Top: "gs_top", Burners: "gs_burners" };
      if (gsMap[pill]) return gsMap[pill];
    }
    if (mainNorm === "mixer grinder") {
      const mgMap = { Watts: "mg_watts", "No. Of Jars": "mg_jars" };
      if (mgMap[pill]) return mgMap[pill];
    }
    const byLabel = {
      "Lid Type": "lid_type",
      Material: "material",
      Size: "size",
      Shape: "shape",
      Bottom: "bottom_type",
    };
    if (byLabel[pill]) return byLabel[pill];
    if (pill === "type") return "lid_type";
    if (pill === "bottom") return "bottom_type";
    return pill;
  };

  const isPressureCookerPage = main?.toLowerCase().replace(/[-_]/g, " ") === "pressure cooker";
  const isGasTandoorPage = main?.toLowerCase().replace(/[-_]/g, " ") === "gas tandoor";
  const isGasStovePage = main?.toLowerCase().replace(/[-_]/g, " ") === "gas stove";
  const isMixerGrinderPage = main?.toLowerCase().replace(/[-_]/g, " ") === "mixer grinder";
  const isSteamCookwarePage = main?.toLowerCase().replace(/[-_]/g, " ") === "steam cookware";
  const isCookwarePage = main?.toLowerCase().replace(/[-_]/g, " ") === "cookware";
  const activeFilterPillOrder = isGasTandoorPage
    ? GAS_TANDOOR_FILTER_PILL_ORDER
    : isGasStovePage
      ? GAS_STOVE_FILTER_PILL_ORDER
      : isMixerGrinderPage
        ? MIXER_GRINDER_FILTER_PILL_ORDER
        : isSteamCookwarePage
          ? STEAM_COOKWARE_FILTER_PILL_ORDER
          : isCookwarePage
            ? COOKWARE_FILTER_PILL_ORDER
            : FILTER_BAR_PILL_ORDER;

  const filteredProducts = products
    ?.filter((product) => {
      try {
        const lidType = product.lid_type || product.subcat_name;
        const material = product.material || product.material_name;
        const size = product.size || product.net_quantity || product.capacity;
        const shape = product.shape || product.product_shape || product.form;
        const bottomType = product.bottom_type || product.bottom || product.base_type;
        const productPrice = getProductPrice(product) || 0;

        if (productPrice < selectedFilters.priceRange[0] || productPrice > selectedFilters.priceRange[1]) {
          return false;
        }

        // Strict Category Filtering
        const pCat = String(product.category || product.category_name || product.main_category || product.master_category || "").toLowerCase();
        const pSub = String(product.subcategory || product.sub_category_name || product.subcat_name || "").toLowerCase();
        const pName = String(product.product_name || product.name || product.title || "").toLowerCase();
        const mainNorm = main?.toLowerCase().replace(/[-_]/g, " ") || "";

        if (mainNorm === "gas stove") {
          if (!pCat.includes("stove") && !pName.includes("gas stove")) return false;
        } else if (mainNorm === "pressure cooker") {
          if (!pCat.includes("pressure") && !pName.includes("cooker")) return false;
        } else if (mainNorm === "gas tandoor") {
          if (!pCat.includes("tandoor") && !pName.includes("tandoor")) return false;
        } else if (mainNorm === "mixer grinder") {
          if (!pCat.includes("mixer") && !pName.includes("mixer")) return false;
        } else if (mainNorm === "steam cookware") {
          if (!pCat.includes("steam") && !pName.includes("steam") && !pCat.includes("idli") && !pName.includes("idli") && !pCat.includes("maker") && !pName.includes("maker")) return false;
        } else if (mainNorm === "cookware") {
          // Cookware is broad, but shouldn't include stoves/mixers/cookers/tandoors
          if (
            pCat.includes("stove") || pName.includes("gas stove") ||
            pCat.includes("mixer") || pName.includes("mixer") ||
            pCat.includes("pressure") || pName.includes("cooker") ||
            pCat.includes("tandoor") || pName.includes("tandoor")
          ) return false;
        }

        if (isGasTandoorPage) {
          if (selectedFilters.gt_size.length > 0) {
            const b = getGasTandoorSizeBucket(product);
            if (!b || !selectedFilters.gt_size.includes(b)) return false;
          }
          if (selectedFilters.gt_bottom.length > 0) {
            const b = getGasTandoorBottomBucket(product);
            if (!b || !selectedFilters.gt_bottom.includes(b)) return false;
          }
          if (selectedFilters.gt_weight.length > 0) {
            const b = getGasTandoorWeightBucket(product);
            if (!b || !selectedFilters.gt_weight.includes(b)) return false;
          }
          if (selectedFilters.gt_accessories.length > 0) {
            const b = getGasTandoorAccessoriesBucket(product);
            if (!b || !selectedFilters.gt_accessories.includes(b)) return false;
          }
          return true;
        }

        if (isGasStovePage) {
          if (selectedFilters.gs_top.length > 0) {
            const b = getGasStoveTopBucket(product);
            if (!b || !selectedFilters.gs_top.includes(b)) return false;
          }
          if (selectedFilters.gs_burners.length > 0) {
            const b = getGasStoveBurnersBucket(product);
            if (!b || !selectedFilters.gs_burners.includes(b)) return false;
          }
          return true;
        }

        if (isMixerGrinderPage) {
          if (selectedFilters.mg_watts.length > 0) {
            const b = getMixerWattsBucket(product);
            if (!b || !selectedFilters.mg_watts.includes(b)) return false;
          }
          if (selectedFilters.mg_jars.length > 0) {
            const b = getMixerJarsBucket(product);
            if (!b || !selectedFilters.mg_jars.includes(b)) return false;
          }
          return true;
        }

        if (isSteamCookwarePage) {
          if (selectedFilters.sc_type.length > 0) {
            const b = getSteamTypeBucket(product);
            if (!b || !selectedFilters.sc_type.includes(b)) return false;
          }
          if (selectedFilters.sc_plates.length > 0) {
            const b = getSteamPlatesBucket(product);
            if (!b || !selectedFilters.sc_plates.includes(b)) return false;
          }
          if (selectedFilters.sc_bottom.length > 0) {
            const b = getSteamBottomBucket(product);
            if (!b || !selectedFilters.sc_bottom.includes(b)) return false;
          }
          return true;
        }

        if (isCookwarePage) {
          if (selectedFilters.cw_material.length > 0) {
            const b = getCookwareMaterialBucket(product);
            if (!b || !selectedFilters.cw_material.includes(b)) return false;
          }
          if (selectedFilters.cw_cookware.length > 0) {
            const b = getCookwarePieceBucket(product);
            if (!b || !selectedFilters.cw_cookware.includes(b)) return false;
          }
          if (selectedFilters.cw_size.length > 0) {
            if (!productMatchesCookwareSizeFilters(product, selectedFilters.cw_size)) return false;
          }
          if (selectedFilters.cw_bottom.length > 0) {
            const b = getCookwareBottomBucket(product);
            if (!b || !selectedFilters.cw_bottom.includes(b)) return false;
          }
          return true;
        }

        if (!isPressureCookerPage) {
          return (
            (selectedFilters.lid_type.length === 0 ||
              (lidType && selectedFilters.lid_type.includes(String(lidType).trim()))) &&
            (selectedFilters.material.length === 0 ||
              (material && selectedFilters.material.includes(String(material).trim()))) &&
            (selectedFilters.size.length === 0 ||
              (size && selectedFilters.size.includes(String(size).trim()))) &&
            (selectedFilters.shape.length === 0 ||
              (shape && selectedFilters.shape.includes(String(shape).trim()))) &&
            (selectedFilters.bottom_type.length === 0 ||
              (bottomType && selectedFilters.bottom_type.includes(String(bottomType).trim())))
          );
        }

        // Pressure cooker: SmartCookerFinder-aligned matching
        if (selectedFilters.lid_type.length > 0) {
          const lidMatch = selectedFilters.lid_type.some((v) => {
            if (v === "Inner Lid") return isInnerLidProduct(product);
            if (v === "Outer Lid") return isOuterLidProduct(product);
            return lidType && String(lidType).trim() === v;
          });
          if (!lidMatch) return false;
        }

        if (selectedFilters.material.length > 0) {
          const bucket = getPressureCookerMaterialForFilter(product);
          if (!bucket || !selectedFilters.material.includes(bucket)) return false;
        }

        if (selectedFilters.size.length > 0) {
          const selectedSizeNum = parseFloat(selectedFilters.size[0]);
          
          let productSizeNum = NaN;
          if (pName) {
            const sizeMatch = pName.match(/([\d.]+)\s*(?:l|liters?|litres?)\b/i);
            if (sizeMatch) {
              productSizeNum = parseFloat(sizeMatch[1]);
            }
          }
          
          if (isNaN(productSizeNum)) {
            productSizeNum = parseFloat(size);
          }
          
          if (isNaN(productSizeNum) || productSizeNum !== selectedSizeNum) return false;
        }

        if (selectedFilters.shape.length > 0) {
          const bucket = getPressureCookerShapeForFilter(product);
          if (!bucket || !selectedFilters.shape.includes(bucket)) return false;
        }

        if (selectedFilters.bottom_type.length > 0) {
          const bottomInductionType = getBottomInductionType(product);
          const bottomMatch = selectedFilters.bottom_type.some((f) => {
            if (f === "Induction Compatible" || f === "Non-Induction Compatible") {
              return bottomInductionType === f || bottomInductionType === null;
            }
            return bottomType && String(bottomType).trim() === f;
          });
          if (!bottomMatch) return false;
        }

        return true;
      } catch (err) {
        console.error("Error filtering product:", product, err);
        return true;
      }
    })
    .sort((a, b) => {
      const priceA = getProductPrice(a) || a.price || a.variants?.[0]?.price || a.mrp || 0;
      const priceB = getProductPrice(b) || b.price || b.variants?.[0]?.price || b.mrp || 0;
      if (sortBy === "price-low-high") return priceA - priceB;
      if (sortBy === "price-high-low") return priceB - priceA;
      if (sortBy === "popularity") return (b.popularity || 0) - (a.popularity || 0);
      if (sortBy === "best-selling") return bestSellingScore(b) - bestSellingScore(a);
      if (sortBy === "alpha-asc")
        return productSortName(a).localeCompare(productSortName(b), undefined, { sensitivity: "base" });
      if (sortBy === "alpha-desc")
        return productSortName(b).localeCompare(productSortName(a), undefined, { sensitivity: "base" });
      if (sortBy === "date-new-old" || sortBy === "newest") return productDateMs(b) - productDateMs(a);
      if (sortBy === "date-old-new") return productDateMs(a) - productDateMs(b);
      return (b.popularity || 0) - (a.popularity || 0);
    });

  useLayoutEffect(() => {
    if (desktopFilterBar) return;
    const el = mobileFilterBarScrollRef.current;
    if (!el) return;
    const measure = () => setMobileFilterSnapWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [desktopFilterBar]);

  useLayoutEffect(() => {
    if (!showFilterDropdown) {
      setFilterDropdownCoords(null);
      return;
    }
    const measure = () => {
      const el = filterTriggerRefs.current[showFilterDropdown];
      if (!el) {
        setFilterDropdownCoords(null);
        return;
      }
      const r = el.getBoundingClientRect();
      const width = 224;
      let left = r.left;
      if (left + width > window.innerWidth - 12) {
        left = Math.max(12, window.innerWidth - width - 12);
      }
      setFilterDropdownCoords({ top: r.bottom + 8, left, width });
    };
    measure();
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [showFilterDropdown, filterOptions]);

  useEffect(() => {
    if (!showFilterDropdown && !sortMenuOpen) return;
    const onPointerDown = (e) => {
      if (sortMenuOpen) {
        const inSort = sortMenuRef.current?.contains(e.target);
        const inSortPanel = sortMenuPanelRef.current?.contains(e.target);
        if (!inSort && !inSortPanel) setSortMenuOpen(false);
      }
      if (!showFilterDropdown) return;
      const trig = filterTriggerRefs.current[showFilterDropdown];
      const panel = filterPanelRef.current;
      if (trig?.contains(e.target)) return;
      if (panel?.contains(e.target)) return;
      setShowFilterDropdown(null);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [showFilterDropdown, sortMenuOpen]);

  useEffect(() => {
    if (!sortMenuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setSortMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sortMenuOpen]);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => {
      const currentValues = prev[filterType];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [filterType]: currentValues.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          [filterType]: [...currentValues, value]
        };
      }
    });
  };

  const applyFilters = () => {
    setShowFilterDropdown(null);
  };

  const resetFilters = () => {
    setSelectedFilters({
      lid_type: [],
      material: [],
      size: [],
      shape: [],
      bottom_type: [],
      gt_size: [],
      gt_bottom: [],
      gt_weight: [],
      gt_accessories: [],
      sc_type: [],
      sc_plates: [],
      sc_bottom: [],
      cw_material: [],
      cw_cookware: [],
      cw_size: [],
      cw_bottom: [],
      gs_top: [],
      gs_burners: [],
      mg_watts: [],
      mg_jars: [],
      priceRange: [0, maxPrice],
    });
    setSortBy(DEFAULT_SORT_BY);
    setSortMenuOpen(false);
    setShowFilterDropdown(null);
  };

  const formatDesktopFilterPillLabel = (pillType) => {
    const key = filterPillToKey(pillType);
    const sel = selectedFilters[key] || [];
    if (pillType === "Lid Type") {
      if (!sel.length) return "Type: All";
      if (sel.length > 1) return `Type: ${sel.length} Selected`;
      return `Type: ${sel[0]}`;
    }
    if (pillType === "Type" && main?.toLowerCase().replace(/[-_]/g, " ") === "steam cookware") {
      if (!sel.length) return "Type: All";
      if (sel.length > 1) return `Type: ${sel.length} Selected`;
      return `Type: ${sel[0]}`;
    }
    if (isPressureCookerPage && pillType === "Size" && sel.length > 0) {
      return `Size: ${sel[0]}L`;
    }
    if (!sel.length) return `${pillType}: All`;
    if (sel.length > 1) return `${pillType}: ${sel.length} Selected`;
    return `${pillType}: ${sel[0]}`;
  };

  const handleAddToCartClick = (product) => {
    // Extract product ID from multiple possible fields
    const productId = product?.id ||
      product?.product_id ||
      product?.product_variant_id ||
      product?.variant_id ||
      product?.detail_id ||
      product?.sku;

    // Extract price from multiple possible fields
    const productPrice = product?.price ||
      product?.selling_price ||
      product?.detail_price ||
      product?.mrp ||
      (product?.variants?.length > 0 ? product.variants[0].price : null);

    console.log("Adding to cart - Product:", { productId, productPrice, product });

    if (!productId) {
      toast.error("Product ID not found");
      console.error("Product data for debugging:", product);
      return;
    }

    if (!productPrice) {
      toast.error("Product price not available");
      return;
    }

    // Create a properly formatted product object for handleAddToCart
    const formattedProduct = {
      ...product,
      product_id: productId,
      id: productId,
      price: productPrice,
      selling_price: productPrice
    };

    try {
      handleAddToCart(formattedProduct);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart");
    }
  };

  return (
    <div className="px-2 bg-white md:px-10">
      {/* Add MegaMenu at the top */}
      <CategoryMegaMenu />


      {/* Shop By Category — pressure cooker, gas tandoor, gas stove, mixer grinder, steam cookware, cookware (same layout pattern) */}
      {main?.toLowerCase().replace(/[-_]/g, " ") === "pressure cooker" && (
        <div className="mb-6 overflow-hidden border-b border-gray-100 bg-white py-6 sm:py-10">
          <h2 className="mb-6 text-center font-['Playfair_Display',serif] text-lg font-bold uppercase tracking-[0.15em] text-gray-900 sm:mb-10 sm:text-2xl">
            Shop By Category
          </h2>
          <div className="font-gotham flex items-center gap-2 px-2 md:block md:px-4">
            <button
              type="button"
              aria-label="Scroll categories left"
              onClick={() =>
                shopCategoryScrollRef.current?.scrollBy({ left: -200, behavior: "smooth" })
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 active:scale-95 md:hidden"
            >
              <FaChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <div
              ref={shopCategoryScrollRef}
              className="min-w-0 flex-1 overflow-x-auto scrollbar-hide md:w-full"
            >
              <div className="flex min-w-max items-start justify-start gap-5 pb-4 sm:justify-center sm:gap-12">
                {PRESSURE_COOKER_SHOP_CATEGORIES.map((row) => (
                  <Link
                    key={row.urlSegment}
                    to={`/products/pressure-cooker/${row.urlSegment}`}
                    className="group flex cursor-pointer flex-col items-center transition-all hover:scale-105"
                  >
                    <div className="mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm sm:h-36 sm:w-36 md:h-44 md:w-44">
                      <img
                        src={row.image}
                        alt={row.label}
                        className="h-full w-full object-cover p-2.5 transition-transform duration-500 group-hover:scale-110 sm:p-3"
                        onError={(e) => {
                          e.target.src = "/asset/images/dummy-image-square.jpg";
                        }}
                      />
                    </div>
                    <p className="px-1 text-center text-[10px] font-semibold leading-tight tracking-tight text-gray-600 group-hover:text-[#941007] sm:text-xs md:text-[13px] font-[Arial,sans-serif]!">
                      {row.label}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
            <button
              type="button"
              aria-label="Scroll categories right"
              onClick={() =>
                shopCategoryScrollRef.current?.scrollBy({ left: 200, behavior: "smooth" })
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 active:scale-95 md:hidden"
            >
              <FaChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {main?.toLowerCase().replace(/[-_]/g, " ") === "gas tandoor" && (
        <div className="mb-6 overflow-hidden border-b border-gray-100 bg-white py-6 sm:py-10">
          <h2 className="mb-6 text-center font-['Playfair_Display',serif] text-lg font-bold uppercase tracking-[0.15em] text-gray-900 sm:mb-10 sm:text-2xl">
            Shop By Category
          </h2>
          <div className="font-gotham flex items-center gap-2 px-2 md:block md:px-4">
            <button
              type="button"
              aria-label="Scroll gas tandoor categories left"
              onClick={() =>
                shopCategoryScrollRef.current?.scrollBy({ left: -200, behavior: "smooth" })
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 active:scale-95 md:hidden"
            >
              <FaChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <div
              ref={shopCategoryScrollRef}
              className="min-w-0 flex-1 overflow-x-auto scrollbar-hide md:w-full"
            >
              <div className="flex min-w-max items-start justify-start gap-5 pb-4 sm:justify-center sm:gap-8 md:gap-10">
                {GAS_TANDOOR_SHOP_CATEGORY_ITEMS.map((row) => (
                  <Link
                    key={row.to}
                    to={row.to}
                    className="group flex w-[8.5rem] shrink-0 cursor-pointer flex-col items-center transition-all hover:scale-105 sm:w-36 md:w-44"
                  >
                    <div className="mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm sm:h-36 sm:w-36 md:h-44 md:w-44">
                      <img
                        src={row.image}
                        alt={row.label}
                        className="h-full w-full object-contain p-2.5 transition-transform duration-500 group-hover:scale-110 sm:p-3"
                        onError={(e) => {
                          e.target.src = "/asset/images/dummy-image-square.webp";
                        }}
                      />
                    </div>
                    <p className="px-1 text-center text-[10px] font-semibold leading-tight tracking-tight text-gray-600 group-hover:text-[#941007] sm:text-xs md:text-[13px] font-[Arial,sans-serif]!">
                      {row.label}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
            <button
              type="button"
              aria-label="Scroll gas tandoor categories right"
              onClick={() =>
                shopCategoryScrollRef.current?.scrollBy({ left: 200, behavior: "smooth" })
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 active:scale-95 md:hidden"
            >
              <FaChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {main?.toLowerCase().replace(/[-_]/g, " ") === "gas stove" && (
        <div className="mb-6 overflow-hidden border-b border-gray-100 bg-white py-6 sm:py-10">
          <h2 className="mb-6 text-center font-['Playfair_Display',serif] text-lg font-bold uppercase tracking-[0.15em] text-gray-900 sm:mb-10 sm:text-2xl">
            Shop By Category
          </h2>
          <div className="font-gotham flex items-center gap-2 px-2 md:block md:px-4">
            <button
              type="button"
              aria-label="Scroll gas stove categories left"
              onClick={() =>
                shopCategoryScrollRef.current?.scrollBy({ left: -200, behavior: "smooth" })
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 active:scale-95 md:hidden"
            >
              <FaChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <div
              ref={shopCategoryScrollRef}
              className="min-w-0 flex-1 overflow-x-auto scrollbar-hide md:w-full"
            >
              <div className="flex min-w-max items-start justify-start gap-5 pb-4 sm:justify-center sm:gap-8 md:gap-10">
                {GAS_STOVE_SHOP_CATEGORY_ITEMS.map((row) => (
                  <Link
                    key={row.to}
                    to={row.to}
                    className="group flex w-[8.5rem] shrink-0 cursor-pointer flex-col items-center transition-all hover:scale-105 sm:w-36 md:w-44"
                  >
                    <div className="mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm sm:h-36 sm:w-36 md:h-44 md:w-44">
                      <img
                        src={row.image}
                        alt={row.label}
                        className="h-full w-full object-contain p-2.5 transition-transform duration-500 group-hover:scale-110 sm:p-3"
                        onError={(e) => {
                          e.target.src = "/asset/images/dummy-image-square.webp";
                        }}
                      />
                    </div>
                    <p className="px-1 text-center text-[10px] font-semibold leading-tight tracking-tight text-gray-600 group-hover:text-[#941007] sm:text-xs md:text-[13px] font-[Arial,sans-serif]!">
                      {row.label}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
            <button
              type="button"
              aria-label="Scroll gas stove categories right"
              onClick={() =>
                shopCategoryScrollRef.current?.scrollBy({ left: 200, behavior: "smooth" })
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 active:scale-95 md:hidden"
            >
              <FaChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {main?.toLowerCase().replace(/[-_]/g, " ") === "mixer grinder" && (
        <div className="mb-6 overflow-hidden border-b border-gray-100 bg-white py-6 sm:py-10">
          <h2 className="mb-6 text-center font-['Playfair_Display',serif] text-lg font-bold uppercase tracking-[0.15em] text-gray-900 sm:mb-10 sm:text-2xl">
            Shop By Category
          </h2>
          <div className="font-gotham flex items-center gap-2 px-2 md:block md:px-4">
            <button
              type="button"
              aria-label="Scroll mixer grinder categories left"
              onClick={() =>
                shopCategoryScrollRef.current?.scrollBy({ left: -200, behavior: "smooth" })
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 active:scale-95 md:hidden"
            >
              <FaChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <div
              ref={shopCategoryScrollRef}
              className="min-w-0 flex-1 overflow-x-auto scrollbar-hide md:w-full"
            >
              <div className="flex min-w-max items-start justify-start gap-3 pb-4 sm:justify-center sm:gap-5 md:gap-6">
                {MIXER_GRINDER_SHOP_CATEGORY_ITEMS.map((row) => (
                  <Link
                    key={row.to}
                    to={row.to}
                    className="group flex w-[6.75rem] shrink-0 cursor-pointer flex-col items-center transition-all hover:scale-105 sm:w-32 md:w-36"
                  >
                    <div className="mb-3 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:mb-4 sm:h-28 sm:w-28 md:h-32 md:w-32">
                      <img
                        src={row.image}
                        alt={row.label}
                        className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110 sm:p-2.5"
                        onError={(e) => {
                          e.target.src = "/asset/images/dummy-image-square.webp";
                        }}
                      />
                    </div>
                    <p className="px-0.5 text-center text-[9px] font-semibold leading-tight tracking-tight text-gray-600 group-hover:text-[#941007] sm:text-[10px] md:text-xs font-[Arial,sans-serif]!">
                      {row.label}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
            <button
              type="button"
              aria-label="Scroll mixer grinder categories right"
              onClick={() =>
                shopCategoryScrollRef.current?.scrollBy({ left: 200, behavior: "smooth" })
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 active:scale-95 md:hidden"
            >
              <FaChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {main?.toLowerCase().replace(/[-_]/g, " ") === "steam cookware" && (
        <div className="mb-6 overflow-hidden border-b border-gray-100 bg-white py-6 sm:py-10">
          <h2 className="mb-6 text-center font-['Playfair_Display',serif] text-lg font-bold uppercase tracking-[0.15em] text-gray-900 sm:mb-10 sm:text-2xl">
            Shop By Category
          </h2>
          <div className="font-gotham flex items-center gap-2 px-2 md:block md:px-4">
            <button
              type="button"
              aria-label="Scroll steam cookware categories left"
              onClick={() =>
                shopCategoryScrollRef.current?.scrollBy({ left: -200, behavior: "smooth" })
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 active:scale-95 md:hidden"
            >
              <FaChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <div
              ref={shopCategoryScrollRef}
              className="min-w-0 flex-1 overflow-x-auto scrollbar-hide md:w-full"
            >
              <div className="flex min-w-max items-start justify-start gap-5 pb-4 sm:justify-center sm:gap-8 md:gap-10">
                {STEAM_COOKWARE_SHOP_CATEGORY_ITEMS.map((row) => (
                  <Link
                    key={row.to}
                    to={row.to}
                    className="group flex w-[8.5rem] shrink-0 cursor-pointer flex-col items-center transition-all hover:scale-105 sm:w-36 md:w-44"
                  >
                    <div className="mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm sm:h-36 sm:w-36 md:h-44 md:w-44">
                      <img
                        src={row.image}
                        alt={row.label}
                        className="h-full w-full object-contain p-2.5 transition-transform duration-500 group-hover:scale-110 sm:p-3"
                        onError={(e) => {
                          e.target.src = "/asset/images/dummy-image-square.webp";
                        }}
                      />
                    </div>
                    <p className="px-1 text-center text-[10px] font-semibold leading-tight tracking-tight text-gray-600 group-hover:text-[#941007] sm:text-xs md:text-[13px] font-[Arial,sans-serif]!">
                      {row.label}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
            <button
              type="button"
              aria-label="Scroll steam cookware categories right"
              onClick={() =>
                shopCategoryScrollRef.current?.scrollBy({ left: 200, behavior: "smooth" })
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 active:scale-95 md:hidden"
            >
              <FaChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {main?.toLowerCase().replace(/[-_]/g, " ") === "cookware" && (
        <div className="mb-6 overflow-hidden border-b border-gray-100 bg-white py-6 sm:py-10">
          <h2 className="mb-6 text-center font-['Playfair_Display',serif] text-lg font-bold uppercase tracking-[0.15em] text-gray-900 sm:mb-10 sm:text-2xl">
            Shop By Category
          </h2>
          <div className="font-gotham flex items-center gap-2 px-2 md:gap-3 md:px-4">
            <button
              type="button"
              aria-label="Scroll cookware categories left"
              onClick={() =>
                shopCategoryScrollRef.current?.scrollBy({ left: -280, behavior: "smooth" })
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 active:scale-95"
            >
              <FaChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <div
              ref={shopCategoryScrollRef}
              className="min-w-0 flex-1 overflow-x-auto scrollbar-hide"
            >
              <div className="flex min-w-max items-start justify-start gap-3 pb-4 sm:justify-center sm:gap-4 md:gap-5">
                {COOKWARE_SHOP_CATEGORY_ITEMS.map((row) => (
                  <Link
                    key={row.to}
                    to={row.to}
                    className="group flex w-[6.75rem] shrink-0 cursor-pointer flex-col items-center transition-all hover:scale-105 sm:w-32 md:w-36"
                  >
                    <div className="mb-3 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:mb-4 sm:h-28 sm:w-28 md:h-32 md:w-32">
                      <img
                        src={row.image}
                        alt={row.label}
                        className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110 sm:p-2.5"
                        onError={(e) => {
                          e.target.src = "/asset/images/dummy-image-square.webp";
                        }}
                      />
                    </div>
                    <p className="px-0.5 text-center text-[9px] font-semibold leading-tight tracking-tight text-gray-600 group-hover:text-[#941007] sm:text-[10px] md:text-xs font-[Arial,sans-serif]!">
                      {row.label}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
            <button
              type="button"
              aria-label="Scroll cookware categories right"
              onClick={() =>
                shopCategoryScrollRef.current?.scrollBy({ left: 280, behavior: "smooth" })
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 active:scale-95"
            >
              <FaChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {/* Top Filter Bar — desktop: results + filters + actions on one row; mobile/tablet: wrapped strip */}
      <div className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 py-3 shadow-sm backdrop-blur-md sm:py-5 mb-8 overflow-visible">
        <div
          className={
            desktopFilterBar
              ? `mx-auto flex w-full max-w-7xl flex-row flex-wrap items-center gap-x-3 gap-y-2 px-3 sm:px-4 overflow-visible${
                  isSteamCookwarePage || isCookwarePage || isGasStovePage || isMixerGrinderPage ? " justify-center" : ""
                }`
              : "mx-auto flex w-full max-w-7xl flex-col items-stretch gap-4 px-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-5 sm:gap-y-3 sm:px-4 lg:flex-nowrap lg:items-center lg:justify-center lg:gap-x-3 lg:gap-y-0 overflow-visible"
          }
        >
          {/* Results — same row as filters on desktop (lg+); tablet: inline with filters when not desktop bar */}
          <div
            className={`hidden shrink-0 items-center sm:flex ${
              desktopFilterBar ? (isSteamCookwarePage || isCookwarePage || isGasStovePage || isMixerGrinderPage ? "justify-center" : "justify-start") : "lg:shrink-0"
            }`}
          >
            <span
              className={`whitespace-nowrap font-semibold tracking-widest text-gray-400 sm:text-[16px] ${
                desktopFilterBar
                  ? "mr-2 text-[13px] font-medium tracking-normal text-gray-500"
                  : "ml-2 text-[10px] tracking-widest sm:ml-16"
              }`}
            >
              {desktopFilterBar ? (
                <>
                  Showing <span className="font-semibold ml-1.5 text-gray-700">{filteredProducts.length}</span> Results
                </>
              ) : (
                <>Showing {filteredProducts.length} Products</>
              )}
            </span>
          </div>

          {/* Mobile / tablet: one filter per viewport + snap + chevrons */}
          {!desktopFilterBar && (
          <div className="relative w-full min-w-0 max-w-full shrink-0 overflow-visible">
            <div className="flex w-full items-center gap-2 py-0.5">
              <button
                type="button"
                aria-label="Scroll filters left"
                onClick={() => {
                  const w = mobileFilterSnapWidth && mobileFilterSnapWidth > 0 ? mobileFilterSnapWidth : 280;
                  mobileFilterBarScrollRef.current?.scrollBy({ left: -(w + 8), behavior: "smooth" });
                }}
                className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-gray-200/95 bg-white text-gray-600 shadow-md ring-1 ring-black/5 transition-all hover:border-gray-300 hover:bg-gray-50/95 hover:text-gray-900 hover:shadow-lg active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#941007]/35"
              >
                <FaChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <div
                ref={mobileFilterBarScrollRef}
                className="scrollbar-hide min-h-[52px] min-w-0 flex-1 snap-x snap-mandatory scroll-px-1 overflow-x-auto overflow-y-visible overscroll-x-contain py-0.5 [-webkit-overflow-scrolling:touch]"
              >
                <div
                  role="group"
                  aria-label="Sort and filter products"
                  className="flex w-max flex-nowrap gap-2"
                >
                  <div
                    className={`box-border shrink-0 snap-center snap-always px-0.5 ${mobileFilterSnapWidth ? "" : "min-w-[82vw]"}`}
                    style={
                      mobileFilterSnapWidth && mobileFilterSnapWidth > 0
                        ? { width: mobileFilterSnapWidth, flex: "0 0 auto" }
                        : { flex: "0 0 auto" }
                    }
                  >
                    <div className="flex min-h-[48px] w-full max-w-full items-stretch rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-100 to-slate-100/95 px-2 py-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)]">
                      <SortByCustomDropdown
                        variant="mobile"
                        fillWidth
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        isOpen={sortMenuOpen}
                        onToggle={() => {
                          setShowFilterDropdown(null);
                          setSortMenuOpen((v) => !v);
                        }}
                        onClose={() => setSortMenuOpen(false)}
                        containerRef={sortMenuRef}
                        menuPanelRef={sortMenuPanelRef}
                      />
                    </div>
                  </div>

                  {activeFilterPillOrder.map((type) => {
                    const filterKey = filterPillToKey(type);
                    const selected = selectedFilters[filterKey] || [];
                    const isOpen = showFilterDropdown === type;
                    const hasSelection = selected.length > 0;
                    const label = formatDesktopFilterPillLabel(type);
                    return (
                      <div
                        key={type}
                        className={`box-border shrink-0 snap-center snap-always px-0.5 ${mobileFilterSnapWidth ? "" : "min-w-[82vw]"}`}
                        style={
                          mobileFilterSnapWidth && mobileFilterSnapWidth > 0
                            ? { width: mobileFilterSnapWidth, flex: "0 0 auto" }
                            : { flex: "0 0 auto" }
                        }
                      >
                        <div className="flex min-h-[48px] w-full max-w-full items-stretch rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-100 to-slate-100/95 px-2 py-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)]">
                          <div
                            ref={(el) => {
                              filterTriggerRefs.current[type] = el;
                            }}
                            className="relative flex w-full min-w-0"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSortMenuOpen(false);
                                setShowFilterDropdown(showFilterDropdown === type ? null : type);
                              }}
                              className={`flex min-h-[44px] w-full min-w-0 items-center justify-between gap-2 rounded-full border py-1.5 pl-3 pr-2.5 text-left text-[13px] font-medium shadow-sm transition-colors ${
                                isOpen || hasSelection
                                  ? "z-1 border-[#941007] bg-[#941007] text-white hover:bg-[#941007]"
                                  : "border-gray-200/90 bg-gray-100 text-gray-800 hover:bg-[#FEF2F2]"
                              } ${isOpen ? "ring-2 ring-white/35" : hasSelection ? "ring-1 ring-white/20" : ""}`}
                            >
                              <span
                                className={`min-w-0 truncate text-left ${hasSelection || isOpen ? "underline decoration-white/50 underline-offset-2" : ""}`}
                              >
                                {label}
                              </span>
                              <svg
                                className={`h-2.5 w-2.5 shrink-0 transition-transform ${isOpen ? "rotate-180 text-white" : hasSelection ? "text-white" : "text-gray-500"}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button
                type="button"
                aria-label="Scroll filters right"
                onClick={() => {
                  const w = mobileFilterSnapWidth && mobileFilterSnapWidth > 0 ? mobileFilterSnapWidth : 280;
                  mobileFilterBarScrollRef.current?.scrollBy({ left: w + 8, behavior: "smooth" });
                }}
                className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-gray-200/95 bg-white text-gray-600 shadow-md ring-1 ring-black/5 transition-all hover:border-gray-300 hover:bg-gray-50/95 hover:text-gray-900 hover:shadow-lg active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#941007]/35"
              >
                <FaChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
          )}

          {/* Desktop: compact Sort + pills + scroll + Apply + Reset (shares row with results) */}
          {desktopFilterBar && (
            <div
              className={`flex min-w-0 flex-wrap items-center gap-x-1 gap-y-2 sm:gap-x-2 ${
                isSteamCookwarePage || isCookwarePage || isGasStovePage || isMixerGrinderPage ? "" : "flex-1"
              } ${
                isGasTandoorPage || isSteamCookwarePage || isCookwarePage || isGasStovePage || isMixerGrinderPage ? "justify-start gap-x-2" : "justify-end"
              }`}
            >
              <div
                ref={filterBarScrollRef}
                className={`scrollbar-hide flex min-h-0 min-w-0 max-w-full overflow-x-auto py-0.5 ${
                  isGasTandoorPage || isSteamCookwarePage || isCookwarePage || isGasStovePage || isMixerGrinderPage
                    ? "shrink-0 justify-start"
                    : "min-w-0 flex-1 justify-end"
                }`}
              >
                <div className="flex w-max max-w-full shrink-0 flex-nowrap items-center gap-2">
                  <div className="relative z-[130] shrink-0 overflow-visible py-0.5">
                    <SortByCustomDropdown
                      variant="desktop"
                      sortBy={sortBy}
                      setSortBy={setSortBy}
                      isOpen={sortMenuOpen}
                      onToggle={() => {
                        setShowFilterDropdown(null);
                        setSortMenuOpen((v) => !v);
                      }}
                      onClose={() => setSortMenuOpen(false)}
                      containerRef={sortMenuRef}
                      menuPanelRef={sortMenuPanelRef}
                    />
                  </div>
                {activeFilterPillOrder.map((type) => {
                  const filterKey = filterPillToKey(type);
                  const selected = selectedFilters[filterKey] || [];
                  const isOpen = showFilterDropdown === type;
                  const hasSelection = selected.length > 0;
                  const label = formatDesktopFilterPillLabel(type);
                  const narrowDesktopTab = isGasTandoorPage
                    ? type === "Weight" || type === "Accessories"
                    : isSteamCookwarePage
                      ? type === "Type" || type === "Plates" || type === "Bottom"
                      : isCookwarePage
                        ? type === "Material" || type === "Cookware" || type === "Size" || type === "Bottom"
                        : isGasStovePage
                          ? type === "Top" || type === "Burners"
                          : isMixerGrinderPage
                            ? type === "Watts" || type === "No. Of Jars"
                            : type === "Lid Type" || type === "Size" || type === "Shape";
                  return (
                    <div
                      key={type}
                      ref={(el) => {
                        filterTriggerRefs.current[type] = el;
                      }}
                      className="relative shrink-0"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSortMenuOpen(false);
                          setShowFilterDropdown(showFilterDropdown === type ? null : type);
                        }}
                        className={`flex items-center justify-between rounded-full border py-1.5 text-left text-[13px] font-medium shadow-sm transition-colors ${
                          narrowDesktopTab
                            ? "min-w-[8.25rem] gap-0.5 px-2"
                            : "min-w-[10rem] gap-1 px-2.5"
                        } ${
                          isOpen || hasSelection
                            ? "border-[#941007] bg-[#941007] text-white hover:bg-[#941007]"
                            : "border-gray-200/90 bg-gray-100 text-gray-800 hover:bg-[#FEF2F2]"
                        } ${isOpen ? "ring-2 ring-white/35" : hasSelection ? "ring-1 ring-white/20" : ""}`}
                      >
                        <span
                          className={`whitespace-nowrap text-left ${hasSelection || isOpen ? "underline decoration-white/50 underline-offset-2" : ""}`}
                        >
                          {label}
                        </span>
                        <svg
                          className={`h-2.5 w-2.5 shrink-0 transition-transform ${isOpen ? "rotate-180 text-white" : hasSelection ? "text-white" : "text-gray-500"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
                </div>
              </div>
              {isGasTandoorPage && <div className="min-w-0 flex-1" aria-hidden />}
              <button
                type="button"
                aria-label="Scroll filters right"
                onClick={() => filterBarScrollRef.current?.scrollBy({ left: 280, behavior: "smooth" })}
                className="shrink-0 rounded-full border border-gray-200/90 bg-gray-100 p-1.5 text-gray-600 shadow-sm transition-colors hover:bg-gray-200/80"
              >
                <FaChevronRight className="h-3 w-3" aria-hidden />
              </button>
              <button
                type="button"
                onClick={applyFilters}
                className="shrink-0 rounded-lg bg-[#941007] px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#941007] active:scale-95"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="shrink-0 bg-transparent px-2 py-2 text-sm font-semibold text-[#941007] shadow-none transition-colors hover:text-[#941007] hover:underline"
              >
                Reset
              </button>
            </div>
          )}

          {/* Apply + Reset — mobile / tablet only (desktop uses row above) */}
          {!desktopFilterBar && (
          <div className="flex w-full shrink-0 items-center justify-center gap-3 sm:w-auto sm:gap-4 lg:shrink-0 lg:gap-3">
            <button
              type="button"
              onClick={applyFilters}
              className="rounded-full bg-[#941007] px-8 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#941007] active:scale-95 sm:px-8 sm:text-[14px] lg:rounded-lg lg:px-6 lg:py-2 lg:text-sm lg:font-semibold lg:normal-case lg:tracking-normal"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border-2 border-[#941007] bg-white px-8 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#941007] transition-all hover:bg-red-50 sm:text-[14px] lg:border-0 lg:bg-transparent lg:px-3 lg:py-2 lg:text-sm lg:font-semibold lg:normal-case lg:tracking-normal lg:shadow-none lg:hover:bg-transparent lg:hover:text-[#941007] lg:hover:underline"
            >
              Reset
            </button>
          </div>
          )}
        </div>
      </div>

      {/* Main Content — full width, 5 cards per row on large screens */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <Loading size="large" />
              <p className="mt-6 text-gray-500 font-medium animate-pulse">Finding the best products for you...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <FaShoppingCart className="text-gray-400 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-8 max-w-md">
                We couldn't find any products matching your current selection. Try adjusting your filters or search term.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#941007] text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-[#b01409] transition-all active:scale-95"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5 px-1 sm:px-0">
              {filteredProducts.map((product, i) => (
              <div className="flex justify-center" key={i}>
                <div
                  className="relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col p-2.5 sm:p-4 w-full"
                >
                  <Link to={`/product-details/${product.id || product.product_id || product.product_variant_id || product.detail_id || product.sno}`} className="w-full">
                    <div className="bg-[#f8f8f8] rounded-xl p-3 sm:p-5 aspect-square flex items-center justify-center mb-3 group">
                      <LazyImage
                        src={getProductImage(product)}
                        alt={product.name || product.product_name || 'Product'}
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                         onError={(e) => {
                          e.target.src = '/asset/images/dummy-image-square.jpg';
                        }}
                      />
                    </div>

                    {/* Wishlist Icon */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToWishlist(product);
                      }}
                      className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform duration-300 group-hover:bg-white"
                    >
                      <FontAwesomeIcon
                        icon={isInWishlist(product.id || product.product_id || product.detail_id || product.sku) ? solidHeart : regularHeart}
                        className={isInWishlist(product.id || product.product_id || product.detail_id || product.sku) ? "text-red-600" : "text-gray-400"}
                        style={{ fontSize: "16px" }}
                      />
                    </button>

                    <div className="flex flex-col mb-3 px-1">
                      <p
                        role="heading"
                        aria-level={3}
                        className="font-gotham mb-1 min-h-[24px] line-clamp-2 text-[10px] font-bold uppercase leading-tight tracking-tight text-gray-900 sm:min-h-[40px] sm:text-[14px]"
                      >
                        {product.name || product.product_name || "Product"}
                      </p>

                      <div className="flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-[11px] font-bold text-[#941007] uppercase mb-1">
                        <FaTrophy className="text-[10px] sm:text-[13px]" />
                        <span>Bestseller | 1k+ bought</span>
                      </div>

                      <div className="mb-2 flex items-center gap-1">
                        <div className="flex text-[9px] text-yellow-400 sm:text-[12px]">
                          <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                        <span className="text-[9px] font-medium text-gray-400 underline sm:text-[12px]">20 Reviews</span>
                      </div>

                      <div className="font-gotham text-[14px] font-bold text-gray-900 sm:text-[20px]">
                        {getProductPrice(product) ? `Rs. ${getProductPrice(product)}` : "N/A"}
                      </div>
                    </div>
                  </Link>

                  <div className="mt-auto pt-1 flex gap-1 sm:gap-3 w-full">
                    <button
                      onClick={() => handleAddToCartClick(product)}
                      className="flex-1 flex items-center justify-center gap-1 border-2 border-[#941007] text-[#941007] text-[9px] sm:text-[13px] font-black py-1.5 sm:py-2.5 rounded-lg transition-all hover:bg-red-50 active:scale-95"
                    >
                      <span className="hidden sm:inline">Add to</span> <FaShoppingCart className="text-[12px] sm:text-[16px]" />
                    </button>
                    <button
                      onClick={() => {
                        const productId = product?.id || product?.product_id || product?.product_variant_id || product?.variant_id || product?.detail_id || product?.sku;
                        const productPrice = product?.price || product?.selling_price || product?.detail_price || product?.mrp || (product?.variants?.length > 0 ? product.variants[0].price : null);
                        if (!productId) { toast.error("Product ID not found"); return; }
                        if (!productPrice) { toast.error("Product price not available"); return; }
                        const formattedProduct = { ...product, product_id: productId, id: productId, price: productPrice, selling_price: productPrice };
                        handleBuyNow(formattedProduct);
                      }}
                      className="flex-1 bg-[#941007] text-white text-[10px] sm:text-[13px] font-black py-1.5 sm:py-2.5 rounded-lg transition-all hover:bg-[#941007] active:scale-95 shadow-md"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>

      {typeof document !== "undefined" &&
        showFilterDropdown &&
        filterDropdownCoords &&
        createPortal(
          <div
            ref={filterPanelRef}
            className="pointer-events-auto fixed z-[200] max-h-[min(70vh,24rem)] w-56 overflow-hidden rounded-2xl border border-gray-50 bg-white p-4 shadow-2xl"
            style={{
              top: filterDropdownCoords.top,
              left: filterDropdownCoords.left,
              minWidth: filterDropdownCoords.width,
            }}
          >
            <div className="custom-scrollbar max-h-60 space-y-1 overflow-y-auto pr-1">
              {isPressureCookerPage && showFilterDropdown === "Size" ? (
                <div className="p-2 flex flex-col items-center w-full">
                  <div className="w-full flex justify-between text-[11px] text-gray-500 mb-3 font-medium">
                    <span>1L</span>
                    <span>40L</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="0.5"
                    value={selectedFilters.size.length > 0 ? selectedFilters.size[0] : 1}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedFilters(prev => ({ ...prev, size: [val] }));
                    }}
                    className="w-full cursor-pointer accent-[#941007]"
                  />
                  <div className="mt-4 text-[13px] font-bold text-gray-800">
                    {selectedFilters.size.length > 0 ? selectedFilters.size[0] : 1} Litres
                  </div>
                  {parseFloat(selectedFilters.size.length > 0 ? selectedFilters.size[0] : 1) > 24 && (
                    <div className="mt-4 text-[11px] leading-tight text-[#941007] text-center font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">
                      Products for &gt;24L have not been added yet, stay tuned for more updates.
                    </div>
                  )}
                  {selectedFilters.size.length > 0 && (
                    <button 
                      onClick={() => setSelectedFilters(prev => ({ ...prev, size: [] }))}
                      className="mt-4 text-[11px] text-gray-500 hover:text-gray-800 underline transition-colors font-medium"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              ) : (
                (filterOptions[filterPillToKey(showFilterDropdown)] || []).map((val) => {
                const fk = filterPillToKey(showFilterDropdown);
                const useRawPcLabel =
                  isPressureCookerPage &&
                  (fk === "material" || fk === "shape" || fk === "bottom_type");
                const useRawGasLabel = isGasTandoorPage && fk && fk.startsWith("gt_");
                const useRawSteamLabel = isSteamCookwarePage && fk && fk.startsWith("sc_");
                const useRawCookwareLabel = isCookwarePage && fk && fk.startsWith("cw_");
                const useRawGasStoveLabel = isGasStovePage && fk && fk.startsWith("gs_");
                const useRawMixerGrinderLabel = isMixerGrinderPage && fk && fk.startsWith("mg_");
                const labelText =
                  useRawPcLabel ||
                  useRawGasLabel ||
                  useRawSteamLabel ||
                  useRawCookwareLabel ||
                  useRawGasStoveLabel ||
                  useRawMixerGrinderLabel
                    ? val
                    : toTitleCaseDropdown(val);
                return (
                <label
                  key={val}
                  className="group flex cursor-pointer items-center rounded-xl p-2 transition-colors hover:bg-[#FEF2F2] focus-within:bg-[#FEF2F2]"
                >
                  <input
                    type="checkbox"
                    checked={(selectedFilters[fk] || []).includes(val)}
                    onChange={() => handleFilterChange(fk, val)}
                    className="h-4 w-4 rounded border-gray-300 accent-[#941007]"
                  />
                  <span className="ml-3 text-[13px] font-medium leading-snug tracking-normal text-gray-800 transition-colors group-hover:text-gray-950">
                    {labelText}
                  </span>
                </label>
                );
              }))}
            </div>
          </div>,
          document.body
        )}
    </div>

  );
};

export default CategoryPage;
