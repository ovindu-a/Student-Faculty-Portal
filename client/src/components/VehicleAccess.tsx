import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Car, Check, X, Clock, MapPin } from "lucide-react";

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
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Vehicle Access Control</h1>
        <p className="text-muted-foreground font-semibold text-gray-600">
          {vehicles.filter(v => v.status === "pending").length} vehicles waiting for approval
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="bg-gray-900 text-white overflow-hidden flex flex-col">
          <CardHeader className="bg-gray-900 pb-3 pt-5">
            <CardTitle>Recent Vehicles</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-auto flex-1">
            <div className="overflow-x-auto">
              <div className="space-y-1">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`flex items-start p-4 border-l-4 cursor-pointer ${
                      selectedVehicle === vehicle.id 
                        ? 'border-blue-500 bg-gray-800' 
                        : 'border-transparent hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                  >
                    <div className={`p-2 rounded-md mr-3 ${getStatusBackground(vehicle.status)}`}>
                      <Car className="h-5 w-5 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-white">{vehicle.plate}</h3>
                          <p className="text-sm text-gray-200">
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
                        <span className="text-xs text-gray-300 flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {vehicle.location} 
                          <Clock className="h-3.5 w-3.5 mx-1" />
                          {vehicle.time}
                        </span>
                        {vehicle.status === "pending" && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="h-8 bg-green-600 hover:bg-green-700 text-white"
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
                              className="h-8 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
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
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 text-white overflow-hidden flex flex-col">
          <CardHeader className="bg-gray-900 pb-3 pt-5">
            <CardTitle>Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {selectedVehicle ? (
              <div className="space-y-6">
                <div className="aspect-video bg-gray-800 rounded-md flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Car className="h-12 w-12" />
                    <span>Vehicle Image Placeholder</span>
                  </div>
                </div>
                
                {vehicles.find(v => v.id === selectedVehicle)?.status === "pending" && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApprove(selectedVehicle)}
                    >
                      <Check className="h-4 w-4 mr-2" /> Approve Access
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => handleDecline(selectedVehicle)}
                    >
                      <X className="h-4 w-4 mr-2" /> Decline Access
                    </Button>
                  </div>
                )}
                
                <div className="border-t border-gray-800 pt-4">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-md p-4">
                      <p className="text-sm text-gray-400 mb-1">License Plate</p>
                      <p className="text-xl font-semibold text-white">
                        {vehicles.find(v => v.id === selectedVehicle)?.plate}
                      </p>
                    </div>
                    <div className="bg-gray-800 rounded-md p-4">
                      <p className="text-sm text-gray-400 mb-1">Status</p>
                      <Badge 
                        variant="outline" 
                        className={`text-sm px-2 py-1 ${getStatusClass(vehicles.find(v => v.id === selectedVehicle)?.status || "")}`}
                      >
                        {formatStatus(vehicles.find(v => v.id === selectedVehicle)?.status || "")}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Make</p>
                        <p className="font-medium">
                          {vehicles.find(v => v.id === selectedVehicle)?.make}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Model</p>
                        <p className="font-medium">
                          {vehicles.find(v => v.id === selectedVehicle)?.model}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Color</p>
                        <p className="font-medium">
                          {vehicles.find(v => v.id === selectedVehicle)?.color}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-4">
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-400">Location</span>
                        </div>
                        <span>{vehicles.find(v => v.id === selectedVehicle)?.location}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-400">Time</span>
                        </div>
                        <span>{vehicles.find(v => v.id === selectedVehicle)?.time}</span>
                      </div>
                      <div className="p-3 bg-gray-800 rounded-md">
                        <p className="text-sm text-gray-400 mb-1">Owner Information</p>
                        <p className="font-medium">
                          {vehicles.find(v => v.id === selectedVehicle)?.owner}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6">
                <Car className="h-16 w-16 text-gray-700 mb-4" />
                <p className="text-gray-400">Select a vehicle to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getStatusBackground(status: string) {
  switch (status) {
    case "authorized":
      return "bg-green-600";
    case "unauthorized":
      return "bg-red-500";
    default:
      return "bg-yellow-500";
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "authorized":
      return "border-green-500 text-green-500";
    case "unauthorized":
      return "border-red-500 text-red-500";
    default:
      return "border-yellow-500 text-yellow-500";
  }
}

function formatStatus(status: string) {  
  return status.charAt(0).toUpperCase() + status.slice(1);
} 