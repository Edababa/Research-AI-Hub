
import React from 'react';
import { useStore } from '../store';
import { Link, useNavigate } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold mr-3 shadow-md">
                  RA
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  ResearchAI
                </span>
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-indigo-600">Home</Link>
                <Link to="/courses" className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-indigo-600">Explore</Link>
                <Link to="/history" className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-indigo-600">My Learning</Link>
                {currentUser.role === 'admin' && (
                  <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-indigo-600 bg-indigo-50">Admin Panel</Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-900 leading-none">{currentUser.name}</p>
                <p className="text-xs text-slate-500 capitalize leading-none mt-1">{currentUser.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-white border px-4 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; 2024 Research Department Learning Platform. Powered by Gemini AI.
        </div>
      </footer>
    </div>
  );
};
