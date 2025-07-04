import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import {
  FiInstagram,
  FiYoutube,
  FiTwitter,
  FiDownload,
  FiMapPin,
  FiUserPlus,
} from 'react-icons/fi';
import Navbar from '../components/navbar';

interface Celebrity {
  id: string;
  name: string;
  category: string;
  bio: string;
  country: string;
  fanbase: number;
  imageUrl: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
}

export default function CelebrityProfile() {
  const router = useRouter();
  const { id } = router.query;

  const [celebrity, setCelebrity] = useState<Celebrity | null>(null);
  const [fanId, setFanId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchCelebrity = async () => {
      try {
        const res = await axios.get<Celebrity>(
          `${process.env.NEXT_PUBLIC_API_URL}/celebrity/${id}`
        );
        setCelebrity(res.data);
      } catch (error) {
        console.error('Error fetching celebrity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCelebrity();
    setFanId(localStorage.getItem('fanId'));
  }, [id, router.isReady]);

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/celebrity/pdf/${id}`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${celebrity?.name}-profile.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading profile:', error);
    }
  };
  const handleFollow = async () => {
    const fanToken = localStorage.getItem('fanToken');
    const fanRole = localStorage.getItem('fanRole');

    if (!fanToken || fanRole !== 'FAN') {
      alert('Only fans can follow celebrities. Please login as a fan.');
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/fan/follow/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${fanToken}`,
          },
        }
      );
      alert('Followed successfully!');
    } catch (err) {
      console.error('Follow error:', err);
      alert('Failed to follow this celebrity.');
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (!celebrity) return <div className="p-8 text-red-500">Celebrity not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>{celebrity.name} | CelebNetwork</title>
      </Head>

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Hero */}
          <div className="relative h-80 bg-gradient-to-r from-indigo-700 to-purple-700 pb-28 rounded-b-3xl">
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-b-3xl" />
            <div className="absolute bottom-0 left-0 p-8 z-10">
              <h1 className="text-5xl font-extrabold text-white">{celebrity.name}</h1>
              <div className="flex items-center mt-3 space-x-4">
                <span className="px-4 py-1 bg-white bg-opacity-20 rounded-full text-white text-sm font-medium">
                  {celebrity.category}
                </span>
                <span className="text-white flex items-center">
                  <FiMapPin className="mr-1" />
                  {celebrity.country}
                </span>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-12">
              {/* Left Panel */}
              <div className="md:w-1/3">
                <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
                  <div className="flex justify-center -mt-24 mb-4 relative z-10">
                    <img
                      src={celebrity.imageUrl}
                      alt={celebrity.name}
                      className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-md"
                    />
                  </div>

                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{celebrity.name}</h2>
                    <p className="text-gray-500">{celebrity.category}</p>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-4 mb-6 text-center">
                    <h3 className="text-sm font-medium text-indigo-800 mb-1">Fanbase</h3>
                    <p className="text-3xl font-bold text-indigo-600">
                      {celebrity.fanbase.toLocaleString()}
                    </p>
                  </div>

                  {/* Social */}
                  <div className="flex justify-center space-x-5 text-gray-500 text-lg">
                    {celebrity.instagram && (
                      <a href={celebrity.instagram} target="_blank" rel="noopener noreferrer">
                        <FiInstagram />
                      </a>
                    )}
                    {celebrity.youtube && (
                      <a href={celebrity.youtube} target="_blank" rel="noopener noreferrer">
                        <FiYoutube />
                      </a>
                    )}
                    {celebrity.twitter && (
                      <a href={celebrity.twitter} target="_blank" rel="noopener noreferrer">
                        <FiTwitter />
                      </a>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-3 mt-6">
                    {fanId && (
                      <button
                        onClick={handleFollow}
                        className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                      >
                        <FiUserPlus className="mr-2" />
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                    )}

                    <button
                      onClick={handleDownload}
                      className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-xl transition"
                    >
                      <FiDownload className="mr-2" />
                      Download Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Panel */}
              <div className="md:w-2/3 space-y-10">
                <section>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">About</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">{celebrity.bio}</p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                  <div className="space-y-5">
                    <div className="border-l-4 border-indigo-500 pl-4 py-2">
                      <h3 className="font-semibold text-gray-800">
                        Performed at Coachella 2023
                      </h3>
                      <p className="text-sm text-gray-500">2 weeks ago</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
