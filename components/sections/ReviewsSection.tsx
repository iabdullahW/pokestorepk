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
    "name": "-Sherry.",
    "rating": 5,
    "comment": "Amazing quality! My son loved the Pokémon booster. Will buy again!"
  },
  {
    "id": 2,
    "name": "-Sara A.",
    "rating": 5,
    "comment": "Exceeded my expectations. highly recommended"
  },
  {
    "id": 3,
    "name": "-Ashna Mirza.",
    "rating": 4,
    "comment": "Perfect for my collection! I'm a big anime fan and this action figure fits right in with my Dragon Ball and Naruto collections."
  },
  {
    "id": 4,
    "name": "Hira Baloch",
    "rating": 5,
    "comment": "Perfect colors and design. My kids are thrilled with their new Pokémon cards!"
  },
  {
    "id": 5,
    "name": "-Hassan R.",
    "rating": 5,
    "comment": "Gem Packs were packed nicely and had rare cards inside. Totally worth it!!"
  },
  {
    "id": 6,
    "name": "-Nafay.",
    "rating": 5,
    "comment": "Quality of cards and delivery was on point."
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