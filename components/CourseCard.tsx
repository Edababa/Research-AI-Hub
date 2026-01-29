
import React from 'react';
import { Course, CompletionStatus } from '../types';
import { useStore } from '../store';
import { Link } from 'react-router-dom';

interface Props {
  course: Course;
  status?: CompletionStatus;
}

export const CourseCard: React.FC<Props> = ({ course, status }) => {
  const { updateCourseStatus, removeCourse, currentUser } = useStore();

  const getStatusColor = (s?: CompletionStatus) => {
    switch (s) {
      case 'fully-completed': return 'bg-emerald-100 text-emerald-800';
      case 'in-progress': return 'bg-amber-100 text-amber-800';
      case 'partially-completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusLabel = (s?: CompletionStatus) => {
    if (!s || s === 'not-started') return 'Not Started';
    return s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to remove "${course.title}"?`)) {
      removeCourse(course.id);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group relative">
      {isAdmin && (
        <button 
          onClick={handleDelete}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur border border-red-100 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 z-10"
          title="Delete Course"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
            {course.category}
          </span>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm font-bold text-slate-700">{course.rating}</span>
            <span className="ml-1 text-xs text-slate-400">({course.ratingsCount})</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors pr-6">
          <Link to={`/course/${course.id}`}>{course.title}</Link>
        </h3>
        
        <p className="mt-2 text-slate-600 text-sm line-clamp-2 min-h-[2.5rem]">
          {course.description}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {course.instructor}
          </div>
          <div className="flex items-center">
             <span className={`px-2 py-0.5 rounded ${getStatusColor(status)}`}>
               {getStatusLabel(status)}
             </span>
          </div>
        </div>
      </div>
      
      <div className="px-5 py-4 bg-slate-50 border-t flex gap-2">
        <Link 
          to={`/course/${course.id}`}
          className="flex-1 bg-white border border-slate-200 text-center py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          Details
        </Link>
        <a 
          href={course.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 bg-indigo-600 text-center py-2 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition-colors"
        >
          Start Now
        </a>
      </div>
    </div>
  );
};
