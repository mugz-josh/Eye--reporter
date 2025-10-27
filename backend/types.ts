import { Request } from 'express';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  is_admin: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface RedFlag {
  id: number;
  user_id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: 'draft' | 'under-investigation' | 'rejected' | 'resolved';
  image_url?: string;
  video_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Intervention {
  id: number;
  user_id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: 'draft' | 'under-investigation' | 'rejected' | 'resolved';
  image_url?: string;
  video_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    isAdmin?: boolean;
  };
}

export interface SignupData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateRecordData {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
}

export interface UpdateLocationData {
  latitude: number;
  longitude: number;
}

export interface UpdateCommentData {
  description: string;
}

export interface UpdateStatusData {
  status: 'under-investigation' | 'rejected' | 'resolved';
}

export interface ApiResponse<T = any> {
  status: number;
  data?: T[];
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface RecordResponse {
  id: number;
  message: string;
}