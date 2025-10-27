import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [timezone, setTimezone] = useState(profile?.timezone || 'UTC');
  const [aiFeatures, setAiFeatures] = useState(profile?.ai_features_enabled || false);
  const [autoIngest, setAutoIngest] = useState(profile?.auto_ingest_uploads || false);
  const [ragSearch, setRagSearch] = useState(profile?.rag_search_enabled || false);
  const [kgSearch, setKgSearch] = useState(profile?.kg_search_enabled || false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await updateProfile({
        full_name: fullName,
        timezone,
        ai_features_enabled: aiFeatures,
        auto_ingest_uploads: autoIngest,
        rag_search_enabled: ragSearch,
        kg_search_enabled: kgSearch,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">PiyP Profile</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              Profile updated successfully!
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                Timezone
              </label>
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Feature Settings</h3>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="aiFeatures"
                  checked={aiFeatures}
                  onChange={(e) => setAiFeatures(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="aiFeatures" className="ml-2 block text-sm text-gray-900">
                  Enable AI Features
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoIngest"
                  checked={autoIngest}
                  onChange={(e) => setAutoIngest(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoIngest" className="ml-2 block text-sm text-gray-900">
                  Auto-ingest Uploads
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ragSearch"
                  checked={ragSearch}
                  onChange={(e) => setRagSearch(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="ragSearch" className="ml-2 block text-sm text-gray-900">
                  Enable RAG Search
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="kgSearch"
                  checked={kgSearch}
                  onChange={(e) => setKgSearch(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="kgSearch" className="ml-2 block text-sm text-gray-900">
                  Enable Knowledge Graph Search
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
