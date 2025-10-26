// MOCK DATA TYPES - Currently used with localStorage
// TODO: Backend Migration Notes
// 
// When migrating to Supabase:
// 
// 1. Create 'reports' table:
//    - id: UUID PRIMARY KEY
//    - type: TEXT ('red-flag' | 'intervention')
//    - title: TEXT NOT NULL
//    - description: TEXT
//    - latitude: FLOAT NOT NULL
//    - longitude: FLOAT NOT NULL
//    - status: TEXT DEFAULT 'DRAFT'
//    - image: TEXT (URL from Supabase Storage)
//    - user_id: UUID REFERENCES auth.users
//    - created_at: TIMESTAMP DEFAULT NOW()
//    - updated_at: TIMESTAMP DEFAULT NOW()
// 
// 2. Create 'profiles' table:
//    - id: UUID PRIMARY KEY REFERENCES auth.users
//    - name: TEXT NOT NULL
//    - email: TEXT NOT NULL
//    - role: TEXT DEFAULT 'user'
//    - created_at: TIMESTAMP DEFAULT NOW()
// 
// 3. Set up RLS policies:
//    - Users can view their own reports
//    - Users can create reports
//    - Users can update/delete only DRAFT reports
//    - Admins can view and update all reports
// 
// 4. Set up Storage bucket for report images
// 
// 5. Replace mock authentication with Supabase auth

export interface Report {
  id: string;
  type: 'red-flag' | 'intervention';
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: 'DRAFT' | 'UNDER INVESTIGATION' | 'RESOLVED' | 'REJECTED';
  image?: string;
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
