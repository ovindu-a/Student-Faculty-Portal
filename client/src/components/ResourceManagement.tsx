"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { CalendarIcon, Filter, Plus, Edit, Trash2, Clock, Search } from "lucide-react"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "./ui/dialog"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import axios from "axios"

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
    className={`flex h-10 w-full rounded-md border border-gray-700 px-3 py-2 text-sm focus:outline-none ${className}`}
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
}

// Booking interface
type Booking = {
  id: number
  bookedBy: string
  resourceName: string
  date: string
  startTime: string
  endTime: string
}

// Mock data for resources
const mockResources: Resource[] = [
  {
    id: "1",
    name: "Computer Lab A",
    type: "Lab",
    capacity: 30,
  },
  {
    id: "2",
    name: "Lecture Hall 101",
    type: "Auditorium",
    capacity: 120,
  },
  {
    id: "3",
    name: "Conference Room B",
    type: "Room",
    capacity: 15,
  },
  {
    id: "4",
    name: "University Van",
    type: "Vehicle",
    capacity: 8,
  },
  {
    id: "5",
    name: "Study Room 3",
    type: "Room",
    capacity: 6,
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
const generateTimeSlots = (start: string, end: string, interval = 30) => {
  const slots = []
  let [hour, minute] = start.split(":" as const).map(Number)
  const [endHour, endMinute] = end.split(":" as const).map(Number)

  while (hour < endHour || (hour === endHour && minute <= endMinute)) {
    slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`)
    minute += interval
    if (minute >= 60) {
      minute = 0
      hour++
    }
  }
  return slots
}

const timeSlots = generateTimeSlots("07:00", "17:00")

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
    <div className="border border-gray-700 rounded-md overflow-hidden">
      <div className="bg-gray-800 text-white p-3 font-medium">
        {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800 text-gray-200">
              <th className="p-2 border-r border-gray-700 text-left">Resource</th>
              {timeSlots.map((slot) => (
                <th key={slot} className="p-2 border-r border-gray-700 text-center min-w-[60px] text-xs">
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className="border-t border-gray-700">
                <td className="p-2 border-r border-gray-700">
                  <div className="font-medium text-white">{resource.name}</div>
                  <div className="text-xs text-gray-400">{resource.location}</div>
                </td>
                {timeSlots.map((slot) => {
                  const booking = bookings.find(
                    (b) =>
                      b.resource?.id === resource.id &&
                      b.date === date &&
                      b.startTime <= slot &&
                      b.endTime > slot &&
                      b.status === "confirmed",
                  )

                  const isBooked = !!booking
                  const isUnderMaintenance = resource.status === "under_maintenance"

                  const cellClass = `p-2 border-r border-gray-700 text-center text-xs ${
                    isBooked
                      ? "bg-red-900 text-red-300 font-medium"
                      : isUnderMaintenance
                        ? "bg-yellow-900 text-yellow-300 font-medium"
                        : "bg-green-900 hover:bg-green-800 text-green-300 font-medium cursor-pointer"
                  }`

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
                      {isBooked ? "Booked" : isUnderMaintenance ? "Maintenance" : "Available"}
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
// const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

// // Calendar day component
// const CalendarDay = ({
//   date,
//   resources,
//   bookings,
//   onBookResource,
// }: {
//   date: string
//   resources: Resource[]
//   bookings: Booking[]
//   onBookResource: (resource: Resource, timeSlot: string) => void
// }) => {
//   return (
//     <div className="border rounded-md overflow-hidden">
//       <div className="bg-gray-800 text-white p-3 font-medium">
//         {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
//       </div>
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-2 border-r text-left">Resource</th>
//               {timeSlots.map((slot) => (
//                 <th key={slot} className="p-2 border-r text-center min-w-[80px]">
//                   {slot}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {resources.map((resource) => (
//               <tr key={resource.id} className="border-t">
//                 <td className="p-2 border-r">
//                   <div className="font-medium">{resource.name}</div>
//                   <div className="text-xs text-gray-500">{resource.location}</div>
//                 </td>
//                 {timeSlots.map((slot) => {
//                   // Check if this slot is booked for this resource
//                   const isBooked = bookings.some(
//                     (booking) =>
//                       booking.resourceId === resource.id &&
//                       booking.date === date &&
//                       booking.startTime <= slot &&
//                       booking.endTime > slot &&
//                       booking.status === "confirmed",
//                   )

//                   // Check if resource is under maintenance
//                   const isUnderMaintenance = resource.status === "under_maintenance"

//                   let cellClass = "p-2 border-r text-center cursor-pointer"
//                   if (isBooked) {
//                     cellClass += " bg-red-100"
//                   } else if (isUnderMaintenance) {
//                     cellClass += " bg-yellow-100"
//                   } else {
//                     cellClass += " bg-green-100 hover:bg-green-200"
//                   }

//                   return (
//                     <td
//                       key={`${resource.id}-${slot}`}
//                       className={cellClass}
//                       onClick={() => {
//                         if (!isBooked && !isUnderMaintenance) {
//                           onBookResource(resource, slot)
//                         }
//                       }}
//                     >
//                       {isBooked ? (
//                         <span className="text-xs font-medium text-red-600">Booked</span>
//                       ) : isUnderMaintenance ? (
//                         <span className="text-xs font-medium text-yellow-600">Maintenance</span>
//                       ) : (
//                         <span className="text-xs font-medium text-green-600">Available</span>
//                       )}
//                     </td>
//                   )
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// Available Resources component
const AvailableResources = () => {

  const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
  };
  const [resources, setResources] = useState<Resource[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [resourceType, setResourceType] = useState<string>("all")
  const [capacity, setCapacity] = useState<string>("all")
  const [location, setLocation] = useState<string>("all")
  const [showBookingDialog, setShowBookingDialog] = useState<boolean>(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [bookingDuration, setBookingDuration] = useState<string>("1")
  const [bookingPurpose, setBookingPurpose] = useState<string>("")

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8010/get-resources")
        const data = response.data

        // Optional: transform keys if needed
        const formattedResources: Resource[] = data.map((r: any) => ({
          id: r.id,
          name: r.resource_name,
          type: r.resource_type,
          capacity: r.capacity,
          createdAt: r.created_at,
        }))

        setResources(formattedResources)
      } catch (error) {
        console.error("Error fetching resources:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8010/get-bookings")
        const rawData = response.data

        const formattedBookings: Booking[] = rawData.map((b: any) => {
          const resource = resources.find((res) => res.name === b.resource_name)

          return {
            id: b.id,
            date: b.booking_on,
            startTime: b.booking_starttime.slice(0, 5),
            endTime: b.booking_endtime.slice(0, 5),
            status: "confirmed",
            resource, // attach full resource object if needed
          }
        })

        setBookings(formattedBookings)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch bookings:", err)
        setError("Failed to load bookings")
        setLoading(false)
      }
    }

    fetchData()
  }, [resources]) // make sure this runs after `resources` is loaded

  // Get unique locations for the filter
  // const locations = [...new Set(resources.map((r) => r.location.split(",")[0].trim()))]

  // Handle booking a resource
  const handleBookResource = (resource: Resource, timeSlot: string) => {
    setSelectedResource(resource)
    setSelectedTimeSlot(timeSlot)
    setShowBookingDialog(true)
  }
  const [user, setUser] = useState<User | null>(null)
  const fetchUser = async (): Promise<User | null> => {
    try {
      const response = await fetch("http://localhost:8100/user", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Authentication failed")
      }

      const userData: User = await response.json()
      setUser(userData)
      return userData
    } catch (err) {
      console.log("Error in getting user:", err)
      return null
    }
  }

  // Handle confirming a booking
  const handleConfirmBooking = async () => {
    const user = await fetchUser()
    if (!user || !user.id) {
      console.error("User not authenticated")
      return
    }

    // Format date as YYYY-MM-DD
    const formattedDate = new Date(selectedDate).toISOString().split("T")[0]

    // Format time as HH:MM:SS
    const formatTime = (time: string): string => {
      const [hour, minute] = time.split(":")
      return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`
    }



    const bookingData = {
      booked_by: user.id,
      resource_name: selectedResource.name,
      start: formatTime(selectedTimeSlot),
      end: formatTime(calculateEndTime(selectedTimeSlot, Number.parseInt(bookingDuration))),
      booked_date: formattedDate,
    }
    console.log(bookingData)
    try {
      const response = await fetch("http://127.0.0.1:8010/create-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }

      const data = await response.json()
      console.log("Booking confirmed:", data)

      // Reset form state
      setShowBookingDialog(false)
      setSelectedResource(null)
      setSelectedTimeSlot("")
      setBookingDuration("1")
      setBookingPurpose("")
    } catch (error) {
      console.error("Error booking resource:", error)
    }
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
              <Label className="text-gray-200 mb-1 block">Resource Type</Label>
              <Select
                value={resourceType}
                onValueChange={setResourceType}
                className="bg-gray-800 border-gray-700 text-white"
              >
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Lab">Lab</SelectItem>
                <SelectItem value="Room">Lecture Room</SelectItem>
                <SelectItem value="Auditorium">Auditorium</SelectItem>
              </Select>
            </div>
            <div>
              <Label className="text-gray-200 mb-1 block">Capacity</Label>
              <Select value={capacity} onValueChange={setCapacity} className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">Any Capacity</SelectItem>
                <SelectItem value="1-10">1-10 People</SelectItem>
                <SelectItem value="11-30">11-30 People</SelectItem>
                <SelectItem value="31-100">31-100 People</SelectItem>
                <SelectItem value="101">100+ People</SelectItem>
              </Select>
            </div>
            <div>
              <Label className="text-gray-200 mb-1 block">Location</Label>
              <Select value={location} onValueChange={setLocation} className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">All Locations</SelectItem>
                {/* {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))} */}
              </Select>
            </div>
            <div>
              <Label className="text-gray-200 mb-1 block">Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getTodayDateString()}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <div className="space-y-4">
        <h3 className="text-lg text-gray-100 font-medium">Resource Availability Calendar</h3>
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
                  <div className="p-3 bg-gray-800 border border-gray-700 rounded-md">
                    <div className="font-medium text-white">{selectedResource.name}</div>
                    <div className="text-sm text-gray-300">{selectedResource.location}</div>
                    <div className="text-sm mt-1 text-gray-300">
                      <span className="font-medium text-white">Capacity:</span> {selectedResource.capacity} people
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

type User = {
  id: string
  email: string
  name: string
  role: string
}

const BookedResources = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const fetchUser = async (): Promise<User | null> => {
    try {
      const response = await fetch("http://localhost:8100/user", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Authentication failed")
      }

      const userData: User = await response.json()
      setUser(userData)
      return userData
    } catch (err) {
      console.log("Error in getting user:", err)
      return null
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser()

        if (!user) {
          setError("User not authenticated")
          setLoading(false)
          return
        }

        console.log("Sending user ID:", user.id)

        const response = await axios.get("http://127.0.0.1:8010/get-bookings-user", {
          params: { userid: user.id },
        })

        const formattedBookings: Booking[] = response.data.map((b: any) => ({
          id: b.id,
          resourceName: b.resource_name,
          date: b.booking_on,
          startTime: b.booking_starttime.slice(0, 5), // "HH:mm"
          endTime: b.booking_endtime.slice(0, 5),
        }))

        setBookings(formattedBookings)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch bookings:", err)
        setError("Failed to load bookings")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editBookingForm, setEditBookingForm] = useState({
    id: "",
    date: "",
    startTime: "",
    endTime: "",
  })
  const handleEditBooking = (booking) => {
  setEditBookingForm({
    id: booking.id,
    date: booking.date,
    startTime: formatTimeToHHMM(booking.startTime),
    endTime: formatTimeToHHMM(booking.endTime),
  });
  setShowEditDialog(true);
};

const handleDeleteBooking = async (bookingId: number) => {
  try {
    const response = await fetch("http://127.0.0.1:8010/delete-booking", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: bookingId }),
    });

    const data = await response.json();

    if (response.ok && data.status === "success") {
      // Remove the deleted booking from state
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    } else {
      throw new Error(data.message || "Failed to delete booking");
    }
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Error deleting booking: " + error.message);
  }
};
const formatTimeToHHMM = (timeString) => {
  // timeString like "09:00:00"
  if (!timeString) return "";
  return timeString.slice(0, 5); // just take first 5 chars "HH:mm"
}
const normalizeBooking = (booking) => ({
  id: booking.id,
  createdAt: booking.created_at,       // if you need it
  bookedBy: booking.booked_by,         // if you need it
  resourceName: booking.resource_name, // camelCase for frontend
  date: booking.booking_on,             // map booking_on → date
  startTime: formatTimeToHHMM(booking.start_time),
  endTime: formatTimeToHHMM(booking.end_time),   // adapt if backend sends end_time
  // add other fields as needed
});
const handleSaveEditedBooking = async () => {
  const body = {
  ...editBookingForm,
  date: formatDateToYYYYMMDD(editBookingForm.date),
}
  try {
    const response = await fetch("http://127.0.0.1:8010/booking-update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body), // make sure editBookingForm includes id, date, startTime, endTime etc
    });

    if (!response.ok) {
      throw new Error("Failed to update booking");
    }

    const updated = await response.json();
    const normalizedUpdated = normalizeBooking(updated);

    setBookings(prev =>
      prev.map(b => (b.id === normalizedUpdated.id ? normalizedUpdated : b))
    );

    setShowEditDialog(false);
  } catch (error) {
    console.error("Update failed:", error);
    alert("Error updating booking");
  }
};
const formatDateToYYYYMMDD = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
  <div className="space-y-6">
    <h3 className="text-lg font-medium">Your Booked Resources</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden">
            <CardHeader className="bg-gray-800 text-white border-b border-gray-700 pb-2">
              <CardTitle className="text-base">{booking.resourceName}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start">
                <CalendarIcon className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                <span>
                  {booking.date ? (
                    new Date(booking.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  ) : (
                    <span className="text-gray-500 italic">No Date</span>
                  )}

                </span>
              </div>
              <div className="flex items-start">
                <Clock className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                <span>
                  {booking.startTime && booking.endTime ? (
                    `${booking.startTime} - ${booking.endTime}`
                  ) : (
                    <span className="text-gray-500 italic">No Time Slot</span>
                  )}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  size="sm"
                  onClick={() => handleEditBooking(booking)}
                  variant="secondary"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteBooking(booking.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-2 p-8 text-center text-gray-400 border border-gray-700 rounded-md">
          You don't have any booked resources yet.
        </div>
      )}
    </div>

    {/* Edit Dialog */}
    {showEditDialog && (
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="date"
              placeholder="Date"
              value={editBookingForm.date}
              onChange={(e) =>
                setEditBookingForm({ ...editBookingForm, date: e.target.value })
              }
            />
            <Input
              type="time"
              placeholder="Start Time"
              value={editBookingForm.startTime}
              onChange={(e) =>
                setEditBookingForm({ ...editBookingForm, startTime: e.target.value })
              }
            />
            <Input
              type="time"
              placeholder="End Time"
              value={editBookingForm.endTime}
              onChange={(e) =>
                setEditBookingForm({ ...editBookingForm, endTime: e.target.value })
              }
            />
          </div>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await handleSaveEditedBooking()
                setShowEditDialog(false)
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )}
  </div>
)

}

// Resource Management component
const ResourceManagement = () => {
  const [resources, setResources] = useState<Resource[]>([])
  const [showAddResourceDialog, setShowAddResourceDialog] = useState<boolean>(false)
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState<boolean>(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8010/get-resources")
        const data = response.data

        // Optional: transform keys if needed
        const formattedResources: Resource[] = data.map((r: any) => ({
          id: r.id,
          name: r.resource_name,
          type: r.resource_type,
          capacity: r.capacity,
          createdAt: r.created_at,
          maintained: r.maintained_by,
        }))

        setResources(formattedResources)
      } catch (error) {
        console.error("Error fetching resources:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])
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
  const handleAddResource = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8010/resource-insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newResource.name,
        type: newResource.type,
        capacity: newResource.capacity,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to insert resource")
    }

    const result = await response.json()

    // Optionally, you might want to refresh the resource list from the backend
    // or update the local state with the returned result
    const newResourceWithId = {
      ...newResource,
      id: `${resources.length + 1}`, // ideally should come from API
      accessibility: newResource.accessibility || [],
    }

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
  } catch (error) {
    console.error("Error adding resource:", error)
    // Optionally show an error message to the user
  }
}

const handleEditResource = async (resourceId: number, updatedResource: {
  name: string;
  type: string;
  capacity: number;
}) => {
  try {
    const response = await fetch(`http://127.0.0.1:8010/resource-update/${resourceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedResource),
    })

    if (!response.ok) {
      throw new Error("Failed to update resource")
    }

    const result = await response.json()

    // Update the local state
    setResources(prevResources =>
      prevResources.map(resource =>
        resource.id === resourceId ? { ...resource, ...updatedResource } : resource
      )
    )
  } catch (error) {
    console.error("Error updating resource:", error)
    // Optionally show an error message to the user
  }
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
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [resourceBeingEdited, setResourceBeingEdited] = useState<Resource | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    type: "",
    capacity: 0,
  })


  // Filter resources based on search query
  const filteredResources = resources.filter(
    (resource) =>
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchQuery.toLowerCase()),
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

  const handleDeleteResource = async (id: string) => {
  try {
    const response = await fetch(`http://127.0.0.1:8010/resource-delete/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete resource")
    }

    // Optionally remove it from state if you're not refetching
    setResources(prev => prev.filter(resource => resource.id !== id))
  } catch (error) {
    console.error("Delete error:", error)
    alert("Error deleting resource.")
  }
}

return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Resource Management</h1>
        <p className="text-muted-foreground">Manage and book resources across the campus</p>
      </div>

      <Tabs defaultValue="available" className="flex-1">
        <TabsList className="bg-gray-800 border-b border-gray-700">
          <TabsTrigger value="available" className="data-[state=active]:bg-gray-300 data-[state=active]:text-white">Available Resources</TabsTrigger>
          <TabsTrigger value="booked" className="data-[state=active]:bg-gray-300 data-[state=active]:text-white">Booked Resources</TabsTrigger>
          <TabsTrigger value="management" className="data-[state=active]:bg-gray-300 data-[state=active]:text-white">Resource Management</TabsTrigger>
          <TabsTrigger value="maintenance" className="data-[state=active]:bg-gray-300 data-[state=active]:text-white">Maintenance Dashboard</TabsTrigger>
        </TabsList>

        {/* Available */}
        <TabsContent value="available" className="mt-6 flex-1">
          <AvailableResources />
        </TabsContent>

        {/* Booked */}
        <TabsContent value="booked" className="mt-6 flex-1">
          <BookedResources />
        </TabsContent>

        {/* Management */}
        <TabsContent value="management" className="mt-6 flex-1">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Manage Resources</h3>
              <Button onClick={() => setShowAddResourceDialog(true)}><Plus className="h-4 w-4 mr-1" /> Add New Resource</Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="border border-gray-700 rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800 text-gray-200">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Capacity</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map((resource) => (
                    <tr key={resource.id} className="border-t border-gray-700 hover:bg-gray-700">
                      <td className="p-3 text-white">{resource.name}</td>
                      <td className="p-3 text-white">{resource.type}</td>
                      <td className="p-3 text-white">{resource.capacity}</td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setResourceBeingEdited(resource)
                              setEditForm({ name: resource.name, type: resource.type, capacity: resource.capacity })
                              setShowEditDialog(true)
                            }}
                          >
                            <Edit className="h-4 w-4" /><span className="sr-only">Edit</span>
                          </Button>
                            {showEditDialog && (
                              <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Resource</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Input
                                      placeholder="Name"
                                      value={editForm.name}
                                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    />
                                    <Input
                                      placeholder="Type"
                                      value={editForm.type}
                                      onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                                    />
                                    <Input
                                      type="number"
                                      placeholder="Capacity"
                                      value={editForm.capacity}
                                      onChange={e => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
                                    />
                                  </div>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button
                                      onClick={async () => {
                                        if (resourceBeingEdited) {
                                          await handleEditResource(resourceBeingEdited.id, editForm)
                                          setShowEditDialog(false)
                                        }
                                      }}
                                    >
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
)}
                          <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300" onClick={() => handleDeleteResource(resource.id)}>
                            <Trash2 className="h-4 w-4" /><span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredResources.length === 0 && (
                <div className="p-8 text-center text-gray-400">No resources found matching your search.</div>
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
                      value={newResource.name}
                      onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Resource Type *</Label>
                    <Select
                      value={newResource.type}
                      onValueChange={(value) => setNewResource({ ...newResource, type: value })}
                      className="bg-gray-800 border-gray-700 text-white"
                    >
                      <SelectItem value="Lab">Lab</SelectItem>
                      <SelectItem value="Room">Lecture Room</SelectItem>
                      <SelectItem value="Auditorium">Auditorium</SelectItem>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={newResource.capacity}
                    onChange={(e) => setNewResource({ ...newResource, capacity: Number.parseInt(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button onClick={handleAddResource}>Add Resource</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance" className="mt-6 flex-1">
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Maintenance Dashboard</h3>

            <div className="border border-gray-700 rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800 text-gray-200">
                    <th className="p-3 text-left">Resource Name</th>
                    <th className="p-3 text-left">Assigned to</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((resource) => (
                    <tr key={resource.id} className="border-t border-gray-700 hover:bg-gray-700">
                      <td className="p-3 text-white">{resource.name}</td>
                      <td className="p-3 text-white">{resource.maintained}</td>
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
                <DialogTitle>{selectedResource ? `Maintenance: ${selectedResource.name}` : 'Maintenance'}</DialogTitle>
              </DialogHeader>
              {selectedResource && (
                <div className="space-y-4 py-4">
                  <div className="p-3 bg-gray-800 border border-gray-700 rounded-md">
                    <div className="font-medium text-white">{selectedResource.name}</div>
                    <div className="text-sm text-gray-300">{selectedResource.location}</div>
                    <div className="text-sm mt-1 text-gray-300">
                      <span className="font-medium text-white">Type:</span> {selectedResource.type}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Maintenance Status</Label>
                    <Select
                      value={maintenanceForm.status}
                      onValueChange={(value) => setMaintenanceForm({ ...maintenanceForm, status: value })}
                      className="bg-gray-800 border-gray-700 text-white"
                    >
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                      <SelectItem value="restricted">Restricted Use</SelectItem>
                    </Select>
                  </div>

                  {maintenanceForm.status !== 'available' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fromDate">From Date</Label>
                          <Input
                            type="date"
                            value={maintenanceForm.fromDate}
                            onChange={(e) => setMaintenanceForm({ ...maintenanceForm, fromDate: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="toDate">To Date</Label>
                          <Input
                            type="date"
                            value={maintenanceForm.toDate}
                            onChange={(e) => setMaintenanceForm({ ...maintenanceForm, toDate: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="persons">Maintenance Persons</Label>
                        <Input
                          placeholder="e.g. John Doe, Jane Smith"
                          value={maintenanceForm.persons}
                          onChange={(e) => setMaintenanceForm({ ...maintenanceForm, persons: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes">Maintenance Notes</Label>
                    <Textarea
                      placeholder="Enter maintenance details or restrictions"
                      value={maintenanceForm.notes}
                      onChange={(e) => setMaintenanceForm({ ...maintenanceForm, notes: e.target.value })}
                      rows={4}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
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
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.")
}

function setError(arg0: string) {
  throw new Error("Function not implemented.")
}
