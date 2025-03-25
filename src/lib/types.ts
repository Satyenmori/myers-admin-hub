
export type Role = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: string;
}

export interface Dispensary {
  id: string;
  name: string;
  address: string;
  category: 'medical' | 'recreational' | 'both';
  status: 'open' | 'under-maintenance' | 'closed';
  engineers: string[];
  createdAt: string;
  serviceRequests: ServiceRequest[];
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface ThemeState {
  mode: 'light' | 'dark';
}

export interface MenuItem {
  title: string;
  path: string;
  icon: string;
  allowedRoles: Role[];
}
