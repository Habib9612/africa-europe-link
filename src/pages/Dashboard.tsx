import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Package, Truck, Target, Activity } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {profile?.full_name || 'User'}!
          </h1>
          <p className="text-muted-foreground mt-2">
            {profile?.role === 'carrier' && "Manage your deliveries and find new opportunities"}
            {profile?.role === 'company' && "Monitor your fleet and optimize operations"}
            {(profile?.role === 'individual' || profile?.role === 'shipper') && "Track your shipments and find reliable carriers"}
          </p>
          <Badge variant="outline" className="mt-4">
            {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)} Account
          </Badge>
        </div>

        <Card className="shadow-card bg-gradient-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-6 w-6 mr-2 text-primary" />
              AI-Powered Matching
            </CardTitle>
            <CardDescription>
              {profile?.role === 'carrier' ? 'Find optimal loads for your routes' : 'Find the perfect carrier for your shipment'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">94%</div>
                <div className="text-sm text-muted-foreground">Match Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">2.4m</div>
                <div className="text-sm text-muted-foreground">Avg. Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">847</div>
                <div className="text-sm text-muted-foreground">Available Options</div>
              </div>
            </div>
            <Button className="w-full" size="lg">
              {profile?.role === 'carrier' ? (
                <>
                  <Target className="mr-2 h-5 w-5" />
                  Find Loads
                </>
              ) : (
                <>
                  <Package className="mr-2 h-5 w-5" />
                  Create Shipment
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: "001", status: "Active", progress: 65 },
                { id: "002", status: "Pending", progress: 15 },
                { id: "003", status: "Completed", progress: 100 }
              ].map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Item {item.id}</span>
                    <Badge variant={item.status === 'Completed' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">15</div>
                  <div className="text-sm text-muted-foreground">Total Items</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">98.5%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}