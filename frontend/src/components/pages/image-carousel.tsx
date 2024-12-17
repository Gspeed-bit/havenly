'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ImageCarouselProps {
  images: { url: string; public_id: string }[];

  alt: string;
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  const goToPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  return (
    <div className='relative w-full'>
      <Slider ref={sliderRef} {...settings}>
        {images.map((image, index) => (
          <div key={index} className='relative h-96 w-full'>
            <Image
              src={image.url}
              alt={`${alt} - Image ${index + 1}`}
              layout='fill'
              objectFit='cover'
              className='rounded-lg'
            />
          </div>
        ))}
      </Slider>
      <Button
        variant='outline'
        size='icon'
        className='absolute left-2 top-1/2 transform -translate-y-1/2 z-10'
        onClick={goToPrev}
      >
        <ChevronLeft className='h-4 w-4' />
      </Button>
      <Button
        variant='outline'
        size='icon'
        className='absolute right-2 top-1/2 transform -translate-y-1/2 z-10'
        onClick={goToNext}
      >
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  );
}
