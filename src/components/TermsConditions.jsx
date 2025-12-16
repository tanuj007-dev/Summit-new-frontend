import React from 'react';

const TermsConditions = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between bg-white px-8 py-16">
      {/* Text Section */}
      <div className="md:w-1/2">
        <p className="text-red-600 text-lg font-semibold mb-2">Terms & Conditions</p>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Understand Our Terms of Use
        </h2>

        <div className="text-gray-800 text-base space-y-4 mb-6">
          <div>
            <h3 className="font-semibold text-lg">1. Acceptance of Terms</h3>
            <p>
              By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of the terms, you must not use our services.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">2. User Responsibilities</h3>
            <p>
              Users must provide accurate and current information during registration and purchases. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">3. Product Information</h3>
            <p>
              We make every effort to display accurate product details. However, we do not guarantee that product descriptions or pricing are always accurate, complete, or error-free.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">4. Order Cancellation</h3>
            <p>
              We reserve the right to cancel or refuse any order at our sole discretion. You will be notified and refunded promptly in such cases.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">5. Intellectual Property</h3>
            <p>
              All content on this website, including text, graphics, logos, and software, is the property of our company and protected by copyright laws.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">6. Limitation of Liability</h3>
            <p>
              We shall not be liable for any indirect, incidental, or consequential damages resulting from your use or inability to use the services or products.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">7. Changes to Terms</h3>
            <p>
              We may revise these Terms & Conditions at any time. Continued use of our website after such changes constitutes acceptance of the revised terms.
            </p>
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
          alt="Terms and Conditions"
          className="rounded-lg shadow-md w-full object-cover"
        />
      </div>
    </section>
  );
};

export default TermsConditions;
