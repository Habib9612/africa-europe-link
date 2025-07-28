import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Clock, 
  MapPin, 
  TrendingUp, 
  CheckCircle, 
  Star,
  Truck,
  Package
} from "lucide-react";

const AIMatching = () => {
  const features = [
    {
      icon: Brain,
      title: "Smart Algorithm",
      description: "Advanced AI analyzes route efficiency, carrier history, and real-time demand"
    },
    {
      icon: Clock,
      title: "Instant Matching",
      description: "Get matched with optimal carriers within seconds of posting your load"
    },
    {
      icon: TrendingUp,
      title: "Price Optimization",
      description: "AI-driven pricing ensures competitive rates for both shippers and carriers"
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance", 
      description: "Verified carriers with performance ratings and insurance validation"
    }
  ];

  const matches = [
    {
      id: 1,
      route: "Casablanca → Madrid",
      truck: "Refrigerated 40ft",
      carrier: "EuroTrans Logistics",
      rating: 4.8,
      price: "€2,450",
      match: 95,
      eta: "24 hours"
    },
    {
      id: 2,
      route: "Tangier → Barcelona", 
      truck: "Standard 20ft",
      carrier: "MediterranShip",
      rating: 4.6,
      price: "€1,680",
      match: 92,
      eta: "18 hours"
    },
    {
      id: 3,
      route: "Rabat → Lyon",
      truck: "Flatbed 30ft",
      carrier: "AtlasFreight Pro",
      rating: 4.9,
      price: "€2,100",
      match: 89,
      eta: "28 hours"
    }
  ];

  return (
    <section className="py-24 bg-gradient-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Brain className="h-4 w-4 mr-2" />
            AI-Powered Matching
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Intelligent Carrier-Shipper Matching
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI engine analyzes thousands of variables to find the perfect match for your logistics needs,
            optimizing for cost, speed, and reliability.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Features */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-8">How AI Matching Works</h3>
            {features.map((feature, index) => (
              <Card key={index} className="border-l-4 border-l-primary shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Live Matches Demo */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Live Matches</h3>
              <Badge variant="success" className="animate-pulse">
                <div className="w-2 h-2 bg-success-foreground rounded-full mr-2" />
                Live
              </Badge>
            </div>
            
            {matches.map((match) => (
              <Card key={match.id} className="shadow-card hover:shadow-elegant transition-smooth">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <MapPin className="h-5 w-5 text-primary mr-2" />
                      {match.route}
                    </CardTitle>
                    <Badge variant="accent" className="font-semibold">
                      {match.match}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{match.truck}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{match.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{match.carrier}</span>
                      <span className="text-lg font-bold text-primary">{match.price}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        ETA: {match.eta}
                      </div>
                      <Button variant="premium" size="sm">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIMatching;