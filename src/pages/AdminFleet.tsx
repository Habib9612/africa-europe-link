import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, Activity, MapPin, Calendar, User } from "lucide-react";

export default function AdminFleet() {
  const fleetData = [
    { id: "VH001", driver: "Ahmed Hassan", location: "Casablanca", status: "In Transit", lastUpdate: "2 hours ago" },
    { id: "VH002", driver: "Sofia Martinez", location: "Madrid", status: "Available", lastUpdate: "30 min ago" },
    { id: "VH003", driver: "Omar Benali", location: "Rabat", status: "Loading", lastUpdate: "1 hour ago" },
    { id: "VH004", driver: "Jean Dubois", location: "Paris", status: "In Transit", lastUpdate: "45 min ago" },
    { id: "VH005", driver: "Maria Lopez", location: "Barcelona", status: "Maintenance", lastUpdate: "3 hours ago" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800";
      case "In Transit": return "bg-blue-100 text-blue-800";
      case "Loading": return "bg-yellow-100 text-yellow-800";
      case "Maintenance": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fleet Overview</h1>
          <p className="text-muted-foreground mt-2">Monitor and manage your entire fleet</p>
        </div>

        {/* Fleet Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Vehicles</p>
                  <p className="text-3xl font-bold text-foreground">24</p>
                </div>
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-3xl font-bold text-green-600">18</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                  <p className="text-3xl font-bold text-blue-600">12</p>
                </div>
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
                  <p className="text-3xl font-bold text-red-600">3</p>
                </div>
                <Calendar className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fleet Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
            <CardDescription>Real-time status of all vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle ID</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fleetData.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {vehicle.driver}
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.location}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{vehicle.lastUpdate}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}