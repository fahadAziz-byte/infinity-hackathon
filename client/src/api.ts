import { User, Project, Task } from './types';

const API_BASE = '/api';

export function getStoredToken(): string | null {
  return localStorage.getItem('novaworks_token');
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem('novaworks_token', token);
  } else {
    localStorage.removeItem('novaworks_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const res = await request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(res.token);
    return res;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    return request<{ user: User }>('/auth/me');
  },

  logout: () => {
    setStoredToken(null);
  },

  // Directory
  getUsers: async (): Promise<{ users: User[] }> => {
    return request<{ users: User[] }>('/users');
  },

  // Projects
  getProjects: async (): Promise<{ projects: Project[] }> => {
    return request<{ projects: Project[] }>('/projects');
  },

  getProjectById: async (id: string): Promise<{ project: Project; tasks: Task[] }> => {
    return request<{ project: Project; tasks: Task[] }>(`/projects/${id}`);
  },

  resetProjects: async (): Promise<{ message: string }> => {
    return request<{ message: string }>('/projects/reset', {
      method: 'POST',
    });
  },

  // Tasks
  getTasks: async (): Promise<{ tasks: Task[] }> => {
    return request<{ tasks: Task[] }>('/tasks');
  },

  // Transcript Automation
  processTranscript: async (transcript: string): Promise<{
    success: boolean;
    message: string;
    createdProjects: number;
    createdTasks: number;
    projects: Project[];
  }> => {
    return request('/transcript/process', {
      method: 'POST',
      body: JSON.stringify({ transcript }),
    });
  },
};
