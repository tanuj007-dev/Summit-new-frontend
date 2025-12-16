import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/myorder.php", { withCredentials: true });

        if (res.data.status === "success") {
          const orderList = res.data.orders || [];
          setOrders(orderList);

          if (orderList.length === 0) {
            setMsg("No orders found.");
          }
        } else {
          setMsg(res.data.message || "No orders found.");
        }
      } catch (error) {
        console.error("❌ Fetch Error:", error);
        setMsg("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading orders...</p>;
  if (msg)
    return <p className="text-center text-red-500 mt-10">{msg}</p>;

  return (
    <div className=" max-w-6xl mx-auto px-4 py-8 scroll">
      <h2 className="text-xl font-semibold mb-6 text-gray-700">My Orders</h2>
      <div className="max-h-[65vh] overflow-y-auto pr-2">
              {orders.map((order) => (
        <div
          key={order.order_id}
          className="bg-white shadow rounded-lg p-6 mb-8 border border-gray-200"
        >
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Order ID:</span> {order.ordered_id}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Order Date:</span>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>
            <p className="text-sm">
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`inline-block px-3 py-1 rounded-full text-white text-xs ${
                  order.status === "pending"
                    ? "bg-red-500"
                    : order.status === "delivered"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Total Price:</span>{" "}
              ₹{order.total_price}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-md p-4 shadow-sm"
              >
                {item.image_url ? (
                  <img
                     src={
                              item.image_url
                                ? `https://api.summithomeappliance.com/php_admin_panel/${item.image_url}`
                                : '/asset/images/dummy-image-square.jpg'
                            }
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                ) : (
                  <div className="h-40 bg-gray-100 flex items-center justify-center rounded-md mb-2 text-sm text-gray-400">
                    No image
                  </div>
                )}

                <h4 className="text-gray-800 font-medium">{item.name}</h4>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                <p className="text-sm text-gray-600">Price: ₹{item.price_at_purchase}</p>
                <p className="text-sm text-gray-500">
                  {item.size} | {item.material} | {item.lid_type}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Orders;
