import React, { useContext } from "react";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const {
    cart,
    loading,
    handleUpdateCart,
    handleRemoveFromCart,
    totalItems,
  } = useContext(CartContext);

  const imageURL = import.meta.env.VITE_APP_IMAGE_BASE_URL;

  const cartItems = cart?.cart?.items || [];
  const subtotal = cart?.total || 0;
  const shippingFee = subtotal > 0 ? 100 : 0;
  const total = subtotal + shippingFee;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center mb-8">
          <h1 className="text-xl font-semibold flex items-center">
            <FiShoppingCart className="mr-2" /> Your Shopping Cart
          </h1>
          <span className="ml-auto bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {totalItems} Items
          </span>
        </div>

        {/* EMPTY CART */}
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-2xl font-semibold">
              Your cart is empty
            </h2>
            <p className="mt-2 text-gray-500">
              Add products to your cart to see them here.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block bg-[#B91508] text-white px-6 py-2 rounded-md"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* CART ITEMS */}
            <div className="lg:w-2/3 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-12 bg-gray-100 p-4 text-sm font-bold">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 p-4 border-b items-center"
                >
                  {/* PRODUCT */}
                  <div className="col-span-5 flex items-center">
                    <img
                      src={
                        item?.variant?.image
                          ? item.variant.image.startsWith("http")
                            ? item.variant.image
                            : imageURL + item.variant.image
                          : "/asset/images/dummy-image-square.jpg"
                      }
                      className="w-16 h-16 object-cover rounded mr-4"
                      alt="product"
                    />
                    <div>
                      <h3 className="font-medium">
                        {item?.variant?.product?.name || "Product"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        SKU: {item?.variant?.sku || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="col-span-2 text-center">
                    ₹{parseFloat(item.price).toFixed(2)}
                  </div>

                  {/* QUANTITY */}
                  <div className="col-span-3 flex justify-center">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? handleUpdateCart(item.id, item.quantity - 1)
                            : handleRemoveFromCart(item.id)
                        }
                        className="px-2 py-1"
                      >
                        {item.quantity > 1 ? (
                          <FiMinus size={14} />
                        ) : (
                          <FiTrash2 size={14} className="text-red-500" />
                        )}
                      </button>

                      <span className="px-3">{item.quantity}</span>

                      <button
                        onClick={() =>
                          handleUpdateCart(item.id, item.quantity + 1)
                        }
                        className="px-2 py-1"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="col-span-2 text-right font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="lg:w-1/3 bg-gray-50 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Summary</h2>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shippingFee.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout">
                <button className="mt-6 w-full bg-green-600 text-white py-3 rounded-md font-semibold">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
