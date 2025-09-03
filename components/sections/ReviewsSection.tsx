"use client"

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiStar } from 'react-icons/fi';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ReviewsSection() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const reviews = [
  {
    "id": 1,
    "name": "-Zaid Azhar",
    "rating": 5,
    "comment": "Received the cards! Thanks for the gift!"
  },
  {
    "id": 2,
    "name": "-Usma",
    "rating": 5,
    "comment": "Assalamu alaikum, parcel received alhamdulillah. All things in 10/10 condition"
  },
  {
    "id": 3,
    "name": "-Shayan",
    "rating": 5,
    "comment": "Received the parcel. Love these, will open and share the hits, thank you Pokemon Store Pakistan you rock"
  },
  {
    "id": 4,
    "name": "-Khalid",
    "rating": 5,
    "comment": "Second purchase from you absolutely love the condition of the card 10/10. One of the cards I wanted to add to my collection and I'm glad you had it, will get the other dream cards from you as well"
  },
  {
    "id": 5,
    "name": "-Talal",
    "rating": 5,
    "comment": "It was received on time great service and the price was reasonable. Guys please support him and help him grow and let's build this community"
  },
  {
    "id": 6,
    "name": "-Ozair",
    "rating": 5,
    "comment": "Bought 151 booster bundle. Smooth experience as ever. This time I paid before and he used a local courier to deliver. Box arrived without any damage."
  },
  {
    "id": 7,
    "name": "-Abdul Moiz",
    "rating": 5,
    "comment": "Received <3 best service and best rates"
  },
  {
    "id": 8,
    "name": "-Hassan",
    "rating": 5,
    "comment": "Great seller! Cards arrived on time, in perfect condition, and exactly as described. Fair price and smooth communication. Highly recommended!"
  },
  {
    "id": 9,
    "name": "-Hasan",
    "rating": 5,
    "comment": "Legit stuff. Good service and great vendor for other items"
  },
  {
    "id": 10,
    "name": "-Shayan",
    "rating": 5,
    "comment": "Overall experience is good and 💯 recommend. I ordered second time and it's condition is good and sealed"
  }
];
const whitereviewGrid = [
  {
    id: 1,
    title: "Fast Shipping",
    description: "Delivery across Pakistan within days.",
    image: "/whiterev/fastship.webp"
  },
  {
    id: 2,
    title: "Best Price Guarantee",
    description: "Affordable rates for all anime lovers.",
    image: "/whiterev/bestprice.webp"
  },
  {
    id: 3,
    title: "Easy Returns",
    description: "Quick replacements if something goes wrong.",
    image: "/whiterev/easyreturn.webp"
  },
  {
    id: 4,
    title: "5 Star Reviews",
    description: "Your satisfaction is our top priority.",
    image: "/whiterev/review5.webp"
  }
];


  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Infinite scroll animation
    const scrollWidth = carousel.scrollWidth;
    const itemWidth = carousel.children[0]?.clientWidth || 300;
    
    gsap.to(carousel, {
      x: -scrollWidth / 2,
      duration: 30,
      ease: "none",
      repeat: -1,
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
      gsap.globalTimeline.pause();
    });

    carousel.addEventListener('mouseleave', () => {
      gsap.globalTimeline.resume();
    });

    // Stats counter animation
    gsap.fromTo('.stat-number', 
      { textContent: 0 },
      {
        textContent: (i: number, target: any) => target.getAttribute('data-count'),
        duration: 2,
        ease: "power2.out",
        snap: { textContent: 1 },
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.stats-grid',
          start: 'top 80%',
        }
      }
    );

    // Cleanup
    return () => {
      carousel.removeEventListener('mouseenter', () => {
        gsap.globalTimeline.pause();
      });
      carousel.removeEventListener('mouseleave', () => {
        gsap.globalTimeline.resume();
      });
    };
  }, []);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <section id="reviews" className="py-10 sm:py-11 md:py-12 px-4 sm:px-6 lg:px-8 bg-[#212121] overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">What Our Customers Say</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto px-4">
            Don't just take our word for it - hear from our amazing customers who have experienced the magic of LNCC
            Organics.
          </p>
        </motion.div> */}

        {/* Reviews Carousel */}
        <div className="relative">
          <div className="flex space-x-4 sm:space-x-6" ref={carouselRef}>
            {/* Duplicate reviews for seamless loop */}
            {[...reviews, ...reviews].map((review, index) => (
              <motion.div
                key={`${review.id}-${index}`}
                className="flex-shrink-0 w-72 sm:w-80 bg-black rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-800"
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
                }}
              >
                {/* Rating */}
                <div className="flex justify-center space-x-1 mb-4 sm:mb-6">
                  {renderStars(review.rating)}
                </div>

                {/* Comment */}
                <p className="text-white text-center mb-4 sm:mb-6 leading-relaxed italic text-sm sm:text-base">
                  "{review.comment}"
                </p>

                {/* Customer Name */}
                <div className="text-center">
                  <h4 className="font-semibold text-gray-300 text-sm sm:text-base">- {review.name}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="stats-grid mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center"
        >
          <div>
            <motion.div 
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2"
              whileHover={{ scale: 1.1 }}
            >
              <span className="stat-number" data-count="500">0</span>+
            </motion.div>
            <div className="text-xs sm:text-sm text-gray-300">Happy Customers</div>
          </div>
          <div>
            <motion.div 
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2"
              whileHover={{ scale: 1.1 }}
            >
              <span className="stat-number" data-count="4.9">0</span>
            </motion.div>
            <div className="text-xs sm:text-sm text-gray-300">Average Rating</div>
          </div>
          <div>
            <motion.div 
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2"
              whileHover={{ scale: 1.1 }}
            >
              <span className="stat-number" data-count="100">0</span>%
            </motion.div>
            <div className="text-xs sm:text-sm text-gray-300">Organic Products</div>
          </div>
          <div>
            <motion.div 
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2"
              whileHover={{ scale: 1.1 }}
            >
              24/7
            </motion.div>
            <div className="text-xs sm:text-sm text-gray-300">Customer Support</div>
          </div>
        </motion.div>

      
      </div>
      {/* whitebg review */}
    
    </section>
  )
}