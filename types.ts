
export type CompletionStatus = 'not-started' | 'in-progress' | 'partially-completed' | 'fully-completed';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  link: string;
  isOnline: boolean;
  rating: number;
  ratingsCount: number;
  comments: Comment[];
  postedBy: string;
  createdAt: string;
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
  interests: string[];
  history: UserProgress[];
}

export interface AppState {
  courses: Course[];
  users: User[];
  currentUser: User | null;
}
