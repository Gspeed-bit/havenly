'use client';

import React from 'react';
import Image from 'next/image';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <div className='w-full'>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className='relative h-96 w-full'>
            <Image
              src={image}
              alt={`${alt} - Image ${index + 1}`}
              layout='fill'
              objectFit='cover'
              className='rounded-lg'
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
