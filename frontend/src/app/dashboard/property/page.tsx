'use client';

import { CreatePropertyForm } from '@/components/pages/Properties/PropertyForm';
import PropertiesPage from '@/components/pages/Properties/PropertyList';


export default function PropertyPage() {


  return (
    <div>
      <CreatePropertyForm />
      <PropertiesPage />
    </div>
  );
}
