"use client";
import React from 'react';
import ProductGrid from '../../components/sections/ProductGrid';
import Navbar from '../../components/layout/Navbar';
import TopBar from '@/components/layout/TopBar';
import { FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import Cart from '@/components/cart/Cart';
import MidBar from '@/components/layout/MidBar';
import ReviewsSection from '@/components/sections/ReviewsSection';
import WhiteReview from '@/components/sections/WhiteReview';

const ProductsPage = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/');
  };

  return (
    <>
      <TopBar />
      <MidBar />
      <Navbar />
      <main className="w-full">
        <div className='flex flex-row items-center  gap-10 sm:gap-4 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6 bg-[#212121] text-white mt-14 sm:mt-12'>
          <h3 className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base md:text-lg font-medium cursor-pointer hover:text-gray-300 transition-colors underline-offset-0 underline" onClick={handleBackClick}>
            <FiArrowLeft className="inline text-sm sm:text-base md:text-lg" />
            Back
          </h3>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold flex ">All Products</h1>
        </div>
        <ProductGrid />
      </main>
      <ReviewsSection />
      <WhiteReview />
      <Footer />
      <Cart />
    </>
  );
};

export default ProductsPage;