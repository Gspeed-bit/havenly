import React, { useState } from 'react';
import { loginUser, logoutUser } from '../../../services/auth';
import { useAuthStore } from '../../../store/auth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset error on new login attempt

    if (!email || !password) {
      console.log(error);
      setError('Please enter both email and password.');
      return;
    }

    try {
      await loginUser(email, password);
      // Handle success (e.g., navigate to another page)
    } catch (error) {
      console.log(error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className='login-container'>
      {!isAuthenticated ? (
        <div>
          <h2>Login</h2>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='input-field'
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='input-field'
          />
          <button onClick={handleLogin} className='login-button'>
            Login
          </button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {user?.firstName}</h2>
          <button onClick={logoutUser} className='logout-button'>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
