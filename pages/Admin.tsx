
import React from 'react';
import { useStore } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export const Admin: React.FC = () => {
  // Fixed: Changed updateUserRole to setRole to match useStore
  const { users, courses, setRole, currentUser } = useStore();

  const totalResearchers = users.filter(u => u.role === 'researcher').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const totalCourses = courses.length;

  const statusData = [
    { name: 'Completed', value: users.reduce((acc, u) => acc + u.history.filter(h => h.status === 'fully-completed').length, 0), color: '#10b981' },
    { name: 'In Progress', value: users.reduce((acc, u) => acc + u.history.filter(h => h.status === 'in-progress' || h.status === 'partially-completed').length, 0), color: '#f59e0b' },
  ];

  const categoryStats = courses.reduce((acc: any, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.keys(categoryStats).map(cat => ({ name: cat, count: categoryStats[cat] }));

  // Rewards Leaderboard Logic
  const allUserStats = users.map(u => ({
    ...u,
    completedCount: u.history.filter(h => h.status === 'fully-completed').length,
    postedCount: courses.filter(c => c.postedBy === u.id).length
  })).sort((a, b) => (b.completedCount + b.postedCount) - (a.completedCount + a.postedCount));

  const handleRoleToggle = (userId: string, currentRole: 'researcher' | 'admin') => {
    const newRole = currentRole === 'admin' ? 'researcher' : 'admin';
    const action = newRole === 'admin' ? 'Promote to Admin' : 'Demote to Researcher';
    
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      // Fixed: Updated to use setRole
      setRole(userId, newRole);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Admin & Rewards Dashboard</h1>
        <p className="text-slate-500 mt-1">Track department growth, manage access, and identify researchers for recognition.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { label: 'Researchers', value: totalResearchers, icon: '👥' },
           { label: 'Admins', value: `${totalAdmins}/10`, icon: '🛡️' },
           { label: 'Courses Offered', value: totalCourses, icon: '📚' },
           // Fixed: use rating property which is now added to Course interface
           { label: 'Avg Rating', value: (courses.reduce((acc, c) => acc + c.rating, 0) / (courses.length || 1)).toFixed(1), icon: '⭐' }
         ].map(stat => (
           <div key={stat.label} className="bg-white p-6 rounded-2xl border shadow-sm">
             <div className="flex justify-between items-start">
               <div>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                 <span className="block text-3xl font-black text-slate-900 mt-1">{stat.value}</span>
               </div>
               <span className="text-2xl">{stat.icon}</span>
             </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Engagement by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Course Completion Status</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="ml-8 space-y-2">
               {statusData.map(s => (
                 <div key={s.name} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: s.color}}></div>
                    <span className="text-sm font-medium text-slate-600">{s.name}: {s.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-indigo-50/50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-indigo-900">User Management & Leaderboard</h3>
            <p className="text-xs text-indigo-600 font-medium">Manage user access roles (max 10 admins) and track points.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Activity (Done/Posted)</th>
                <th className="px-6 py-4">Total Points</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {allUserStats.map((user, idx) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                       <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-[10px] font-bold ${idx < 3 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                         {idx + 1}
                       </span>
                       <div>
                        <span className="block font-bold text-slate-900">{user.name}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <span className="text-emerald-600 font-bold">{user.completedCount} √</span>
                      <span className="text-indigo-600 font-bold">{user.postedCount} +</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900 text-lg">
                    {user.completedCount + user.postedCount}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRoleToggle(user.id, user.role)}
                      disabled={user.role === 'admin' && totalAdmins <= 1 && user.id === currentUser?.id}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        user.role === 'admin' 
                        ? 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600' 
                        : (totalAdmins < 10 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-50 text-slate-300 cursor-not-allowed')
                      }`}
                    >
                      {user.role === 'admin' ? 'Demote to Researcher' : 'Appoint as Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
