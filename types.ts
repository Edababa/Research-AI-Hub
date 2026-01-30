
export type CompletionStatus = 'not-started' | 'in-progress' | 'partially-completed' | 'fully-completed';

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  link: string;
  category: string;
  type: 'online' | 'offline';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  // Fixed: Added missing properties used in components and constants
  instructor: string;
  isOnline: boolean;
  rating: number;
  ratingsCount: number;
  postedBy: string; // UserId
  postedByName: string;
  createdAt: string;
  feedbacks: Feedback[];
  avgRating: number;
}

export interface UserProgress {
  courseId: string;
  status: CompletionStatus;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'researcher' | 'admin';
  points: number;
  history: UserProgress[];
  interests: string[];
}
