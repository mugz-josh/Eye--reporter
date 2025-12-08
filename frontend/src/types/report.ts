export interface Report {
  id: string;
  type: "red-flag" | "intervention";
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: "DRAFT" | "UNDER INVESTIGATION" | "RESOLVED" | "REJECTED";
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
