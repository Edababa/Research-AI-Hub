import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { StoreProvider, useStore } from './store.tsx';
import { Layout } from './components/Layout.tsx';
import { Home } from './pages/Home.tsx';
import { Explore } from './pages/Explore.tsx';
import { CourseDetails } from './pages/CourseDetails.tsx';
import { LearningHistory } from './pages/LearningHistory.tsx';
import { Admin } from './pages/Admin.tsx';

const LoginPage: React.FC = () => {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] shadow-2xl p-12 w-full max-w-md">
        <div className="flex justify-center mb-8">
           <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-200">
             RA
           </div>
        </div>
        <h1 className="text-3xl font-black text-center text-slate-900 mb-2 tracking-tight">ResearchAI Academy</h1>
        <p className="text-center text-slate-500 mb-8 font-medium">Elevating research through AI literacy.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Corporate Email</label>
            <input 
              type="email" 
              required 
              placeholder="researcher@corporate.com"
              className="w-full p-5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium text-center"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-xl hover:bg-black shadow-xl transition-all active:scale-95"
          >
            Enter Hub
          </button>
        </form>
        
        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">Sample Access</p>
          <div className="flex flex-wrap justify-center gap-2">
             <button onClick={() => { login('alice@research.com'); navigate('/'); }} className="text-xs px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 font-bold text-slate-600 transition-colors">Alice (Researcher)</button>
             <button onClick={() => { login('bob@research.com'); navigate('/'); }} className="text-xs px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 font-bold transition-colors">Bob (Admin)</button>
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