import DashboardLayout from '@/components/pages/AdminDashboard/DashboardLayout';
import AuthLayout from '@/components/pages/AuthLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthLayout>
  );
}
