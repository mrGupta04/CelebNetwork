import { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FiUsers, FiEye, FiHeart, FiCalendar } from 'react-icons/fi';
import Navbar from '../components/navbar';

interface DashboardStats {
  fans: number;
  views: number;
  interactions: number;
  events: number;
  name?: string;
  imageUrl?: string;
}

export default function CelebrityDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('celebrityToken');
      const userId = localStorage.getItem('celebrityId');
      const role = localStorage.getItem('celebrityRole');

      console.log('Checking celebrity session:', { token, userId, role });

      if (!token || !userId || role !== 'CELEBRITY') {
        setError('Please sign in as a celebrity to view your dashboard.');
        setLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(
          `${apiUrl}/celebrity/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profile = response.data;

        // Optionally call dashboard stats if they're separate
        const statsData = await axios.get(`${apiUrl}/celebrity/dashboard/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats({
          ...statsData.data,
          name: profile.name,
          imageUrl: profile.imageUrl,
        });
      } catch (err: any) {
        console.error('Dashboard error:', err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load dashboard.');
        } else {
          setError('Failed to load dashboard.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { name: 'Fans', value: stats?.fans ?? 0, icon: FiUsers },
    { name: 'Profile Views', value: stats?.views ?? 0, icon: FiEye },
    { name: 'Fan Interactions', value: stats?.interactions ?? 0, icon: FiHeart },
    { name: 'Upcoming Events', value: stats?.events ?? 0, icon: FiCalendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>Celebrity Dashboard | CelebNetwork</title>
      </Head>

      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center text-gray-700">Loading your stats...</div>
        ) : error ? (
          <div className="text-center text-red-600 font-medium">{error}</div>
        ) : stats ? (
          <>
            {/* ✅ Profile Section */}
            <div className="flex items-center mb-10">
              <img
                src={stats.imageUrl || '/images/default-avatar.jpg'}
                alt={stats.name || 'Celebrity'}
                onError={(e) => ((e.target as HTMLImageElement).src = '/images/default-avatar.jpg')}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {stats.name || 'Celebrity'}!</h1>
                <p className="text-gray-600">Your live dashboard is below.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {cards.map(({ name, value, icon: Icon }) => (
                <div key={name} className="bg-white rounded-xl shadow p-6 flex items-center">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full mr-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{name}</p>
                    <p className="text-xl font-semibold text-gray-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Fan Engagement Graph</h2>
              <p className="text-sm text-gray-600">Coming soon: Visual insights from your fanbase.</p>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-700">No data available.</div>
        )}
      </main>
    </div>
  );
}
