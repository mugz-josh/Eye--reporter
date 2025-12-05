// MOCK DATA TYPES - Currently used with localStorage
// TODO: Backend Migration Notes (Postgres)
// 
// When migrating to Postgres backend:
// 
// 1. Create 'reports' table:
//    - id: UUID PRIMARY KEY
//    - type: TEXT ('red-flag' | 'intervention')
//    - title: TEXT NOT NULL
//    - description: TEXT
//    - latitude: FLOAT NOT NULL
//    - longitude: FLOAT NOT NULL
//    - status: TEXT DEFAULT 'DRAFT'
//    - image: TEXT (URL from file storage)
//    - user_id: UUID REFERENCES users
//    - created_at: TIMESTAMP DEFAULT NOW()
//    - updated_at: TIMESTAMP DEFAULT NOW()
// 
// 2. Create 'users' table:
//    - id: UUID PRIMARY KEY
//    - name: TEXT NOT NULL
//    - email: TEXT NOT NULL
//    - role: TEXT DEFAULT 'user'
//    - created_at: TIMESTAMP DEFAULT NOW()
// 
// 3. Set up authorization policies:
//    - Users can view their own reports
//    - Users can create reports
//    - Users can update/delete only DRAFT reports
//    - Admins can view and update all reports
// 
// 4. Set up file storage for report images
// 
// 5. Replace mock authentication with proper backend auth

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
  
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}
