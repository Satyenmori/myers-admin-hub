
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import { Dispensary, ServiceRequest, User } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Filter,
  Search,
  X,
  Eye,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Static service requests data
const staticServiceRequests = [
  {
    id: "sr-001",
    title: "Software Update Needed",
    description: "The POS system needs an urgent software update to version 2.5",
    status: "pending" as const,
    createdAt: "2023-06-15T10:30:00Z",
    dispensaryId: "disp-001",
    dispensaryName: "Green Leaf Dispensary",
    priority: "high" as const,
    responseNotes: [
      {
        id: "note-001",
        text: "We've scheduled the update for tomorrow morning",
        createdAt: "2023-06-15T14:20:00Z",
        createdBy: "user-002"
      }
    ]
  },
  {
    id: "sr-002",
    title: "Security System Malfunction",
    description: "The security cameras in the back room have stopped working",
    status: "in-progress" as const,
    createdAt: "2023-06-10T08:45:00Z",
    dispensaryId: "disp-002",
    dispensaryName: "MediCanna",
    priority: "high" as const,
    responseNotes: [
      {
        id: "note-002",
        text: "Technician has been dispatched",
        createdAt: "2023-06-10T09:30:00Z",
        createdBy: "user-001"
      },
      {
        id: "note-003",
        text: "Issue identified, waiting for replacement parts",
        createdAt: "2023-06-11T15:20:00Z",
        createdBy: "user-003"
      }
    ]
  },
  {
    id: "sr-003",
    title: "Internet Connection Issues",
    description: "Experiencing slow internet connection affecting sales transactions",
    status: "resolved" as const,
    createdAt: "2023-06-05T16:10:00Z",
    resolvedAt: "2023-06-07T11:25:00Z",
    dispensaryId: "disp-003",
    dispensaryName: "Herbal Solutions",
    priority: "medium" as const,
    responseNotes: [
      {
        id: "note-004",
        text: "Router has been reset",
        createdAt: "2023-06-05T17:00:00Z",
        createdBy: "user-002"
      },
      {
        id: "note-005",
        text: "ISP confirmed service disruption, now resolved",
        createdAt: "2023-06-07T10:15:00Z",
        createdBy: "user-001"
      }
    ]
  },
  {
    id: "sr-004",
    title: "POS System Crash",
    description: "System crashes when processing large orders",
    status: "pending" as const,
    createdAt: "2023-06-14T09:20:00Z",
    dispensaryId: "disp-004",
    dispensaryName: "Nature's Remedy",
    priority: "high" as const
  },
  {
    id: "sr-005",
    title: "Printer Not Working",
    description: "Receipt printer is not connecting to the system",
    status: "in-progress" as const,
    createdAt: "2023-06-13T13:40:00Z",
    dispensaryId: "disp-001",
    dispensaryName: "Green Leaf Dispensary",
    priority: "low" as const,
    responseNotes: [
      {
        id: "note-006",
        text: "Checking printer drivers",
        createdAt: "2023-06-13T14:10:00Z",
        createdBy: "user-003"
      }
    ]
  }
];

const ServiceRequests = () => {
  const { user: currentUser } = useAuth();
  const [dispensaries] = useLocalStorage<Dispensary[]>(
    LOCAL_STORAGE_KEYS.DISPENSARIES,
    []
  );
  const [users] = useLocalStorage<User[]>(LOCAL_STORAGE_KEYS.USERS, []);
  const [serviceRequestsData, setServiceRequestsData] = useState(staticServiceRequests);

  // Pagination and filtering
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // View and response modals
  const [viewingRequest, setViewingRequest] = useState<ServiceRequest | null>(null);
  const [respondingToRequest, setRespondingToRequest] = useState<ServiceRequest | null>(null);
  const [responseNote, setResponseNote] = useState("");

  // Filtering logic
  const filteredRequests = serviceRequestsData.filter((request) => {
    const matchesSearch = request.title.toLowerCase().includes(search.toLowerCase()) || 
                          request.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? request.status === statusFilter : true;
    const matchesPriority = priorityFilter ? request.priority === priorityFilter : true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort by createdAt descending (newest first)
  const sortedRequests = [...filteredRequests].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Pagination logic
  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = sortedRequests.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setCurrentPage(1);
  };

  const getDispensaryById = (id: string) => {
    return dispensaries.find(d => d.id === id);
  };

  const handleRespondToRequest = () => {
    if (!respondingToRequest || !responseNote.trim() || !currentUser) return;

    const updatedServiceRequests = serviceRequestsData.map(request => {
      if (request.id === respondingToRequest.id) {
        return {
          ...request,
          responseNotes: [
            ...(request.responseNotes || []),
            {
              id: Date.now().toString(),
              text: responseNote,
              createdAt: new Date().toISOString(),
              createdBy: currentUser.id
            }
          ],
          status: request.status === 'pending' ? 'in-progress' : request.status
        };
      }
      return request;
    });

    setServiceRequestsData(updatedServiceRequests);
    setResponseNote("");
    setRespondingToRequest(null);
    
    toast({
      title: "Response Added",
      description: "Your response has been added to the service request",
    });
  };

  const handleUpdateRequestStatus = (requestId: string, newStatus: "pending" | "in-progress" | "resolved") => {
    const updatedServiceRequests = serviceRequestsData.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: newStatus,
          ...(newStatus === "resolved" ? { resolvedAt: new Date().toISOString() } : {})
        };
      }
      return request;
    });

    setServiceRequestsData(updatedServiceRequests);

    if (viewingRequest && viewingRequest.id === requestId) {
      const updatedRequest = updatedServiceRequests.find(r => r.id === requestId);
      if (updatedRequest) {
        setViewingRequest(updatedRequest);
      }
    }
    
    toast({
      title: "Status Updated",
      description: `Service request status updated to ${newStatus.replace('-', ' ')}`,
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
    }
  };

  const getPriorityBadgeClass = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
    }
  };

  const formatStatus = (status: string) => {
    return status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const canRespond = currentUser?.role === "admin" || currentUser?.role === "manager";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Service Requests</h1>
          <p className="text-muted-foreground mt-1">
            Manage and respond to service requests from dispensaries
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="form-input"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
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

      {/* Service Requests Table */}
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Dispensary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="font-medium">{request.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {request.description.substring(0, 60)}
                        {request.description.length > 60 ? "..." : ""}
                      </div>
                    </TableCell>
                    <TableCell>
                      {request.dispensaryName}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {formatStatus(request.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityBadgeClass(request.priority)}`}>
                        {request.priority ? formatStatus(request.priority) : "Normal"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {formatDateTime(request.createdAt)}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <button
                        onClick={() => setViewingRequest(request)}
                        className="text-blue-500 hover:text-blue-700 inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {canRespond && (
                        <button
                          onClick={() => setRespondingToRequest(request)}
                          className="text-blue-500 hover:text-blue-700 inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent"
                          title="Respond"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No service requests found. {search || statusFilter || priorityFilter ? (
                      <button
                        onClick={resetFilters}
                        className="text-primary hover:underline"
                      >
                        Clear filters
                      </button>
                    ) : null}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredRequests.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{Math.min(startIndex + 1, filteredRequests.length)}</span> to{" "}
              <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredRequests.length)}</span> of{" "}
              <span className="font-medium">{filteredRequests.length}</span> results
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

      {/* View Request Modal */}
      {viewingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl h-[90vh] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Service Request Details</h2>
              <button
                onClick={() => setViewingRequest(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex flex-col h-[calc(100%-8rem)] overflow-y-auto">
              <div className="p-4 space-y-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{viewingRequest.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(viewingRequest.status)}`}>
                        {getStatusIcon(viewingRequest.status)}
                        {formatStatus(viewingRequest.status)}
                      </span>
                      {viewingRequest.priority && (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityBadgeClass(viewingRequest.priority)}`}>
                          {formatStatus(viewingRequest.priority)} Priority
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Created: {formatDateTime(viewingRequest.createdAt)}</div>
                    {viewingRequest.resolvedAt && (
                      <div>Resolved: {formatDateTime(viewingRequest.resolvedAt)}</div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Dispensary</h4>
                  <p>{viewingRequest.dispensaryName}</p>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                  <p className="whitespace-pre-line">{viewingRequest.description}</p>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Response History</h4>
                  {viewingRequest.responseNotes && viewingRequest.responseNotes.length > 0 ? (
                    <div className="space-y-4">
                      {viewingRequest.responseNotes.map((note: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">{getUserName(note.createdBy)}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDateTime(note.createdAt)}
                            </div>
                          </div>
                          <p className="text-sm">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No responses yet</p>
                  )}
                </div>
                
                {canRespond && viewingRequest.status !== "resolved" && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {viewingRequest.status === "pending" && (
                      <button
                        onClick={() => handleUpdateRequestStatus(viewingRequest.id, "in-progress")}
                        className="btn-secondary py-2 px-4 text-sm"
                      >
                        Mark as In Progress
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateRequestStatus(viewingRequest.id, "resolved")}
                      className="btn-primary py-2 px-4 text-sm"
                    >
                      Mark as Resolved
                    </button>
                    <button
                      onClick={() => {
                        setRespondingToRequest(viewingRequest);
                        setViewingRequest(null);
                      }}
                      className="btn-secondary py-2 px-4 text-sm"
                    >
                      Add Response
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setViewingRequest(null)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Respond to Request Modal */}
      {respondingToRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Respond to Request</h2>
              <button
                onClick={() => setRespondingToRequest(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <div className="font-medium">{respondingToRequest.title}</div>
                <div className="text-sm text-muted-foreground mb-4">
                  {respondingToRequest.dispensaryName}
                </div>
              </div>
              <div>
                <Label htmlFor="response" className="block mb-2">Your Response</Label>
                <textarea
                  id="response"
                  value={responseNote}
                  onChange={(e) => setResponseNote(e.target.value)}
                  className="form-input min-h-[150px]"
                  placeholder="Enter your response to the service request..."
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setRespondingToRequest(null)}
                className="px-4 py-2 text-sm rounded-md border hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleRespondToRequest}
                disabled={!responseNote.trim()}
                className="btn-primary"
              >
                Submit Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;
