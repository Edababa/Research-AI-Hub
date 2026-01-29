
import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { CourseCard } from '../components/CourseCard';
import { getAIRecommendations } from '../services/geminiService';
import { Course, User } from '../types';

export const Home: React.FC = () => {
  const { currentUser, courses, users } = useStore();
  const [recommendations, setRecommendations] = useState<{courseId: string, reason: string}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      getAIRecommendations(currentUser, courses)
        .then(res => setRecommendations(res))
        .finally(() => setLoading(false));
    }
  }, [currentUser, courses]);

  const recommendedCourses = recommendations
    .map(rec => ({ course: courses.find(c => c.id === rec.courseId), reason: rec.reason }))
    .filter(item => item.course) as {course: Course, reason: string}[];

  const inProgress = currentUser?.history.filter(h => h.status === 'in-progress' || h.status === 'partially-completed') || [];
  const inProgressCourses = inProgress
    .map(h => ({ course: courses.find(c => c.id === h.courseId), status: h.status }))
    .filter(item => item.course) as {course: Course, status: any}[];

  // Logic for Hall of Fame
  const researchers = users.filter(u => u.role === 'researcher');
  
  const topLearners = [...researchers]
    .map(u => ({ 
      name: u.name, 
      count: u.history.filter(h => h.status === 'fully-completed').length 
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const topContributors = [...researchers]
    .map(u => ({ 
      name: u.name, 
      count: courses.filter(c => c.postedBy === u.id).length 
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <div className="space-y-10">
      <header className="bg-white p-8 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
            Welcome back, <span className="text-indigo-600">{currentUser?.name}</span>!
          </h1>
          <p className="mt-3 text-slate-600 text-lg">
            Ready to push the boundaries of AI research today? Here's your personalized learning dashboard.
          </p>
          <div className="mt-6 flex gap-3">
             <div className="bg-slate-50 px-4 py-2 rounded-lg border">
                <span className="block text-xl font-bold text-slate-900">{currentUser?.history.length || 0}</span>
                <span className="text-xs text-slate-500 uppercase font-semibold">Courses Joined</span>
             </div>
             <div className="bg-slate-50 px-4 py-2 rounded-lg border">
                <span className="block text-xl font-bold text-indigo-600">
                  {currentUser?.history.filter(h => h.status === 'fully-completed').length || 0}
                </span>
                <span className="text-xs text-slate-500 uppercase font-semibold">Completed</span>
             </div>
          </div>
        </div>
        <div className="w-full md:w-1/3 bg-indigo-50 border border-indigo-100 rounded-xl p-6 relative overflow-hidden">
           <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-200 rounded-full blur-2xl opacity-50"></div>
           <h3 className="font-bold text-indigo-900 flex items-center mb-2">
             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
             AI Research Coach
           </h3>
           <p className="text-sm text-indigo-800 italic">
             {currentUser?.history.filter(h => h.status === 'fully-completed').length > 2 
               ? `"Great job on your completions! You're currently one of our top learners. Check out these advanced agent topics next."`
               : `"Researchers who focus on Agents see a 40% increase in productivity. Why not explore the Agent Architectures course?"`}
           </p>
        </div>
      </header>

      {/* Hall of Fame / Motivation */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">🏆</span> Top Knowledge Seekers
          </h2>
          <div className="space-y-3">
            {topLearners.map((u, i) => (
              <div key={u.name} className="flex items-center justify-between bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <div className="flex items-center">
                  <span className="w-6 font-bold text-indigo-200">#{i+1}</span>
                  <span className="font-semibold">{u.name}</span>
                </div>
                <span className="text-sm font-bold bg-white/20 px-2 py-1 rounded-lg">{u.count} Completed</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">📢</span> Top Knowledge Sharers
          </h2>
          <div className="space-y-3">
            {topContributors.map((u, i) => (
              <div key={u.name} className="flex items-center justify-between bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <div className="flex items-center">
                  <span className="w-6 font-bold text-emerald-200">#{i+1}</span>
                  <span className="font-semibold">{u.name}</span>
                </div>
                <span className="text-sm font-bold bg-white/20 px-2 py-1 rounded-lg">{u.count} Shared</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Recommended for You</h2>
          {loading && <div className="text-xs text-slate-400 animate-pulse">Consulting AI...</div>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCourses.map(({ course, reason }) => (
            <div key={course.id} className="relative group">
              <CourseCard course={course} status={currentUser?.history.find(h => h.courseId === course.id)?.status} />
              <div className="mt-2 bg-indigo-50 text-indigo-700 text-xs px-3 py-2 rounded-lg border border-indigo-100 shadow-sm">
                <strong>Why?</strong> {reason}
              </div>
            </div>
          ))}
          {!loading && recommendedCourses.length === 0 && (
             <div className="col-span-full py-12 text-center bg-white border border-dashed rounded-xl">
               <p className="text-slate-400">Complete your profile to get personalized AI suggestions.</p>
             </div>
          )}
        </div>
      </section>

      {/* In Progress */}
      {inProgressCourses.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map(({ course, status }) => (
              <CourseCard key={course.id} course={course} status={status} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
