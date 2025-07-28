import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Truck, 
  Package, 
  MapPin, 
  Clock,
  DollarSign,
  Users,
  Star,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Activity
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Active Shipments",
      value: "23",
      change: "+12%",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Available Trucks",
      value: "156",
      change: "+8%",
      icon: Truck,
      color: "text-green-600"
    },
    {
      title: "Revenue This Month",
      value: "€45,230",
      change: "+23%",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Active Carriers",
      value: "89",
      change: "+5%",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  const recentShipments = [
    {
      id: "SH001",
      route: "Casablanca → Madrid",
      status: "In Transit",
      carrier: "EuroTrans",
      eta: "6 hours",
      value: "€2,450"
    },
    {
      id: "SH002", 
      route: "Tangier → Barcelona",
      status: "Delivered",
      carrier: "MediterranShip",
      eta: "Completed",
      value: "€1,680"
    },
    {
      id: "SH003",
      route: "Rabat → Lyon",
      status: "Loading",
      carrier: "AtlasFreight",
      eta: "12 hours",
      value: "€2,100"
    }
  ];

  const aiMatches = [
    {
      match: "95%",
      route: "Marrakech → Milan",
      carrier: "ItalMorocco Express",
      savings: "€340"
    },
    {
      match: "92%",
      route: "Fez → Frankfurt", 
      carrier: "GermanLogistics Pro",
      savings: "€280"
    },
    {
      match: "89%",
      route: "Meknes → Marseille",
      carrier: "FrenchConnect",
      savings: "€220"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "success";
      case "In Transit": return "accent";
      case "Loading": return "warning";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-white/90">
            Welcome back! Here's what's happening with your logistics operations.
          </p>
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
                  <div className={`p-3 rounded-lg bg-primary/10`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Shipments */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-primary" />
                  Recent Shipments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentShipments.map((shipment) => (
                    <div key={shipment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-smooth">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-2 rounded">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{shipment.id}</p>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {shipment.route}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusColor(shipment.status) as any}>
                          {shipment.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{shipment.carrier}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{shipment.value}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {shipment.eta}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-card rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Performance chart would be rendered here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Recommendations */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Star className="h-5 w-5 mr-2 text-primary" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiMatches.map((match, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="accent" className="text-xs">
                        {match.match} Match
                      </Badge>
                      <span className="text-sm font-semibold text-success">
                        Save {match.savings}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{match.route}</p>
                    <p className="text-xs text-muted-foreground">{match.carrier}</p>
                    <Button variant="premium" size="sm" className="w-full mt-2">
                      Accept Match
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="hero" className="w-full">
                  <Package className="h-4 w-4 mr-2" />
                  Post New Load
                </Button>
                <Button variant="outline" className="w-full">
                  <Truck className="h-4 w-4 mr-2" />
                  Find Trucks
                </Button>
                <Button variant="outline" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Track Shipments
                </Button>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-warning" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-warning/10 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Delayed Shipment</p>
                    <p className="text-xs text-muted-foreground">SH001 is 2 hours behind schedule</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-success/10 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Delivery Complete</p>
                    <p className="text-xs text-muted-foreground">SH002 delivered successfully</p>
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

export default Dashboard;