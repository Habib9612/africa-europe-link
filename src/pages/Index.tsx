import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
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
  Smartphone
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

  const solutions = [
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description: "Our advanced algorithm connects shippers with the perfect carriers based on location, vehicle type, and delivery requirements."
    },
    {
      icon: BarChart3,
      title: "Route Optimization",
      description: "AI-optimized routes reduce fuel consumption and delivery times by analyzing traffic, weather, and historical data."
    },
    {
      icon: Clock,
      title: "Real-time Monitoring",
      description: "Track your fleet in real-time with our advanced GPS tracking system. Monitor vehicle performance and delivery status."
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
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      
      {/* Solutions Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              AI-Powered Logistics Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your fleet management with advanced technology
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <solution.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{solution.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{solution.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 mb-6 px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Trusted Platform
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose LogiConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for Morocco's strategic position connecting Europe and Africa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="bg-blue-100 p-4 rounded-xl inline-block mb-6">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Trusted by Leading Companies
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers say about their experience
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg text-gray-700 mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Logistics?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of shippers and carriers already using LogiConnect 
            to optimize their Europe-Africa transportation operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
              onClick={() => window.location.href = '/auth'}
            >
              <Package className="mr-2 h-5 w-5" />
              I Need to Ship
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
              onClick={() => window.location.href = '/auth'}
            >
              <Truck className="mr-2 h-5 w-5" />
              I Have Trucks
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">LogiConnect</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Revolutionizing Morocco's logistics industry with our AI-powered 
                digital freight marketplace.
              </p>
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
              <h3 className="font-semibold mb-4">COMPANY</h3>
              <ul className="space-y-3 text-gray-300">
                <li>About Us</li>
                <li>Contact</li>
                <li>Support</li>
                <li>Privacy</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8">
            <p className="text-gray-400 text-center">
              © 2025 LogiConnect, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;