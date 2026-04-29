import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ShippingPolicy = () => {
  const [activeSection, setActiveSection] = useState('free-shipping');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const sections = [
    { id: 'free-shipping', title: '1. Free Shipping' },
    { id: 'couriers', title: '2. Courier Partners' },
    { id: 'dispatch', title: '3. Dispatch & Delivery' },
    { id: 'return-shipping', title: '4. Return Shipping' },
    { id: 'exchanges', title: '5. Exchanges' },
    { id: 'support', title: '6. Customer Support' },
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
              Shipping <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#941007] to-[#8B0F06]">Policy</span>
            </h1>
            <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              How we ship your orders, who carries them, and what to expect for returns and exchanges.
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

              <div id="free-shipping" className="scroll-mt-32 relative">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#941007] text-sm mt-1">1</span>
                  Free Shipping
                </h3>
                <p className="leading-relaxed mb-6">
                  We offer free shipping for all our users.
                </p>
              </div>

              <div id="couriers" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#941007] text-sm mt-1">2</span>
                  Courier partners
                </h3>
                <p className="leading-relaxed mb-6">
                  Shipmozo employs reputable courier service providers for shipping our products.
                </p>
              </div>

              <div id="dispatch" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#941007] text-sm mt-1">3</span>
                  Dispatch &amp; delivery time
                </h3>
                <p className="leading-relaxed mb-6">
                  Unless otherwise specified during order placement, our products are typically shipped within 4–7 working days.
                </p>
              </div>

              <div id="return-shipping" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#941007] text-sm mt-1">4</span>
                  Return shipping
                </h3>
                <p className="leading-relaxed mb-6">
                  Customers are responsible for covering shipping costs when returning products. If a return is requested, the amount for return shipping will be deducted from your refund.
                </p>
              </div>

              <div id="exchanges" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#941007] text-sm mt-1">5</span>
                  Exchanges
                </h3>
                <p className="leading-relaxed mb-6">
                  Please note that the time taken for exchanged products to reach you may vary depending on your location.
                </p>
              </div>

              <div id="support" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#941007] text-sm mt-1">6</span>
                  Customer support
                </h3>
                <p className="leading-relaxed mb-6">
                  Feel free to reach out to our toll-free customer service team for any further inquiries regarding shipping or returns.
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

export default ShippingPolicy;
