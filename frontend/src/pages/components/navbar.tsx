import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const navLinkClass = (path: string) =>
    `${
      router.pathname === path
        ? 'text-indigo-600 font-semibold'
        : 'text-gray-600 hover:text-indigo-600'
    } block px-3 py-2 text-sm transition`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link href="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-800">
            CelebNetwork
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/" className={navLinkClass('/')}>
              Home
            </Link>
            <Link href="/signup/celebrity" className={navLinkClass('/signup/celebrity')}>
              Celebrity Signup
            </Link>
            <Link href="/dashboard/celebrity" className={navLinkClass('/dashboard/celebrity')}>
              Celebrity Dashboard
            </Link>
            <Link href="/dashboard/fan" className={navLinkClass('/dashboard/fan')}>
              Fan Dashboard
            </Link>
            <Link href="/auth/login">
              <button className="text-sm px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                Sign in
              </button>
            </Link>
            <Link href="/auth/register">
              <button className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Register
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 focus:outline-none"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white border-t shadow">
          <Link href="/" className={navLinkClass('/')}>
            Home
          </Link>
          <Link href="/signup/celebrity" className={navLinkClass('/signup/celebrity')}>
            Celebrity Signup
          </Link>
          <Link href="/dashboard/celebrity" className={navLinkClass('/dashboard/celebrity')}>
            Celebrity Dashboard
          </Link>
          <Link href="/dashboard/fan" className={navLinkClass('/dashboard/fan')}>
            Fan Dashboard
          </Link>
          <Link href="/auth/login" className="block px-3 py-2 text-sm text-gray-600 hover:text-indigo-600">
            Sign in
          </Link>
          <Link href="/auth/register" className="block px-3 py-2 text-sm text-indigo-600 font-semibold">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
