import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUndo, FaBoxOpen, FaTruckLoading, FaMoneyBillWave, FaExclamationCircle } from 'react-icons/fa';

const RefundPolicy = () => {
  const [activeSection, setActiveSection] = useState('eligibility');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const sections = [
    { id: 'eligibility', title: '1. Return Eligibility' },
    { id: 'damaged', title: '2. Damaged & Defective' },
    { id: 'fees', title: '3. Restocking & Shipping' },
    { id: 'process', title: '4. Refund Process' },
    { id: 'exceptions', title: '5. Non-Returnable Items' },
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
    <section className="relative bg-[#FAFAFA] font-sans py-16 lg:py-24">
      {/* Background Wrapper - Handles overflow for decorations only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        {/* Decorative Gradient Overlay */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-red-50/50 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-gray-100 to-transparent rounded-full blur-3xl -z-10"></div>
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
              Refund & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B91508] to-[#8B0F06]">Return Policy</span>
            </h1>
            <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              We want you to love your new appliances. If something isn't right, we're here to help make it right with transparent and fair return policies.
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
                          ? 'text-[#B91508] bg-red-50'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeSection === section.id ? 'bg-[#B91508] scale-125' : 'bg-gray-300 group-hover:bg-gray-400'
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

              <div id="eligibility" className="scroll-mt-32 relative">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#B91508] text-sm mt-1">1</span>
                  Return Eligibility
                </h3>
                <p className="leading-relaxed mb-4">
                  You may return most major appliances and accessories within <strong>14 days of delivery</strong>. To be eligible for a full refund:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#B91508]">
                  <li>Items must be in new, unused condition.</li>
                  <li>All original packaging, manuals, accessories, and warranty cards must be included and intact.</li>
                  <li>The product must not have been installed or connected to utilities (water, gas, electric).</li>
                </ul>
              </div>

              <div id="damaged" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#B91508] text-sm mt-1">2</span>
                  Damaged & Defective Items
                </h3>
                <p className="leading-relaxed mb-4">
                  Please inspect your appliances immediately upon delivery <strong>while the driver is present</strong>.
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#B91508]">
                  <li><strong>Shipping Damage:</strong> If you see visible carton damage, note it on the bill of lading or refuse the delivery.</li>
                  <li><strong>Concealed Damage:</strong> If you find damage after unpacking, you must report it to us within <strong>48 hours</strong> of delivery. Claims made after this window may be denied.</li>
                  <li><strong>Functional Defects:</strong> If an item is defective out of the box, we will arrange for a certified technician to inspect and repair or exchange the unit at no cost to you.</li>
                </ul>
              </div>

              <div id="fees" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#B91508] text-sm mt-1">3</span>
                  Restocking & Shipping Fees
                </h3>
                <p className="leading-relaxed mb-6">
                  If you return a non-defective item simply because you changed your mind or measured incorrectly:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#B91508]">
                  <li>A <strong>15% restocking fee</strong> may apply to unboxed items.</li>
                  <li>You are responsible for return shipping costs. We can arrange pickup for a fee deducted from your refund.</li>
                  <li>Original shipping charges are non-refundable.</li>
                </ul>
              </div>

              <div id="process" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#B91508] text-sm mt-1">4</span>
                  Refund Process
                </h3>
                <p className="leading-relaxed mb-6">
                  Once your return is received and inspected at our warehouse (usually within 3-5 business days of pickup), we will initiate your refund.
                </p>
                <p className="leading-relaxed mb-6">
                  Refunds are issued to the original method of payment. Please allow 5-10 business days for your bank to process the credit and for it to appear on your statement.
                </p>
              </div>

              <div id="exceptions" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#B91508] text-sm mt-1">5</span>
                  Non-Returnable Items
                </h3>
                <p className="leading-relaxed">
                  The following items cannot be returned:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#B91508]">
                  <li>Special order or custom-panel appliances.</li>
                  <li>Installed parts (e.g., water filters, hoses) unless defective.</li>
                  <li>Clearance, "Open Box," or "As-Is" items (these sales are final).</li>
                </ul>
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

export default RefundPolicy;
