export interface Project {
  id: string;
  title: string;
  year: string;
  category: 'Full Stack' | 'Frontend' | 'Backend' | 'Web Application' | string;
  shortDescription: string;
  description: string;
  keyFeatures: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  images?: string[];
  featured?: boolean;
  status?: 'published' | 'draft' | 'archived';
  views?: number;
  architectureDetails?: string[];
  badges?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillCategory {
  name: string;
  iconName: string;
  description: string;
  skills: {
    name: string;
    description?: string;
    level?: string;
    icon?: string;
  }[];
}

export interface Certification {
  title: string;
  location: string;
  year: string;
  category: string;
  skillsCovered: string[];
}

export interface Education {
  degree: string;
  institution: string;
  duration: string;
  location?: string;
  status: string;
  highlights?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied';
}

export interface VisitorComment {
  id: string;
  name: string;
  role?: string;
  company?: string;
  comment: string;
  rating?: number;
  avatarColor?: string;
  status: 'approved' | 'pending' | 'hidden';
  timestamp: string;
  parent_id?: string | null;
  is_admin?: boolean;
  replies?: VisitorComment[];
}

