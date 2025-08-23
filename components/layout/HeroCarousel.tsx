"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export default function HeroCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Infinite horizontal scroll only
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollWidth = carousel.scrollWidth;
    const animation = gsap.to(carousel, {
      x: -scrollWidth / 2,
      duration: 50,
      ease: "none",
      repeat: -1,
    });

    const handleMouseEnter = () => animation.pause();
    const handleMouseLeave = () => animation.resume();

    carousel.addEventListener("mouseenter", handleMouseEnter);
    carousel.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      animation.kill();
      carousel.removeEventListener("mouseenter", handleMouseEnter);
      carousel.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="bg-white py-2 z-10 overflow-hidden relative">
      <div
        ref={carouselRef}
        className="flex whitespace-nowrap"
        style={{ width: "max-content" }}
      >
        {Array.from({ length: 35 }).map((_, index) => (
          <div key={`carousel-item-${index}`} className="px-4">
            <Image
              src="/pokemoncarousel.avif"
              alt="Pokemon Carousel"
              width={80}
              height={80}
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}