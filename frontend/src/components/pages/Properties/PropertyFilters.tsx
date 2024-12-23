'use client';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PropertyFiltersProps {
  filters: {
    city: string;
    propertyType: string;
    priceRange: string;
    rooms: string;
  };
  onFilterChange: (name: string, value: string) => void;
  isAdvancedFilter: boolean;
}

export function PropertyFilters({
  onFilterChange,
  isAdvancedFilter,
}: PropertyFiltersProps) {
  return (
    <div>
      {/* Property Type Filter */}
      <div>
        <label
          htmlFor='propertyType'
          className='block text-sm font-medium mb-2'
        >
          Property Type
        </label>
        <Select
          onValueChange={(value) => onFilterChange('propertyType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select Property Type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='House'>House</SelectItem>
            <SelectItem value='Apartment'>Apartment</SelectItem>
            <SelectItem value='Condo'>Condo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rooms Filter */}
      <div>
        <label htmlFor='rooms' className='block text-sm font-medium mb-2'>
          Rooms
        </label>
        <Select onValueChange={(value) => onFilterChange('rooms', value)}>
          <SelectTrigger>
            <SelectValue placeholder='Select Rooms' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='1'>1 Room</SelectItem>
            <SelectItem value='2'>2 Rooms</SelectItem>
            <SelectItem value='3'>3 Rooms</SelectItem>
            <SelectItem value='4+'>4+ Rooms</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters (shown when `isAdvancedFilter` is true) */}
      {isAdvancedFilter && (
        <>
          {/* Price Range Filter */}
          <div>
            <label
              htmlFor='priceRange'
              className='block text-sm font-medium mb-2'
            >
              Price Range
            </label>
            <Select
              onValueChange={(value) => onFilterChange('priceRange', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select Price Range' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='100000-200000'>100,000 - 200,000</SelectItem>
                <SelectItem value='200000-300000'>200,000 - 300,000</SelectItem>
                <SelectItem value='300000-500000'>300,000 - 500,000</SelectItem>
                <SelectItem value='500000+'>500,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* City Filter */}
          <div>
            <label htmlFor='city' className='block text-sm font-medium mb-2'>
              City
            </label>
            <Select onValueChange={(value) => onFilterChange('city', value)}>
              <SelectTrigger>
                <SelectValue placeholder='Select City' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='New York'>New York</SelectItem>
                <SelectItem value='Los Angeles'>Los Angeles</SelectItem>
                <SelectItem value='Chicago'>Chicago</SelectItem>
                <SelectItem value='Miami'>Miami</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
}
