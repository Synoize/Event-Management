import { useEffect, useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

const AdminDashboard = () => {
  const { stats, getStats, loading } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    getStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Total Participants</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalParticipants || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Total Organizers</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrganizers || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEvents || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalRevenue || 0}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('organizers')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'organizers'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Organizers
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'events'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Events
          </button>
        </div>

        <div className="mt-4">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
              <p className="text-gray-600">
                Welcome to the admin dashboard. Use the tabs above to manage users, organizers, and events.
              </p>
            </div>
          )}
          {/* Add other tab content here */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

