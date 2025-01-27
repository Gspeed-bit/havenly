import { Button } from '@/components/ui/button';

export function BecomeAgent() {
  return (
    <div className='bg-gray-100'>
      <section className='container  mx-auto p-10 '>
        <div className='bg-primary_main rounded-2xl relative overflow-visible'>
          {/* Background Decorative Elements */}
          <div className='absolute top-[40px] right-10 w-20 h-20 bg-[#4F2CD9] rounded-full -translate-y-1/2 translate-x-1/2 opacity-30' />
          <div className='absolute md:bottom-[100px] bottom-[130px] md:left-[260px] left-[70px] md:w-32 md:h-32 w-20 h-20 bg-[#a699e6] rounded-full translate-y-1/2 opacity-20' />

          {/* Updated: Reverse only on mobile */}
          <div className='flex flex-col-reverse md:flex-row items-center z-10 relative'>
            {/* Image Section */}
            <div className='md:w-[40%] md:h-[190px] md:relative w-full flex items-center justify-center h-[250px]'>
              <div className='absolute md:-top-[49px] md:left-5 z-20'>
                <picture>
                  <img
                    src='/agent.png'
                    alt='Become an agent'
                    className='object-cover md:h-[320px] md:w-[300px] h-[250px]'
                  />
                </picture>
              </div>
            </div>

            {/* Content Section */}
            <div className='md:w-[60%] p-10'>
              <div className='max-w-xl'>
                <h2 className='text-3xl font-bold text-white mb-6'>
                  Become an Agent and Elevate Your Career
                </h2>
                <p className='text-md text-white/90 mb-8 leading-relaxed'>
                  Are you passionate about real estate and helping clients find
                  their dream homes? Join <strong>Havenly</strong> and gain
                  access to premium listings, powerful marketing tools, and an
                  extensive network to help you succeed.
                </p>

                <Button
                  size='lg'
                  variant='secondary'
                  className='bg-white rounded-full text-[#4318FF] hover:bg-gray-100 md:font-[500] font-[400] md:px-5 md:py-5 px-4 py-4 md:text-lg text-md'
                >
                  Register Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
