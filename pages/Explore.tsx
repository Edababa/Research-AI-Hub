
import React, { useState } from 'react';
import { useStore } from '../store';
import { CourseCard } from '../components/CourseCard';
import { Course } from '../types';

export const Explore: React.FC = () => {
  const { courses, currentUser, addCourse } = useStore();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    description: '',
    category: 'General',
    level: 'Beginner',
    // Fixed: Added instructor to initial state
    instructor: '',
    link: '',
    isOnline: true
  });

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];

  const filtered = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter === 'All' || c.category === catFilter;
    return matchesSearch && matchesCat;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addCourse(newCourse);
    setIsAdding(false);
    // Fixed: Reset instructor state after submission
    setNewCourse({ title: '', description: '', category: 'General', level: 'Beginner', instructor: '', link: '', isOnline: true });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Explore Courses</h1>
          <p className="text-slate-500 mt-1">Discover online and offline materials recommended by your peers.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Post a Course
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
           <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
           <input 
             type="text" 
             placeholder="Search titles, descriptions, skills..." 
             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
        <select 
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Post New Course</h3>
                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
             <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                  <input required className="w-full p-2 border rounded-lg" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Instructor</label>
                  {/* Fixed: Bound input to instructor state */}
                  <input required className="w-full p-2 border rounded-lg" value={newCourse.instructor} onChange={e => setNewCourse({...newCourse, instructor: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                    <input required className="w-full p-2 border rounded-lg" value={newCourse.category} onChange={e => setNewCourse({...newCourse, category: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Level</label>
                    <select className="w-full p-2 border rounded-lg" value={newCourse.level} onChange={e => setNewCourse({...newCourse, level: e.target.value as any})}>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">URL / Location</label>
                  <input required className="w-full p-2 border rounded-lg" value={newCourse.link} onChange={e => setNewCourse({...newCourse, link: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <textarea rows={3} className="w-full p-2 border rounded-lg" value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg">
                  Submit Recommendation
                </button>
             </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(course => (
          <CourseCard 
            key={course.id} 
            course={course} 
            status={currentUser?.history.find(h => h.courseId === course.id)?.status}
          />
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-xl text-slate-400">No courses match your filters. Try a different search.</p>
        </div>
      )}
    </div>
  );
};
