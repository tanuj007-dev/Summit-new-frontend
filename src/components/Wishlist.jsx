import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

export const Wishlist = ({ buyNowHandle }) => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { handleAddToCart } = useCart();

  const onAddToCart = (product) => {
    handleAddToCart(product, 1);
    toast.success("Added to cart!");
  };

  const getProductImage = (product) => {
    if (product?.image) return product.image;
    if (product?.image_url) return product.image_url;
    if (product?.images?.length > 0) {
      if (product.images[0]?.url) return product.images[0].url;
      if (typeof product.images[0] === 'string') return product.images[0];
    }
    if (product?.variants?.length > 0) {
      const variant = product.variants[0];
      if (variant?.image) return variant.image;
      if (variant?.images?.length > 0) {
        if (variant.images[0]?.url) return variant.images[0].url;
        if (typeof variant.images[0] === 'string') return variant.images[0];
      }
    }
    return "/asset/images/dummy-image-square.jpg";
  };

  const getProductPrice = (product) => {
    if (product?.variants?.length > 0 && product.variants[0]?.price) {
      return Math.floor(Number(product.variants[0].price)) || "N/A";
    }
    if (product?.price) return Math.floor(Number(product.price)) || "N/A";
    if (product?.selling_price) return Math.floor(Number(product.selling_price)) || "N/A";
    if (product?.mrp) return Math.floor(Number(product.mrp)) || "N/A";
    return "N/A";
  };

  const getProductTitle = (product) => {
    return product?.name || product?.product_name || product?.title || "Unknown Product";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-[60vh]">
      <div className="flex items-center justify-between mb-10 border-b pb-6">
        <h2 className="text-3xl font-bold text-gray-900 font-gotham">
          My Wishlist <span className="text-gray-400 font-normal ml-2">({wishlist.length})</span>
        </h2>
        <Link to="/" className="text-[#941007] font-semibold hover:underline">
          Continue Shopping
        </Link>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col p-4"
            >
              {/* Remove Button */}
              <button
                onClick={() => removeFromWishlist(item.id || item.sno || item.product_id || item.detail_id)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Remove from wishlist"
              >
                <FontAwesomeIcon icon={solidHeart} className="text-red-600" size="lg" />
              </button>

              {/* Product Image */}
              <Link to={`/product-details/${item.id || item.sno || item.product_id || item.detail_id}`} className="mb-4">
                <div className="bg-gray-50 rounded-xl aspect-square flex items-center justify-center p-4 group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={getProductImage(item)}
                    alt={getProductTitle(item)}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="flex flex-col flex-grow">
                <Link to={`/product-details/${item.id || item.sno || item.product_id || item.detail_id}`}>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 hover:text-[#941007] transition-colors font-gotham">
                    {getProductTitle(item)}
                  </h3>
                </Link>
                
                <div className="mb-4">
                  <span className="text-2xl font-black text-gray-900 font-gotham">
                    {getProductPrice(item) === "N/A" ? "Rs. N/A" : `Rs. ${getProductPrice(item)}`}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-auto space-y-2">
                  <button
                    onClick={() => onAddToCart(item)}
                    className="w-full py-3 bg-[#941007] text-white rounded-lg font-bold hover:bg-[#b2140a] transition-colors shadow-md active:scale-95"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => buyNowHandle(item)}
                    className="w-full py-2.5 bg-white text-[#941007] border-2 border-[#941007] rounded-lg font-bold hover:bg-red-50 transition-colors active:scale-95"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="mb-6">
            <FontAwesomeIcon icon={solidHeart} className="text-gray-200 text-7xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 font-gotham">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">
            Save items that you like in your wishlist to review them later and add to cart.
          </p>
          <Link
            to="/"
            className="inline-block bg-[#941007] text-white px-10 py-3.5 rounded-full font-bold hover:bg-[#b2140a] shadow-lg transition-all active:scale-95"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};
