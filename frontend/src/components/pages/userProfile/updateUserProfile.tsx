'use client';
import { useState, useEffect } from 'react';
import { apiHandler, SuccessResponse } from '@/config/server'; // Your API handler
import { getAuthToken } from '@/config/helpers'; // Your helper to get auth token

interface UserProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  imgUrl: string;
}

const UserProfileForm: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    imgUrl: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [previewImgUrl, setPreviewImgUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Fetch existing user profile to populate the form (optional)
    const fetchUserProfile = async () => {
      // Call the API to fetch the user profile (you can update with your actual API call)
      const response = await apiHandler<SuccessResponse<{ user: UserProfile }>>(
        '/user/me', // Adjust with your actual endpoint
        'GET',
        {}
      );

      if (response.status === 'success') {
        setUserProfile(response.data.data?.user);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImgUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload
  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('type', 'user_image');
    formData.append('entityId', getAuthToken() || 'default-entity-id'); // Use actual user ID

    try {
      const response = await apiHandler<SuccessResponse<{ url: string }>>(
        '/image/upload', // Your image upload endpoint
        'POST',
        formData
      );

      if (response.status === 'error') {
        throw new Error(response.message);
      }

      return response.data.url;
    } catch (err) {
      setError('Error uploading image');
      throw err;
    }
  };

  // Handle form submission to update user profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !userProfile.firstName ||
      !userProfile.lastName ||
      !userProfile.phoneNumber
    ) {
      setError('Please fill out all fields');
      return;
    }

    try {
      setIsLoading(true);
      let imageUrl = userProfile.imgUrl;

      // If a new image was selected, upload it and get the URL
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const updatedProfile = {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        phoneNumber: userProfile.phoneNumber,
        imgUrl: imageUrl, // Set the image URL after upload
      };

      const response = await apiHandler<SuccessResponse<{ user: UserProfile }>>(
        '/user/update', // Your profile update endpoint
        'PUT',
        updatedProfile
      );

      if (response.status === 'error') {
        throw new Error(response.message);
      }

      // Handle successful response (e.g., show success message or update UI)
      console.log('Profile updated successfully', response.data.data.user);
      // Optionally, you can update the state with the new user data
      setUserProfile(response.data.data.user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Error updating profile');
  
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            type='text'
            name='firstName'
            value={userProfile?.firstName || ''}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Last Name</label>
          <input
            type='text'
            name='lastName'
            value={userProfile?.lastName || ''}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Phone Number</label>
          <input
            type='text'
            name='phoneNumber'
            value={userProfile?.phoneNumber || ''}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Profile Image</label>
          <input type='file' accept='image/*' onChange={handleImageChange} />
          {previewImgUrl && (
            <picture>
              <img
                src={previewImgUrl}
                alt='Image Preview'
                width='100'
                height='100'
              />
            </picture>
          )}
        </div>

        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UserProfileForm;
