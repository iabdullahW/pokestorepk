"use client";

import React from "react";

export default function WhiteReview() {
  const whitereviewGrid = [
    {
      id: 1,
      title: "Fast Shipping",
      description: "Delivery across Pakistan within days.",
      image: "/whiterev/fastship.webp",
    },
    {
      id: 2,
      title: "Best Price Guarantee",
      description: "Affordable rates for all anime lovers.",
      image: "/whiterev/bestprice.webp",
    },
    {
      id: 3,
      title: "Easy Returns",
      description: "Quick replacements if something goes wrong.",
      image: "/whiterev/easyreturn.webp",
    },
    {
      id: 4,
      title: "5 Star Reviews",
      description: "Your satisfaction is our top priority.",
      image: "/whiterev/review5.webp",
    },
  ];

  return (
    <section className="relative bg-white py-10 sm:py-11 md:py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
        {whitereviewGrid.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center transition-transform hover:scale-105"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-12 h-12 mb-4 object-contain"
            />
            <h3 className="font-semibold text-lg text-black">{item.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Waves at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="ocean">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
      </div>

      <style jsx>{`
        /* waves */
        .ocean {
          height: 23px; /* change the height of the waves here */
          width: 100%;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          overflow-x: hidden;
        }
        
        .ocean > div:empty {
          display: block;
        }
          
        .ocean .wave {
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23212121'/%3E%3C/svg%3E");
          position: absolute;
          width: 200%;
          height: 100%;
          animation: wave 10s -3s linear infinite;
          transform: translate3d(0, 0, 0);
          opacity: 1;
        }
        
        .ocean .wave svg {
          fill: #212121 !important;
        }
          
        .ocean .wave:nth-of-type(2) {
          bottom: 0;
          animation: wave calc(10s * 2) -2s linear reverse infinite;
          opacity: 0.5;
        }
        
        .ocean .wave:nth-of-type(3) {
          bottom: 0;
          animation: wave calc(10s * 2) -1s linear infinite;
          opacity: 0.5;
        }
        
        @keyframes wave {
          0% { transform: translateX(0); }
          50% { transform: translateX(-25%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
