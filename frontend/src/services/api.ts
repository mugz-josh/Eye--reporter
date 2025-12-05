import { Report, User } from "@/types/report";
import {
  getAuthHeaders,
  getJsonHeaders,
  fetchGet,
  fetchPost,
  fetchPatch,
  fetchPut,
  fetchDelete,
  fetchPostFormData,
  fetchPutFormData,
} from "./apiHelpers";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface ApiResponse<T> {
  status: number;
  data?: T[];
  message?: string;
  error?: string;
}

export const api = {
  // Auth endpoints
  login: async (email: string, password: string): Promise<ApiResponse<any>> => {
    return fetchPost("/v1/auth/login", { email, password });
  },

  register: async (userData: Partial<User>): Promise<ApiResponse<any>> => {
    return fetchPost("/v1/auth/signup", userData);
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    return fetchGet("/v1/auth/profile");
  },

  updateProfile: async (
    profileData: Partial<User>
  ): Promise<ApiResponse<User>> => {
    return fetchPatch("/v1/auth/profile", profileData);
  },

  getUsers: async (): Promise<ApiResponse<User>> => {
    return fetchGet("/v1/auth/users");
  },

  // Red Flags endpoints
  getRedFlags: async (): Promise<ApiResponse<any>> => {
    return fetchGet("/v1/red-flags");
  },

  getRedFlag: async (id: string): Promise<ApiResponse<any>> => {
    return fetchGet(`/v1/red-flags/${id}`);
  },

  createRedFlag: async (
    redFlagData: any,
    files: File[] = []
  ): Promise<ApiResponse<any>> => {
    return fetchPostFormData("/v1/red-flags", redFlagData, files);
  },

  updateRedFlag: async (
    id: string,
    redFlagData: any,
    files: File[] = []
  ): Promise<ApiResponse<any>> => {
    if (files.length > 0) {
      return fetchPutFormData(`/v1/red-flags/${id}`, redFlagData, files);
    } else {
      return fetchPut(`/v1/red-flags/${id}`, redFlagData);
    }
  },

  updateRedFlagLocation: async (
    id: string,
    latitude: number,
    longitude: number
  ): Promise<ApiResponse<any>> => {
    return fetchPatch(`/v1/red-flags/${id}/location`, { latitude, longitude });
  },

  updateRedFlagStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse<any>> => {
    return fetchPatch(`/v1/red-flags/${id}/status`, { status });
  },

  deleteRedFlag: async (id: string): Promise<ApiResponse<void>> => {
    return fetchDelete(`/v1/red-flags/${id}`);
  },

  // Interventions endpoints
  getInterventions: async (): Promise<ApiResponse<any>> => {
    return fetchGet("/v1/interventions");
  },

  getIntervention: async (id: string): Promise<ApiResponse<any>> => {
    return fetchGet(`/v1/interventions/${id}`);
  },

  createIntervention: async (
    interventionData: any,
    files: File[] = []
  ): Promise<ApiResponse<any>> => {
    return fetchPostFormData("/v1/interventions", interventionData, files);
  },

  updateIntervention: async (
    id: string,
    interventionData: any,
    files: File[] = []
  ): Promise<ApiResponse<any>> => {
    if (files.length > 0) {
      return fetchPutFormData(
        `/v1/interventions/${id}`,
        interventionData,
        files
      );
    } else {
      return fetchPut(`/v1/interventions/${id}`, interventionData);
    }
  },

  updateInterventionLocation: async (
    id: string,
    latitude: number,
    longitude: number
  ): Promise<ApiResponse<any>> => {
    return fetchPatch(`/v1/interventions/${id}/location`, {
      latitude,
      longitude,
    });
  },

  updateInterventionStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse<any>> => {
    return fetchPatch(`/v1/interventions/${id}/status`, { status });
  },

  deleteIntervention: async (id: string): Promise<ApiResponse<void>> => {
    return fetchDelete(`/v1/interventions/${id}`);
  },

  // Notifications
  getNotifications: async (): Promise<ApiResponse<any>> => {
    return fetchGet("/v1/notifications");
  },

  markAllNotificationsRead: async (): Promise<ApiResponse<any>> => {
    return fetchPut("/v1/notifications/read", {});
  },
};

// Auth helper functions
export const authHelper = {
  setToken: (token: string) => {
    localStorage.setItem("token", token);
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  removeToken: () => {
    localStorage.removeItem("token");
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },
};
