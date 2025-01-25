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
    rating: 4.5,
    image: '/placeholder.svg?height=40&width=40',
  },
  {
    content:
      'Outstanding service and professionalism. Found us exactly what we were looking for within our budget.',
    author: 'Michael R. Johnson',
    rating: 5,
    image: '/placeholder.svg?height=40&width=40',
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
    <section className='py-16'>
      <div className='container mx-auto  px-4'>
        <div className='flex justify-between item-center'>
          <div className='flex flex-col gap-3 items-start'>
            <div className='max-w-md'>
              <h4 className='text-primary_main font-semibold mb-2'>
                TESTIMONIALS
              </h4>
              <h2 className='text-3xl font-bold mb-4'>
                Look What Our Customers Say!
              </h2>
              <p className='text-gray-600'>
                Fusce venenatis tellus a felis scelerisque, non pulvinar est
                pellentesque.
              </p>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={prevTestimonial}
                className='p-2 rounded-full border hover:bg-gray-50 transition-colors'
                aria-label='Previous testimonial'
              >
                <ChevronLeft className='w-6 h-6' />
              </button>
              <button
                onClick={nextTestimonial}
                className='p-2 rounded-full border hover:bg-gray-50 transition-colors'
                aria-label='Next testimonial'
              >
                <ChevronRight className='w-6 h-6' />
              </button>
            </div>
          </div>

          <div className='mt-1'>
            <div className='bg-white rounded-xl shadow-lg p-8 max-w-2xl ml-auto'>
              <div className='mb-1'>
                <p className='text-lg'>{testimonials[currentIndex].content}</p>
              </div>
              <div className='flex items-center gap-4'>
                <div className='rounded-full overflow-hidden'>
                  <Image
                    src={testimonials[currentIndex].image || '/placeholder.svg'}
                    alt={testimonials[currentIndex].author}
                    width={40}
                    height={40}
                    className='object-cover'
                  />
                </div>
                <div>
                  <p className='font-semibold'>
                    {testimonials[currentIndex].author}
                  </p>
                  <div className='flex gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonials[currentIndex].rating
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
