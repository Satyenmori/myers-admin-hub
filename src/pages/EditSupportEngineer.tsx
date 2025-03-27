
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import { User } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Wrench } from "lucide-react";

const EditSupportEngineer: React.FC = () => {
  const { engineerId } = useParams<{ engineerId: string }>();
  const navigate = useNavigate();
  const [users, setUsers] = useLocalStorage<User[]>(LOCAL_STORAGE_KEYS.USERS, []);
  
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    status: "active",
  });

  useEffect(() => {
    if (engineerId) {
      const engineerToEdit = users.find(u => u.id === engineerId);
      if (engineerToEdit) {
        // Split name into first and last name if not already present
        if (!engineerToEdit.firstName && !engineerToEdit.lastName && engineerToEdit.name) {
          const nameParts = engineerToEdit.name.split(' ');
          engineerToEdit.firstName = nameParts[0] || '';
          engineerToEdit.lastName = nameParts.slice(1).join(' ') || '';
        }
        
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
  }, [engineerId, users, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
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

    // Create full name from first and last name
    const fullName = `${formData.firstName} ${formData.lastName}`;

    // Update existing engineer
    const updatedUsers = users.map(user => 
      user.id === engineerId ? { 
        ...user, 
        ...formData, 
        name: fullName,
        role: "user" // Ensure role is always "user" for support engineers
      } as User : user
    );
    setUsers(updatedUsers);
    
    toast({
      title: "Success",
      description: "Support engineer updated successfully",
    });

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
          <h1 className="text-2xl font-bold">Edit Support Engineer</h1>
        </div>
      </div>

      <div className="glass-card p-6 rounded-lg max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Wrench className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-medium">{formData.name}</h2>
            <p className="text-muted-foreground text-sm">
              Editing support engineer information
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="firstName" className="form-label block">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName || ""}
                onChange={handleChange}
                className="form-input"
                placeholder="John"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="form-label block">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName || ""}
                onChange={handleChange}
                className="form-input"
                placeholder="Technician"
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
              <label htmlFor="password" className="form-label block">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password || ""}
                onChange={handleChange}
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="form-label block">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone || ""}
                onChange={handleChange}
                className="form-input"
                placeholder="(123) 456-7890"
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

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Created on {new Date(formData.createdAt || "").toLocaleDateString()}
            </p>
            
            <button
              type="submit"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupportEngineer;
