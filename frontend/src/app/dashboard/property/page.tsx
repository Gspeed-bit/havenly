'use client';
import PropertyForm from '@/components/pages/Properties/PropertyForm';
import PropertiesPage from '@/components/pages/Properties/PropertyList';
import { useRouter } from 'next/navigation';

export default function PropertyPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Example: Navigate to the properties list or reload the current page
    router.push('/dashboard/property'); // Redirect to properties page
    // or router.refresh(); // Refresh the current page
  };

  return (
    <div>
      <PropertyForm onSuccess={handleSuccess} />
      <PropertiesPage />
    </div>
  );
}
