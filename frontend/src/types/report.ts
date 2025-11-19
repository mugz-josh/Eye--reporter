

export interface Report {
  id: string;
  type: 'red-flag' | 'intervention';
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: 'DRAFT' | 'UNDER INVESTIGATION' | 'RESOLVED' | 'REJECTED';
  images?: string[];
  videos?: string[];
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}
