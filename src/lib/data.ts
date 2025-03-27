
import { Dispensary, Invoice, Payment, Role, ServiceAgreement, ServiceRequest, User } from "./types";

export const USERS_DATA: User[] = [
  {
    id: "user-001",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "user-002",
    name: "Manager User",
    email: "manager@example.com",
    role: "manager",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "user-003",
    name: "Regular User",
    email: "user@example.com",
    role: "user",
    status: "inactive",
    createdAt: "2023-01-01T00:00:00Z",
  },
];

export const DISPENSARIES_DATA: Dispensary[] = [
  {
    id: "disp-001",
    name: "Green Leaf Dispensary",
    address: "123 Main St, Anytown",
    phone: "555-1234",
    email: "info@greenleaf.com",
    status: "open",
    createdAt: "2023-02-15T00:00:00Z",
    category: "medical",
    engineers: [],
    serviceRequests: [],
  },
  {
    id: "disp-002",
    name: "Herbal Wellness",
    address: "456 Elm St, Anytown",
    phone: "555-5678",
    email: "contact@herbalwellness.com",
    status: "closed",
    createdAt: "2023-03-01T00:00:00Z",
    category: "recreational",
    engineers: [],
    serviceRequests: [],
  },
  {
    id: "disp-003",
    name: "MediGreen",
    address: "789 Oak St, Anytown",
    phone: "555-9012",
    email: "hello@medigreen.com",
    status: "open",
    createdAt: "2023-03-15T00:00:00Z",
    category: "both",
    engineers: [],
    serviceRequests: [],
  },
];

export const SERVICE_REQUESTS_DATA: ServiceRequest[] = [
  {
    id: "sr-001",
    title: "Security System Malfunction",
    description: "Main entrance security camera is not recording properly.",
    status: "pending",
    createdAt: "2023-04-15T08:30:00Z",
    dispensaryId: "disp-001",
    dispensaryName: "Green Leaf Dispensary",
    priority: "high",
    responseNotes: []
  },
  {
    id: "sr-002",
    title: "Alarm System False Triggers",
    description: "The alarm system has been triggering without apparent reason during closing hours.",
    status: "in-progress",
    createdAt: "2023-04-10T14:15:00Z",
    dispensaryId: "disp-002",
    dispensaryName: "Herbal Wellness",
    priority: "medium",
    responseNotes: [
      {
        id: "note-001",
        text: "Initial investigation shows sensor malfunction. Replacement ordered.",
        createdAt: "2023-04-11T09:22:00Z",
        createdBy: "John Technician"
      }
    ]
  },
  {
    id: "sr-003",
    title: "Access Control Issue",
    description: "Staff are having trouble with their access cards at the storage room door.",
    status: "resolved",
    createdAt: "2023-04-05T11:45:00Z",
    resolvedAt: "2023-04-07T16:30:00Z",
    dispensaryId: "disp-003",
    dispensaryName: "MediGreen",
    priority: "low",
    responseNotes: [
      {
        id: "note-002",
        text: "Reader was recalibrated and cards were reprogrammed successfully.",
        createdAt: "2023-04-06T13:40:00Z",
        createdBy: "Alice Engineer"
      },
      {
        id: "note-003",
        text: "Issue resolved, no further action needed.",
        createdAt: "2023-04-07T16:28:00Z",
        createdBy: "Alice Engineer"
      }
    ]
  },
  {
    id: "sr-004",
    title: "Emergency Exit Door Alarm",
    description: "Emergency exit door alarm is not sounding when the door is opened",
    status: "pending",
    createdAt: "2023-04-16T10:20:00Z",
    dispensaryId: "disp-001",
    dispensaryName: "Green Leaf Dispensary",
    priority: "high",
    responseNotes: []
  },
  {
    id: "sr-005",
    title: "Security System Training Request",
    description: "New staff members need training on the security systems",
    status: "resolved",
    createdAt: "2023-04-01T09:00:00Z",
    resolvedAt: "2023-04-03T15:00:00Z",
    dispensaryId: "disp-002",
    dispensaryName: "Herbal Wellness",
    priority: "medium",
    responseNotes: [
      {
        id: "note-004",
        text: "Training session scheduled for April 3rd.",
        createdAt: "2023-04-01T15:10:00Z",
        createdBy: "Barbara Scheduler"
      },
      {
        id: "note-005",
        text: "Training completed successfully with 5 staff members.",
        createdAt: "2023-04-03T15:00:00Z",
        createdBy: "Carl Trainer"
      }
    ]
  }
];

export const INVOICES_DATA: Invoice[] = [
  {
    id: "inv-001",
    dispensaryId: "disp-001",
    amount: 500.00,
    dueDate: "2023-04-30T00:00:00Z",
    createdAt: "2023-04-01T00:00:00Z",
    status: "paid",
    items: [],
  },
  {
    id: "inv-002",
    dispensaryId: "disp-002",
    amount: 750.00,
    dueDate: "2023-05-15T00:00:00Z",
    createdAt: "2023-04-15T00:00:00Z",
    status: "pending",
    items: [],
  },
  {
    id: "inv-003",
    dispensaryId: "disp-003",
    amount: 1000.00,
    dueDate: "2023-05-31T00:00:00Z",
    createdAt: "2023-05-01T00:00:00Z",
    status: "paid",
    items: [],
  },
];

export const PAYMENTS_DATA: Payment[] = [
  {
    id: "pay-001",
    invoiceId: "inv-001",
    dispensaryId: "disp-001",
    amount: 500.00,
    method: "credit_card",
    status: "processed",
    createdAt: "2023-04-28T00:00:00Z",
  },
  {
    id: "pay-002",
    invoiceId: "inv-003",
    dispensaryId: "disp-003",
    amount: 1000.00,
    method: "bank_transfer",
    status: "processed",
    createdAt: "2023-05-29T00:00:00Z",
  },
];

export const SERVICE_AGREEMENTS_DATA: ServiceAgreement[] = [
  {
    id: "sa-001",
    dispensaryId: "disp-001",
    startDate: "2023-01-01T00:00:00Z",
    endDate: "2023-12-31T00:00:00Z",
    terms: "Standard security services agreement.",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "sa-002",
    dispensaryId: "disp-002",
    startDate: "2023-02-01T00:00:00Z",
    endDate: "2024-01-31T00:00:00Z",
    terms: "Enhanced security services agreement.",
    status: "active",
    createdAt: "2023-02-01T00:00:00Z",
  },
  {
    id: "sa-003",
    dispensaryId: "disp-003",
    startDate: "2023-03-01T00:00:00Z",
    endDate: "2024-02-29T00:00:00Z",
    terms: "Premium security services agreement.",
    status: "active",
    createdAt: "2023-03-01T00:00:00Z",
  },
];

// Function to generate initial users for the application
export const generateInitialUsers = (): User[] => {
  // Return the predefined users
  return [
    {
      id: "user-001",
      name: "Admin User",
      email: "admin@myerssecurity.com",
      role: "admin",
      status: "active",
      createdAt: "2023-01-01T00:00:00Z",
    },
    {
      id: "user-002",
      name: "Manager User",
      email: "manager@myerssecurity.com",
      role: "manager",
      status: "active",
      createdAt: "2023-01-02T00:00:00Z",
    },
    {
      id: "user-003",
      name: "Regular User",
      email: "user@myerssecurity.com",
      role: "user",
      status: "active",
      createdAt: "2023-01-03T00:00:00Z",
    },
  ];
};
