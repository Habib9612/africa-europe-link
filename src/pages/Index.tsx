import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AIMatching from "@/components/AIMatching";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  Package, 
  Shield, 
  Clock, 
  Users, 
  Globe,
  CheckCircle,
  Star,
  ArrowRight
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Carriers",
      description: "All carriers are thoroughly vetted with insurance verification and performance tracking"
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Track your shipments in real-time across Europe and Africa with live updates"
    },
    {
      icon: Users,
      title: "Multi-language Support",
      description: "Platform available in Arabic, French, English, and Spanish for seamless communication"
    },
    {
      icon: Globe,
      title: "Cross-border Expertise",
      description: "Specialized in Morocco-Europe logistics with customs and documentation support"
    }
  ];

  const testimonials = [
    {
      name: "Ahmed Benali",
      company: "MoroccanExport Ltd",
      rating: 5,
      text: "LogiConnect transformed our shipping operations. We've reduced costs by 30% and improved delivery times significantly."
    },
    {
      name: "Maria Rodriguez",
      company: "EuroDistribution SA", 
      rating: 5,
      text: "The AI matching is incredible. We always find the right carrier for our Europe-Africa routes within minutes."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <AIMatching />
      
      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <CheckCircle className="h-4 w-4 mr-2" />
              Trusted Platform
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Why Choose LogiConnect?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built specifically for Morocco's strategic position connecting Europe and Africa,
              with features designed for cross-continental logistics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-card hover:shadow-elegant transition-smooth">
                <CardContent className="p-8">
                  <div className="bg-primary/10 p-4 rounded-lg inline-block mb-6">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Trusted by Leading Companies
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our customers say about their experience
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-card">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg text-foreground mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Logistics?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of shippers and carriers already using LogiConnect 
            to optimize their Europe-Africa transportation operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg" className="text-lg">
              <Package className="mr-2 h-5 w-5" />
              I Need to Ship
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
              <Truck className="mr-2 h-5 w-5" />
              I Have Trucks
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
