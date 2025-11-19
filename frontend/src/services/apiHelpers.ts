const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
// Set the base URL for API calls. If the environment variable is not defined, fallback to localhost.

export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token'); // Retrieve the JWT token stored in localStorage
  return {
    'Authorization': `Bearer ${token}`, // Construct Authorization header with Bearer token
  };
}

export function getJsonHeaders(): HeadersInit {
  return {
    ...getAuthHeaders(), // Include Authorization header
    'Content-Type': 'application/json', // Add Content-Type for JSON requests
  };
}

export async function fetchGet(endpoint: string) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: getAuthHeaders(), // Attach authorization header for authenticated GET
  });
  return response.json(); // Parse and return the JSON response
}

export async function fetchPost(endpoint: string, body: any) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST', // HTTP POST method
    headers: getJsonHeaders(), // Include Authorization + Content-Type headers
    body: JSON.stringify(body), // Convert JS object to JSON string
  });
  return response.json(); // Return parsed JSON response
}

export async function fetchPatch(endpoint: string, body: any) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PATCH', // HTTP PATCH for partial updates
    headers: getJsonHeaders(), // Authorization + JSON headers
    body: JSON.stringify(body), // Convert payload to JSON
  });
  return response.json(); // Return JSON
}

export async function fetchPut(endpoint: string, body: any) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT', // HTTP PUT for full updates
    headers: getJsonHeaders(),
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function fetchDelete(endpoint: string) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE', // HTTP DELETE
    headers: getAuthHeaders(), // Authorization header only, no body needed
  });
  return response.json();
}

export async function fetchPostFormData(endpoint: string, data: any, files: File[] = []) {
  const formData = new FormData(); // Initialize FormData object for file uploads
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value as string); // Add non-null text fields to FormData
    }
  });

  files.forEach(file => {
    formData.append('media', file); // Append each file to FormData under 'media' field
  });

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST', // POST request with multipart/form-data
    headers: getAuthHeaders(), // Only Authorization header; browser handles Content-Type
    body: formData, // Attach FormData as request body
  });
  return response.json(); // Return parsed JSON response
}

export async function fetchPutFormData(endpoint: string, data: any, files: File[] = []) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value as string); // Add text fields
    }
  });

  files.forEach(file => {
    formData.append('media', file); // Add files
  });

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT', // PUT request for FormData
    headers: getAuthHeaders(), // Authorization header only
    body: formData,
  });
  return response.json(); // Return JSON
}
