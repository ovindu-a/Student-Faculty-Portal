import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Car, Check, X } from "lucide-react";

const vehiclesData = [
  {
    id: 1,
    plate: "ABC 123",
    make: "Toyota",
    model: "Corolla",
    color: "Blue",
    status: "pending",
    location: "Main Gate",
    time: "Just now",
    owner: "Unknown",
  },
  {
    id: 2,
    plate: "DEF 456",
    make: "Honda",
    model: "Civic",
    color: "Silver",
    status: "authorized",
    location: "East Entrance",
    time: "2 mins ago",
    owner: "John Smith (Faculty)",
  },
  {
    id: 3,
    plate: "GHI 789",
    make: "Ford",
    model: "Focus",
    color: "Red",
    status: "unauthorized",
    location: "West Entrance",
    time: "5 mins ago",
    owner: "Unknown",
  },
  {
    id: 4,
    plate: "JKL 012",
    make: "Nissan",
    model: "Altima",
    color: "Black",
    status: "authorized",
    location: "North Gate",
    time: "12 mins ago",
    owner: "Sarah Johnson (Student)",
  },
  {
    id: 5,
    plate: "MNO 345",
    make: "Chevrolet",
    model: "Malibu",
    color: "White",
    status: "pending",
    location: "South Gate",
    time: "15 mins ago",
    owner: "Unknown",
  },
];

export function VehicleAccess() {
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(1);
  const [vehicles, setVehicles] = useState(vehiclesData);

  const handleApprove = (id: number) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === id
          ? { ...vehicle, status: "authorized" }
          : vehicle
      )
    );
  };

  const handleDecline = (id: number) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === id
          ? { ...vehicle, status: "unauthorized" }
          : vehicle
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vehicle Access Control</h1>
        <p className="text-muted-foreground">
          {vehicles.filter(v => v.status === "pending").length} vehicles waiting for approval
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`vehicle-item cursor-pointer ${selectedVehicle === vehicle.id ? 'border-primary' : ''}`}
              onClick={() => setSelectedVehicle(vehicle.id)}
            >
              <div className={`p-2 rounded-md ${getStatusBackground(vehicle.status)}`}>
                <Car className="h-5 w-5 text-background" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{vehicle.plate}</h3>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.make} {vehicle.model} ({vehicle.color})
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusClass(vehicle.status)}
                  >
                    {formatStatus(vehicle.status)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">{vehicle.location} • {vehicle.time}</span>
                  {vehicle.status === "pending" && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 border-security-green text-security-green hover:bg-security-green/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(vehicle.id);
                        }}
                      >
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 border-security-red text-security-red hover:bg-security-red/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecline(vehicle.id);
                        }}
                      >
                        <X className="h-4 w-4 mr-1" /> Decline
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedVehicle ? (
                <>
                  <div className="aspect-video bg-card rounded-md flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Car className="h-8 w-8" />
                      <span>Vehicle Image</span>
                    </div>
                  </div>
                  
                  {vehicles.find(v => v.id === selectedVehicle)?.status === "pending" && (
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        className="bg-security-green hover:bg-security-green/90"
                        onClick={() => handleApprove(selectedVehicle)}
                      >
                        <Check className="h-4 w-4 mr-2" /> Approve Access
                      </Button>
                      <Button
                        variant="outline"
                        className="border-security-red text-security-red hover:bg-security-red/10"
                        onClick={() => handleDecline(selectedVehicle)}
                      >
                        <X className="h-4 w-4 mr-2" /> Decline Access
                      </Button>
                    </div>
                  )}
                  
                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">License Plate</p>
                        <p className="text-lg">
                          {vehicles.find(v => v.id === selectedVehicle)?.plate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Make</p>
                        <p className="text-lg">
                          {vehicles.find(v => v.id === selectedVehicle)?.make}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Color</p>
                        <p className="text-lg">
                          {vehicles.find(v => v.id === selectedVehicle)?.color}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge 
                          variant="outline" 
                          className={getStatusClass(vehicles.find(v => v.id === selectedVehicle)?.status || "")}
                        >
                          {formatStatus(vehicles.find(v => v.id === selectedVehicle)?.status || "")}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Owner</span>
                        <span>{vehicles.find(v => v.id === selectedVehicle)?.owner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span>{vehicles.find(v => v.id === selectedVehicle)?.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span>{vehicles.find(v => v.id === selectedVehicle)?.time}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Car className="h-16 w-16 opacity-20" />
                  <p>Select a vehicle to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getStatusBackground(status: string) {
  switch (status) {
    case "authorized":
      return "bg-security-green";
    case "unauthorized":
      return "bg-security-red";
    default:
      return "bg-security-yellow";
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "authorized":
      return "border-security-green text-security-green";
    case "unauthorized":
      return "border-security-red text-security-red";
    default:
      return "border-security-yellow text-security-yellow";
  }
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
} 