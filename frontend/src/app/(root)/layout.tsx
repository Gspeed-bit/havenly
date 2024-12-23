import AppWrapper from '@/components/AppWrapper';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppWrapper isAdmin={false}>{children}</AppWrapper>;
}
