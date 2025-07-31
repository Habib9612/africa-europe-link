import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Truck, Package, TrendingUp, Settings, Activity } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function AdminDashboard() {
  const systemMetrics = [
    { title: "Total Users", value: "12,847", change: "+12%", icon: Users },
    { title: "Active Carriers", value: "3,241", change: "+8%", icon: Truck },
    { title: "Active Shipments", value: "5,672", change: "+15%", icon: Package },
    { title: "AI Match Rate", value: "94.3%", change: "+2.1%", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">System overview and management console</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemMetrics.map((metric, index) => (
            <Card key={index} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                    <Badge variant="secondary" className="mt-2 text-xs text-green-600">
                      {metric.change} from last month
                    </Badge>
                  </div>
                  <metric.icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
            <Users className="h-6 w-6" />
            <span>Manage Users</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
            <Activity className="h-6 w-6" />
            <span>View Analytics</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
            <Settings className="h-6 w-6" />
            <span>System Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}