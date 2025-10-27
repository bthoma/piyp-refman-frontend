import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">PiyP Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="text-gray-700 hover:text-gray-900"
              >
                Profile
              </button>
              {profile?.is_admin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Admin
                </button>
              )}
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome, {profile?.full_name || profile?.email}!</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {profile?.email}</p>
              <p><strong>Tier:</strong> {profile?.tier}</p>
              <p><strong>Admin:</strong> {profile?.is_admin ? 'Yes' : 'No'}</p>
              <p><strong>Monthly Budget:</strong> ${profile?.monthly_budget_usd}</p>
              <p><strong>Current Spend:</strong> ${profile?.current_month_spent_usd}</p>
              <p><strong>AI Features:</strong> {profile?.ai_features_enabled ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
