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
  status: "pending" | "in-progress" | "resolved";
  createdAt: string;
  resolvedAt?: string;
  dispensaryId: string;
  dispensaryName: string;
  priority: "low" | "medium" | "high";
  responseNotes: ResponseNote[];
}

export interface ResponseNote {
  id: string;
  text: string;
  createdAt: string;
  createdBy: string;
}

export interface ServiceResponse {
  id: string;
  requestId: string;
  note: string;
  createdAt: string;
  createdBy: string;
}

export interface Invoice {
  id: string;
  dispensaryId: string;
  amount: number;
  dueDate: string;
  createdAt: string;
  status: 'pending' | 'paid' | 'overdue';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Payment {
  id: string;
  dispensaryId: string;
  invoiceId: string;
  amount: number;
  method: 'credit_card' | 'bank_transfer' | 'check' | 'cash';
  status: 'processed' | 'failed' | 'refunded';
  createdAt: string;
}

export interface ServiceAgreement {
  id: string;
  dispensaryId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'expired' | 'terminated';
  terms: string;
  createdAt: string;
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
