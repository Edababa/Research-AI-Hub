
import { Course, User } from './types';

export const INITIAL_COURSES: Course[] = [
  {
    id: '1',
    title: 'Large Language Models 101',
    description: 'An introduction to transformer architectures and modern LLMs like GPT-4 and Gemini.',
    category: 'AI Fundamentals',
    level: 'Beginner',
    instructor: 'Dr. Sarah Chen',
    link: 'https://example.com/llm-101',
    isOnline: true,
    rating: 4.8,
    ratingsCount: 15,
    comments: [],
    postedBy: 'system',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    title: 'AI Agent Architectures',
    description: 'Deep dive into AutoGPT, BabyAGI, and custom autonomous agents for research automation.',
    category: 'Advanced AI',
    level: 'Advanced',
    instructor: 'Marc Thompson',
    link: 'https://example.com/agents',
    isOnline: true,
    rating: 4.5,
    ratingsCount: 8,
    comments: [],
    postedBy: 'system',
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    title: 'Prompt Engineering for Researchers',
    description: 'Mastering the art of structured prompting for data synthesis and literature reviews.',
    category: 'Applied AI',
    level: 'Intermediate',
    instructor: 'Elena Rodriguez',
    link: 'https://example.com/prompt-eng',
    isOnline: true,
    rating: 4.9,
    ratingsCount: 22,
    comments: [],
    postedBy: 'system',
    createdAt: '2024-02-10'
  },
  {
    id: '4',
    title: 'In-Person: Machine Learning Ethics',
    description: 'A workshop on bias, fairness, and safety in modern research applications.',
    category: 'Ethics',
    level: 'Intermediate',
    instructor: 'Department Ethics Board',
    link: 'Conference Room B',
    isOnline: false,
    rating: 4.2,
    ratingsCount: 5,
    comments: [],
    postedBy: 'system',
    createdAt: '2024-03-01'
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Researcher Alice',
    email: 'alice@research.com',
    role: 'researcher',
    interests: ['NLP', 'Computer Vision'],
    history: [
      { courseId: '1', status: 'fully-completed', updatedAt: '2024-02-01' },
      { courseId: '3', status: 'in-progress', updatedAt: '2024-03-05' }
    ]
  },
  {
    id: 'admin_1',
    name: 'Admin Bob',
    email: 'bob@research.com',
    role: 'admin',
    interests: [],
    history: []
  }
];
