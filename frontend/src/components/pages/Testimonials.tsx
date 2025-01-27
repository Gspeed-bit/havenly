'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  content: string;
  author: string;
  rating: number;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    content:
      "I highly recommend Jodi J. Appleby. She was attentive to our needs and worked tirelessly to find us the perfect home. We couldn't be happier with our new place!",
    author: 'Barbara D. Smith',
    rating: 5,
    image: '/HappyCustomer/testimony.png',
  },
  {
    content:
      'Outstanding service and professionalism. Found us exactly what we were looking for within our budget.',
    author: 'Michael R. Johnson',
    rating: 5,
    image: '/HappyCustomer/customer1.png',
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className='py-16 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          {/* Text Section */}
          <div className='flex flex-col gap-4 items-start max-w-md'>
            <h4 className='text-primary_main font-semibold uppercase'>
              Testimonials
            </h4>
            <h2 className='text-3xl font-bold text-gray-900'>
              Hear From Our Happy Clients
            </h2>
            <p className='text-gray-600'>
              See what our satisfied clients have to say about their experience
              with Havenly.
            </p>
            <div className='flex gap-2'>
              <button
                onClick={prevTestimonial}
                className='p-2 rounded-full border bg-white hover:bg-gray-50 transition-colors'
                aria-label='Previous testimonial'
              >
                <ChevronLeft className='w-6 h-6' />
              </button>
              <button
                onClick={nextTestimonial}
                className='p-2 rounded-full border bg-white hover:bg-gray-50 transition-colors'
                aria-label='Next testimonial'
              >
                <ChevronRight className='w-6 h-6' />
              </button>
            </div>
          </div>

          {/* Testimonial Card */}
          <div className='mt-8 md:mt-0'>
            <div className='bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto md:ml-auto'>
              <picture>
                <img src='/design.png' alt='icon' className='w-10 h-6 mb-4' />
              </picture>
              <p className='text-lg text-gray-700 mb-6'>
                "{testimonials[currentIndex].content}"
              </p>
              <div className='flex items-center gap-4'>
                <div className='rounded-full overflow-hidden'>
                  <Image
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].author}
                    width={50}
                    height={50}
                    className='object-cover'
                  />
                </div>
                <div>
                  <p className='font-semibold text-gray-900'>
                    {testimonials[currentIndex].author}
                  </p>
                  <div className='flex gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(testimonials[currentIndex].rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
