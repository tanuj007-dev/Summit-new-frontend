// import axios from "../axiosConfig";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";

const Cart = ({ addcart, setaddcart, isLoggedIn }) => {
  const navigate = useNavigate();
  /////new code start
  const { cart, handleCart, handleAddToCart, handleBuyNow, handleUpdateCart, handleRemoveFromCart, handleClearCart, totalItems } = useContext(CartContext);
  /////new code end

  const safeCart = Array.isArray(addcart) ? addcart : [];

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [msg, setMsg] = useState("");
  const [newtotal, setnewtotal] = useState(null);

  const getProduct = (item) => item.selectedProduct || item;
  const getId = (product) => product.sno || product.product_id;

  const updateQuantity = async (id, newQuantity) => {
    const updatedCart = safeCart.map((item) => {
      const product = getProduct(item);
      const itemId = item.id || getId(product);
      if (itemId === id) {
        return { ...item, quantity: Math.max(1, newQuantity) };
      }
      return item;
    });

    setaddcart(updatedCart);

    if (isLoggedIn) {
      const updatedItem = updatedCart.find(
        (item) => (item.id || getId(getProduct(item))) === id
      );
      const product = getProduct(updatedItem);

      try {
        await axios.post(
          "/UpdateCart.php",
          {
            product_id: product.product_id || product.sno || updatedItem.id,
            quantity: Math.max(1, newQuantity),
            product_name: product.name,
            product_price: product.price,
            mode: "update",
          },
          { withCredentials: true }
        );
        console.log("Cart quantity updated in backend.");
      } catch (error) {
        console.error("Error updating quantity in backend:", error);
      }
    }
  };


  const subtotal = safeCart.reduce((sum, item) => {
    const product = getProduct(item);
    const price = parseFloat(product.price) || 0;
    const quantity = item.quantity || 1;
    return sum + price * quantity;
  }, 0);



  const applyCoupon = async () => {
    try {
      const res = await axios.post(
        "/checkCouponStatus.php",
        new URLSearchParams({
          couponCode,
          subtotal,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          withCredentials: true,
        }
      );

      const response = res.data;

      if (response.status === "success") {
        setMsg(response.message);
        setAppliedCoupon({
          code: couponCode,
          discount: parseFloat(response.discount),
          description: "Coupon applied successfully.",
        });
        setnewtotal(response.new_total);
      } else {
        setMsg(response.message);
      }
    } catch (error) {
      console.error("Coupon error:", error);
      setMsg("Something went wrong.");
    }

    setCouponCode("");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setMsg("");
  };
  // const l, = async () => {
  //   try {
  //     for (const item of safeCart) {
  //       const product = getProduct(item);

  //       const res = await axios.post(
  //         "https://api-sumithomeappliances.performdigimonetize.coms/php_controllar/contraollers/placemyorder.php",
  //         {
  //           item_name: product.product_name,
  //           quantity: item.quantity,
  //           price: product.product_price,
  //         },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           withCredentials: true,
  //         }
  //       );

  //       if (res.data.status !== "success") {
  //         throw new Error(res.data.message || "Failed to place order");
  //       }
  //     }

  //     return true;
  //   } catch (error) {
  //     console.error("Order placement error:", error);
  //     return false;
  //   }
  // };

  const placeOrder = async () => {
    try {
      for (const item of safeCart) {
        const product = getProduct(item);
 
        const formData = new FormData();
        formData.append("item_name", product.name);
        formData.append("quantity", item.quantity);
        formData.append("price", product.price);
        formData.append("image_path", product.product_images || product.image);

        // product.image should be a File or Blob object

        const res = await axios.post(
          "/placemyorder.php",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        if (res.data.status !== "success") {
          throw new Error(res.data.message || "Failed to place order");
        }
      }

      return true;
    } catch (error) {
      console.error("Order placement error:", error);
      return false;
    }
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/login");
      return;
    }

    setIsCheckingOut(true);

    const success = await placeOrder();

    if (success) {
      alert("Order placed successfully!");
      setaddcart([]); // clear cart
    } else {
      alert("Order failed. Please try again.");
    }

    setIsCheckingOut(false);
  };

  const handleDelete = async (productId) => {
    if (!isLoggedIn) {
      // Guest user — remove from local cart only
      setaddcart((prevItems) =>
        prevItems.filter((item) => {
          const currentId =
            item.product_id || item?.selectedProduct?.product_id || item?.id;
          return currentId !== productId;
        })
      );
      toast.success("Item removed from cart");
      return;
    }

    // Logged-in user — remove from backend
    try {
      const response = await axios.post(
        "/DeleteCartItem.php",
        { product_id: productId },
        { withCredentials: true }
      );

      if (response.data.status === "success" || response.data.success) {
        setaddcart((prevItems) =>
          prevItems.filter((item) => {
            const currentId =
              item.product_id || item?.selectedProduct?.product_id || item?.id;
            return currentId !== productId;
          })
        );
        toast.success("Item removed from cart");
        console.log("Item deleted successfully");
      } else {
        console.error("Failed to delete item:", response.data.message);
        toast.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Something went wrong while deleting");
    }
  };

  //////////new Code 07-10-2025
  const baseURL = import.meta.env.VITE_APP_API_BASE_URL;
  const imageURL = import.meta.env.VITE_APP_IMAGE_BASE_URL;

  const shippingFee = subtotal ? 100 : 0;
  const tax = subtotal * 0.08;
  const discount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
  // const total = subtotal + shippingFee + tax - discount;
  const total = cart?.total + shippingFee;



  // console.log("new API Data", cart);
  // console.log(safeCart);
  return (
    <div className="md:min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center">
            <FiShoppingCart className="mr-2" /> Your Shopping Cart
          </h1>
          <span className="ml-auto bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {totalItems}{" "}Items
          </span>
        </div>

        {cart?.cart?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg md:shadow-sm">
            <div className="max-w-md mx-auto">
              <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="mt-4 md:text-2xl font-semibold text-gray-900">
                Your cart is empty
              </h2>
              <p className="text-xs md:text-base mt-2 text-gray-500">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#B91508] hover:bg-red-800"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 bg-gray-100 p-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-5 font-bold text-black">Product</div>
                  <div className="col-span-2 font-bold text-black text-center">Price</div>
                  <div className="col-span-3 font-bold text-black text-center">Quantity</div>
                  <div className="col-span-2 font-bold text-black text-right">Total</div>
                </div>

                {cart?.cart?.items?.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className="sr-responsive-cart grid grid-cols-12 p-4 border-b border-gray-100 items-center hover:bg-gray-50 transition relative"
                    >
                      <div className="col-span-5 flex items-center">
                        <img
                          src={
                            item.variant.image
                              ? imageURL + item.variant.image
                              : '/asset/images/dummy-image-square.jpg'
                          }
                          className="w-16 h-16 object-cover rounded-md mr-4"
                          alt={item.id}
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {item.variant.product.name}
                          </h3>
                          <span className="text-xs text-black bg-red-100 px-2 py-0.5 rounded mr-1">
                            SKU: {item.variant.sku}
                          </span>
                          {item?.variant?.attributes?.map((attr) => (
                            <span className="text-xs text-black bg-red-100 px-2 py-0.5 rounded mr-1">
                              {attr.attribute.name}: {attr.value}
                            </span>
                          ))}
                          {item?.variant?.stock < 1 && (
                            <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">
                              Out of stock
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-span-2 text-center text-gray-900 font-medium">
                        ₹{parseFloat(item.price).toFixed(2)}
                      </div>

                      <div className="col-span-3 flex justify-center">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          {(item.quantity > 1) ? (
                            <button
                              onClick={() => handleUpdateCart(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              <FiMinus size={14} />
                            </button>) : (<button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="px-2 py-1 text-red-500 hover:text-red-700"
                              title="Remove item"
                            >
                              <FiTrash2 size={18} />
                            </button>)}
                          <span className="px-3 py-1 text-gray-900 border-x border-gray-300">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => handleUpdateCart(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            disabled={(item.quantity<100)?false:true}
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="col-span-2 text-right font-semibold text-gray-900">
                        ₹ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:w-1/3 bg-gray-50 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Summary</h2>

              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cart?.total?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shippingFee.toFixed(2)}</span>
                </div>
                {/* <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div> */}
                {/* {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>- ₹{discount.toFixed(2)}</span>
                  </div>
                )} */}
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-gray-900 text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon Code */}
              {!appliedCoupon ? (
                <div className="mt-4">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={applyCoupon}
                    className="mt-2 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red cursor-pointer"
                    disabled={!couponCode.trim()}
                  >
                    Apply Coupon
                  </button>
                  {msg && <p className="mt-2 text-sm text-red-600">{msg}</p>}
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-between bg-green-100 text-green-800 p-3 rounded-md">
                  <span>{appliedCoupon.description}</span>
                  <button
                    onClick={removeCoupon}
                    className="bg-[#B91508] underline hover:text-green-600"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* ✅ Checkout Button */}
              <Link to={'/checkout'}>
                <button
                  className="mt-6 w-full bg-green-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  Checkout
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
