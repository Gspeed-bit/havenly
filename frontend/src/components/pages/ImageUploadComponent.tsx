import React, { useState } from 'react';

const UploadImage = ({
  entityId,
  entityType,
}: {
  entityId: string;
  entityType: string;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatusMessage('Please select an image to upload.');
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', entityType);
    formData.append('entityId', entityId);

    try {
      const response = await fetch('/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setStatusMessage('Image uploaded successfully!');
      } else {
        setStatusMessage(data.message || 'Upload failed.');
      }
    } catch (error) {
      console.log(error);
      setStatusMessage('An error occurred during upload.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input type='file' onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Upload'}
      </button>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default UploadImage;
