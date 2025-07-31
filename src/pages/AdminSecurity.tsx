import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Key, Users, Database } from "lucide-react";

export default function AdminSecurity() {
  const securityEvents = [
    { id: "SE001", type: "Login Attempt", user: "admin@logiconnect.com", status: "Success", time: "2 min ago", ip: "192.168.1.100" },
    { id: "SE002", type: "Failed Login", user: "unknown@email.com", status: "Blocked", time: "15 min ago", ip: "203.45.67.89" },
    { id: "SE003", type: "Password Change", user: "user@company.com", status: "Success", time: "1 hour ago", ip: "10.0.0.50" },
    { id: "SE004", type: "API Access", user: "api-client", status: "Success", time: "2 hours ago", ip: "172.16.0.10" },
    { id: "SE005", type: "Suspicious Activity", user: "test@test.com", status: "Warning", time: "3 hours ago", ip: "45.67.89.123" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Blocked": return <Shield className="h-4 w-4 text-red-600" />;
      case "Warning": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success": return "bg-green-100 text-green-800";
      case "Blocked": return "bg-red-100 text-red-800";
      case "Warning": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Center</h1>
          <p className="text-muted-foreground mt-2">Monitor and manage platform security</p>
        </div>

        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                  <p className="text-3xl font-bold text-green-600">95/100</p>
                  <p className="text-sm text-green-600 mt-1">Excellent</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                  <p className="text-3xl font-bold text-blue-600">247</p>
                  <p className="text-sm text-blue-600 mt-1">Currently online</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Failed Logins</p>
                  <p className="text-3xl font-bold text-red-600">12</p>
                  <p className="text-sm text-red-600 mt-1">Last 24 hours</p>
                </div>
                <Lock className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">API Calls</p>
                  <p className="text-3xl font-bold text-purple-600">156K</p>
                  <p className="text-sm text-purple-600 mt-1">Today</p>
                </div>
                <Key className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Policies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Security Policies</CardTitle>
              <CardDescription>Current security configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Mandatory for admin users</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Password Policy</p>
                      <p className="text-sm text-muted-foreground">Strong passwords required</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Session Timeout</p>
                      <p className="text-sm text-muted-foreground">Auto logout after 30 minutes</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">IP Restrictions</p>
                      <p className="text-sm text-muted-foreground">Allow specific IP ranges</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Data Protection</CardTitle>
              <CardDescription>Encryption and backup status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Data Encryption</p>
                      <p className="text-sm text-muted-foreground">AES-256 encryption</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Automated Backups</p>
                      <p className="text-sm text-muted-foreground">Daily at 2:00 AM</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Running</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Access Logs</p>
                      <p className="text-sm text-muted-foreground">90-day retention</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">GDPR Compliance</p>
                      <p className="text-sm text-muted-foreground">Data protection compliance</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Compliant</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Events */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Security Events</CardTitle>
            <CardDescription>Real-time security monitoring and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Button className="mr-2">Export Logs</Button>
              <Button variant="outline">Security Report</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securityEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        {event.type}
                      </div>
                    </TableCell>
                    <TableCell>{event.user}</TableCell>
                    <TableCell className="font-mono text-sm">{event.ip}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(event.status)}
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{event.time}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Investigate
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