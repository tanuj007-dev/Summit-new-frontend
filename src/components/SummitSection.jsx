import React, { useEffect, useState } from "react";

const SummitSection = () => {
         const [data, setData] = useState([]);
                const [index, setIndex] = useState(0); 
                  const visibleCount = 3;
              
              
              
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
                  // console.log(result);
                }
               
              
               useEffect(() => {
                  Trenddata();
                }, []);
      
  return (
    <div>
      <div className="px-4 md:px-16 py-10">
        <div className="relative">
          <div className="w-full flex flex-col ">
            <h2 className=" text-center text-2xl font-semibold">
            Summit Select
            </h2>
            <p className="text-[#636365] font-semibold  mt-1 text-center">Handpicked Hits from every category</p>
          </div>
  

          <div className="mt-8 ">
          
  
          <div className="w-full overflow-hidden px-1 py-2">
        <div
          className="flex transition-transform duration-1000 ease-in-out space-x-2 md:space-x-15"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {data.map((item, i) => (
            <div
              key={i}
              className=" p-4 bg-white rounded-md shadow-lg"
            >
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
  
      <div className="absolute pt-5  right-0 flex space-x-6 ">
      <button
          onClick={PrevHandler}
          disabled={index === 0}
          className=" text-sm  transform -translate-y-1/2 bg-[#E2E2E5] text-[#636365] px-3 py-1 rounded-full z-10"
        >
          ❮
        </button>
  
       
        <button
          onClick={NextHandler}
          disabled={index + visibleCount >= data.length}
          className=" text-sm  transform -translate-y-1/2 bg-[#E2E2E5] text-[#636365] px-3 py-1 rounded-full z-10"
        >
          ❯
        </button>
      
      </div>
          </div>
          {/* ----------------------end--------------------          */}
        </div>
      </div>
  
    </div>
  )
}

export default SummitSection
