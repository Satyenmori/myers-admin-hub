
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import { Role, User } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Edit, MoreHorizontal, Plus, Search, Trash, User as UserIcon, Wrench, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const ManageSupportEngineers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useLocalStorage<User[]>(LOCAL_STORAGE_KEYS.USERS, []);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "user",
    status: "active",
  });

  // Filter support engineers only
  const supportEngineers = users.filter(user => 
    user.role === "user" && 
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(supportEngineers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = supportEngineers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setSearch("");
    setCurrentPage(1);
  };

  // CRUD operations
  const handleAddUser = () => {
    const userWithSameEmail = users.find(
      (u) => u.email.toLowerCase() === newUser.email?.toLowerCase()
    );

    if (userWithSameEmail) {
      toast({
        title: "Error",
        description: "A user with this email already exists",
        variant: "destructive",
      });
      return;
    }

    const userToAdd: User = {
      id: uuidv4(),
      name: newUser.name || "",
      email: newUser.email || "",
      role: "user",
      status: newUser.status as "active" | "inactive" || "active",
      createdAt: new Date().toISOString(),
    };

    setUsers([...users, userToAdd]);
    setNewUser({
      name: "",
      email: "",
      role: "user",
      status: "active",
    });
    setIsAddUserModalOpen(false);
    toast({
      title: "Success",
      description: "Support engineer added successfully",
    });
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    const userWithSameEmail = users.find(
      (u) => u.email.toLowerCase() === editingUser.email.toLowerCase() && u.id !== editingUser.id
    );

    if (userWithSameEmail) {
      toast({
        title: "Error",
        description: "Another user with this email already exists",
        variant: "destructive",
      });
      return;
    }

    const updatedUsers = users.map((u) =>
      u.id === editingUser.id ? editingUser : u
    );

    setUsers(updatedUsers);
    setEditingUser(null);
    toast({
      title: "Success",
      description: "Support engineer updated successfully",
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      toast({
        title: "Error",
        description: "You cannot delete your own account",
        variant: "destructive",
      });
      return;
    }

    const updatedUsers = users.filter((u) => u.id !== userId);
    setUsers(updatedUsers);
    toast({
      title: "Success",
      description: "Support engineer deleted successfully",
    });
  };

  // Determine if user can perform actions based on role
  const canEdit = currentUser?.role === "admin" || currentUser?.role === "manager";
  const canDelete = currentUser?.role === "admin";
  const canAdd = currentUser?.role === "admin" || currentUser?.role === "manager";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Support Engineers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your field support engineers
          </p>
        </div>
        {canAdd && (
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Add Support Engineer
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
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>
          <button
            onClick={resetFilters}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-sm">Name</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Email</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Status</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Created</th>
                {(canEdit || canDelete) && (
                  <th className="px-4 py-3 text-right font-medium text-sm">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Wrench className="h-5 w-5" />
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    {(canEdit || canDelete) && (
                      <td className="px-4 py-3 text-right space-x-2">
                        {canEdit && (
                          <button
                            onClick={() => setEditingUser({ ...user })}
                            className="text-blue-500 hover:text-blue-700 inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-500 hover:text-red-700 inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={(canEdit || canDelete) ? 5 : 4} className="px-4 py-8 text-center text-muted-foreground">
                    No support engineers found. {search ? (
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
        {supportEngineers.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{Math.min(startIndex + 1, supportEngineers.length)}</span> to{" "}
              <span className="font-medium">{Math.min(startIndex + itemsPerPage, supportEngineers.length)}</span> of{" "}
              <span className="font-medium">{supportEngineers.length}</span> results
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

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Add New Support Engineer</h2>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
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
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="form-input"
                  placeholder="John Technician"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="form-label block mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="form-input"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="status" className="form-label block mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={newUser.status}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value as "active" | "inactive" })}
                  className="form-input"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="px-4 py-2 text-sm rounded-md border hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={!newUser.name || !newUser.email}
                className="btn-primary"
              >
                Add Support Engineer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Edit Support Engineer</h2>
              <button
                onClick={() => setEditingUser(null)}
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
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-email" className="form-label block mb-1">
                  Email
                </label>
                <input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-status" className="form-label block mb-1">
                  Status
                </label>
                <select
                  id="edit-status"
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as "active" | "inactive" })}
                  className="form-input"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-sm rounded-md border hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={!editingUser.name || !editingUser.email}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSupportEngineers;
