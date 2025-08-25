'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHeart,
   
} from "react-icons/fi"
import { FaWhatsapp } from "react-icons/fa";
const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.05,
    },
  }),
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const Footer = () => {

  const socialLinks = [
    { icon: FiInstagram, href: "https://www.instagram.com/pokestorepk", label: "Instagram" },
    { icon: FaWhatsapp,  href: "https://wa.me/923455102674?text=Hi%20LNCC%20Organics,%20I%20have%20a%20question!", label: "Whatsapp" },
    { icon: FiMail, href: "mailto:pokemonstorepk@gmail.com", label: "Email" },
  ];

    const quickLinks = [

    { name: "Products", href: "/products" },
    { name: "Reviews", href: "#reviews" },
    { name: "FAQs", href: "#faqs" },
    { 
      name: "Contact", 
      href: "https://wa.me/923455102674?text=Hi%20LNCC%20Organics,%20I%20have%20a%20question!", 
      isWhatsApp: true 
    },
  ]
  return (
    <footer
      className="bg-[#212121] text-white h-[74vh] md:h-[90rem] relative"
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
    >
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .marquee-item {
          flex: 0 0 auto;
          padding: 0 2rem;
        }
      `}</style>

      <motion.div
        initial="hidden"
        whileInView="visible"
        className="fixed bottom-0 lg:h-[800px] w-full py-[3rem] md:py-[5rem]"
        viewport={{ once: false, amount: 0.7 }}
      >
        <div className="max-w-screen-xl w-[90%] mx-auto flex flex-col justify-between h-full">
          <div className="flex max-md:flex-col justify-between gap-4 mt-10 sm:mt-24">
            <motion.p
              className="max-w-[31.9375rem] text-lg md:text-2xl font-light leading-normal tracking-[-0.03rem] "
              variants={sectionVariants}
            >
              Make your own Pokemon cards collection with our easy-to-use.
            </motion.p>

            <div className="max-w-[19rem] grid grid-cols-2 gap-6 w-full">
              <div className="flex flex-col gap-3 text-xs text-[#DCDCDC]">
                <motion.h3
                  className="uppercase text-white"
                  variants={textVariants}
                  custom={0}
                >
                  Menu
                </motion.h3>
                 {quickLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    target={link.isWhatsApp ? "_blank" : "_self"}
                    rel={link.isWhatsApp ? "noopener noreferrer" : undefined}
                    className="hover:text-white transition-colors duration-200"
                    variants={textVariants}
                    custom={index + 1}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
              <div className="flex flex-col gap-3 text-xs text-[#DCDCDC]">
                <motion.h3
                  className="uppercase text-white"
                  variants={textVariants}
                  custom={0}
                >
                  Socials
                </motion.h3>
               {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-white transition-colors duration-200"
                      variants={textVariants}
                      custom={index + 1}
                    >
                      <IconComponent size={14} />
                      {social.label}
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
           <div className="py-[3rem] md:py-[5rem] border-t border-b border-[#989898] mb-8 marquee-container">
  <div className="marquee-track">
    {Array(8).fill(null).map((_, i) => (
      <h1
        key={i}
        className="text-[19vw] leading-none marquee-item flex items-center justify-center gap-6"
      >
        <span>POKE</span>

        <span>STORE</span>
        
        <span>PK</span>
                <span className="text-white text-[0.4em] flex items-center justify-center">•</span>
      </h1>
    ))}
  </div>
</div>


            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-5 md:gap-10">
                {['Term', 'Privacy'].map((link, index) => (
                       <motion.span
                    key={index}
                    className="text-xs md:text-base"
                    variants={textVariants}
                    custom={index}
                  >
                    {link}
                  </motion.span>
                ))}
              </div>

              <motion.div
                className="flex items-center gap-2 md:gap-3 max-md:text-xs"
                variants={sectionVariants}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="max-md:w-4"
                >
                  <path
                    d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 9C13.52 8.4 12.93 8 12 8C7.82902 8 7.82902 16 12 16C12.93 16 13.52 15.6 14 15"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                2025 All rights reserved
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
