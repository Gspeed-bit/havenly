'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@/components/hooks/api/useUser';


const ProfileUpdateForm = () => {
  const { user, loading } = useUser();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    image: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user && !loading) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        image: null,
      });
    }
  }, [user, loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files ? e.target.files[0] : null,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updateData = new FormData();
      updateData.append('firstName', formData.firstName);
      updateData.append('lastName', formData.lastName);
      updateData.append('phoneNumber', formData.phoneNumber);

      if (formData.image) {
        updateData.append('image', formData.image);
      }

      const response = await axios.put(
        `/user/update/${user?._id}`,
        updateData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      console.log(response.data);

      setSuccessMessage('Profile updated successfully');
      setFormData((prev) => ({ ...prev, image: null }));
    } catch (error) {
      setErrorMessage('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <p>Loading user data...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='firstName'>First Name</label>
        <input
          type='text'
          id='firstName'
          name='firstName'
          value={formData.firstName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor='lastName'>Last Name</label>
        <input
          type='text'
          id='lastName'
          name='lastName'
          value={formData.lastName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor='phoneNumber'>Phone Number</label>
        <input
          type='text'
          id='phoneNumber'
          name='phoneNumber'
          value={formData.phoneNumber}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor='image'>Profile Image</label>
        <input type='file' id='image' onChange={handleImageChange} />
      </div>
      <button type='submit' disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Profile'}
      </button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </form>
  );
};

export default ProfileUpdateForm;
