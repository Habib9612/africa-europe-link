import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import { Server, Database, Cpu, HardDrive, Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function AdminMonitor() {
  const systemHealth = [
    { name: "API Server", status: "healthy", uptime: "99.9%", response: "45ms" },
    { name: "Database", status: "healthy", uptime: "99.8%", response: "12ms" },
    { name: "Cache Layer", status: "warning", uptime: "98.2%", response: "8ms" },
    { name: "File Storage", status: "healthy", uptime: "99.7%", response: "23ms" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-100 text-green-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Monitor</h1>
          <p className="text-muted-foreground mt-2">Real-time system performance and health monitoring</p>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CPU Usage</p>
                  <p className="text-3xl font-bold text-foreground">23%</p>
                  <Progress value={23} className="mt-2" />
                </div>
                <Cpu className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Memory Usage</p>
                  <p className="text-3xl font-bold text-foreground">67%</p>
                  <Progress value={67} className="mt-2" />
                </div>
                <Database className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Disk Usage</p>
                  <p className="text-3xl font-bold text-foreground">45%</p>
                  <Progress value={45} className="mt-2" />
                </div>
                <HardDrive className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-3xl font-bold text-foreground">1,247</p>
                  <p className="text-sm text-green-600 mt-1">+12% from yesterday</p>
                </div>
                <Activity className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Services Status */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Service Health</CardTitle>
            <CardDescription>Status of all system services and components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-muted-foreground">Response time: {service.response}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Uptime: {service.uptime}</p>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>System alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">High memory usage detected</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Backup completed successfully</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Server className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Server restart scheduled</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>API Response Time</span>
                    <span>45ms (Excellent)</span>
                  </div>
                  <Progress value={90} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Database Performance</span>
                    <span>12ms (Excellent)</span>
                  </div>
                  <Progress value={95} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Cache Hit Rate</span>
                    <span>89% (Good)</span>
                  </div>
                  <Progress value={89} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Error Rate</span>
                    <span>0.02% (Excellent)</span>
                  </div>
                  <Progress value={2} className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}