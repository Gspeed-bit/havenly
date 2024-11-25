'use client';
import React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Icon from '../icons/Icon';
import { PropertyCard } from './property/PropertyCard';

const MainContent = () => {
  return (
    <main className='container mx-auto px-4 mt-16 relative z-10'>
      <div className='grid grid-cols-1 items-center justify-center lg:grid-cols-2 gap-10'>
        {/* Left Section */}
        <div>
          <h2 className='text-primary_main text-sm font-semibold tracking-wider mb-4'>
            REAL ESTATE
          </h2>
          <h1 className='text-5xl font-bold leading-tight mb-6'>
            Find a perfect
            <br />
            home you love..!
          </h1>
          <p className='text-gray-600 mb-8 leading-relaxed'>
            Etiam eget elementum elit. Aenean dignissim dapibus vestibulum.
            <br />
            Integer a dolor eu sapien sodales vulputate ac in purus.
          </p>
          <div className='relative'>
            <div className='relative z-10 rounded-2xl overflow-hidden max-w-xl'>
              {/* Carousel Navigation Buttons */}
              <div className='absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full aspect-square w-10 flex items-center justify-center shadow-lg cursor-pointer'>
                <Icon
                  type={'ChevronLeft'}
                  color={'#3A0CA3'}
                  strokeWidth={1.75}
                  className='size-5'
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
              <div className='absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full aspect-square w-10 flex items-center justify-center shadow-lg cursor-pointer'>
                <Icon
                  type={'ChevronRight'}
                  color={'#3A0CA3'}
                  strokeWidth={1.75}
                  className='size-5'
                />
              </div>
              {/* Carousel Indicators */}
              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2'>
                <div className='w-8 h-1 bg-primary_main rounded-full' />
                <div className='w-8 h-1 bg-veryLightGray rounded-full' />
                <div className='w-8 h-1 bg-veryLightGray rounded-full' />
              </div>
            </div>
            <div className='absolute -top-7 -right-3 md:-top-10 md:right-32'>
              <picture>
                <img
                  src='/Ellipse.png'
                  alt='Rezilla Logo'
                  className='text-white  md:w-15 md:h-15'
                />
              </picture>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className='relative'>
          <Card className='shadow-lg bg-white border-none relative z-10 rounded-2xl max-w-[35rem] min-h-[400px]'>
            <CardContent className='p-6 space-y-9'>
              <Tabs
                defaultValue='sale'
                className='w-full mb-6 border-b border-b-veryLightGray'
              >
                <TabsList className='grid w-full grid-cols-2 bg-transparent p-1 '>
                  <TabsTrigger
                    value='sale'
                    className='rounded-full data-[state=active]:bg-primary_main data-[state=active]:text-white'
                  >
                    For Sale
                  </TabsTrigger>
                  <TabsTrigger
                    value='rent'
                    className='rounded-full data-[state=active]:bg-[#3B1C8C] data-[state=active]:text-white'
                  >
                    For Rent
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className='space-y-6'>
                <Input
                  type='text'
                  placeholder='New York, San Francisco, etc'
                  className='w-full bg-gray-50 rounded-full'
                />
                <Select>
                  <SelectTrigger className='rounded-full'>
                    <SelectValue placeholder='Select Property Type' />
                  </SelectTrigger>
                  <SelectContent className='border-none'>
                    <SelectItem value='house'>House</SelectItem>
                    <SelectItem value='apartment'>Apartment</SelectItem>
                    <SelectItem value='condo'>Condo</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className=' rounded-full'>
                    <SelectValue className='' placeholder='Select Rooms' />
                  </SelectTrigger>
                  <SelectContent className='border-none'>
                    <SelectItem value='1'>1 Room</SelectItem>
                    <SelectItem value='2'>2 Rooms</SelectItem>
                    <SelectItem value='3'>3 Rooms</SelectItem>
                    <SelectItem value='4'>4+ Rooms</SelectItem>
                  </SelectContent>
                </Select>
                <div className='text-sm text-[#3B1C8C] font-medium cursor-pointer hover:underline flex gap-2 items-center'>
                  <Icon
                    type={'SlidersVertical'}
                    color={'#3B1C8C'}
                    strokeWidth={1.75}
                    className='size-4'
                  />
                  <span> Advance Search</span>
                </div>
                <Button
                  className='w-full bg-[#3B1C8C] hover:bg-[#2F1670] text-white rounded-full'
                  size='lg'
                >
                  <Icon
                    type={'Search'}
                    color={'#ffffff'}
                    strokeWidth={1.75}
                    className='size-4'
                  />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className='hidden lg:flex absolute -right-8 -bottom-8 w-24 h-24 bg-[#4A8CFF] rounded-full opacity-20' />
        </div>
      </div>
      <div className='grid mt-10 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <PropertyCard
          image='/room.png'
          title='Tranquil Haven in the Woods'
          price={5970}
          location='123 Wright Courtberlin, WA 98168'
          beds={4}
          baths={3}
          tag={{ label: 'Popular', variant: 'destructive' }}
        />
        <PropertyCard
          image='/room.png'
          title='Serene Retreat by the Lake'
          price={1970}
          location='1654 Jehovah Drive, VA 22408'
          beds={3}
          baths={2}
          tag={{ label: 'New Listing', variant: 'default' }}
        />
        <PropertyCard
          image='/room.png'
          title='Charming Cottage in the Meadow'
          price={3450}
          location='1608 Centenial Farm RoadPoston, 51537'
          beds={4}
          baths={4}
          tag={{ label: 'Discounted Price', variant: 'secondary' }}
        />
        <PropertyCard
          image='/room.png'
          title='Grand Estate'
          price={2389}
          location='123 Wright Court'
          beds={4}
          baths={3}
          tag={{ label: 'Popular', variant: 'destructive' }}
        />
      </div>
    </main>
  );
};

export default MainContent;
