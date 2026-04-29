import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaPlay, FaPause } from "react-icons/fa6";
import axios from "../axiosConfig";
import { CartContext } from "../context/CartContext";

const ReelsSection = ({ user }) => {
  const products = [
    {
      title: "SUMMIT KADAI 240MM TRIPLY IND ELITE",
      price: "Rs. 2,020",
      video: "/asset/images/reel1.mp4",
      productId: "kadhai",
      product_id: "SKBTIE", // REEL 1
    },
    {
      title: "SUMMIT ALPHA 1000W 4 JARS",
      price: "Rs. 6,130",
      video: "/asset/images/reel2.mp4",
      productId: "alpha",
      product_id: "SMGALP4", // REEL 2
    },
    {
      title: "SUMMIT INNERLID 3L C-TURA TRIPLY IND ELITE PRESSURE COOKER",
      price: "Rs. 2,970",
      video: "/asset/images/reel3.mp4",
      productId: "pressure cooker",
      product_id: "SI3CTIE", // REEL 3
    },
    {
      title: "SUMMIT GAS TANDOOR HEAVY ASSEMBELED",
      price: "Rs. 2,580",
      video: "/asset/images/reel4.mp4",
      productId: "gas tandoor",
      product_id: "SGTHA", // REEL 4
    },
    {
      title: "SUMMIT INNERLID PRESSURE COOKER 2L PLAIN FINE",
      price: "Rs. 1,170",
      video: "/asset/images/reel5.mp4",
      productId: "pressure cooker",
      product_id: "SI2F", // REEL 5
    },
  ];

  const { handleAddToCart, handleBuyNow } = useContext(CartContext);
  const [loading, setLoading] = useState({});

  // To store refs for each video
  const videoRefs = useRef([]);
  const [playingIndex, setPlayingIndex] = useState(null);

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.play().catch(error => console.log("Auto-play prevented:", error));
      }
    });
  }, []);

  const togglePlay = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      video.play();
      if (playingIndex === index) setPlayingIndex(null);
    } else {
      video.pause();
      setPlayingIndex(index);
    }
  };

  const handleReelAddToCart = async (e, product, index) => {
    e.stopPropagation();

    try {
      setLoading((prev) => ({ ...prev, [index]: true }));

      const reelProductId = product.product_id ?? product.sku ?? product.productId;

      if (!reelProductId) {
        alert("Product is not configured correctly.");
        return;
      }

      let productData = null;
      
      // 1. Try direct fetch by SKU/ID
      try {
        const directRes = await axios.get(`/api/products/view/${encodeURIComponent(reelProductId)}`);
        const raw = directRes.data?.data ?? directRes.data;
        if (raw) {
          const item = Array.isArray(raw) ? raw[0] : raw;
          if (item && (item.id || item.product_id || item.sku)) {
            productData = item;
          }
        }
      } catch (err) {
        console.warn(`Direct fetch failed for ${reelProductId}, trying search...`);
      }

      // 2. Fallback to list search if direct fetch didn't yield a perfect match
      if (!productData) {
        const res = await axios.get(`/api/products/view?search=${encodeURIComponent(reelProductId)}`);
        const list = res.data?.data || res.data || [];
        
        if (Array.isArray(list) && list.length > 0) {
          const productIdUpper = String(reelProductId).toUpperCase();
          productData = list.find(p => 
            (p.product_id && String(p.product_id).toUpperCase() === productIdUpper) ||
            (p.sku && String(p.sku).toUpperCase() === productIdUpper) ||
            (p.id && String(p.id).toUpperCase() === productIdUpper) ||
            (p.detail_id && String(p.detail_id).toUpperCase() === productIdUpper)
          );

          // Last resort: name match if list is small
          if (!productData) {
            productData = list.find(p => 
              (p.product_name || p.name || "").toUpperCase().includes(productIdUpper)
            );
          }
        }
      }

      if (!productData) {
        alert(`Sorry, we couldn't find the product details for "${product.title}" (ID: ${reelProductId}).`);
        return;
      }

      // Ensure we have a valid ID and price for the cart
      const finalId = productData.id ?? productData.product_id ?? productData.detail_id ?? productData.sku;
      const rawPrice = productData.selling_price ?? productData.price ?? productData.detail_price ?? productData.mrp;
      const finalPrice = rawPrice ? parseFloat(String(rawPrice).replace(/[^0-9.]/g, "")) : parseFloat(String(product.price).replace(/[^0-9.]/g, ""));

      if (!finalId) {
        alert("Could not determine the Product ID.");
        return;
      }

      const cartProduct = {
        ...productData,
        id: finalId,
        product_id: finalId,
        price: finalPrice,
        selling_price: finalPrice,
        product_name: productData.product_name || productData.name || product.title,
        sku: productData.sku || reelProductId,
      };

      await handleAddToCart(cartProduct);
      // Toast/Alert is handled by CartContext, but we can add a local one if needed
    } catch (error) {
      console.error("Error adding reel product to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <section className="w-full bg-[#F5F5F7] py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto w-full min-w-0">
        <header className="mb-6 sm:mb-8 md:mb-10 text-left max-w-4xl pr-1">
          <h2 className="font-serif font-bold text-black tracking-tight text-[20px] sm:text-3xl md:text-4xl lg:text-[2.625rem] lg:leading-[1.15] text-balance">
            Reels in Action: Summit in Your Kitchen
          </h2>
          <p className="mt-3 sm:mt-4 text-[#636365] text-[13px] sm:text-sm md:text-[15px] lg:text-base font-medium font-gotham leading-relaxed sm:leading-relaxed max-w-3xl text-pretty">
            See your favorite creators whip up magic with Summit home and kitchen appliances — shop the exact product below
          </p>
        </header>

      <div className="flex overflow-x-auto gap-3 sm:gap-4 mt-6 pb-4 snap-x snap-mandatory scrollbar-hide -mx-1 px-1 sm:mx-0 sm:px-0">
        {products.map((item, i) => (
          <div key={i} className="flex flex-col items-center shrink-0 w-[250px] md:hidden snap-center">
            <div className="relative w-full overflow-hidden rounded-2xl shadow-md group">
              <Link to="#">
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  src={item.video}
                  loop
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-[450px] object-cover rounded-2xl"
                ></video>
              </Link>
              <button
                onClick={() => togglePlay(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                {playingIndex === i ? (
                  <FaPlay className="text-white text-4xl drop-shadow-lg" />
                ) : (
                  <FaPause className="text-white text-4xl drop-shadow-lg" />
                )}
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20">
                <h3 className="text-sm font-semibold text-white mb-0 line-clamp-1">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm text-white">
                      <span className="font-semibold">{item.price}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleReelAddToCart(e, item, i)}
                  disabled={loading[i]}
                  className="w-full bg-[#941007] text-white text-sm px-3 py-2 rounded-full hover:bg-[#941007] transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading[i] ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mt-6 md:mt-8 justify-items-center w-full">
        {products.map((item, i) => (
          <div key={i} className="flex flex-col items-center w-full max-w-[280px]">
            <div className="relative w-full overflow-hidden rounded-2xl shadow-md group">
              <Link to="#">
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  src={item.video}
                  loop
                  autoPlay
                  muted
                  playsInline
                  className="w-[280px] h-[450px] object-cover rounded-2xl"
                ></video>
              </Link>
              <button
                onClick={() => togglePlay(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                {playingIndex === i ? (
                  <FaPlay className="text-white text-4xl drop-shadow-lg" />
                ) : (
                  <FaPause className="text-white text-4xl drop-shadow-lg" />
                )}
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20">
                <h3 className="text-lg font-semibold text-white mb-0 line-clamp-1">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-base text-white">
                      <span className="font-semibold">{item.price}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleReelAddToCart(e, item, i)}
                  disabled={loading[i]}
                  className="w-full bg-[#941007] text-white text-sm px-4 py-2 rounded-full hover:bg-[#941007] transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading[i] ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default ReelsSection;
