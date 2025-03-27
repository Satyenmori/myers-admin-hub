
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import { KnowledgeBaseEntry } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, BookOpen, Calendar, Edit, ExternalLink, FileText, Video } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ViewKnowledgeBaseEntry: React.FC = () => {
  const { entryId } = useParams<{ entryId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [entries] = useLocalStorage<KnowledgeBaseEntry[]>(LOCAL_STORAGE_KEYS.KNOWLEDGE_BASE, []);
  const [entry, setEntry] = useState<KnowledgeBaseEntry | null>(null);

  // Determine if user can edit based on role
  const canEdit = currentUser?.role === "admin" || currentUser?.role === "manager";

  useEffect(() => {
    if (entryId) {
      const foundEntry = entries.find(e => e.id === entryId);
      if (foundEntry) {
        setEntry(foundEntry);
      } else {
        toast({
          title: "Error",
          description: "Knowledge base entry not found",
          variant: "destructive",
        });
        navigate("/knowledge-base");
      }
    }
  }, [entryId, entries, navigate]);

  if (!entry) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold">Knowledge Base Entry</h1>
        </div>
        {canEdit && (
          <Link
            to={`/knowledge-base/edit/${entry.id}`}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Entry
          </Link>
        )}
      </div>

      <div className="glass-card p-6 rounded-lg max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6 pb-4 border-b">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <BookOpen className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-medium">{entry.title}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  entry.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                </span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(entry.createdAt).toLocaleDateString()}
              </span>
              <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {entry.category}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {entry.description.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {(entry.videoUrl || entry.blogUrl || entry.fileUrl) && (
            <div className="space-y-4 mt-6 pt-6 border-t">
              <h3 className="text-lg font-medium">Resources</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {entry.videoUrl && (
                  <a 
                    href={entry.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <Video className="h-8 w-8 mb-2 text-primary" />
                    <span className="text-sm font-medium">Watch Video</span>
                    <span className="text-xs text-muted-foreground mt-1">View tutorial</span>
                  </a>
                )}
                
                {entry.blogUrl && (
                  <a 
                    href={entry.blogUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <ExternalLink className="h-8 w-8 mb-2 text-primary" />
                    <span className="text-sm font-medium">Read Blog</span>
                    <span className="text-xs text-muted-foreground mt-1">Additional information</span>
                  </a>
                )}
                
                {entry.fileUrl && (
                  <a 
                    href={entry.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <FileText className="h-8 w-8 mb-2 text-primary" />
                    <span className="text-sm font-medium">Download File</span>
                    <span className="text-xs text-muted-foreground mt-1">Documentation</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewKnowledgeBaseEntry;
