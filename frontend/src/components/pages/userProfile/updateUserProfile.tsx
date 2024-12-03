'use client';
import { apiHandler } from '@/config/server';
import React, { useState } from 'react';

const UpdateProfile = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpdateProfile = async () => {
    // Validate required fields
    if (!firstName || !lastName || !phoneNumber) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Prepare form data
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('phoneNumber', phoneNumber);

    if (file) {
      formData.append('image', file); // Add the image if selected
    }

    try {
      // Send the form data to the API
      const response = await apiHandler('/user/update', 'PUT', formData);

      if (response.status === 'success') {
        setSuccessMessage('Profile updated successfully!');
      } else {
        setErrorMessage(response.message || 'Failed to update profile.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Update Profile</h1>

      <input
        type='text'
        placeholder='First Name'
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type='text'
        placeholder='Last Name'
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type='text'
        placeholder='Phone Number'
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
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
