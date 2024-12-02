'use client';

import { useUser } from '@/components/hooks/api/useUser';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const UserList = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    // Ensure the component is hydrated
    setIsHydrated(true);

    // Navigate to login page if not authenticated
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Prevent rendering on the server
  if (!isHydrated) {
    return null; // Render nothing until hydrated
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>; // Optionally show a loading state while redirecting
  }

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Profile</h1>
      <div className='bg-white shadow rounded p-6'>
        <picture>
          <img
            src={user?.imgUrl}
            alt='Profile'
            className='w-24 h-24 rounded-full mb-4'
          />
        </picture>
        <p>
          <strong>Name:</strong> {user?.firstName} {user?.lastName}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Phone:</strong> {user?.phoneNumber}
        </p>
      </div>
    </div>
  );
};

export default UserList;

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
// import { useAuthStore } from '@/store/auth';

// const UserList = () => {
//   const router = useRouter();
//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
//   const user = useAuthStore((state) => state.user);

//   // State to manage hydration
//   const [isHydrated, setIsHydrated] = useState(false);

//   useEffect(() => {
//     // Ensure the component is hydrated
//     setIsHydrated(true);

//     // Navigate to login page if not authenticated
//     if (!isAuthenticated) {
//       router.push('/');
//     }
//   }, [isAuthenticated, router]);

//   // Prevent rendering on the server
//   if (!isHydrated) {
//     return null; // Render nothing until hydrated
//   }

//   if (!isAuthenticated) {
//     return <div>Loading...</div>; // Optionally show a loading state while redirecting
//   }

//   if (!user) {
//     return <div>You are not authorized to view this page. Please log in.</div>;
//   }

//   return (
//     <div className='max-w-4xl mx-auto p-4'>
//       <h1 className='text-2xl font-bold mb-4'>Profile</h1>
//       <div className='bg-white shadow rounded p-6'>
//         <picture>
//           <img
//             src={user.imgUrl}
//             alt='Profile'
//             className='w-24 h-24 rounded-full mb-4'
//           />
//         </picture>
//         <p>
//           <strong>Name:</strong> {user.firstName} {user.lastName}
//         </p>
//         <p>
//           <strong>Email:</strong> {user.email}
//         </p>
//         <p>
//           <strong>Phone:</strong> {user.phoneNumber}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default UserList;
