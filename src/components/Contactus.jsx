import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaUser, FaComments, FaWhatsapp } from 'react-icons/fa';

const OFFICE_ADDRESS =
  'B-36, Krishna Vihar, Phase-1, Mandoli, Ghaziabad, Uttar Pradesh 201102, India';

const OFFICE_MAP_EMBED_SRC = `https://maps.google.com/maps?q=${encodeURIComponent(OFFICE_ADDRESS)}&hl=en&z=16&output=embed`;

const OFFICE_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_ADDRESS)}`;

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
      icon: <FaWhatsapp className="w-6 h-6" />,
      title: "WhatsApp Us",
      content: "+91 9990555161",
      link: "https://wa.me/919990555161",
      color: "from-green-500 to-green-600"
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
      content: (
        <>
          customercare@<br />summithomeappliance.com
        </>
      ),
      link: "mailto:customercare@summithomeappliance.com",
      color: "from-[#941007] to-[#941007]"
    },
   
    {
      icon: <FaClock className="w-6 h-6" />,
      title: "Working Hours",
      content: "Monday - Friday: 10:00 AM - 6:00 PM",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <FaMapMarkerAlt className="w-6 h-6" />,
      title: "Visit Us",
      content: (
        <>
          B-36, Krishna Vihar, Phase-1,{' '}
          <br className="sm:hidden" />
          Mandoli, Ghaziabad,{' '}
          <br className="sm:hidden" />
          Uttar Pradesh 201102, India
        </>
      ),
      link: OFFICE_MAPS_LINK,
      color: "from-blue-500 to-blue-600",
      fullWidth: true
    },
  ];

  return (
    <section className="relative bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      {/* Decorative Gradient Overlay */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-[#941007]/15 via-red-50/40 to-transparent rounded-full blur-3xl z-0 pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-gradient-to-tl from-[#941007]/15 via-red-50/40 to-transparent rounded-full blur-3xl z-0 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-3 animate-fade-in-up">
            <span className="bg-white/80 backdrop-blur-sm border border-red-100 text-[#941007] px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">
              Get In Touch
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-gray-900 mb-6 tracking-tight animate-fade-in-up animation-delay-100">
            Contact <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#941007] to-[#8B0F06]">Us</span>
              
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto font-light leading-relaxed animate-fade-in-up animation-delay-200">
           Experience Exceptional Service. We’re here to ensure you get the most out of our products.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 h-full animate-slide-in-left">
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.03)] p-8 sm:p-10 border border-gray-100 h-full flex flex-col relative overflow-hidden group">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#941007] to-[#8B0F06] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center shrink-0 border border-red-100">
                  <FaComments className="w-6 h-6 text-[#941007]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-serif">Have a question or feedback ?</h2>
                  <p className="text-sm text-gray-500 font-medium "> 
We’d love to hear from you. Fill out the form below, and our team will get back to you soon.</p>
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
                        className="peer block w-full pl-4 pr-4 pt-6 pb-2 border-b-2 border-gray-200 bg-transparent focus:border-[#941007] focus:ring-0 transition-colors focus:outline-none !placeholder-transparent focus:!placeholder-gray-300"
                        placeholder="Name"
                        required
                      />
                      <label className="absolute left-4 top-2 text-xs font-bold text-gray-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#941007] peer-focus:uppercase peer-focus:tracking-widest">
                        Full Name
                      </label>
                      <FaUser className="absolute right-4 top-4 text-gray-300 peer-focus:text-[#941007] transition-colors" />
                    </div>
                  </div>

                  <div className="group/field">
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="peer block w-full pl-4 pr-4 pt-6 pb-2 border-b-2 border-gray-200 bg-transparent focus:border-[#941007] focus:ring-0 transition-colors focus:outline-none !placeholder-transparent focus:!placeholder-gray-300"
                        placeholder="Email"
                        required
                      />
                      <label className="absolute left-4 top-2 text-xs font-bold text-gray-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#941007] peer-focus:uppercase peer-focus:tracking-widest">
                        Email Address
                      </label>
                      <FaEnvelope className="absolute right-4 top-4 text-gray-300 peer-focus:text-[#941007] transition-colors" />
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
                        className="peer block w-full pl-4 pr-4 pt-6 pb-2 border-b-2 border-gray-200 bg-transparent focus:border-[#941007] focus:ring-0 transition-colors focus:outline-none !placeholder-transparent focus:!placeholder-gray-300"
                        placeholder="Phone Number"
                      />
                      <label className="absolute left-4 top-2 text-xs font-bold text-gray-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#941007] peer-focus:uppercase peer-focus:tracking-widest">
                        Phone Number
                      </label>
                      <FaPhone className="absolute right-4 top-4 text-gray-300 peer-focus:text-[#941007] transition-colors" />
                    </div>
                  </div>

                  <div className="group/field">
                    <div className="relative">
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="peer block w-full pl-4 pr-4 pt-6 pb-2 border-b-2 border-gray-200 bg-transparent focus:border-[#941007] focus:ring-0 transition-colors appearance-none text-gray-900"
                        required
                      >
                        <option value="" disabled hidden></option>
                        <option value="inquiry">Product Inquiry</option>
                        <option value="support">Customer Support</option>
                        <option value="warranty">Warranty & Service</option>
                        <option value="partnership">Business Partnership</option>
                        <option value="other">Other Inquiries</option>
                      </select>
                      <label className={`absolute left-4 transition-all ${formData.subject ? 'top-2 text-xs font-bold text-[#941007] uppercase tracking-widest' : 'top-4 text-gray-500'}`}>
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
                      className="peer block w-full pl-4 pr-4 pt-6 pb-2 border-b-2 border-gray-200 bg-transparent focus:border-[#941007] focus:ring-0 transition-colors focus:outline-none !placeholder-transparent focus:!placeholder-gray-300 resize-none"
                      placeholder="Message"
                      required
                    ></textarea>
                    <label className="absolute left-4 top-2 text-xs font-bold text-gray-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#941007] peer-focus:uppercase peer-focus:tracking-widest">
                      How can we help?
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 hover:bg-[#941007] text-white font-medium tracking-wide uppercase text-sm px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-3 group overflow-hidden relative"
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
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5 sm:hover:-translate-y-1 group relative overflow-hidden min-w-0 ${
                    info.fullWidth
                      ? "col-span-2 justify-self-center w-full max-w-md sm:max-w-none sm:justify-self-stretch p-4 sm:p-6 flex flex-col items-center text-center gap-3 sm:flex-row sm:items-start sm:gap-5 sm:text-left"
                      : "p-3 sm:p-6 flex flex-col items-center text-center"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md border border-gray-100 group-hover:border-red-100 transition-all duration-300 relative z-10 shrink-0 ${
                      info.fullWidth ? "" : "mb-3 sm:mb-4"
                    }`}
                  >
                    <div className="text-[#941007] group-hover:scale-110 transition-transform duration-300">
                      {info.icon}
                    </div>
                  </div>

                  <div
                    className={`min-w-0 w-full ${
                      info.fullWidth
                        ? "text-center sm:text-left"
                        : "flex flex-col items-center"
                    }`}
                  >
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 sm:mb-1.5 relative z-10 font-serif tracking-wide px-0.5">
                      {info.title}
                    </h3>

                    {info.link ? (
                      <a
                        href={info.link}
                        className={`text-[11px] sm:text-xs text-gray-500 hover:text-[#941007] font-medium transition-colors duration-200 relative z-10 block w-full max-w-full py-2 -my-1 sm:py-0 sm:my-0 rounded-lg sm:rounded-none outline-none focus-visible:ring-2 focus-visible:ring-[#941007]/30 focus-visible:ring-offset-2 break-words text-center leading-relaxed ${
                          info.fullWidth ? "sm:text-left text-pretty" : ""
                        }`}
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p
                        className={`text-[11px] sm:text-xs text-gray-500 relative z-10 leading-relaxed break-words w-full max-w-full mx-auto ${
                          info.fullWidth ? "text-pretty" : "max-w-[min(100%,20rem)] sm:max-w-[180px]"
                        }`}
                      >
                        {info.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.05)] p-2 border border-white flex-grow min-h-[280px] overflow-hidden group">
              <div className="w-full min-h-[280px] sm:min-h-[320px] rounded-2xl overflow-hidden bg-gray-100 relative grayscale group-hover:grayscale-0 transition-all duration-700">
                <iframe
                  src={OFFICE_MAP_EMBED_SRC}
                  width="100%"
                  height="100%"
                  style={{ border: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map: ${OFFICE_ADDRESS}`}
                  className="opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                />

                {/* Location Overlay Badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-white/50 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 max-w-[calc(100%-2rem)]">
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-[#941007] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900">Summit Home Appliance</p>
                      <p className="text-[10px] text-gray-500 leading-snug">Krishna Vihar, Mandoli, Ghaziabad</p>
                      <a                                
                        href={OFFICE_MAPS_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#941007] font-semibold mt-1 inline-block hover:underline"
                      >
                        Open in Google Maps
                      </a>

                      
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
