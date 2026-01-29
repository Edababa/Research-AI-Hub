
import React from 'react';
import { useStore } from '../store';
import { CourseCard } from '../components/CourseCard';

export const LearningHistory: React.FC = () => {
  const { currentUser, courses } = useStore();

  const historyItems = currentUser?.history.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ) || [];

  const completed = historyItems.filter(h => h.status === 'fully-completed');
  const ongoing = historyItems.filter(h => h.status !== 'fully-completed' && h.status !== 'not-started');
  const sharedCount = courses.filter(c => c.postedBy === currentUser?.id).length;

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Learning Journey</h1>
          <p className="text-slate-500 mt-1">Track your progress and revisit courses you've started.</p>
        </div>
        <div className="flex gap-2">
          {completed.length >= 3 && (
             <div className="flex flex-col items-center p-3 bg-amber-50 border border-amber-200 rounded-xl shadow-sm">
                <span className="text-2xl">🎓</span>
                <span className="text-[10px] font-bold text-amber-700 uppercase mt-1">AI Scholar</span>
             </div>
          )}
          {sharedCount >= 1 && (
             <div className="flex flex-col items-center p-3 bg-indigo-50 border border-indigo-200 rounded-xl shadow-sm">
                <span className="text-2xl">💡</span>
                <span className="text-[10px] font-bold text-indigo-700 uppercase mt-1">Knowledge Guru</span>
             </div>
          )}
          {historyItems.length >= 1 && (
             <div className="flex flex-col items-center p-3 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm">
                <span className="text-2xl">🔥</span>
                <span className="text-[10px] font-bold text-emerald-700 uppercase mt-1">Active Learner</span>
             </div>
          )}
        </div>
      </header>

      {historyItems.length === 0 ? (
        <div className="py-32 text-center bg-white border border-dashed rounded-2xl">
          <div className="text-slate-300 mb-4">
             <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Your journey hasn't started yet</h3>
          <p className="text-slate-500 mb-8">Go explore courses and pick something that interests you!</p>
          <a href="/#/courses" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">Explore Marketplace</a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <span className="text-indigo-200 text-sm font-bold uppercase tracking-wider">Courses Started</span>
              <span className="block text-4xl font-black mt-2">{historyItems.length}</span>
            </div>
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Completed</span>
              <span className="block text-4xl font-black mt-2 text-emerald-500">{completed.length}</span>
            </div>
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Shared Courses</span>
              <span className="block text-4xl font-black mt-2 text-indigo-500">{sharedCount}</span>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-3 text-lg">🚀</span>
              Continue Learning
            </h2>
            {ongoing.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoing.map(h => {
                  const c = courses.find(course => course.id === h.courseId);
                  return c ? <CourseCard key={c.id} course={c} status={h.status} /> : null;
                })}
              </div>
            ) : (
              <p className="text-slate-400 italic bg-white p-8 rounded-xl border border-dashed text-center">No active courses. Time to start a new one?</p>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
               <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mr-3 text-lg">🏆</span>
               Completed Achievements
            </h2>
            {completed.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completed.map(h => {
                  const c = courses.find(course => course.id === h.courseId);
                  return c ? <CourseCard key={c.id} course={c} status={h.status} /> : null;
                })}
              </div>
            ) : (
              <p className="text-slate-400 italic bg-white p-8 rounded-xl border border-dashed text-center">You haven't finished a course yet. Keep going!</p>
            )}
          </section>
        </>
      )}
    </div>
  );
};
