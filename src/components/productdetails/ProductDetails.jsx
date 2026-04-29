
import React, { useEffect, useRef, useState, useContext, useMemo } from "react";
import { createPortal } from "react-dom";
import { useParams, Link } from "react-router-dom";
import axios from "../../axiosConfig";
import Slider from "react-slick";
import {
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaChevronDown,
  FaShieldAlt,
  FaCcVisa,
  FaCcMastercard,
  FaCreditCard,
  FaHome,
  FaStar,
  FaCogs,
  FaListUl,
  FaAward,
  FaCheckCircle,
  FaFire,
  FaLeaf,
  FaQuestionCircle,
} from "react-icons/fa";
import { CartContext } from "../../context/CartContext";
import { IoShareSocial } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Blogs from "../Blogs";
import CategoryMegaMenu from "../header/CategoryMegaMenu";
import ExploreMoreCategories from '../ExploreMoreCategories';
import YouMayAlsoLike from '../YouMayAlsoLike';
import { getCatalogDisplaySizesForProduct, normalizeSizeToken, isInnerLidProduct, isOuterLidProduct } from "../../utils/catalogSizesFromProduct";


/* -------------------- IMAGE HELPER -------------------- */
const getImageSrc = (img) => {
  if (!img) return "/asset/images/dummy-image-square.jpg";

  // S3 presigned URL (already full) or s3:// URI
  if (typeof img === "string") {
    if (img.startsWith("http")) return img;
    if (img.startsWith("s3://")) {
      return img.replace('s3://', 'https://').replace(/([^/]+)\//, '$1.s3.amazonaws.com/');
    }
  }

  // Image object case { url: "https://..." }
  if (typeof img === "object" && img.url) {
    return img.url;
  }

  return "/asset/images/dummy-image-square.jpg";
};

// Optimized image helper with quality and size parameters
const getOptimizedImageSrc = (img, width = 800, quality = 80) => {
  const originalSrc = getImageSrc(img);

  // If it's a local/relative path, return as-is
  if (!originalSrc.startsWith("http")) {
    return originalSrc;
  }

  // For S3/external URLs, you could add image optimization parameters
  // This depends on your image service (Cloudinary, AWS ImageOptim, etc.)
  // Example for Cloudinary: return `${originalSrc}?w=${width}&q=${quality}`;

  return originalSrc;
};

/** Get display capacity from product (capacity, net_quantity, size, or parsed from name) */
const getProductCapacity = (product) => {
  if (!product) return null;

  // Try to extract from name first as it's often most accurate for volume
  const nameMatch = product.product_name?.match(/(\d+\.?\d*)\s*([Ll]|[Ll]iter)/i)
    || product.name?.match(/(\d+\.?\d*)\s*([Ll]|[Ll]iter)/i);
  if (nameMatch) return nameMatch[1] + 'L';

  // Fallback to capacity fields
  const cap = product.capacity ?? product.net_quantity ?? product.size ?? product.volume;
  if (cap != null && String(cap).trim() !== '') {
    const capStr = String(cap).trim();
    // If it's just a number, assume L for now if it's a pressure cooker
    if (/^\d+\.?\d*$/.test(capStr)) return capStr + 'L';
    return capStr;
  }

  return null;
};

/** Section titles we look for in product descriptions (order matters for parsing) */
const DESCRIPTION_SECTION_TITLES = [
  'Unique Selling Points',
  'Key Features',
  'Features',
  'Highlights',
  'Capacity & Usage',
  'Material & Build',
  'Material',
  'Safety Features',
  'Safety',
  'Efficiency & Convenience',
  'Versatility',
  'Warranty & Certification',
  'Warranty',
  'Why Buy?',
  'Frequently Asked Questions',
  'FAQ',
  'Description',
];

/** Clean up text: Fix spacing, grammar-like issues and punctuation */
const cleanText = (text) => {
  if (!text) return "";
  let cleaned = text
    // Fix multiple spaces
    .replace(/\s+/g, ' ')
    // Fix spacing around punctuation
    .replace(/\s+([.,!?;:])/g, '$1')
    .replace(/([.,!?;:])(?=[^\s])/g, '$1 ')
    // Ensure sentences start with capital letter
    .replace(/(^|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase())
    // Fix common casing (optional but helpful for branding)
    .replace(/\binduction\b/gi, 'Induction')
    .replace(/\btri-ply\b/gi, 'Tri-Ply')
    .replace(/\bstainless steel\b/gi, 'Stainless Steel')
    .trim();

  return cleaned;
};

/** Parse plain description into intro + sections for attractive layout */
const parseDescriptionSections = (plainText) => {
  if (!plainText || typeof plainText !== 'string') return null;
  const text = plainText.trim();
  if (!text) return null;

  const sections = [];
  let intro = '';
  let remaining = text;

  for (let i = 0; i < DESCRIPTION_SECTION_TITLES.length; i++) {
    const title = DESCRIPTION_SECTION_TITLES[i];
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped + '\\s*:?\\s*', 'gi');
    const idx = remaining.search(re);
    if (idx === -1) continue;

    if (sections.length === 0 && idx > 0) {
      intro = remaining.slice(0, idx).trim();
    }
    const match = remaining.match(re);
    const headerLen = match ? match[0].length : title.length;
    const afterHeader = remaining.slice(idx + headerLen);

    let nextIdx = -1;
    for (let j = i + 1; j < DESCRIPTION_SECTION_TITLES.length; j++) {
      const ni = afterHeader.toLowerCase().indexOf(DESCRIPTION_SECTION_TITLES[j].toLowerCase());
      if (ni >= 0 && (nextIdx === -1 || ni < nextIdx)) nextIdx = ni;
    }
    const content = (nextIdx >= 0 ? afterHeader.slice(0, nextIdx) : afterHeader).trim();
    remaining = nextIdx >= 0 ? afterHeader.slice(nextIdx) : '';
    sections.push({ title, content });
  }
  if (sections.length === 0) return { intro: text, sections: [] };
  return { intro, sections };
};

/** Capacity to People mapping for Pressure Cookers */
const CAPACITY_PEOPLE_MAP = {
  "1.0L": "1 person", "1.0": "1 person", "1L": "1 person", "1": "1 person", "1UNIT": "1 person",
  "1.5L": "1–2 people", "1.5": "1–2 people", "1.5UNIT": "1–2 people",
  "2.0L": "2–3 people", "2.0": "2–3 people", "2L": "2–3 people", "2": "2–3 people", "2UNIT": "2–3 people",
  "3.0L": "3–4 people", "3.0": "3–4 people", "3L": "3–4 people", "3": "3–4 people", "3UNIT": "3–4 people",
  "3.5L": "3–5 people", "3.5": "3–5 people", "3.5UNIT": "3–5 people",
  "4.0L": "3–5 people", "4.0": "3–5 people", "4L": "3–5 people", "4": "3–5 people", "4UNIT": "3–5 people",
  "5.0L": "4–6 people", "5.0": "4–6 people", "5L": "4–6 people", "5": "4–6 people", "5UNIT": "4–6 people",
  "5.5L": "5–7 people", "5.5": "5–7 people", "5.5UNIT": "5–7 people",
  "6.0L": "5–7 people", "6.0": "5–7 people", "6L": "5–7 people", "6": "5–7 people", "6UNIT": "5–7 people",
  "6.5L": "6–8 people", "6.5": "6–8 people", "6.5UNIT": "6–8 people",
  "7.0L": "6–8 people", "7.0": "6–8 people", "7L": "6–8 people", "7": "6–8 people", "7UNIT": "6–8 people",
  "7.5L": "6–9 people", "7.5": "6–9 people", "7.5UNIT": "6–9 people",
  "8.0L": "7–9 people", "8.0": "7–9 people", "8L": "7–9 people", "8": "7–9 people", "8UNIT": "7–9 people",
  "10.0L": "8–12 people", "10.0": "8–12 people", "10L": "8–12 people", "10": "8–12 people", "10UNIT": "8–12 people",
  "12.0L": "10–15 people", "12.0": "10–15 people", "12L": "10–15 people", "12": "10–15 people", "12UNIT": "10–15 people",
  "15.0L": "13–20 people", "15.0": "13–20 people", "15L": "13–20 people", "15": "13–20 people", "15UNIT": "13–20 people",
  "16.0L": "14–22 people", "16.0": "14–22 people", "16L": "14–22 people", "16": "14–22 people", "16UNIT": "14–22 people",
  "18.0L": "16–26 people", "18.0": "16–26 people", "18L": "16–26 people", "18": "16–26 people", "18UNIT": "16–26 people",
  "20.0L": "18–30 people", "20.0": "18–30 people", "20L": "18–30 people", "20": "18–30 people", "20UNIT": "18–30 people",
  "22.0L": "20–35 people", "22.0": "20–35 people", "22L": "20–35 people", "22": "20–35 people", "22UNIT": "20–35 people",
  "24.0L": "22–40 people", "24.0": "22–40 people", "24L": "22–40 people", "24": "22–40 people", "24UNIT": "22–40 people",
};

const getSuitablePeople = (capacity) => {
  if (!capacity) return null;
  const normalized = String(capacity).toUpperCase().replace(/\s+/g, '');
  return CAPACITY_PEOPLE_MAP[normalized] || null;
};

/** Turn section content into bullet points when it looks list-like */
const contentToBullets = (content) => {
  if (!content || !content.trim()) return [];
  const normalized = content.replace(/\s+/g, ' ').trim();

  // Only split if we have clear bullet indicators or if it's very long with many commas
  if (normalized.includes('•') || normalized.includes('* ')) {
    return normalized.split(/[•*]/).map(s => s.trim()).filter(Boolean);
  }

  // If it's a long sentence with many items, maybe it's a list
  const commas = (normalized.match(/,/g) || []).length;
  if (commas > 4 && normalized.length > 150) {
    return normalized.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  return [normalized];
};

const SECTION_ICONS = {
  'Unique Selling Points': FaStar,
  'Key Features': FaStar,
  'Features': FaListUl,
  'Highlights': FaFire,
  'Capacity & Usage': FaListUl,
  'Material & Build': FaCogs,
  'Material': FaCogs,
  'Safety Features': FaShieldAlt,
  'Safety': FaShieldAlt,
  'Efficiency & Convenience': FaFire,
  'Versatility': FaLeaf,
  'Warranty & Certification': FaAward,
  'Warranty': FaAward,
  'Why Buy?': FaQuestionCircle,
  'Description': FaListUl,
};
const DEFAULT_SECTION_ICON = FaCheckCircle;

/** Split plain description into paragraphs for readable display */
const plainTextToParagraphs = (text) => {
  if (!text || !text.trim()) return [];
  const normalized = text.replace(/\s+/g, ' ').trim();
  const byNewline = normalized.split(/\n\n+/).map((s) => s.trim()).filter(Boolean);
  if (byNewline.length > 1) return byNewline;
  const sentences = normalized.split(/\.\s+(?=[A-Z])/).map((s) => s.trim() + (s.endsWith('.') ? '' : '.')).filter(Boolean);
  if (sentences.length <= 2) return sentences.length ? [normalized] : [];
  const paragraphs = [];
  for (let i = 0; i < sentences.length; i += 2) {
    paragraphs.push(sentences.slice(i, i + 2).join(' '));
  }
  return paragraphs;
};

/** Try to get highlight bullets from a paragraph (comma-separated phrases) */
const getHighlightBullets = (text, maxBullets = 6) => {
  if (!text || text.length < 60) return null;
  const segment = text.slice(0, 500);
  const parts = segment.split(/[,;]|\s+and\s+/).map((s) => s.trim()).filter((s) => s.length > 8 && s.length < 140);
  if (parts.length >= 2 && parts.length <= 12) return parts.slice(0, maxBullets);
  return null;
};

/* -------------------- IMAGE MAGNIFIER -------------------- */
const ImageMagnifier = ({
  src,
  className,
  alt,
  zoomLevel = 2.5,
  onLoad,
  onError,
  style,
  loading
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  // Loupe Configuration
  const DIAMETER = 200; // Size of the magnifying glass

  const handleMouseEnter = () => {
    // Only enable on desktop
    if (window.innerWidth >= 1024) setShowMagnifier(true);
  };

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const elem = imgRef.current;
    const { left, top, width, height } = elem.getBoundingClientRect();
    setImgSize({ width, height });

    // Cursor position relative to image
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Check if cursor is inside bounds
    if (x < 0 || y < 0 || x > width || y > height) {
      setShowMagnifier(false);
      return;
    }

    setZoomPos({ x, y });
    if (!showMagnifier && window.innerWidth >= 1024) setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  // Calculate Lens Position
  const r = DIAMETER / 2;
  let cx = zoomPos.x;
  let cy = zoomPos.y;

  // Clamp center so the lens stays strictly inside the image boundaries
  if (cx < r) cx = r;
  if (cx > imgSize.width - r) cx = imgSize.width - r;
  if (cy < r) cy = r;
  if (cy > imgSize.height - r) cy = imgSize.height - r;

  // Position of the loupe element
  const xPos = cx - r;
  const yPos = cy - r;

  // Background/Zoomed Image Position logic:
  // We want the point under the cursor (cx, cy) to be centered in the magnifying glass
  // The zoomed image is 'zoomLevel' times larger
  // We need to position the zoomed image so that the cursor point appears in the center of the lens
  const bgLeft = -(cx * zoomLevel) + r;
  const bgTop = -(cy * zoomLevel) + r;

  return (
    <div className="relative inline-block w-full h-full group cursor-crosshair">
      <img
        ref={imgRef}
        src={src}
        className={className}
        alt={alt}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onLoad={onLoad}
        onError={onError}
        style={style}
        loading={loading}
      />

      {showMagnifier && (
        <div
          style={{
            position: 'absolute',
            left: xPos,
            top: yPos,
            width: DIAMETER,
            height: DIAMETER,
            borderRadius: '50%',
            pointerEvents: 'none',
            border: '2px solid white',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            backgroundColor: '#fff',
            zIndex: 20
          }}
        >
          <div
            style={{
              width: imgSize.width * zoomLevel,
              height: imgSize.height * zoomLevel,
              transform: `translate(${bgLeft}px, ${bgTop}px)`,
              transformOrigin: 'top left',
              backgroundColor: 'white'
            }}
          >
            <img
              src={src}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              alt=""
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ProductDetails = ({ user }) => {
  const { product_id } = useParams();

  const { handleAddToCart, handleBuyNow } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewCount, setReviewCount] = useState(0);

  const isPressureCooker = useMemo(() => {
    if (!product) return false;
    const cat = (product.category?.name || product.master_category || product.category || '').toLowerCase();
    return cat.includes('pressure cooker');
  }, [product]);

  // Review & Rating State
  const [reviews, setReviews] = useState([]);
  const [localReviews, setLocalReviews] = useState([]); // Reviews added while API is broken
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
  });

  // Load local reviews on mount
  useEffect(() => {
    const seedReviews = [
      {"id":1,"product_id":1,"user_id":1,"title":"Great Product","comment":"I really liked this product!","rating":5,"created_at":"2026-04-27T09:19:18.000000Z"},
      {"id":2,"product_id":2,"user_id":1,"title":"Great Product","comment":"I really liked this product!","rating":5,"created_at":"2026-04-27T09:30:44.000000Z"},
      {"id":3,"product_id":125,"user_id":1,"title":"thvrthvrt","comment":"drybhrtyhbyhb5yh","rating":1,"created_at":"2026-04-27T10:22:27.000000Z"},
      {"id":4,"product_id":125,"user_id":1,"title":"v r tgerert","comment":"gertgertgert","rating":2,"created_at":"2026-04-27T10:24:35.000000Z"},
      {"id":5,"product_id":125,"user_id":1,"title":"cercrtecrctg","comment":"crtgerververv","rating":4,"created_at":"2026-04-27T10:32:13.000000Z"},
      {"id":6,"product_id":125,"user_id":1,"title":"rert erterterterter","comment":"erertgererrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr","rating":4,"created_at":"2026-04-27T10:35:25.000000Z"},
      {"id":7,"product_id":125,"user_id":1,"title":"b tbtbh hbthb hbrb","comment":"hbvbvythbyhb","rating":3,"created_at":"2026-04-27T10:37:12.000000Z"}
    ];

    const saved = localStorage.getItem(`local_reviews_${product_id}`);
    let local = [];
    if (saved) {
      try {
        local = JSON.parse(saved);
      } catch (e) {
        console.error("Error loading local reviews", e);
      }
    }

    // Merge seed reviews (filtered by product) with saved local reviews
    const filteredSeed = seedReviews.filter(r => String(r.product_id) === String(product_id) || String(r.product_id) === String(product?.detail_id));
    
    // Avoid duplicates if seed reviews were already saved locally
    const uniqueLocal = local.filter(lr => !filteredSeed.find(sr => sr.id === lr.id));
    setLocalReviews([...filteredSeed, ...uniqueLocal]);
  }, [product_id, product?.detail_id]);

  // Dropdown state for product details table
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Read more state for table description
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Review section state
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedBottom, setSelectedBottom] = useState("");
  const [openSections, setOpenSections] = useState({
    classification: true,
    specs: false,
    pricing: false,
    support: false
  });

  // Review Form state
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleReviewSubmit = async () => {
    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      toast.error("Please fill in both title and comment");
      return;
    }

    setSubmittingReview(true);
    const payload = {
      product_id: Number(product?.detail_id || product?.id) || product_id,
      user_id: user?.id || 1, // Use logged in user ID or fallback to 1
      title: reviewTitle,
      comment: reviewComment,
      rating: Number(userRating)
    };

    console.log("Submitting review payload:", payload);

    try {
      const response = await axios.post(`/api/reviews`, payload, {
        headers: { 
          'Content-Type': 'application/json',
          Accept: "application/json" 
        },
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Review submitted successfully!");
        setIsReviewFormOpen(false);
        setReviewTitle("");
        setReviewComment("");
        setUserRating(0);
        
        // Trigger a refresh of the reviews
        fetchReviews();
      }
    } catch (err) {
      console.error("Review submission error:", err);
      
      // FALLBACK: Add to local reviews if API fails
      const newLocalReview = {
        id: `local_${Date.now()}`,
        product_id: payload.product_id,
        user_id: payload.user_id,
        title: payload.title,
        comment: payload.comment,
        rating: payload.rating,
        created_at: new Date().toISOString(),
        user: { name: user?.name || "Guest User" },
        is_local: true
      };
      
      const updatedLocal = [newLocalReview, ...localReviews];
      setLocalReviews(updatedLocal);
      localStorage.setItem(`local_reviews_${product_id}`, JSON.stringify(updatedLocal));
      
      toast.success("Review added locally (Server currently busy)");
      setIsReviewFormOpen(false);
      setReviewTitle("");
      setReviewComment("");
      setUserRating(0);
    } finally {
      setSubmittingReview(false);
    }
  };

  const fetchReviews = () => {
    if (!product_id) return;
    axios
      .get(`/api/reviews`, {
        headers: { Accept: "application/json" },
        withCredentials: true,
      })
      .then((res) => {
        const allReviews = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        const productReviews = allReviews.filter(r => String(r.product_id) === String(product_id));
        setReviews(productReviews);
        setReviewCount(productReviews.length);
        if (productReviews.length > 0) {
          const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          let totalRating = 0;
          productReviews.forEach(r => {
            const rating = Math.round(Number(r.rating));
            if (distribution[rating] !== undefined) distribution[rating]++;
            totalRating += Number(r.rating);
          });
          setRatingDistribution(distribution);
          setAverageRating((totalRating / productReviews.length).toFixed(2));
        } else {
          setRatingDistribution({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
          setAverageRating(0);
        }
      })
      .catch((err) => console.error("Reviews fetch error:", err));
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };


  // Image loading optimization states
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [mainImageLoaded, setMainImageLoaded] = useState(false);

  const catalogDisplaySizes = useMemo(
    () => (product ? getCatalogDisplaySizesForProduct(product) : null),
    [product]
  );

  /** Dynamic FAQs derived from API fields (Contents, Description Sections, Warranty) */
  const apiFaqs = useMemo(() => {
    if (!product) return [];

    const extracted = [];

    // 1. "What's in the box?" from 'contents' field
    if (product.contents && String(product.contents).trim() !== '""' && String(product.contents).trim() !== '') {
      extracted.push({
        q: `WHAT'S IN THE BOX?`,
        a: String(product.contents).replace(/^"|"$/g, '').replace(/\\n/g, '\n').trim()
      });
    }

    // 2. Parse sections from description
    const parsedDesc = parseDescriptionSections(product.description);
    if (parsedDesc?.sections) {
      parsedDesc.sections.forEach(section => {
        // Skip some sections that might be redundant or too long
        if (['Key Features', 'Unique Selling Points', 'Safety Features', 'Highlights'].includes(section.title)) {
          extracted.push({
            q: `WHAT ARE THE ${section.title.toUpperCase()} OF THIS PRODUCT?`,
            a: section.content
          });
        }
      });
    }

    // 3. Material Info
    if (product.material_name && product.material_name !== 'null' && product.material_name !== '') {
      extracted.push({
        q: `WHAT MATERIAL IS USED FOR THIS ${product.master_category?.toUpperCase() || 'PRODUCT'}?`,
        a: `This product is crafted from high-quality ${product.material_name}, ensuring durability and superior performance.`
      });
    }

    // 4. Physical Specifications
    if (product.weight || product.item_dimensions) {
      const weightStr = product.weight ? `${product.weight} kg` : '';
      const dimStr = product.item_dimensions ? ` with dimensions ${product.item_dimensions}` : '';
      extracted.push({
        q: `WHAT ARE THE PHYSICAL SPECIFICATIONS OF THIS PRODUCT?`,
        a: `The product has a net weight of approximately ${weightStr}${dimStr}. Its compact design makes it ideal for modern kitchens.`
      });
    }

    // 5. Warranty Info
    if (product.warranty_text && product.warranty_text !== 'N/A' && product.warranty_text !== 'null') {
      extracted.push({
        q: `WHAT IS THE WARRANTY ON THIS ${product.master_category?.toUpperCase() || 'PRODUCT'}?`,
        a: product.warranty_text
      });
    }

    // 6. Certification (Only for ISI certified categories)
    const category = (product.category?.name || product.master_category || product.category || '').toLowerCase();
    const isNonCertifiedCategory = category.includes('tandoor') || category.includes('cookware') || category.includes('steam');

    if (product.certification && product.certification !== 'N/A' && product.certification !== 'null' && !isNonCertifiedCategory) {
      extracted.push({
        q: `IS THIS PRODUCT CERTIFIED?`,
        a: `Yes, this product is ${product.certification}.`
      });
    }

    // 7. Customer Support Info
    if (product.customer_care && product.customer_care !== 'null') {
      extracted.push({
        q: `HOW CAN I CONTACT SUMMIT CUSTOMER CARE?`,
        a: `For any queries or support, you can contact our customer care at:\n${product.customer_care.replace(/^"|"$/g, '').replace(/\\n/g, '\n').trim()}`
      });
    }

    // 8. Category Fallbacks (Ensure at least 5 FAQs)
    const defaults = [];
    if (category.includes('pressure cooker')) {
      defaults.push({ q: "IS THIS PRESSURE COOKER SAFE TO USE ON INDUCTION COOKTOPS?", a: "Yes, our tri-ply and heavy-base pressure cookers feature an induction-compatible bottom, making them versatile for both gas stoves and induction cooktops." });
    } else if (category.includes('tandoor')) {
      defaults.push({ q: "DOES THIS GAS TANDOOR REQUIRE ASSEMBLY?", a: "Most of our Gas Tandoors come pre-assembled and ready to use on your gas stove right out of the box." });
    } else if (category.includes('mixer') || category.includes('grinder')) {
      defaults.push({ q: "ARE THE JARS RUST-PROOF?", a: "Yes, the jars are made of premium-grade stainless steel which is 100% rust-proof and food-safe." });
    }

    if (!isNonCertifiedCategory) {
      defaults.push({
        q: "HOW DOES SUMMIT ENSURE PRODUCT SAFETY?",
        a: "Safety is our top priority. All our products comply with ISI and ISO standards and undergo rigorous multi-level testing to ensure total peace of mind for our customers.",
      });
    }

    // Merge defaults only if we need more to reach 5
    let finalFaqs = [...extracted];
    for (const def of defaults) {
      if (finalFaqs.length >= 6) break;
      // Avoid duplicate questions
      if (!finalFaqs.some(f => f.q === def.q)) {
        finalFaqs.push(def);
      }
    }

    // Final fallback if still too few
    if (finalFaqs.length < 5) {
      finalFaqs.push({
        q: "WHY SHOULD I CHOOSE SUMMIT HOME APPLIANCES?",
        a: "Summit is a premium brand dedicated to engineering excellence, durability, and safety. We use superior materials like tri-ply stainless steel and pure aluminum to provide the best cooking experience."
      });
    }

    return finalFaqs;
  }, [product]);

  // Helper function to truncate text by word count
  const truncateByWords = (text, limit) => {
    if (!text) return '';
    const words = text.split(/\s+/);
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(' ') + '...';
  };

  // Helper function to strip HTML tags for word counting
  const stripHtml = (html) => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Handle image load events
  const handleImageLoad = (imageId) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: true }));
  };

  const handleImageError = (imageId) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: 'error' }));
  };


  const mainSlider = useRef(null);
  const thumbSlider = useRef(null);
  const reviewSliderRef = useRef(null);

  /* -------------------- API CALL -------------------- */
  // only showing critical fixed parts (no repetition) 2

  useEffect(() => {
    if (!product_id) return;

    setLoading(true);

    axios
      .get(`/api/products/view/${product_id}`, {
        headers: { Accept: "application/json" },
        withCredentials: true,
      })
      .then((res) => {
        console.log("PRODUCT API 👉", res.data);

        // Handle both old and new API response structures
        let productData = res.data;

        // If response is wrapped in data property
        if (res.data?.data) {
          productData = res.data.data;
        }

        // If productData is an array, take the first element
        if (Array.isArray(productData)) {
          productData = productData[0];
        }

        // Check if data is nested inside a 'product' object
        if (productData && productData.product && typeof productData.product === 'object') {
          // Merge top level fields (like images if they exist outside) with product fields
          productData = { ...productData, ...productData.product };
        }

        // Ensure product_id exists (either from id or product_id field)
        if (productData && !productData.product_id && productData.id) {
          productData.product_id = productData.id;
        }

        // If variants exist but no images array, create images from variants
        if (productData?.variants && Array.isArray(productData.variants) && !productData.images) {
          productData.images = productData.variants
            .map(v => v.image)
            .filter(img => img && img.startsWith('http')); // Only include S3 presigned URLs
        }

        setProduct(productData);
        setSelectedShape(productData.shape || "");
        setSelectedBottom(productData.bottom_type || productData.bottom || "");
      })
      .catch((err) => {
        console.error("Product fetch error:", err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [product_id]);

  // Fetch and aggregate reviews
  useEffect(() => {
    if (!product_id) return;

    axios
      .get(`/api/reviews`, {
        headers: { Accept: "application/json" },
        withCredentials: true,
      })
      .then((res) => {
        const allReviews = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        
        // Filter reviews for this product
        const productReviews = Array.isArray(allReviews) 
          ? allReviews.filter(r => String(r.product_id) === String(product_id))
          : [];
        
        setReviews(productReviews);
      })
      .catch((err) => {
        console.error("Reviews fetch error:", err);
      });
  }, [product_id]);

  // Calculate aggregated stats whenever reviews change
  useEffect(() => {
    const mergedReviews = [...localReviews, ...reviews];
    setReviewCount(mergedReviews.length);

    if (mergedReviews.length > 0) {
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      let totalRating = 0;
      
      mergedReviews.forEach(r => {
        const rating = Math.round(Number(r.rating));
        if (distribution[rating] !== undefined) {
          distribution[rating]++;
        }
        totalRating += Number(r.rating);
      });
      
      setRatingDistribution(distribution);
      setAverageRating((totalRating / mergedReviews.length).toFixed(2));
    } else {
      setRatingDistribution({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
      setAverageRating(0);
    }
  }, [reviews, localReviews]);







  /* -------------------- LOADING / ERROR -------------------- */
  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#941007] mx-auto mb-4"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    console.error("Product is null or undefined");
    return <div className="text-center py-20 text-[#941007]">Product not found. Product ID: {product_id}</div>;
  }

  // Ensure product has an ID
  if (!product.product_id && product.id) {
    product.product_id = product.id;
  }

  if (!product.product_id) {
    console.error("Product missing product_id:", product);
    return <div className="text-center py-20 text-[#941007]">Invalid product data</div>;
  }



  /* -------------------- IMAGES COLLECTION -------------------- */
  const allImages = [];

  // Add main product image (S3 presigned URL)
  if (product.image || product.image_url) {
    allImages.push({
      id: "main",
      src: getImageSrc(product.image || product.image_url),
    });
  }

  // Add variant images if available
  if (Array.isArray(product.variants)) {
    // Add unique variant images
    const variantImages = new Set();
    product.variants.forEach((variant, index) => {
      if (variant.image && variant.image.startsWith('http')) {
        // Use variant detail_id if available, otherwise use index
        const imageId = variant.detail_id ? `variant-${variant.detail_id}` : `variant-${index}`;
        if (!variantImages.has(variant.image)) {
          variantImages.add(variant.image);
          allImages.push({
            id: imageId,
            src: getImageSrc(variant.image),
          });
        }
      }
    });
  }

  // Add additional images array if available
  if (Array.isArray(product.images)) {
    product.images.forEach((img, index) => {
      allImages.push({
        id: `img-${index}`,
        src: getImageSrc(img),
      });
    });
  }

  console.log('📷 All Images Collected:', allImages);
  console.log('📦 Product Data:', product);




  /* -------------------- SLIDER SETTINGS -------------------- */
  const mainSettings = {
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    asNavFor: thumbSlider.current,
  };

  const thumbSettings = {
    slidesToShow: 5,
    slidesToScroll: 1,
    vertical: true,
    arrows: false,
    focusOnSelect: true,
    asNavFor: mainSlider.current,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          vertical: false,
        }
      }
    ]
  };



  /* -------------------- JSX -------------------- */
  return (
    <div className="px-4 sm:px-8 md:px-14 bg-white">
      <CategoryMegaMenu />
      {/* Breadcrumb */}
      <nav className="mb-4 sm:mb-6 overflow-hidden" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-y-2 gap-x-1 sm:gap-x-3 text-[11px] sm:text-sm md:text-base">
          <li className="flex items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-gray-500 hover:text-[#941007] transition-colors font-medium rounded-md px-1.5 py-1 -ml-1 hover:bg-[#941007]/5"
            >
              <FaHome className="size-3 sm:size-4 text-gray-400" />
              Home
            </Link>
          </li>
          <li className="flex items-center text-gray-300" aria-hidden>
            <FaChevronRight className="size-2 sm:size-3 shrink-0" />
          </li>
          <li className="flex items-center">
            <Link
              to={`/category/${(product.category?.slug || product.category?.name || product.master_category || 'products').toString().toLowerCase().replace(/\s+/g, '-')}`}
              className="text-gray-600 hover:text-[#941007] transition-colors font-medium rounded-md px-1.5 py-1 hover:bg-[#941007]/5 whitespace-nowrap"
            >
              {product.category?.name || product.master_category || 'Products'}
            </Link>
          </li>
          <li className="flex items-center text-gray-300" aria-hidden>
            <FaChevronRight className="size-2 sm:size-3 shrink-0" />
          </li>
          <li className="min-w-0">
            <span
              className="font-semibold text-[#941007] bg-[#941007]/5 px-2.5 py-1.5 rounded-lg border-l-2 border-[#941007] inline-block max-w-full truncate"
              aria-current="page"
            >
              {(product.name || product.product_name)?.toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
                .replace(/(\d)l\b/g, '$1L')}
            </span>
          </li>
        </ol>
      </nav>

      <div className="flex mt-6 sm:mt-12 flex-col md:flex-row gap-4 md:gap-8">
        {/* ================= IMAGES ================= */}
        <div className="md:w-1/2 flex flex-col md:flex-row gap-2 md:gap-4">
          {allImages.length === 0 ? (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded">
              <div className="text-center">
                <p className="text-gray-600 mb-2">No images available</p>
                <p className="text-sm   text-gray-500">Product: {product.name || product.product_name}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Thumbnails - Vertical on desktop, horizontal on mobile */}
              <div className="order-2 md:order-1 w-full md:w-16 lg:w-[90px] relative md:max-h-[300px] lg:max-h-[450px] h-20 md:h-auto">
                {/* Mobile prev button */}
                <button
                  onClick={() => thumbSlider.current?.slickPrev()}
                  className="absolute -left-8 md:-top-8 md:left-1/2 top-1/2 md:-translate-y-0 -translate-y-1/2 md:-translate-x-1/2 bg-[#941007] text-white p-1 rounded-full z-10"
                >
                  <FaChevronLeft className="md:hidden" />
                  <FaChevronUp className="hidden md:block" />
                </button>

                <Slider ref={thumbSlider} {...thumbSettings}>
                  {allImages.map((img) => (
                    <div key={img.id} className="p-1 cursor-pointer">
                      <div className="relative">
                        {!imageLoadingStates[img.id] && (
                          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
                        )}
                        <img
                          src={getOptimizedImageSrc(img.src, 150, 60)}
                          alt={`Thumbnail ${img.id}`}
                          className="border rounded w-full h-16 md:h-16 lg:h-20 object-cover"
                          loading="lazy"
                          onLoad={() => handleImageLoad(img.id)}
                          onError={() => handleImageError(img.id)}
                          style={{
                            opacity: imageLoadingStates[img.id] ? 1 : 0,
                            transition: 'opacity 0.3s ease-in-out'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </Slider>

                {/* Mobile next button */}
                <button
                  onClick={() => thumbSlider.current?.slickNext()}
                  className="absolute -right-8 md:static md:flex md:justify-center md:mt-3 top-1/2 -translate-y-1/2 md:translate-y-0 bg-[#941007] text-white p-1 rounded-full z-10 ml-7"
                >
                  <FaChevronRight className="md:hidden" />
                  <FaChevronDown className="hidden md:block" />
                </button>
              </div>

              {/* Main Image */}
              <div className="order-1 md:order-2 relative w-full max-w-xl ">
                <button
                  onClick={() => mainSlider.current?.slickPrev()}
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-[#941007] text-white p-1 sm:p-2 rounded-full z-10"
                >
                  <FaChevronLeft />
                </button>

                <button
                  onClick={() => mainSlider.current?.slickNext()}
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-[#941007] text-white p-1 sm:p-2 rounded-full z-10"
                >
                  <FaChevronRight />
                </button>

                {allImages.length > 0 ? (
                  <Slider ref={mainSlider} {...mainSettings}>
                    {allImages.map((img, index) => (
                      <div key={img.id}>
                        <div className="relative">
                          {!imageLoadingStates[img.id] && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                          )}
                          <ImageMagnifier
                            src={getOptimizedImageSrc(img.src, 800, 80)}
                            alt={`Product image ${index + 1}`}
                            className="w-full max-h-[340px] sm:max-h-[350px] md:max-h-[550px] object-contain cursor-crosshair"
                            loading={index === 0 ? "eager" : "lazy"}
                            onLoad={() => handleImageLoad(img.id)}
                            onError={() => handleImageError(img.id)}
                            style={{
                              opacity: imageLoadingStates[img.id] ? 1 : 0,
                              transition: 'opacity 0.3s ease-in-out'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="relative">
                    {!mainImageLoaded && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                    )}
                    <ImageMagnifier
                      src="/asset/images/dummy-image-square.jpg"
                      alt="Product placeholder"
                      className="w-full max-h-[250px] sm:max-h-[350px] md:max-h-[450px] object-contain cursor-crosshair"
                      onLoad={() => setMainImageLoaded(true)}
                      style={{
                        opacity: mainImageLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ================= DETAILS ================= */}
        <div className="px-0 sm:px-2 ml-0 sm:ml-5 md:w-1/2 w-full">
          <div className="flex justify-between items-center gap-2 mb-2 flex-wrap">
            {/* <!-- Bestseller Badge --> */}
            <div className="relative mt-6 sm:mt-1 inline-block bg-[#941007] px-2 py-0.5 overflow-hidden rounded">
              <span className="relative z-10 items-center text-[11px] sm:text-[10px] font-bold uppercase tracking-wide text-white">
                Bestseller
              </span>
            </div>

            {/* <!-- Rating & Reviews --> */}
            <div className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-1 text-sm flex-wrap">
              {/* <!-- Stars & Review Count Link --> */}
              <div
                onClick={() => {
                  document.getElementById('reviews-section')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
                className="flex items-center gap-1.5 cursor-pointer group/rev"
              >
                <div className="flex items-center text-[#FACC15] text-lg sm:text-lg group-hover/rev:scale-105 transition-transform">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.round(averageRating) ? '' : 'opacity-30'} />
                  ))}
                </div>
                <span className="text-gray-600 text-lg sm:text-lg group-hover/rev:text-[#941007] transition-colors underline-offset-4 hover:underline">
                  {reviewCount} reviews
                </span>
              </div>

              {/* Vertical Divider */}
              <div className="h-5 w-[1px] bg-gray-300" />

              {/* <!-- Social Share --> */}
              <div
                onClick={async () => {
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: product.name || product.product_name,
                        url: window.location.href,
                      });
                    } catch (err) {
                      console.log("Error sharing", err);
                    }
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Product link copied to clipboard!");
                  }
                }}
                className="flex items-center gap-2 cursor-pointer group/social"
              >
                <span className="text-gray-600 text-lg sm:text-lg font-medium group-hover/social:text-[#941007] transition-all">
                  Social
                </span>
                <div className="p-1.5 rounded-full group-hover/social:bg-red-50 transition-all">
                  <IoShareSocial className="text-gray-500 text-lg sm:text-lg group-hover/social:text-[#941007]" />
                </div>
              </div>
            </div>
          </div>



          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-4 sm:mt-0 font-['Helvetica_Now_Display',_sans-serif] tracking-tight leading-tight">
            {(product.product_name || product.name)?.toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
              .replace(/(\d)l\b/g, '$1L')}
          </h1>


          {/* Product Description Preview hidden */}
          <button className="text-xs sm:text-sm bg-gray-100 px-2 py-1 text-gray-600 mt-2">
            SKU: {product.product_id || 'SI1F'}
          </button>
          {/* Price Section */}
          <div className="mt-4">
            {(() => {
              const mrpVal = parseFloat(String(product.mrp || product.price || 0).replace(/[^\d.]/g, '')) || 0;
              const discount = 0.10; // 10% discount
              const discountedPrice = Math.floor(mrpVal * (1 - discount));
              const savings = mrpVal - discountedPrice;

              if (mrpVal === 0) return null;

              return (
                <>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-bold text-black">
                      ₹{discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm sm:text-base text-gray-500 line-through">
                      MRP: ₹{mrpVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[11px] sm:text-xs font-semibold">
                      Save ₹{savings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-1 font-medium">
                    (Inclusive of all taxes)
                  </p>
                </>
              );
            })()}
          </div>
          {/* <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {[
                { icon: "/asset/iconvector/Vector.png", label: "Premium Quality" },
                { icon: "/asset/iconvector/basil_stack-solid.png", label: "Long-lasting 3 Layer Body" },
                { icon: "/asset/iconvector/emojione-monotone_pot-of-food.png", label: "No Food Burning/Sticking" },
                { icon: "/asset/iconvector/Vector (3).png", label: "Super Easy to Clean" },
                { icon: "/asset/iconvector/Vector (4).png", label: "Heating & Fast Cooking" },
                { icon: "/asset/iconvector/Vector (5).png", label: "ISI & ISO 9001 Certified" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border border-gray-200 bg-white hover:border-[#941007]/40 hover:shadow-md hover:bg-[#FFFBFA] transition-all duration-200 group"
                >
                  <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#941007]/10 flex items-center justify-center group-hover:bg-[#941007]/15 transition-colors">
                    <img
                      src={item.icon}
                      alt=""
                      className="size-4 sm:size-5 object-contain"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-gray-900">
                    {item.label}
                  </span>
                </div>
              ))}
            </div> */}

          <div className="mt-3 flex items-center gap-2 flex-wrap text-sm sm:text-base">
            <h3 className="font-bold text-base sm:text-lg whitespace-nowrap">Capacity:</h3>
            <span className="text-gray-500 font-normal">
              {isPressureCooker
                ? `For ${getSuitablePeople(getProductCapacity(product)) || getProductCapacity(product) || 'N/A'}`
                : (getProductCapacity(product) || product.weight || product.net_weight || 'N/A')
              }
            </span>
          </div>

          {catalogDisplaySizes && catalogDisplaySizes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {catalogDisplaySizes.map((sz) => {
                const currentTok = normalizeSizeToken(getProductCapacity(product));
                const isCurrent = currentTok && normalizeSizeToken(sz) === currentTok;

                // Format "1L" -> "1 Litre", "1.5L" -> "1.5 Litres"
                const displaySize = sz.replace(/(\d+\.?\d*)\s*[Ll]/, (match, n) => {
                  return parseFloat(n) === 1 ? "1 Litre" : `${n} Litres`;
                });

                return (
                  <span
                    key={sz}
                    className={`px-4 py-2 rounded-full border text-xs sm:text-sm font-medium transition-all cursor-default ${isCurrent
                      ? "border-[#941007] text-[#941007] bg-[#FFFBFA]"
                      : "border-transparent bg-[#F5F5F5] text-black"
                      }`}
                  >
                    {displaySize}
                  </span>
                );
              })}
            </div>
          )}

          {/* Shape & Bottom Selection for Cooker category */}
          {(() => {
            const categoryName = (product.category?.name || product.master_category || "").toLowerCase();
            if (categoryName.includes("cooker")) {
              let shapes = [];
              if (isInnerLidProduct(product)) {
                shapes = ["Plain", "C-tura", "Handi"];
              } else if (isOuterLidProduct(product)) {
                shapes = ["Plain", "Pan"];
              } else {
                shapes = ["Plain", "C-tura", "Handi", "Pan"];
              }
              const bottoms = ["Non-induction compatible", "Induction compatible"];

              return (
                <div className="mt-4 flex flex-col sm:flex-row gap-6 sm:gap-10">
                  {/* Shape Section */}
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-base sm:text-lg">Shape:</h3>
                    <div className="flex flex-wrap gap-2">
                      {shapes.map((shape) => {
                        const isSelected = selectedShape?.toLowerCase() === shape.toLowerCase();
                        return (
                          <button
                            key={shape}
                            onClick={() => setSelectedShape(shape)}
                            className={`px-4 py-1.5 rounded-[4px] border text-xs sm:text-sm font-semibold transition-all ${isSelected
                              ? "bg-[#941007]/5 border-[#941007] text-[#941007]"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                              }`}
                          >
                            {shape}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-base sm:text-lg">Bottom:</h3>
                    <div className="flex flex-wrap gap-2">
                      {bottoms.map((bottom) => {
                        const isSelected = selectedBottom?.toLowerCase() === bottom.toLowerCase();
                        return (
                          <button
                            key={bottom}
                            onClick={() => setSelectedBottom(bottom)}
                            className={`px-4 py-1.5 rounded-[4px] border text-xs sm:text-sm font-semibold transition-all ${isSelected
                              ? "bg-[#941007]/5 border-[#941007] text-[#941007]"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                              }`}
                          >
                            {bottom}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {/* Removed orphaned p tag */}

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-4 mt-6 flex-wrap">
            <button
              onClick={() => {
                handleAddToCart({
                  product_id: product?.product_id || product?.id,
                  price: product?.mrp || product?.selling_price,
                  selling_price: product?.mrp,
                  product_name: product?.product_name,
                  image: product?.image,
                  shape: selectedShape,
                  bottom: selectedBottom,
                });
              }}
              className="flex-1 bg-[#941007] text-white px-4 sm:px-12 py-3 sm:py-3 text-nowrap rounded-full font-semibold text-sm sm:text-[16px] hover:bg-[#a21307] transition-all text-center"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                handleBuyNow({
                  product_id: product?.product_id || product?.id,
                  price: product?.mrp || product?.selling_price,
                  selling_price: product?.mrp,
                  product_name: product?.product_name,
                  image: product?.image,
                  shape: selectedShape,
                  bottom: selectedBottom,
                });
              }}
              className="flex-1 border-2 border-[#941007] text-[#941007] px-4 sm:px-12 py-3 sm:py-3 text-nowrap rounded-full font-semibold text-sm sm:text-[16px] hover:bg-[#941007] hover:text-white transition-all text-center"
            >
              Buy Now
            </button>
          </div>
          <div className="mt-6 pt-5 border-t border-dashed border-gray-200">
            <div className="flex flex-wrap items-center gap-y-4 gap-x-6 md:gap-x-8 text-[13px] sm:text-[14px] text-[#636365]">

              <div className="flex items-center gap-2">
                <img
                  src="/asset/iconvector/bitcoin-icons_tag-filled.png"
                  alt=""
                  className="size-5 opacity-80"
                />
                <span>Free shipping over ₹1199</span>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src="/asset/iconvector/hugeicons_delivery-return-01.png"
                  alt=""
                  className="size-5 opacity-80"
                />
                <span>7 Days Easy Returns</span>
              </div>

              {/* Secure Payment Badges */}
              <div className="flex items-center gap-2.5 pl-0 lg:pl-4 lg:border-l lg:border-gray-300">
                <div className="p-1.5 bg-gray-50 rounded-full text-[#941007]">
                  <FaShieldAlt size={16} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-800">100% Secure Payment</span>
                  <div className="flex items-center gap-2 text-gray-400">
                    <FaCcVisa size={22} className="text-[#1A1F71] transition-colors" />
                    <FaCcMastercard size={22} className="text-[#EB001B] transition-colors" />
                    <FaCreditCard size={22} className="text-yellow-800 transition-colors" />
                  </div>
                </div>
              </div>

            </div>

            <div className="flex flex-col gap-2 mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 md:gap-4">
                <input
                  type="text"
                  placeholder="Enter Your Pin Code"
                  className="px-4 py-2 border-2 border-gray-300 placeholder:text-xs sm:placeholder:text-sm placeholder:font-semibold rounded-full w-full sm:w-auto text-sm outline-none focus:border-[#941007] transition-colors"
                // value={pincode}
                // onChange={(e) => setPincode(e.target.value)}
                />
                <button
                  className="rounded-full border-2 border-[#941007] text-[#941007] px-6 py-2 font-semibold w-full md:w-auto hover:bg-[#941007] hover:text-white transition-colors"
                // onClick={handleCheck}
                >
                  Check Now
                </button>
                <div className="text-[#636365] font-semibold text-[14px]">
                  Enter Pincode To View Delivery Details
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Section */}
      <div className="tabs-section mt-12 px-0 sm:px-2">
        <div className="max-w-6xl mx-auto border-t border-gray-100 pt-8">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar scroll-smooth md:justify-center">
            {[
              { id: 'description', label: 'Description' },
              { id: 'additional info', label: 'Additional Info' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'returns & exchange', label: 'Returns & Exchange' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-10 py-4 text-sm sm:text-base font-bold uppercase tracking-wider transition-all relative whitespace-nowrap ${activeTab === tab.id
                  ? 'text-[#941007]'
                  : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#941007]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-8 bg-white min-h-[400px]">
            {activeTab === 'description' && (
              <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
                {(() => {
                  const desc = product.description ||
                    product.product_description ||
                    product.long_description ||
                    product.product_long_description ||
                    product.details ||
                    product.product_details ||
                    product.content;

                  if (!desc) {
                    return <p className="text-gray-500 italic text-center">No description available for this product.</p>;
                  }

                  const plainText = stripHtml(desc);
                  const parsed = parseDescriptionSections(plainText);

                  // Combine Intro and Sections into one unified list of cards
                  const introCards = parsed?.intro ? [{
                    id: `intro-single`,
                    title: 'Product Overview',
                    content: parsed.intro,
                    icon: FaCheckCircle,
                    isBullets: false
                  }] : [];

                  const sectionCards = (parsed?.sections || []).map((sec, i) => ({
                    id: `sec-${i}`,
                    title: sec.title,
                    content: sec.content,
                    icon: SECTION_ICONS[sec.title] || DEFAULT_SECTION_ICON,
                    isBullets: contentToBullets(sec.content).length > 1
                  }));

                  // --- Unified API-Driven Card Logic: Priority on actual data ---
                  const apiCards = [];

                  // 1. Warranty
                  const apiWarranty = product.warranty_text || product.warranty;
                  if (apiWarranty && apiWarranty !== 'null' && String(apiWarranty).length > 2) {
                    apiCards.push({
                      id: 'api-warranty',
                      title: 'Warranty',
                      content: String(apiWarranty).replace(/\\n/g, ' ').trim(),
                      icon: SECTION_ICONS['Warranty'],
                      isBullets: false
                    });
                  }

                  // 2. Material
                  const apiMaterial = product.material_name || product.material || product.material_composition;
                  if (apiMaterial && apiMaterial !== 'null' && String(apiMaterial).length > 1) {
                    apiCards.push({
                      id: 'api-material',
                      title: 'Material',
                      content: `This product is crafted from high-quality ${apiMaterial}, ensuring durability and superior performance.`,
                      icon: SECTION_ICONS['Material'],
                      isBullets: false
                    });
                  }

                  // 3. Safety & Certification
                  const apiCert = product.certification || product.isi_certified;
                  if (apiCert && apiCert !== 'null' && apiCert !== 'no' && String(apiCert).length > 1) {
                    apiCards.push({
                      id: 'api-safety',
                      title: 'Safety',
                      content: `Safety is our priority. This product is ${apiCert === 'yes' ? 'ISI Certified' : apiCert}, meeting rigorous quality and performance standards.`,
                      icon: SECTION_ICONS['Safety'],
                      isBullets: false
                    });
                  }

                  // 4. Box Contents
                  const apiContents = product.contents;
                  if (apiContents && apiContents !== 'null' && String(apiContents).length > 5) {
                    apiCards.push({
                      id: 'api-contents',
                      title: 'What\'s in the Box',
                      content: String(apiContents).replace(/^"|"$/g, '').replace(/\\n/g, '\n').trim(),
                      icon: FaListUl,
                      isBullets: true
                    });
                  }

                  // Merge parsed sections with API cards (API cards take priority for the same title)
                  const filteredSectionCards = sectionCards.filter(sc =>
                    !apiCards.some(ac => ac.title.toLowerCase() === sc.title.toLowerCase())
                  );

                  // Combine all cards
                  let allCards = [...introCards, ...apiCards, ...filteredSectionCards];

                  // Final Cleanup: Filter out empty or broken cards from the description
                  allCards = allCards.filter(card => card.content && card.content.length > 5);

                  // If still no cards, use fallback paragraphs
                  if (allCards.length === 0) {
                    allCards = plainTextToParagraphs(plainText).map((para, i) => ({
                      id: `fallback-${i}`,
                      title: 'Product Insight',
                      content: para,
                      icon: FaCheckCircle,
                      isBullets: false
                    }));
                  }
                  if (allCards.length === 0) {
                    allCards = plainTextToParagraphs(plainText).map((para, i) => ({
                      id: `fallback-${i}`,
                      title: 'Product Insight',
                      content: para,
                      icon: FaCheckCircle,
                      isBullets: false
                    }));
                  }

                  const initialDisplayCount = 2;
                  const hasMore = allCards.length > initialDisplayCount;
                  const displayCards = isDescriptionExpanded ? allCards : allCards.slice(0, initialDisplayCount);

                  return (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {displayCards.map((card) => {
                          const Icon = card.icon;
                          const bullets = card.isBullets ? contentToBullets(cleanText(card.content)) : [];

                          return (
                            <div key={card.id} className="h-full bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#941007]/20 transition-all group flex flex-col">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#941007] group-hover:bg-[#941007]/5 transition-colors">
                                  <Icon className="size-5" />
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">{card.title}</h4>
                              </div>
                              {card.isBullets ? (
                                <ul className="space-y-3 flex-1">
                                  {bullets.slice(0, 6).map((b, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
                                      <span className="mt-2 size-1.5 rounded-full bg-[#941007] shrink-0" />
                                      <span>{b}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-600 leading-relaxed flex-1">
                                  {cleanText(card.content)}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {hasMore && (
                        <div className="text-center pt-4">
                          <button
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            className="bg-white border-2 border-[#941007] text-[#941007] px-10 py-2.5 rounded-full text-sm font-bold hover:bg-[#941007] hover:text-white transition-all shadow-md active:scale-95"
                          >
                            {isDescriptionExpanded ? 'Show Less' : 'Load More Details'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {activeTab === 'additional info' && (
              <div className="animate-in fade-in duration-500 max-w-5xl mx-auto px-4 space-y-4">
                {(() => {
                  const groups = [
                    {
                      id: 'classification',
                      title: 'Category & Classification',
                      icon: <FaListUl className="text-[#941007]" />,
                      items: [
                        {
                          label: "Capacity",
                          value: (() => {
                            const cap = getProductCapacity(product);
                            const people = getSuitablePeople(cap);
                            if (isPressureCooker && people) return `${cap} (${people})`;
                            return cap || 'N/A';
                          })()
                        },
                        { label: "Category", value: <span className="capitalize">{product.master_category || 'Pressure Cooker'}</span> },
                        { label: "Sub-Category", value: <span className="capitalize">{product.subcat_name || 'Aluminum Pressure Cooker'}</span> },
                        { label: "Series", value: <span className="capitalize">{product.series_name || 'Classic'}</span> },
                        { label: "Box Contents", value: product.contents || '1 Pressure Cooker, User Manual, Warranty Card' }
                      ]
                    },
                    {
                      id: 'specs',
                      title: 'Product Specifications',
                      icon: <FaCogs className="text-[#941007]" />,
                      items: [
                        { label: "Material", value: product.material || product.material_composition || 'Premium Aluminum' },
                        { label: "ISI Mark", value: product.isi_certified === 'no' ? 'N/A' : 'ISI Certified (IS 2347)' },
                        { label: "Item Dimensions", value: product.item_dimensions || product.dimensions || '28 x 14 x 16 cm' },
                        { label: "Package Dimensions", value: product.package_dimensions || '30 x 16 x 18 cm' },
                        { label: "Weight", value: product.weight ? (product.weight.toString().toLowerCase().includes('kg') ? product.weight : `${product.weight} kg`) : '1.2 kg' }
                      ]
                    },
                    {
                      id: 'pricing',
                      title: 'Pricing & Tax',
                      icon: <FaCcVisa className="text-[#941007]" />,
                      items: [
                        {
                          label: "MRP",
                          value: (
                            <span className="font-bold text-[#941007]">
                              ₹{String(product.mrp || product.selling_price || 'N/A').replace(/₹/g, '').trim()}
                            </span>
                          )
                        },
                        { label: "GST Compliance", value: "Inclusive of all taxes" },
                        {
                          label: "Tax Rate",
                          value: (() => {
                            const rate = parseFloat(product.tax_rate);
                            if (isNaN(rate)) return product.tax_rate || '12%';
                            if (rate > 0 && rate < 1) return `${Math.round(rate * 100)}%`;
                            return `${Math.round(rate)}%`;
                          })()
                        },
                        { label: "HSN Code", value: product.hsn_code || '7323' }
                      ]
                    },
                    {
                      id: 'support',
                      title: 'Manufacturer & Support',
                      icon: <FaAward className="text-[#941007]" />,
                      items: [
                        {
                          label: "Brand/Manufacturer",
                          value: (() => {
                            const raw = product.manufacturer || product.manufacturer_name || 'Summit Home Appliance';
                            if (typeof raw === 'string' && raw.length > 50) {
                              return raw.split(',')[0].replace(/"/g, '').replace(/\s+B-36$/i, '').trim();
                            }
                            return raw;
                          })()
                        },
                        {
                          label: "Address",
                          value: (() => {
                            const raw = product.manufacturer || product.manufacturer_name || 'Summit Home Appliance';
                            if (typeof raw === 'string' && raw.length > 50) {
                              const parts = raw.split(/(E-MAIL\s*:|MOBILE\s*NO\s*:)/i);
                              const namePart = parts[0].split(',')[0].replace(/"/g, '').trim();
                              const restPart = parts[0].split(',').slice(1).join(',').trim().replace(/"/g, '');
                              return (namePart.toLowerCase().endsWith('b-36') ? 'B-36, ' : '') + restPart;
                            }
                            return product.manufacturer_address || 'N/A';
                          })()
                        },
                        { label: "Country of Origin", value: product.country_of_origin || 'India' },
                        {
                          label: "Customer Support",
                          value: (
                            <div className="space-y-1">
                              <div>WhatsApp: +91 9990555161</div>
                              <div>Toll Free: 1800 419 6048</div>
                            </div>
                          )
                        },
                        { label: "Email", value: 'customercare@summithomeappliance.com' },
                        { label: "Warranty", value: <span className="capitalize">{(product.warranty_text || '5 Years Manufacturer Warranty').toLowerCase()}</span> },
                        { label: "Net Quantity", value: "1 Unit" },
                        { label: "SKU/Model Number", value: product.product_id || product.sku || 'N/A' },
                        { label: "Month & Year of Manufacture", value: "As per product packaging" }
                      ]
                    }
                  ];

                  return groups.map((group) => (
                    <div key={group.id} className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white transition-all duration-300">
                      <button
                        onClick={() => toggleSection(group.id)}
                        className="w-full flex items-center justify-between p-5 bg-gray-50/50 hover:bg-gray-100/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                            {group.icon}
                          </div>
                          <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm sm:text-base">{group.title}</h3>
                        </div>
                        <div className={`transition-transform duration-300 ${openSections[group.id] ? 'rotate-180' : ''}`}>
                          <FaChevronDown className="text-gray-400" />
                        </div>
                      </button>

                      <div className={`transition-all duration-500 ease-in-out ${openSections[group.id] ? 'max-h-[1000px] opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        <table className="w-full border-collapse text-left text-sm sm:text-base">
                          <tbody>
                            {group.items.map((item, index) => (
                              <tr key={index} className={`border-b border-gray-50 hover:bg-gray-50/30 transition-colors ${index === group.items.length - 1 ? 'border-none' : ''}`}>
                                <td className="py-4 px-4 sm:px-6 bg-gray-50/30 font-bold text-gray-800 w-[40%] sm:w-1/3 align-top text-xs sm:text-sm">{item.label}</td>
                                <td className="py-4 px-4 sm:px-6 text-gray-600 text-xs sm:text-sm">{item.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div id="reviews-section" className="animate-in fade-in duration-500 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-gray-100">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="flex text-[#FACC15] text-xl mb-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.round(averageRating) ? '' : 'opacity-30'} />
                      ))}
                    </div>
                    <div className="text-sm font-bold text-gray-700">{averageRating} out of 5</div>
                    <div className="text-xs text-gray-400">Based on {reviewCount} reviews</div>
                  </div>

                  <div className="flex-1 max-w-md w-full space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-4">
                        <div className="flex text-[10px] text-gray-400 w-20">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < stars ? 'text-gray-600' : 'text-gray-200'} />
                          ))}
                        </div>
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#941007]" 
                            style={{ width: `${reviewCount > 0 ? (ratingDistribution[stars] / reviewCount) * 100 : 0}%` }} 
                          />
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 w-4">{ratingDistribution[stars]}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                      className="bg-[#941007] text-white px-8 py-2.5 rounded-full text-sm font-bold hover:bg-[#941007] transition-all shadow-md active:scale-95"
                    >
                      Write A Review
                    </button>
                    <button className="border border-[#941007] text-[#941007] px-8 py-2.5 rounded-full text-sm font-bold hover:bg-red-50 transition-all active:scale-95">
                      Ask A Question
                    </button>
                  </div>
                </div>

                {isReviewFormOpen && (
                  <div className="mt-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
                    <h3 className="text-center text-lg font-bold text-gray-800 mb-6 underline underline-offset-8 decoration-2 decoration-gray-100">Write a review</h3>
                    <div className="space-y-6 text-center">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">Rating</label>
                        <div className="flex justify-center gap-1 text-2xl text-gray-200">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              onClick={() => setUserRating(s)}
                              className={`hover:scale-110 transition-transform ${userRating >= s ? 'text-[#FACC15]' : ''}`}
                            >
                              {userRating >= s ? <FaStar /> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="text-left">
                        <label className="block text-sm font-medium text-gray-500 mb-2 text-center">Review Title</label>
                        <input 
                          type="text" 
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          placeholder="Give your review a title" 
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-red-100 outline-none transition-all placeholder:text-gray-300" 
                        />
                      </div>
                      <div className="text-left">
                        <label className="block text-sm font-medium text-gray-500 mb-2 text-center">Review content</label>
                        <textarea 
                          rows="4" 
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Start writing here..." 
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-red-100 outline-none transition-all placeholder:text-gray-300 resize-none" 
                        />
                      </div>
                      <div className="flex gap-4 justify-center pt-4 pb-12">
                        <button 
                          onClick={handleReviewSubmit}
                          disabled={submittingReview}
                          className={`bg-[#941007] text-white px-10 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-[#941007] transition-all ${submittingReview ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                        <button onClick={() => setIsReviewFormOpen(false)} className="border border-[#941007] text-[#941007] px-10 py-3 rounded-full text-sm font-bold hover:bg-red-50 transition-all">Cancel Review</button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-16 review-slider">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-wide">Recent Customer Experiences</h3>
                    <div className="flex gap-2">
                      <button onClick={() => reviewSliderRef.current?.slickPrev()} className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"><FaChevronLeft className="text-gray-400 text-xs" /></button>
                      <button onClick={() => reviewSliderRef.current?.slickNext()} className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"><FaChevronRight className="text-gray-400 text-xs" /></button>
                    </div>
                  </div>
                  
                  {(() => {
                    const allDisplayedReviews = [...localReviews, ...reviews];
                    if (allDisplayedReviews.length === 0) return (
                      <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400 italic">No reviews yet for this product. Be the first to write one!</p>
                      </div>
                    );

                    return (
                      <Slider ref={reviewSliderRef} infinite={allDisplayedReviews.length > 3} speed={500} slidesToShow={3} slidesToScroll={1} arrows={false} responsive={[{ breakpoint: 1024, settings: { slidesToShow: 2, infinite: allDisplayedReviews.length > 2 } }, { breakpoint: 640, settings: { slidesToShow: 1, infinite: allDisplayedReviews.length > 1 } }]}>
                        {allDisplayedReviews.map((rev, i) => (
                          <div key={rev.id || i} className="px-3 pb-4">
                            <div className={`bg-white rounded-2xl border border-gray-100 p-6 h-full hover:shadow-xl hover:border-[#941007]/20 transition-all duration-300 ${rev.is_local ? 'border-blue-100 bg-blue-50/20' : ''}`}>
                              <div className="flex items-center gap-1 text-yellow-500 text-xs mb-4">
                                {[...Array(5)].map((_, star) => (<FaStar key={star} className={star < rev.rating ? 'fill-current' : 'text-gray-200'} />))}
                              </div>
                              <div className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-1">
                                {rev.user?.name || `Customer ${rev.user_id || ''}`}
                                {rev.is_local && <span className="text-[8px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">Sync Pending</span>}
                              </div>
                              <div className="text-[10px] text-gray-400 font-medium mb-4">
                                {rev.created_at ? new Date(rev.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
                              </div>
                              <h4 className="font-bold text-gray-800 text-sm mb-2">{rev.title}</h4>
                              <p className="text-gray-500 text-xs italic leading-relaxed line-clamp-3 mb-4">"{rev.comment}"</p>
                            </div>
                          </div>
                        ))}
                      </Slider>
                    );
                  })()}
                </div>
              </div>
            )}

            {activeTab === 'returns & exchange' && (
              <div className="animate-in fade-in duration-500 text-gray-600 leading-relaxed max-w-4xl mx-auto">
                <div className="prose prose-sm sm:prose-base max-w-none">
                  <p className="text-sm sm:text-base mb-6">
                    We want you to love your new pressure cooker! If you're not satisfied, you may return or exchange the product within 7 days of delivery. Items must be unused, in original packaging, and include all accessories.
                  </p>
                  <ul className="space-y-4 text-sm sm:text-base">
                    <li className="flex items-start gap-3">
                      <span className="mt-2 size-1.5 rounded-full bg-[#941007] shrink-0" />
                      <span>Returns due to defects or damage will be fully covered and picked up by us.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2 size-1.5 rounded-full bg-[#941007] shrink-0" />
                      <span>For other returns (change of mind, etc.), shipping charges may apply.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2 size-1.5 rounded-full bg-[#941007] shrink-0" />
                      <span>To initiate a return or exchange, please contact our support team at <span className="text-[#941007] font-semibold">customercare@summithomeappliance.com</span> or Whatsapp us at <span className="text-[#941007] font-semibold">{product.customer_care_phone || '+91 9990555161'}</span> ( Or Call us at Toll Free: <span className="text-[#941007] font-semibold">1800 419 6048</span>).</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>








      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-black tracking-tight mx-auto mb-3 sm:mb-0 leading-[1.12] sm:leading-tight px-1 font-['Playfair_Display',_serif]">
              Frequently Asked Questions
            </h2>
            <div className="h-1 w-20 bg-[#941007] mx-auto rounded-full" />
          </div>

          <div className="max-w-5xl mx-auto border border-slate-800 rounded-sm overflow-hidden bg-white">
            {apiFaqs.map((item, index) => (
              <div key={index} className="border-b border-slate-800 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <span className="text-[13px] md:text-[14px] font-bold text-slate-900 uppercase tracking-[0.05em] pr-4">
                    {item.q}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-400 text-xl font-light">
                    {openFaqIndex === index ? "−" : "+"}
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ease-in-out ${openFaqIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="border-t border-slate-800 px-6 pb-6 pt-5 bg-[#faf9f7]/50">
                      <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <YouMayAlsoLike currentProduct={product} />
      <ExploreMoreCategories />


      <Blogs />
    </div>
  );
};

export default ProductDetails;


