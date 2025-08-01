import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Truck,
  Route as RouteIcon,
  Search,
  Filter,
  Plus,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface RouteData {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  status: 'active' | 'completed' | 'planned';
  vehicle: string;
  driver: string;
  cargo: string;
  estimatedCost: number;
  actualCost?: number;
  createdAt: string;
}

const Routes = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Demo routes data for now
  const demoRoutes: RouteData[] = [
    {
      id: "1",
      name: "Casa-Madrid Express",
      origin: "Casablanca, Morocco",
      destination: "Madrid, Spain",
      distance: 1247,
      duration: 18,
      status: 'active',
      vehicle: "Truck-001",
      driver: "Ahmed Benali",
      cargo: "Electronics",
      estimatedCost: 2450,
      createdAt: "2025-01-02T10:00:00Z"
    },
    {
      id: "2", 
      name: "Tangier-Barcelona Route",
      origin: "Tangier, Morocco",
      destination: "Barcelona, Spain",
      distance: 1089,
      duration: 16,
      status: 'completed',
      vehicle: "Truck-002",
      driver: "Mohamed El Khadir",
      cargo: "Textiles",
      estimatedCost: 1680,
      actualCost: 1620,
      createdAt: "2025-01-01T08:30:00Z"
    },
    {
      id: "3",
      name: "Rabat-Lyon Freight",
      origin: "Rabat, Morocco", 
      destination: "Lyon, France",
      distance: 1523,
      duration: 22,
      status: 'planned',
      vehicle: "Truck-003",
      driver: "Youssef Mansouri",
      cargo: "Agricultural Products",
      estimatedCost: 2100,
      createdAt: "2025-01-03T14:15:00Z"
    }
  ];

  useEffect(() => {
    // Set demo data for now
    setRoutes(demoRoutes);
  }, [user]);

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || route.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'secondary';
      case 'planned': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Navigation;
      case 'completed': return CheckCircle;
      case 'planned': return Clock;
      default: return AlertCircle;
    }
  };

  const optimizeRoute = async (routeId: string) => {
    setLoading(true);
    try {
      // Call the route optimization edge function
      const { data, error } = await supabase.functions.invoke('route-optimization', {
        body: { routeId }
      });

      if (error) throw error;
      
      toast.success("Route optimized successfully!");
      // Refresh routes after optimization
    } catch (error) {
      console.error('Error optimizing route:', error);
      toast.error('Failed to optimize route');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Active Routes",
      value: routes.filter(r => r.status === 'active').length.toString(),
      icon: Navigation,
      color: "text-green-600"
    },
    {
      title: "Total Distance",
      value: `${routes.reduce((acc, r) => acc + r.distance, 0).toLocaleString()}km`,
      icon: MapPin,
      color: "text-blue-600"
    },
    {
      title: "Avg Efficiency",
      value: "94%",
      icon: BarChart3,
      color: "text-purple-600"
    },
    {
      title: "Cost Savings",
      value: "€15,240",
      icon: RouteIcon,
      color: "text-orange-600"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-hero py-12 -mx-6 -mt-6 mb-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Route Management
                </h1>
                <p className="text-white/90">
                  Optimize routes and track delivery performance
                </p>
              </div>
              <Button variant="accent" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Plan New Route
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
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search routes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("active")}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("completed")}
                >
                  Completed
                </Button>
                <Button
                  variant={statusFilter === "planned" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("planned")}
                >
                  Planned
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Routes List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <RouteIcon className="h-5 w-5 mr-2 text-primary" />
                Route Overview
              </div>
              <Badge variant="accent" className="animate-pulse">
                <Zap className="h-3 w-3 mr-1" />
                AI Optimized
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRoutes.map((route) => {
                const StatusIcon = getStatusIcon(route.status);
                return (
                  <Card key={route.id} className="shadow-elegant hover:shadow-glow transition-smooth">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-primary p-3 rounded-xl">
                            <StatusIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{route.name}</h3>
                            <p className="text-muted-foreground">
                              {route.origin} → {route.destination}
                            </p>
                          </div>
                        </div>
                        <Badge variant={getStatusVariant(route.status) as any}>
                          {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-5 gap-4 mb-4">
                        <div className="text-center p-3 bg-gradient-card rounded-lg">
                          <MapPin className="h-5 w-5 text-primary mx-auto mb-1" />
                          <div className="text-lg font-bold">{route.distance}km</div>
                          <div className="text-xs text-muted-foreground">Distance</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-card rounded-lg">
                          <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                          <div className="text-lg font-bold">{route.duration}h</div>
                          <div className="text-xs text-muted-foreground">Duration</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-card rounded-lg">
                          <Truck className="h-5 w-5 text-primary mx-auto mb-1" />
                          <div className="text-lg font-bold">{route.vehicle}</div>
                          <div className="text-xs text-muted-foreground">Vehicle</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-card rounded-lg">
                          <div className="text-lg font-bold">€{route.estimatedCost}</div>
                          <div className="text-xs text-muted-foreground">Est. Cost</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-card rounded-lg">
                          <div className="text-lg font-bold">{route.cargo}</div>
                          <div className="text-xs text-muted-foreground">Cargo</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Driver: {route.driver}</span>
                          <span>Created: {new Date(route.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => optimizeRoute(route.id)}
                            disabled={loading}
                          >
                            <Zap className="h-4 w-4 mr-1" />
                            Optimize
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                          >
                            <MapPin className="h-4 w-4 mr-1" />
                            View Map
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Routes;