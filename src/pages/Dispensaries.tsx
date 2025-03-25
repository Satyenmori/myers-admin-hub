
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import { Dispensary, ServiceRequest, User } from "@/lib/types";
import { generateInitialDispensaries } from "@/lib/data";
import { toast } from "@/hooks/use-toast";
import { 
  Building, 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  Eye, 
  Filter, 
  Plus, 
  Search, 
  Trash, 
  X 
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const Dispensaries = () => {
  const { user: currentUser } = useAuth();
  const [dispensaries, setDispensaries] = useLocalStorage<Dispensary[]>(
    LOCAL_STORAGE_KEYS.DISPENSARIES, 
    generateInitialDispensaries()
  );
  const [users] = useLocalStorage<User[]>(LOCAL_STORAGE_KEYS.USERS, []);
  
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDispensary, setEditingDispensary] = useState<Dispensary | null>(null);
  const [viewingDispensary, setViewingDispensary] = useState<Dispensary | null>(null);
  const [newDispensary, setNewDispensary] = useState<Partial<Dispensary>>({
    name: "",
    address: "",
    category: "both",
    status: "open",
    engineers: [],
  });
  
  const [newServiceRequest, setNewServiceRequest] = useState<Partial<ServiceRequest>>({
    title: "",
    description: "",
    status: "pending",
  });

  // Filtering logic
  const filteredDispensaries = dispensaries.filter((dispensary) => {
    const matchesSearch = dispensary.name.toLowerCase().includes(search.toLowerCase()) || 
                          dispensary.address.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? dispensary.category === categoryFilter : true;
    const matchesStatus = statusFilter ? dispensary.status === statusFilter : true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDispensaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDispensaries = filteredDispensaries.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  // Support engineers are users with role "user"
  const supportEngineers = users.filter(u => u.role === "user" && u.status === "active");

  // CRUD operations
  const handleAddDispensary = () => {
    const dispensaryToAdd: Dispensary = {
      id: uuidv4(),
      name: newDispensary.name || "",
      address: newDispensary.address || "",
      category: newDispensary.category as "medical" | "recreational" | "both" || "both",
      status: newDispensary.status as "open" | "under-maintenance" | "closed" || "open",
      engineers: newDispensary.engineers || [],
      createdAt: new Date().toISOString(),
      serviceRequests: [],
    };

    setDispensaries([...dispensaries, dispensaryToAdd]);
    setNewDispensary({
      name: "",
      address: "",
      category: "both",
      status: "open",
      engineers: [],
    });
    setIsAddModalOpen(false);
    toast({
      title: "Success",
      description: "Dispensary added successfully",
    });
  };

  const handleUpdateDispensary = () => {
    if (!editingDispensary) return;

    const updatedDispensaries = dispensaries.map((d) =>
      d.id === editingDispensary.id ? editingDispensary : d
    );

    setDispensaries(updatedDispensaries);
    setEditingDispensary(null);
    toast({
      title: "Success",
      description: "Dispensary updated successfully",
    });
  };

  const handleDeleteDispensary = (dispensaryId: string) => {
    const updatedDispensaries = dispensaries.filter((d) => d.id !== dispensaryId);
    setDispensaries(updatedDispensaries);
    toast({
      title: "Success",
      description: "Dispensary deleted successfully",
    });
  };

  const handleAddServiceRequest = () => {
    if (!viewingDispensary) return;
    
    const serviceRequestToAdd: ServiceRequest = {
      id: uuidv4(),
      title: newServiceRequest.title || "",
      description: newServiceRequest.description || "",
      status: newServiceRequest.status as "pending" | "in-progress" | "resolved" || "pending",
      createdAt: new Date().toISOString(),
    };

    const updatedDispensary = {
      ...viewingDispensary,
      serviceRequests: [...viewingDispensary.serviceRequests, serviceRequestToAdd],
    };

    const updatedDispensaries = dispensaries.map((d) =>
      d.id === viewingDispensary.id ? updatedDispensary : d
    );

    setDispensaries(updatedDispensaries);
    setViewingDispensary(updatedDispensary);
    setNewServiceRequest({
      title: "",
      description: "",
      status: "pending",
    });
    
    toast({
      title: "Success",
      description: "Service request added successfully",
    });
  };

  const handleUpdateServiceRequestStatus = (dispensaryId: string, requestId: string, newStatus: "pending" | "in-progress" | "resolved") => {
    const updatedDispensaries = dispensaries.map((d) => {
      if (d.id === dispensaryId) {
        const updatedRequests = d.serviceRequests.map((r) => {
          if (r.id === requestId) {
            return {
              ...r,
              status: newStatus,
              ...(newStatus === "resolved" ? { resolvedAt: new Date().toISOString() } : {}),
            };
          }
          return r;
        });
        
        return {
          ...d,
          serviceRequests: updatedRequests,
        };
      }
      return d;
    });

    setDispensaries(updatedDispensaries);
    
    if (viewingDispensary && viewingDispensary.id === dispensaryId) {
      const updatedViewingDispensary = updatedDispensaries.find(d => d.id === dispensaryId);
      if (updatedViewingDispensary) {
        setViewingDispensary(updatedViewingDispensary);
      }
    }
    
    toast({
      title: "Success",
      description: "Service request status updated",
    });
  };

  // Determine if user can perform actions based on role
  const canEdit = currentUser?.role === "admin" || currentUser?.role === "manager";
  const canDelete = currentUser?.role === "admin";
  const canAdd = currentUser?.role === "admin" || currentUser?.role === "manager";

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "under-maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "closed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "in-progress":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
    }
  };

  const formatStatus = (status: string) => {
    return status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  const getEngineerNames = (engineerIds: string[]) => {
    return engineerIds.map(id => {
      const engineer = users.find(u => u.id === id);
      return engineer ? engineer.name : "Unknown Engineer";
    }).join(", ");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dispensaries</h1>
          <p className="text-muted-foreground mt-1">
            Manage dispensaries and their service requests
          </p>
        </div>
        {canAdd && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Add Dispensary
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by name or address..."
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
              <option value="medical">Medical</option>
              <option value="recreational">Recreational</option>
              <option value="both">Both</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="under-maintenance">Under Maintenance</option>
              <option value="closed">Closed</option>
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

      {/* Dispensaries Table */}
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-sm">Name</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Category</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Status</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Engineers</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Service Requests</th>
                <th className="px-4 py-3 text-right font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDispensaries.length > 0 ? (
                paginatedDispensaries.map((dispensary) => (
                  <tr key={dispensary.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Building className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span>{dispensary.name}</span>
                          <span className="text-xs text-muted-foreground">{dispensary.address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {dispensary.category}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(dispensary.status)}`}>
                        {formatStatus(dispensary.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {dispensary.engineers.length > 0 ? (
                        <span>{getEngineerNames(dispensary.engineers)}</span>
                      ) : (
                        <span className="text-muted-foreground">No engineers assigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{dispensary.serviceRequests.length}</span>
                        <span className="text-xs text-muted-foreground">
                          ({dispensary.serviceRequests.filter(sr => sr.status === "pending").length} pending)
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => setViewingDispensary(dispensary)}
                        className="text-blue-500 hover:text-blue-700 inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {canEdit && (
                        <button
                          onClick={() => setEditingDispensary({ ...dispensary })}
                          className="text-blue-500 hover:text-blue-700 inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteDispensary(dispensary.id)}
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
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No dispensaries found. {search || categoryFilter || statusFilter ? (
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
        {filteredDispensaries.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{Math.min(startIndex + 1, filteredDispensaries.length)}</span> to{" "}
              <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredDispensaries.length)}</span> of{" "}
              <span className="font-medium">{filteredDispensaries.length}</span> results
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

      {/* Add Dispensary Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Add New Dispensary</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="name" className="form-label block mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={newDispensary.name}
                  onChange={(e) => setNewDispensary({ ...newDispensary, name: e.target.value })}
                  className="form-input"
                  placeholder="Downtown Dispensary"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="form-label block mb-1">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={newDispensary.address}
                  onChange={(e) => setNewDispensary({ ...newDispensary, address: e.target.value })}
                  className="form-input"
                  placeholder="123 Main St, Anytown, USA"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="form-label block mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={newDispensary.category}
                  onChange={(e) => setNewDispensary({ ...newDispensary, category: e.target.value as "medical" | "recreational" | "both" })}
                  className="form-input"
                  required
                >
                  <option value="medical">Medical</option>
                  <option value="recreational">Recreational</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="form-label block mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={newDispensary.status}
                  onChange={(e) => setNewDispensary({ ...newDispensary, status: e.target.value as "open" | "under-maintenance" | "closed" })}
                  className="form-input"
                  required
                >
                  <option value="open">Open</option>
                  <option value="under-maintenance">Under Maintenance</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label htmlFor="engineers" className="form-label block mb-1">
                  Assign Support Engineers
                </label>
                <select
                  id="engineers"
                  multiple
                  value={newDispensary.engineers}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setNewDispensary({ ...newDispensary, engineers: selected });
                  }}
                  className="form-input h-32"
                  required
                >
                  {supportEngineers.map(engineer => (
                    <option key={engineer.id} value={engineer.id}>
                      {engineer.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Hold Ctrl/Cmd to select multiple engineers
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm rounded-md border hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDispensary}
                disabled={!newDispensary.name || !newDispensary.address}
                className="btn-primary"
              >
                Add Dispensary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dispensary Modal */}
      {editingDispensary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Edit Dispensary</h2>
              <button
                onClick={() => setEditingDispensary(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="edit-name" className="form-label block mb-1">
                  Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={editingDispensary.name}
                  onChange={(e) => setEditingDispensary({ ...editingDispensary, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-address" className="form-label block mb-1">
                  Address
                </label>
                <input
                  id="edit-address"
                  type="text"
                  value={editingDispensary.address}
                  onChange={(e) => setEditingDispensary({ ...editingDispensary, address: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-category" className="form-label block mb-1">
                  Category
                </label>
                <select
                  id="edit-category"
                  value={editingDispensary.category}
                  onChange={(e) => setEditingDispensary({ ...editingDispensary, category: e.target.value as "medical" | "recreational" | "both" })}
                  className="form-input"
                  required
                >
                  <option value="medical">Medical</option>
                  <option value="recreational">Recreational</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-status" className="form-label block mb-1">
                  Status
                </label>
                <select
                  id="edit-status"
                  value={editingDispensary.status}
                  onChange={(e) => setEditingDispensary({ ...editingDispensary, status: e.target.value as "open" | "under-maintenance" | "closed" })}
                  className="form-input"
                  required
                >
                  <option value="open">Open</option>
                  <option value="under-maintenance">Under Maintenance</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-engineers" className="form-label block mb-1">
                  Assign Support Engineers
                </label>
                <select
                  id="edit-engineers"
                  multiple
                  value={editingDispensary.engineers}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setEditingDispensary({ ...editingDispensary, engineers: selected });
                  }}
                  className="form-input h-32"
                  required
                >
                  {supportEngineers.map(engineer => (
                    <option key={engineer.id} value={engineer.id}>
                      {engineer.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Hold Ctrl/Cmd to select multiple engineers
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setEditingDispensary(null)}
                className="px-4 py-2 text-sm rounded-md border hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDispensary}
                disabled={!editingDispensary.name || !editingDispensary.address}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Dispensary Modal */}
      {viewingDispensary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl h-[90vh] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">{viewingDispensary.name}</h2>
              <button
                onClick={() => setViewingDispensary(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex flex-col h-[calc(100%-8rem)]">
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                    <p>{viewingDispensary.address}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                    <p className="capitalize">{viewingDispensary.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(viewingDispensary.status)}`}>
                      {formatStatus(viewingDispensary.status)}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Created On</h3>
                    <p>{new Date(viewingDispensary.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Support Engineers</h3>
                    {viewingDispensary.engineers.length > 0 ? (
                      <p>{getEngineerNames(viewingDispensary.engineers)}</p>
                    ) : (
                      <p className="text-muted-foreground">No engineers assigned</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Service Requests</h3>
                  {(canAdd || canEdit) && (
                    <button
                      onClick={() => setNewServiceRequest({
                        title: "",
                        description: "",
                        status: "pending",
                      })}
                      className="btn-primary inline-flex items-center gap-1 text-sm py-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add Request
                    </button>
                  )}
                </div>
                
                {newServiceRequest.title !== undefined && (
                  <div className="mb-6 p-4 border rounded-lg animate-fade-in">
                    <h4 className="text-sm font-medium mb-3">New Service Request</h4>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="request-title" className="form-label block mb-1 text-xs">
                          Title
                        </label>
                        <input
                          id="request-title"
                          type="text"
                          value={newServiceRequest.title}
                          onChange={(e) => setNewServiceRequest({ ...newServiceRequest, title: e.target.value })}
                          className="form-input text-sm"
                          placeholder="Enter request title"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="request-description" className="form-label block mb-1 text-xs">
                          Description
                        </label>
                        <textarea
                          id="request-description"
                          value={newServiceRequest.description}
                          onChange={(e) => setNewServiceRequest({ ...newServiceRequest, description: e.target.value })}
                          className="form-input text-sm min-h-[80px]"
                          placeholder="Enter request description"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="request-status" className="form-label block mb-1 text-xs">
                          Status
                        </label>
                        <select
                          id="request-status"
                          value={newServiceRequest.status}
                          onChange={(e) => setNewServiceRequest({ ...newServiceRequest, status: e.target.value as "pending" | "in-progress" | "resolved" })}
                          className="form-input text-sm"
                          required
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-2 mt-3">
                        <button
                          onClick={() => setNewServiceRequest({ title: undefined })}
                          className="px-3 py-1 text-sm rounded-md border hover:bg-muted"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddServiceRequest}
                          disabled={!newServiceRequest.title || !newServiceRequest.description}
                          className="btn-primary py-1 px-3 text-sm"
                        >
                          Add Request
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {viewingDispensary.serviceRequests.length > 0 ? (
                  <div className="space-y-4">
                    {viewingDispensary.serviceRequests.sort((a, b) => 
                      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    ).map((request) => (
                      <div key={request.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{request.title}</h4>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                            {formatStatus(request.status)}
                          </span>
                        </div>
                        <p className="text-sm mb-3">{request.description}</p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <div>
                            Created: {new Date(request.createdAt).toLocaleString()}
                            {request.resolvedAt && (
                              <span className="ml-3">
                                Resolved: {new Date(request.resolvedAt).toLocaleString()}
                              </span>
                            )}
                          </div>
                          {(canEdit || canAdd) && request.status !== "resolved" && (
                            <div className="flex items-center gap-2">
                              {request.status === "pending" && (
                                <button
                                  onClick={() => handleUpdateServiceRequestStatus(viewingDispensary.id, request.id, "in-progress")}
                                  className="text-blue-500 hover:text-blue-700 text-xs"
                                >
                                  Mark In Progress
                                </button>
                              )}
                              <button
                                onClick={() => handleUpdateServiceRequestStatus(viewingDispensary.id, request.id, "resolved")}
                                className="text-green-500 hover:text-green-700 text-xs"
                              >
                                Mark Resolved
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No service requests found
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setViewingDispensary(null)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dispensaries;
