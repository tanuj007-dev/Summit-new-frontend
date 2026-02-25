import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const CookerFinder = () => {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const visibleCount = 3;

  // ✅ Ref for the horizontal scrollable filter container
  const filterScrollRef = useRef(null);

  // ✅ Scrolls the filter section to the right
  const handlerNext = () => {
    if (filterScrollRef.current) {
      filterScrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
    }
  };

  const NextHandler = () => {
    if (index + visibleCount < data.length) {
      setIndex(index + 1);
    }
  };

  const PrevHandler = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  async function Trenddata() {
    const response = await fetch("https://fakestoreapi.com/products");
    const result = await response.json();
    setData(result);
  }

  useEffect(() => {
    Trenddata();
  }, []);

  return (
    <div>
      <div className="px-4 md:px-16 md:py-16">
        <div className="relative">
          <div className="w-full flex flex-col items-center ">
            <h2 className="md:text-[1.6rem] font-semibold">
              Smart Cooker Finder
            </h2>
            <p className="text-[#636365] font-semibold text-sm mb-1 sm:mb-10">
              Built for the Way You Cook
            </p>
          </div>

          {/* Top Filter Row */}
          <div className="mt-8 justify-center md:mt-auto text-[0.725rem] flex items-center">
            <div className="flex overflow-x-auto" ref={filterScrollRef}>
              <div className="flex items-center space-x-2 text-[#545455] font-medium  md:text-xs min-w-max">
                {/* your filter items */}
                <div className="bg-[#E9E9EB] flex items-center rounded-full px-3 py-1.5 whitespace-nowrap">
                  Sort by: Price <FaChevronDown className="mt-1 ml-1" />
                </div>
                <div className="bg-[#E9E9EB] flex items-center rounded-full px-3 py-1.5 whitespace-nowrap">
                  Type: Inner Lid <FaChevronDown className="mt-1 ml-1" />
                </div>
                <div className="bg-[#E9E9EB] flex items-center rounded-full px-3 py-1.5 whitespace-nowrap">
                  Material: 2 Selected <FaChevronDown className="mt-1 ml-1" />
                </div>
                <div className="bg-[#E9E9EB] flex items-center rounded-full px-3 py-1.5 whitespace-nowrap">
                  Size: 2 Selected <FaChevronDown className="mt-1 ml-1" />
                </div>
                <div className="bg-[#E9E9EB] flex items-center rounded-full px-3 py-1.5 whitespace-nowrap">
                  Shape: All <FaChevronDown className="mt-1 ml-1" />
                </div>
                <div className="bg-[#E9E9EB] rounded-full px-3 py-1 whitespace-nowrap">
                  Bottom: All
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center ml-2 space-x-1 text-[#545455] font-medium md:text-xs min-w-max">
              <div
                className="bg-[#E9E9EB] rounded-full px-2 py-1 text-[0.625rem] whitespace-nowrap cursor-pointer"
                onClick={handlerNext}
              >
                ❯
              </div>
              <div className="bg-[#B91508] rounded-full text-center px-3 py-1.5 md:text-xs text-white whitespace-nowrap">
                Apply
              </div>
              <div className="text-[#B91508] rounded-full text-xs px-3 py-1 whitespace-nowrap">
                Reset
              </div>
            </div>
          </div>

          {/* ... rest of your product carousel component ... */}

          <div className="mt-10 ">
            <div className="w-full overflow-hidden px-1 py-2">
              <div
                className="flex transition-transform duration-1000 ease-in-out space-x-1 md:space-x-15"
                style={{
                  transform: `translateX(-${index * 100}%)`, // Moves the products horizontally
                }}
              >
                {data.map((item, i) => (
                  // console.log(item)
                  <div key={i} className="p-4 bg-white rounded-md shadow-md">
                    <div className="flex flex-col items-center">
                      <img
                        src={item.image}
                        alt=""
                        className="w-36 h-36 rounded-lg mx-auto"
                      />
                      <h2 className="text-md font-semibold truncate w-40 mt-2">
                        {item.title}
                      </h2>
                      <p className="text-sm font-semibold mt-2">
                        <span className="text-xs font-normal text-[#AAAAAA]">
                          From{" "}
                        </span>
                        Rs. {Math.floor(item.price)}
                      </p>
                      <div className="flex justify-between w-full mt-3 px-2">
                        <button className="text-xs rounded-full px-2 py-1 text-white bg-[#B91508]">
                          Add to cart
                        </button>
                        <button className="text-xs text-[#B91508] font-semibold">
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prev Button */}
            </div>

            <div className="absolute mt-4 md:pt-5 right-0 flex space-x-6 ">
              <button
                onClick={PrevHandler}
                disabled={index === 0}
                className="text-sm transform -translate-y-1/2 bg-[#E2E2E5] text-[#636365] px-3 py-1 rounded-full z-10"
              >
                ❮
              </button>

              {/* Next Button */}
              <button
                onClick={NextHandler}
                disabled={index + visibleCount >= data.length}
                className="text-sm transform -translate-y-1/2 bg-[#E2E2E5] text-[#636365] px-3 py-1 rounded-full z-10"
              >
                ❯
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookerFinder;
