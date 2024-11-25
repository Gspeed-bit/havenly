'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@store/auth'; // Adjust path to your store
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname from next/navigation

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore((state) => state);
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Redirect authenticated users from login/register pages to homepage
    if (
      isAuthenticated &&
      (pathname === '/auth/login' || pathname === '/auth/register')
    ) {
      setIsRedirecting(true); // Prevent rendering during redirection
      router.push('/');
      setIsRedirecting(false); // Allow rendering after redirect
    }
  }, [isAuthenticated, pathname, router]);

  // Prevent rendering during redirection
  if (isRedirecting) {
    return null; // Optionally show a loader here
  }

  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default RootLayout;
