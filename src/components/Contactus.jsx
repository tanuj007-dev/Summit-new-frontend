import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaUser, FaComments } from 'react-icons/fa';

export const Contactus = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="w-6 h-6" />,
      title: "Visit Us",
      content: "B-36 Krishna Vihar Loni, Ghaziabad-201102, UP (INDIA)",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FaPhone className="w-6 h-6" />,
      title: "Call Us",
      content: "1800 419 6048",
      link: "tel:18004196048",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <FaEnvelope className="w-6 h-6" />,
      title: "Email Us",
      content: "customercare@summithomeappliance.com",
      link: "mailto:customercare@summithomeappliance.com",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <FaClock className="w-6 h-6" />,
      title: "Working Hours",
      content: "Monday - Friday: 9:00 AM - 6:00 PM",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section className="relative bg-[#FAFAFA] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Decorative Gradient Overlay */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-red-50/50 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-gray-100 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-3 animate-fade-in-up">
            <span className="bg-white/80 backdrop-blur-sm border border-red-100 text-[#B91508] px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">
              Get In Touch
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-gray-900 mb-6 tracking-tight animate-fade-in-up animation-delay-100">
            Contact <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#B91508] to-[#8B0F06]">Us</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-red-100/50 -z-0 rotate-1"></span>
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up animation-delay-200">
            Experience exceptional service. We are here to assist you with any inquiries about our premium cookware collection.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 h-full animate-slide-in-left">
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.03)] p-8 sm:p-10 border border-gray-100 h-full flex flex-col relative overflow-hidden group">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B91508] to-[#8B0F06] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center shrink-0 border border-red-100">
                  <FaComments className="w-6 h-6 text-[#B91508]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-serif">Send a Message</h2>
                  <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">We respond within 24 hours</p>
                </div>
              </div>

              {submitStatus === 'success' && (
                <div className="mb-8 p-4 bg-green-50/50 backdrop-blur-sm border border-green-100 rounded-xl flex items-center gap-3 animate-fade-in">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-green-200">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-green-800 font-bold text-sm">Message Sent</h4>
                    <p className="text-green-700 text-xs mt-0.5">Thank you instantly. We'll be in touch shortly.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="group/field">
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="peer block w-full pl-4 pr-4 pt-6 pb-2 border-b-2 border-gray-200 bg-transparent focus:border-[#B91508] focus:ring-0 transition-colors placeholder-transparent"
                        placeholder="Name"
                        required
                      />
                      <label className="absolute left-4 top-2 text-xs font-bold text-gray-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#B91508] peer-focus:uppercase peer-focus:tracking-widest">
                        Full Name
                      </label>
                      <FaUser className="absolute right-4 top-4 text-gray-300 peer-focus:text-[#B91508] transition-colors" />
                    </div>
                  </div>

                  <div className="group/field">
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="peer block w-full pl-4 pr-4 pt-6 pb-2 border-b-2 border-gray-200 bg-transparent focus:border-[#B91508] focus:ring-0 transition-colors placeholder-transparent"
                        placeholder="Email"
                        required
                      />
                      <label className="absolute left-4 top-2 text-xs font-bold text-gray-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#B91508] peer-focus:uppercase peer-focus:tracking-widest">
                        Email Address
                      </label>
                      <FaEnvelope className="absolute right-4 top-4 text-gray-300 peer-focus:text-[#B91508] transition-colors" />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="group/field">
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="peer block w-full pl-4 pr-4 pt-6 pb-2 border-b-2 border-gray-200 bg-transparent focus:border-[#B91508] focus:ring-0 transition-colors placeholder-transparent"
                        placeholder="Phone"
                      />
                      <label className="absolute left-4 top-2 text-xs font-bold text-gray-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#B91508] peer-focus:uppercase peer-focus:tracking-widest">
                        Phone Number
                      </label>
                      <FaPhone className="absolute right-4 top-4 text-gray-300 peer-focus:text-[#B91508] transition-colors" />
                    </div>
                  </div>

                  <div className="group/field">
                    <div className="relative">
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="peer block w-full pl-4 pr-4 pt-6 pb-2 border-b-2 border-gray-200 bg-transparent focus:border-[#B91508] focus:ring-0 transition-colors appearance-none text-gray-900"
                        required
                      >
                        <option value="" disabled hidden></option>
                        <option value="inquiry">Product Inquiry</option>
                        <option value="support">Customer Support</option>
                        <option value="warranty">Warranty & Service</option>
                        <option value="partnership">Business Partnership</option>
                        <option value="other">Other Inquiries</option>
                      </select>
                      <label className={`absolute left-4 transition-all ${formData.subject ? 'top-2 text-xs font-bold text-[#B91508] uppercase tracking-widest' : 'top-4 text-gray-500'}`}>
                        Topic
                      </label>
                      <div className="absolute right-4 top-4 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group/field">
                  <div className="relative">
                    <textarea
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      className="peer block w-full pl-4 pr-4 pt-6 pb-2 border-b-2 border-gray-200 bg-transparent focus:border-[#B91508] focus:ring-0 transition-colors placeholder-transparent resize-none"
                      placeholder="Message"
                      required
                    ></textarea>
                    <label className="absolute left-4 top-2 text-xs font-bold text-gray-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#B91508] peer-focus:uppercase peer-focus:tracking-widest">
                      How can we help?
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 hover:bg-[#B91508] text-white font-medium tracking-wide uppercase text-sm px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-3 group overflow-hidden relative"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <FaPaperPlane className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Info Grid + Map (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 animate-slide-in-right animation-delay-300">
            {/* 2x2 Info Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col items-center text-center group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md border border-gray-100 group-hover:border-red-100 transition-all duration-300 relative z-10`}>
                    <div className="text-[#B91508] group-hover:scale-110 transition-transform duration-300">
                      {info.icon}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 mb-1.5 relative z-10 font-serif tracking-wide">{info.title}</h3>

                  {info.link ? (
                    <a href={info.link} className="text-xs text-gray-500 hover:text-[#B91508] font-medium transition-colors duration-200 relative z-10">
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-xs text-gray-500 relative z-10 leading-relaxed max-w-[150px]">{info.content}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.05)] p-2 border border-white flex-grow min-h-[250px] overflow-hidden group">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-100 relative grayscale group-hover:grayscale-0 transition-all duration-700">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.123456789!2d77.123456!3d28.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDA3JzI0LjQiTiA3N8KwMDcnMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                  className="opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                ></iframe>

                {/* Location Overlay Badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-white/50 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#B91508]" />
                    <div>
                      <p className="text-xs font-bold text-gray-900">Summit Home Appliance</p>
                      <p className="text-[10px] text-gray-500">Ghaziabad, UP</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `}</style>
      </div>
    </section>
  );
};
