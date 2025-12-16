import React from 'react';

const RefundPolicy = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between bg-white px-8 py-16">
      {/* Text Section */}
      <div className="md:w-1/2">
        <p className="text-red-600 text-lg font-semibold mb-2">Refund Policy</p>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Easy Returns and Hassle-Free Refunds
        </h2>

        <div className="text-gray-800 text-base space-y-4 mb-6">
          <div>
            <h3 className="font-semibold text-lg">Who Is Eligible for a Refund?</h3>
            <p>
              Our refund policy spans <strong>15 days</strong>. Unfortunately, we cannot offer you a refund or exchange after this period.
              To qualify for a return, your item must be <strong>unused</strong>, in the <strong>same condition</strong> you received it,
              and in its <strong>original packaging</strong>.
              A <strong>receipt or proof of purchase</strong> is required for all returns.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">When Is a Refund Available?</h3>
            <p>
              Once your return is received and inspected, we will notify you via email about the status of your refund.
              If approved, Refunds will be credited to your original payment method within 30 days after the return is processed.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">How to Exchange Products?</h3>
            <p>
              We only replace items if they are <strong>defective</strong> or <strong>damaged</strong>. To exchange an item for the same one,
              please email us at <a href="mailto:retail@thejoe.in" className="text-blue-600 hover:underline">retail@thejoe.in</a> or submit the request through <strong>"My Account"</strong>.
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>The product was not customized after purchase.</li>
              <li>The product remains undamaged.</li>
              <li><strong>Exchange Delivery:</strong> If you opt for an exchange, the replacement product will be delivered within 7 days of receiving the returned item.</li>

              <li>The product is returned in its original packaging.</li>
              <li>Subject to company norms and policies.</li>
            </ul>
          </div>

          {/* Newly Added Section */}
          <div>
            <h3 className="font-semibold text-lg">Additional Information</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Return Processing:</strong> Returns will be processed within 15 days of receiving the returned item.</li>
             
            </ul>
          </div>
        </div>

        <button className="bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition">
          Contact Support
        </button>
      </div>

      {/* Image Section */}
      <div className="md:w-1/2 mt-10 md:mt-0 md:pl-10">
        <img
          src={'/asset/images/shipping_policy_warehouse.png'}
          alt="Warehouse"
          className="rounded-lg shadow-md w-full object-cover"
        />
      </div>
    </section>
  );
};

export default RefundPolicy;
