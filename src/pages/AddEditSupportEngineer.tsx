
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import { User } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Wrench } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const AddEditSupportEngineer: React.FC = () => {
  const { engineerId } = useParams<{ engineerId: string }>();
  const isEditing = Boolean(engineerId);
  const navigate = useNavigate();
  const [users, setUsers] = useLocalStorage<User[]>(LOCAL_STORAGE_KEYS.USERS, []);
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "user",
    status: "active",
  });

  useEffect(() => {
    if (isEditing && engineerId) {
      const engineerToEdit = users.find(u => u.id === engineerId);
      if (engineerToEdit) {
        setFormData(engineerToEdit);
      } else {
        toast({
          title: "Error",
          description: "Support engineer not found",
          variant: "destructive",
        });
        navigate("/manage-support-engineers");
      }
    }
  }, [isEditing, engineerId, users, navigate]);

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
    const duplicateEmail = users.find(
      user => user.email.toLowerCase() === formData.email?.toLowerCase() && user.id !== engineerId
    );

    if (duplicateEmail) {
      toast({
        title: "Error",
        description: "A user with this email already exists",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && engineerId) {
      // Update existing engineer
      const updatedUsers = users.map(user => 
        user.id === engineerId ? { ...user, ...formData, role: "user" } as User : user
      );
      setUsers(updatedUsers);
      toast({
        title: "Success",
        description: "Support engineer updated successfully",
      });
    } else {
      // Create new engineer
      const newEngineer: User = {
        id: uuidv4(),
        name: formData.name || "",
        email: formData.email || "",
        role: "user", // Always set role to "user" for support engineers
        status: formData.status as "active" | "inactive" || "active",
        createdAt: new Date().toISOString(),
      };
      setUsers([...users, newEngineer]);
      toast({
        title: "Success",
        description: "Support engineer added successfully",
      });
    }

    navigate("/manage-support-engineers");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate("/manage-support-engineers")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-2xl font-bold">{isEditing ? "Edit Support Engineer" : "Add New Support Engineer"}</h1>
        </div>
        <button
          onClick={handleSubmit}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isEditing ? "Save Changes" : "Create Support Engineer"}
        </button>
      </div>

      <div className="glass-card p-6 rounded-lg max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Wrench className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-medium">{isEditing ? formData.name : "New Support Engineer"}</h2>
            <p className="text-muted-foreground text-sm">
              {isEditing ? `Editing support engineer information` : `Creating a new support engineer account`}
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
                placeholder="John Technician"
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

export default AddEditSupportEngineer;
