import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCheckCircle,
  FaRocket,
  FaChartLine,
  FaArrowRight,
  FaQuoteLeft,
  FaStar,
  FaArrowLeft,
  FaUserCircle,
  FaChevronDown,
  FaCog,
  FaClipboardList,
  FaSignOutAlt,
  FaTasks,
  FaBell,
  FaCalendarAlt,
  FaChartBar,
  FaTrophy,
  FaClock,
  FaFire,
  FaShieldAlt,
  FaCloudUploadAlt,
  FaUsers,
  FaComments
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth(); // Get user from auth context
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    setIsLoading(false);
  }, [isAuthenticated, navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout(); // Use your auth context logout function
    navigate('/login');
  };

  const handleNavigateToTodos = () => {
    navigate('/todos');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render if no user (redirect will happen)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <FaCheckCircle className="relative w-7 h-7 text-white" />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TodoFlow
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <button className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Features</button>
              <button className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Pricing</button>
              <button className="text-gray-600 hover:text-blue-600 transition-colors font-medium">About</button>
            </div>

            {/* User Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                    {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-800">{user?.fullName || user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <FaChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slideDown z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.fullName}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-xl">
                          {user?.fullName?.charAt(0) || user?.name?.charAt(0) || user?.email?.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{user?.fullName || user?.name}</h3>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                            Member since {user?.memberSince || new Date().getFullYear()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats - You can derive these from your actual user data or API */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-800">{user?.tasksCompleted || 0}</p>
                        <p className="text-xs text-gray-500">Tasks Done</p>
                      </div>
                      <div className="w-px h-8 bg-gray-300"></div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <FaFire className="text-orange-500" />
                          <p className="text-2xl font-bold text-gray-800">{user?.streak || 0}</p>
                        </div>
                        <p className="text-xs text-gray-500">Day Streak</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 group">
                      <FaUserCircle className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                      <span className="text-gray-700 group-hover:text-blue-600">Profile Settings</span>
                    </button>

                    <button
                      onClick={handleNavigateToTodos}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                    >
                      <FaTasks className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                      <span className="text-gray-700 group-hover:text-blue-600">My Tasks</span>
                      <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">NEW</span>
                    </button>

                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 group">
                      <FaChartBar className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                      <span className="text-gray-700 group-hover:text-blue-600">Analytics</span>
                    </button>

                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 group">
                      <FaBell className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                      <span className="text-gray-700 group-hover:text-blue-600">Notifications</span>
                    </button>

                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 group">
                      <FaCog className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                      <span className="text-gray-700 group-hover:text-blue-600">Settings</span>
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3 group"
                    >
                      <FaSignOutAlt className="w-5 h-5 text-red-500" />
                      <span className="text-red-600">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2.5 rounded-full text-sm mb-6 shadow-lg animate-bounce">
            <FaStar className="w-4 h-4" />
            <span>Welcome back, {user?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || 'User'}! Ready to be productive?</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Organize Your Life,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              {' '}One Task at a Time
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            The smartest way to manage your daily tasks, boost productivity,
            and achieve your goals with ease.
          </p>
          <button
            onClick={handleNavigateToTodos}
            className="group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 mx-auto hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Go to My Tasks
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Rest of your sections remain the same... */}
      {/* Features Section, Testimonial Section, Stats Section, CTA Section, Footer */}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
