import React, { useContext, useEffect, useState } from "react";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import axios from "../axiosConfig";

const Cart = () => {
  const {
    cart,
    loading,
    handleUpdateCart,
    handleRemoveFromCart,
    handleClearCart,
    totalItems,
  } = useContext(CartContext);

  const imageURL = import.meta.env.VITE_APP_IMAGE_BASE_URL;
  const [productCache, setProductCache] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Fetch product details when cart items change
  useEffect(() => {
    if (cart?.cart?.items && cart.cart.items.length > 0) {
      fetchProductsForCart();
    }
  }, [cart?.cart?.items]);

  const fetchProductsForCart = async () => {
    const cartItems = cart?.cart?.items || [];
    const itemsToFetch = cartItems.filter(
      item => item.product_id && !productCache[item.product_id]
    );

    if (itemsToFetch.length === 0) return;

    setLoadingProducts(true);
    try {
      // Fetch product details for all items that are not cached
      const promises = itemsToFetch.map(item =>
        axios
          .get(`/api/products/view/${item.product_id}`)
          .then(response => ({
            product_id: item.product_id,
            data: response.data?.data || response.data,
          }))
          .catch(error => {
            console.error(`Error fetching product ${item.product_id}:`, error);
            return {
              product_id: item.product_id,
              data: null,
            };
          })
      );

      const results = await Promise.all(promises);
      const newCache = { ...productCache };

      results.forEach(result => {
        if (result.data) {
          newCache[result.product_id] = result.data;
        }
      });

      setProductCache(newCache);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const getProductDetails = (productId) => {
    const product = productCache[productId];
    
    if (!product) {
      return { name: "Loading...", image: "/asset/images/dummy-image-square.jpg" };
    }

    const name = product?.name || product?.product_name || "Product";
    const image = getImage(product);

    return { name, image };
  };

  const getImage = (product) => {
    // Check for S3 presigned URL in image field
    if (product?.image && product.image.startsWith("http")) {
      return product.image;
    }
    if (product?.images && Array.isArray(product.images) && product.images[0]) {
      const img = product.images[0];
      if (typeof img === "string" && img.startsWith("http")) {
        return img;
      }
      if (img?.url && img.url.startsWith("http")) {
        return img.url;
      }
    }
    if (product?.variants && Array.isArray(product.variants) && product.variants[0]?.image) {
      const variantImg = product.variants[0].image;
      if (variantImg.startsWith("http")) {
        return variantImg;
      }
    }

    return "/asset/images/dummy-image-square.jpg";
  };

  const cartItems = cart?.cart?.items || [];
  const subtotal = cart?.cart?.total || 0;
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
                      src={getProductDetails(item?.product_id)?.image || "/asset/images/dummy-image-square.jpg"}
                      className="w-16 h-16 object-cover rounded mr-4"
                      alt={getProductDetails(item?.product_id)?.name || "Product"}
                      onError={(e) => {
                        e.target.src = "/asset/images/dummy-image-square.jpg";
                      }}
                    />
                    <div>
                      <h3 className="font-medium">
                        {getProductDetails(item?.product_id)?.name || "Product"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        SKU: {item?.variant?.sku || item?.sku || "N/A"}
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Summary</h2>
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Clear Cart
                </button>
              </div>

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
