
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, User, AppState, CompletionStatus } from './types';
import { INITIAL_COURSES, MOCK_USERS } from './constants';

interface StoreContextType extends AppState {
  login: (email: string) => void;
  logout: () => void;
  addCourse: (course: Partial<Course>) => void;
  removeCourse: (courseId: string) => void;
  updateCourseStatus: (courseId: string, status: CompletionStatus) => void;
  addRatingAndComment: (courseId: string, rating: number, comment: string) => void;
  updateUserRole: (userId: string, newRole: 'researcher' | 'admin') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('ra_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ra_users');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ra_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('ra_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('ra_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ra_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  const login = (email: string) => {
    const user = users.find(u => u.email === email);
    if (user) setCurrentUser(user);
    else {
      // Create new researcher if not found (simulated guest login)
      const newUser: User = {
        id: `u_${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        role: 'researcher',
        interests: ['General AI'],
        history: []
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
    }
  };

  const logout = () => setCurrentUser(null);

  const addCourse = (courseData: Partial<Course>) => {
    const newCourse: Course = {
      id: `c_${Date.now()}`,
      title: courseData.title || 'Untitled',
      description: courseData.description || '',
      category: courseData.category || 'General',
      level: courseData.level || 'Beginner',
      instructor: courseData.instructor || 'Unknown',
      link: courseData.link || '#',
      isOnline: courseData.isOnline ?? true,
      rating: 0,
      ratingsCount: 0,
      comments: [],
      postedBy: currentUser?.id || 'anonymous',
      createdAt: new Date().toISOString()
    };
    setCourses(prev => [newCourse, ...prev]);
  };

  const removeCourse = (courseId: string) => {
    if (currentUser?.role !== 'admin') return;
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const updateCourseStatus = (courseId: string, status: CompletionStatus) => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    const updatedUser = { ...currentUser };
    const historyIndex = updatedUser.history.findIndex(h => h.courseId === courseId);

    if (historyIndex > -1) {
      updatedUser.history[historyIndex] = { courseId, status, updatedAt: now };
    } else {
      updatedUser.history.push({ courseId, status, updatedAt: now });
    }

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const addRatingAndComment = (courseId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        const newTotal = course.rating * course.ratingsCount + rating;
        const newCount = course.ratingsCount + 1;
        const newComments = comment ? [
          ...course.comments,
          {
            id: `com_${Date.now()}`,
            userId: currentUser.id,
            userName: currentUser.name,
            text: comment,
            timestamp: new Date().toISOString()
          }
        ] : course.comments;

        return {
          ...course,
          rating: Number((newTotal / newCount).toFixed(1)),
          ratingsCount: newCount,
          comments: newComments
        };
      }
      return course;
    }));
  };

  const updateUserRole = (userId: string, newRole: 'researcher' | 'admin') => {
    if (currentUser?.role !== 'admin') return;

    const currentAdmins = users.filter(u => u.role === 'admin');
    if (newRole === 'admin' && currentAdmins.length >= 10) {
      alert("Maximum of 10 admin users allowed.");
      return;
    }

    if (newRole === 'researcher' && userId === currentUser.id && currentAdmins.length === 1) {
      alert("Cannot demote the last remaining admin.");
      return;
    }

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    
    // Sync current user state if they changed their own role
    if (userId === currentUser.id) {
      setCurrentUser(prev => prev ? { ...prev, role: newRole } : null);
    }
  };

  return (
    <StoreContext.Provider value={{
      courses, users, currentUser,
      login, logout, addCourse, removeCourse, updateCourseStatus, addRatingAndComment, updateUserRole
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};
