// import { useEffect } from 'react';
// import useAuthStore from '../../store/auth';
// import { User } from '../../store/auth'; // Ensure this points to your User type

// export const useAuthClientSide = () => {
//   const { setAuth, clearAuth } = useAuthStore();

//   useEffect(() => {
//     // Retrieve and parse user data from localStorage
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       try {
//         const parsedUser: User = JSON.parse(storedUser);
//         setAuth(parsedUser); // Set user in Zustand store
//       } catch (err) {
//         console.error('Error parsing user data:', err);
//       }
//     }
//   }, [setAuth]);

//   const logOut = () => {
//     clearAuth();
//     localStorage.removeItem('user'); // Clear user data on logout
//   };

//   return { logOut };
// };
