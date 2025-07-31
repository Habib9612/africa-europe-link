import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, DollarSign, Clock, Truck, Package, Target, Fuel } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 12000, costs: 8000 },
  { month: 'Feb', revenue: 15000, costs: 9500 },
  { month: 'Mar', revenue: 18000, costs: 11000 },
  { month: 'Apr', revenue: 16000, costs: 10500 },
  { month: 'May', revenue: 22000, costs: 13000 },
  { month: 'Jun', revenue: 25000, costs: 14500 },
];

const performanceData = [
  { metric: 'On-Time Delivery', value: 94, target: 95 },
  { metric: 'Cost per Mile', value: 2.45, target: 2.50 },
  { metric: 'Fuel Efficiency', value: 7.2, target: 7.0 },
  { metric: 'Customer Rating', value: 4.8, target: 4.5 },
];

const routeData = [
  { route: 'Casablanca-Madrid', trips: 45, revenue: 15000 },
  { route: 'Rabat-Barcelona', trips: 32, revenue: 12000 },
  { route: 'Tangier-Marseille', trips: 28, revenue: 10500 },
  { route: 'Agadir-Lyon', trips: 24, revenue: 9200 },
  { route: 'Marrakech-Milan', trips: 18, revenue: 7800 },
];

const fuelData = [
  { name: 'Highway', value: 45, color: '#8b5cf6' },
  { name: 'City', value: 30, color: '#06b6d4' },
  { name: 'Rural', value: 25, color: '#10b981' },
];

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Performance insights and business intelligence
            </p>
          </div>
          <Select defaultValue="30days">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 3 months</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">€108,000</p>
                  <p className="text-xs text-green-600 mt-2">↗ +18.5% from last month</p>
                </div>
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Shipments</p>
                  <p className="text-2xl font-bold">147</p>
                  <p className="text-xs text-blue-600 mt-2">↗ +12% from last month</p>
                </div>
                <Package className="h-6 w-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Delivery Time</p>
                  <p className="text-2xl font-bold">2.3 days</p>
                  <p className="text-xs text-green-600 mt-2">↗ -0.5 days improved</p>
                </div>
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fleet Utilization</p>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-xs text-orange-600 mt-2">↗ +5% from last month</p>
                </div>
                <Truck className="h-6 w-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="fuel">Fuel</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue vs Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          name="Revenue"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="costs" 
                          stroke="#ef4444" 
                          strokeWidth={3}
                          name="Costs"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {performanceData.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{metric.value}</span>
                          <span className="text-xs text-muted-foreground">/ {metric.target}</span>
                        </div>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(metric.value / metric.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Routes Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {routeData.map((route, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{route.route}</p>
                        <p className="text-sm text-muted-foreground">{route.trips} trips completed</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">€{route.revenue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fuel" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fuel Consumption by Road Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={fuelData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {fuelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fuel Efficiency Trends</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Fuel className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Average MPG</p>
                        <p className="text-sm text-muted-foreground">Current period</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold">7.2</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Fuel Cost Savings</p>
                        <p className="text-sm text-muted-foreground">AI optimization</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-green-600">€2,340</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Efficiency Improvement</p>
                        <p className="text-sm text-muted-foreground">vs last quarter</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">+12%</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}