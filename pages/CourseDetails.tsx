
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { CompletionStatus } from '../types';

export const CourseDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, currentUser, updateCourseStatus, addRatingAndComment, removeCourse } = useStore();
  const course = courses.find(c => c.id === id);
  const userHistory = currentUser?.history.find(h => h.courseId === id);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!course) return <div className="p-12 text-center text-slate-500">Course not found</div>;

  const handleStatusChange = (status: CompletionStatus) => {
    updateCourseStatus(course.id, status);
  };

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    addRatingAndComment(course.id, rating, comment);
    setComment('');
    setIsSubmitting(false);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to permanently delete "${course.title}"? This action cannot be undone.`)) {
      removeCourse(course.id);
      navigate('/courses');
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <Link to="/courses" className="inline-flex items-center text-indigo-600 font-medium hover:underline">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Courses
        </Link>
        {isAdmin && (
          <button 
            onClick={handleDelete}
            className="inline-flex items-center text-red-600 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove Course
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold uppercase tracking-wide">
              {course.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
              {course.level}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${course.isOnline ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
              {course.isOnline ? 'Online' : 'In-Person'}
            </span>
          </div>

          <h1 className="text-4xl font-black text-slate-900 mb-4">{course.title}</h1>
          <div className="flex items-center text-lg text-slate-600 mb-8">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mr-3 font-bold text-slate-500 uppercase">
              {course.instructor.charAt(0)}
            </div>
            <span>Instructor: <span className="font-bold text-slate-900">{course.instructor}</span></span>
          </div>

          <div className="prose prose-slate max-w-none mb-10">
            <h3 className="text-xl font-bold text-slate-900 mb-2">About this course</h3>
            <p className="text-slate-600 text-lg leading-relaxed">{course.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-t border-b">
            <div>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">My Status</h4>
              <div className="flex flex-col gap-3">
                {(['not-started', 'in-progress', 'partially-completed', 'fully-completed'] as CompletionStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`flex items-center px-4 py-3 rounded-xl border-2 transition-all ${
                      userHistory?.status === s 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                      : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${userHistory?.status === s ? 'border-indigo-600' : 'border-slate-300'}`}>
                      {userHistory?.status === s && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                    </div>
                    <span className="font-semibold capitalize">{s.replace('-', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-center">
               <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Get Started</h4>
               <p className="text-slate-600 mb-6 text-sm italic">You can find this course content at the internal corporate link or physical location below:</p>
               <a 
                href={course.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-indigo-600 text-white text-center py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center text-lg"
              >
                Go to Course Material
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Researcher Feedback</h2>
        
        <form onSubmit={handleFeedback} className="bg-slate-50 rounded-2xl p-6 mb-8">
          <div className="flex items-center mb-4 gap-4">
            <span className="font-bold text-slate-700">Your Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${rating >= star ? 'text-amber-400' : 'text-slate-300'} transition-colors hover:scale-110`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <textarea
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 border rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Share your thoughts with other researchers..."
            rows={3}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            Post Review
          </button>
        </form>

        <div className="space-y-6">
          {course.comments.length === 0 ? (
            <p className="text-center text-slate-400 py-8 italic">No comments yet. Be the first to share your experience!</p>
          ) : (
            course.comments.map((c) => (
              <div key={c.id} className="border-b pb-6 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs mr-3">
                      {c.userName.charAt(0)}
                    </div>
                    <div>
                      <span className="block font-bold text-slate-900 text-sm">{c.userName}</span>
                      <span className="text-xs text-slate-500">{new Date(c.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed pl-11">{c.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
