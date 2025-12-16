import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
// import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { TbArrowsCross } from "react-icons/tb";
// import axios from '../../../axiosConfig';
// import { toast } from "react-toastify";
import { FaCartPlus } from "react-icons/fa";
import axios from "axios";

// axios.defaults.withCredentials = true; // Ensure credentials are sent




const ProductCard = () => {

    const [products, setProducts] = useState([]);
    const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

    useEffect(() => {
        axios.get(`${baseURL}products`)
            .then((res) => {
                if (Array.isArray(res.data.data)) {
                    // const productIds = res.data.map((item) => parseInt(item.product_id));
                    setProducts(res.data.data);
                    console.log(res.data.data);
                } else {
                    console.error("Unexpected Product Data format", res.data);
                }
            })
            .catch((err) => {
                console.error("Failed to load wishlist:", err);
            });
    }, []);

    return (
        <div className="px-4 py-5 md:px-16 md:py-16">
            <div className="relative">
                <div className="md:w-full flex flex-col items-center ">
                    <h2 className="md:text-[1.6rem] text-lg font-semibold">
                        All Products
                    </h2>
                    {/* <p className="text-[#636365] md:text-lg font-semibold mt-1">
                        Our Best Sellers
                    </p> */}
                </div>

                {/* <div className="w-full  mx-auto mt-8 text-[#545455] font-medium flex flex-wrap justify-center gap-4 md:gap-6">
          {categories.map((category) => {
            const isDisabled = !categoriesWithProducts.includes(category);
            const isSelected =
              normalize(selectedCategory) === normalize(category);
            return (
              <div
                key={category}
                className={`rounded-full px-2 md:px-4 md:py-1.5 font-sans py-0.5 text-[0.625rem] md:text-sm  whitespace-nowrap text-center
                  ${isSelected
                    ? "bg-[#B91508] text-white"
                    : isDisabled
                      ? "bg-[#E9E9EB] text-[#545455] cursor-not-allowed"
                      : "bg-[#E9E9EB] text-[#545455] cursor-pointer"
                  }`}
                onClick={() => {
                  if (!isDisabled) handlefilter(category);
                }}
              >
                {category
                  .split(" ")
                  .map((w) => w[0].toUpperCase() + w.slice(1))
                  .join(" ")}
              </div>
            );
          })}
        </div> */}

                <div className="mt-5">
                    <div className="w-full">
                        <div className="flex flex-wrap transition-transform duration-1000 ease-in-out" >

                            {products.map((res, i) => (
                                <div className="w-1/4 p-2">
                                    <div style={{ boxShadow: "box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;" }}
                                        className="relative bg-white rounded-md shadow-md shadow-red-50 border-1 border-red-200 overflow-hidden"
                                        key={i}
                                    >
                                        <TbArrowsCross
                                            // icon={isInWishlist ? solidHeart : regularHeart}
                                            icon={solidHeart}
                                            style={{
                                                // color: isInWishlist ? "#E03B2D" : "gray",
                                                color: "#E03B2D",
                                                cursor: "pointer",
                                                fontSize: "20px",
                                            }}

                                            className="absolute top-2 right-10"
                                        />

                                        <FontAwesomeIcon
                                            // icon={isInWishlist ? solidHeart : regularHeart}
                                            icon={solidHeart}
                                            style={{
                                                color: "#E03B2D",
                                                cursor: "pointer",
                                                fontSize: "20px",
                                            }}
                                            // onClick={() => handlewishlist(item.id)}
                                            className="absolute top-2 right-2"
                                        />
                                        <div
                                            style={{
                                                background: "#E03B2D",
                                                cursor: "pointer",

                                                color: "white",
                                            }}
                                            // onClick={() => handlewishlist(item.id)}
                                            className="absolute top-2 left-0 px-3 rounded-r"
                                        >20% off</div>

                                        <div className="">
                                            <Link className="flex"
                                                // to={`/879/DetailProduct/${item.id}`}
                                                to={`/product-details/${res.slug}`}
                                            >
                                                <img
                                                    // src={
                                                    //     item.images?.[0]?.url
                                                    //         ? `https://api.summithomeappliance.com/php_admin_panel/${item.images[0].url}`
                                                    //         : '/asset/images/dummy-image-square.jpg'
                                                    // }
                                                    src="/asset/images/dummy-image-square.jpg"
                                                    // alt={item.images?.[0]?.url ? item.name : 'No image available'}
                                                    className="w-full rounded-lg mx-auto" style={{ maxHeight: "250px" }}
                                                />
                                            </Link>

                                            <div className="bg-red-50 flex flex-col items-center w-full p-2">


                                                <div className="">
                                                    <img className="w-[50px] h-[50px] inline shadow border-1 border-red-500 rounded-full p-1 m-1" src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" alt="variant" />
                                                    <img className="w-[50px] h-[50px] inline shadow rounded-full m-1" src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Aluminium/variant_114/1753788865_6888b1c1ef007.jpg" alt="variant" />
                                                    <img className="w-[50px] h-[50px] inline shadow rounded-full m-1" src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Stainless_Steel_/variant_104/1753786981_6888aa65ad1f1.jpg" alt="variant" />
                                                    <img className="w-[50px] h-[50px] inline shadow rounded-full m-1" src="https://api.summithomeappliance.com/php_admin_panel/variant_images/Pressure_Cooker/Outer_Lid/Aluminium/variant_114/1753788865_6888b1c1ef007.jpg" alt="variant" />
                                                </div>

                                                <h5 className="text-sm font-semibold truncate mt-2">
                                                    {res.name}
                                                </h5>
                                                <p className="text-sm font-semibold mt-2">
                                                    <span className="font-normal text-[#3e3e3e]">
                                                  
                                                    </span>
                                                    Rs. <span className="text-[#B91508] font-bold">
                                                        {/* {Math.floor(item.price)} */}
                                                        {Math.floor(108)} - 1008
                                                    </span>
                                                </p>
                                                {/* <div className="flex justify-between w-full mt-3 px-2">
                                                    <button className="w-30 rounded-full px-3 py-1 text-white bg-[#B91508] cursor-pointer  font-semibold mr-1"
                                                    // onClick={() => buyNowHandle(item)}
                                                    >
                                                        Buy Now
                                                    </button>
                                                    <button
                                                        className="w-30 rounded-full  px-3 py-1 color-white border-1 border-[#B91508] cursor-pointer ml-1 text-center"
                                                    // onClick={() => handleAddToCart(item)}
                                                    >
                                                        <div className="flex items-center justify-center">
                                                            <span className="inline text-[#B91508]">Cart</span> <FaCartPlus className="mx-1 text-[#B91508]" />
                                                        </div>

                                                    </button>
                                                </div> */}
                                                    <button className="w-full rounded-full px-3 py-1 text-white bg-[#B91508] cursor-pointer  font-semibold mr-1"
                                                    // onClick={() => buyNowHandle(item)}
                                                    >
                                                        View Details
                                                    </button>
                                                  
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* );
                                })
                            ) : (
                            <p className="text-center w-full">
                                No products found in this category.
                            </p>
                            )} */}
                        </div>
                    </div>


                </div>




                <div className="mt-5">
                    <div className="w-full">
                        <div className="flex flex-wrap transition-transform duration-1000 ease-in-out" >
                            {/* {filteredProducts.length > 0 ? (
                                filteredProducts.map((item, i) => {
                                    const isInWishlist = wishlist.includes(parseInt(item.id));

                                    return ( */}

                            <div className="w-1/4 p-2">
                                <div style={{ boxShadow: "box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;" }}
                                    className="relative bg-white rounded-md shadow-md shadow-red-50 border-1 border-red-200 overflow-hidden"
                                // key={i}
                                >
                                    <TbArrowsCross
                                        // icon={isInWishlist ? solidHeart : regularHeart}
                                        icon={solidHeart}
                                        style={{
                                            // color: isInWishlist ? "#E03B2D" : "gray",
                                            color: "#E03B2D",
                                            cursor: "pointer",
                                            fontSize: "20px",
                                        }}

                                        className="absolute top-2 right-10"
                                    />

                                    <FontAwesomeIcon
                                        // icon={isInWishlist ? solidHeart : regularHeart}
                                        icon={solidHeart}
                                        style={{
                                            color: "#E03B2D",
                                            cursor: "pointer",
                                            fontSize: "20px",
                                        }}
                                        // onClick={() => handlewishlist(item.id)}
                                        className="absolute top-2 right-2"
                                    />
                                    <div
                                        style={{
                                            background: "#E03B2D",
                                            cursor: "pointer",

                                            color: "white",
                                        }}
                                        // onClick={() => handlewishlist(item.id)}
                                        className="absolute top-2 left-0 px-3 rounded-r"
                                    >20% off</div>

                                    <div className="">
                                        <Link className="flex"
                                            // to={`/879/DetailProduct/${item.id}`}
                                            to={`/`}
                                        >
                                            <img
                                                // src={
                                                //     item.images?.[0]?.url
                                                //         ? `https://api.summithomeappliance.com/php_admin_panel/${item.images[0].url}`
                                                //         : '/asset/images/dummy-image-square.jpg'
                                                // }
                                                src="/asset/images/dummy-image-square.jpg"
                                                // alt={item.images?.[0]?.url ? item.name : 'No image available'}
                                                className="w-full rounded-lg mx-auto" style={{ maxHeight: "250px" }}
                                            />
                                        </Link>

                                        <div className="bg-red-50 flex flex-col items-center w-full p-2">


                                            <div className="">

                                            </div>

                                            <h5 className="text-sm font-semibold truncate mt-2">
                                                {/* {item.name} */}
                                                Product 1 ABC</h5>
                                            <p className="text-sm font-semibold mt-2">
                                                <span className="font-normal text-[#3e3e3e]">
                                                    M.R.P: 2000 {" "}
                                                </span>
                                                Rs. <span className="text-[#B91508] font-bold">
                                                    {/* {Math.floor(item.price)} */}
                                                    {Math.floor(108)}
                                                </span>
                                            </p>
                                            <button className="w-full mt-2 rounded-full px-3 py-1 text-white bg-[#B91508] cursor-pointer  font-semibold mr-1"
                                            // onClick={() => buyNowHandle(item)}
                                            >
                                                View Details
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* );
                                })
                            ) : (
                            <p className="text-center w-full">
                                No products found in this category.
                            </p>
                            )} */}
                        </div>
                    </div>


                </div>

                <div className="mt-5">
                    <div className="w-full">
                        <div className="flex flex-wrap transition-transform duration-1000 ease-in-out" >

                            {products.map((product, i) =>
                                product.variants?.map((variant, j) => (
                                    <div key={`${i}-${j}`} className="w-1/4 p-2">
                                        <div
                                            style={{
                                                boxShadow:
                                                    "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                                            }}
                                            className="relative bg-white rounded-md shadow-md shadow-red-50 border-1 border-red-200 overflow-hidden"
                                        >
                                            {/* Wishlist */}
                                            <FontAwesomeIcon
                                                icon={solidHeart}
                                                style={{
                                                    color: "#E03B2D",
                                                    cursor: "pointer",
                                                    fontSize: "20px",
                                                }}
                                                className="absolute top-2 right-2"
                                            />

                                            {/* Discount Tag */}
                                            <div
                                                className="absolute top-2 left-0 px-3 rounded-r"
                                                style={{ background: "#E03B2D", color: "white" }}
                                            >
                                                20% off
                                            </div>

                                            {/* Variant Image */}
                                            <Link className="flex" to={`/product/${product.slug}/${variant.id}`}>
                                                <img
                                                    src="/asset/images/dummy-image-square.jpg"
                                                    alt={product.name}
                                                    className="w-full rounded-lg mx-auto"
                                                    style={{ maxHeight: "250px" }}
                                                />
                                            </Link>

                                            {/* Product Info */}
                                            <div className="bg-red-50 flex flex-col items-center w-full p-2">
                                                <h5 className="text-sm font-semibold truncate mt-2">
                                                    {product.name}
                                                </h5>

                                                {/* Variant Attributes */}
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {variant.attributes.map((attr) => (
                                                        <span key={attr.id} className="mr-1">
                                                            <strong>{attr.attribute.name}:</strong> <span className="bg-[#B91508] px-3 text-[#fff]">{attr.value}</span><br />
                                                        </span>
                                                    ))}
                                                </p>

                                                {/* Price */}
                                                <p className="text-sm font-semibold mt-2">
                                                    Rs.{" "}
                                                    <span className="text-[#B91508] font-bold">
                                                        {Math.floor(variant.price)}
                                                    </span>
                                                </p>

                                                <div className="flex justify-between w-full mt-3 px-2">
                                                    <button className="w-30 rounded-full px-3 py-1 text-white bg-[#B91508] cursor-pointer  font-semibold mr-1"
                                                    // onClick={() => buyNowHandle(item)}
                                                    >
                                                        Buy Now
                                                    </button>
                                                    <button
                                                        className="w-30 rounded-full  px-3 py-1 color-white border-1 border-[#B91508] cursor-pointer ml-1 text-center"
                                                    // onClick={() => handleAddToCart(item)}
                                                    >
                                                        <div className="flex items-center justify-center">
                                                            <span className="inline text-[#B91508]">Cart</span> <FaCartPlus className="mx-1 text-[#B91508]" />
                                                        </div>

                                                    </button>
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}


                        </div>
                    </div>


                </div>

                <div className="mt-5">
                    <div className="w-full">
                        <div className="flex flex-wrap transition-transform duration-1000 ease-in-out" >

                            {products.map((product, i) =>
                                product.variants?.map((variant, j) => (
                                    <div key={`${i}-${j}`} className="w-1/4 p-2">
                                        <div
                                            style={{
                                                boxShadow:
                                                    "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                                            }}
                                            className="relative bg-white rounded-md shadow-md shadow-red-50 border-1 border-red-200 overflow-hidden"
                                        >
                                            {/* Wishlist */}
                                            <FontAwesomeIcon
                                                icon={solidHeart}
                                                style={{
                                                    color: "#E03B2D",
                                                    cursor: "pointer",
                                                    fontSize: "20px",
                                                }}
                                                className="absolute top-2 right-2"
                                            />

                                            {/* Discount Tag */}
                                            <div
                                                className="absolute top-2 left-0 px-3 rounded-r"
                                                style={{ background: "#E03B2D", color: "white" }}
                                            >
                                                20% off
                                            </div>

                                            {/* Variant Image */}
                                            <Link className="flex" to={`/product/${product.slug}/${variant.id}`}>
                                                <img
                                                    src="/asset/images/dummy-image-square.jpg"
                                                    alt={product.name}
                                                    className="w-full rounded-lg mx-auto"
                                                    style={{ maxHeight: "250px" }}
                                                />
                                            </Link>

                                            {/* Product Info */}
                                            <div className="bg-red-50 flex flex-col items-center w-full p-2">
                                                <h5 className="text-sm font-semibold text-center mt-2">
                                                    {product.name} {variant.attributes.map((attr) => (
                                                        <span key={attr.id} className="mr-1">
                                                       {attr.value}
                                                        </span>
                                                    ))}
                                                </h5>
 

                                                {/* Price */}
                                                <p className="text-sm font-semibold mt-2">
                                                    Rs.{" "}
                                                    <span className="text-[#B91508] font-bold">
                                                        {Math.floor(variant.price)}
                                                    </span>
                                                </p>

                                                <div className="flex justify-between w-full mt-3 px-2">
                                                    <button className="w-30 rounded-full px-3 py-1 text-white bg-[#B91508] cursor-pointer  font-semibold mr-1"
                                                    // onClick={() => buyNowHandle(item)}
                                                    >
                                                        Buy Now
                                                    </button>
                                                    <button
                                                        className="w-30 rounded-full  px-3 py-1 color-white border-1 border-[#B91508] cursor-pointer ml-1 text-center"
                                                    // onClick={() => handleAddToCart(item)}
                                                    >
                                                        <div className="flex items-center justify-center">
                                                            <span className="inline text-[#B91508]">Cart</span> <FaCartPlus className="mx-1 text-[#B91508]" />
                                                        </div>

                                                    </button>
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}


                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default ProductCard;
