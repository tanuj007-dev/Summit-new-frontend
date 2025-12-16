import React from "react";
import { Link } from "react-router-dom";
import TiltedCard from "./TiltedCard";
const Discription = () => {
  return (
    <div className="bg-[#F5F5F7] mt-18 w-full p-4 md:py-5 md:px-16 items-center flex flex-col md:flex-row md:space-x-20">
      {/* Text first */}
         {/* Image second */}
      <div className="w-full md:w-[20%] flex justify-center items-center mt-6 md:mt-0">
     <TiltedCard
 
      
      />
      </div>
      <div className="flex flex-col space-y-2 sm:space-y-6 mt-8  md:w-[50%]">
        <h2 className="text-[18px] md:text-3xl text-start font-bold">
          Personalize It – Get Your Name Engraved,
          <br className="md:block hidden"/> Just Like We’ve Always Done
        </h2>
        <h3 className="font-medium text-[12px] md:text-[1.3rem]">
          Make it truly yours. Add your name to selected cookware—just like in
          homes across India. Once engraved, it's non-returnable and prepaid,
          but 100% yours forever
        </h3>
        <p className="text-[#636365] text-[10px] md:text-lg">
          Customized products are non-returnable. Full payment required in
          advance.
        </p>
        <Link
  to="/contact"
  className="bg-[#B91508] text-[12px] md:text-lg px-3 sm:px-6 py-1 sm:py-2.5 w-max self-start text-white rounded-full"
>
  Get yours Now
</Link>
      </div>

   
    </div>
  );
};

export default Discription;
