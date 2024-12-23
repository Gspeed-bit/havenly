import AppWrapper from '@/components/AppWrapper';
import Authenticated from '@/components/authLayout/Authenticated';
import DashboardLayout from '@/components/pages/AdminDashboard/DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Authenticated accessLevel='admin'>
      <AppWrapper isAdmin={true}>
        <DashboardLayout>{children}</DashboardLayout>
      </AppWrapper>
    </Authenticated>
  );
}
