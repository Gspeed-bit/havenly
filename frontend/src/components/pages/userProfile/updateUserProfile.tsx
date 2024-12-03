'use client';
import React, { useState } from 'react';

const UpdateProfile = ({
  user,
}: {
  user: { _id: string; isAdmin: boolean };
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    image: null as File | null,
    pin: '', // Only used for admins
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    const files = (e.target as HTMLInputElement).files;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value as string | Blob);
    });

    try {
      const response = await fetch('/user/update', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: payload,
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage(result.message);
      } else {
        setErrorMessage(result.message || 'Failed to update profile.');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setErrorMessage('An error occurred while updating the profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div>
        <label>First Name:</label>
        <input type='text' name='firstName' onChange={handleChange} />
      </div>
      <div>
        <label>Last Name:</label>
        <input type='text' name='lastName' onChange={handleChange} />
      </div>
      <div>
        <label>Phone Number:</label>
        <input type='text' name='phoneNumber' onChange={handleChange} />
      </div>
      <div>
        <label>Profile Image:</label>
        <input
          type='file'
          name='image'
          accept='image/*'
          onChange={handleChange}
        />
      </div>
      {user.isAdmin && (
        <div>
          <label>Admin PIN:</label>
          <input type='text' name='pin' onChange={handleChange} />
        </div>
      )}
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Profile'}
      </button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </form>
  );
};

export default UpdateProfile;
