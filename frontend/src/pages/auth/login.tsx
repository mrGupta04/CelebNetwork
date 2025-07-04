import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function FanLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, form);
      const { token, user } = res.data;

      console.log('Logged in user:', user);

      // ✅ Case-insensitive check for fan role
      if (token && user?.role?.toLowerCase() === 'fan') {
        // ✅ Store fan login
        localStorage.setItem('fanToken', token);
        localStorage.setItem('fanId', user.id);
        localStorage.setItem('fanRole', 'FAN');

        // ✅ Clear celebrity session if it exists
        localStorage.removeItem('celebrityToken');
        localStorage.removeItem('celebrityId');
        localStorage.removeItem('celebrityRole');

        alert('Fan login successful!');
        router.push('/dashboard/fan');
      } else {
        setError('Only fans can log in here.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Fan Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border px-4 py-2 mb-4 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border px-4 py-2 mb-4 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 ${
            loading && 'opacity-50 cursor-not-allowed'
          }`}
        >
          {loading ? 'Logging in...' : 'Login as Fan'}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
}
