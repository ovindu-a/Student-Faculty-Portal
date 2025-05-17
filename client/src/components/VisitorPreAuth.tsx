import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Input } from "./ui/input";
import { Button } from "./ui/button";
// import { Label } from "./ui/label";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
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

export function VisitorPreAuth() {
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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Visitor Pre-Authorization</h1>
        <p className="text-muted-foreground">
          Manage pre-authorized vehicles for campus events
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Events</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" /> New Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      selectedEvent === event.id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => setSelectedEvent(event.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{event.eventName}</h3>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{event.timeWindow}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant="outline"
                          className={`${
                            event.status === "active"
                              ? "border-security-green text-security-green"
                              : event.status === "scheduled"
                              ? "border-security-yellow text-security-yellow"
                              : "border-security-red text-security-red"
                          }`}
                        >
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Badge>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CarFront className="h-3.5 w-3.5" />
                          <span className="text-xs">{event.totalVehicles} vehicles</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {events.find(e => e.id === selectedEvent)?.eventName || "Event Details"}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={`${
                    events.find(e => e.id === selectedEvent)?.status === "active"
                      ? "border-security-green text-security-green"
                      : events.find(e => e.id === selectedEvent)?.status === "scheduled"
                      ? "border-security-yellow text-security-yellow"
                      : "border-security-red text-security-red"
                  }`}
                >
                  {
                    events.find(e => e.id === selectedEvent)?.status.charAt(0).toUpperCase() +
                    (events.find(e => e.id === selectedEvent)?.status.slice(1) || "")
                  }
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium mb-1">Date</p>
                  <p className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    {events.find(e => e.id === selectedEvent)?.date}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Time Window</p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {events.find(e => e.id === selectedEvent)?.timeWindow}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CardTitle>Pre-authorized Vehicles</CardTitle>
                  <Badge variant="outline" className="ml-2">
                    {vehicles.length} vehicles
                  </Badge>
                </div>
                <Button size="sm" onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Vehicle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddForm && (
                <div className="mb-6 p-4 border border-border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Add New Vehicle</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => setShowAddForm(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="plate">License Plate</Label>
                      <Input 
                        id="plate" 
                        value={newVehicle.plate} 
                        onChange={(e) => setNewVehicle({...newVehicle, plate: e.target.value})}
                        placeholder="ABC 123" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Input 
                        id="make" 
                        value={newVehicle.make} 
                        onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
                        placeholder="Toyota" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input 
                        id="model" 
                        value={newVehicle.model} 
                        onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                        placeholder="Corolla" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input 
                        id="color" 
                        value={newVehicle.color} 
                        onChange={(e) => setNewVehicle({...newVehicle, color: e.target.value})}
                        placeholder="Silver" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner">Owner Name</Label>
                      <Input 
                        id="owner" 
                        value={newVehicle.owner} 
                        onChange={(e) => setNewVehicle({...newVehicle, owner: e.target.value})}
                        placeholder="Dr. John Smith" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Input 
                        id="designation" 
                        value={newVehicle.designation} 
                        onChange={(e) => setNewVehicle({...newVehicle, designation: e.target.value})}
                        placeholder="Guest Speaker" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleAddVehicle}>Add Vehicle</Button>
                  </div>
                </div>
              )}
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plate</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.map((vehicle) => (
                      <TableRow key={vehicle.plate}>
                        <TableCell className="font-medium">{vehicle.plate}</TableCell>
                        <TableCell>
                          {vehicle.make} {vehicle.model} ({vehicle.color})
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{vehicle.owner}</p>
                            <p className="text-xs text-muted-foreground">{vehicle.designation}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVehicle(vehicle.plate)}
                            className="h-8 w-8 p-0 text-security-red"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 