"use client"

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// NOTE: Avoid manually removing React-managed DOM nodes. Let React unmount instead.

interface LoadingScreenProps {
  setComplete: (complete: boolean) => void;
}

export default function LoadingScreen({ setComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const lottieRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlay2Ref = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  const word = ['P', 'O', 'K', 'E', 'M', 'O', 'N'];

  useEffect(() => {
    let isMounted = true;
    let progressInterval: NodeJS.Timeout;
    let safetyTimeout: NodeJS.Timeout;

    const cleanup = () => {
      isMounted = false;
      if (progressInterval) clearInterval(progressInterval);
      if (safetyTimeout) clearTimeout(safetyTimeout);
    };

    const init = () => {
      if (!isMounted) return;

      // Start progress animation
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            // Start exit animations when progress completes
            startExitAnimations();
            return 100;
          }
          return prev + 2; // Faster progress for demo
        });
      }, 50);

      // Safety timeout to ensure loading screen is always removed
      safetyTimeout = setTimeout(() => {
        if (isMounted && !completedRef.current) {
          completedRef.current = true;
          setComplete(true);
        }
      }, 10000); // 10 seconds max
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(init);

    return () => {
      cancelAnimationFrame(rafId);
      cleanup();
      // React will unmount this component; no manual DOM removals.
    };
  }, []);

  const startExitAnimations = () => {
    let isActive = true;
    const cleanup = () => {
      isActive = false;
      // Let React unmount by marking complete once
      if (!completedRef.current) {
        completedRef.current = true;
        setComplete(true);
      }
    };

    const executeAnimations = async () => {
      if (!isActive) return;

      try {
        // Wait a moment after 100%
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!isActive) return;

        // Animate Lottie out
        if (lottieRef.current) {
          lottieRef.current.style.transform = 'translateY(-100%) scale(0.8)';
          lottieRef.current.style.transition = 'all 1.2s cubic-bezier(0.83, 0, 0.17, 1)';
        }

        // Animate text letters out with stagger
        const textPromises = textRefs.current.map((ref, index) => {
          return new Promise<void>(resolve => {
            if (!ref || !isActive) return resolve();
            
            setTimeout(() => {
              if (!isActive) return resolve();
              ref.style.transform = 'translateY(-100%)';
              ref.style.transition = 'transform 1.4s cubic-bezier(0.83, 0, 0.17, 1)';
              resolve();
            }, index * 50);
          });
        });

        // Wait for text animations to complete
        await Promise.all(textPromises);
        if (!isActive) return;

        // Animate main wrapper
        const wrapperPromise = new Promise<void>(resolve => {
          if (!wrapperRef.current || !isActive) return resolve();
          
          wrapperRef.current.style.transform = 'scaleY(0)';
          wrapperRef.current.style.transformOrigin = 'top';
          wrapperRef.current.style.transition = 'transform 1s cubic-bezier(0.83, 0, 0.17, 1)';
          
          // Wait for transition to complete
          const onTransitionEnd = () => {
            if (wrapperRef.current) {
              wrapperRef.current.removeEventListener('transitionend', onTransitionEnd);
            }
            resolve();
          };
          
          wrapperRef.current.addEventListener('transitionend', onTransitionEnd);
          
          // Fallback in case transitionend doesn't fire
          setTimeout(resolve, 1100);
        });

        await wrapperPromise;
        if (!isActive) return;

        // Animate yellow overlay
        const overlayPromise = new Promise<void>(resolve => {
          if (!overlay2Ref.current || !isActive) return resolve();
          
          overlay2Ref.current.style.transform = 'scaleY(0)';
          overlay2Ref.current.style.transformOrigin = 'bottom';
          overlay2Ref.current.style.transition = 'transform 0.8s cubic-bezier(0.83, 0, 0.17, 1)';
          
          // Wait for transition to complete
          const onTransitionEnd = () => {
            if (overlay2Ref.current) {
              overlay2Ref.current.removeEventListener('transitionend', onTransitionEnd);
            }
            resolve();
          };
          
          overlay2Ref.current.addEventListener('transitionend', onTransitionEnd);
          
          // Fallback in case transitionend doesn't fire
          setTimeout(resolve, 900);
        });

        await overlayPromise;
        if (!isActive) return;

        // Final cleanup
        cleanup();
      } catch (error) {
        console.error('Error in startExitAnimations:', error);
        cleanup();
      }
    };

    // Start the animation sequence
    executeAnimations();

    // Return cleanup function
    return () => {
      isActive = false;
      cleanup();
    };
  };

  return (
    <>
      {/* Main Loading Screen */}
      <div
        ref={wrapperRef}
        className="loading-screen-wrapper fixed inset-0 bg-[#212121] z-[100] flex items-center justify-center overflow-hidden"
        style={{ 
          // Don't disable pointer events here as it can cause issues
          // Let the animation handle the visibility
          opacity: 1,
          transition: 'opacity 0.3s ease-out'
        }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 20, 
            repeat: Number.POSITIVE_INFINITY, 
            ease: "linear" 
          }}
          className="absolute top-32 left-32 w-2 h-2 bg-white rounded-full opacity-40"
        />

        <div className="relative z-10 text-center max-w-md mx-auto px-6">
          {/* Brand Section with Animated Letters */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12"
          >
            <div className="flex justify-center items-center gap-2 mb-3 overflow-hidden">
              {word.map((letter, index) => (
                <div
                  key={index}
                  ref={(el) => { textRefs.current[index] = el; }}
                  className="font-light text-5xl text-white tracking-tight transform transition-transform duration-1000"
                >
                  {letter}
                </div>
              ))}
            </div>
            <p className="text-white/70 text-sm tracking-widest font-light">STORE PK</p>
          </motion.div>

          {/* Lottie Animation */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative mb-12 flex justify-center"
          >
            <div 
              ref={lottieRef}
              className="w-32 h-32 relative transform transition-transform duration-1000"
            >
              <div className="absolute inset-0 rounded-full opacity-50 blur-sm"></div>
              <DotLottieReact
                src="/Lottie/pichu evolution.lottie"
                loop
                autoplay
              />
            </div>
          </motion.div>

          {/* Progress Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-80 mx-auto"
          >
            {/* Progress Bar */}
            <div className="relative">
              <div className="bg-white/10 rounded-full h-1 overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-white to-white/80 rounded-full relative overflow-hidden"
                >
                  {/* Shimmer effect */}
                  <motion.div
                    animate={{ x: [-100, 100] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Number.POSITIVE_INFINITY, 
                      ease: "easeInOut" 
                    }}
                    className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  />
                </motion.div>
              </div>
              
              {/* Progress Text */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center mt-6"
              >
                <p className="text-white/50 text-xs font-light tracking-widest uppercase mb-2">
                  Loading Experience
                </p>
                <p className="text-white text-sm font-light">
                  {progress}%
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Loading Dots */}
          <motion.div 
            className="flex justify-center gap-1 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ 
                  duration: 1.2, 
                  repeat: Number.POSITIVE_INFINITY, 
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
                className="w-1 h-1 bg-white rounded-full"
              />
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-16"
          >
            <p className="text-white/30 text-xs font-light tracking-widest">
              POKEMON STORE PK
            </p>
          </motion.div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l border-t border-white/20"></div>
        <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-white/20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l border-b border-white/20"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r border-b border-white/20"></div>
      </div>

      {/* Only Yellow Overlay - Slides from bottom to top */}
      <div
        ref={overlay2Ref}
        className="fixed inset-0 bg-[#faea08] z-[98] transform transition-transform duration-1000"
      ></div>
    </>
  );
}