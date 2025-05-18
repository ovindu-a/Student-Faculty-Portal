import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle  } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Cctv, AlertTriangle, Eye, UserCheck, Car, Search, Users, Shield, Menu, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { VehicleAccess } from "./VehicleAccess";
import { VisitorPreAuth } from "./VisitorPreAuth";

const systemMetricsData = [
  { name: "CPU Usage", value: 45 },
  { name: "Memory Usage", value: 62 },
  { name: "Storage Usage", value: 78 },
  { name: "Network Load", value: 35 },
];

const userActivityData = [
  { time: "00:00", activeUsers: 120 },
  { time: "04:00", activeUsers: 45 },
  { time: "08:00", activeUsers: 280 },
  { time: "12:00", activeUsers: 350 },
  { time: "16:00", activeUsers: 420 },
  { time: "20:00", activeUsers: 180 },
];

const securityEventsData = [
  { name: "Login Attempts", count: 245 },
  { name: "Failed Logins", count: 18 },
  { name: "Suspicious IPs", count: 5 },
  { name: "Blocked Requests", count: 12 },
];

const recentAlerts = [
  {
    id: 1,
    type: "Security",
    message: "Multiple failed login attempts detected",
    severity: "High",
    timestamp: "2 minutes ago",
  },
  {
    id: 2,
    type: "System",
    message: "High CPU usage detected on server-01",
    severity: "Medium",
    timestamp: "15 minutes ago",
  },
  {
    id: 3,
    type: "User",
    message: "Unusual activity pattern detected",
    severity: "Low",
    timestamp: "1 hour ago",
  },
];

const camerasData = [
  { id: 1, name: "Main Entrance", location: "Admin Block", status: "active" },
  { id: 2, name: "Parking A", location: "North Campus", status: "active" },
  { id: 3, name: "Library Exit", location: "East Wing", status: "active" },
  { id: 4, name: "Cafeteria", location: "Student Center", status: "active" },
  { id: 5, name: "Lecture Hall", location: "Building B", status: "active" },
  { id: 6, name: "Parking B", location: "South Campus", status: "active" },
  { id: 7, name: "Dormitory", location: "Residence Block", status: "active" },
  { id: 8, name: "Labs Access", location: "Science Block", status: "active" },
];

const alertsData = [
  { 
    id: 1, 
    type: "Motion Detected", 
    location: "Restricted Area - Building C", 
    timestamp: "2 mins ago", 
    severity: "high", 
    status: "new",
    cameraId: 3
  },
  { 
    id: 2, 
    type: "Unidentified Person", 
    location: "Main Entrance", 
    timestamp: "15 mins ago", 
    severity: "medium", 
    status: "investigating",
    cameraId: 1
  },
  { 
    id: 3, 
    type: "Tailgating Detected", 
    location: "Parking A", 
    timestamp: "27 mins ago", 
    severity: "medium", 
    status: "investigating",
    cameraId: 2
  },
  { 
    id: 4, 
    type: "Door Left Open", 
    location: "Science Block", 
    timestamp: "42 mins ago", 
    severity: "low", 
    status: "resolved",
    cameraId: 8
  },
  { 
    id: 5, 
    type: "Camera Malfunction", 
    location: "Dormitory", 
    timestamp: "1 hour ago", 
    severity: "medium", 
    status: "acknowledged",
    cameraId: 7
  },
];

function getSeverityColor(severity: string) {
  switch (severity) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    default:
      return "bg-blue-500";
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "new":
      return "border-red-500 text-red-500";
    case "investigating":
      return "border-yellow-500 text-yellow-500";
    case "acknowledged":
      return "border-blue-500 text-blue-500";
    default:
      return "border-green-500 text-green-500";
  }
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function CameraFeed({ camera }: { camera: any }) {
  return (
    <div className="overflow-hidden bg-gray-900 rounded-lg relative h-full flex flex-col">
      <div className="absolute top-2 left-2 z-10">
        <Badge className="bg-red-500 text-white text-xs">LIVE</Badge>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 text-base sm:text-lg font-bold">NO SIGNAL</p>
      </div>
      <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-gray-900 to-transparent">
        <h3 className="text-sm sm:text-base font-medium text-white truncate">{camera.name}</h3>
      </div>
    </div>
  );
}

function FeaturedCamera({ camera }: { camera: any }) {
  return (
    <div className="overflow-hidden bg-gray-900 rounded-lg relative h-full flex flex-col">
      <div className="absolute top-2 left-2 z-10">
        <Badge className="bg-red-500 text-white text-xs">LIVE</Badge>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 text-lg sm:text-xl md:text-2xl font-bold">NO SIGNAL</p>
      </div>
      <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-gray-900 to-transparent">
        <h3 className="text-base sm:text-lg font-medium text-white truncate">{camera.name}</h3>
        <p className="text-xs sm:text-sm text-gray-400 truncate">{camera.location}</p>
      </div>
    </div>
  );
}

function AlertsPanel() {
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Alerts</h1>
        <p className="text-muted-foreground">
          {alertsData.filter(a => a.status === "new").length} new alerts requiring attention
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-4">
          {alertsData.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-4 p-4 bg-white rounded-lg border ${
                selectedAlert === alert.id ? 'border-yellow-500' : 'border-gray-200'
              } cursor-pointer`}
              onClick={() => setSelectedAlert(alert.id)}
            >
              <div className={`p-2 rounded-md ${getSeverityColor(alert.severity)}`}>
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{alert.type}</h3>
                    <p className="text-sm text-muted-foreground">{alert.location}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusClass(alert.status)}
                  >
                    {formatStatus(alert.status)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                  <Button variant="ghost" className="h-8 bg-blue-600 text-white hover:bg-blue-900 hover:text-white">
                    View Camera
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Alert Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {selectedAlert ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">
                      {alertsData.find(a => a.id === selectedAlert)?.type}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {alertsData.find(a => a.id === selectedAlert)?.location}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        variant="outline"
                        className={getStatusClass(
                          alertsData.find(a => a.id === selectedAlert)?.status || ""
                        )}
                      >
                        {formatStatus(
                          alertsData.find(a => a.id === selectedAlert)?.status || ""
                        )}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span>{alertsData.find(a => a.id === selectedAlert)?.timestamp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Camera</span>
                      <span>
                        {
                          camerasData.find(
                            c => c.id === alertsData.find(a => a.id === selectedAlert)?.cameraId
                          )?.name
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 aspect-video rounded-md flex items-center justify-center">
                    <p className="text-gray-500 text-lg font-bold">NO SIGNAL</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600">Investigate</Button>
                    <Button variant="outline" className="flex-1">Dismiss</Button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-6">
                  <p className="text-muted-foreground">Select an alert to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CctvMonitoring() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CCTV Monitoring</h1>
          <p className="text-muted-foreground">Live feed from {camerasData.length} cameras across campus</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8">Export</Button>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8">Settings</Button>
          <Button size="sm" className="text-xs sm:text-sm h-8">Take Action</Button>
        </div>
      </div>

      <Tabs defaultValue="grid" className="flex flex-col flex-1">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-start sm:items-center mb-3">
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8">Filter</Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8">Sort</Button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <TabsContent value="grid" className="h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr gap-2 h-full">
              {camerasData.map(camera => (
                <CameraFeed key={camera.id} camera={camera} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="featured" className="h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr gap-2 h-full">
              <div className="md:col-span-2 md:row-span-2 h-full">
                <FeaturedCamera camera={camerasData[0]} />
              </div>
              <CameraFeed camera={camerasData[1]} />
              <CameraFeed camera={camerasData[2]} />
              <CameraFeed camera={camerasData[3]} />
              <CameraFeed camera={camerasData[4]} />
              <CameraFeed camera={camerasData[5]} />
              <CameraFeed camera={camerasData[6]} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

const SearchLogs = () => (
  <div>
    <h1 className="text-2xl font-bold tracking-tight mb-6">Search Logs</h1>
    <p className="text-muted-foreground">This section is under development.</p>
  </div>
);

const PersonnelSection = () => (
  <div>
    <h1 className="text-2xl font-bold tracking-tight mb-6">Personnel Management</h1>
    <p className="text-muted-foreground">This section is under development.</p>
  </div>
);

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('cctv');
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/user', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Authentication failed');
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUser();

    // Add event listener to handle responsive sidebar
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'cctv', label: 'CCTV Monitoring', icon: Cctv },
    { id: 'alerts', label: 'Alerts Panel', icon: AlertTriangle },
    { id: 'vehicle', label: 'Vehicle Access', icon: Car },
    { id: 'visitors', label: 'Visitor Pre-Auth', icon: UserCheck },
    { id: 'logs', label: 'Search Logs', icon: Search },
    { id: 'personnel', label: 'Personnel', icon: Users },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'cctv':
        return <CctvMonitoring />;
      case 'alerts':
        return <AlertsPanel />;
      case 'vehicle':
        return <VehicleAccess />;
      case 'visitors':
        return <VisitorPreAuth />;
      case 'logs':
        return <SearchLogs />;
      case 'personnel':
        return <PersonnelSection />;
      default:
        return <CctvMonitoring />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen h-screen w-full bg-gray-50 overflow-hidden">
      {/* Top header bar for mobile - only shown on small screens */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Campus Security</h2>
        <button onClick={toggleSidebar} className="p-1">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden w-full h-full">
        {/* Left sidebar for Campus Security navigation - responsive */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block bg-gray-900 text-white border-r flex-shrink-0 ${
          isSidebarOpen ? 'w-full md:w-64' : 'w-0'
        } transition-all duration-300 fixed md:static md:h-full z-20 h-[calc(100%-4rem)]`}>
          <div className="hidden md:block p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold">Campus Security</h2>
          </div>
          <nav className="mt-4 overflow-y-auto h-[calc(100%-8rem)]">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveSection(item.id);
                      if (window.innerWidth < 768) {
                        setIsSidebarOpen(false);
                      }
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left ${
                      activeSection === item.id 
                        ? 'bg-gray-800 text-white' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden md:block absolute bottom-0 w-64 border-t border-gray-800 p-4">
            <div className="flex items-center">
              <Shield className="h-6 w-6 mr-3" />
              <span className="font-semibold">Admin</span>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-auto w-full h-full p-2 md:p-4">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 