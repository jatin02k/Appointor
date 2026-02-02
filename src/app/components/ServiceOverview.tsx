"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Briefcase, Edit, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface RawService {
  id: number | string;
  name: string;
  duration_minutes: number | string;
  price: number | string;
  description: string | null;
  features: string | string[] | null | undefined;
  // Add other properties if they exist in the raw data
}

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  description: string;
  features: string[];
}

interface ServiceOverviewProps {
  initialServices: RawService[];
}

const stringToArray = (s: string): string[] => {
  return s
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

// Helper function to convert an array of strings to a comma-separated string
const arrayToString = (arr: string[]): string => {
  return arr.join(", ");
};

export default function ServiceOverview({
  initialServices,
}: ServiceOverviewProps) {
  const [services, setServices] = useState<Service[]>(
    (initialServices).map((s: RawService) => ({
      ...s,
      id: String(s.id), // Ensure id is string
      duration_minutes: Number(s.duration_minutes),
      price: Number(s.price),
      description: s.description || "",
      features: Array.isArray(s.features)
        ? s.features
        : s.features
        ? stringToArray(String(s.features))
        : [],
    }))
  );
  // Edit service states
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editName, setEditName] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFeatures, setEditFeatures] = useState("");
  // const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");

  // Add service states
  const [isAddingService, setIsAddingService] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newFeatures, setNewFeatures] = useState("");
  // const [newStatus, setNewStatus] = useState<"active" | "inactive">("active");

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setEditName(service.name);
    setEditDuration(String(service.duration_minutes));
    setEditPrice(String(service.price));
    setEditDescription(String(service.description));
    setEditFeatures(arrayToString(service.features));
  };
  const handleSaveEdit = async () => {
    if (
      !editingService ||
      !editName ||
      !editDuration ||
      !editPrice ||
      !editDescription ||
      !editFeatures
    )
      return;
    const featuresArray = stringToArray(editFeatures);
    if (featuresArray.length === 0) return;
    // FIX 4: Call PUT API
    const cleanDuration = Number(editDuration.replace(/[^0-9]/g, ""));
    const cleanPrice = Number(editPrice.replace(/[^0-9.]/g, ""));

    const response = await fetch("/api/admin/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingService.id,
        name: editName,
        duration_minutes: cleanDuration,
        price: cleanPrice,
        description: editDescription,
        features: featuresArray,
      }),
    });

    if (response.ok) {
      const updatedServiceData = await response.json();
      setServices(
        services.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                name: updatedServiceData.name,
                duration_minutes: updatedServiceData.duration_minutes,
                price: updatedServiceData.price,
                description: updatedServiceData.description,
                features: updatedServiceData.features,
              }
            : s
        )
      );
      setEditingService(null);
      resetEditForm();
    } else {
      console.error("Failed to save edit:", await response.json());
      alert("Failed to save changes.");
    }
  };

  const handleAddService = async () => {
    if (!newName || !newDuration || !newPrice || !newDescription || !newFeatures)
      return;
    const featuresArray = stringToArray(newFeatures);
    if (featuresArray.length === 0) return;
    // FIX 5: Call POST API
    const cleanDuration = Number(newDuration.replace(/[^0-9]/g, ""));
    const cleanPrice = Number(newPrice.replace(/[^0-9.]/g, ""));

    const response = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        duration_minutes: cleanDuration, 
        price: cleanPrice,
        description: newDescription,
        features: featuresArray,
      }),
    });

    if (response.ok) {
      const newServiceData = await response.json();
      const newService: Service = {
        ...newServiceData,
        id: String(newServiceData.id), // Use DB generated ID (UUID)
        duration_minutes: Number(newServiceData.duration_minutes), // Ensure number
        name:String(newServiceData.name),
        price:Number(newServiceData.price),
        description: String(newServiceData.description),
        features:newServiceData.features,
      };
      setServices([...services, newService]);
      setIsAddingService(false);
      resetAddForm();
    } else {
      console.error("Failed to add service:", await response.json());
      alert("Failed to add service.");
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    // FIX 6: Add confirmation dialogue here (or wrap the button better)
    if (!confirm(`Are you sure you want to delete service ID ${serviceId}?`))
      return;

    // FIX 7: Call DELETE API
    const response = await fetch("/api/admin/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: serviceId }),
    });

    if (response.status === 204) {
      setServices(services.filter((s) => s.id !== serviceId));
    } else {
      const errorMessage = "Failed to delete service.";
      try {
        const errorBody = await response.json();
        // Assuming the server returns an object like { error: "Database Delete Failed: ..." }
        // errorMessage = errorBody.error || errorMessage; // unused
        console.error("Delete error body:", errorBody); // Log it instead
      } catch (e) {
        // Failsafe if the 500 error response wasn't proper JSON either
        console.error("Could not parse error response body:", e);
      }
      console.error("Failed to delete service:", await response.json());
      alert("Failed to delete service.");
    }
  };

  const resetEditForm = () => {
    setEditName("");
    setEditDuration("");
    setEditPrice("");
    setEditDescription("");
    setEditFeatures("");
    // setEditStatus("active");
  };

  const resetAddForm = () => {
    setNewName("");
    setNewDuration("");
    setNewPrice("");
    setNewDescription("");
    setNewFeatures("");
    // setNewStatus("active");
  };

  return (
    <div className="lg:col-span-1">
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              Service Overview
            </div>
            <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent className=" bg-gray-50">
                <DialogHeader>
                  <DialogTitle>Add New Service</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-name">Service Name</Label>
                    <Input
                      id="new-name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g., Personal Training"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-duration">Chair Time</Label>
                    <Input
                      id="new-duration"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      placeholder="e.g., 60 min"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-price">Price</Label>
                    <Input
                      id="new-price"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="e.g., Rs. 80"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-description">Description</Label>
                    <Input
                      id="new-description"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="e.g., Service Description"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-features">Features</Label>
                    <Input
                      id="new-features"
                      value={newFeatures}
                      onChange={(e) => setNewFeatures(e.target.value)}
                      placeholder="e.g., Service Features"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleAddService}
                      disabled={
                        !newName ||
                        !newDuration ||
                        !newPrice ||
                        !newDescription ||
                        !newFeatures
                      }
                      className="flex-1 bg-black text-white hover:bg-gray-800"
                    >
                      Add Service
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingService(false);
                        resetAddForm();
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {services.map((service, index) => {
              const gradients = [
                {
                  bg: "from-orange-50 to-pink-50",
                  border: "border-orange-200",
                  badge: "from-orange-500 to-pink-500",
                },
                {
                  bg: "from-purple-50 to-blue-50",
                  border: "border-purple-200",
                  badge: "from-purple-500 to-blue-500",
                },
                {
                  bg: "from-green-50 to-emerald-50",
                  border: "border-green-200",
                  badge: "from-green-500 to-emerald-500",
                },
              ];
              const gradient = gradients[index % gradients.length];

              return (
                <div
                  key={service.id}
                  className={`bg-gradient-to-r ${gradient.bg} border-2 ${gradient.border} rounded-lg p-4 hover:shadow-md transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-black">{service.name}</h3>
                    <div className="flex items-center gap-2">
                      {/* <Badge className={`bg-gradient-to-r ${gradient.badge} text-white border-0`}>
                            {service.status}
                          </Badge> */}
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditService(service)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className=" bg-gray-100">
                            <DialogHeader>
                              <DialogTitle>Edit Service</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="edit-name">Service Name</Label>
                                <Input
                                  id="edit-name"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                />
                              </div>

                              <div>
                                <Label htmlFor="edit-duration">Chair Time</Label>
                                <Input
                                  id="edit-duration"
                                  value={editDuration}
                                  onChange={(e) =>
                                    setEditDuration(e.target.value)
                                  }
                                />
                              </div>

                              <div>
                                <Label htmlFor="edit-price">Price</Label>
                                <Input
                                  id="edit-price"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-description">
                                  Description
                                </Label>
                                <Input
                                  id="edit-description"
                                  value={editDescription}
                                  onChange={(e) =>
                                    setEditDescription(e.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-features">Features</Label>
                                <Input
                                  id="edit-features"
                                  value={editFeatures}
                                  onChange={(e) =>
                                    setEditFeatures(e.target.value)
                                  }
                                />
                              </div>

                              <div className="flex gap-2 pt-4">
                                <Button
                                  onClick={handleSaveEdit}
                                  disabled={
                                    !editName ||
                                    !editDuration ||
                                    !editPrice ||
                                    !editDescription ||
                                    !editFeatures
                                  }
                                  className="flex-1 bg-black text-white hover:bg-gray-800"
                                >
                                  Save Changes
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setEditingService(null);
                                    resetEditForm();
                                  }}
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Service
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {service.name}?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteService(service.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {service.description}
                  </p>
                  <br />
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>⏱️ {service.duration_minutes}min</span>
                    <span>💰 ₹{String(service.price)}</span>
                  </div>
                  <br />
                  
                  {service.features.length > 0 && (
                    <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 ml-4">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          {/* Custom list bullet for styling */}
                          <span className="inline-block mr-1 text-purple-500 text-lg leading-none">
                            &bull;
                          </span>
                          <span className="flex-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
