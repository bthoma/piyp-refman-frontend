import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenStorage } from '../utils/tokenStorage';
import { supabase } from '../utils/supabase';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));

      // Check for errors
      const errorParam = hashParams.get('error') || searchParams.get('error');
      const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');

      if (errorParam) {
        setError(`Authentication failed: ${errorParam}${errorDescription ? ' - ' + errorDescription : ''}`);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Check for OAuth authorization code (authorization code flow with PKCE)
      const code = searchParams.get('code');

      if (code) {
        try {
          // Use Supabase client to exchange code for session (handles PKCE automatically)
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError || !data.session) {
            throw new Error(exchangeError?.message || 'Failed to exchange code for session');
          }

          const { access_token, refresh_token } = data.session;

          // Call backend to create/update user profile
          await axios.get(`${API_URL}/api/core/auth/callback`, {
            params: {
              access_token,
              refresh_token
            }
          });

          // Store tokens and navigate
          tokenStorage.setTokens(access_token, refresh_token);
          navigate('/dashboard');
        } catch (err: any) {
          console.error('OAuth code exchange error:', err);
          setError(err.response?.data?.detail || err.message || 'Failed to complete authentication');
          setTimeout(() => navigate('/login'), 3000);
        }
        return;
      }

      // Check for direct tokens (implicit flow or email confirmation)
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (accessToken && refreshToken) {
        try {
          // Always call backend to create/update profile for any OAuth or authentication flow
          // This ensures user profiles are created for Google OAuth and other auth methods
          await axios.get(`${API_URL}/api/core/auth/callback`, {
            params: {
              access_token: accessToken,
              refresh_token: refreshToken
            }
          });

          // Store tokens and navigate
          tokenStorage.setTokens(accessToken, refreshToken);
          navigate('/dashboard');
        } catch (err: any) {
          console.error('OAuth callback error:', err);
          setError(err.response?.data?.detail || 'Failed to complete authentication');
          setTimeout(() => navigate('/login'), 3000);
        }
        return;
      }

      // No valid parameters found
      setError('Missing authentication parameters');
      setTimeout(() => navigate('/login'), 3000);
    };

    handleCallback();
  }, [navigate]);

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
