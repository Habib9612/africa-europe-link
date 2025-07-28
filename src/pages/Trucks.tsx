import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Truck, 
  MapPin, 
  Star, 
  Clock, 
  Shield,
  Search,
  Filter,
  Phone,
  MessageCircle
} from "lucide-react";

const Trucks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const trucks = [
    {
      id: 1,
      company: "TransEuro Logistics",
      driver: "Ahmed El Mansouri",
      rating: 4.9,
      truckType: "Refrigerated 40ft",
      currentLocation: "Casablanca, Morocco",
      availableRoutes: ["Spain", "France", "Portugal"],
      price: "€2.50/km",
      insurance: "Full Coverage",
      experience: "8 years",
      languages: ["Arabic", "French", "Spanish"],
      verified: true,
      available: true,
      responseTime: "< 30 min"
    },
    {
      id: 2, 
      company: "Atlas Freight",
      driver: "Hassan Ouali",
      rating: 4.7,
      truckType: "Container 20ft",
      currentLocation: "Tangier, Morocco",
      availableRoutes: ["Spain", "Italy"],
      price: "€2.20/km",
      insurance: "Third Party Plus",
      experience: "12 years",
      languages: ["Arabic", "French", "English"],
      verified: true,
      available: true,
      responseTime: "< 1 hour"
    },
    {
      id: 3,
      company: "MedShip Express",
      driver: "Fatima Benali",
      rating: 4.8,
      truckType: "Flatbed 30ft",
      currentLocation: "Rabat, Morocco", 
      availableRoutes: ["France", "Germany", "Netherlands"],
      price: "€2.75/km",
      insurance: "Premium Coverage",
      experience: "6 years",
      languages: ["Arabic", "French", "English", "German"],
      verified: true,
      available: false,
      responseTime: "< 45 min"
    },
    {
      id: 4,
      company: "Sahara Transport Co",
      driver: "Mohamed Brahim",
      rating: 4.6,
      truckType: "Tanker 25ft",
      currentLocation: "Agadir, Morocco",
      availableRoutes: ["Spain", "France"],
      price: "€3.10/km",
      insurance: "Specialized Coverage",
      experience: "15 years",
      languages: ["Arabic", "French", "Spanish"],
      verified: true,
      available: true,
      responseTime: "< 20 min"
    }
  ];

  const locations = [
    "Casablanca",
    "Rabat", 
    "Tangier",
    "Marrakech",
    "Agadir",
    "All Locations"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Available Trucks
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Connect with verified carriers across Morocco for Europe-Africa logistics
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <Card className="mb-8 shadow-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search carriers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Truck Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="container">Container</SelectItem>
                  <SelectItem value="flatbed">Flatbed</SelectItem>
                  <SelectItem value="refrigerated">Refrigerated</SelectItem>
                  <SelectItem value="tanker">Tanker</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="accent" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trucks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trucks.map((truck) => (
            <Card key={truck.id} className="shadow-card hover:shadow-elegant transition-smooth">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <Truck className="h-5 w-5 text-primary mr-2" />
                    {truck.company}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {truck.verified && (
                      <Badge variant="success">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {truck.available ? (
                      <Badge variant="success">Available</Badge>
                    ) : (
                      <Badge variant="secondary">Busy</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                    {truck.rating} • {truck.experience} experience
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {truck.responseTime}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Driver</p>
                    <p className="font-medium">{truck.driver}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Truck Type</p>
                    <p className="font-medium">{truck.truckType}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">{truck.currentLocation}</span>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Available Routes</p>
                  <div className="flex flex-wrap gap-1">
                    {truck.availableRoutes.map((route, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {route}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Languages</p>
                  <div className="flex flex-wrap gap-1">
                    {truck.languages.map((lang, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">{truck.price}</p>
                    <p className="text-xs text-muted-foreground">{truck.insurance}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                    <Button variant="hero" size="sm" disabled={!truck.available}>
                      <Phone className="h-4 w-4 mr-1" />
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Carriers
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Trucks;