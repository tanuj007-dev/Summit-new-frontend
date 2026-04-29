import React from "react";
import "./marquee.css";

function Marquee() {
const messages = [
  "Free shipping! Just click, and we’ll bring it to you!",
  "New here? Use code WELCOME for 5% off—your first gift from us!",
  "Free shipping! Just click, and we’ll bring it to you!",
  "New here? Use code WELCOME for 5% off—your first gift from us!",
  "Free shipping! Just click, and we’ll bring it to you!",
  "New here? Use code WELCOME for 5% off—your first gift from us!",
  "Free shipping! Just click, and we’ll bring it to you!",
  "New here? Use code WELCOME for 5% off—your first gift from us!",
    "Free shipping! Just click, and we’ll bring it to you!",
    "New here? Use code WELCOME for 5% off—your first gift from us!",
   
  
];


  return (
    <div className="bg-[#941007] py-2.5 z-10 overflow-hidden whitespace-nowrap">
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
