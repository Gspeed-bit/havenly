import React, { useState, useEffect } from 'react';
import { login, logOutUser } from '../../../services/auth';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/auth';
import TokenExpirationChecker from '../../../components/pages/login/TokenExpirationChecker'; // Import the TokenExpirationChecker

const LoginForm = () => {
  const [hydrated, setHydrated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    setHydrated(true);
  }, []);

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

  if (!hydrated) return null; // Avoid rendering before hydration

  if (isAuthenticated) {
    return (
      <div>
        <h2>Welcome, You are logged in!</h2>
        <button onClick={logOutUser}>Log Out</button>
        <TokenExpirationChecker />{' '}
        {/* Add the TokenExpirationChecker component */}
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
