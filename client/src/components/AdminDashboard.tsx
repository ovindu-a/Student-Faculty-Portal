import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { DashboardLayout } from "./DashboardLayout";
import { SidebarTrigger } from "./ui/sidebar-trigger";
import { Button } from "./ui/button";
import { Cctv, AlertTriangle } from "lucide-react";
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
      return "bg-security-red";
    case "medium":
      return "bg-security-yellow";
    default:
      return "bg-security-blue";
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "new":
      return "border-security-red text-security-red";
    case "investigating":
      return "border-security-yellow text-security-yellow";
    case "acknowledged":
      return "border-security-blue text-security-blue";
    default:
      return "border-security-green text-security-green";
  }
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
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
              className={`alert-item cursor-pointer ${selectedAlert === alert.id ? 'border-security-yellow' : ''}`}
              onClick={() => setSelectedAlert(alert.id)}
            >
              <div className={`p-2 rounded-md ${getSeverityColor(alert.severity)}`}>
                <AlertTriangle className="h-5 w-5 text-background" />
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
                  <Button variant="ghost" size="sm">
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
                <>
                  <div className="aspect-video bg-card rounded-md flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <AlertTriangle className="h-8 w-8" />
                      <span>Alert Footage</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button>Dispatch Team</Button>
                    <Button variant="outline">Mark Resolved</Button>
                  </div>
                  
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="outline" className="capitalize">
                        {selectedAlert === 1 ? "New" : "Investigating"}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span>{selectedAlert === 1 ? "2 mins ago" : "15 mins ago"}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span>{selectedAlert === 1 ? "Restricted Area" : "Main Entrance"}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Camera ID</span>
                      <span>#{selectedAlert === 1 ? "3" : "1"}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <AlertTriangle className="h-16 w-16 opacity-20" />
                  <p>Select an alert to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CameraFeed({ camera }: { camera: any }) {
  return (
    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden shadow-md">
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
        <Cctv className="h-12 w-12" />
      </div>

      <div className="absolute inset-0 p-2 flex flex-col justify-between bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-white font-medium">LIVE</span>
          </div>
          <Button variant="outline" size="icon" className="h-6 w-6 text-white border-white/50">
            ⋯
          </Button>
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{camera.name}</p>
          <p className="text-gray-300 text-xs">{camera.location}</p>
        </div>
      </div>
    </div>
  );
}

function FeaturedCamera({ camera }: { camera: any }) {
  return (
    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden shadow-lg">
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
        <Cctv className="h-16 w-16" />
      </div>

      <div className="absolute inset-0 p-4 flex flex-col justify-between bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-white font-medium">LIVE</span>
          </div>
          <Button variant="outline" size="icon" className="h-6 w-6 text-white border-white/50">
            ⋯
          </Button>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-white font-semibold">{camera.name}</p>
            <p className="text-gray-300 text-xs">{camera.location}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Zoom</Button>
            <Button variant="default" size="sm">Full Screen</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CctvMonitoring() {
  const [view, setView] = useState("grid");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CCTV Monitoring</h1>
          <p className="text-muted-foreground">
            Live feed from {camerasData.length} cameras across campus
          </p>
        </div>
        <Tabs defaultValue="grid" value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={view}>
        <TabsContent value="grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {camerasData.map((camera) => (
              <CameraFeed key={camera.id} camera={camera} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured">
          <div className="flex flex-col gap-4">
            <FeaturedCamera camera={camerasData[0]} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {camerasData.slice(1, 4).map((camera) => (
                <CameraFeed key={camera.id} camera={camera} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Placeholder components for other sections
const SearchLogs = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Search Logs</h2>
    <p>System logs and search functionality will be implemented here.</p>
  </div>
);

const PersonnelSection = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Personnel Management</h2>
    <p>Personnel access and management will be implemented here.</p>
  </div>
);

const AdminDashboard = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("cctv");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8100/user', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        
        const userData = await response.json();
        if (userData.role !== 'Admin') {
          window.location.href = '/';
        }
        setUserInfo(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        window.location.href = '/';
      }
    };

    fetchUser();
  }, []);

  if (!userInfo) {
    return (
      <DashboardLayout>
        <div className="p-6">Loading...</div>
      </DashboardLayout>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "cctv":
        return <CctvMonitoring />;
      case "alerts":
        return <AlertsPanel />;
      case "vehicle":
        return <VehicleAccess />;
      case "preauth":
        return <VisitorPreAuth />;
      case "search":
        return <SearchLogs />;
      case "personnel":
        return <PersonnelSection />;
      default:
        return <CctvMonitoring />;
    }
  };

  return (
    // <DashboardLayout>
      <div className="min-h-screen flex w-full">
        <aside className="w-64 border-r border-border bg-background">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveSection("cctv")}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
                activeSection === "cctv"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <Cctv className="h-5 w-5" />
              <span>CCTV Monitoring</span>
            </button>
            <button
              onClick={() => setActiveSection("alerts")}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
                activeSection === "alerts"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <span>Alerts Panel</span>
            </button>
            <button
              onClick={() => setActiveSection("vehicle")}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
                activeSection === "vehicle"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <span>Vehicle Access</span>
            </button>
            <button
              onClick={() => setActiveSection("preauth")}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
                activeSection === "preauth"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <span>Visitor Pre-Auth</span>
            </button>
            <button
              onClick={() => setActiveSection("search")}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
                activeSection === "search"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <span>Search Logs</span>
            </button>
            <button
              onClick={() => setActiveSection("personnel")}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
                activeSection === "personnel"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <span>Personnel</span>
            </button>
          </nav>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="flex h-16 items-center gap-4 border-b border-border bg-background px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="ml-auto flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                AD
              </div>
            </div>
          </div>
          <div className="container py-6">{renderActiveSection()}</div>
        </main>
      </div>
    // </DashboardLayout>
  );
};

export default AdminDashboard; 