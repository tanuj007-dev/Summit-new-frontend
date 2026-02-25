import React, { useState } from "react";
import ReviewTaken from "./FeedbackProduct/WriteFeedback";
import ShowReview from "./FeedbackProduct/ShowReview";

const FeedbackProduct = ({ product_id, isLoggedIn }) => {
  const [activeTab, setActiveTab] = useState("Description");
  console.log("product_id", product_id);

  const tabs = ["Description", "Additional info"];
  // console.log(product_id);
  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="flex justify-center text-xs md:text-lg text-gray-300">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative md:px-12 px-2 py-2 cursor-pointer"
          >
            <div className={`${activeTab === tab ? "text-red-700" : ""}`}>
              {tab}
            </div>
            {/* Red underline on active tab, full gray underline already exists */}
            <div
              className={
                activeTab === tab
                  ? "absolute bottom-[-1px] left-0 right-0 h-1 bg-red-700"
                  : "absolute bottom-[-1px] left-0 right-0 h-1 bg-gray-300"
              }
            />
          </div>
        ))}
      </div>

      {/* -------------------------conditional rendering---------------------------- */}

      <div className=" p-4 mt-4">
        {activeTab === "Description" && <p>This is the product description.</p>}
        {activeTab === "Additional info" && (
          <p>Additional information about the product.</p>
        )}
        {activeTab === "Review" && <ShowReview product_id={product_id} />}
        {activeTab === "Write feedback" && (
          <ReviewTaken id={product_id} isLoggedIn={isLoggedIn} />
        )}
      </div>

      {/* ------------------------------conditional rendering end ------------------------ */}
    </div>
  );
};

export default FeedbackProduct;
