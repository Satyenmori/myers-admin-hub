
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

const Dispensaries: React.FC = () => {
  const [dispensaries, setDispensaries] = useLocalStorage<Dispensary[]>(LOCAL_STORAGE_KEYS.DISPENSARIES, []);
  const [newDispensary, setNewDispensary] = useState<Omit<Dispensary, 'id' | 'createdAt'>>({
    name: "",
    address: "",
    category: "medical",
    status: "open",
    engineers: [],
    serviceRequests: [],
  });
  const [open, setOpen] = useState(false);
  const [selectedDispensary, setSelectedDispensary] = useState<Dispensary | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewDispensary({ ...newDispensary, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: string, name: keyof Omit<Dispensary, 'id' | 'createdAt' | 'serviceRequests'>) => {
    setNewDispensary({ ...newDispensary, [name]: e });
  };

  const addDispensary = () => {
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
    setOpen(false);
    toast({
      title: "Dispensary added",
      description: `Dispensary ${newDispensaryWithId.name} added successfully`,
    });
  };

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

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dispensaries</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Dispensary</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Dispensary</DialogTitle>
              <DialogDescription>
                Add a new dispensary to the list.
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
                  value={newDispensary.name}
                  onChange={handleInputChange}
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
                  value={newDispensary.address}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select onValueChange={(e) => handleSelectChange(e, "category")}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" defaultValue={newDispensary.category} />
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
                <Select onValueChange={(e) => handleSelectChange(e, "status")}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" defaultValue={newDispensary.status} />
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
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={addDispensary}>Add</Button>
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
          {dispensaries.map((dispensary) => (
            <TableRow key={dispensary.id}>
              <TableCell className="font-medium">{dispensary.name}</TableCell>
              <TableCell>{dispensary.address}</TableCell>
              <TableCell>{dispensary.category}</TableCell>
              <TableCell>{dispensary.status}</TableCell>
              <TableCell className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setSelectedDispensary(dispensary);
                  setServiceRequests(dispensary.serviceRequests);
                }}>
                  View Service Requests
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleAddServiceRequest(dispensary)}>
                  Add Service Request
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedDispensary && (
        <Dialog open={!!selectedDispensary} onOpenChange={() => setSelectedDispensary(null)}>
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
              <Button type="button" variant="secondary" onClick={() => setSelectedDispensary(null)}>
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
