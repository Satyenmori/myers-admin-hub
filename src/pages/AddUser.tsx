
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import { Role, User } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, User as UserIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { USERS_DATA } from "@/lib/data";

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [storedUsers, setStoredUsers] = useLocalStorage<User[]>(LOCAL_STORAGE_KEYS.USERS, USERS_DATA);
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "user",
    status: "active",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate email
    const duplicateEmail = storedUsers.find(
      user => user.email.toLowerCase() === formData.email?.toLowerCase()
    );

    if (duplicateEmail) {
      toast({
        title: "Error",
        description: "A user with this email already exists",
        variant: "destructive",
      });
      return;
    }

    // Create new user
    const newUser: User = {
      id: uuidv4(),
      name: formData.name || "",
      email: formData.email || "",
      role: formData.role as Role || "user",
      status: formData.status as "active" | "inactive" || "active",
      createdAt: new Date().toISOString(),
    };
    
    // Update localStorage with new user
    const updatedUsers = [...storedUsers, newUser];
    setStoredUsers(updatedUsers);
    
    toast({
      title: "Success",
      description: "User added successfully",
    });

    navigate("/users");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate("/users")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-2xl font-bold">Add New User</h1>
        </div>
      </div>

      <div className="glass-card p-6 rounded-lg max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <UserIcon className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-medium">New User</h2>
            <p className="text-muted-foreground text-sm">
              Creating a new user account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="form-label block">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name || ""}
                onChange={handleChange}
                className="form-input"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="form-label block">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="form-input"
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="form-label block">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role || "user"}
                onChange={handleChange}
                className="form-input"
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                {currentUser?.role === "admin" && (
                  <option value="admin">Admin</option>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="form-label block">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status || "active"}
                onChange={handleChange}
                className="form-input"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
