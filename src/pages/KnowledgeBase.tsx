
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import { KnowledgeBaseEntry } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  Eye, 
  Plus, 
  Search, 
  Trash, 
  X 
} from "lucide-react";

const KnowledgeBase = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [entries, setEntries] = useLocalStorage<KnowledgeBaseEntry[]>(LOCAL_STORAGE_KEYS.KNOWLEDGE_BASE, []);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filtering logic
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? entry.category === categoryFilter : true;
    const matchesStatus = statusFilter ? entry.status === statusFilter : true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const handleDeleteEntry = (entryId: string) => {
    const updatedEntries = entries.filter((e) => e.id !== entryId);
    setEntries(updatedEntries);
    toast({
      title: "Success",
      description: "Knowledge base entry deleted successfully",
    });
  };

  // Determine if user can perform actions based on role
  const canEdit = currentUser?.role === "admin" || currentUser?.role === "manager";
  const canDelete = currentUser?.role === "admin";
  const canAdd = currentUser?.role === "admin" || currentUser?.role === "manager";
  const canView = true; // Everyone can view entries

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">
            Manage knowledge base content and resources
          </p>
        </div>
        {canAdd && (
          <Link
            to="/knowledge-base/add"
            className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Add Entry
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-input"
            >
              <option value="">All Categories</option>
              <option value="Services">Services</option>
              <option value="Case Studies">Case Studies</option>
              <option value="Testimonials">Testimonials</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={resetFilters}
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Entries Table */}
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-sm">Title</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Category</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Status</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Created</th>
                {(canView || canEdit || canDelete) && (
                  <th className="px-4 py-3 text-right font-medium text-sm">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedEntries.length > 0 ? (
                paginatedEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <span>{entry.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{entry.category}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        entry.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {canView && (
                        <Link
                          to={`/knowledge-base/view/${entry.id}`}
                          className="text-blue-500 hover:text-blue-700 inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      )}
                      {canEdit && (
                        <Link
                          to={`/knowledge-base/edit/${entry.id}`}
                          className="text-blue-500 hover:text-blue-700 inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-red-500 hover:text-red-700 inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={(canView || canEdit || canDelete) ? 5 : 4} className="px-4 py-8 text-center text-muted-foreground">
                    No knowledge base entries found. {search || categoryFilter || statusFilter ? (
                      <button
                        onClick={resetFilters}
                        className="text-primary hover:underline"
                      >
                        Clear filters
                      </button>
                    ) : null}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredEntries.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{Math.min(startIndex + 1, filteredEntries.length)}</span> to{" "}
              <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredEntries.length)}</span> of{" "}
              <span className="font-medium">{filteredEntries.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="form-input h-8 w-16 text-xs"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
