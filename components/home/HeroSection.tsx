"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { IOSLoader } from "@/components/ui/ios-loader";

const HeroSection = observer(() => {
  const router = useRouter();
  const { bannerStore } = useStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch banners on component mount
  useEffect(() => {
    console.log('🎬 HeroSection mounted, fetching banners...');
    bannerStore.fetchBanners();
  }, []);

  // Auto-rotate banners every 10 seconds if there are banners
  useEffect(() => {
    if (bannerStore.activeBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex =>
        (prevIndex + 1) % bannerStore.activeBanners.length
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [bannerStore.activeBanners.length]);

  // Manual navigation
  const nextSlide = () => {
    setCurrentImageIndex(prevIndex =>
      (prevIndex + 1) % bannerStore.activeBanners.length
    );
  };

  const prevSlide = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === 0 ? bannerStore.activeBanners.length - 1 : prevIndex - 1
    );
  };

  // Handle banner click
  const handleBannerClick = () => {
    const currentBanner = bannerStore.activeBanners[currentImageIndex];
    const link = bannerStore.getBannerLink(currentBanner);
    if (link) {
      router.push(link);
    }
  };

  // Handle button click
  const handleButtonClick = () => {
    const currentBanner = bannerStore.activeBanners[currentImageIndex];
    const link = bannerStore.getBannerLink(currentBanner);
    if (link) {
      router.push(link);
    } else {
      router.push("/categories");
    }
  };

  // Loading state - only small red loader like Apple devices
  if (bannerStore.loading) {
    console.log('🔄 Banners are loading...');
    return (
      <section className="relative px-4 min-h-[60vh] sm:min-h-[60vh] flex items-center justify-center bg-black">
        <IOSLoader size="sm" color="text-red-500" />
      </section>
    );
  }

  // Error state - only small red loader like Apple devices
  if (bannerStore.error) {
    console.error('❌ Banner error:', bannerStore.error);
    return (
      <section className="relative px-4 min-h-[60vh] sm:min-h-[60vh] flex items-center justify-center bg-black">
        <IOSLoader size="sm" color="text-red-500" />
      </section>
    );
  }

  // No banners state - only small red loader like Apple devices
  if (bannerStore.activeBanners.length === 0) {
    console.warn('⚠️ No active banners found. Total banners:', bannerStore.banners.length);
    console.log('All banners:', bannerStore.banners);
    return (
      <section className="relative px-4 min-h-[60vh] sm:min-h-[60vh] flex items-center justify-center bg-black">
        <IOSLoader size="sm" color="text-red-500" />
      </section>
    );
  }

  console.log('✅ Showing banner:', currentImageIndex + 1, 'of', bannerStore.activeBanners.length);

  const currentBanner = bannerStore.activeBanners[currentImageIndex];
  const bannerImageUrl = currentBanner.image_url ||
    (currentBanner.image.startsWith('http')
      ? currentBanner.image
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://193.203.161.174:3007'}/uploads/banners/${currentBanner.image}`);

  return (
    <section className="relative w-full aspect-[2/1] sm:aspect-auto sm:min-h-[60vh] flex items-center bg-black">
      <div className="absolute inset-0 w-full h-full">
        {/* Banner Image with Click Handler */}
        <div
          className="absolute inset-0 w-full h-full cursor-pointer"
          onClick={handleBannerClick}
        >
          <Image
            src={bannerImageUrl}
            alt={currentBanner.title || 'Banner'}
            fill
            className="object-cover"
            style={{
              objectPosition: 'center center',
            }}
            priority
          />
          {/* Dark Overlay - Stronger at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent sm:from-black/70 sm:via-black/40 sm:to-transparent" />
        </div>

        {/* Banner Content - Bottom on mobile, positioned on desktop */}
        <div className="absolute inset-0 flex items-end pb-2 sm:items-center sm:pb-0 sm:left-[10%]">
          {/* Mobile: Two-column compact layout | Desktop: Vertical stack */}
          <div className="w-full grid grid-cols-2 gap-1 items-center px-2 sm:gap-4 sm:px-4 sm:flex sm:flex-col sm:items-start sm:px-0">
            {/* Left side: Title & Description */}
            <div className="col-span-1 text-left sm:text-center md:text-left">
              <h1 className="text-sm sm:text-2xl md:text-4xl font-bold text-foreground mb-1 sm:mb-6 leading-tight sm:leading-snug tracking-normal sm:tracking-wider">
                {currentBanner.title || 'Special Offer'}
                {currentBanner.description && (
                  <span className="block text-[8px] sm:text-sm md:text-lg mt-0.5 sm:mt-2 text-muted-foreground font-normal leading-tight">
                    {currentBanner.description}
                  </span>
                )}
              </h1>
            </div>

            {/* Right side: Button */}
            {currentBanner.button_enabled && (
              <div className="col-span-1 flex justify-end sm:justify-start">
                <Button
                  size="sm"
                  onClick={handleButtonClick}
                  className="hover:cursor-pointer hover:scale-105 duration-300 min-w-[60px] sm:min-w-[120px] px-2 sm:px-6 py-1 sm:py-3 text-[8px] sm:text-base tracking-wider sm:tracking-[.1000rem] bg-primary shadow-lg shadow-black/50 z-10 font-semibold"
                >
                  {currentBanner.button_text || 'GET IT'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        {bannerStore.activeBanners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full"
              aria-label="Previous banner"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full"
              aria-label="Next banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </section>
  );
});

export default HeroSection;