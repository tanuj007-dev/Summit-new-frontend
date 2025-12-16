 
 import React from "react";
import { Link } from "react-router-dom";
import  { useState, useEffect, useContext } from "react";
 
import axios from "../axiosConfig";
import { CartContext } from "../context/CartContext";
const GasStoveSection = ({ user }) => {
    

const products = [
  {
    title: "2 Burner Gas Stove",
    price: "Rs. 999",
    oldPrice: "Rs. 2999",
    image: "/assets/gas2.jpg",
  },
  {
    title: "3 Burner Gas Stove",
    price: "Rs. 1999",
    oldPrice: "Rs. 4999",
    image: "/assets/gas3.jpg",
  },
  {
    title: "4 Burner Gas Stove",
    price: "Rs. 2999",
    oldPrice: "Rs. 5999",
    image: "/assets/gas4.jpg",
  },
  {
    title: "4 Burner Gas Stove",
    price: "Rs. 2999",
    oldPrice: "Rs. 5999",
    image: "/assets/gas4.jpg",
  },
];


 
  const [index, setIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const visibleCount = 1;

  const baseURL = import.meta.env.VITE_APP_API_BASE_URL;
  const imageURL = import.meta.env.VITE_APP_IMAGE_BASE_URL;
  const [product, setProduct] = useState({});
  const { handleAddToCart, handleBuyNow } = useContext(CartContext);

  const normalize = (str) => (str ? str.toLowerCase().trim() : "");

  const categories = [
    "combos",
    "cookware",
    "pressure cooker",
    "steam cookware",
    "gas stove",
    "gas tandoor",
    "mixer grinder",
  ];

  const categoriesWithProducts = categories.filter((category) =>
    user?.some(
      (item) => normalize(item.product_category) === normalize(category)
    )
  );

  const filteredProducts = selectedCategory
    ? user.filter(
        (item) =>
          normalize(item.product_category) === normalize(selectedCategory)
      )
    : user;

  const NextHandler = () => {
    if (index + visibleCount < filteredProducts.length) setIndex(index + 1);
  };

  const PrevHandler = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handlefilter = (name) => {
    setSelectedCategory((prev) => (prev === name ? null : name));
    setIndex(0);
  };

  useEffect(() => {
    axios
      .get(`${baseURL}products`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((e) => console.log("Error fetching Product Details:", e));
  }, []);

  return (
    <section className="w-full bg-white py-10 px-6">
        <div className="text-center mb-8">
        <h2 className="md:text-[1.6rem] text-lg font-semibold text-gray-900">
          Trending Kitchen Appliances
        </h2>
        <p className="text-[#636365] md:text-lg font-semibold mt-1">
          Our Best Sellers  
        </p>
      </div>
       <div className="w-full mx-auto text-[#545455] font-medium flex flex-wrap justify-center gap-4 md:gap-6 mb-10">
        {categories.map((category) => {
          const isDisabled = !categoriesWithProducts.includes(category);
          const isSelected = normalize(selectedCategory) === normalize(category);

          return (
            <button
              key={category}
              disabled={isDisabled}
              onClick={() => handlefilter(category)}
              className={`rounded-full px-3 md:px-5 py-1 md:py-1.5 text-sm md:text-base font-medium transition-all
                ${
                  isSelected
                    ? "bg-[#B91508] text-white"
                    : "bg-[#E9E9EB] text-[#545455] hover:bg-[#d5d5d7]"
                } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {category
                .split(" ")
                .map((w) => w[0].toUpperCase() + w.slice(1))
                .join(" ")}
            </button>
          );
        })}
      </div>
      

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
       {product?.data?.slice(0, 4).map((product, i) => (
          <div
            key={i}
            className="flex flex-col items-center w-full max-w-[280px]"
          >
            {/* IMAGE BOX */}
            <div className="relative w-full overflow-hidden rounded-2xl shadow-md">
                <Link to={`/product-details/${product.slug}`}>
                               <img
                                 src={
                                   product?.variants?.[0]?.image
                                     ? `${imageURL}${product.variants[0].image}`
                                     : "/asset/images/dummy-image-square.jpg"
                                 }
                                 alt={product.name}
                                 className="w-[200px] h-[200px] object-contain transition-transform duration-300 hover:scale-105"
                               />
                             </Link>

              <span className="absolute bottom-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                Sale
              </span>
            </div>

            {/* TEXT + PRICE */}
            <div className="text-center mt-4">
              <Link to={`/product-details/${product.slug}`}>
                             <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                               {product.name}
                             </h3>
                           </Link>
              <p className="text-sm text-gray-700 mb-3">
                from{" "}
                <span className="font-semibold text-red-600">
                  ₹{Math.floor(product?.variants?.[0]?.price)}
                </span>{" "}
                <span className="text-gray-400 line-through ml-1">
                  ₹{Math.floor(product?.variants?.[0]?.mrp)}
                </span>
              </p>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 justify-center mt-auto">
                <button
                  onClick={() => handleAddToCart(product?.variants?.[0]?.id)}
                  className="bg-red-600 text-white text-sm px-4 py-2 rounded-full hover:bg-red-700 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleBuyNow(product?.variants?.[0]?.id)}
                  className="text-red-600 border border-red-600 text-sm px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition"
                >
                  Buy Now
                </button>
              </div>
          </div>
           
        ))}
        
      </div>
      
    </section>
  );
};

export default GasStoveSection;
