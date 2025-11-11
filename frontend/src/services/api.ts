import { Report, User } from '@/types/report';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  status: number;
  data?: T[];
  message?: string;
  error?: string;
}

export const api = {
  // Auth endpoints - Match your backend
  login: async (email: string, password: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (userData: Partial<User>): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/v1/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/v1/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Red Flags endpoints
  getRedFlags: async (): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/v1/red-flags`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getRedFlag: async (id: string): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/v1/red-flags/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  createRedFlag: async (redFlagData: any, files: File[] = []): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Add text fields
    Object.entries(redFlagData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });

    // Add files
    files.forEach(file => {
      formData.append('media', file);
    });

    const response = await fetch(`${API_URL}/v1/red-flags`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },

  updateRedFlag: async (id: string, redFlagData: any, files: File[] = []): Promise<ApiResponse<any>> => {
  const token = localStorage.getItem('token');
  
  // If there are files, use FormData, otherwise use JSON
  if (files.length > 0) {
    const formData = new FormData();
    
    // Add text fields
    Object.entries(redFlagData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });

    // Add files
    files.forEach(file => {
      formData.append('media', file);
    });

    const response = await fetch(`${API_URL}/v1/red-flags/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData - browser will set it
      },
      body: formData,
    });
    return response.json();
  } else {
    // No files, use JSON
    const response = await fetch(`${API_URL}/v1/red-flags/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(redFlagData),
    });
    return response.json();
  }
},

  // Update only the location (latitude, longitude)
  updateRedFlagLocation: async (id: string, latitude: number, longitude: number): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/v1/red-flags/${id}/location`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude }),
    });
    return response.json();
  },

  

  updateIntervention: async (id: string, interventionData: any, files: File[] = []): Promise<ApiResponse<any>> => {
  const token = localStorage.getItem('token');
  
  // If there are files, use FormData, otherwise use JSON
  if (files.length > 0) {
    const formData = new FormData();
    
    // Add text fields
    Object.entries(interventionData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });

    // Add files
    files.forEach(file => {
      formData.append('media', file);
    });

    const response = await fetch(`${API_URL}/v1/interventions/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData
      },
      body: formData,
    });
    return response.json();
  } else {
    // No files, use JSON
    const response = await fetch(`${API_URL}/v1/interventions/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(interventionData),
    });
    return response.json();
  }
},

  updateInterventionLocation: async (id: string, latitude: number, longitude: number): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/v1/interventions/${id}/location`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude }),
    });
    return response.json();
  },

  deleteRedFlag: async (id: string): Promise<ApiResponse<void>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/v1/red-flags/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  deleteIntervention: async (id: string): Promise<ApiResponse<void>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/v1/interventions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Interventions endpoints
  getInterventions: async (): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/v1/interventions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getIntervention: async (id: string): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/v1/interventions/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  createIntervention: async (interventionData: any, files: File[] = []): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    Object.entries(interventionData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });

    files.forEach(file => {
      formData.append('media', file);
    });

    const response = await fetch(`${API_URL}/v1/interventions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },

  // Admin endpoints
  updateRedFlagStatus: async (id: string, status: string): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/v1/red-flags/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  updateInterventionStatus: async (id: string, status: string): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/v1/interventions/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  }
,

  // Notifications
  getNotifications: async (): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/v1/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  markAllNotificationsRead: async (): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/v1/notifications/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    return response.json();
  }
};

// Auth helper functions
export const authHelper = {
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  removeToken: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};