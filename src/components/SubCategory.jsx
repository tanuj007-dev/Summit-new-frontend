import React, { useEffect, useState } from 'react';
import axios from '.././axiosConfig';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

function SubCategory({ addToCart }) {
  const { cat } = useParams();
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectSubCat, setSelectedSubCat] = useState('');
  const [SubCategories, setSubCategories] = useState([]);

  const fetchSubCategory = async () => {
    try {
      const response = await axios.get(
        `/getcatproducts.php?cat=${cat}`
      );
      if (!response?.data?.success) return;

      setProducts(response?.data?.products || []);
      setSubCategories(response?.data?.subCategory || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setSelectedSubCat('');
    fetchSubCategory();
  }, [cat]);

  const handlewishlist = async (productId) => {
    productId = parseInt(productId);
    const formData = new FormData();
    formData.append("product_id", productId);
    try {
      if (wishlist.includes(productId)) {
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
    } catch (error) {
      console.error("Wishlist update failed", error);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(
      {
        product_id: item.id,
        product_name: item.product_name,
        product_price: item.product_price,
        image: item.product_images,
      },
      1
    );
  };

  const filteredProducts = products.filter(item => {
    if (selectSubCat !== '') {
      return item.subCategory === selectSubCat;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-10 flex-col flex">
      {/* Dropdown */}
      <div className="flex justify-center mb-8 w-full ">
        <select
          value={selectSubCat}
          onChange={(e) => setSelectedSubCat(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 min-w-[220px] text-sm"
        >
          <option value=''>Select {cat} category</option>
          {SubCategories.map((subCat, idx) => (
            <option key={idx} value={subCat?.sub_category}>
              {subCat?.sub_category}
            </option>
          ))}
        </select>
      </div>

      {/* Products or Empty Message */}
      {filteredProducts.length === 0 ? (
        <div className="w-full flex justify-center items-center py-20">
          <p className="bg-gray-100 px-6 py-3 rounded shadow text-gray-600 text-lg">
            No products found in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((item, i) => {
            const isInWishlist = wishlist.includes(parseInt(item.sno));
            return (
              <div
                key={i}
                className="relative bg-white rounded shadow-md p-4"
              >
                {/* Wishlist Icon */}
                <FontAwesomeIcon
                  icon={isInWishlist ? solidHeart : regularHeart}
                  style={{
                    color: isInWishlist ? "#E03B2D" : "gray",
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                  onClick={() => handlewishlist(item.product_id)}
                  className="absolute top-2 right-2"
                />

                <div className="flex flex-col items-center">
                  <Link to={`/879/DetailProduct/${item.product_id}`}>
                    <img
                      src={`https://summithomeappliances.performdigimonetize.com/admin/${item.image}`}
                      alt={item.product_name}
                      className="w-36 h-36 object-cover rounded-lg"
                    />
                  </Link>

                  <h2 className="text-md font-semibold truncate mt-2 text-center">
                    {item.product_name}
                  </h2>
                  <p className="text-sm font-semibold mt-1">
                    <span className="text-xs font-normal text-[#AAAAAA]">From </span>
                    Rs. {item.product_price}
                  </p>
                  <div className="flex justify-between w-full mt-3 px-2">
                    <button
                      className="text-xs rounded-full px-3 py-1 text-white bg-[#B91508]"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to cart
                    </button>
                    <button className="text-xs text-[#B91508] font-semibold">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SubCategory;
