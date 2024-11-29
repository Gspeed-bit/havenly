'use client';
import React, { useState } from 'react';
import { requestResetPassword } from '@/services/auth'; // API function

const RequestResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const response = await requestResetPassword(email);
    setIsLoading(false);

    if (response.status === 'success') {
      setMessage('Reset link sent to your email!');
    } else {
      setMessage(`Error: ${response.message}`);
    }
  };

  return (
    <div className='container flex items-center justify-center min-h-screen'>
      <form onSubmit={handleSubmit} className='space-y-4 w-full max-w-md'>
        <h1 className='text-lg font-semibold'>Reset Password</h1>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email'
          required
          className='w-full p-2 border rounded'
        />
        <button
          type='submit'
          className='w-full p-2 bg-blue-500 text-white rounded'
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
        {message && <p className='text-center'>{message}</p>}
      </form>
    </div>
  );
};

export default RequestResetPassword;
