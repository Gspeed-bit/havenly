import Image from 'next/image';

import { Card, CardContent, CardFooter } from '@components/ui/card';
import { Bed, Bath } from 'lucide-react';
import { Badge } from '@components/ui/badge';

interface PropertyCardProps {
  image: string;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  tag?: {
    label: string;
    variant: 'default' | 'secondary' | 'destructive';
  };
}

export function PropertyCard({
  image,
  title,
  price,
  location,
  beds,
  baths,
  tag,
}: PropertyCardProps) {
  const variantStyles = {
    default: 'bg-[#3B1C8C] text-white',
    secondary: 'bg-green-600 text-white',
    destructive: 'bg-red-600 text-white',
  };

  return (
    <Card className='overflow-hidden rounded-2xl border-2 border-[#4A8CFF]'>
      <div className='relative'>
        <Image
          src={image || '/default-avatar.jpg'}
          alt={title}
          width={400}
          height={300}
          className='object-cover w-full h-[200px]'
        />
        {tag && (
          <Badge
            className={`absolute top-4 left-4 ${variantStyles[tag.variant]}`}
          >
            {tag.label}
          </Badge>
        )}
      </div>
      <CardContent className='p-4'>
        <div className='text-2xl font-bold text-[#3B1C8C]'>
          $ {price.toLocaleString()}
        </div>
        <h3 className='font-semibold line-clamp-1 text-gray-900'>{title}</h3>
        <p className='text-sm text-gray-600'>{location}</p>
      </CardContent>
      <CardFooter className='p-4 border-t border-gray-200 flex gap-4'>
        <div className='flex items-center gap-1 text-gray-600'>
          <Bed className='w-4 h-4' />
          <span className='text-sm'>{beds} Beds</span>
        </div>
        <div className='flex items-center gap-1 text-gray-600'>
          <Bath className='w-4 h-4' />
          <span className='text-sm'>{baths} Bath</span>
        </div>
      </CardFooter>
    </Card>
  );
}
