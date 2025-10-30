import { Report, User } from '@/types/report';

const API_URL = import.meta.env.VITE_API_URL;

interface ApiResponse<T> {
  status: number;
  data?: T;
  message?: string;
}

export const api = {
  // Auth endpoints
  login: async (email: string, password: string): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    return response.json();
  },

  register: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    return response.json();
  },

  // Reports endpoints
  getReports: async (): Promise<ApiResponse<Report[]>> => {
    const response = await fetch(`${API_URL}/reports`, {
      credentials: 'include'
    });
    return response.json();
  },

  createReport: async (report: Partial<Report>): Promise<ApiResponse<Report>> => {
    const formData = new FormData();
    Object.entries(report).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });

    const response = await fetch(`${API_URL}/reports`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    return response.json();
  },

  updateReport: async (id: string, report: Partial<Report>): Promise<ApiResponse<Report>> => {
    const formData = new FormData();
    Object.entries(report).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });

    const response = await fetch(`${API_URL}/reports/${id}`, {
      method: 'PUT',
      body: formData,
      credentials: 'include'
    });
    return response.json();
  },

  deleteReport: async (id: string): Promise<ApiResponse<void>> => {
    const response = await fetch(`${API_URL}/reports/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return response.json();
  },

  // Admin endpoints
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await fetch(`${API_URL}/admin/users`, {
      credentials: 'include'
    });
    return response.json();
  },

  updateReportStatus: async (id: string, status: string): Promise<ApiResponse<Report>> => {
    const response = await fetch(`${API_URL}/admin/reports/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      credentials: 'include'
    });
    return response.json();
  }
};