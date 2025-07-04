import Head from 'next/head';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiHeart, FiCalendar, FiUserX } from 'react-icons/fi';
import Navbar from '../components/navbar';

interface FollowedCelebrity {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  lastActivity: string;
}

export default function FanDashboard() {
  const [followedCelebrities, setFollowedCelebrities] = useState<FollowedCelebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFollowedCelebs = async () => {
    const token = localStorage.getItem('fanToken');
    const fanId = localStorage.getItem('fanId');
    const role = localStorage.getItem('fanRole');

    if (!token || !fanId || role !== 'FAN') {
      setError('Please sign in as a fan to view your dashboard.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fan/my-celebrities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowedCelebrities(res.data);
    } catch (err) {
      console.error('Failed to fetch followed celebrities', err);
      setError('Failed to load followed celebrities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowedCelebs();
  }, []);

  const handleUnfollow = async (celebId: string) => {
    const token = localStorage.getItem('fanToken');
    if (!token) return alert('Please login again.');

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/fan/unfollow/${celebId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFollowedCelebrities((prev) => prev.filter((celeb) => celeb.id !== celebId));
    } catch (err) {
      console.error('Unfollow failed:', err);
      alert('Could not unfollow. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>Fan Dashboard | CelebNetwork</title>
      </Head>

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

        {error && (
          <div className="text-red-600 text-center font-medium mb-6">{error}</div>
        )}

        {/* Followed Celebrities Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Followed Celebrities
          </h2>

          {loading ? (
            <p className="text-gray-600">Loading followed celebrities...</p>
          ) : followedCelebrities.length === 0 ? (
            <p className="text-gray-500">You're not following anyone yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {followedCelebrities.map((celebrity) => (
                <div
                  key={celebrity.id}
                  className="bg-white rounded-xl shadow p-5 flex flex-col items-center text-center"
                >
                  <img
                    src={celebrity.imageUrl}
                    alt={celebrity.name}
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src = '/images/default-avatar.jpg')
                    }
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                  <h3 className="text-lg font-bold text-gray-800">{celebrity.name}</h3>
                  <p className="text-sm text-gray-500">{celebrity.category}</p>
                  <p className="text-xs text-gray-400 mt-1">{celebrity.lastActivity}</p>

                  <button
                    onClick={() => handleUnfollow(celebrity.id)}
                    className="mt-4 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full flex items-center text-sm font-medium transition"
                  >
                    <FiUserX className="mr-2" /> Unfollow
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Upcoming Events</h2>
          <div className="text-center text-gray-500 py-10">
            <FiCalendar className="mx-auto h-10 w-10 mb-2" />
            <p>No upcoming events yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
