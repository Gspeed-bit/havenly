import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className='bg-gray-50 pt-16 pb-4'>
      <div className='container mx-auto px-4 text-center md:text-start'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>
          {/* Company Info */}
          <div>
            <div className='flex md:justify-start items-center justify-center space-x-2 pb-3'>
              <div className='w-10 h-10 bg-primary_main rounded-full flex items-center justify-center'>
                <picture>
                  <img src='/home.png' alt='Havenly Logo' className='w-5 h-5' />
                </picture>
              </div>
              <span className='text-xl font-semibold'>Havenly</span>
            </div>
            <p className='text-gray-600 mb-4'>
              Musterstraße 123, 45127 Dortmund, Deutschland
            </p>
            <p className='text-gray-600 mb-2'>+49 206-214-2298</p>
            <p className='text-gray-600'>support@havenly.de</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='font-semibold mb-6'>Quick Links</h4>
            <ul className='space-y-4'>
              {[
                'Home',
                'About',
                'Listings',
                'Services',
                'Blogs',
                'Become an Agent',
              ].map((item) => (
                <li key={item}>
                  <Link href='/' className='text-gray-600 hover:text-gray-900'>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Discovery */}
          <div>
            <h4 className='font-semibold mb-6'>Discovery</h4>
            <ul className='space-y-4'>
              {['Canada', 'United States', 'Germany', 'Africa', 'India'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href='/'
                      className='text-gray-600 hover:text-gray-900'
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className='font-semibold mb-6'>Subscribe to our Newsletter!</h4>
            <div className='flex  sm:flex-row gap-2'>
              <Input
                type='email'
                placeholder='Email Address'
                className='bg-white'
              />
              <Button size='icon' className='bg-indigo-700 hover:bg-indigo-800'>
                <Send className='h-4 w-4' />
              </Button>
            </div>
            <div className='mt-8'>
              <h4 className='font-semibold mb-4'>Follow Us on</h4>
              <div className='flex gap-4 justify-center md:justify-start items-center'>
                {[Linkedin, Facebook, Instagram].map((Icon, idx) => (
                  <Link
                    key={idx}
                    href='#'
                    className='text-gray-600  hover:text-indigo-700'
                  >
                    <Icon className='h-6 w-6 text-primary_main' />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t pt-4 mt-8'>
          <div className='flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 text-center sm:text-left'>
            <p>© Havenly — All rights reserved</p>
            <div className='flex gap-4 mt-2 sm:mt-0'>
              {['Terms and Conditions', 'Privacy Policy', 'Disclaimer'].map(
                (item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase().replace(/\s/g, '-')}`}
                    className='hover:text-gray-900'
                  >
                    {item}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
