// 'use client';
// import { apiHandler } from '@/config/server';
// import React, { useState } from 'react';

// const CreateCompanyForm = () => {
//   const [companyData, setCompanyData] = useState({
//     name: '',
//     email: '',
//     phoneNumber: '',
//     address: '',
//     logo: null as File | null,
//     website: '',
//     description: '',
//   });

//   const [alertState, setAlertState] = useState<{
//     type: 'success' | 'error' | null;
//     message: string;
//   }>({ type: null, message: '' });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setCompanyData({ ...companyData, [name]: value });
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setCompanyData({ ...companyData, logo: file });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Create the company first
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const createCompanyResponse = await apiHandler<{ company: any }>(
//       '/companies',
//       'POST',
//       {
//         name: companyData.name,
//         email: companyData.email,
//         phoneNumber: companyData.phoneNumber,
//         address: companyData.address,
//         website: companyData.website,
//         description: companyData.description,
//       }
//     );

//     if (createCompanyResponse.status === 'success') {
//       const companyId = createCompanyResponse.data.company._id;

//       // Upload company logo image after company is created
//       const formData = new FormData();
//       formData.append('image', companyData.logo!);
//       formData.append('type', 'company_image');
//       formData.append('entityId', companyId);

//       const uploadResponse = await apiHandler<{ url: string }>(
//         '/image/upload',
//         'POST',
//         formData
//       );

//       if (uploadResponse.status === 'success') {
//         setAlertState({
//           type: 'success',
//           message: 'Company created and image uploaded successfully.',
//         });
//       } else {
//         setAlertState({ type: 'error', message: uploadResponse.message });
//       }
//     } else {
//       setAlertState({ type: 'error', message: createCompanyResponse.message });
//     }
//   };

//   return (
//     <div className='container mx-auto p-4'>
//       {alertState.type && (
//         <div
//           className={`alert ${alertState.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white p-4 mb-4`}
//         >
//           {alertState.message}
//         </div>
//       )}
//       <form onSubmit={handleSubmit} className='space-y-4'>
//         <div>
//           <label className='block'>Company Name</label>
//           <input
//             type='text'
//             name='name'
//             value={companyData.name}
//             onChange={handleChange}
//             required
//             className='w-full p-2 border border-gray-300 rounded'
//           />
//         </div>
//         <div>
//           <label className='block'>Email</label>
//           <input
//             type='email'
//             name='email'
//             value={companyData.email}
//             onChange={handleChange}
//             required
//             className='w-full p-2 border border-gray-300 rounded'
//           />
//         </div>
//         <div>
//           <label className='block'>Phone Number</label>
//           <input
//             type='text'
//             name='phoneNumber'
//             value={companyData.phoneNumber}
//             onChange={handleChange}
//             required
//             className='w-full p-2 border border-gray-300 rounded'
//           />
//         </div>
//         <div>
//           <label className='block'>Address</label>
//           <input
//             type='text'
//             name='address'
//             value={companyData.address}
//             onChange={handleChange}
//             required
//             className='w-full p-2 border border-gray-300 rounded'
//           />
//         </div>
//         <div>
//           <label className='block'>Website (optional)</label>
//           <input
//             type='text'
//             name='website'
//             value={companyData.website}
//             onChange={handleChange}
//             className='w-full p-2 border border-gray-300 rounded'
//           />
//         </div>
//         <div>
//           <label className='block'>Description (optional)</label>
//           <textarea
//             name='description'
//             value={companyData.description}
//             onChange={handleChange}
//             className='w-full p-2 border border-gray-300 rounded'
//           />
//         </div>
//         <div>
//           <label className='block'>Upload Company Logo</label>
//           <input
//             type='file'
//             onChange={handleImageChange}
//             accept='image/*'
//             className='w-full p-2 border border-gray-300 rounded'
//           />
//         </div>
//         <div>
//           <button
//             type='submit'
//             className='w-full bg-primary_main text-white p-2 rounded'
//           >
//             Create Company
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateCompanyForm;
'use client';
import Alert from '@/components/ui/alerts/Alert';
import { createCompany, uploadCompanyLogo } from '@/services/company/companyApiHandler';
import { useState } from 'react';


const CreateCompanyForm = () => {
const [companyData, setCompanyData] = useState({
  name: '',
  email: '',
  phoneNumber: '',
  address: '',
  logo: null as File | null,
  website: '',
  description: '',
});

  const [alertState, setAlertState] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanyData((prev) => ({ ...prev, logo: file }));
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await createCompany({
      name: companyData.name,
      email: companyData.email,
      phoneNumber: companyData.phoneNumber,
      address: companyData.address,
      website: companyData.website,
      description: companyData.description,
    });

    if (response.status === 'success') {
      const companyId = response.data.company._id as string; // _id will be returned by the server after creation

      if (companyData.logo) {
        const uploadResponse = await uploadCompanyLogo(
          companyData.logo,
          companyId
        );

        if (uploadResponse.status === 'success') {
          setAlertState({
            type: 'success',
            message: 'Company created and logo uploaded successfully.',
          });
        } else {
          setAlertState({
            type: 'error',
            message: uploadResponse.message,
          });
        }
      } else {
        setAlertState({
          type: 'success',
          message: 'Company created successfully.',
        });
      }
    } else {
      setAlertState({ type: 'error', message: response.message });
    }
  } catch {
    setAlertState({
      type: 'error',
      message: 'An error occurred while creating the company.',
    });
  }
};

  return (
    <div className='container mx-auto p-4'>
      <Alert type={alertState.type} message={alertState.message} />
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block'>Company Name</label>
          <input
            type='text'
            name='name'
            value={companyData.name}
            onChange={handleChange}
            required
            className='w-full p-2 border border-gray-300 rounded'
          />
        </div>
        <div>
          <label className='block'>Email</label>
          <input
            type='email'
            name='email'
            value={companyData.email}
            onChange={handleChange}
            required
            className='w-full p-2 border border-gray-300 rounded'
          />
        </div>
        <div>
          <label className='block'>Phone Number</label>
          <input
            type='text'
            name='phoneNumber'
            value={companyData.phoneNumber}
            onChange={handleChange}
            required
            className='w-full p-2 border border-gray-300 rounded'
          />
        </div>
        <div>
          <label className='block'>Address</label>
          <input
            type='text'
            name='address'
            value={companyData.address}
            onChange={handleChange}
            required
            className='w-full p-2 border border-gray-300 rounded'
          />
        </div>
        <div>
          <label className='block'>Website (optional)</label>
          <input
            type='text'
            name='website'
            value={companyData.website}
            onChange={handleChange}
            className='w-full p-2 border border-gray-300 rounded'
          />
        </div>
        <div>
          <label className='block'>Description (optional)</label>
          <textarea
            name='description'
            value={companyData.description}
            onChange={handleChange}
            className='w-full p-2 border border-gray-300 rounded'
          />
        </div>
        <div>
          <label className='block'>Upload Company Logo</label>
          <input
            type='file'
            onChange={handleImageChange}
            accept='image/*'
            className='w-full p-2 border border-gray-300 rounded'
          />
        </div>
        <div>
          <button
            type='submit'
            className='w-full bg-primary_main text-white p-2 rounded'
          >
            Create Company
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCompanyForm;