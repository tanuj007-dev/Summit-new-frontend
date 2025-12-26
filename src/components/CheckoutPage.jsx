// ✅ Updated CheckoutPage.js (with 8% Tax)
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { CartContext } from '../context/CartContext';
import { FaShippingFast } from "react-icons/fa";
const CheckoutPage = ({ cartItems = [], setCartItems, isLoggedIn }) => {
  const navigate = useNavigate();
  const { cart, handleClearCart } = useContext(CartContext);

  // Get cart items from CartContext or props
  const getCartItems = () => {
    // Try to get from CartContext first
    if (cart?.cart?.items && cart.cart.items.length > 0) {
      return cart.cart.items;
    }
    // Fallback to props
    return cartItems || [];
  };

  const cartItemsToUse = getCartItems();

  const [formValues, setFormValues] = useState({
    fullName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [selectedPayment, setSelectedPayment] = useState('COD');
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (cartItemsToUse.length > 0) {
      const calculatedSubtotal = cartItemsToUse.reduce((sum, item) => {
        return sum + parseFloat(item.price || 0) * (item.quantity || 1);
      }, 0);

      const shippingFee = calculatedSubtotal > 1000 ? 0 : 50;
      const taxAmount = calculatedSubtotal * 0.08; // 8% tax
      const totalAmount = calculatedSubtotal + shippingFee + taxAmount;

      setSubtotal(calculatedSubtotal);
      setShipping(shippingFee);
      setTax(taxAmount);
      setTotal(totalAmount);
    }
  }, [cartItemsToUse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    const { fullName, phone, address1, city, state, pincode } = formValues;

    if (!fullName.trim()) errors.fullName = 'Full Name is required';
    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone)) {
      errors.phone = 'Enter 10-digit phone number';
    }
    if (!address1.trim()) errors.address1 = 'Address Line 1 is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!state.trim()) errors.state = 'State is required';
    if (!pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(pincode)) {
      errors.pincode = 'Enter valid 6-digit pincode';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    if (selectedPayment === 'COD') {
      await placeOrderBackend();
    } else {
      await handleRazorpayPayment();
    }
  };

  const placeOrderBackend = async (paymentId = null) => {
    const fullAddress = `${formValues.address1}, ${formValues.address2}, ${formValues.city}, ${formValues.state}, ${formValues.pincode}`;
    const billing = {
      name: formValues.fullName,
      number: formValues.phone,
      address_line_1: formValues.address1,
      address_line_2: formValues.address2,
      city: formValues.city,
      state: formValues.state,
      pincode: formValues.pincode,
    };

    const payload = {
      cart_items: cartItemsToUse.map((item) => ({
        product_variant_id: item.product_variant_id || item.variant_id,
        quantity: item.quantity,
        price: parseFloat(item.price),
      })),
      shipping_address: fullAddress,
      engraved_name: formValues.fullName,
      payment_type: selectedPayment,
      billing_address: billing,
      razorpay_payment_id: paymentId,
      tax: tax,
      shipping_fee: shipping,
      total_price: total,
    };

    setIsPlacingOrder(true);
    try {
      const res = await axios.post('/api/place_order', payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (res.data.status === 'success' || res.data.success) {
        // Clear cart from CartContext
        if (handleClearCart) {
          handleClearCart();
        }
        // Also clear from props if setCartItems exists
        if (setCartItems) {
          setCartItems([]);
        }
        navigate(`/thankyou?order=${res.data.ordered_id || res.data.order_id}`);
      } else {
        setMessage('❌ Failed: ' + (res.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Order error:', error);
      setMessage('❌ Something went wrong while placing the order.');
    }
    setIsPlacingOrder(false);
  };

  const handleRazorpayPayment = async () => {
    try {
      const orderRes = await axios.post('/create_order.php', {
        amount: total * 100,
        currency: 'INR',
      });
      const order = orderRes.data;

      const options = {
        key: "rzp_test_R7BTCTcFLCXdCH",
        amount: order.amount,
        currency: order.currency,
        name: "My Shop",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post('/verify.php', response, {
              headers: { 'Content-Type': 'application/json' },
            });

            if (verifyRes.data.success) {
              await placeOrderBackend(response.razorpay_payment_id);
            } else {
              setMessage("❌ Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            setMessage("❌ Error verifying payment.");
          }
        },
        prefill: {
          name: formValues.fullName,
          email: "customer@example.com",
          contact: formValues.phone,
        },
        theme: { color: "#F37254" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Razorpay error:", err);
      setMessage("❌ Unable to initiate payment.");
    }
  };

  return (
    <div className="px-2 md:px-16 py-8 bg-white text-gray-800">
      <h1 className=" flex text-3xl font-semibold mb-6 border-b gap-2 pb-3">Checkout<span className='mt-1 text-[#DC2B1C]'><FaShippingFast /></span></h1>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Billing Info */}
        <div className="bg-gray-50 p-6 rounded-md shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Billing Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InputField label="Full Name" name="fullName" value={formValues.fullName} onChange={handleChange} error={formErrors.fullName} />
              <InputField label="Phone Number" name="phone" type="tel" value={formValues.phone} onChange={handleChange} error={formErrors.phone} />
            </div>
            <div className="space-y-4">
              <InputField label="Address Line 1" name="address1" value={formValues.address1} onChange={handleChange} error={formErrors.address1} />
              <InputField label="Address Line 2 (Optional)" name="address2" value={formValues.address2} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="City" name="city" value={formValues.city} onChange={handleChange} error={formErrors.city} />
                <InputField label="State" name="state" value={formValues.state} onChange={handleChange} error={formErrors.state} />
              </div>
              <InputField label="Pin Code" name="pincode" value={formValues.pincode} onChange={handleChange} error={formErrors.pincode} />
            </div>
          </div>
        </div>

        {/* Order Summary + Payment */}
        <div>
          <h2 className="text-xl font-medium ml-4 sm:ml-0 mb-4">Order Summary</h2>
          <div className="border rounded-md p-4 space-y-3 bg-gray-50">
            {cartItemsToUse.length > 0 ? (
              <>
                {cartItemsToUse.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm text-gray-800">
                    <span>{item.name || item.product_name || 'Product'} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm pt-2 border-t mt-2">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm">Your cart is empty.</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="mt-6">
            <h3 className="font-medium mb-2">Payment Method</h3>
            <div className="space-y-2">
              {['COD', 'Online'].map((method) => (
                <label key={method} className="block">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={selectedPayment === method}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="mr-2"
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || cartItems.length === 0}
            className="mt-6 w-full bg-red-600 text-white py-3 rounded-full font-semibold text-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
          </button>

          {message && <p className="mt-4 text-sm text-center text-blue-600">{message}</p>}
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, error, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={label}
      className={`mt-1 block w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600`}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default CheckoutPage;
