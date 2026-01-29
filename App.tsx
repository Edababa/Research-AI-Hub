
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './store';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { CourseDetails } from './pages/CourseDetails';
import { LearningHistory } from './pages/LearningHistory';
import { Admin } from './pages/Admin';

const LoginPage: React.FC = () => {
  const { login } = useStore();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) login(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md">
        <div className="flex justify-center mb-8">
           <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg">
             RA
           </div>
        </div>
        <h1 className="text-3xl font-black text-center text-slate-900 mb-2">ResearchAI Academy</h1>
        <p className="text-center text-slate-500 mb-8">Empowering researchers with cutting-edge AI technologies.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Corporate Email</label>
            <input 
              type="email" 
              required 
              placeholder="researcher@corporate.com"
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
          >
            Enter Platform
          </button>
        </form>
        
        <div className="mt-8 pt-8 border-t text-center space-y-4">
          <p className="text-sm text-slate-400">Sample logins (for demo):</p>
          <div className="flex justify-center gap-3">
             <button onClick={() => login('alice@research.com')} className="text-xs px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200">Researcher Alice</button>
             <button onClick={() => login('bob@research.com')} className="text-xs px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100">Admin Bob</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode, adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { currentUser } = useStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (adminOnly && currentUser.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { currentUser } = useStore();
  
  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <LoginPage />} />
      
      <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute><Layout><Explore /></Layout></ProtectedRoute>} />
      <Route path="/course/:id" element={<ProtectedRoute><Layout><CourseDetails /></Layout></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><Layout><LearningHistory /></Layout></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><Layout><Admin /></Layout></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <AppRoutes />
      </Router>
    </StoreProvider>
  );
};

export default App;
