import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserTie, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaFileSignature, FaClock, FaExclamationCircle, FaGavel, FaWhatsapp } from 'react-icons/fa';

const GrievanceRedressal = () => {
    const [activeSection, setActiveSection] = useState('officer');

    // Handle scroll to highlight active section
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['officer', 'process', 'timeline', 'escalation', 'grievance_officer', 'compliance'];
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
        { id: 'officer', title: '1. Customer Care' },
        { id: 'process', title: '2. Complaint Process' },
        { id: 'timeline', title: '3. Resolution Timeline' },
        { id: 'escalation', title: '4. Escalation Matrix' },
        { id: 'grievance_officer', title: '5. Grievance Officer' },
        { id: 'compliance', title: '6. Legal Compliance' },
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

                {/* Centered Header */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-block mb-4">
                            <span className="py-1 px-3 border border-[#941007] rounded-full text-[#941007] text-xs font-bold tracking-widest uppercase bg-white">
                                Customer Care
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                        Grievance Redressal Policy
                        </h1>
                        <div className="w-24 h-1 bg-[#941007] mx-auto mb-6 rounded-full"></div>
                        <p className="text-lg text-gray-600 font-light leading-relaxed max-w-7xl mx-auto">
                            At Summit Home Appliances, we are committed to providing high-quality kitchen appliances and exceptional service. We value
                            your feedback and aim to resolve any concerns promptly and fairly. If you are dissatisfied with your purchase or the service
                            you have received, please follow the process outlined below to ensure your grievance is addressed efficiently.
                        </p>
                    </motion.div>
                </div>

                <div className="md:grid md:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* Left Column: Sticky Navigation */}
                    <div className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-32 z-20 self-start">
                        <nav className="bg-white rounded-2xl p-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                            <ul className="space-y-1">
                                {sections.map((section) => (
                                    <li key={section.id}>
                                        <button
                                            onClick={() => scrollToSection(section.id)}
                                            className={`text-left text-sm font-medium transition-all duration-300 w-full flex items-center justify-between px-4 py-3 rounded-xl border ${activeSection === section.id
                                                    ? 'bg-[#941007] text-white border-[#941007] shadow-md transform scale-105'
                                                    : 'text-gray-500 bg-white border-transparent hover:bg-gray-50 hover:text-[#941007]'
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
                            <header className="relative isolate mb-8 border-b border-dashed border-gray-200 pb-5">
                                <div className="relative flex min-h-[4.25rem] items-center sm:min-h-[5.25rem]">
                                    <span
                                        className="pointer-events-none absolute left-0 select-none font-sans text-7xl font-bold leading-none tracking-tight text-[#ECECEC] sm:text-8xl"
                                        aria-hidden="true"
                                    >
                                        01
                                    </span>
                                    <h3 className="relative z-10 pl-[5.5rem] font-serif text-2xl font-bold leading-tight tracking-tight text-gray-950 sm:pl-32 sm:text-3xl md:text-[2rem]">
                                        Reach Out to Customer Care
                                    </h3>
                                </div>
                            </header>

                            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(148,16,7,0.06)] border border-red-50 relative group hover:shadow-[0_8px_40px_rgba(148,16,7,0.1)] transition-shadow duration-300 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-[#941007]"></div>
                                <div className="text-left">
                                    <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                                        Most issues regarding lid tightness, steam leakage, or general product queries can be resolved by our primary
                                        support team. Before escalating, please contact us:
                                    </p>
                                    <ul className="mt-6 space-y-4">
                                        <li className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:border-[#941007]">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#941007] shadow-sm">
                                                <FaEnvelope />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold uppercase text-gray-400">Email</p>
                                                <a
                                                    href="mailto:customercare@summithomeappliance.com"
                                                    className="mt-0.5 block text-sm font-semibold text-gray-900 hover:text-[#941007] sm:text-base break-all"
                                                >
                                                    customercare@ <br /> summithomeappliance.com
                                                </a>
                                            </div>
                                        </li>
                                        <li className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:border-[#941007]">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#941007] shadow-sm">
                                                <FaPhoneAlt />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold uppercase text-gray-400">Customer care helpline</p>
                                                <a href="tel:18004196048" className="mt-0.5 block text-sm font-semibold text-gray-900 hover:text-[#941007] sm:text-base">
                                                    1800 419 6048
                                                </a>
                                                <p className="mt-1 text-xs text-gray-500">Mon–Sat, 10:00 AM – 6:00 PM</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:border-[#941007]">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#941007] shadow-sm">
                                                <FaWhatsapp />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold uppercase text-gray-400">WhatsApp support</p>
                                                <a
                                                    href="https://wa.me/919990555161"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-0.5 block text-sm font-semibold text-gray-900 hover:text-[#941007] sm:text-base"
                                                >
                                                    +91 9990555161
                                                </a>
                                            </div>
                                        </li>
                                    </ul>
                                    <p className="mt-6 text-sm leading-relaxed text-gray-600 sm:text-base">
                                        Please include your <strong className="font-semibold text-gray-900">Order ID</strong>,{" "}
                                        <strong className="font-semibold text-gray-900">Product Model</strong> (e.g., Tri-Ply Pressure Cooker 3L), and
                                        a brief description of the issue (with photos or videos if applicable) to help us expedite your request.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. Complaint Process */}
                        <motion.div variants={itemVariants} id="process" className="scroll-mt-32">
                            <header className="relative isolate mb-8 border-b border-dashed border-gray-200 pb-5">
                                <div className="relative flex min-h-[4.25rem] items-center sm:min-h-[5.25rem]">
                                    <span
                                        className="pointer-events-none absolute left-0 select-none font-sans text-7xl font-bold leading-none tracking-tight text-[#ECECEC] sm:text-8xl"
                                        aria-hidden="true"
                                    >
                                        02
                                    </span>
                                    <h3 className="relative z-10 pl-[5.5rem] font-serif text-2xl font-bold leading-tight tracking-tight text-gray-950 sm:pl-32 sm:text-3xl md:text-4xl">
                                        Filing A Complaint
                                    </h3>
                                </div>
                            </header>

                            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(148,16,7,0.06)] border border-red-50 relative group hover:shadow-[0_8px_40px_rgba(148,16,7,0.1)] transition-shadow duration-300 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-[#941007]"></div>
                                <div className="text-left">

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                        {[
                                            { step: 1, title: "Write Email", text: "Draft an email to the Grievance Officer." },
                                            { step: 2, title: "Add Details", text: "Include Order ID, Incident Date, and Evidence." },
                                            { step: 3, title: "Wait for Ack", text: "Receive acknowledgement within 48 hours." },
                                        ].map((item) => (
                                            <div
                                                key={item.step}
                                                className="rounded-2xl border border-gray-100 bg-white p-6 text-center transition-all hover:border-red-100 hover:shadow-lg"
                                            >
                                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#941007] text-xl font-bold text-white shadow-lg shadow-[#941007]/30">
                                                    {item.step}
                                                </div>
                                                <h4 className="mb-2 font-bold text-gray-900">{item.title}</h4>
                                                <p className="text-sm text-gray-500">{item.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <h4 className="mt-8 text-base font-bold text-gray-900 sm:text-lg">Information to provide</h4>
                                    <p className="mt-2 text-sm text-gray-600 sm:text-base">
                                        To ensure we can investigate your issue thoroughly, please include the following in your email:
                                    </p>
                                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600 marker:text-[#941007] sm:text-base">
                                        <li>
                                            <strong className="font-semibold text-gray-900">Contact information:</strong> Name and phone number.
                                        </li>
                                        <li>
                                            <strong className="font-semibold text-gray-900">Purchase details:</strong> Invoice copy, date of purchase,
                                            and the platform (e.g., Summit website, Flipkart, Amazon, or dealer name).
                                        </li>
                                        <li>
                                            <strong className="font-semibold text-gray-900">Product details:</strong> Model name and a description of
                                            the defect (e.g., issues with the base or lid assembly).
                                        </li>
                                        <li>
                                            <strong className="font-semibold text-gray-900">Previous correspondence:</strong> Attach any previous ticket
                                            numbers or email threads with our customer care team.
                                        </li>
                                    </ul>
                                    <h4 className="mt-8 text-base font-bold text-gray-900 sm:text-lg">Our commitment</h4>
                                    <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
                                        We take every piece of feedback seriously. Whether it is a manufacturing query regarding our tri-ply range or a
                                        logistics concern, we are constantly improving our processes to ensure your experience with Summit
                                        products is seamless.
                                    </p>
                                    <p className="mt-6 rounded-lg border-l-4 border-[#941007] bg-red-50/60 px-4 py-3 text-sm text-gray-700 sm:text-base">
                                        <strong className="font-semibold text-gray-900">Note:</strong> For issues related to BIS certification or technical
                                        safety compliance, please specifically mention{" "}
                                        <span className="font-mono text-[13px] font-semibold text-gray-900">&quot;Technical/Safety Inquiry&quot;</span> in
                                        the subject line for priority handling.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* 3. Timeline */}
                        <motion.div variants={itemVariants} id="timeline" className="scroll-mt-32">
                            <header className="relative isolate mb-8 border-b border-dashed border-gray-200 pb-5">
                                <div className="relative flex min-h-[4.25rem] items-center sm:min-h-[5.25rem]">
                                    <span
                                        className="pointer-events-none absolute left-0 select-none font-sans text-7xl font-bold leading-none tracking-tight text-[#ECECEC] sm:text-8xl"
                                        aria-hidden="true"
                                    >
                                        03
                                    </span>
                                    <h3 className="relative z-10 pl-[5.5rem] font-serif text-2xl font-bold leading-tight tracking-tight text-gray-950 sm:pl-32 sm:text-3xl md:text-4xl">
                                        Resolution Timeline
                                    </h3>
                                </div>
                            </header>

                            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(148,16,7,0.06)] border border-red-50 relative group hover:shadow-[0_8px_40px_rgba(148,16,7,0.1)] transition-shadow duration-300 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-[#941007]"></div>
                                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                                    <div className="group/item bg-gray-50/50 rounded-2xl p-8 border border-gray-100 hover:border-[#941007] transition-colors relative overflow-hidden">
                                        <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover/item:scale-110"></div>
                                        <FaClock className="text-4xl text-[#941007] mb-4 relative z-10" />
                                        <h4 className="text-xl font-bold text-gray-900 mb-2 relative z-10">Acknowledgement</h4>
                                        <p className="text-gray-600 relative z-10">Within <span className="text-[#941007] font-bold">72 Hours</span> of receiving the complaint.</p>
                                    </div>

                                    <div className="group/item bg-gray-50/50 rounded-2xl p-8 border border-gray-100 hover:border-[#941007] transition-colors relative overflow-hidden">
                                        <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover/item:scale-110"></div>
                                        <FaFileSignature className="text-4xl text-[#941007] mb-4 relative z-10" />
                                        <h4 className="text-xl font-bold text-gray-900 mb-2 relative z-10">Final Resolution</h4>
                                        <p className="text-gray-600 relative z-10">Within <span className="text-[#941007] font-bold">1 Month</span> (30 Days) from receipt.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 4. Escalation */}
                        <motion.div variants={itemVariants} id="escalation" className="scroll-mt-32">
                            <header className="relative isolate mb-8 border-b border-dashed border-gray-200 pb-5">
                                <div className="relative flex min-h-[4.25rem] items-center sm:min-h-[5.25rem]">
                                    <span
                                        className="pointer-events-none absolute left-0 select-none font-sans text-7xl font-bold leading-none tracking-tight text-[#ECECEC] sm:text-8xl"
                                        aria-hidden="true"
                                    >
                                        04
                                    </span>
                                    <h3 className="relative z-10 pl-[5.5rem] font-serif text-2xl font-bold leading-tight tracking-tight text-gray-950 sm:pl-32 sm:text-3xl md:text-4xl">
                                        Escalation Matrix
                                    </h3>
                                </div>
                            </header>

                            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(148,16,7,0.06)] border border-red-50 relative group hover:shadow-[0_8px_40px_rgba(148,16,7,0.1)] transition-shadow duration-300 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-[#941007]"></div>
                                <div className="flex flex-col md:flex-row gap-8 items-center justify-center relative z-10 py-6">
                                    {/* Level 1 */}
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gray-50 border-2 border-gray-200 text-gray-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">1</div>
                                        <h5 className="font-bold text-gray-900">Customer Support</h5>
                                        <p className="text-xs text-gray-500 mt-1 break-all">customercare@  <br /> summithomeappliance.com</p>
                                    </div>

                                    <div className="hidden md:block w-24 h-0.5 bg-gray-300 relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                                    </div>

                                    {/* Level 2 */}
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-[#941007] text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-[#941007]/40">2</div>
                                        <h5 className="font-bold text-[#941007]">Grievance Officer</h5>
                                        <p className="text-xs text-gray-500 mt-1">(Final Authority)</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 5. Grievance Officer */}
                        <motion.div variants={itemVariants} id="grievance_officer" className="scroll-mt-32">
                            <header className="relative isolate mb-8 border-b border-dashed border-gray-200 pb-5">
                                <div className="relative flex min-h-[4.25rem] items-center sm:min-h-[5.25rem]">
                                    <span
                                        className="pointer-events-none absolute left-0 select-none font-sans text-7xl font-bold leading-none tracking-tight text-[#ECECEC] sm:text-8xl"
                                        aria-hidden="true"
                                    >
                                        05
                                    </span>
                                    <h3 className="relative z-10 pl-[5.5rem] font-serif text-2xl font-bold leading-tight tracking-tight text-gray-950 sm:pl-32 sm:text-3xl md:text-4xl">
                                        Grievance Officer
                                    </h3>
                                </div>
                            </header>

                            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(148,16,7,0.06)] border border-red-50 relative group hover:shadow-[0_8px_40px_rgba(148,16,7,0.1)] transition-shadow duration-300 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-[#941007]"></div>
                                <div className="border-b border-gray-100 pb-10 text-center">
                                    <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center text-[#941007] text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <FaUserTie />
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Mr. Ashish Kumar</h3>
                                    <p className="text-[#941007] font-medium tracking-wider text-sm uppercase mb-8">Chief Grievance Officer</p>

                                    <div className="grid md:grid-cols-2 gap-4 text-left">
                                        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#941007] transition-colors bg-gray-50/50">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#941007] shadow-sm"><FaEnvelope /></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-400 font-bold uppercase">Email Us</p>
                                                <a href="mailto:customercare@summithomeappliance.com" className="text-sm font-semibold text-gray-900 break-all block hover:text-[#941007]">customercare@summithomeappliance.com</a>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#941007] transition-colors bg-gray-50/50">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#941007] shadow-sm"><FaPhoneAlt /></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-400 font-bold uppercase">Call Us</p>
                                                <a href="tel:+919220312143" className="text-sm font-semibold text-gray-900 block hover:text-[#941007]">+91 9220312143</a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#941007] transition-colors bg-gray-50/50 text-left">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#941007] shadow-sm shrink-0"><FaMapMarkerAlt /></div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Postal Address</p>
                                            <p className="text-sm font-semibold text-gray-900">B-36 Krishna Vihar Loni
Ghaziabad-201102 UP
(INDIA)</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 pb-2 text-left">
                                    
                                    <h3 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">Escalate to Grievance Officer</h3>
                                    <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                                        If your concern remains unresolved after contacting our support team, or if you are not satisfied with the
                                        proposed resolution, you may escalate the matter to our Grievance Officer.
                                    </p>
                                    <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                                        We strive to acknowledge all escalated grievances within <strong className="font-semibold text-gray-900">24–48 working hours</strong> and provide a final resolution within{" "}
                                        <strong className="font-semibold text-gray-900">7 working days</strong>.
                                    </p>
                                    <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/50 p-5 sm:p-6">
                                        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Grievance officer details</p>
                                        <ul className="mt-4 space-y-3 text-sm text-gray-700 sm:text-base">
                                            <li>
                                                <span className="font-semibold text-gray-900">Name:</span> Mr. Ashish Kumar
                                            </li>
                                            <li>
                                                <span className="font-semibold text-gray-900">Designation:</span> Head of Customer Experience
                                            </li>
                                            <li>
                                                <span className="font-semibold text-gray-900">Email:</span>{" "}
                                                <a href="mailto:escalation@summithomeappliance.com" className="font-semibold text-[#941007] hover:underline break-all">
                                                    customercare@ <br /> summithomeappliance.com
                                                </a>
                                            </li>
                                            <li>
                                                <span className="font-semibold text-gray-900">Subject line:</span>{" "}
                                                <span className="font-mono text-[13px] text-gray-800 sm:text-sm break-all">
                                                    &quot;Grievance Escalation: [Order ID/Reference Number]&quot;
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    
                                </div>
                            </div>
                        </motion.div>

                        {/* 6. Legal Compliance */}
                        <motion.div variants={itemVariants} id="compliance" className="scroll-mt-32">
                            <header className="relative isolate mb-8 border-b border-dashed border-gray-200 pb-5">
                                <div className="relative flex min-h-[4.25rem] items-center sm:min-h-[5.25rem]">
                                    <span
                                        className="pointer-events-none absolute left-0 select-none font-sans text-7xl font-bold leading-none tracking-tight text-[#ECECEC] sm:text-8xl"
                                        aria-hidden="true"
                                    >
                                        06
                                    </span>
                                    <h3 className="relative z-10 pl-[5.5rem] font-serif text-2xl font-bold leading-tight tracking-tight text-gray-950 sm:pl-32 sm:text-3xl md:text-4xl">
                                        Legal Compliance
                                    </h3>
                                </div>
                            </header>

                            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(148,16,7,0.06)] border border-red-50 relative group hover:shadow-[0_8px_40px_rgba(148,16,7,0.1)] transition-shadow duration-300 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-[#941007]"></div>
                                <div className="bg-[#941007] rounded-2xl p-8 text-white text-center shadow-xl shadow-[#941007]/10 relative z-10">
                                    <FaGavel className="mx-auto text-4xl mb-4 opacity-90" />
                                    <p className="font-medium text-lg">Compliance with Information Technology</p>
                                    <p className="text-sm opacity-90 mt-2">(Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</p>
                                </div>
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
