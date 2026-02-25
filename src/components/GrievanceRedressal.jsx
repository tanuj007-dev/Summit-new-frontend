import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserTie, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaFileSignature, FaClock, FaExclamationCircle, FaGavel } from 'react-icons/fa';

const GrievanceRedressal = () => {
    const [activeSection, setActiveSection] = useState('officer');

    // Handle scroll to highlight active section
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['officer', 'process', 'timeline', 'escalation', 'compliance'];
            const scrollPosition = window.scrollY + 200;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
                    setActiveSection(section);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 150,
                behavior: 'smooth'
            });
            setActiveSection(id);
        }
    };

    const sections = [
        { id: 'officer', title: '1. Grievance Officer' },
        { id: 'process', title: '2. Complaint Process' },
        { id: 'timeline', title: '3. Resolution Timeline' },
        { id: 'escalation', title: '4. Escalation Matrix' },
        { id: 'compliance', title: '5. Legal Compliance' },
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
        <section className="relative bg-white font-sans py-16 lg:py-24 overflow-hidden">
            {/* Abstract Red Background Accents for Symmetry */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-red-50/50 to-transparent -z-10"></div>
            <div className="absolute right-0 top-1/4 w-96 h-96 bg-red-100/20 rounded-full blur-3xl -z-10 translate-x-1/2"></div>
            <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-red-100/20 rounded-full blur-3xl -z-10 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Centered Header */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-block mb-4">
                            <span className="py-1 px-3 border border-[#B91508] rounded-full text-[#B91508] text-xs font-bold tracking-widest uppercase bg-white">
                                Customer Care
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                            Grievance <span className="text-[#B91508]">Redressal</span>
                        </h1>
                        <div className="w-24 h-1 bg-[#B91508] mx-auto mb-6 rounded-full"></div>
                        <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                            Committed to resolving your concerns with transparency and speed. Compliance with IT Act 2000.
                        </p>
                    </motion.div>
                </div>

                <div className="md:grid md:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* Left Column: Sticky Navigation */}
                    <div className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-32 z-20">
                        <nav className="bg-white rounded-2xl p-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                            <ul className="space-y-1">
                                {sections.map((section) => (
                                    <li key={section.id}>
                                        <button
                                            onClick={() => scrollToSection(section.id)}
                                            className={`text-left text-sm font-medium transition-all duration-300 w-full flex items-center justify-between px-4 py-3 rounded-xl border ${activeSection === section.id
                                                    ? 'bg-[#B91508] text-white border-[#B91508] shadow-md transform scale-105'
                                                    : 'text-gray-500 bg-white border-transparent hover:bg-gray-50 hover:text-[#B91508]'
                                                }`}
                                        >
                                            <span>{section.title}</span>
                                            {activeSection === section.id && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Right Column: Symmetrical Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="md:col-span-8 lg:col-span-9 space-y-16"
                    >
                        {/* 1. Grievance Officer */}
                        <motion.div variants={itemVariants} id="officer" className="scroll-mt-32">
                            <div className="relative bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(185,21,8,0.06)] border border-red-50 text-center mx-auto overflow-hidden group hover:shadow-[0_8px_40px_rgba(185,21,8,0.1)] transition-shadow duration-300">
                                <div className="absolute top-0 left-0 w-full h-2 bg-[#B91508]"></div>

                                <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center text-[#B91508] text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <FaUserTie />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-1">Mr. Amit Verma</h3>
                                <p className="text-[#B91508] font-medium tracking-wider text-sm uppercase mb-8">Chief Grievance Officer</p>

                                <div className="grid md:grid-cols-2 gap-4 text-left">
                                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#B91508] transition-colors bg-gray-50/50">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#B91508] shadow-sm"><FaEnvelope /></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-400 font-bold uppercase">Email Us</p>
                                            <a href="mailto:grievance@summithomeappliance.com" className="text-sm font-semibold text-gray-900 truncate block hover:text-[#B91508]">grievance@summithomeappliance.com</a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#B91508] transition-colors bg-gray-50/50">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#B91508] shadow-sm"><FaPhoneAlt /></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-400 font-bold uppercase">Call Us</p>
                                            <a href="tel:+919876543210" className="text-sm font-semibold text-gray-900 block hover:text-[#B91508]">+91 98765 43210</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#B91508] transition-colors bg-gray-50/50 text-left">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#B91508] shadow-sm flex-shrink-0"><FaMapMarkerAlt /></div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Postal Address</p>
                                        <p className="text-sm font-semibold text-gray-900">Summit Home Appliances HQ, Sector 62, Noida, Uttar Pradesh, India - 201301</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. Process */}
                        <motion.div variants={itemVariants} id="process" className="scroll-mt-32">
                            <div className="flex items-end gap-4 mb-8 border-b-2 border-dashed border-gray-100 pb-4">
                                <span className="text-6xl font-serif text-gray-100 font-bold -mb-2">02</span>
                                <h3 className="text-3xl font-serif font-bold text-gray-900">Filing A Complaint</h3>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    { step: 1, title: 'Write Email', text: 'Draft an email to the Grievance Officer.' },
                                    { step: 2, title: 'Add Details', text: 'Include Order ID, Incident Date, and Evidence.' },
                                    { step: 3, title: 'Wait for Ack', text: 'Receive acknowledgement within 48 hours.' }
                                ].map((item) => (
                                    <div key={item.step} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-red-100 text-center transition-all">
                                        <div className="w-12 h-12 bg-[#B91508] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg shadow-red-500/30">
                                            {item.step}
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                                        <p className="text-sm text-gray-500">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* 3. Timeline */}
                        <motion.div variants={itemVariants} id="timeline" className="scroll-mt-32">
                            <div className="flex items-end gap-4 mb-8 border-b-2 border-dashed border-gray-100 pb-4">
                                <span className="text-6xl font-serif text-gray-100 font-bold -mb-2">03</span>
                                <h3 className="text-3xl font-serif font-bold text-gray-900">Resolution Timeline</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#B91508] transition-colors relative overflow-hidden">
                                    <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                    <FaClock className="text-4xl text-[#B91508] mb-4 relative z-10" />
                                    <h4 className="text-xl font-bold text-gray-900 mb-2 relative z-10">Acknowledgement</h4>
                                    <p className="text-gray-600 relative z-10">Within <span className="text-[#B91508] font-bold">48 Hours</span> of receiving the complaint.</p>
                                </div>

                                <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#B91508] transition-colors relative overflow-hidden">
                                    <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                    <FaFileSignature className="text-4xl text-[#B91508] mb-4 relative z-10" />
                                    <h4 className="text-xl font-bold text-gray-900 mb-2 relative z-10">Final Resolution</h4>
                                    <p className="text-gray-600 relative z-10">Within <span className="text-[#B91508] font-bold">1 Month</span> (30 Days) from receipt.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* 4. Escalation */}
                        <motion.div variants={itemVariants} id="escalation" className="scroll-mt-32">
                            <div className="flex items-end gap-4 mb-8 border-b-2 border-dashed border-gray-100 pb-4">
                                <span className="text-6xl font-serif text-gray-100 font-bold -mb-2">04</span>
                                <h3 className="text-3xl font-serif font-bold text-gray-900">Escalation Matrix</h3>
                            </div>

                            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                                <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                                    {/* Level 1 */}
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-white border-2 border-gray-200 text-gray-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">1</div>
                                        <h5 className="font-bold text-gray-900">Customer Support</h5>
                                        <p className="text-xs text-gray-500 mt-1">support@summit.com</p>
                                    </div>

                                    <div className="hidden md:block w-24 h-0.5 bg-gray-300 relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                                    </div>

                                    {/* Level 2 */}
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-[#B91508] text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-red-500/40">2</div>
                                        <h5 className="font-bold text-[#B91508]">Grievance Officer</h5>
                                        <p className="text-xs text-gray-500 mt-1">(Final Authority)</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 5. Compliance */}
                        <motion.div variants={itemVariants} id="compliance" className="scroll-mt-32">
                            <div className="bg-[#B91508] rounded-2xl p-6 text-white text-center shadow-xl shadow-red-900/10">
                                <FaGavel className="mx-auto text-3xl mb-3 opacity-80" />
                                <p className="font-medium opacity-90">compliance with Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</p>
                            </div>
                        </motion.div>

                    </motion.div>

                </div>

                <div className="mt-20 pt-8 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-400">Last Updated: January 2026</p>
                </div>

            </div>
        </section>
    );
};

export default GrievanceRedressal;
