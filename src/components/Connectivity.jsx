import React from "react";
import { MdAddCall } from "react-icons/md";
import { BiSolidShoppingBags } from "react-icons/bi";
import { GiTrophy } from "react-icons/gi";
import { FaGifts, FaClipboardCheck, FaUsers, FaStore } from "react-icons/fa";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import { motion } from "framer-motion";

const Connectivity = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const icons = [
    { icon: <MdAddCall />, text: "Toll Free Assistance" },
    {
      icon: <BiSolidShoppingBags />,
      text: (
        <>
          Available on leading <br /> E-commerce platforms
        </>
      ),
    },
    {
      icon: <GiTrophy />,
      text: (
        <>
          30+ Years of Industry <br /> Experience
        </>
      ),
    },
    {
      icon: <FaClipboardCheck />,
      text: (
        <>
          Rigorous Quality Checks
        </>
      ),
    },
    { icon: <FaUsers />, text: "Trusted by Millions" },
    { icon: <FaStore />, text: "One-Stop Kitchen Shop" },
    {
      icon: <BsFillCreditCard2FrontFill />,
      text: (
        <>
          Secure & Flexible <br /> Payments
        </>
      ),
    },
    { icon: <FaGifts />, text: "Perfect for Gifting" },
  ];

  return (
    <div className="sr-connectivity bg-[#F9F9F9] grid grid-cols-2 md:grid-cols-4 md:px-16  py-10 text-sm text-[#941007] gap-y-2 sm:gap-y-10">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center space-y-4 text-center group hover:scale-105 transition-transform duration-300"
        >
          {/* Icon with background */}
          <div className="bg-white shadow-md group-hover:shadow-lg group-hover:bg-[#941007]/10 text-[#941007] rounded-full p-6  text-2xl sm:text-3xl transition-all duration-300">
            {item.icon}
          </div>

          {/* Text */}
          <p className="text-black font-medium group-hover:text-[#941007] transition-colors duration-300">
            {item.text}
          </p>

        </motion.div>

      ))}

    </div>

  );
};

export default Connectivity;
