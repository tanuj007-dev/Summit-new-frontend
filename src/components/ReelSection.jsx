// import React, { useEffect, useState } from "react";

// const ReelSection = ()=>{

//      const [data, setData] = useState([]);
//           const [index, setIndex] = useState(0); 
//             const visibleCount = 3;
        
        
        
//             const NextHandler = () => {
//               if (index + visibleCount < data.length) {
//                 setIndex(index + 1);
//               }
//             };
          
//             const PrevHandler = () => {
//               if (index > 0) {
//                 setIndex(index - 1);
//               }
//             };
        
//           async function Trenddata() {
//             const response = await fetch("https://fakestoreapi.com/products");
//             const result = await response.json();
//             setData(result);
//             // console.log(result);
//           }
         
        
//          useEffect(() => {
//             Trenddata();
//           }, []);

//     return(
//         <div>
//         <div className="px-4 md:px-16 py-10">
//         <div className="relative">
//           <div className="w-full flex flex-col md:text-start text-center">
//             <h2 >
//            <span className="text-xl md:text-2xl font-semibold">Reels in Action</span> <span className="text-xl md:text-2xl font-semibold text-[#636365]">: Summit in Your Kitchen</span>
//             </h2>
//             <p className="text-[#636365] font-bold text-xs mt-1"></p>
//           </div>
  

//           <div className="mt-8 ">
          
  
//           <div className="w-full overflow-hidden px-1 py-2">
//         <div
//           className="flex transition-transform duration-1000 ease-in-out space-x-2 md:space-x-15"
//           style={{
//             transform: `translateX(-${index * 100}%)`,
//           }}
//         >
//           <div className=" p-4 bg-white rounded-md shadow-lg">
//               <div className="flex flex-col items-center">
//                 <iframe 
//                   width="320" 
//                   height="560" 
//                   src="https://www.youtube.com/embed/DeB2Ygtdc9A" 
//                   title="YouTube video player" 
//                   frameborder="0" 
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
//                   allowfullscreen>
//                 </iframe>
//               </div>
//             </div>
//             <div className=" p-4 bg-white rounded-md shadow-lg">
//               <div className="flex flex-col items-center">
//                 <iframe 
//                   width="320" 
//                   height="560" 
//                   src="https://www.youtube.com/embed/DeB2Ygtdc9A" 
//                   title="YouTube video player" 
//                   frameborder="0" 
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
//                   allowfullscreen>
//                 </iframe>
//               </div>
//             </div>
//             <div className=" p-4 bg-white rounded-md shadow-lg">
//               <div className="flex flex-col items-center">
//                 <iframe 
//                   width="320" 
//                   height="560" 
//                   src="https://www.youtube.com/embed/DeB2Ygtdc9A" 
//                   title="YouTube video player" 
//                   frameborder="0" 
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
//                   allowfullscreen>
//                 </iframe>
//               </div>
//             </div>
//             <div className=" p-4 bg-white rounded-md shadow-lg">
//               <div className="flex flex-col items-center">
//                 <iframe 
//                   width="320" 
//                   height="560" 
//                   src="https://www.youtube.com/embed/DeB2Ygtdc9A" 
//                   title="YouTube video player" 
//                   frameborder="0" 
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
//                   allowfullscreen>
//                 </iframe>
//               </div>
//             </div>
//         </div>
  
//         {/* Prev Button */}
        
//       </div>
  
//       <div className="absolute pt-5 md:top-0 right-0 flex space-x-6 ">
//       <button
//           onClick={PrevHandler}
//           disabled={index === 0}
//           className=" text-sm  transform -translate-y-1/2 bg-[#E2E2E5] text-[#636365] px-3 py-1 rounded-full z-10"
//         >
//           ❮
//         </button>
  
       
//         <button
//           onClick={NextHandler}
//           disabled={index + visibleCount >= data.length}
//           className=" text-sm  transform -translate-y-1/2 bg-[#E2E2E5] text-[#636365] px-3 py-1 rounded-full z-10"
//         >
//           ❯
//         </button>
      
//       </div>
//           </div>
//           {/* ----------------------end--------------------          */}
//         </div>
//       </div>
  
//       </div>
//     )
// }

// export default ReelSection ; 
