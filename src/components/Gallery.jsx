import React from "react";
import { Link } from "react-router-dom";

const Gallery = () => {
  return (
    <div className="w-full md:mt-1 py-10 px-4 md:py-1 md:px-16 md:pb-1 ">
      <div className="flex flex-col items-center ">
        {" "}
        <h2 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-semibold">
          Curated Kitchen Essentials
        </h2>
        <p className="text-[#636365] font-semibold mt-1">Only the Best</p>
      </div>
      {/* ------------------gallery------------------ */}

      <div className="flex md:px-4  mb-5 w-[100%] space-x-3 mt-5 A md:mt-10 overflow-hidden">
        <div className="h-[247px] md:w-[35%] relative ">
          <Link to='/kitchena-appliances/Cookware'>
                    <img
            className="rounded-lg h-full object-cover md:w-[441px] "
            src="/asset/images/Gallery/Cookware.png"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg z-10"></div>
          <p className="absolute bottom-3 left-3 text-lg text-white font-bold z-20">
            Cookware
          </p>
          </Link>
        </div>
        <div className="h-[247px] md:w-[65%] relative">
          <Link to='/kitchena-appliances/Gas Stove'>
            <img
              className="rounded-lg w-full h-full object-cover "
              src="/asset/images/Gallery/Gas Stove.png"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg z-10"></div>
            <p className="absolute bottom-3 left-3 text-lg text-white font-bold z-20">
              Gas Stove
            </p>
          </Link>
        </div>
      </div>
      <div className="w-full md:px-4 mt-10 ">
        <div className="flex   mb-5   space-x-3 mt-10 overflow-hidden">
     
          <div className="h-[247px] md:w-[33%] relative">
          <Link to='/kitchena-appliances/Electric Rice'>
            <img
              className="rounded-lg h-full object-cover md:w-[441px] "
              src="/asset/images/Gallery/Electric Rice Cooker.png"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg z-10"></div>
            <p className="absolute bottom-3 left-3 text-lg text-white font-bold z-20">
              Electric Rice
            </p>
          </Link>
          </div>
          <div className="h-[247px] md:w-[33%] relative">
             <Link to='/kitchena-appliances/Steam Cookware'>
             <img
              className="rounded-lg w-full h-full object-cover "
              src="/asset/images/Gallery/Steam Cookware.png"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg z-10"></div>
            <p className="absolute bottom-3 left-3 text-lg text-white font-bold z-20">
              Steam Cookware
            </p>
             </Link>
          </div>
          <div className="h-[247px] relative hidden md:block md:w-[33%]">
            <Link to='/kitchena-appliances/Gas Tandoor'>
             <img
              className="rounded-lg w-full h-full object-center "
              src="/asset/images/Gallery/Gas Tandoor.png"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg z-10"></div>
            <p className="absolute bottom-3 left-3 text-lg text-white font-bold z-20">
              Gas Tandoor
            </p>
            </Link>
          </div>
          <br />
        </div>

        <div className="w-full h-44 overflow-hidden relative md:hidden rounded-lg">
          <Link to='/kitchena-appliances/Pressure Cooker'>
            <img
              src="/asset/images/Gallery/Pressure Cooker.png"
              alt=""
              className="absolute top-[-100px] left-0 w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg z-10"></div>
            <p className="absolute bottom-3 left-3 text-lg text-white font-bold z-20">
              Pressure Cooker
            </p>
          </Link>
        </div>
        <div className=" hidden md:flex space-x-3">
          <div className="w-full h-62 overflow-hidden relative  rounded-lg">
            <Link to='/kitchena-appliances/Pressure Cooker'>
            <img
              src="/asset/images/Gallery/Pressure Cooker.png"
              alt=""
              className="rounded-lg h-full object-cover md:w-[100%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg z-10"></div>
            <p className="absolute bottom-3 left-3 text-lg text-white font-bold z-20">
              Pressure Cooker
            </p>
            </Link>
          </div>
          <div className="w-1/2 h-62 overflow-hidden relative  rounded-lg">
          <Link to='/kitchena-appliances/Mixer Grinder'>
              <img
              src="/asset/images/Gallery/Mixer Grinder.png"
              alt=""
              className="absolute top-[-100px] left-0 w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg z-10"></div>
            <p className="absolute bottom-3 left-3 text-lg text-white font-bold z-20">
              Mixer Grinder
            </p>
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
