import React, { useState } from 'react';
import { motion } from 'framer-motion';

const REFUND_CONTACT_EMAIL = 'customercare@summithomeappliance.com';

const RefundPolicy = () => {
  const [activeSection, setActiveSection] = useState('eligible');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const sections = [
    { id: 'eligible', title: '1. Who Is Eligible?' },
    { id: 'when-refund', title: '2. When Refund Applies' },
    { id: 'exchange', title: '3. How to Exchange' },
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
              Refund <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#941007] to-[#8B0F06]">Policy</span>
            </h1>
            <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              Returns, refunds, and exchanges for Summit Home Appliances—who qualifies, how refunds work, and how to request an exchange.
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

              <div id="eligible" className="scroll-mt-32 relative">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#941007] text-sm mt-1">1</span>
                  Who Is Eligible for a Refund?
                </h3>
                <p className="leading-relaxed mb-4">
                  Our refund policy spans <strong>15 days</strong>. Unfortunately, we cannot offer you a refund or exchange after this period. To qualify for a return, your item must be unused and in the same condition in which you received it. Additionally, it must remain in its original packaging.
                </p>
                <p className="leading-relaxed mb-6">
                  To complete your return, we require a receipt or proof of purchase.
                </p>
              </div>

              <div id="when-refund" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#941007] text-sm mt-1">2</span>
                  When Is a Refund Available?
                </h3>
                <p className="leading-relaxed mb-4">
                  Upon receiving and inspecting your return, we will send you an email to confirm the receipt of your returned item. You will also be informed of whether your refund has been approved or rejected.
                </p>
                <p className="leading-relaxed mb-6">
                  If your return is approved, the refund will be processed, and a credit will automatically be applied to your credit card or original method of payment within a certain number of days.
                </p>
              </div>

              <div id="exchange" className="scroll-mt-32 pt-12 border-t border-dashed border-gray-200">
                <h3 className="text-2xl font-bold mb-4 mt-8 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-[#941007] text-sm mt-1">3</span>
                  How to Exchange Products?
                </h3>
                <p className="leading-relaxed mb-4">
                  We only replace items if they are defective or damaged. If you need to exchange an item for the same one, please email us at{' '}
                  <a href={`mailto:${REFUND_CONTACT_EMAIL}`} className="font-semibold text-[#941007] hover:underline">
                    {REFUND_CONTACT_EMAIL}
                  </a>
                  {' '}or submit the request through <strong>My Account</strong>.
                </p>
                <p className="leading-relaxed mb-4">
                  Product replacement will only be facilitated under the following conditions:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-[#941007]">
                  <li>The product was not customized after purchase.</li>
                  <li>The product remains undamaged.</li>
                  <li>Replacement requests are submitted on or before <strong>7 days</strong> after receiving the product delivery.</li>
                  <li>Replacements are accepted only when the product is returned in its original packaging.</li>
                  <li>Subject to company norms.</li>
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
