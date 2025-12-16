import React from 'react';

const PrivacyPolicy = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between bg-white px-8 py-16">
      {/* Text Section */}
      <div className="md:w-1/2">
        <p className="text-red-600 text-lg font-semibold mb-2">Privacy Policy</p>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Your Privacy Matters to Us
        </h2>

        <div className="text-gray-800 text-base space-y-4 mb-6">
          <div>
            <h3 className="font-semibold text-lg">1. Collection of Information</h3>
            <p>
              We collect personal information you provide during account creation, order placement, or while contacting support. This may include your name, email, contact number, billing/shipping address, and payment details.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">2. Use of Your Information</h3>
            <p>
              Your data is used strictly for processing orders, improving our services, and communicating with you. We do not sell or rent your personal information to third parties.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">3. Data Security</h3>
            <p>
              We implement strict security measures to protect your information, including secure servers, encrypted connections (SSL), and limited access.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">4. Cookies</h3>
            <p>
              Our site uses cookies to enhance user experience. You can choose to disable cookies through your browser settings.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">5. Third-Party Services</h3>
            <p>
              We may use third-party services (like payment gateways or analytics) that collect limited data as per their own privacy policies.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">6. Changes to This Policy</h3>
            <p>
              We reserve the right to update this policy. Changes will be posted on this page with an updated revision date.
            </p>
          </div>
        </div>

        <button className="bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition">
          Contact Us
        </button>
      </div>

      {/* Image Section */}
      <div className="md:w-1/2 mt-10 md:mt-0 md:pl-10">
        <img
          src={'/asset/images/shipping_policy_warehouse.png'}
          alt="Privacy secured warehouse"
          className="rounded-lg shadow-md w-full object-cover"
        />
      </div>
    </section>
  );
};

export default PrivacyPolicy;
