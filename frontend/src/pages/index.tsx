// pages/index.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';
import CelebrityCard from './components/celebritycard';
import Navbar from './components/navbar';

interface Celebrity {
  id: string;
  name: string;
  category: string;
  fanbase: number;
  country: string;
  imageUrl: string;
}

export default function Home() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCelebrities = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem('fanToken');

        if (!apiUrl) throw new Error('API URL not defined');
        if (!token) throw new Error('User not authenticated');

        const { data } = await axios.get<Celebrity[]>(`${apiUrl}/fan/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCelebrities(data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchCelebrities();
  }, []);

  // Filter celebrities based on search input
  const filteredCelebrities = celebrities.filter((celeb) =>
    celeb.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>CelebNetwork | Discover Stars</title>
      </Head>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Your Favorite Celebrities
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with top performers from around the world
          </p>
        </div>

        <div className="relative max-w-lg mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search celebrities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
          />
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-semibold">{error}</div>
        ) : filteredCelebrities.length === 0 ? (
          <div className="text-center text-gray-600 font-medium">No celebrities found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCelebrities.map((celebrity) => (
              <CelebrityCard key={celebrity.id} celebrity={celebrity} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
