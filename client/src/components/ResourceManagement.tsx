"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { CalendarIcon, Filter, Plus, Edit, Trash2, Clock, MapPin, XCircle, Search } from "lucide-react"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "./ui/dialog"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"

// Simple Select Component
const Select = ({
  value,
  onValueChange,
  className = "",
  children,
}: {
  value: string
  onValueChange: (value: string) => void
  className?: string
  children: React.ReactNode
}) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none ${className}`}
  >
    {children}
  </select>
)

// Simple Option Component
const SelectItem = ({
  value,
  children,
}: {
  value: string
  children: React.ReactNode
}) => <option value={value}>{children}</option>

// Resource type interface
interface Resource {
  id: string
  name: string
  type: string
  capacity: number
  location: string
  accessibility: string[]
  status: "available" | "under_maintenance" | "restricted"
  lastMaintenance?: string
  nextMaintenance?: string
  maintenanceNotes?: string
  maintenancePersons?: string[]
}

// Booking interface
interface Booking {
  id: string
  resourceId: string
  resourceName: string
  userId: string
  userName: string
  date: string
  startTime: string
  endTime: string
  purpose: string
  status: "confirmed" | "cancelled"
  location: string
}

// Mock data for resources
const mockResources: Resource[] = [
  {
    id: "1",
    name: "Computer Lab A",
    type: "Lab",
    capacity: 30,
    location: "Main Building, Floor 2",
    accessibility: ["Wheelchair Accessible"],
    status: "available",
    lastMaintenance: "2023-12-15",
    nextMaintenance: "2024-06-15",
  },
  {
    id: "2",
    name: "Lecture Hall 101",
    type: "Auditorium",
    capacity: 120,
    location: "Science Block",
    accessibility: ["Wheelchair Accessible", "Hearing Loop"],
    status: "available",
  },
  {
    id: "3",
    name: "Conference Room B",
    type: "Room",
    capacity: 15,
    location: "Admin Building",
    accessibility: [],
    status: "under_maintenance",
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-01",
    maintenanceNotes: "Projector replacement in progress",
    maintenancePersons: ["John Doe"],
  },
  {
    id: "4",
    name: "University Van",
    type: "Vehicle",
    capacity: 8,
    location: "Parking Lot A",
    accessibility: ["Wheelchair Lift"],
    status: "available",
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-04-05",
  },
  {
    id: "5",
    name: "Study Room 3",
    type: "Room",
    capacity: 6,
    location: "Library, Floor 3",
    accessibility: [],
    status: "restricted",
    maintenanceNotes: "Reserved for graduate students only",
  },
]

// Mock data for bookings
const mockBookings: Booking[] = [
  {
    id: "1",
    resourceId: "1",
    resourceName: "Computer Lab A",
    userId: "S12345",
    userName: "John Smith",
    date: "2024-02-15",
    startTime: "09:00",
    endTime: "11:00",
    purpose: "Programming Workshop",
    status: "confirmed",
    location: "Main Building, Floor 2",
  },
  {
    id: "2",
    resourceId: "2",
    resourceName: "Lecture Hall 101",
    userId: "S12346",
    userName: "Jane Doe",
    date: "2024-02-16",
    startTime: "13:00",
    endTime: "15:00",
    purpose: "Guest Lecture",
    status: "confirmed",
    location: "Science Block",
  },
  {
    id: "3",
    resourceId: "4",
    resourceName: "University Van",
    userId: "S12347",
    userName: "Robert Johnson",
    date: "2024-02-17",
    startTime: "08:00",
    endTime: "17:00",
    purpose: "Field Trip",
    status: "cancelled",
    location: "Parking Lot A",
  },
]

// Time slots for the calendar view
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

// Calendar day component
const CalendarDay = ({
  date,
  resources,
  bookings,
  onBookResource,
}: {
  date: string
  resources: Resource[]
  bookings: Booking[]
  onBookResource: (resource: Resource, timeSlot: string) => void
}) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-800 text-white p-3 font-medium">
        {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border-r text-left">Resource</th>
              {timeSlots.map((slot) => (
                <th key={slot} className="p-2 border-r text-center min-w-[80px]">
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className="border-t">
                <td className="p-2 border-r">
                  <div className="font-medium">{resource.name}</div>
                  <div className="text-xs text-gray-500">{resource.location}</div>
                </td>
                {timeSlots.map((slot) => {
                  // Check if this slot is booked for this resource
                  const isBooked = bookings.some(
                    (booking) =>
                      booking.resourceId === resource.id &&
                      booking.date === date &&
                      booking.startTime <= slot &&
                      booking.endTime > slot &&
                      booking.status === "confirmed",
                  )

                  // Check if resource is under maintenance
                  const isUnderMaintenance = resource.status === "under_maintenance"

                  let cellClass = "p-2 border-r text-center cursor-pointer"
                  if (isBooked) {
                    cellClass += " bg-red-100"
                  } else if (isUnderMaintenance) {
                    cellClass += " bg-yellow-100"
                  } else {
                    cellClass += " bg-green-100 hover:bg-green-200"
                  }

                  return (
                    <td
                      key={`${resource.id}-${slot}`}
                      className={cellClass}
                      onClick={() => {
                        if (!isBooked && !isUnderMaintenance) {
                          onBookResource(resource, slot)
                        }
                      }}
                    >
                      {isBooked ? (
                        <span className="text-xs font-medium text-red-600">Booked</span>
                      ) : isUnderMaintenance ? (
                        <span className="text-xs font-medium text-yellow-600">Maintenance</span>
                      ) : (
                        <span className="text-xs font-medium text-green-600">Available</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Available Resources component
const AvailableResources = () => {
  const [resources] = useState<Resource[]>(mockResources)
  const [bookings] = useState<Booking[]>(mockBookings)
  const [selectedDate, setSelectedDate] = useState<string>("2024-02-15")
  const [resourceType, setResourceType] = useState<string>("all")
  const [capacity, setCapacity] = useState<string>("all")
  const [location, setLocation] = useState<string>("all")
  const [showBookingDialog, setShowBookingDialog] = useState<boolean>(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [bookingDuration, setBookingDuration] = useState<string>("1")
  const [bookingPurpose, setBookingPurpose] = useState<string>("")

  // Filter resources based on selected filters
  const filteredResources = resources.filter((resource) => {
    if (resourceType !== "all" && resource.type !== resourceType) return false
    if (capacity !== "all") {
      const [min, max] = capacity.split("-").map(Number)
      if (max && (resource.capacity < min || resource.capacity > max)) return false
      if (!max && resource.capacity < min) return false
    }
    if (location !== "all" && !resource.location.includes(location)) return false
    return true
  })

  // Get unique locations for the filter
  const locations = [...new Set(resources.map((r) => r.location.split(",")[0].trim()))]

  // Handle booking a resource
  const handleBookResource = (resource: Resource, timeSlot: string) => {
    setSelectedResource(resource)
    setSelectedTimeSlot(timeSlot)
    setShowBookingDialog(true)
  }

  // Handle confirming a booking
  const handleConfirmBooking = () => {
    // In a real app, this would make an API call to create the booking
    console.log("Booking confirmed:", {
      resource: selectedResource,
      date: selectedDate,
      startTime: selectedTimeSlot,
      endTime: calculateEndTime(selectedTimeSlot, Number.parseInt(bookingDuration)),
      purpose: bookingPurpose,
    })

    // Close the dialog and reset form
    setShowBookingDialog(false)
    setSelectedResource(null)
    setSelectedTimeSlot("")
    setBookingDuration("1")
    setBookingPurpose("")
  }

  // Calculate end time based on start time and duration
  const calculateEndTime = (startTime: string, durationHours: number) => {
    const [hours, minutes] = startTime.split(":").map(Number)
    const endHours = hours + durationHours
    return `${endHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card className="bg-gray-900 text-white">
        <CardHeader className="pb-3 pt-5">
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Resource Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-gray-300 mb-1 block">Resource Type</Label>
              <Select
                value={resourceType}
                onValueChange={setResourceType}
                className="bg-gray-800 border-gray-700 text-white"
              >
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Lab">Lab</SelectItem>
                <SelectItem value="Room">Room</SelectItem>
                <SelectItem value="Auditorium">Auditorium</SelectItem>
                <SelectItem value="Vehicle">Vehicle</SelectItem>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300 mb-1 block">Capacity</Label>
              <Select value={capacity} onValueChange={setCapacity} className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">Any Capacity</SelectItem>
                <SelectItem value="1-10">1-10 People</SelectItem>
                <SelectItem value="11-30">11-30 People</SelectItem>
                <SelectItem value="31-100">31-100 People</SelectItem>
                <SelectItem value="101">100+ People</SelectItem>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300 mb-1 block">Location</Label>
              <Select value={location} onValueChange={setLocation} className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <Label className="text-gray-300 mb-1 block">Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Resource Availability Calendar</h3>
        <CalendarDay
          date={selectedDate}
          resources={filteredResources}
          bookings={bookings}
          onBookResource={handleBookResource}
        />
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedResource && (
              <>
                <div className="space-y-2">
                  <Label>Selected Resource</Label>
                  <div className="p-3 bg-gray-100 rounded-md">
                    <div className="font-medium">{selectedResource.name}</div>
                    <div className="text-sm text-gray-500">{selectedResource.location}</div>
                    <div className="text-sm mt-1">
                      <span className="font-medium">Capacity:</span> {selectedResource.capacity} people
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" value={selectedDate} type="date" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Start Time</Label>
                    <Input id="time" value={selectedTimeSlot} disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Select value={bookingDuration} onValueChange={setBookingDuration}>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose (optional)</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Enter the purpose of your booking"
                    value={bookingPurpose}
                    onChange={(e) => setBookingPurpose(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleConfirmBooking}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Booked Resources component
const BookedResources = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)

  // Handle modifying a booking
  const handleModifyBooking = (booking: Booking) => {
    // In a real app, this would open a dialog to modify the booking
    console.log("Modify booking:", booking)
  }

  // Handle cancelling a booking
  const handleCancelBooking = (bookingId: string) => {
    // In a real app, this would make an API call to cancel the booking
    setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" } : booking)))
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Your Booked Resources</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className={`overflow-hidden ${booking.status === "cancelled" ? "bg-gray-100" : ""}`}>
            <CardHeader className={`pb-2 ${booking.status === "cancelled" ? "bg-gray-200" : "bg-gray-900 text-white"}`}>
              <CardTitle className="flex justify-between items-center text-base">
                <span>{booking.resourceName}</span>
                <Badge variant={booking.status === "confirmed" ? "default" : "destructive"}>
                  {booking.status === "confirmed" ? "Confirmed" : "Cancelled"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <CalendarIcon className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  <span>
                    {new Date(booking.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-start">
                  <Clock className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  <span>
                    {booking.startTime} - {booking.endTime}
                  </span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  <span>{booking.location}</span>
                </div>
                {booking.purpose && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">{booking.purpose}</p>
                  </div>
                )}

                {booking.status === "confirmed" && (
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleModifyBooking(booking)}>
                      <Edit className="h-4 w-4 mr-1" /> Modify
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                      <XCircle className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {bookings.length === 0 && (
          <div className="col-span-2 p-8 text-center text-gray-500 border rounded-md">
            You don't have any booked resources yet.
          </div>
        )}
      </div>
    </div>
  )
}

// Resource Management component
const ResourceManagement = () => {
  const [resources, setResources] = useState<Resource[]>(mockResources)
  const [showAddResourceDialog, setShowAddResourceDialog] = useState<boolean>(false)
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState<boolean>(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")

  // New resource form state
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    name: "",
    type: "Room",
    capacity: 0,
    location: "",
    accessibility: [],
    status: "available",
  })

  // Maintenance form state
  const [maintenanceForm, setMaintenanceForm] = useState({
    status: "available",
    notes: "",
    persons: "",
    fromDate: "",
    toDate: "",
  })

  // Handle adding a new resource
  const handleAddResource = () => {
    // In a real app, this would make an API call to create the resource
    const newResourceWithId = {
      ...newResource,
      id: `${resources.length + 1}`,
      accessibility: newResource.accessibility || [],
    } as Resource

    setResources([...resources, newResourceWithId])
    setShowAddResourceDialog(false)
    setNewResource({
      name: "",
      type: "Room",
      capacity: 0,
      location: "",
      accessibility: [],
      status: "available",
    })
  }

  // Handle updating resource maintenance
  const handleUpdateMaintenance = () => {
    if (!selectedResource) return

    // In a real app, this would make an API call to update the resource
    const updatedResources = resources.map((resource) =>
      resource.id === selectedResource.id
        ? {
            ...resource,
            status: maintenanceForm.status as "available" | "under_maintenance" | "restricted",
            maintenanceNotes: maintenanceForm.notes,
            maintenancePersons: maintenanceForm.persons
              ? maintenanceForm.persons.split(",").map((p) => p.trim())
              : undefined,
            lastMaintenance:
              maintenanceForm.status === "available"
                ? new Date().toISOString().split("T")[0]
                : resource.lastMaintenance,
            nextMaintenance: maintenanceForm.toDate,
          }
        : resource,
    )

    setResources(updatedResources)
    setShowMaintenanceDialog(false)
  }

  // Handle opening the maintenance dialog
  const handleOpenMaintenanceDialog = (resource: Resource) => {
    setSelectedResource(resource)
    setMaintenanceForm({
      status: resource.status,
      notes: resource.maintenanceNotes || "",
      persons: resource.maintenancePersons?.join(", ") || "",
      fromDate: new Date().toISOString().split("T")[0],
      toDate: resource.nextMaintenance || "",
    })
    setShowMaintenanceDialog(true)
  }

  // Filter resources based on search query
  const filteredResources = resources.filter(
    (resource) =>
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get status badge for a resource
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Available</Badge>
      case "under_maintenance":
        return <Badge className="bg-yellow-500">Under Maintenance</Badge>
      case "restricted":
        return <Badge className="bg-red-500">Restricted</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Resource Management</h1>
        <p className="text-muted-foreground">Manage and book resources across the campus</p>
      </div>

      <Tabs defaultValue="available" className="flex-1">
        <TabsList className="bg-gray-800 border-b border-gray-700">
          <TabsTrigger value="available" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
            Available Resources
          </TabsTrigger>
          <TabsTrigger value="booked" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
            Booked Resources
          </TabsTrigger>
          <TabsTrigger value="management" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
            Resource Management
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
            Maintenance Dashboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6 flex-1">
          <AvailableResources />
        </TabsContent>

        <TabsContent value="booked" className="mt-6 flex-1">
          <BookedResources />
        </TabsContent>

        <TabsContent value="management" className="mt-6 flex-1">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Manage Resources</h3>
              <Button onClick={() => setShowAddResourceDialog(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add New Resource
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Capacity</th>
                    <th className="p-3 text-left">Location</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map((resource) => (
                    <tr key={resource.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{resource.name}</td>
                      <td className="p-3">{resource.type}</td>
                      <td className="p-3">{resource.capacity}</td>
                      <td className="p-3">{resource.location}</td>
                      <td className="p-3">{getStatusBadge(resource.status)}</td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredResources.length === 0 && (
                <div className="p-8 text-center text-gray-500">No resources found matching your search.</div>
              )}
            </div>
          </div>

          {/* Add Resource Dialog */}
          <Dialog open={showAddResourceDialog} onOpenChange={setShowAddResourceDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Resource Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Computer Lab A"
                      value={newResource.name}
                      onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Resource Type *</Label>
                    <Select
                      value={newResource.type}
                      onValueChange={(value) => setNewResource({ ...newResource, type: value })}
                    >
                      <SelectItem value="Lab">Lab</SelectItem>
                      <SelectItem value="Room">Room</SelectItem>
                      <SelectItem value="Auditorium">Auditorium</SelectItem>
                      <SelectItem value="Vehicle">Vehicle</SelectItem>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="e.g. 30"
                      value={newResource.capacity || ""}
                      onChange={(e) => setNewResource({ ...newResource, capacity: Number.parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g. Main Building, Floor 2"
                      value={newResource.location}
                      onChange={(e) => setNewResource({ ...newResource, location: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accessibility Options</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="wheelchair"
                        checked={newResource.accessibility?.includes("Wheelchair Accessible")}
                        onCheckedChange={(checked) => {
                          const accessibility = [...(newResource.accessibility || [])]
                          if (checked) {
                            accessibility.push("Wheelchair Accessible")
                          } else {
                            const index = accessibility.indexOf("Wheelchair Accessible")
                            if (index !== -1) accessibility.splice(index, 1)
                          }
                          setNewResource({ ...newResource, accessibility })
                        }}
                      />
                      <Label htmlFor="wheelchair" className="font-normal">
                        Wheelchair Accessible
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hearing"
                        checked={newResource.accessibility?.includes("Hearing Loop")}
                        onCheckedChange={(checked) => {
                          const accessibility = [...(newResource.accessibility || [])]
                          if (checked) {
                            accessibility.push("Hearing Loop")
                          } else {
                            const index = accessibility.indexOf("Hearing Loop")
                            if (index !== -1) accessibility.splice(index, 1)
                          }
                          setNewResource({ ...newResource, accessibility })
                        }}
                      />
                      <Label htmlFor="hearing" className="font-normal">
                        Hearing Loop
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddResource}>Add Resource</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6 flex-1">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Maintenance Dashboard</h3>

            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">Resource Name</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Last Maintenance</th>
                    <th className="p-3 text-left">Next Scheduled</th>
                    <th className="p-3 text-left">Notes</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((resource) => (
                    <tr key={resource.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium">{resource.name}</div>
                        <div className="text-xs text-gray-500">{resource.type}</div>
                      </td>
                      <td className="p-3">{getStatusBadge(resource.status)}</td>
                      <td className="p-3">{resource.lastMaintenance || "N/A"}</td>
                      <td className="p-3">{resource.nextMaintenance || "N/A"}</td>
                      <td className="p-3">
                        {resource.maintenanceNotes ? (
                          <div className="max-w-[200px] truncate" title={resource.maintenanceNotes}>
                            {resource.maintenanceNotes}
                          </div>
                        ) : (
                          <span className="text-gray-400">No notes</span>
                        )}
                      </td>
                      <td className="p-3">
                        <Button variant="outline" size="sm" onClick={() => handleOpenMaintenanceDialog(resource)}>
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Maintenance Dialog */}
          <Dialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedResource ? `Maintenance: ${selectedResource.name}` : "Maintenance"}</DialogTitle>
              </DialogHeader>
              {selectedResource && (
                <div className="space-y-4 py-4">
                  <div className="p-3 bg-gray-100 rounded-md">
                    <div className="font-medium">{selectedResource.name}</div>
                    <div className="text-sm text-gray-500">{selectedResource.location}</div>
                    <div className="text-sm mt-1">
                      <span className="font-medium">Type:</span> {selectedResource.type}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Maintenance Status</Label>
                    <Select
                      value={maintenanceForm.status}
                      onValueChange={(value) => setMaintenanceForm({ ...maintenanceForm, status: value })}
                    >
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                      <SelectItem value="restricted">Restricted Use</SelectItem>
                    </Select>
                  </div>

                  {maintenanceForm.status !== "available" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fromDate">From Date</Label>
                          <Input
                            id="fromDate"
                            type="date"
                            value={maintenanceForm.fromDate}
                            onChange={(e) => setMaintenanceForm({ ...maintenanceForm, fromDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="toDate">To Date</Label>
                          <Input
                            id="toDate"
                            type="date"
                            value={maintenanceForm.toDate}
                            onChange={(e) => setMaintenanceForm({ ...maintenanceForm, toDate: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="persons">Maintenance Persons</Label>
                        <Input
                          id="persons"
                          placeholder="e.g. John Doe, Jane Smith"
                          value={maintenanceForm.persons}
                          onChange={(e) => setMaintenanceForm({ ...maintenanceForm, persons: e.target.value })}
                        />
                        <p className="text-xs text-gray-500">Separate multiple names with commas</p>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes">Maintenance Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Enter maintenance details or restrictions"
                      value={maintenanceForm.notes}
                      onChange={(e) => setMaintenanceForm({ ...maintenanceForm, notes: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleUpdateMaintenance}>Update Maintenance</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ResourceManagement
