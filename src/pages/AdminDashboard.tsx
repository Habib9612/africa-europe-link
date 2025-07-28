import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  DollarSign,
  Package,
  Truck,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Settings,
  Shield,
  Globe,
  Activity,
  Flag
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Platform Revenue",
      value: "€284,500",
      change: "+18%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Shipments",
      value: "1,456",
      change: "+8%",
      icon: Package,
      color: "text-purple-600"
    },
    {
      title: "Verified Carriers",
      value: "456",
      change: "+15%",
      icon: Truck,
      color: "text-orange-600"
    }
  ];

  const recentActivity = [
    {
      type: "New Registration",
      user: "Atlas Logistics Morocco",
      action: "Carrier registered",
      time: "2 minutes ago",
      status: "pending"
    },
    {
      type: "Shipment Complete",
      user: "EuroDistrib SA",
      action: "SH001 delivered successfully",
      time: "15 minutes ago",
      status: "success"
    },
    {
      type: "Verification Request",
      user: "MediterranShip Ltd",
      action: "Document verification needed",
      time: "1 hour ago",
      status: "warning"
    },
    {
      type: "AI Match",
      user: "System",
      action: "95% match found for urgent load",
      time: "2 hours ago",
      status: "info"
    }
  ];

  const regionStats = [
    {
      region: "Morocco → Spain",
      shipments: 234,
      revenue: "€45,600",
      growth: "+22%"
    },
    {
      region: "Morocco → France", 
      shipments: 189,
      revenue: "€38,900",
      growth: "+15%"
    },
    {
      region: "Morocco → Italy",
      shipments: 156,
      revenue: "€32,100",
      growth: "+18%"
    },
    {
      region: "Morocco → Germany",
      shipments: 98,
      revenue: "€28,400",
      growth: "+25%"
    }
  ];

  const pendingActions = [
    {
      type: "Carrier Verification",
      count: 12,
      priority: "high"
    },
    {
      type: "Disputed Shipments",
      count: 3,
      priority: "critical"
    },
    {
      type: "Payment Issues",
      count: 7,
      priority: "medium"
    },
    {
      type: "System Alerts",
      count: 15,
      priority: "low"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "success";
      case "pending": return "warning";
      case "warning": return "destructive";
      case "info": return "accent";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "destructive";
      case "high": return "warning";
      case "medium": return "accent";
      case "low": return "secondary";
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
                Admin Dashboard
              </h1>
              <p className="text-white/90">
                Platform overview and management
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="accent" size="lg">
                <Settings className="h-5 w-5 mr-2" />
                Platform Settings
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
                <Shield className="h-5 w-5 mr-2" />
                Security Center
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

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-primary" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Badge variant={getStatusColor(activity.status) as any}>
                              {activity.type}
                            </Badge>
                            <div>
                              <p className="font-medium text-sm">{activity.user}</p>
                              <p className="text-xs text-muted-foreground">{activity.action}</p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pending Actions */}
              <div className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-warning" />
                      Pending Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {pendingActions.map((action, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{action.type}</p>
                          <Badge variant={getPriorityColor(action.priority) as any} className="text-xs">
                            {action.priority}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold">{action.count}</span>
                          <Button variant="outline" size="sm" className="ml-2">
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="hero" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Verify Carriers
                    </Button>
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Reports
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Globe className="h-4 w-4 mr-2" />
                      System Health
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Platform Config
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management interface would be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipments" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Shipment Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Shipment management interface would be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Regional Performance */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Flag className="h-5 w-5 mr-2 text-primary" />
                  Regional Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {regionStats.map((region, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{region.region}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipments:</span>
                          <span className="font-medium">{region.shipments}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Revenue:</span>
                          <span className="font-medium">{region.revenue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Growth:</span>
                          <span className="font-medium text-success">{region.growth}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-card rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Advanced analytics charts would be rendered here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;