import React from "react";
import "./marquee.css";

function Marquee() {
const messages = [
  "1st Time Buyers Get Flat 5% Off on Their First Purchase – Cook Smart with Summit",
  "Prepaid Orders Get Additional 5% Off – Safe Checkout & Faster Delivery",
  "Free Cash On Delivery (COD) Available Across India – No Hidden Charges",
  "Made with High-Quality Materials for Long-Lasting Performance & Safety",
  
];


  return (
    <div className="bg-[#B91508] py-2.5 z-10 overflow-hidden whitespace-nowrap">
      <div className="marquee">
        <div className="marquee-content">
          {/* ORIGINAL CONTENT */}
          {messages.map((msg, i) => (
            <p
              key={i}
              className="text-white text-xs sm:text-sm font-semibold mx-8"
            >
              {msg}
            </p>
          ))}

          {/* DUPLICATE CONTENT – creates perfect infinite loop */}
          {messages.map((msg, i) => (
            <p
              key={`clone-${i}`}
              className="text-white text-xs sm:text-sm font-semibold mx-8"
            >
              {msg}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Marquee;
