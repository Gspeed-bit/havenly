import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className='bg-gray-50 pt-16 pb-4'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-4 gap-8 mb-8'>
          {/* Company Info */}
          <div>
            <div className='flex items-center space-x-2 pb-3'>
              <div className='w-10 h-10 bg-primary_main rounded-full flex items-center justify-center'>
                <picture>
                  <img src='/home.png' alt='Havenly Logo' className='w-5 h-5' />
                </picture>
              </div>
              <span className='text-xl font-semibold'>Havenly</span>
            </div>
            <p className='text-gray-600 mb-4'>
              Musterstraße 123 45127 Dortmund Deutschland
            </p>
            <p className='text-gray-600 mb-2'>+49 206-214-2298</p>
            <p className='text-gray-600'>support@havenly.de</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='font-semibold mb-6'>Quick Links</h4>
            <ul className='space-y-4'>
              <li>
                <Link href='/' className='text-gray-600 hover:text-gray-900'>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href='/'
                  className='text-gray-600 hover:text-gray-900'
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href='/'
                  className='text-gray-600 hover:text-gray-900'
                >
                  Listings
                </Link>
              </li>
              <li>
                <Link
                  href='/'
                  className='text-gray-600 hover:text-gray-900'
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href='/'
                  className='text-gray-600 hover:text-gray-900'
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  href='/'
                  className='text-gray-600 hover:text-gray-900'
                >
                  Become a Agent
                </Link>
              </li>
            </ul>
          </div>

          {/* Discovery */}
          <div>
            <h4 className='font-semibold mb-6'>Discovery</h4>
            <ul className='space-y-4'>
              <li>
                <Link
                  href='/'
                  className='text-gray-600 hover:text-gray-900'
                >
                  Canada
                </Link>
              </li>
              <li>
                <Link
                  href='/'
                  className='text-gray-600 hover:text-gray-900'
                >
                  United States
                </Link>
              </li>
              <li>
                <Link
                  href='/'
                  className='text-gray-600 hover:text-gray-900'
                >
                  Germany
                </Link>
              </li>
              <li>
                <Link
                  href='/'
                  className='text-gray-600 hover:text-gray-900'
                >
                  Africa
                </Link>
              </li>
              <li>
                <Link
                  href='/'
                  className='text-gray-600 hover:text-gray-900'
                >
                  India
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className='font-semibold mb-6'>Subscribe to our Newsletter!</h4>
            <div className='flex gap-2'>
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
              <div className='flex gap-4'>
                <Link href='#' className='text-gray-600 hover:text-indigo-700'>
                  <Linkedin className='h-6 w-6' />
                </Link>
                <Link href='#' className='text-gray-600 hover:text-indigo-700'>
                  <Facebook className='h-6 w-6' />
                </Link>
                <Link href='#' className='text-gray-600 hover:text-indigo-700'>
                  <Instagram className='h-6 w-6' />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t pt-4 mt-8'>
          <div className='flex justify-between items-center text-sm text-gray-600'>
            <p>© Havenly — All rights reserved</p>
            <div className='flex gap-4'>
              <Link href='/terms' className='hover:text-gray-900'>
                Terms and Conditions
              </Link>
              <Link href='/privacy' className='hover:text-gray-900'>
                Privacy Policy
              </Link>
              <Link href='/disclaimer' className='hover:text-gray-900'>
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
