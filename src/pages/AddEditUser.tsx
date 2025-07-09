
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import { Role, User } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, User as UserIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const AddEditUser: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const isEditing = Boolean(userId);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useLocalStorage<User[]>(LOCAL_STORAGE_KEYS.USERS, []);
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "user",
    status: "active",
  });

  useEffect(() => {
    if (isEditing && userId) {
      const userToEdit = users.find(u => u.id === userId);
      if (userToEdit) {
        setFormData(userToEdit);
      } else {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        navigate("/users");
      }
    }
  }, [isEditing, userId, users, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation of name
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate email
    const duplicateEmail = users.find(
      user => user.email.toLowerCase() === formData.email?.toLowerCase() && user.id !== userId
    );

    if (duplicateEmail) {
      toast({
        title: "Error",
        description: "A user with this email already exists",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && userId) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, ...formData } as User : user
      );
      setUsers(updatedUsers);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } else {
      // Create new user
      const newUser: User = {
        id: uuidv4(),
        name: formData.name || "",
        email: formData.email || "",
        role: formData.role as Role || "user",
        status: formData.status as "active" | "inactive" || "active",
        createdAt: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
      toast({
        title: "Success",
        description: "User added successfully",
      });
    }

    navigate("/users");
  };

  const canChangeRole = !isEditing || formData.id !== currentUser?.id;
  const canChangeStatus = !isEditing || formData.id !== currentUser?.id;

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
          <h1 className="text-2xl font-bold">{isEditing ? "Edit User" : "Add New User"}</h1>
        </div>
        <button
          onClick={handleSubmit}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isEditing ? "Save Changes" : "Create User"}
        </button>
      </div>

      <div className="glass-card p-6 rounded-lg max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <UserIcon className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-medium">{isEditing ? formData.name : "New User"}</h2>
            <p className="text-muted-foreground text-sm">
              {isEditing ? `Editing user information` : `Creating a new user account`}
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
                disabled={!canChangeRole}
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                {currentUser?.role === "admin" && (
                  <option value="admin">Admin</option>
                )}
              </select>
              {!canChangeRole && (
                <p className="text-xs text-muted-foreground mt-1">
                  You cannot change your own role
                </p>
              )}
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
                disabled={!canChangeStatus}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {!canChangeStatus && (
                <p className="text-xs text-muted-foreground mt-1">
                  You cannot change your own status
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Created on {new Date(formData.createdAt || "").toLocaleDateString()}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddEditUser;
