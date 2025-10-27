import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { tokenStorage } from '../utils/tokenStorage';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError('Authentication failed: ' + errorParam);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (accessToken && refreshToken) {
        tokenStorage.setTokens(accessToken, refreshToken);
        navigate('/dashboard');
      } else {
        setError('Missing authentication tokens');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        {error ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
              Authentication Error
            </h2>
            <p className="text-center text-gray-700 mb-4">{error}</p>
            <p className="text-center text-sm text-gray-500">
              Redirecting to login...
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Completing Sign In...
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
