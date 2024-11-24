import React, { useState } from 'react';
import { login, logOutUser } from '../../../services/auth';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/auth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { isAuthenticated } = useAuthStore((state) => state);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const credentials = { email, password };

    const result = await login(credentials);

    if (result.status === 'success') {
      router.push('/'); // Redirect to the dashboard page
    } else {
      setErrorMessage(result.message);
    }
  };

  if (isAuthenticated) {
    return (
      <div>
        <h2>Welcome, You are logged in!</h2>
        <button onClick={logOutUser}>Log Out</button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <div className='error'>{errorMessage}</div>}
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
