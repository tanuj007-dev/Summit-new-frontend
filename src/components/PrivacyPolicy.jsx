import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUserLock, FaFileContract, FaCookieBite, FaServer, FaGlobeAmericas, FaEnvelopeOpenText, FaUserShield } from 'react-icons/fa';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('collection');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const sections = [
    { id: 'collection', title: '1. Information We Collect' },
    { id: 'usage', title: '2. How We Use Data' },
    { id: 'sharing', title: '3. Sharing Information' },
    { id: 'smart-data', title: '4. Smart Appliance Data' },
    { id: 'contact', title: '5. Contact Us' },
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
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B91508] to-[#8B0F06]">Policy</span>
            </h1>
            <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              At Summit Home Appliances, we value the trust you place in us when inviting our products into your home. This policy outlines how we handle your data with the same care we put into our appliances.
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

              <div id="collection" className="scroll-mt-32 relative">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#B91508] text-sm mt-1">1</span>
                  Information We Collect
                </h3>
                <p className="leading-relaxed mb-4">
                  To provide you with the best home appliance solutions, we collect information such as:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#B91508]">
                  <li><strong>Personal Details:</strong> Name, address, and contact number for delivery and installation scheduling.</li>
                  <li><strong>Product Preferences:</strong> Information about the appliances you browse or purchase to recommend compatible accessories or upgrades.</li>
                  <li><strong>Service History:</strong> Records of maintenance, warranty claims, or repairs to ensure your appliances run smoothly for years.</li>
                </ul>
              </div>

              <div id="usage" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#B91508] text-sm mt-1">2</span>
                  How We Use Your Information
                </h3>
                <p className="leading-relaxed mb-4">
                  Your data allows us to enhance your home living experience by:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#B91508]">
                  <li>Processing orders and coordinating precise delivery windows for heavy appliances.</li>
                  <li>Activating warranties and scheduling authorized service technicians if repairs are needed.</li>
                  <li>Notifying you about product safety recalls or firmware updates for smart appliances.</li>
                </ul>
              </div>

              <div id="sharing" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#B91508] text-sm mt-1">3</span>
                  Sharing of Information
                </h3>
                <p className="leading-relaxed mb-6">
                  We do not sell your personal data. We only share necessary information with trusted partners, such as logistics companies for delivery and authorized technicians for installation and repair services, strictly to fulfill your requests.
                </p>
              </div>

              <div id="smart-data" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#B91508] text-sm mt-1">4</span>
                  Smart Appliance Data
                </h3>
                <p className="leading-relaxed mb-6">
                  For our smart/connected appliances, we may collect usage data (e.g., energy consumption, cycle frequency) to help you optimize performance and energy efficiency. You can control this data sharing through the respective appliance's mobile app settings.
                </p>
              </div>

              <div id="contact" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#B91508] text-sm mt-1">5</span>
                  Contact Us
                </h3>
                <p className="leading-relaxed">
                  If you have questions about your warranty data, installation privacy, or our general practices, please reach out to our team. We are here to ensure your kitchen and home remain your private sanctuary.
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

export default PrivacyPolicy;
