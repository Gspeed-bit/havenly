'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { TrustBanner } from './TrustBanner';
import { PropertyListForUser } from './Properties/PropertyListForUser';
import { PropertyFilters } from './Properties/PropertyFilters';
import Icon from '../common/icon/icons';
import { useUserStore } from '@/store/users';
import { Testimonials } from './Testimonials';
import { BecomeAgent } from './userProfile/BecomeAgent';
import { Footer } from './Footer';
import OurTeam from './Our-team';
import WhoAreWe from './WhoWeAre';

const MainContent = () => {
  const [filters, setFilters] = useState({
    city: '',
    propertyType: '',
    priceRange: '',
    rooms: '',
  });

  const [isAdvancedFilter, setIsAdvancedFilter] = useState(false);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      city: '',
      propertyType: '',
      priceRange: '',
      rooms: '',
    });
  };

  const isFilterApplied = Object.values(filters).some((value) => value !== '');

  const user = useUserStore((state) => state.user);
  const isAdmin = user?.isAdmin === true;

  return (
    <>
      <main className='container mx-auto px-4 mt-8 sm:mt-16 relative z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center'>
          {/* Left Section */}
          <div className='order-2 lg:order-1'>
            <h2 className='text-primary_main text-sm font-semibold tracking-wider mb-4'>
              DREAM HOMES AWAIT
            </h2>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6'>
              Discover Your Perfect
              <br />
              Living Space Today!
            </h1>
            <p className='text-gray-600 mb-8 leading-relaxed'>
              Start your journey to finding a home that fits your lifestyle.
              <br className='hidden sm:block' />
              Whether you're looking for a cozy apartment or a spacious villa,
              we have something for you.
            </p>
          </div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center'>
          <div className='relative max-w-xl mx-auto lg:mx-0'>
            <div className='relative z-10 rounded-2xl overflow-hidden'>
              {/* Carousel Navigation Buttons */}
              <div className='absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full aspect-square w-8 sm:w-10 flex items-center justify-center shadow-lg cursor-pointer'>
                <Icon
                  type={'ChevronLeft'}
                  color={'#3A0CA3'}
                  strokeWidth={1.75}
                  className='size-4 sm:size-5'
                />
              </div>

              <picture>
                <img
                  src='/hero_image.png'
                  alt='Luxury Bedroom'
                  className='w-full h-auto object-cover rounded-2xl'
                />
              </picture>

              {/* Carousel Navigation Buttons */}
              <div className='absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full aspect-square w-8 sm:w-10 flex items-center justify-center shadow-lg cursor-pointer'>
                <Icon
                  type={'ChevronRight'}
                  color={'#3A0CA3'}
                  strokeWidth={1.75}
                  className='size-4 sm:size-5'
                />
              </div>
              {/* Carousel Indicators */}
              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2'>
                <div className='w-6 sm:w-8 h-1 bg-primary_main rounded-full' />
                <div className='w-6 sm:w-8 h-1 bg-veryLightGray rounded-full' />
                <div className='w-6 sm:w-8 h-1 bg-veryLightGray rounded-full' />
              </div>
            </div>
          </div>
          {/* Right Section */}
          <div className=''>
            <Card className='shadow-lg bg-white border-none relative z-10 rounded-2xl max-w-[35rem] mx-auto lg:ml-auto min-h-[400px]'>
              <CardContent className='p-4 sm:p-6 space-y-6 sm:space-y-9'>
                <Tabs
                  defaultValue='sale'
                  className='w-full mb-4 sm:mb-6 border-b border-b-veryLightGray'
                >
                  <TabsList className='grid w-full grid-cols-1 bg-transparent p-1'>
                    <TabsTrigger
                      value='sale'
                      className='rounded-full data-[state=active]:bg-primary_main data-[state=active]:text-white'
                    >
                      For Sale
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className='space-y-4 sm:space-y-6'>
                  <PropertyFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    isAdvancedFilter={isAdvancedFilter}
                  />
                </div>

                {/* Toggle for Advanced Filters */}
                <div className='mt-4'>
                  <button
                    onClick={() => setIsAdvancedFilter((prev) => !prev)}
                    className='text-primary_main font-semibold hover:underline'
                  >
                    {isAdvancedFilter ? (
                      'Show Basic Filters'
                    ) : (
                      <div className='text-sm text-[#3B1C8C] font-medium cursor-pointer hover:underline flex gap-2 items-center'>
                        <Icon
                          type={'SlidersHorizontal'}
                          color={'#3B1C8C'}
                          strokeWidth={1.75}
                          className='size-4'
                        />
                        <span> Advance Search</span>
                      </div>
                    )}
                  </button>
                </div>

                {/* Reset Filters Button */}
                {isFilterApplied && (
                  <button
                    onClick={resetFilters}
                    className='mt-4 text-primary_main font-semibold hover:underline'
                  >
                    Clear Filters
                  </button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <TrustBanner />

        {!isAdmin && <PropertyListForUser filters={filters} />}
      </main>
      <WhoAreWe />
      <OurTeam />
      <Testimonials />
      <BecomeAgent />
      <Footer />
    </>
  );
};

export default MainContent;
