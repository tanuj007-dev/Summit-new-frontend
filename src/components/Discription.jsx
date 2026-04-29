import React from "react";
import { Link } from "react-router-dom";
const Discription = () => {
  return (
    <div className="font-gotham bg-[#F5F5F7] w-full p-4 py-8 md:py-16 md:px-16 items-center flex flex-col md:flex-row  relative overflow-hidden">
      {/* Light red gradient – top left */}
      <div
        className="absolute top-0 left-0 w-[60%] sm:w-[50%] h-[50%] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 70% at top left, rgba(148, 16, 7, 0.12) 0%, rgba(248, 113, 113, 0.06) 50%, transparent 70%)",
        }}
        aria-hidden
      />
      {/* Light red gradient – bottom right */}
      <div
        className="absolute bottom-0 right-0 w-[60%] sm:w-[50%] h-[50%] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 70% at bottom right, rgba(148, 16, 7, 0.12) 0%, rgba(248, 113, 113, 0.06) 50%, transparent 70%)",
        }}
        aria-hidden
      />
      <div className="w-full md:w-[35%] flex justify-start items-center mt-6 md:mt-0 relative z-10">
        <img
          src="/asset/images/WhatsApp Image 2026-03-05 at 6.07.19 PM.jpeg"
          alt="Personalized Engraving"
          className="w-full h-auto max-w-[400px] rounded-lg shadow-md"
        />
      </div>
      <div className="flex flex-col space-y-4 sm:space-y-6 mt-8 md:w-[50%] relative z-10 px-2 sm:px-0">
        <h2 className="text-[24px] md:text-3xl leading-[1.2] text-center sm:text-left font-bold text-[#1d2939]">
          Personalize It – Get Your Name Engraved,
          <br className="md:block hidden" /> Just Like We’ve Always Done
        </h2>
        <h3 className="font-medium text-[15px] sm:text-[16px] text-center sm:text-left leading-relaxed text-gray-700 md:text-[1.3rem]">
          Make it truly yours. Add your name to selected cookware—just like in
          homes across India. Once engraved, it's non-returnable and prepaid,
          but 100% yours forever.
        </h3>
        <p className="text-[#636365] text-center sm:text-left leading-relaxed text-[13px] md:text-lg opacity-80">
          *Customized products are non-returnable. Full payment required in advance.
        </p>
        <div className="flex justify-center sm:justify-start">
          <Link
            to="/contact"
            className="bg-[#941007] text-[15px] mt-2 md:text-lg px-8 py-3 w-max text-white rounded-full transition-all duration-300 hover:bg-[#941007] hover:shadow-lg active:scale-95"
          >
            Get yours Now
          </Link>
        </div>
      </div>


    </div>
  );
};

export default Discription;
