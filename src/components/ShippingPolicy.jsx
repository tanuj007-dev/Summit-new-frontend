import React from 'react';
import { Link } from 'react-router-dom';

const ShippingPolicy = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between bg-white px-8 py-16">
      {/* Text Section */}
       <div className="md:w-1/2">
        <p className="text-red-600 text-lg font-semibold mb-2">Shipping Policy</p>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Clear & Simple Shipping for Your Convenience
        </h2>
        <ul className="text-gray-800 text-base list-disc pl-5 space-y-3 mb-6">
  <li>We offer <strong>Free Shipping</strong> for all our users.</li>
  <li>Shipmozo employs <strong>reputable courier service providers</strong> for all shipments.</li>
  <li>Orders are <strong>processed and shipped within 2–3 working days</strong> (unless otherwise specified at the time of order).</li>
  <li>Once shipped, products are typically <strong>delivered within 4–7 working days</strong>, depending on your location.</li>
  <li>Customers are responsible for <strong>return shipping costs</strong>. If a return is requested, the shipping amount will be deducted from the refund.</li>
  <li>Delivery time for exchanged products may vary depending on your location.</li>
  <li>For any inquiries regarding shipping or returns, feel free to contact our <strong>toll-free customer service</strong>.</li>
</ul>

        <Link to='/contact' className="bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition">
          Contact Support
        </Link>
      </div>

      {/* Image Section */}
      <div className="md:w-1/2 mt-10 md:mt-0 md:pl-10">
        <img
          src='/asset/images/shipping_policy_warehouse.png'
          alt="Shipping warehouse"
          className="rounded-lg shadow-md w-full object-cover"
        />
      </div>
    </section>
  );
};

export default ShippingPolicy;
