export default function OurTeam() {
  const team = [
    {
      name: 'Brendon M',
      role: 'CEO & Founder',
      image: '/team/brendon.png',
      roleColor: 'text-blue-600',
    },
    {
      name: 'Jodi J. Appleby',
      role: 'Real Estate Developer',
      image: '/team/jodi.png',
      roleColor: 'text-blue-600',
    },
    {
      name: 'Justin S. Meza',
      role: 'Listing Agent',
      image: '/team/justin.png',
      roleColor: 'text-blue-600',
    },
    {
      name: 'Susan T. Smith',
      role: "Buyer's Agent",
      image: '/team/susan.png',
      roleColor: 'text-blue-600',
    },
  ];

  return (
    <div className='bg-gray-100'>
      <section className='container mx-auto px-4 py-12 md:py-15 '>
        <div className='text-center mb-12'>
          <h2 className='text-blue-600 font-medium tracking-wide mb-2'>
            INTRODUCE YOURSELF TO
          </h2>
          <h3 className='text-2xl md:text-4xl lg:text-5xl font-bold'>
            Our Team of Experts
          </h3>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
          {team.map((member, index) => (
            <div key={index} className='flex flex-col items-center'>
              <div className='w-48 h-94 rounded-3xl overflow-hidden mb-4'>
                <picture>
                  <img
                    src={member.image}
                    alt={member.name}
                    className='w-full h-full object-cover'
                  />
                </picture>
              </div>
              <h4 className='text-xl font-bold mb-2'>{member.name}</h4>
              <p className={`${member.roleColor} font-medium`}>{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
