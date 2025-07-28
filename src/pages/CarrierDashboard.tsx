import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  TrendingUp, 
  Clock, 
  DollarSign,
  MapPin,
  Star,
  Fuel,
  Route,
  Package,
  CheckCircle,
  AlertCircle,
  Calendar,
  Phone,
  MessageCircle
} from "lucide-react";

const CarrierDashboard = () => {
  const stats = [
    {
      title: "Active Loads",
      value: "8",
      change: "+33%",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Monthly Revenue",
      value: "€18,650",
      change: "+22%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Fleet Utilization",
      value: "87%",
      change: "+5%",
      icon: Truck,
      color: "text-purple-600"
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      color: "text-orange-600"
    }
  ];

  const availableLoads = [
    {
      id: "LD001",
      cargo: "Electronics",
      route: "Casablanca → Madrid",
      weight: "15 tons",
      price: "€2,800",
      urgency: "High",
      pickup: "Tomorrow 09:00",
      match: 95
    },
    {
      id: "LD002",
      cargo: "Food Products",
      route: "Agadir → Hamburg", 
      weight: "20 tons",
      price: "€3,400",
      urgency: "Medium",
      pickup: "Jan 16 14:00",
      match: 89
    },
    {
      id: "LD003",
      cargo: "Auto Parts",
      route: "Tangier → Barcelona",
      weight: "8 tons",
      price: "€1,650",
      urgency: "Low",
      pickup: "Jan 17 10:00",
      match: 82
    }
  ];

  const myTrucks = [
    {
      id: "TR001",
      type: "Refrigerated 40ft",
      license: "MA-123-456",
      status: "In Transit",
      location: "Sevilla, Spain",
      driver: "Ahmed El Mansouri",
      eta: "6 hours",
      load: "SH001"
    },
    {
      id: "TR002", 
      type: "Container 20ft",
      license: "MA-789-012",
      status: "Available",
      location: "Casablanca, Morocco",
      driver: "Hassan Ouali",
      eta: "Ready",
      load: null
    },
    {
      id: "TR003",
      type: "Flatbed 30ft", 
      license: "MA-345-678",
      status: "Loading",
      location: "Rabat, Morocco",
      driver: "Fatima Benali",
      eta: "2 hours",
      load: "SH003"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "success";
      case "In Transit": return "accent";
      case "Loading": return "warning";
      case "Maintenance": return "destructive";
      default: return "secondary";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High": return "destructive";
      case "Medium": return "warning";
      case "Low": return "success";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Carrier Dashboard
              </h1>
              <p className="text-white/90">
                Manage your fleet and available loads
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="accent" size="lg">
                <Truck className="h-5 w-5 mr-2" />
                Add Truck
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
                <Route className="h-5 w-5 mr-2" />
                Find Loads
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-success flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Available Loads */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-primary" />
                  Available Loads (AI Matched)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableLoads.map((load) => (
                    <div key={load.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-smooth">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{load.id} - {load.cargo}</p>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {load.route}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="accent">
                            {load.match}% Match
                          </Badge>
                          <Badge variant={getUrgencyColor(load.urgency) as any}>
                            {load.urgency}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Weight:</span>
                          <p className="font-medium">{load.weight}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <p className="font-medium text-primary">{load.price}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Pickup:</span>
                          <p className="font-medium">{load.pickup}</p>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="hero" size="sm">
                            Bid Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* My Trucks */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-primary" />
                  My Fleet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myTrucks.map((truck) => (
                    <div key={truck.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded">
                            <Truck className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{truck.type}</p>
                            <p className="text-sm text-muted-foreground">{truck.license}</p>
                          </div>
                        </div>
                        <Badge variant={getStatusColor(truck.status) as any}>
                          {truck.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Driver:</span>
                          <p className="font-medium">{truck.driver}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Location:</span>
                          <p className="font-medium">{truck.location}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ETA:</span>
                          <p className="font-medium">{truck.eta}</p>
                        </div>
                      </div>
                      
                      {truck.load && (
                        <div className="mt-3 p-2 bg-accent/20 rounded">
                          <p className="text-sm">Current Load: <span className="font-medium">{truck.load}</span></p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-primary" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">On-Time Delivery</span>
                  <span className="font-bold text-success">96%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Customer Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                    <span className="font-bold">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Fuel Efficiency</span>
                  <span className="font-bold text-primary">12.5 L/100km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed Loads</span>
                  <span className="font-bold">234</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="hero" className="w-full">
                  <Route className="h-4 w-4 mr-2" />
                  Browse Loads
                </Button>
                <Button variant="outline" className="w-full">
                  <Fuel className="h-4 w-4 mr-2" />
                  Log Fuel Stop
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            {/* Earnings */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-primary" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">€18,650</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold">€15,320</p>
                    <p className="text-muted-foreground">Paid</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">€3,330</p>
                    <p className="text-muted-foreground">Pending</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  View Detailed Report
                </Button>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-warning" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-warning/10 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Maintenance Due</p>
                    <p className="text-xs text-muted-foreground">TR002 needs service in 500km</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-success/10 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Load Delivered</p>
                    <p className="text-xs text-muted-foreground">SH001 completed successfully</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrierDashboard;