import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFileSignature, FaCreditCard, FaTruck, FaTools, FaExclamationTriangle, FaCommentDots } from 'react-icons/fa';

const TermsConditions = () => {
  const [activeSection, setActiveSection] = useState('agreement');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const sections = [
    { id: 'agreement', title: '1. User Agreement' },
    { id: 'orders', title: '2. Orders & Payments' },
    { id: 'delivery', title: '3. Delivery & Installation' },
    { id: 'warranty', title: '4. Warranty & Returns' },
    { id: 'liability', title: '5. Limitation of Liability' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative bg-white font-sans py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 -top-40 h-[min(100vw,36rem)] w-[min(100vw,36rem)] rounded-full bg-gradient-to-br from-red-100/80 via-red-50/45 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[min(100vw,36rem)] w-[min(100vw,36rem)] rounded-full bg-gradient-to-tl from-red-100/80 via-red-50/45 to-transparent blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#941007] to-[#8B0F06]">Conditions</span>
            </h1>
            <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              Please read these terms carefully before purchasing or using our services. By transacting with Summit Home Appliances, you agree to the conditions outlined below.
            </p>
          </motion.div>
        </div>

        <div className="md:grid md:grid-cols-12 gap-8 lg:gap-12 items-start relative">

          {/* Left Column: Sticky Table of Contents */}
          <div className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-32 self-start z-20">
            <nav className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-100/50">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Contents</h4>
              <ul className="space-y-4">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`text-left text-sm font-medium transition-all duration-300 w-full flex items-center gap-3 group px-2 py-1 rounded-lg ${activeSection === section.id
                          ? 'text-[#941007] bg-red-50'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeSection === section.id ? 'bg-[#941007] scale-125' : 'bg-gray-300 group-hover:bg-gray-400'
                        }`}></span>
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right Column: Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:col-span-8 lg:col-span-9 space-y-12 text-gray-700 md:pl-4"
          >
            <motion.div variants={itemVariants} className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600">

              <div id="agreement" className="scroll-mt-32 relative">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#941007] text-sm mt-1">1</span>
                  User Agreement
                </h3>
                <p className="leading-relaxed mb-4">
                  By accessing this website and making a purchase, you acknowledge that you have read, understood, and agreed to be bound by these Terms.
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#941007]">
                  <li>You must be at least 18 years old to make a purchase.</li>
                  <li>You agree to provide accurate and current information for all orders and account registrations.</li>
                  <li>We reserve the right to refuse service or cancel orders at our sole discretion.</li>
                </ul>
              </div>

              <div id="orders" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#941007] text-sm mt-1">2</span>
                  Orders & Payments
                </h3>
                <p className="leading-relaxed mb-4">
                  We strive for accuracy, but errors in pricing or availability may occur.
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#941007]">
                  <li>Prices are subject to change without notice. The price charged will be the price in effect at the time the order is placed.</li>
                  <li>We accept major credit cards and secure online payment methods. Payment must be received in full before shipment.</li>
                  <li>In the event of a pricing error, we will notify you and you may choose to proceed at the correct price or cancel your order.</li>
                </ul>
              </div>

              <div id="delivery" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#941007] text-sm mt-1">3</span>
                  Delivery & Installation
                </h3>
                <p className="leading-relaxed mb-6">
                  Delivery schedules are estimates. We are not liable for delays due to unforeseen circumstances. Secure entry to the delivery location is the customer's responsibility.
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#941007]">
                  <li>Professional installation services must be requested at checkout.</li>
                  <li>Standard installation assumes existing connections (indestructible plumbing/wiring) are compliant with local codes.</li>
                  <li>Additional charges may apply for complex installations or difficult access (e.g., stairs, narrow doorways).</li>
                </ul>
              </div>

              <div id="warranty" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#941007] text-sm mt-1">4</span>
                  Warranty & Returns
                </h3>
                <p className="leading-relaxed mb-6">
                  Your satisfaction is our priority. Please inspect all appliances upon delivery.
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#941007]">
                  <li><strong>Returns:</strong> Items can be returned within 14 days of delivery if unused and in original packaging. A restocking fee may apply.</li>
                  <li><strong>Damages:</strong> Cosmetic damage must be reported within 48 hours of delivery.</li>
                  <li><strong>Warranty:</strong> All products come with a standard manufacturer's warranty. Extended protection plans are administered separately.</li>
                </ul>
              </div>

              <div id="liability" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#941007] text-sm mt-1">5</span>
                  Limitation of Liability
                </h3>
                <p className="leading-relaxed">
                  Summit Home Appliances shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our products or services, exceeding the purchase price of the product.
                </p>
              </div>
            </motion.div>
          </motion.div>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">Last Updated: January 2026</p>
        </div>

      </div>
    </section>
  );
};

export default TermsConditions;
