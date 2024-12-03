import AuthRedirectLayout from '@/components/pages/AuthRedirectLayout';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <AuthRedirectLayout>{children}</AuthRedirectLayout>
    </main>
  );
};

export default RootLayout;
