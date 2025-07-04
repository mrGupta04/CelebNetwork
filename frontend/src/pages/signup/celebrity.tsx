import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Navbar from '../components/navbar';
import { FiArrowLeft, FiCheck, FiSearch, FiUpload } from 'react-icons/fi';

interface CelebritySuggestion {
  name: string;
  category: string;
  country: string;
  imageUrl: string;
  instagram?: string;
  youtube?: string;
  bio?: string;
  setlist?: string;
}

export default function CelebritySignup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CelebritySuggestion[]>([]);
  const [selectedCelebrity, setSelectedCelebrity] = useState<CelebritySuggestion | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Singer',
    country: '',
    instagram: '',
    youtube: '',
    fanbase: 1000,
    bio: '',
    imageUrl: '',
    setlist: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const { data } = await axios.post(`${apiUrl}/celebrity/generateFromPrompt`, {
        prompt: searchQuery,
      });

      const result = Array.isArray(data) ? data : [data];
      setSuggestions(result);
      setStep(2);
    } catch (err: any) {
      alert(err.response?.data?.message || 'AI suggestion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCelebrity = (celeb: CelebritySuggestion) => {
    setSelectedCelebrity(celeb);
    setFormData({
      ...formData,
      name: celeb.name,
      category: celeb.category,
      country: celeb.country,
      imageUrl: celeb.imageUrl,
      instagram: celeb.instagram || '',
      youtube: celeb.youtube || '',
      bio: celeb.bio || '',
      setlist: celeb.setlist || '',
    });
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const { data } = await axios.post(`${apiUrl}/celebrity`, formData);

      localStorage.setItem('celebrityToken', data.token);
      localStorage.setItem('celebrityId', data.id);
      localStorage.setItem('celebrityRole', 'CELEBRITY');

      localStorage.removeItem('fanToken');
      localStorage.removeItem('fanId');
      localStorage.removeItem('fanRole');

      alert('Celebrity profile created!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>Celebrity Signup | CelebNetwork</title>
      </Head>

      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center mb-8">
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                  <FiArrowLeft className="h-5 w-5 text-gray-500" />
                </button>
              )}
              <h1 className="text-3xl font-bold text-gray-900">Celebrity Onboarding</h1>
            </div>

            <div className="flex items-center mb-8">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step === stepNumber
                        ? 'bg-indigo-600 text-white'
                        : step > stepNumber
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-16 h-1 ${step > stepNumber ? 'bg-green-100' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              ))}
            </div>

            {step === 1 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe yourself in one line
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="E.g. 'Indian rapper with a viral YouTube hit'"
                    className="block w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center text-gray-400 hover:text-indigo-600"
                  >
                    <FiSearch className="h-5 w-5" />
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Suggested Matches</h2>
                <div className="grid grid-cols-1 gap-4">
                  {suggestions.map((celebrity, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectCelebrity(celebrity)}
                      className="flex items-center p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition"
                    >
                      <img
                        src={celebrity.imageUrl}
                        alt={celebrity.name}
                        onError={(e) => ((e.target as HTMLImageElement).src = '/images/default-avatar.jpg')}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{celebrity.name}</h3>
                        <p className="text-sm text-gray-600">
                          {celebrity.category} • {celebrity.country}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Singer">Singer</option>
                      <option value="Actor">Actor</option>
                      <option value="Band">Band</option>
                      <option value="Comedian">Comedian</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fanbase</label>
                    <input
                      type="number"
                      min={1000}
                      value={formData.fanbase}
                      onChange={(e) => setFormData({ ...formData, fanbase: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg bg-white"
                  />
                  {formData.imageUrl && (
                    <img src={formData.imageUrl} alt="Preview" className="mt-3 w-28 h-28 object-cover rounded-full" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
                  <input
                    type="text"
                    value={formData.youtube}
                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Setlist</label>
                  <textarea
                    value={formData.setlist}
                    onChange={(e) => setFormData({ ...formData, setlist: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows={2}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
                >
                  <FiCheck className="mr-2" />
                  {loading ? 'Submitting...' : 'Complete Registration'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
