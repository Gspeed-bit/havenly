import { useEffect } from 'react';
import { useAuthStore } from '../../../store/auth';
import { clearAuthToken, getAuthToken } from '../../../config/helpers';
import { logOutUser } from '../../../services/auth';
import { jwtDecode } from 'jwt-decode';

// Define the type for the decoded token to ensure proper access to the `exp` field
interface DecodedToken {
  exp: number;
}

const TokenExpirationChecker = () => {
  const { isAuthenticated } = useAuthStore((state) => state);
  const token = getAuthToken();

  useEffect(() => {
    if (isAuthenticated && token) {
      const checkTokenExpiration = setInterval(() => {
        try {
          const decodedToken = jwtDecode<DecodedToken>(token); // Use the correct type
          const tokenExpirationTime = decodedToken?.exp * 1000; // Token expiration in milliseconds

          if (tokenExpirationTime && Date.now() > tokenExpirationTime) {
            clearAuthToken();
            logOutUser();
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      }, 60000); // Check every minute

      return () => clearInterval(checkTokenExpiration);
    }
  }, [isAuthenticated, token]);

  return null;
};

export default TokenExpirationChecker;
