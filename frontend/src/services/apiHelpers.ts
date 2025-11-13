/**
 * API Helper Utilities - Eliminate repeated code patterns
 * Handles: Token management, headers, FormData construction, error handling
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Get authorization headers with token
 * REPLACES: const token = localStorage.getItem('token'); + 'Authorization': `Bearer ${token}`
 */
export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
  };
}

/**
 * Get authorization headers WITH Content-Type for JSON
 * REPLACES: headers with both Authorization and Content-Type
 */
export function getJsonHeaders(): HeadersInit {
  return {
    ...getAuthHeaders(),
    'Content-Type': 'application/json',
  };
}

/**
 * Make an authenticated GET request
 * REPLACES: Every GET request pattern in api.ts
 */
export async function fetchGet(endpoint: string) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

/**
 * Make an authenticated POST request with JSON body
 * REPLACES: POST requests with JSON in api.ts
 */
export async function fetchPost(endpoint: string, body: any) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify(body),
  });
  return response.json();
}

/**
 * Make an authenticated PATCH request with JSON body
 * REPLACES: PATCH requests in api.ts
 */
export async function fetchPatch(endpoint: string, body: any) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PATCH',
    headers: getJsonHeaders(),
    body: JSON.stringify(body),
  });
  return response.json();
}

/**
 * Make an authenticated PUT request with JSON body
 * REPLACES: PUT requests in api.ts
 */
export async function fetchPut(endpoint: string, body: any) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT',
    headers: getJsonHeaders(),
    body: JSON.stringify(body),
  });
  return response.json();
}

/**
 * Make an authenticated DELETE request
 * REPLACES: DELETE requests in api.ts
 */
export async function fetchDelete(endpoint: string) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.json();
}

/**
 * Make an authenticated POST request with FormData (for file uploads)
 * REPLACES: FormData construction + file appending in api.ts (used 4 times!)
 */
export async function fetchPostFormData(endpoint: string, data: any, files: File[] = []) {
  const formData = new FormData();
  
  // Add text fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value as string);
    }
  });

  // Add files
  files.forEach(file => {
    formData.append('media', file);
  });

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(), // Don't set Content-Type, browser will set it
    body: formData,
  });
  return response.json();
}

/**
 * Make an authenticated PUT request with FormData (for file uploads)
 * REPLACES: FormData construction for PUT requests
 */
export async function fetchPutFormData(endpoint: string, data: any, files: File[] = []) {
  const formData = new FormData();
  
  // Add text fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value as string);
    }
  });

  // Add files
  files.forEach(file => {
    formData.append('media', file);
  });

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: formData,
  });
  return response.json();
}
