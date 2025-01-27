import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Users } from 'lucide-react';

export default function Page() {
  return (
    <div className='container mx-auto px-4 py-12 min-h-screen'>
      <div className='grid gap-12 items-center lg:grid-cols-2'>
        {/* Left Column */}
        <div className='space-y-8'>
          <span className='text-[#4169E1] font-medium text-sm md:text-base'>
            WHO ARE WE
          </span>

          <h1 className='text-3xl sm:text-3xl md:text-4xl font-bold leading-tight'>
            Helping You Find the Perfect Home with Ease.
          </h1>

          <p className='text-gray-600 text-base sm:text-lg'>
            At Havenly, we simplify the real estate journey by connecting buyers
            with their dream homes. Whether you're searching for a cozy
            apartment or a luxury villa, our platform ensures a seamless
            experience tailored to your needs.
          </p>

          <div className='hidden md:flex flex-col-reverse lg:flex-col gap-6'>
            <Card className='border-0 shadow-lg'>
              <CardContent className='flex gap-4 p-6'>
                <div className='text-[#4169E1]'>
                  <Home className='w-6 h-6' />
                </div>
                <div className='space-y-2'>
                  <h3 className='text-[#4169E1] font-medium text-lg'>
                    Seamless Property Search
                  </h3>
                  <p className='text-gray-600 text-sm sm:text-base'>
                    Explore thousands of listings with advanced filters to find
                    the perfect match for your lifestyle.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className='border-0 shadow-lg'>
              <CardContent className='flex gap-4 p-6'>
                <div className='text-[#4169E1]'>
                  <Users className='w-6 h-6' />
                </div>
                <div className='space-y-2'>
                  <h3 className='text-[#4169E1] font-medium text-lg'>
                    Trusted by Homeowners
                  </h3>
                  <p className='text-gray-600 text-sm sm:text-base'>
                    Our platform is backed by a community of satisfied buyers,
                    sellers, and real estate professionals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Images Grid */}
        <div className='relative mt-5 flex items-center justify-center'>
          {/* Curved Text */}
          <div className='absolute right-30 -top-14 w-32 h-32 sm:w-48 sm:h-48 z-10'>
            <div className='absolute inset-0 animate-spin-slow'>
              <svg viewBox='0 0 100 100' className='w-full h-full'>
                <path
                  id='curve'
                  d='M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0'
                  fill='none'
                  stroke='none'
                />
                <text className='text-[9px] sm:text-xs fill-[#4361EE]'>
                  {' '}
                  <textPath href='#curve' startOffset='0%'>
                    Since 2022 - Havenly - Find Your Dream Home - Since 2022 -
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
          {/* Main Image */}
          <div className='flex -space-x-6'>
            <div className='max-w-[80%] md:w-[60%] max-h-[60%] relative'>
              <picture>
                <img
                  src='/whoweare/image.png'
                  alt='Modern house with a pool'
                  className='rounded-2xl h-[400px] md:h-[600px] min-w-[200px] w-full '
                />
              </picture>
            </div>

            {/* Secondary Images */}
            <div className='flex flex-col md: space-y-5 md:-space-y-2'>
              <picture>
                <img
                  src='/whoweare/image1.png'
                  alt='Cozy bedroom'
                  className='rounded-xl h-[240px] md:h-[250px] md:w-[340px] min-w-[160px] '
                />
              </picture>
              <picture>
                <img
                  src='/whoweare/image2.png'
                  alt='Stylish living room'
                  className='rounded-xl h-[150px] md:h-[250px]  md:w-[340px] min-w-[160px] '
                />
              </picture>
            </div>
          </div>
        </div>
        <div className='flex md:hidden flex-col-reverse lg:flex-col gap-6'>
          <Card className='border-0 shadow-lg'>
            <CardContent className='flex gap-4 p-6'>
              <div className='text-[#4169E1]'>
                <Home className='w-6 h-6' />
              </div>
              <div className='space-y-2'>
                <h3 className='text-[#4169E1] font-medium text-lg'>
                  Seamless Property Search
                </h3>
                <p className='text-gray-600 text-sm sm:text-base'>
                  Explore thousands of listings with advanced filters to find
                  the perfect match for your lifestyle.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-lg'>
            <CardContent className='flex gap-4 p-6'>
              <div className='text-[#4169E1]'>
                <Users className='w-6 h-6' />
              </div>
              <div className='space-y-2'>
                <h3 className='text-[#4169E1] font-medium text-lg'>
                  Trusted by Homeowners
                </h3>
                <p className='text-gray-600 text-sm sm:text-base'>
                  Our platform is backed by a community of satisfied buyers,
                  sellers, and real estate professionals.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
