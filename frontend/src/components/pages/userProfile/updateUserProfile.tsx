'use client';
import { apiHandler } from '@/config/server';
import React, { useState } from 'react';
// Assuming your apiHandler is in this path

const UpdateProfile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpdateProfile = async () => {
    if (!name) {
      setErrorMessage('Please fill in your name.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('name', name); // Keep name but don't include email

    if (file) {
      formData.append('image', file);
    }

    try {
      const response = await apiHandler('/user/update', 'PUT', formData);
      if (response.status === 'success') {
        setSuccessMessage('Profile updated successfully!');
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage('An error occurred during the profile update.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        type='text'
        placeholder='Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input type='file' onChange={handleFileChange} />
      <button onClick={handleUpdateProfile} disabled={isLoading}>
        {isLoading ? 'Updating Profile...' : 'Update Profile'}
      </button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default UpdateProfile;
