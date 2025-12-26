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
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [imageErrors, setImageErrors] = useState({});

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

  // Handle image load
  const handleImageLoad = (productId) => {
    setImageLoadingStates(prev => ({ ...prev, [productId]: true }));
  };

  // Handle image error
  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
    setImageLoadingStates(prev => ({ ...prev, [productId]: true }));
  };

  const cartItems = cart?.cart?.items || [];
  const subtotal = cart?.cart?.total || 0;
  const shippingFee = subtotal > 0 ? 100 : 0;
  const total = subtotal + shippingFee;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center text-gray-900">
            <FiShoppingCart className="mr-2 text-red-600" /> Your Shopping Cart
          </h1>
          <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold w-fit">
            {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {/* EMPTY CART */}
        {cartItems.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-lg shadow-sm">
            <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-900">
              Your cart is empty
            </h2>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Add products to your cart to see them here.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* CART ITEMS - LEFT COLUMN */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                
                {/* DESKTOP HEADER */}
                <div className="hidden md:grid grid-cols-12 bg-gray-100 p-4 text-sm font-bold text-gray-900 sticky top-0 z-10">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {/* CART ITEMS */}
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="border-b last:border-b-0 p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                  >
                    {/* MOBILE VIEW - Stacked */}
                    <div className="md:hidden space-y-4">
                      {/* Product Info */}
                      <div className="flex items-start gap-4">
                        {/* Image Container with Skeleton Loading */}
                        <div className="relative w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                          {!imageLoadingStates[item?.product_id] && (
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
                          )}
                          <img
                            src={imageErrors[item?.product_id] ? "/asset/images/dummy-image-square.jpg" : getProductDetails(item?.product_id)?.image}
                            className="w-full h-full object-cover rounded"
                            alt={getProductDetails(item?.product_id)?.name || "Product"}
                            loading="lazy"
                            onLoad={() => handleImageLoad(item?.product_id)}
                            onError={() => handleImageError(item?.product_id)}
                            style={{
                              opacity: imageLoadingStates[item?.product_id] ? 1 : 0,
                              transition: 'opacity 0.3s ease-in-out'
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                            {getProductDetails(item?.product_id)?.name || "Product"}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            SKU: {item?.variant?.sku || item?.sku || "N/A"}
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <div>
                              <p className="text-xs text-gray-600">Price</p>
                              <p className="font-bold text-red-600">₹{parseFloat(item.price).toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Total</p>
                              <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls - Mobile */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm text-gray-600">Quantity</span>
                        <div className="flex items-center border rounded-lg bg-white">
                          <button
                            onClick={() =>
                              item.quantity > 1
                                ? handleUpdateCart(item.id, item.quantity - 1)
                                : handleRemoveFromCart(item.id)
                            }
                            className="px-3 py-2 hover:bg-gray-100 transition-colors"
                          >
                            {item.quantity > 1 ? (
                              <FiMinus size={16} />
                            ) : (
                              <FiTrash2 size={16} className="text-red-500" />
                            )}
                          </button>
                          <span className="px-4 py-2 font-semibold min-w-12 text-center">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleUpdateCart(item.id, item.quantity + 1)
                            }
                            className="px-3 py-2 hover:bg-gray-100 transition-colors"
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* DESKTOP VIEW - Grid */}
                    <div className="hidden md:grid grid-cols-12 items-center gap-4">
                      {/* PRODUCT */}
                      <div className="col-span-5 flex items-start gap-4">
                        {/* Image Container */}
                        <div className="relative w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                          {!imageLoadingStates[item?.product_id] && (
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
                          )}
                          <img
                            src={imageErrors[item?.product_id] ? "/asset/images/dummy-image-square.jpg" : getProductDetails(item?.product_id)?.image}
                            className="w-full h-full object-cover rounded"
                            alt={getProductDetails(item?.product_id)?.name || "Product"}
                            loading="lazy"
                            onLoad={() => handleImageLoad(item?.product_id)}
                            onError={() => handleImageError(item?.product_id)}
                            style={{
                              opacity: imageLoadingStates[item?.product_id] ? 1 : 0,
                              transition: 'opacity 0.3s ease-in-out'
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm lg:text-base">
                            {getProductDetails(item?.product_id)?.name || "Product"}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            SKU: {item?.variant?.sku || item?.sku || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* PRICE */}
                      <div className="col-span-2 text-center">
                        <p className="text-sm lg:text-base font-semibold text-red-600">₹{parseFloat(item.price).toFixed(2)}</p>
                      </div>

                      {/* QUANTITY */}
                      <div className="col-span-3 flex justify-center">
                        <div className="flex items-center border rounded-lg bg-white">
                          <button
                            onClick={() =>
                              item.quantity > 1
                                ? handleUpdateCart(item.id, item.quantity - 1)
                                : handleRemoveFromCart(item.id)
                            }
                            className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                            title={item.quantity > 1 ? "Decrease quantity" : "Remove from cart"}
                          >
                            {item.quantity > 1 ? (
                              <FiMinus size={16} />
                            ) : (
                              <FiTrash2 size={16} className="text-red-500" />
                            )}
                          </button>
                          <span className="px-4 py-1.5 font-semibold min-w-12 text-center text-sm lg:text-base">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleUpdateCart(item.id, item.quantity + 1)
                            }
                            className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                            title="Increase quantity"
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* TOTAL */}
                      <div className="col-span-2 text-right">
                        <p className="text-sm lg:text-base font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUMMARY - RIGHT COLUMN */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-20 lg:top-28">
                <div className="flex flex-col sm:flex-row lg:flex-col justify-between items-start sm:items-center lg:items-stretch gap-3 sm:gap-0 mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Order Summary</h2>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-600 hover:text-red-700 font-semibold hover:underline"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4 border-b pb-4 mb-4">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-700">Shipping Fee</span>
                    <span className="font-semibold text-gray-900">₹{shippingFee.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6 pb-6 border-b">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-xl sm:text-2xl font-bold text-red-600">₹{total.toFixed(2)}</span>
                </div>

                <Link to="/checkout" className="block w-full">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-base sm:text-lg transition-colors">
                    Proceed to Checkout
                  </button>
                </Link>

                <Link to="/" className="block mt-3">
                  <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-colors">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
