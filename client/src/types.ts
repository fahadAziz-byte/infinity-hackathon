export type UserRole = 'ADMIN' | 'MANAGER' | 'AGENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  specialization: string;
  skills: string[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName?: string;
  assigneeEmail?: string;
  deadline: string;
  estimatedHours: number;
  projectName?: string;
  clientName?: string;
  projectDeadline?: string;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  description: string;
  managerId: string;
  managerName?: string;
  managerEmail?: string;
  deadline: string;
  taskCount?: number;
  totalHours?: number;
  tasks?: Task[];
}

export interface AuthState {
  token: string | null;
  user: User | null;
}
