import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function BecomeAgent() {
  return (
    <section className='container mx-auto px-4 mb-20'>
      <div className='bg-primary_main rounded-2xl relative overflow-visible'>
        {/* Background Decorative Elements */}
        <div className='absolute top-[40px] right-10  w-20 h-20 bg-[#4F2CD9] rounded-full -translate-y-1/2 translate-x-1/2 opacity-30' />
        <div className='absolute bottom-[100px] left-[300px] w-32 h-32 bg-[#4F2CD9] rounded-full translate-y-1/2 opacity-20' />
        <div className='flex items-center z-10 relative'>
          {/* Image Section */}
          <div className='w-[40%] h-[190px] relative'>
            <div className='absolute -top-[89px] left-5 z-20'>
              <picture>
                <img
                  src='/agent.png'
                  alt='Become an agent'
                  className='object-cover h-[320px] w-[300px] '
                />
              </picture>
            </div>
          </div>

          {/* Content Section */}
          <div className='w-[60%] p-10'>
            <div className='max-w-xl'>
              <h2 className='text-3xl font-bold text-white mb-6'>
                Become an Agent.
              </h2>
              <p className='text-md text-white/90 mb-8 leading-relaxed'>
                Fusce venenatis tellus a felis scelerisque. Venenatis tellus a
                felis scelerisque.
              </p>
              <Button
                size='lg'
                variant='secondary'
                className='bg-white text-[#4318FF] hover:bg-gray-100 font-semibold px-5 py-6 text-lg'
              >
                Register Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
