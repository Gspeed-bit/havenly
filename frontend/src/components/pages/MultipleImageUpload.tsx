'use client';

import React from 'react';

interface MultipleImageUploadProps {
  images: File[];
  previews: string[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  setPreviews: React.Dispatch<React.SetStateAction<string[]>>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Add this line
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  images,
  previews,
  setImages,
  setPreviews,
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      setPreviews(files.map((file) => URL.createObjectURL(file)));
    }
  };

  return (
    <div className='multiple-image-upload'>
      <input
        type='file'
        accept='image/*'
        multiple
        onChange={handleImageChange}
      />
      <div className='previews'>
        {previews.map((src, idx) => (
          <picture key={idx}>
            <img
              src={src}
              alt={`Preview ${idx}`}
              style={{ maxWidth: '100px' }}
            />
          </picture>
        ))}
      </div>
    </div>
  );
};

export default MultipleImageUpload;
