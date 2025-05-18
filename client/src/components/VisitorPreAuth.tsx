import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { CarFront, Plus, X, CalendarIcon, Clock, ListCheck } from "lucide-react";
import { Badge } from "./ui/badge";

// Sample visitor pre-authorization data
const preAuthData = [
  {
    id: 1,
    eventName: "Annual Science Conference",
    date: "2025-05-15",
    timeWindow: "08:00 - 18:00",
    totalVehicles: 12,
    status: "active",
  },
  {
    id: 2,
    eventName: "Alumni Meet",
    date: "2025-05-20",
    timeWindow: "14:00 - 21:00",
    totalVehicles: 25,
    status: "active", 
  },
  {
    id: 3,
    eventName: "Career Fair",
    date: "2025-06-05",
    timeWindow: "09:00 - 17:00",
    totalVehicles: 18,
    status: "scheduled",
  },
  {
    id: 4,
    eventName: "Board of Directors Meeting",
    date: "2025-04-28",
    timeWindow: "10:00 - 16:00",
    totalVehicles: 8,
    status: "expired",
  },
];

// Sample vehicles for an event
const sampleVehicles = [
  { plate: "ABC 123", make: "Toyota", model: "Camry", color: "Silver", owner: "Dr. James Wilson", designation: "Guest Speaker" },
  { plate: "XYZ 789", make: "Honda", model: "Accord", color: "Black", owner: "Prof. Emily Chen", designation: "Department Chair" },
  { plate: "DEF 456", make: "Ford", model: "Explorer", color: "White", owner: "Dr. Sarah Miller", designation: "Keynote Speaker" },
  { plate: "GHI 012", make: "Nissan", model: "Altima", color: "Blue", owner: "Mr. Robert Johnson", designation: "Industry Partner" },
  { plate: "JKL 345", make: "Chevrolet", model: "Malibu", color: "Red", owner: "Dr. Michael Brown", designation: "Guest" },
  { plate: "MNO 678", make: "Tesla", model: "Model 3", color: "Gray", owner: "Ms. Jennifer Davis", designation: "Guest" },
];

// Mock data for pending vehicles
const pendingVehicles = [
  { id: 1, plate: "ABC123", name: "John Doe", validFrom: "2023-07-10", validUntil: "2023-07-15", status: "pending" },
  { id: 2, plate: "XYZ789", name: "Jane Smith", validFrom: "2023-07-12", validUntil: "2023-07-14", status: "pending" },
  { id: 3, plate: "DEF456", name: "Robert Johnson", validFrom: "2023-07-11", validUntil: "2023-07-16", status: "pending" }
];

export const VisitorPreAuth: React.FC = () => {
  const [events, setEvents] = useState(preAuthData);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(1);
  const [vehicles, setVehicles] = useState(sampleVehicles);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    plate: "",
    make: "",
    model: "",
    color: "",
    owner: "",
    designation: "",
  });
  const [plateNumber, setPlateNumber] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [addedBy, setAddedBy] = useState("");

  // Handler for adding a new vehicle
  const handleAddVehicle = () => {
    setVehicles([newVehicle, ...vehicles]);
    setNewVehicle({
      plate: "",
      make: "",
      model: "",
      color: "",
      owner: "",
      designation: "",
    });
    setShowAddForm(false);
  };

  // Handler for removing a vehicle
  const handleRemoveVehicle = (plate: string) => {
    setVehicles(vehicles.filter(v => v.plate !== plate));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically submit the data to your backend
    console.log({
      plateNumber,
      name,
      reason,
      validFrom,
      validUntil,
      addedBy
    });
    
    // Reset form
    setPlateNumber("");
    setName("");
    setReason("");
    setValidFrom("");
    setValidUntil("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Visitor Pre-Authorization</h1>
        <p className="text-muted-foreground">Manage visitor vehicle access and pre-authorizations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {/* Pending Vehicles */}
        <Card className="bg-gray-900 text-white overflow-hidden flex flex-col">
          <CardHeader className="bg-gray-900 pb-3 pt-5">
            <CardTitle>Pending Vehicles</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-auto flex-1">
            {pendingVehicles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm">Plate Number</th>
                      <th className="px-4 py-3 text-left text-sm">Name</th>
                      <th className="px-4 py-3 text-left text-sm">Valid From</th>
                      <th className="px-4 py-3 text-left text-sm">Valid Until</th>
                      <th className="px-4 py-3 text-left text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingVehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="border-t border-gray-800">
                        <td className="px-4 py-3 text-sm">{vehicle.plate}</td>
                        <td className="px-4 py-3 text-sm">{vehicle.name}</td>
                        <td className="px-4 py-3 text-sm">{vehicle.validFrom}</td>
                        <td className="px-4 py-3 text-sm">{vehicle.validUntil}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Button size="sm" className="h-8 bg-blue-500 hover:bg-blue-600">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 bg-red-500  hover:bg-red-600">
                              Deny
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No pending vehicles
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Guest Vehicle Form */}
        <Card className="bg-gray-900 text-white">
          <CardHeader className="bg-gray-900 pb-3 pt-5">
            <CardTitle>Add Guest Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm">Plate Number</label>
                <Input
                  className="bg-gray-800 border-gray-700 text-white"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm">Name</label>
                <Input
                  className="bg-gray-800 border-gray-700 text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm">Reason (Optional)</label>
                <Textarea
                  className="bg-gray-800 border-gray-700 text-white min-h-24"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm">Valid From</label>
                  <Input
                    type="datetime-local"
                    className="bg-gray-800 border-gray-700 text-white"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm">Valid Until</label>
                  <Input
                    type="datetime-local"
                    className="bg-gray-800 border-gray-700 text-white"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm">Added By</label>
                <Input
                  className="bg-gray-800 border-gray-700 text-white"
                  value={addedBy}
                  onChange={(e) => setAddedBy(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Add Guest Vehicle
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisitorPreAuth; 