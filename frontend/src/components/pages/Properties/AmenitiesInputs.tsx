import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface AmenitiesInputProps {
  value: string[];
  onChange: (amenities: string[]) => void;
}

const predefinedAmenities = [
  'Pool',
  'Gym',
  'Parking',
  'Wi-Fi',
  'Air Conditioning',
  'Elevator',
  'Balcony',
  'Garden',
  'Security System',
  'Laundry',
  'Pet Friendly',
  'Fireplace',
  'Playground',
  'BBQ Area',
  'Conference Room',
  'Sauna',
  'Jacuzzi',
  'Tennis Court',
  'Sports Court',
  'Spa',
  'Dishwasher',
  'Cable TV',
  'Furnished',
  'Smart Home Features',
  'Outdoor Kitchen',
  'Rooftop Terrace',
  'Bicycle Storage',
  'Wheelchair Accessible',
  'Shuttle Service',
  '24-Hour Concierge',
  'Clubhouse',
  'Backup Generator',
  'Solar Panels',
  'Water Heater',
  'CCTV Surveillance',
  'Covered Parking',
  'Dryer',
  'Game Room',
  'Library',
  'Movie Theater',
  'Car Charging Station',
  'Walking Trails',
  'Yoga Studio',
  'Private Entrance',
  'Storage Unit',
  'Beach Access',
  'Helipad',
];

export function AmenitiesInput({ value, onChange }: AmenitiesInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const filteredSuggestions = predefinedAmenities.filter(
      (amenity) =>
        !value.includes(amenity) &&
        amenity.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  }, [inputValue, value]);

  const addAmenity = (amenity: string) => {
    if (amenity && !value.includes(amenity)) {
      onChange([...value, amenity]);
      setInputValue('');
    }
  };

  const removeAmenity = (amenity: string) => {
    onChange(value.filter((a) => a !== amenity));
  };

  return (
    <div className='space-y-2'>
      <div className='flex space-x-2'>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder='Type or select amenities'
        />
        <Button onClick={() => addAmenity(inputValue)} type='button'>
          Add
        </Button>
      </div>
      <div className='flex flex-wrap gap-2'>
        {value.map((amenity) => (
          <Badge key={amenity} variant='secondary'>
            {amenity}
            <Button
              variant='ghost'
              size='sm'
              className='ml-2 h-4 w-4 p-0'
              onClick={() => removeAmenity(amenity)}
            >
              <X className='h-3 w-3' />
            </Button>
          </Badge>
        ))}
      </div>
      {suggestions.length > 0 && (
        <div className='flex flex-wrap gap-2 mt-2'>
          {suggestions.map((suggestion) => (
            <Badge
              key={suggestion}
              variant='outline'
              className='cursor-pointer'
              onClick={() => addAmenity(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
