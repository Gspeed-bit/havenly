import {  useAuthStore } from '../store/auth';

// Log the user out: clear token and reset auth state, only if in the browser
export const logoutUser = () => {
  // Remove the JWT token from localStorage
  localStorage.removeItem('authToken');

  // Reset the Zustand store state (clear user data and authentication state)
  useAuthStore.getState().clearUserData();

};

// Login function
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      const { token } = data;

      // Store the JWT token in localStorage
      localStorage.setItem('authToken', token);

      // Update the Zustand store state
      useAuthStore.getState().fetchUserData();
    } else {
      console.log('Login failed');
    }
  } catch (error) {
    console.error('Error logging in:', error);
  }
};


