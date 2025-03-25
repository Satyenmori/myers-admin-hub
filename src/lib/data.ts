
import { Dispensary, ServiceRequest, User } from "./types";
import { v4 as uuidv4 } from "uuid";

export const generateInitialUsers = (): User[] => {
  return [
    {
      id: uuidv4(),
      name: "Admin User",
      email: "admin@myerssecurity.com",
      role: "admin",
      status: "active",
      avatar: "/avatars/admin.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: "Manager User",
      email: "manager@myerssecurity.com",
      role: "manager",
      status: "active",
      avatar: "/avatars/manager.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: "Regular User",
      email: "user@myerssecurity.com",
      role: "user",
      status: "active",
      avatar: "/avatars/user.jpg",
      createdAt: new Date().toISOString(),
    },
    ...Array.from({ length: 10 }, (_, i) => ({
      id: uuidv4(),
      name: `Test User ${i + 1}`,
      email: `testuser${i + 1}@myerssecurity.com`,
      role: (i % 3 === 0 ? "admin" : i % 3 === 1 ? "manager" : "user") as "admin" | "manager" | "user",
      status: i % 4 === 0 ? "inactive" : "active" as "active" | "inactive",
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    })),
  ];
};

export const generateServiceRequests = (): ServiceRequest[] => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: uuidv4(),
    title: `Service Request ${i + 1}`,
    description: `Description for service request ${i + 1}`,
    status: (i % 3 === 0 ? "pending" : i % 3 === 1 ? "in-progress" : "resolved") as "pending" | "in-progress" | "resolved",
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: i % 3 === 2 ? new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString() : undefined,
  }));
};

export const generateInitialDispensaries = (): Dispensary[] => {
  const engineers = generateInitialUsers()
    .filter((user) => user.role === "user")
    .map((user) => user.id);

  return [
    {
      id: uuidv4(),
      name: "Downtown Dispensary",
      address: "123 Main St, Anytown, USA",
      category: "both",
      status: "open",
      engineers: engineers.slice(0, 2),
      createdAt: new Date().toISOString(),
      serviceRequests: generateServiceRequests(),
    },
    {
      id: uuidv4(),
      name: "Midtown Dispensary",
      address: "456 Center Ave, Anytown, USA",
      category: "medical",
      status: "under-maintenance",
      engineers: engineers.slice(1, 3),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      serviceRequests: generateServiceRequests(),
    },
    {
      id: uuidv4(),
      name: "Uptown Dispensary",
      address: "789 North St, Anytown, USA",
      category: "recreational",
      status: "closed",
      engineers: engineers.slice(2, 4),
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      serviceRequests: generateServiceRequests(),
    },
    ...Array.from({ length: 10 }, (_, i) => ({
      id: uuidv4(),
      name: `Test Dispensary ${i + 1}`,
      address: `${i + 100} Test St, Anytown, USA`,
      category: (i % 3 === 0 ? "medical" : i % 3 === 1 ? "recreational" : "both") as "medical" | "recreational" | "both",
      status: (i % 3 === 0 ? "open" : i % 3 === 1 ? "under-maintenance" : "closed") as "open" | "under-maintenance" | "closed",
      engineers: engineers.slice(i % engineers.length, (i % engineers.length) + 2),
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      serviceRequests: generateServiceRequests(),
    })),
  ];
};
