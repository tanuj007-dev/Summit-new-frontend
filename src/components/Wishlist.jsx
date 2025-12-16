import axios from "../axiosConfig";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";

// buyNowHandle,wishlist,
export const Wishlist = ({ user,addToCart,buyNowHandle,wishlist, setWishlist}) => {
  const [wishIds, setWishIds] = useState([]);
  // const [wishlist, setWishlist] = useState([]);

  const handleAddToCart = (item) => {
        addToCart(
          {
            id: item.id,
            product_name: item.name,
            product_price: item.price,
          },
          1
        );
        toast.success("Added to cart");
    };
    const getWishListProduct=()=>{
          axios
      .get(
        "/wishlistupload.php?action=get"
      )
      .then((res) => {
        if (Array.isArray(res.data)) {
          const productIds = res.data.map((item) => parseInt(item.product_id));
          setWishIds(productIds);
        } else {
          console.log("Unexpected wishlist format", res.data);
        }
      })
      .catch((err) => {
        console.log("Failed to load wishlist:", err);
      });
    }
  useEffect(() => {
    getWishListProduct();
  }, []);

  // 👇 Sync wishlist state with fetched wishIds
  // useEffect(() => {
  //   setWishlist(wishIds);
  // }, [wishIds]);

  // useEffect(() => {
  //   setWishlist(wishIds);
  // }, [wishIds]);

  const handlewishlist = async (productId) => {
    const formData = new FormData();
    formData.append("product_id", productId);

    try {
      // console.log(wishlist)
      // console.log(productId)
      // console.log(wishlist.includes(Number(productId)));
      // return
      if (wishlist.includes(Number(productId))) {
        const res = await axios.post(
          "/wishlistupload.php?action=remove",
          formData,
          { withCredentials: true }
        );
        console.log("Removed:", res.data);
        setWishlist(wishlist.filter((id) => id !== productId));
      } else {
        const res = await axios.post(
          "/wishlistupload.php?action=add",
          formData,
          { withCredentials: true }
        );
        console.log("Added:", res.data);
        setWishlist([...wishlist, productId]);
      }
      getWishListProduct();
    } catch (error) {
      console.error("Wishlist update failed", error);
    }
  };

  const wishlistItems = user.filter((item) =>
    wishIds.includes(parseInt(item.id))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Your Wishlist
      </h2>
      {/* --------------------------start ---------------------------------- */}
      <div className="grid grid-cols-4 md:space-x-13">
        {wishlistItems.length > 0 ? (
          wishlistItems.map((item, i) => {
            const isInWishlist = wishlist.includes(parseInt(item.id));

            console.log(wishlistItems);

            return (
              <div
                className="mt-5 relative w-42 md:w-auto p-2 md:p-4 bg-white rounded-md md:shadow-md"
                key={i}
              >
                <FontAwesomeIcon
                  icon={isInWishlist ? solidHeart : regularHeart}
                  style={{
                    color: isInWishlist ? "#E03B2D" : "gray",
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                  onClick={() => handlewishlist(item.id)}
                  className="absolute top-2 right-2"
                />

                <div className="flex flex-col items-center">
                  <Link to={`/879/DetailProduct/${item.id}`}>
                    <img
                      src={
                              item.images?.[0]?.url
                                ? `https://api.summithomeappliance.com/php_admin_panel/${item.images[0].url}`
                                : '/asset/images/dummy-image-square.jpg'
                            }
                      alt={item.name}
                      className="w-72 h-38 md:w-36 md:h-36 rounded-lg mx-auto"
                    />
                  </Link>

                  <h2 className="text-md font-semibold truncate w-40 mt-2">
                    {item.name}
                  </h2>
                  <p className="text-sm font-semibold mt-2">
                    <span className="text-xs font-normal text-[#AAAAAA]">
                      From{" "}
                    </span>
                    Rs. {Math.floor(item.price)}
                  </p>
                  <div className="flex justify-between w-full mt-3 px-2">
                    <button
                      className="text-xs rounded-full px-2 py-1 text-white bg-[#B91508] cursor-pointer"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to cart
                    </button>
                    <button onClick={()=>buyNowHandle(item)}    className="text-xs text-[#B91508] font-semibold">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center w-full">
            No products found in this category.
          </p>
        )}
      </div>
    </div>
  );
};
