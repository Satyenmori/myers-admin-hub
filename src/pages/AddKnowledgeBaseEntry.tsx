
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import { KnowledgeBaseEntry } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, BookOpen, Save } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Textarea } from "@/components/ui/textarea";

const AddKnowledgeBaseEntry: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useLocalStorage<KnowledgeBaseEntry[]>(LOCAL_STORAGE_KEYS.KNOWLEDGE_BASE, []);
  
  const [formData, setFormData] = useState<Partial<KnowledgeBaseEntry>>({
    title: "",
    category: "Services",
    description: "",
    videoUrl: "",
    blogUrl: "",
    fileUrl: "",
    status: "active",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Create new entry
    const newEntry: KnowledgeBaseEntry = {
      id: uuidv4(),
      title: formData.title || "",
      category: formData.category as "Services" | "Case Studies" | "Testimonials",
      description: formData.description || "",
      videoUrl: formData.videoUrl,
      blogUrl: formData.blogUrl,
      fileUrl: formData.fileUrl,
      status: formData.status as "active" | "inactive",
      createdAt: new Date().toISOString(),
    };
    
    setEntries([...entries, newEntry]);
    
    toast({
      title: "Success",
      description: "Knowledge base entry added successfully",
    });

    navigate("/knowledge-base");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate("/knowledge-base")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-2xl font-bold">Add Knowledge Base Entry</h1>
        </div>
      </div>

      <div className="glass-card p-6 rounded-lg max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <BookOpen className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-medium">New Knowledge Base Entry</h2>
            <p className="text-muted-foreground text-sm">
              Add information to the knowledge base
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="form-label block">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title || ""}
                onChange={handleChange}
                className="form-input w-full"
                placeholder="Enter title"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="form-label block">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category || "Services"}
                onChange={handleChange}
                className="form-input w-full"
                required
              >
                <option value="Services">Services</option>
                <option value="Case Studies">Case Studies</option>
                <option value="Testimonials">Testimonials</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="form-label block">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="form-input w-full min-h-[120px]"
                placeholder="Enter detailed description"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="videoUrl" className="form-label block">
                Video URL
              </label>
              <input
                id="videoUrl"
                name="videoUrl"
                type="url"
                value={formData.videoUrl || ""}
                onChange={handleChange}
                className="form-input w-full"
                placeholder="https://example.com/video"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="blogUrl" className="form-label block">
                Blog URL
              </label>
              <input
                id="blogUrl"
                name="blogUrl"
                type="url"
                value={formData.blogUrl || ""}
                onChange={handleChange}
                className="form-input w-full"
                placeholder="https://example.com/blog"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="fileUrl" className="form-label block">
                File URL
              </label>
              <input
                id="fileUrl"
                name="fileUrl"
                type="url"
                value={formData.fileUrl || ""}
                onChange={handleChange}
                className="form-input w-full"
                placeholder="https://example.com/file.pdf"
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
                className="form-input w-full"
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
              Create Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddKnowledgeBaseEntry;
