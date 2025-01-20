import Authenticated from '@/components/authLayout/Authenticated';
import DashboardLayout from '@/components/pages/AdminDashboard/DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Authenticated accessLevel='admin'>
      <DashboardLayout>{children}</DashboardLayout>
    </Authenticated>
  );
}
