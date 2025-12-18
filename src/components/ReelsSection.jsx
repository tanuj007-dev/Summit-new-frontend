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
                  poster={item.thumbnail}
                  loop
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
                  <FaPause className="text-white text-4xl drop-shadow-lg" />
                ) : (
                  <FaPlay className="text-white text-4xl drop-shadow-lg" />
                )}
              </button>

              {/* Overlay Content - Title, Price, Add to Cart */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-5">
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
                  onClick={() => handleAddToCart(item.id)}
                  className="w-full bg-[#B91508] text-white text-sm px-3 py-2 rounded-full hover:bg-red-700 transition flex items-center justify-center"
                >
                  Add to Cart
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
                  poster={item.thumbnail}
                  loop
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
                  <FaPause className="text-white text-4xl drop-shadow-lg" />
                ) : (
                  <FaPlay className="text-white text-4xl drop-shadow-lg" />
                )}
              </button>

              {/* Overlay Content - Title, Price, Add to Cart */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-5">
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
                  onClick={() => handleAddToCart(item.id)}
                  className="w-full bg-[#B91508] text-white text-sm px-4 py-2 rounded-full hover:bg-red-700 transition flex items-center justify-center"
                >
                  Add to Cart
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
