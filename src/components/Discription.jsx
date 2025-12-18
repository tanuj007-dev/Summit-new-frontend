import React from "react";
import { Link } from "react-router-dom";
const Discription = () => {
  return (
    <div className="bg-[#F5F5F7]  w-full p-4 py-8 md:py-5 md:px-16 items-center flex flex-col md:flex-row md:space-x-20">
      {/* Text first */}
         {/* Image second */}
      <div className="w-full md:w-[35%] flex justify-start items-center mt-6 md:mt-0">
        <img 
          src="/asset/images/Gallery/Pressure Cooker.png" 
          alt="Cookware"
          className="w-full h-[50%] max-w-[380px] rounded-lg shadow-md"
        />
      </div>
      <div className="flex flex-col space-y-2 sm:space-y-6 mt-8  md:w-[50%]">
        <h2 className="text-[21px] md:text-3xl leading-snug text-center sm:text-start font-bold">
          Personalize It – Get Your Name Engraved,
          <br className="md:block hidden"/> Just Like We’ve Always Done
        </h2>
        <h3 className="font-medium text-[14px] text-justify leading-snug md:text-[1.3rem]">
          Make it truly yours. Add your name to selected cookware—just like in
          homes across India. Once engraved, it's non-returnable and prepaid,
          but 100% yours forever
        </h3>
        <p className="text-[#636365] text-justify leading-snug text-[14px] md:text-lg">
          Customized products are non-returnable. Full payment required in
          advance.
        </p>
        <Link
  to="/contact"
  className="bg-[#B91508] text-[15px] mt-4  md:text-lg px-3 sm:px-6 py-1 sm:py-2.5 w-max justify-center items-center text-white rounded-full mx-auto md:mx-0"
>
  Get yours Now
</Link>
      </div>

   
    </div>
  );
};

export default Discription;
