import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Package, 
  Clock, 
  DollarSign, 
  Filter,
  Search,
  Star,
  Truck
} from "lucide-react";

const Loads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");

  const loads = [
    {
      id: 1,
      title: "Electronics Shipment",
      from: "Casablanca, Morocco",
      to: "Madrid, Spain", 
      weight: "15 tons",
      type: "Container 40ft",
      price: "€2,800",
      urgent: true,
      postedTime: "2 hours ago",
      company: "TechDistrib SA",
      rating: 4.8,
      requirements: ["Refrigerated", "Insurance Required"]
    },
    {
      id: 2,
      title: "Auto Parts Export",
      from: "Tangier, Morocco",
      to: "Barcelona, Spain",
      weight: "8 tons", 
      type: "Flatbed 20ft",
      price: "€1,650",
      urgent: false,
      postedTime: "4 hours ago",
      company: "AutoParts Europe",
      rating: 4.6,
      requirements: ["Secure Loading", "Express Delivery"]
    },
    {
      id: 3,
      title: "Textile Goods",
      from: "Rabat, Morocco", 
      to: "Lyon, France",
      weight: "12 tons",
      type: "Container 30ft",
      price: "€2,200",
      urgent: false,
      postedTime: "6 hours ago",
      company: "MedFashion Ltd",
      rating: 4.9,
      requirements: ["Climate Controlled"]
    },
    {
      id: 4,
      title: "Food Products",
      from: "Agadir, Morocco",
      to: "Hamburg, Germany",
      weight: "20 tons",
      type: "Refrigerated 40ft", 
      price: "€3,400",
      urgent: true,
      postedTime: "1 hour ago",
      company: "Fresh Export Co",
      rating: 4.7,
      requirements: ["Temperature Controlled", "HACCP Certified"]
    }
  ];

  const routes = [
    "Morocco → Spain",
    "Morocco → France", 
    "Morocco → Germany",
    "Morocco → Italy",
    "All Routes"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Available Loads
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Find profitable loads connecting Europe and Africa through Morocco
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
                  placeholder="Search loads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route} value={route}>
                      {route}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Load Type" />
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

        {/* Loads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loads.map((load) => (
            <Card key={load.id} className="shadow-card hover:shadow-elegant transition-smooth">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{load.title}</CardTitle>
                  {load.urgent && (
                    <Badge variant="warning">
                      Urgent
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                    {load.rating}
                  </div>
                  <span>{load.company}</span>
                  <span>{load.postedTime}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">{load.from}</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">{load.price}</div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="text-sm">{load.to}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{load.weight}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>{load.type}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {load.requirements.map((req, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button variant="hero" className="flex-1">
                    <Truck className="h-4 w-4 mr-2" />
                    Bid on Load
                  </Button>
                  <Button variant="outline">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Shipments
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Loads;