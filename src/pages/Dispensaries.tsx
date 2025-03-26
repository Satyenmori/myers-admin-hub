
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispensary, ServiceRequest } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import useLocalStorage from "@/hooks/useLocalStorage";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Invoice, Payment, ServiceAgreement } from "@/lib/types";

const Dispensaries: React.FC = () => {
  // Dispensary state and functions
  const [dispensaries, setDispensaries] = useLocalStorage<Dispensary[]>(LOCAL_STORAGE_KEYS.DISPENSARIES, []);
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>(LOCAL_STORAGE_KEYS.INVOICES, []);
  const [payments, setPayments] = useLocalStorage<Payment[]>(LOCAL_STORAGE_KEYS.PAYMENTS, []);
  const [serviceAgreements, setServiceAgreements] = useLocalStorage<ServiceAgreement[]>(LOCAL_STORAGE_KEYS.SERVICE_AGREEMENTS, []);
  
  const [newDispensary, setNewDispensary] = useState<Omit<Dispensary, 'id' | 'createdAt'>>({
    name: "",
    address: "",
    category: "medical",
    status: "open",
    engineers: [],
    serviceRequests: [],
  });
  
  // Invoice state
  const [newInvoice, setNewInvoice] = useState<Omit<Invoice, 'id' | 'createdAt'>>({
    dispensaryId: "",
    amount: 0,
    dueDate: "",
    status: "pending",
    items: [],
  });
  
  // Payment state
  const [newPayment, setNewPayment] = useState<Omit<Payment, 'id' | 'createdAt'>>({
    dispensaryId: "",
    invoiceId: "",
    amount: 0,
    method: "credit_card",
    status: "processed",
  });
  
  // Service Agreement state
  const [newServiceAgreement, setNewServiceAgreement] = useState<Omit<ServiceAgreement, 'id' | 'createdAt'>>({
    dispensaryId: "",
    startDate: "",
    endDate: "",
    status: "active",
    terms: "",
  });
  
  // UI state
  const [openDialogs, setOpenDialogs] = useState({
    dispensary: false,
    invoice: false,
    payment: false,
    serviceAgreement: false,
    serviceRequests: false,
    dispensaryDetails: false
  });
  
  const [selectedDispensary, setSelectedDispensary] = useState<Dispensary | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("dispensaries");
  const [editMode, setEditMode] = useState(false);
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Filtered dispensaries
  const filteredDispensaries = dispensaries.filter(dispensary => {
    const matchesSearch = dispensary.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         dispensary.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || dispensary.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  const currentDispensaries = filteredDispensaries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDispensaries.length / itemsPerPage);
  
  // Handler functions for dispensary
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewDispensary({ ...newDispensary, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: string, name: keyof Omit<Dispensary, 'id' | 'createdAt' | 'serviceRequests'>) => {
    setNewDispensary({ ...newDispensary, [name]: e });
  };

  const addDispensary = () => {
    if (!newDispensary.name || !newDispensary.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const newId = uuidv4();
    const newDispensaryWithId = {
      ...newDispensary,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    
    setDispensaries([...dispensaries, newDispensaryWithId]);
    setNewDispensary({
      name: "",
      address: "",
      category: "medical",
      status: "open",
      engineers: [],
      serviceRequests: [],
    });
    
    setOpenDialogs({ ...openDialogs, dispensary: false });
    toast({
      title: "Dispensary added",
      description: `Dispensary ${newDispensaryWithId.name} added successfully`,
    });
  };

  const updateDispensary = () => {
    if (!selectedDispensary) return;
    
    const updatedDispensaries = dispensaries.map(d => {
      if (d.id === selectedDispensary.id) {
        return { ...selectedDispensary };
      }
      return d;
    });
    
    setDispensaries(updatedDispensaries);
    setOpenDialogs({ ...openDialogs, dispensary: false });
    setEditMode(false);
    
    toast({
      title: "Dispensary updated",
      description: `Dispensary ${selectedDispensary.name} updated successfully`,
    });
  };

  const deleteDispensary = (id: string) => {
    setDispensaries(dispensaries.filter(d => d.id !== id));
    
    // Also delete related records
    setInvoices(invoices.filter(i => i.dispensaryId !== id));
    setPayments(payments.filter(p => p.dispensaryId !== id));
    setServiceAgreements(serviceAgreements.filter(sa => sa.dispensaryId !== id));
    
    toast({
      title: "Dispensary deleted",
      description: "Dispensary and all related records deleted successfully",
    });
  };

  // Invoice handlers
  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "amount") {
      setNewInvoice({ ...newInvoice, [e.target.name]: parseFloat(e.target.value) });
    } else {
      setNewInvoice({ ...newInvoice, [e.target.name]: e.target.value });
    }
  };

  const handleInvoiceSelectChange = (value: string, field: string) => {
    setNewInvoice({ ...newInvoice, [field]: value });
  };

  const addInvoice = () => {
    if (!newInvoice.dispensaryId || !newInvoice.amount || !newInvoice.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const newId = uuidv4();
    const newInvoiceWithId = {
      ...newInvoice,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    
    setInvoices([...invoices, newInvoiceWithId]);
    setNewInvoice({
      dispensaryId: "",
      amount: 0,
      dueDate: "",
      status: "pending",
      items: [],
    });
    
    setOpenDialogs({ ...openDialogs, invoice: false });
    toast({
      title: "Invoice added",
      description: `Invoice ${newId} added successfully`,
    });
  };

  // Payment handlers
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "amount") {
      setNewPayment({ ...newPayment, [e.target.name]: parseFloat(e.target.value) });
    } else {
      setNewPayment({ ...newPayment, [e.target.name]: e.target.value });
    }
  };

  const handlePaymentSelectChange = (value: string, field: string) => {
    setNewPayment({ ...newPayment, [field]: value });
  };

  const addPayment = () => {
    if (!newPayment.dispensaryId || !newPayment.invoiceId || !newPayment.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const newId = uuidv4();
    const newPaymentWithId = {
      ...newPayment,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    
    setPayments([...payments, newPaymentWithId]);
    setNewPayment({
      dispensaryId: "",
      invoiceId: "",
      amount: 0,
      method: "credit_card",
      status: "processed",
    });
    
    setOpenDialogs({ ...openDialogs, payment: false });
    toast({
      title: "Payment added",
      description: `Payment ${newId} added successfully`,
    });
  };

  // Service Agreement handlers
  const handleServiceAgreementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewServiceAgreement({ ...newServiceAgreement, [e.target.name]: e.target.value });
  };

  const handleServiceAgreementSelectChange = (value: string, field: string) => {
    setNewServiceAgreement({ ...newServiceAgreement, [field]: value });
  };

  const addServiceAgreement = () => {
    if (!newServiceAgreement.dispensaryId || !newServiceAgreement.startDate || !newServiceAgreement.endDate || !newServiceAgreement.terms) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const newId = uuidv4();
    const newServiceAgreementWithId = {
      ...newServiceAgreement,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    
    setServiceAgreements([...serviceAgreements, newServiceAgreementWithId]);
    setNewServiceAgreement({
      dispensaryId: "",
      startDate: "",
      endDate: "",
      status: "active",
      terms: "",
    });
    
    setOpenDialogs({ ...openDialogs, serviceAgreement: false });
    toast({
      title: "Service Agreement added",
      description: `Service Agreement ${newId} added successfully`,
    });
  };

  // Service Request handlers
  const handleAddServiceRequest = (dispensary: Dispensary) => {
    const newRequest = {
      id: uuidv4(),
      title: `Service Request for ${dispensary.name}`,
      description: "New service request description",
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      dispensaryId: dispensary.id,
      priority: "medium" as const,
    };

    const updatedDispensaries = dispensaries.map(d => {
      if (d.id === dispensary.id) {
        return { ...d, serviceRequests: [...d.serviceRequests, newRequest] };
      }
      return d;
    });

    setDispensaries(updatedDispensaries);
    setSelectedDispensary(dispensary);
    setServiceRequests(prev => [...prev, newRequest]);

    toast({
      title: "Service request added",
      description: `Service request added for ${dispensary.name}`,
    });
  };

  const updateServiceRequestStatus = (requestId: string, newStatus: ServiceRequest['status']) => {
    const updatedDispensaries = dispensaries.map(dispensary => {
      const updatedRequests = dispensary.serviceRequests.map(request => {
        if (request.id === requestId) {
          return { ...request, status: newStatus };
        }
        return request;
      });
      return { ...dispensary, serviceRequests: updatedRequests };
    });

    setDispensaries(updatedDispensaries);
    setServiceRequests(prev =>
      prev.map(request =>
        request.id === requestId ? { ...request, status: newStatus } : request
      )
    );

    toast({
      title: "Service request updated",
      description: `Service request status updated to ${newStatus}`,
    });
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Edit dispensary
  const startEditDispensary = (dispensary: Dispensary) => {
    setSelectedDispensary(dispensary);
    setEditMode(true);
    setOpenDialogs({ ...openDialogs, dispensary: true });
  };

  // View dispensary details
  const viewDispensaryDetails = (dispensary: Dispensary) => {
    setSelectedDispensary(dispensary);
    setOpenDialogs({ ...openDialogs, dispensaryDetails: true });
  };

  // View service requests
  const viewServiceRequests = (dispensary: Dispensary) => {
    setSelectedDispensary(dispensary);
    setServiceRequests(dispensary.serviceRequests);
    setOpenDialogs({ ...openDialogs, serviceRequests: true });
  };

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Dispensaries Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            placeholder="Search dispensaries..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full sm:w-60"
          />
          
          <Select value={filterStatus} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="under-maintenance">Under Maintenance</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="dispensaries">Dispensaries</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="agreements">Service Agreements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dispensaries" className="mt-6">
          <div className="flex justify-end mb-4">
            <Dialog open={openDialogs.dispensary} onOpenChange={(open) => setOpenDialogs({ ...openDialogs, dispensary: open })}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditMode(false);
                  setNewDispensary({
                    name: "",
                    address: "",
                    category: "medical",
                    status: "open",
                    engineers: [],
                    serviceRequests: [],
                  });
                }}>
                  Add Dispensary
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editMode ? "Edit Dispensary" : "Add Dispensary"}</DialogTitle>
                  <DialogDescription>
                    {editMode ? "Update dispensary information." : "Add a new dispensary to the list."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={editMode && selectedDispensary ? selectedDispensary.name : newDispensary.name}
                      onChange={editMode && selectedDispensary 
                        ? (e) => setSelectedDispensary({...selectedDispensary, name: e.target.value}) 
                        : handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input
                      type="text"
                      id="address"
                      name="address"
                      value={editMode && selectedDispensary ? selectedDispensary.address : newDispensary.address}
                      onChange={editMode && selectedDispensary 
                        ? (e) => setSelectedDispensary({...selectedDispensary, address: e.target.value}) 
                        : handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select 
                      value={editMode && selectedDispensary ? selectedDispensary.category : newDispensary.category}
                      onValueChange={(e) => {
                        if (editMode && selectedDispensary) {
                          setSelectedDispensary({...selectedDispensary, category: e as Dispensary['category']});
                        } else {
                          handleSelectChange(e, "category");
                        }
                      }}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="recreational">Recreational</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select 
                      value={editMode && selectedDispensary ? selectedDispensary.status : newDispensary.status}
                      onValueChange={(e) => {
                        if (editMode && selectedDispensary) {
                          setSelectedDispensary({...selectedDispensary, status: e as Dispensary['status']});
                        } else {
                          handleSelectChange(e, "status");
                        }
                      }}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="under-maintenance">Under Maintenance</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => {
                    setOpenDialogs({ ...openDialogs, dispensary: false });
                    setEditMode(false);
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit" onClick={editMode ? updateDispensary : addDispensary}>
                    {editMode ? "Update" : "Add"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Table>
            <TableCaption>List of dispensaries</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentDispensaries.length > 0 ? (
                currentDispensaries.map((dispensary) => (
                  <TableRow key={dispensary.id}>
                    <TableCell className="font-medium">{dispensary.name}</TableCell>
                    <TableCell>{dispensary.address}</TableCell>
                    <TableCell>{dispensary.category}</TableCell>
                    <TableCell>{dispensary.status}</TableCell>
                    <TableCell className="flex space-x-2 flex-wrap">
                      <Button variant="outline" size="sm" onClick={() => viewDispensaryDetails(dispensary)}>
                        View
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => startEditDispensary(dispensary)}>
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => viewServiceRequests(dispensary)}>
                        Service Requests
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteDispensary(dispensary.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">No dispensaries found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink isActive={currentPage === page} onClick={() => handlePageChange(page)}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-6">
          <div className="flex justify-end mb-4">
            <Dialog open={openDialogs.invoice} onOpenChange={(open) => setOpenDialogs({ ...openDialogs, invoice: open })}>
              <DialogTrigger asChild>
                <Button>Add Invoice</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Invoice</DialogTitle>
                  <DialogDescription>
                    Create a new invoice for a dispensary.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dispensaryId" className="text-right">
                      Dispensary
                    </Label>
                    <Select onValueChange={(e) => handleInvoiceSelectChange(e, "dispensaryId")}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select dispensary" />
                      </SelectTrigger>
                      <SelectContent>
                        {dispensaries.map((dispensary) => (
                          <SelectItem key={dispensary.id} value={dispensary.id}>{dispensary.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      type="number"
                      id="amount"
                      name="amount"
                      value={newInvoice.amount || ""}
                      onChange={handleInvoiceChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dueDate" className="text-right">
                      Due Date
                    </Label>
                    <Input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={newInvoice.dueDate}
                      onChange={handleInvoiceChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select 
                      value={newInvoice.status} 
                      onValueChange={(e) => handleInvoiceSelectChange(e, "status")}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setOpenDialogs({ ...openDialogs, invoice: false })}>
                    Cancel
                  </Button>
                  <Button type="submit" onClick={addInvoice}>Add</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Table>
            <TableCaption>List of invoices</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Dispensary</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length > 0 ? (
                invoices.map((invoice) => {
                  const dispensary = dispensaries.find(d => d.id === invoice.dispensaryId);
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id.substring(0, 8)}</TableCell>
                      <TableCell>{dispensary ? dispensary.name : "Unknown"}</TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{invoice.status}</TableCell>
                      <TableCell className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No invoices found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="payments" className="mt-6">
          <div className="flex justify-end mb-4">
            <Dialog open={openDialogs.payment} onOpenChange={(open) => setOpenDialogs({ ...openDialogs, payment: open })}>
              <DialogTrigger asChild>
                <Button>Add Payment</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Payment</DialogTitle>
                  <DialogDescription>
                    Record a new payment for an invoice.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dispensaryId" className="text-right">
                      Dispensary
                    </Label>
                    <Select onValueChange={(e) => handlePaymentSelectChange(e, "dispensaryId")}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select dispensary" />
                      </SelectTrigger>
                      <SelectContent>
                        {dispensaries.map((dispensary) => (
                          <SelectItem key={dispensary.id} value={dispensary.id}>{dispensary.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="invoiceId" className="text-right">
                      Invoice
                    </Label>
                    <Select onValueChange={(e) => handlePaymentSelectChange(e, "invoiceId")}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select invoice" />
                      </SelectTrigger>
                      <SelectContent>
                        {invoices
                          .filter(invoice => invoice.dispensaryId === newPayment.dispensaryId)
                          .map((invoice) => (
                            <SelectItem key={invoice.id} value={invoice.id}>
                              {invoice.id.substring(0, 8)} - ${invoice.amount.toFixed(2)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      type="number"
                      id="amount"
                      name="amount"
                      value={newPayment.amount || ""}
                      onChange={handlePaymentChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="method" className="text-right">
                      Method
                    </Label>
                    <Select
                      value={newPayment.method}
                      onValueChange={(e) => handlePaymentSelectChange(e, "method")}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setOpenDialogs({ ...openDialogs, payment: false })}>
                    Cancel
                  </Button>
                  <Button type="submit" onClick={addPayment}>Add</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Table>
            <TableCaption>List of payments</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Dispensary</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length > 0 ? (
                payments.map((payment) => {
                  const dispensary = dispensaries.find(d => d.id === payment.dispensaryId);
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id.substring(0, 8)}</TableCell>
                      <TableCell>{dispensary ? dispensary.name : "Unknown"}</TableCell>
                      <TableCell>{payment.invoiceId.substring(0, 8)}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No payments found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="agreements" className="mt-6">
          <div className="flex justify-end mb-4">
            <Dialog open={openDialogs.serviceAgreement} onOpenChange={(open) => setOpenDialogs({ ...openDialogs, serviceAgreement: open })}>
              <DialogTrigger asChild>
                <Button>Add Service Agreement</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Service Agreement</DialogTitle>
                  <DialogDescription>
                    Create a new service agreement for a dispensary.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dispensaryId" className="text-right">
                      Dispensary
                    </Label>
                    <Select onValueChange={(e) => handleServiceAgreementSelectChange(e, "dispensaryId")}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select dispensary" />
                      </SelectTrigger>
                      <SelectContent>
                        {dispensaries.map((dispensary) => (
                          <SelectItem key={dispensary.id} value={dispensary.id}>{dispensary.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      Start Date
                    </Label>
                    <Input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={newServiceAgreement.startDate}
                      onChange={handleServiceAgreementChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">
                      End Date
                    </Label>
                    <Input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={newServiceAgreement.endDate}
                      onChange={handleServiceAgreementChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={newServiceAgreement.status}
                      onValueChange={(e) => handleServiceAgreementSelectChange(e, "status")}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="terms" className="text-right">
                      Terms
                    </Label>
                    <Textarea
                      id="terms"
                      name="terms"
                      value={newServiceAgreement.terms}
                      onChange={handleServiceAgreementChange}
                      className="col-span-3"
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setOpenDialogs({ ...openDialogs, serviceAgreement: false })}>
                    Cancel
                  </Button>
                  <Button type="submit" onClick={addServiceAgreement}>Add</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Table>
            <TableCaption>List of service agreements</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Agreement ID</TableHead>
                <TableHead>Dispensary</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceAgreements.length > 0 ? (
                serviceAgreements.map((agreement) => {
                  const dispensary = dispensaries.find(d => d.id === agreement.dispensaryId);
                  return (
                    <TableRow key={agreement.id}>
                      <TableCell className="font-medium">{agreement.id.substring(0, 8)}</TableCell>
                      <TableCell>{dispensary ? dispensary.name : "Unknown"}</TableCell>
                      <TableCell>{new Date(agreement.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(agreement.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>{agreement.status}</TableCell>
                      <TableCell className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No service agreements found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
      
      {/* Dispensary Details Dialog */}
      {selectedDispensary && (
        <Dialog open={openDialogs.dispensaryDetails} onOpenChange={(open) => setOpenDialogs({ ...openDialogs, dispensaryDetails: open })}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Dispensary Details</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedDispensary.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="font-medium mt-1">{selectedDispensary.name}</p>
                </div>
                <div>
                  <Label>Category</Label>
                  <p className="font-medium mt-1 capitalize">{selectedDispensary.category}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className="font-medium mt-1 capitalize">{selectedDispensary.status}</p>
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <p className="font-medium mt-1">{selectedDispensary.address}</p>
              </div>
              <div>
                <Label>Created On</Label>
                <p className="font-medium mt-1">{new Date(selectedDispensary.createdAt).toLocaleString()}</p>
              </div>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Invoices</p>
                      <p className="text-2xl font-bold">
                        {invoices.filter(i => i.dispensaryId === selectedDispensary.id).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Amount</p>
                      <p className="text-2xl font-bold">
                        ${invoices
                          .filter(i => i.dispensaryId === selectedDispensary.id && i.status === "pending")
                          .reduce((sum, invoice) => sum + invoice.amount, 0)
                          .toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Paid</p>
                      <p className="text-2xl font-bold">
                        ${payments
                          .filter(p => p.dispensaryId === selectedDispensary.id)
                          .reduce((sum, payment) => sum + payment.amount, 0)
                          .toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpenDialogs({ ...openDialogs, dispensaryDetails: false })}>
                Close
              </Button>
              <Button type="button" onClick={() => {
                setOpenDialogs({ ...openDialogs, dispensaryDetails: false });
                startEditDispensary(selectedDispensary);
              }}>
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Service Requests Dialog */}
      {selectedDispensary && (
        <Dialog open={openDialogs.serviceRequests} onOpenChange={(open) => setOpenDialogs({ ...openDialogs, serviceRequests: open })}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Service Requests for {selectedDispensary.name}</DialogTitle>
              <DialogDescription>
                Manage service requests for this dispensary.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              {serviceRequests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.title}</TableCell>
                        <TableCell>
                          <Select
                            value={request.status}
                            onValueChange={(value) =>
                              updateServiceRequestStatus(request.id, value as ServiceRequest['status'])
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={request.status} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No service requests found for this dispensary.</p>
              )}
            </ScrollArea>
            <DialogFooter>
              <Button 
                type="button" 
                onClick={() => handleAddServiceRequest(selectedDispensary)}
              >
                Add Service Request
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setOpenDialogs({ ...openDialogs, serviceRequests: false })}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Dispensaries;
