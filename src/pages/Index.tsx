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
  ArrowRight,
  BarChart3,
  Zap,
  Database,
  Lock,
  Smartphone
} from "lucide-react";
import shippingPort from "@/assets/shipping-port.jpg";
import warehouseTech from "@/assets/warehouse-tech.jpg";
import digitalLogistics from "@/assets/digital-logistics.jpg";

const Index = () => {
  const solutions = [
    {
      icon: Zap,
      title: "AI-Powered Freight Matching",
      description: "Our sophisticated algorithm connects you with the perfect carriers based on location, vehicle type, and delivery requirements. Reduce waiting time and find the ideal match instantly.",
      image: digitalLogistics
    },
    {
      icon: BarChart3,
      title: "Predictive Route Optimization",
      description: "Our AI analyzes traffic patterns, weather conditions, and historical data to create optimal routes that reduce fuel consumption and delivery times by up to 30%.",
      image: warehouseTech
    },
    {
      icon: Lock,
      title: "Secure Data Management",
      description: "Our platform ensures all your fleet and shipment data is protected with bank-grade security protocols and compliance with international data protection standards.",
      image: shippingPort
    }
  ];

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

  const steps = [
    {
      number: "1",
      title: "Create Your Shipment Request",
      description: "Enter origin, destination, cargo details, and special requirements through our intuitive interface. Set your timeframe and budget preferences.",
    },
    {
      number: "2",
      title: "Get Matched with Verified Carriers",
      description: "Our AI algorithm instantly finds and suggests the best carriers based on your requirements, location, and performance history.",
    },
    {
      number: "3",
      title: "Track Your Shipment in Real-Time",
      description: "Monitor your cargo's journey from pickup to delivery with GPS precision. Receive automated updates at every milestone.",
    },
    {
      number: "4",
      title: "Confirm Delivery and Release Payment",
      description: "Verify successful delivery through our app and release payment from escrow to the carrier with one click.",
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
      
      {/* AI Solutions Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              AI-Powered Logistics Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your fleet management with advanced technology
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="overflow-hidden shadow-card hover:shadow-elegant transition-smooth group">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={solution.image}
                    alt={solution.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-8">
                  <div className="bg-primary/10 p-3 rounded-lg inline-block mb-6">
                    <solution.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{solution.title}</h3>
                  <p className="text-muted-foreground mb-6">{solution.description}</p>
                  <Button variant="ghost" className="text-primary p-0 h-auto font-semibold">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              How LogiConnect Works
            </h2>
            <p className="text-xl text-muted-foreground">
              A simple process designed for efficiency and transparency
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  <Button variant="ghost" className="text-primary p-0 h-auto font-semibold">
                    Next Step <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
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

      {/* Mobile App Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Take LogiConnect With You Everywhere
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Manage your shipments on the go with our powerful mobile apps. 
                Available for iOS and Android devices.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <Smartphone className="h-6 w-6 text-primary" />
                  <span>Manage shipments on the go from anywhere</span>
                </div>
                <div className="flex items-center gap-4">
                  <Globe className="h-6 w-6 text-primary" />
                  <span>Real-time notifications for status updates</span>
                </div>
                <div className="flex items-center gap-4">
                  <Package className="h-6 w-6 text-primary" />
                  <span>Track shipments with live GPS updates</span>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="h-6 w-6 text-primary" />
                  <span>Quick access to all delivery information</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="h-14 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                      <div className="w-5 h-5 bg-white rounded-sm"></div>
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-muted-foreground">Download on the</div>
                      <div className="font-semibold">App Store</div>
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="h-14 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 rounded-md flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-sm"></div>
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-muted-foreground">Get it on</div>
                      <div className="font-semibold">Google Play</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-card rounded-2xl p-8 text-center">
                <div className="w-32 h-32 bg-primary/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Smartphone className="h-16 w-16 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Scan to download<br />
                  Point your camera at the QR code to download our mobile app
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Logistics Operations?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join the digital revolution in Moroccan logistics today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              variant="accent" 
              size="lg" 
              className="text-lg"
              onClick={() => window.location.href = '/auth'}
            >
              Sign Up as Shipper
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
              onClick={() => window.location.href = '/auth'}
            >
              Sign Up as Carrier
            </Button>
          </div>
          <Button variant="ghost" className="text-white">
            Learn more about our enterprise solutions <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">LogiConnect</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Revolutionizing Morocco's logistics industry with our AI-powered 
                digital freight marketplace. Connecting shippers with carriers 
                through cutting-edge technology.
              </p>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">PLATFORM</h3>
              <ul className="space-y-3 text-gray-300">
                <li>Features</li>
                <li>Pricing</li>
                <li>Enterprise</li>
                <li>Integrations</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">RESOURCES</h3>
              <ul className="space-y-3 text-gray-300">
                <li>Blog</li>
                <li>Case Studies</li>
                <li>Help Center</li>
                <li>API Documentation</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">COMPANY</h3>
              <ul className="space-y-3 text-gray-300">
                <li>About Us</li>
                <li>Careers</li>
                <li>Press</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <p className="text-gray-400">
                © 2025 LogiConnect, Inc. All rights reserved.
              </p>
              <div className="flex gap-6 text-gray-400">
                <span>Terms</span>
                <span>Privacy</span>
                <span>Cookies</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
