import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaPlay, FaPause } from "react-icons/fa6";
import axios from "../axiosConfig";
import { CartContext } from "../context/CartContext";

const ThoughtfulPicks = ({ user }) => {
  const products = [
    {
      title: "SUMMIT KADAI 240MM TRIPLY IND ELITE",
      price: "Rs. 2,020",
      
      video: "/asset/images/reel1.mp4",
     
      productId: "kadhai",
      product_id: "SKBTIE", // REEL 1 – match & fetch by product_id
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
    // Attempt to play all videos on mount (fallback for autoPlay)
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
      if (playingIndex === index) setPlayingIndex(null); // Simple toggle
    } else {
      video.pause();
      setPlayingIndex(index); // Mark as "paused" by this index
    }
  };

  // Function to add product to cart: fetch by product_id and match by product_id only
  const handleReelAddToCart = async (e, product, index) => {
    e.stopPropagation(); // Prevent video play/pause on button click

    try {
      setLoading((prev) => ({ ...prev, [index]: true }));

      const productId = product.productId;
      const reelProductId = product.product_id ?? product.sku ?? productId; // product_id for API (reel config)

      if (!reelProductId) {
        alert("Product is not configured. Please set product_id or sku for this reel.");
        return;
      }

      // If productId is a number, use it directly as product ID
      if (typeof productId === "number") {
        await handleAddToCart(productId);
        alert("Product added to cart successfully!");
        return;
      }

      // Fetch product: try direct by id (e.g. /api/products/view/SKBTIE) first, then query params
      let productData = null;
      try {
        const directRes = await axios.get(
          `/api/products/view/${encodeURIComponent(reelProductId)}`,
          { withCredentials: true }
        );
        const raw = directRes.data?.data ?? directRes.data;
        if (raw) {
          productData = Array.isArray(raw) ? raw[0] : raw;
          if (productData && (productData.product_id || productData.detail_id || productData.id)) {
            // use it
          } else {
            productData = null;
          }
        }
      } catch (_) {
        // Direct fetch not supported or 404; fall back to list + match
      }

      if (!productData) {
        let list = [];
        const res = await axios.get(
          `/api/products/view?product_id=${encodeURIComponent(reelProductId)}`,
          { withCredentials: true }
        );
        list = res.data?.data || [];
        if (list.length === 0) {
          const searchRes = await axios.get(
            `/api/products/view?search=${encodeURIComponent(reelProductId)}`,
            { withCredentials: true }
          );
          list = searchRes.data?.data || [];
        }
        if (!list || list.length === 0) {
          alert(`No product found for product_id "${reelProductId}".`);
          return;
        }
        const productIdUpper = String(reelProductId).toUpperCase();
        productData = list.find(
          (p) => p.product_id && String(p.product_id).toUpperCase() === productIdUpper
        );
        if (!productData) {
          alert(`Product with product_id "${reelProductId}" not found in response.`);
          return;
        }
      }

      const id = productData.product_id ?? productData.id ?? productData.detail_id;
      const price =
        productData.selling_price ??
        productData.price ??
        productData.detail_price ??
        productData.mrp ??
        (product.price ? parseFloat(String(product.price).replace(/[^0-9.]/g, "")) : null);

      if (!id) {
        alert("Product ID not found in response.");
        return;
      }

      if (!price && price !== 0) {
        alert("Product price not available.");
        return;
      }

      const cartProduct = {
        ...productData,
        product_id: id,
        id,
        price: Number(price),
        selling_price: Number(price),
        sku: productData.sku || productData.product_id || product.product_id,
        product_name: productData.product_name || productData.name || productData.title || product.title,
      };
      await handleAddToCart(cartProduct);

      const productName =
        productData.product_name ||
        productData.name ||
        productData.title ||
        product.title ||
        "Product";
      alert(`${productName} added to cart!`);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <section className="w-full bg-[#F5F5F7] py-8 sm:py-10 px-6 sm:px-6">
      {/* Mobile View */}
      <div className="md:hidden ">
        <h2 className="text-2xl font-semibold text-black">Reels in Action: Summit in Your Kitchen</h2>

      </div>
      <p className="md:hidden text-[#636365] text-justify   text-sm mt-2">
        See your favorite creators whip up magic with Summit home and kitchen
        appliances - shop the exact product below
      </p>

      {/* Desktop View */}
      <div className="hidden md:flex md:w-full px-8 mx-8">
        <h2 className="text-xl sm:text-3xl font-semibold">Reels in Action</h2>
        <p className="text-[#636365] text-3xl">: Summit in Your Kitchen</p>
      </div>
      <p className="hidden md:block text-[#636365] px-8 mx-8 mt-2 font-semibold">
        See your favorite creators whip up magic with Summit home and kitchen
        appliances - shop the exact product beflow
      </p>

      <div className="flex overflow-x-auto gap-4 px-8 mt-6 pb-4 snap-x snap-mandatory">
        {products.map((item, i) => (
          <div key={i} className="flex flex-col items-center flex-shrink-0 w-[250px] md:hidden snap-center">
            {/* VIDEO BOX */}
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

              {/* Play/Pause Button */}
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

              {/* Overlay Content - Title, Price, Add to Cart */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20">
                {/* <div className="flex items-center mb-2 text-white text-[12px] font-normal space-x-2">
                  <FaInstagram className="text-white text-sm" />
                  <span>@cookwithmark</span>
                </div> */}

                <h3 className="text-sm font-semibold text-white mb- line-clamp-1">
                  {item.title}
                </h3>

                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm text-white">
                      <span className="font-semibold">{item.price}</span>{" "}
                      <span className="text-gray-300 line-through ml-1 text-xs">
                        {item.oldPrice}
                      </span>
                    </p>

                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleReelAddToCart(e, item, i)}
                  disabled={loading[i]}
                  className="w-full bg-[#B91508] text-white text-sm px-3 py-2 rounded-full hover:bg-red-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading[i] ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-4 px-10 mt-6 justify-items-center">
        {products.map((item, i) => (
          <div key={i} className="flex flex-col items-center w-full max-w-[280px]">
            {/* VIDEO BOX */}
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

              {/* Play/Pause Button */}
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

              {/* Overlay Content - Title, Price, Add to Cart */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20">
                {/* <div className="flex items-center mb-2 text-white text-sm font-normal space-x-2">
                  <FaInstagram className="text-white text-lg" />
                  <span>@cookwithmark</span>
                </div> */}

                <h3 className="text-lg font-semibold text-white mb-0   line-clamp-1">
                  {item.title}
                </h3>

                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-base text-white">
                      <span className="font-semibold">{item.price}</span>{" "}
                      <span className="text-gray-300 line-through ml-1 text-sm">
                        {item.oldPrice}
                      </span>
                    </p>

                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleReelAddToCart(e, item, i)}
                  disabled={loading[i]}
                  className="w-full bg-[#B91508] text-white text-sm px-4 py-2 rounded-full hover:bg-red-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading[i] ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ThoughtfulPicks;
