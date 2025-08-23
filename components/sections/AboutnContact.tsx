"use client";

import React, { useState } from "react";

export default function AboutnContact() {
  const [openAccordion, setOpenAccordion] = useState(null);

  const about = [
    { heading: "ABOUT US" },
    { paraone: "Welcome to Anime Craft Official" },
    { paratwo: "Pakistan's go to store for Pokemon lovers" },
    { description: "From cool Cards,Stickers and exciting booster packs to trendy merch, we've got everything an otaku needs. 100% fan-approved. Delivered with love." },
  ];

  const contact = [
    { heading: "CONNECT WITH US" },
    { insta: "pokemonstorepk" },
    { email: "pokemonstorepk@gmail.com" },
    { whatsapp: "03455102674" },
  ];

  const toggleAccordion = (index:any) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <section className="relative bg-[#212121] text-white py-16 px-6 overflow-hidden">
      {/* Waves at top */}
      <div className="absolute top-0 left-0 right-0">
        <div className="ocean">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto space-y-12">
        
        {/* About Us Accordion */}
        <div className="border-b border-gray-700">
          <div 
            className="flex justify-between items-center py-6 cursor-pointer group"
            onClick={() => toggleAccordion(0)}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
              {about[0].heading}
            </h2>
            <div className={`transform transition-transform duration-300 ${
              openAccordion === 0 ? 'rotate-180' : 'rotate-12'
            }`}>
              <svg 
                className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </div>
          </div>
          
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
            openAccordion === 0 ? 'max-h-96 pb-8' : 'max-h-0'
          }`}>
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-300">
                {about[1].paraone}
              </h3>
              <h4 className="text-lg md:text-xl text-gray-400">
                {about[2].paratwo}
              </h4>
              <p className="text-gray-300 leading-relaxed max-w-3xl">
                {about[3].description}
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal Rule with Animation */}
        <div className="flex items-center justify-center py-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-gray-600"></div>
          <div className="mx-4">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-600 to-gray-600"></div>
        </div>

        {/* Contact Accordion */}
        <div className="border-b border-gray-700">
          <div 
            className="flex justify-between items-center py-6 cursor-pointer group"
            onClick={() => toggleAccordion(1)}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
              {contact[0].heading}
            </h2>
            <div className={`transform transition-transform duration-300 ${
              openAccordion === 1 ? 'rotate-180' : '-rotate-12'
            }`}>
              <svg 
                className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </div>
          </div>
          
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
            openAccordion === 1 ? 'max-h-96 pb-8' : 'max-h-0'
          }`}>
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <p className="text-lg text-gray-300">
                  <span className="text-gray-400">Instagram :</span> 
                  <a 
                    href="https://www.instagram.com/pokestorepk" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-white hover:text-pink-400 transition-colors duration-300 cursor-pointer underline hover:no-underline"
                  >
                    {contact[1].insta}
                  </a>
                </p>
                <p className="text-lg text-gray-300">
                  <span className="text-gray-400">WhatsApp :</span> 
                  <a 
                    href="https://wa.me/923455102674?text=Hi%20Anime%20Craft%20Official,%20I%20have%20a%20question!" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-white hover:text-green-400 transition-colors duration-300 cursor-pointer underline hover:no-underline"
                  >
                    {contact[3].whatsapp}
                  </a>
                </p>
                <p className="text-lg text-gray-300">
                  <span className="text-gray-400">Email :</span> 
                  <a 
                    href="mailto:pokemonstorepk.official@gmail.com" 
                    className="ml-2 text-white hover:text-blue-400 transition-colors duration-300 cursor-pointer underline hover:no-underline"
                  >
                    {contact[2].email}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        /* waves */
        .ocean {
          height: 23px; /* change the height of the waves here */
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          overflow-x: hidden;
        }
        
        .ocean > div:empty {
          display: block;
        }
          
        .ocean .wave {
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M0 31.8c155.5 0 204.9 50 405.5 49.9 200 0 250-49.9 394.5-49.9V0H0v31.8z' fill='%23ffffff'/%3E%3C/svg%3E");
          position: absolute;
          width: 200%;
          height: 100%;
          animation: wave 10s -3s linear infinite;
          transform: translate3d(0, 0, 0);
          opacity: 1;
        }
        
        .ocean .wave svg {
          fill: #ffffff !important;
        }
          
        .ocean .wave:nth-of-type(2) {
          animation: wave calc(10s * 2) -2s linear reverse infinite;
          opacity: 0.5;
        }
        
        .ocean .wave:nth-of-type(3) {
          animation: wave calc(10s * 2) -1s linear infinite;
          opacity: 0.5;
        }
        
        @keyframes wave {
          0% { transform: translateX(0); }
          50% { transform: translateX(-25%); }
          100% { transform: translateX(-50%); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </section>
  );
}