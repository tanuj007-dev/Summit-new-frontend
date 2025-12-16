import React, { useState } from "react";
import axios from '../axiosConfig';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await axios.get(`/track-order.php`, {
        params: { ordered_id: orderId }
      });

      const data = response.data;

      if (data.error) {
        setError(data.error);
      } else {
        setOrder(data);
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white font-sans">
      <div className="w-full py-12 bg-white border-b border-gray-200 shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800">
          📦 Track Your Shipment
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Enter your Order ID below to see the shipment details
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10">
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <input
              type="text"
              placeholder="Enter Order ID (e.g., SUM123456)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full sm:w-2/3 border border-gray-300 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-red-600 shadow-md"
            />
            <button
              onClick={fetchOrderDetails}
              disabled={loading || !orderId.trim()}
              className="bg-red-600 text-white px-8 py-4 text-lg rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? "Tracking..." : "Track Order"}
            </button>
          </div>

          {error && (
            <p className="text-red-600 mt-8 text-center font-medium tracking-wide text-lg">
              {error}
            </p>
          )}

          {order && order.items && order.items.length > 0 && (
            <div className="mt-12 space-y-8">
              {/* Order Info Summary */}
              <div className="bg-gray-50 rounded-3xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-12 text-gray-700 text-lg">
                  <div><strong>Order ID:</strong> {order.ordered_id}</div>
                  <div><strong>Status:</strong> {order.status}</div>
                  <div><strong>Total:</strong> ₹{order.total}</div>
                  <div><strong>Order Date:</strong> {formatDate(order.order_date)}</div>
                  <div className="sm:col-span-2">
                    <strong>Shipping Address:</strong>
                    <p className="text-gray-600 mt-1 whitespace-pre-line">{order.shipping_address}</p>
                  </div>
                </div>
              </div>

              {/* Order Items List */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Items in This Order</h2>
                <div className="grid gap-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-6 border-b pb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                        <p className="text-sm text-gray-800 font-medium">
                          Subtotal: ₹{item.subtotal}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mt-8">
                <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition">
                  Open Tracking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
