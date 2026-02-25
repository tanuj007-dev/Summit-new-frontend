import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTruck, FaClock, FaRulerCombined, FaClipboardCheck, FaHandHoldingHeart } from 'react-icons/fa';

const ShippingPolicy = () => {
  const [activeSection, setActiveSection] = useState('methods');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const sections = [
    { id: 'methods', title: '1. Shipping Methods' },
    { id: 'timelines', title: '2. Delivery Timelines' },
    { id: 'costs', title: '3. Shipping Costs' },
    { id: 'checklist', title: '4. Pre-Delivery Checklist' },
    { id: 'inspection', title: '5. Upon Delivery' },
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
              Shipping & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B91508] to-[#8B0F06]">Delivery</span>
            </h1>
            <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              Safe, reliable, and professional delivery for your home. We ensure your new appliances arrive exactly when and where you need them.
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

              <div id="methods" className="scroll-mt-32 relative">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#B91508] text-sm mt-1">1</span>
                  Shipping Methods
                </h3>
                <p className="leading-relaxed mb-4">
                  We offer specialized shipping options tailored to the size and weight of home appliances:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#B91508]">
                  <li><strong>Standard Curbside Delivery:</strong> The carrier will unload the item at the curb or end of your driveway. You are responsible for moving it into your home.</li>
                  <li><strong>White Glove In-Home Delivery:</strong> Our premium service where professionals bring the appliance into your room of choice, unpack it, and remove the packaging material.</li>
                  <li><strong>Local Pickup:</strong> Available for select items at our main warehouse locations.</li>
                </ul>
              </div>

              <div id="timelines" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#B91508] text-sm mt-1">2</span>
                  Delivery Timelines
                </h3>
                <p className="leading-relaxed mb-4">
                  Estimated delivery dates are provided at checkout. Typical timelines include:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#B91508]">
                  <li><strong>Order Processing:</strong> 1-2 business days to verify payment and prepare shipment.</li>
                  <li><strong>Small Accessories:</strong> 3-5 business days via standard carriers (FedEx/UPS).</li>
                  <li><strong>Large Appliances:</strong> 5-10 business days. You will receive a call to schedule a specific delivery window once the item reaches your local terminal.</li>
                </ul>
              </div>

              <div id="costs" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#B91508] text-sm mt-1">3</span>
                  Shipping Costs
                </h3>
                <p className="leading-relaxed mb-6">
                  Shipping costs are calculated based on the weight of your order and your zip code.
                </p>
                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <p className="font-bold text-gray-900 mb-2">Free Shipping Offer:</p>
                  <p className="text-sm">We offer complimentary standard curbside delivery on all appliance orders over <strong>$999</strong> within our standard service area.</p>
                </div>
              </div>

              <div id="checklist" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#B91508] text-sm mt-1">4</span>
                  Pre-Delivery Checklist
                </h3>
                <p className="leading-relaxed mb-6">
                  To ensure a smooth delivery day, please verify the following:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#B91508]">
                  <li><strong>Measure the Path:</strong> Ensure all doorways, hallways, and stairwells are wide enough for the appliance to fit through (add 1-2 inches for clearance).</li>
                  <li><strong>Clear the Way:</strong> Remove rugs, furniture, or obstacles from the delivery path to the final location.</li>
                  <li><strong>Secure Pets:</strong> Please keep pets in a separate room during the delivery for everyone's safety.</li>
                </ul>
              </div>

              <div id="inspection" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#B91508] text-sm mt-1">5</span>
                  Upon Delivery
                </h3>
                <p className="leading-relaxed">
                  Before signing the delivery receipt:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#B91508]">
                  <li>Inspect the outer packaging for any signs of damage (holes, crushed corners).</li>
                  <li>If purchasing White Glove service, fully inspect the appliance itself for dents or scratches.</li>
                  <li><strong>Note any damage</strong> directly on the driver's paperwork or refuse the shipment if the damage is severe.</li>
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

export default ShippingPolicy;
