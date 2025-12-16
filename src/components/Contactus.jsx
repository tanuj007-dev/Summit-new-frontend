import React from 'react'

export const Contactus = () => {
 const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here (API, EmailJS, etc.)
    console.log("Form submitted");
  };

  return (
    <section className="bg-white py-24 px-6 sm:px-10 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-red-700 mb-4">Contact us</h2>
          <p className="text-gray-600">
            We'd love to hear from you! Whether you have a question about our pressure cookers or just want to say hello.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-red-500 focus:border-red-500"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Tell us how we can help..."
                required
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-md transition duration-300"
              >
                Send Message
              </button>
            </div>
          </form>

          {/* Contact Info */}
          <div className="bg-red-50 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-red-700 mb-4">Reach Us</h3>
            <p className="text-gray-700 mb-6">
              Need help with our cookers, services, or orders? Reach out to us anytime!
            </p>
            <div className="space-y-4 text-gray-800">
              <p>📍 Address: B-36 Krishna Vihar Loni
Ghaziabad-201102 UP
(INDIA)</p>
              <p>📞 Phone: 1800 419 6048</p>
              <p>✉️ Email: customercare@summithomeappliance.com</p>
              <p>⏰ Hours:Mon–Fri, 9AM–6PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
