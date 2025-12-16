import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaPlay, FaPause } from "react-icons/fa6";
import axios from "../axiosConfig";
import { CartContext } from "../context/CartContext";

const ThoughtfulPicks = ({ user }) => {
  const products = [
    {
      title: "Mixer Grinder Set",
      price: "Rs. 999",
      oldPrice: "Rs. 2999",
      video: "/asset/images/reel1.mp4",
      thumbnail: "/asset/images/reel1.png",
    },
    {
      title: "Kadhai Cookware",
      price: "Rs. 999",
      oldPrice: "Rs. 2999",
      video: "/asset/images/reel2.mp4",
      thumbnail: "/asset/images/reel2.png",
    },
    {
      title: "Inner Lid Pressure Cooker",
      price: "Rs. 999",
      oldPrice: "Rs. 2999",
      video: "/asset/images/reel3.mp4",
      thumbnail: "/asset/images/reel1.png",
    },
    {
      title: "Kadhai Cookware",
      price: "Rs. 999",
      oldPrice: "Rs. 2999",
      video: "/asset/images/reel4.mp4",
      thumbnail: "/asset/images/reel2.png",
    },
    {
      title: "Mixer Grinder Set",
      price: "Rs. 999",
      oldPrice: "Rs. 2999",
      video: "/asset/images/reel5.mp4",
      thumbnail: "/asset/images/reel1.png",
    },
  ];

  const { handleAddToCart, handleBuyNow } = useContext(CartContext);

  // To store refs for each video
  const videoRefs = useRef([]);
  const [playingIndex, setPlayingIndex] = useState(null);

  const togglePlay = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlayingIndex(index);
    } else {
      video.pause();
      setPlayingIndex(null);
    }
  };

  return (
    <section className="w-full bg-[#F5F5F7] py-5 sm:py-10 px-6">
      {/* Mobile View */}
      <div className="md:hidden ">
        <h2 className="text-[15px] font-semibold text-black">Reels in Action: Summit in Your Kitchen</h2>
     
      </div>
      <p className="md:hidden text-[#636365] text-justify   text-xs mt-2">
        See your favorite creators whip up magic with Summit home and kitchen
        appliances - shop the exact product below
      </p>

      {/* Desktop View */}
      <div className="hidden md:flex md:w-full px-8 mx-8">
        <h2 className="text-xl sm:text-3xl font-semibold">Reels in Action</h2>
        <p className="text-[#636365] text-3xl">: Summit in Your Kitchen</p>
      </div>
      <p className="hidden md:block text-[#636365] px-8 mx-8 font-semibold">
        See your favorite creators whip up magic with Summit home and kitchen
        appliances - shop the exact product beflow
      </p>

      <div className="flex overflow-x-auto gap-4 px-8 mt-6 pb-4 snap-x snap-mandatory">
        {products.map((item, i) => (
          <div key={i} className="flex flex-col items-center flex-shrink-0 w-[250px] md:hidden snap-center">
            {/* VIDEO BOX */}
            <div className="relative w-full overflow-hidden rounded-2xl shadow-md group ">
              <Link to="#">
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  src={item.video}
                  poster={item.thumbnail}
                  loop
                  playsInline
                  className="w-full h-[400px] object-cover rounded-2xl"
                ></video>
              </Link>

              {/* Play/Pause Button */}
              <button
                onClick={() => togglePlay(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {playingIndex === i ? (
                  <FaPause className="text-white text-4xl drop-shadow-lg" />
                ) : (
                  <FaPlay className="text-white text-4xl drop-shadow-lg" />
                )}
              </button>
            </div>

            {/* TEXT + PRICE */}
           <div className="text-center mt-4">
              <div className="flex items-center justify-center mb-2 text-gray-500 text-[12px] font-normal space-x-2">
                <FaInstagram className="text-gray-500 text-lg" />
                <span>@cookwithmark</span>
              </div>

              <h3 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>

              <p className="text-md mb-2 text-gray-400">
                from{" "}
                <span className="font-semibold text-black">{item.price}</span>{" "}
                <span className="text-gray-400 line-through ml-1">
                  {item.oldPrice}
                </span>
              </p>
              {item.title !== "Inner Lid Pressure Cooker" && (
                <span className="text-[#636365]">Only 2 units left</span>
              )}
            </div>
            {/* BUTTONS */}
             <div className="flex gap-3 justify-center mt-2">
              <button
                onClick={() => handleAddToCart()}
                className="bg-[#B91508] text-white text-sm px-4 py-1 rounded-full hover:bg-red-700 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleBuyNow()}
                className="text-[#B91508] text-sm px-4 py-2 rounded-full hover:bg-[#B91508] hover:text-white transition"
              >
                Buy Now
              </button>
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
                  poster={item.thumbnail}
                  loop
                  playsInline
                  className="w-[280px] h-[450px] object-cover rounded-2xl"
                ></video>
              </Link>

              {/* Play/Pause Button */}
              <button
                onClick={() => togglePlay(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {playingIndex === i ? (
                  <FaPause className="text-white text-4xl drop-shadow-lg" />
                ) : (
                  <FaPlay className="text-white text-4xl drop-shadow-lg" />
                )}
              </button>
            </div>

            {/* TEXT + PRICE */}
            <div className="text-center mt-4">
              <div className="flex items-center justify-center mb-2 text-gray-500 text-lg font-normal space-x-2">
                <FaInstagram className="text-gray-500 text-lg" />
                <span>@cookwithmark</span>
              </div>

              <h3 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>

              <p className="text-md mb-2 text-gray-400">
                from{" "}
                <span className="font-semibold text-black">{item.price}</span>{" "}
                <span className="text-gray-400 line-through ml-1">
                  {item.oldPrice}
                </span>
              </p>
              {item.title !== "Inner Lid Pressure Cooker" && (
                <span className="text-[#636365]">Only 2 units left</span>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 justify-center mt-2">
              <button
                onClick={() => handleAddToCart()}
                className="bg-[#B91508] text-white text-sm px-4 py-1 rounded-full hover:bg-red-700 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleBuyNow()}
                className="text-[#B91508] text-sm px-4 py-2 rounded-full hover:bg-[#B91508] hover:text-white transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ThoughtfulPicks;
