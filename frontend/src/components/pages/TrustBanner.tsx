import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export function TrustBanner() {
  // Sample avatar data - replace with actual data in production
  const avatars = [
    { src: '/HappyCustomer/customer1.png', alt: 'User 1', fallback: 'U1' },
    { src: '/HappyCustomer/customer2.png', alt: 'User 2', fallback: 'U2' },
    { src: '/HappyCustomer/customer3.png', alt: 'User 3', fallback: 'U3' },
    { src: '/HappyCustomer/customer4.png', alt: 'User 4', fallback: 'U4' },
    { src: '/HappyCustomer/customer5.png', alt: 'User 5', fallback: 'U5' },
    { src: '/HappyCustomer/customer6.png', alt: 'User 6', fallback: 'U6' },
  ];

  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='flex flex-col md:flex-row items-center justify-center gap-8 mb-12'>
        {/* Happy Customers Section */}
        <div className='flex items-center gap-4 bg-white rounded-full px-6 py-3 shadow-sm'>
          <div className='flex -space-x-3'>
            {avatars.map((avatar, i) => (
              <Avatar key={i} className='border-2 border-white w-8 h-8'>
                <AvatarImage src={avatar.src} alt={avatar.alt} />
                <AvatarFallback>{avatar.fallback}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className='text-sm'>
            <span className='font-bold'>72k+ Happy</span>
            <br />
            Customers
          </div>
        </div>

        {/* New Listings Section */}
        <div className='flex items-center gap-4 bg-white rounded-full px-6 py-3 shadow-sm'>
          <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center'>
            <picture>
            <img
                src='/HappyCustomer/listing.png'
                alt='Home'
                className='object-cover w-full h-full'
              />
          </picture>
          </div>
          <div className='text-sm'>
            <span className='font-bold'>200+ New</span>
            <br />
            Listings Everyday!
          </div>
        </div>
      </div>

      {/* Trusted Companies Section */}
      <div className='text-center'>
        <p className='text-sm text-gray mb-8'>
          Trusted by 100+ Companies across the globe!
        </p>
        <div className='flex flex-wrap justify-center items-center gap-8 md:gap-12'>
          <Image
            src='/google.png'
            alt='Google'
            width={100}
            height={40}
            className='grayscale opacity-50 hover:opacity-100 transition-opacity'
          />
          <Image
            src='/amazon.png'
            alt='Amazon'
            width={100}
            height={40}
            className='grayscale opacity-50 hover:opacity-100 transition-opacity'
          />
          <Image
            src='/logitech.png'
            alt='Logitech'
            width={100}
            height={40}
            className='grayscale opacity-50 hover:opacity-100 transition-opacity'
          />
          <Image
            src='/spotify.png'
            alt='Spotify'
            width={100}
            height={40}
            className='grayscale opacity-50 hover:opacity-100 transition-opacity'
          />
          <Image
            src='/samsung.png'
            alt='Samsung'
            width={100}
            height={40}
            className='grayscale opacity-50 hover:opacity-100 transition-opacity'
          />
          <Image
            src='/netflix.png'
            alt='Netflix'
            width={100}
            height={40}
            className='grayscale opacity-50 hover:opacity-100 transition-opacity'
          />
        </div>
      </div>
    </div>
  );
}
