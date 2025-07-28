import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Navigation,
  Phone,
  MessageCircle
} from "lucide-react";

const Tracking = () => {
  const [trackingId, setTrackingId] = useState("");
  
  const trackingData = {
    id: "SH001",
    status: "In Transit",
    progress: 65,
    origin: "Casablanca, Morocco",
    destination: "Madrid, Spain", 
    carrier: "EuroTrans Logistics",
    driver: "Ahmed El Mansouri",
    truck: "Refrigerated 40ft - MA-123-456",
    currentLocation: "Sevilla, Spain",
    estimatedArrival: "2024-01-15 14:30",
    timeline: [
      {
        status: "Order Confirmed",
        location: "Casablanca, Morocco",
        time: "2024-01-13 09:00",
        completed: true
      },
      {
        status: "Pickup Complete",
        location: "Casablanca, Morocco", 
        time: "2024-01-13 11:30",
        completed: true
      },
      {
        status: "Border Crossing",
        location: "Tangier, Morocco",
        time: "2024-01-13 16:45",
        completed: true
      },
      {
        status: "In Transit",
        location: "Sevilla, Spain",
        time: "2024-01-14 10:20",
        completed: true,
        current: true
      },
      {
        status: "Out for Delivery",
        location: "Madrid, Spain",
        time: "2024-01-15 12:00",
        completed: false
      },
      {
        status: "Delivered",
        location: "Madrid, Spain", 
        time: "2024-01-15 14:30",
        completed: false
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Track Your Shipment
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Real-time tracking for all your Europe-Africa logistics
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <Card className="mb-8 shadow-card">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter tracking number..."
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="hero">
                Track Shipment
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Tracking Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Overview */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Shipment {trackingData.id}</CardTitle>
                  <Badge variant="accent">{trackingData.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">From</p>
                    <p className="font-medium flex items-center">
                      <MapPin className="h-4 w-4 text-primary mr-2" />
                      {trackingData.origin}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">To</p>
                    <p className="font-medium flex items-center">
                      <MapPin className="h-4 w-4 text-accent mr-2" />
                      {trackingData.destination}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Location</p>
                    <p className="font-medium flex items-center">
                      <Navigation className="h-4 w-4 text-success mr-2" />
                      {trackingData.currentLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">ETA</p>
                    <p className="font-medium flex items-center">
                      <Clock className="h-4 w-4 text-warning mr-2" />
                      {trackingData.estimatedArrival}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">{trackingData.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${trackingData.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Shipment Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {trackingData.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4 pb-6 last:pb-0">
                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          event.completed 
                            ? event.current 
                              ? 'bg-primary shadow-glow' 
                              : 'bg-success'
                            : 'bg-muted'
                        }`}>
                          {event.completed ? (
                            <CheckCircle className="h-4 w-4 text-white" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                          )}
                        </div>
                        {index < trackingData.timeline.length - 1 && (
                          <div className={`absolute top-8 left-4 w-0.5 h-6 ${
                            event.completed ? 'bg-success' : 'bg-muted'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${event.current ? 'text-primary' : ''}`}>
                            {event.status}
                          </h4>
                          <span className="text-sm text-muted-foreground">{event.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Carrier Info */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Carrier Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Company</p>
                  <p className="font-medium">{trackingData.carrier}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Driver</p>
                  <p className="font-medium">{trackingData.driver}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Vehicle</p>
                  <p className="font-medium flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    {trackingData.truck}
                  </p>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-success/10 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Border Cleared</p>
                    <p className="text-xs text-muted-foreground">Customs clearance completed in Tangier</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-primary/10 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">On Schedule</p>
                    <p className="text-xs text-muted-foreground">Shipment is progressing as planned</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="hero" className="w-full">
                  View Full Map
                </Button>
                <Button variant="outline" className="w-full">
                  Download POD
                </Button>
                <Button variant="outline" className="w-full">
                  Share Tracking
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;