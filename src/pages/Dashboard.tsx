import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Package, Truck, Target, Activity, MapPin, BarChart3, Users, Fuel, TrendingUp, Zap, Brain, Route, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: '1', value: 47 },
  { name: '2', value: 52 },
  { name: '3', value: 59 },
  { name: '4', value: 66 },
  { name: '5', value: 72 },
  { name: '6', value: 68 },
  { name: '7', value: 74 },
  { name: '8', value: 81 },
  { name: '9', value: 88 },
  { name: '10', value: 94 },
  { name: '11', value: 89 },
  { name: '12', value: 96 },
  { name: '13', value: 103 },
  { name: '14', value: 108 },
];

const activeDrivers = [
  { name: "Michael Chen", route: "DRV-112 • Chicago to Atlanta", efficiency: 92, status: "On Route" },
  { name: "Sarah Johnson", route: "DRV-098 • Miami to New York", efficiency: 87, status: "On Route" },
  { name: "David Wilson", route: "DRV-076 • Dallas to Phoenix", efficiency: 94, status: "On Route" },
  { name: "Emily Rodriguez", route: "DRV-104 • Seattle to Denver", efficiency: 89, status: "Loading" },
];

const maintenanceItems = [
  { id: "TRK-1042", type: "Oil Change", priority: "Routine", date: "Mar 25", predicted: true },
  { id: "TRK-1036", type: "Brake Inspection", priority: "Critical", date: "Mar 26", predicted: true },
  { id: "TRK-1039", type: "Tire Rotation", priority: "Routine", date: "Mar 27", predicted: false },
  { id: "TRK-1041", type: "Engine Diagnostics", priority: "High", date: "Mar 29", predicted: true },
];

export default function Dashboard() {
  const { profile } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {profile?.role === 'admin' ? 'admin' : profile?.full_name || 'User'}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's an overview of your logistics operations.
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fleet Status</p>
                  <p className="text-3xl font-bold">42</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-muted-foreground">Active: 32</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-muted-foreground">In Maintenance: 7</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-muted-foreground">Inactive: 3</span>
                    </div>
                  </div>
                </div>
                <Truck className="h-6 w-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Shipments</p>
                  <p className="text-3xl font-bold">127</p>
                  <p className="text-xs text-green-600 mt-2">↗ +12.5% from last month</p>
                </div>
                <Package className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fuel Efficiency</p>
                  <p className="text-3xl font-bold">7.2 mpg</p>
                  <p className="text-xs text-green-600 mt-2">↗ +0.3 from last quarter</p>
                </div>
                <Fuel className="h-6 w-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">AI Efficiency Gain</p>
                  <p className="text-3xl font-bold">23.7%</p>
                  <p className="text-xs text-green-600 mt-2">↗ +1.8% from last month</p>
                </div>
                <Brain className="h-6 w-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI-Powered Fleet Management */}
          <Card className="lg:col-span-2 bg-card border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                AI-Powered Fleet Management
              </CardTitle>
              <CardDescription>
                Real-time location and predictive maintenance of your fleet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search locations..."
                    className="w-full px-4 py-2 border rounded-lg bg-background"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-muted/20 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20"></div>
                <div className="text-center z-10">
                  <MapPin className="h-12 w-12 mx-auto text-primary mb-2" />
                  <p className="text-muted-foreground">Interactive fleet map</p>
                  <div className="mt-4 flex items-center justify-center">
                    <Badge className="bg-blue-500">Dispatched</Badge>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-card border rounded-lg p-3 shadow-lg">
                  <p className="font-medium text-sm">order_vioJEBq</p>
                  <p className="text-xs text-muted-foreground">May 5, 2024 13:30</p>
                  <p className="text-xs">📍 Chicago Distribution Center</p>
                  <p className="text-xs">📍 Atlanta Logistics Hub</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Drivers */}
          <Card className="bg-card border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Active Drivers
                </CardTitle>
                <CardDescription>
                  AI-optimized routes and assignments
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeDrivers.map((driver, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      {driver.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{driver.name}</p>
                      <p className="text-xs text-muted-foreground">{driver.route}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-blue-500 text-white text-xs">
                      {driver.status}
                    </Badge>
                    <p className="text-xs text-green-600 mt-1">AI Eff: {driver.efficiency}%</p>
                  </div>
                </div>
              ))}
              <Button variant="link" className="w-full text-primary">
                View all drivers →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI-Powered Predictive Maintenance */}
          <Card className="bg-card border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                AI-Powered Predictive Maintenance
              </CardTitle>
              <CardDescription>
                Upcoming maintenance tasks optimized by AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {maintenanceItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{item.id}</p>
                      {item.predicted && (
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                          AI Predicted
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.type}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={item.priority === 'Critical' ? 'destructive' : 
                              item.priority === 'High' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {item.priority}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
              <Button variant="link" className="w-full text-primary">
                View all maintenance →
              </Button>
            </CardContent>
          </Card>

          {/* AI-Powered Fleet Analytics */}
          <Card className="bg-card border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                AI-Powered Fleet Analytics
              </CardTitle>
              <CardDescription>
                Performance optimization insights from our AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Button variant="ghost" size="sm" className="text-primary">
                  Total Deliveries
                </Button>
                <Button variant="ghost" size="sm">
                  Operating Costs
                </Button>
                <Button variant="ghost" size="sm">
                  AI Optimization
                </Button>
              </div>
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">
                  AI-optimized delivery routes increased delivery rate by 8.5% across all carriers
                </p>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights & Recommendations */}
        <Card className="bg-card border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              AI Insights & Recommendations
            </CardTitle>
            <CardDescription>
              Machine learning powered suggestions to optimize your operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Route className="h-6 w-6 text-purple-500" />
                  <h4 className="font-semibold">Route Optimization</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Rerouting 5 shipments can save 230 miles and reduce fuel costs by $420 this week.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="h-6 w-6 text-blue-500" />
                  <h4 className="font-semibold">Maintenance Prediction</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Schedule maintenance for 3 vehicles now to prevent potential breakdowns within 2 weeks.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  <h4 className="font-semibold">Demand Forecasting</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Prepare for 18% increased demand in the Miami-Atlanta corridor next week.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}