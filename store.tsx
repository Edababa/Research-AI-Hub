import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, User, CompletionStatus, Feedback } from './types';
import { INITIAL_COURSES, MOCK_USERS } from './constants.tsx';

interface AppState {
  courses: Course[];
  users: User[];
  currentUser: User | null;
  login: (email: string) => void;
  logout: () => void;
  addCourse: (course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  updateStatus: (courseId: string, status: CompletionStatus) => void;
  addFeedback: (courseId: string, rating: number, comment: string) => void;
  setRole: (userId: string, role: 'admin' | 'researcher') => void;
}

const StoreContext = createContext<AppState | undefined>(undefined);

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

  useEffect(() => localStorage.setItem('ra_courses', JSON.stringify(courses)), [courses]);
  useEffect(() => localStorage.setItem('ra_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('ra_currentUser', JSON.stringify(currentUser)), [currentUser]);

  const login = (email: string) => {
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: `u_${Date.now()}`,
        email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        role: users.length === 0 ? 'admin' : 'researcher',
        points: 0,
        history: [],
        interests: ['AI Agents', 'Large Language Models']
      };
      setUsers(prev => [...prev, user!]);
    }
    setCurrentUser(user);
  };

  const logout = () => setCurrentUser(null);

  const addCourse = (data: Partial<Course>) => {
    if (!currentUser) return;
    const newCourse: Course = {
      id: `c_${Date.now()}`,
      title: data.title || 'Untitled Course',
      description: data.description || '',
      link: data.link || '',
      category: data.category || 'General',
      type: data.type || 'online',
      level: data.level || 'Beginner',
      instructor: data.instructor || currentUser.name,
      isOnline: data.isOnline ?? true,
      rating: 0,
      ratingsCount: 0,
      postedBy: currentUser.id,
      postedByName: currentUser.name,
      createdAt: new Date().toISOString(),
      feedbacks: [],
      avgRating: 0
    };
    setCourses(prev => [newCourse, ...prev]);
    updateUserPoints(currentUser.id, 5); // Reward for sharing
  };

  const deleteCourse = (id: string) => {
    if (currentUser?.role !== 'admin') return;
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const updateStatus = (courseId: string, status: CompletionStatus) => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(u => {
        if (u.id === currentUser.id) {
          const history = [...u.history];
          const idx = history.findIndex(h => h.courseId === courseId);
          
          const wasCompleted = idx > -1 && history[idx].status === 'fully-completed';
          const isCompleted = status === 'fully-completed';
          let points = u.points;

          if (idx > -1) {
            history[idx] = { courseId, status, updatedAt: now };
          } else {
            history.push({ courseId, status, updatedAt: now });
          }

          if (!wasCompleted && isCompleted) points += 10;
          
          const updated = { ...u, history, points };
          if (u.id === currentUser.id) setCurrentUser(updated);
          return updated;
        }
        return u;
      });
      return updatedUsers;
    });
  };

  const addFeedback = (courseId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const newFeedback: Feedback = {
          id: `f_${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          rating,
          comment,
          timestamp: new Date().toISOString()
        };
        const feedbacks = [...c.feedbacks, newFeedback];
        const avg = feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length;
        return { 
          ...c, 
          feedbacks, 
          avgRating: Number(avg.toFixed(1)),
          rating: Number(avg.toFixed(1)),
          ratingsCount: feedbacks.length
        };
      }
      return c;
    }));
  };

  const setRole = (userId: string, role: 'admin' | 'researcher') => {
    if (currentUser?.role !== 'admin') return;
    const admins = users.filter(u => u.role === 'admin');
    if (role === 'admin' && admins.length >= 10) {
      alert("Maximum 10 admins allowed.");
      return;
    }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  };

  const updateUserPoints = (userId: string, amount: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, points: u.points + amount } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, points: prev.points + amount } : null);
    }
  };

  return (
    <StoreContext.Provider value={{ courses, users, currentUser, login, logout, addCourse, deleteCourse, updateStatus, addFeedback, setRole }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};