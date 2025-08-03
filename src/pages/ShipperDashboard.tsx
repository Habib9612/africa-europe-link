import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Plus,
  MapPin,
  Truck,
  Star,
  AlertCircle,
  CheckCircle,
  BarChart3,
  FileText,
  Calendar,
  Brain,
  Zap,
  Target,
  List
} from "lucide-react";
import { toast } from "sonner";
import { CreateShipmentForm } from "@/components/shipments/CreateShipmentForm";
import { ShipmentsList } from "@/components/shipments/ShipmentsList";

const ShipperDashboard = () => {
  const navigate = useNavigate();
  const stats = [
    {
      title: "Active Shipments",
      value: "12",
      change: "+25%",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Monthly Spend",
      value: "€28,450",
      change: "+15%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "On-Time Delivery",
      value: "94%",
      change: "+3%",
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: "Cost Savings",
      value: "€8,230",
      change: "+18%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const activeShipments = [
    {
      id: "SH001",
      cargo: "Electronics",
      route: "Casablanca → Madrid",
      status: "In Transit",
      carrier: "EuroTrans",
      eta: "6 hours",
      value: "€2,450",
      progress: 75
    },
    {
      id: "SH002",
      cargo: "Textiles", 
      route: "Rabat → Lyon",
      status: "Loading",
      carrier: "AtlasFreight",
      eta: "12 hours",
      value: "€2,100",
      progress: 25
    },
    {
      id: "SH003",
      cargo: "Auto Parts",
      route: "Tangier → Barcelona",
      status: "Pending Pickup",
      carrier: "MediterranShip",
      eta: "18 hours",
      value: "€1,680",
      progress: 10
    }
  ];

  const recentQuotes = [
    {
      route: "Agadir → Hamburg",
      cargo: "Food Products",
      bestPrice: "€3,200",
      quotes: 5,
      savings: "€450"
    },
    {
      route: "Marrakech → Milan",
      cargo: "Handicrafts",
      bestPrice: "€1,850",
      quotes: 8,
      savings: "€320"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Transit": return "accent";
      case "Loading": return "warning";
      case "Pending Pickup": return "secondary";
      case "Delivered": return "success";
      default: return "secondary";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-hero py-12 -mx-6 -mt-6 mb-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Shipper Dashboard
                </h1>
                <p className="text-white/90">
                  Manage your shipments and track performance
                </p>
              </div>
              <Button variant="accent" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                New Shipment
              </Button>
            </div>
          </div>
        </div>
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

        {/* AI Matching CTA */}
        <Card className="shadow-glow bg-gradient-card border border-primary/20 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-primary p-4 rounded-xl">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    AI-Powered Carrier Matching
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Post your shipments and let our AI find the best carriers for you
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-primary">
                      <Target className="h-4 w-4 mr-1" />
                      95% Match Accuracy
                    </div>
                    <div className="flex items-center text-success">
                      <Zap className="h-4 w-4 mr-1" />
                      30% Cost Savings
                    </div>
                    <div className="flex items-center text-accent">
                      <Clock className="h-4 w-4 mr-1" />
                      Instant Results
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="premium" 
                  size="lg"
                  onClick={() => navigate('/ai-matching')}
                  className="px-8 py-4"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Try AI Matching
                  <Zap className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipment Management Tabs */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-primary" />
              Shipment Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create" className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Shipment
                </TabsTrigger>
                <TabsTrigger value="manage" className="flex items-center">
                  <List className="h-4 w-4 mr-2" />
                  My Shipments
                </TabsTrigger>
              </TabsList>
              <TabsContent value="create" className="mt-6">
                <CreateShipmentForm onSuccess={() => {
                  console.log('ShipperDashboard: Shipment created! You can now find carriers for it.');
                  // Refresh the shipments list after creation
                  window.dispatchEvent(new CustomEvent('shipment-created'));
                  // Show success message with next steps
                  toast.success('🚚 Shipment posted! Carriers can now see and bid on your load.');
                }} />
              </TabsContent>
              <TabsContent value="manage" className="mt-6">
                <ShipmentsList 
                  showMyShipments={true}
                  onRefresh={() => {
                    // Handle any additional refresh logic if needed
                    console.log('ShipperDashboard: Shipments list refreshed');
                  }} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Shipments */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-primary" />
                  Active Shipments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeShipments.map((shipment) => (
                    <div key={shipment.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-smooth">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{shipment.id} - {shipment.cargo}</p>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {shipment.route}
                            </p>
                          </div>
                        </div>
                        <Badge variant={getStatusColor(shipment.status) as any}>
                          {shipment.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Carrier:</span>
                          <p className="font-medium">{shipment.carrier}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ETA:</span>
                          <p className="font-medium">{shipment.eta}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Value:</span>
                          <p className="font-medium">{shipment.value}</p>
                        </div>
                      </div>

                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${shipment.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Quotes */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Recent Quotes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentQuotes.map((quote, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{quote.route}</p>
                      <Badge variant="success" className="text-xs">
                        Save {quote.savings}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{quote.cargo}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{quote.bestPrice}</span>
                      <span className="text-xs text-muted-foreground">{quote.quotes} quotes</span>
                    </div>
                    <Button variant="premium" size="sm" className="w-full mt-2">
                      Book Now
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Quotes
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="hero" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  New Shipment Request
                </Button>
                <Button 
                  variant="premium" 
                  className="w-full"
                  onClick={() => navigate('/ai-matching')}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  AI Carrier Matching
                </Button>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Pickup
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-warning" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-success/10 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Shipment Delivered</p>
                    <p className="text-xs text-muted-foreground">SH002 arrived in Barcelona</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-warning/10 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Pickup Delayed</p>
                    <p className="text-xs text-muted-foreground">SH003 pickup delayed by 2 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ShipperDashboard;