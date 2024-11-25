import { useCallback, useState } from 'react';

const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  const startLoading = useCallback(() => {
    setLoading(true);
  }, []);
  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  return {
    loading,
    startLoading,
    stopLoading,
  };
};

export default useLoading;
