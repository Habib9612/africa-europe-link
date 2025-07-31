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
  Database,
  Lock,
  Smartphone,
  Target,
  TrendingUp,
  Award,
  MapPin,
  Play
} from "lucide-react";

const Index = () => {
  const solutions = [
    {
      icon: Zap,
      title: "AI-Powered Freight Matching",
      description: "Our sophisticated algorithm connects you with the perfect carriers based on location, vehicle type, and delivery requirements. Reduce waiting time and find the ideal match instantly.",
      features: ["Smart carrier selection", "Real-time availability", "Price optimization"]
    },
    {
      icon: BarChart3,
      title: "Predictive Route Optimization",
      description: "Our AI analyzes traffic patterns, weather conditions, and historical data to create optimal routes that reduce fuel consumption and delivery times by up to 30%.",
      features: ["Traffic analysis", "Weather integration", "Historical optimization"]
    },
    {
      icon: Clock,
      title: "Real-time Fleet Monitoring",
      description: "Track your fleet in real-time with our advanced GPS tracking system. Monitor vehicle performance, driver behavior, and delivery status with precision.",
      features: ["Live GPS tracking", "Driver monitoring", "Performance analytics"]
    },
    {
      icon: Database,
      title: "Predictive Analytics",
      description: "Make data-driven decisions with our predictive maintenance alerts, demand forecasting, and performance trends analysis.",
      features: ["Maintenance alerts", "Demand forecasting", "Trend analysis"]
    },
    {
      icon: Shield,
      title: "Predictive Maintenance",
      description: "AI predicts when your vehicles need maintenance before breakdowns occur, reducing downtime and extending fleet lifespan by detecting issues early.",
      features: ["Early detection", "Downtime reduction", "Cost savings"]
    },
    {
      icon: TrendingUp,
      title: "Fuel Efficiency Optimization",
      description: "Reduce fuel costs by up to 30% with our AI-powered solutions that optimize routes, monitor driving behavior, and track fuel consumption.",
      features: ["Route optimization", "Behavior monitoring", "Consumption tracking"]
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Carriers",
      description: "All carriers are thoroughly vetted with insurance verification and performance tracking",
      stats: "100% Verified"
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Track your shipments in real-time across Europe and Africa with live updates",
      stats: "24/7 Monitoring"
    },
    {
      icon: Users,
      title: "Multi-language Support",
      description: "Platform available in Arabic, French, English, and Spanish for seamless communication",
      stats: "4 Languages"
    },
    {
      icon: Globe,
      title: "Cross-border Expertise",
      description: "Specialized in Morocco-Europe logistics with customs and documentation support",
      stats: "25+ Countries"
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Create Your Shipment Request",
      description: "Enter origin, destination, cargo details, and special requirements through our intuitive interface. Set your timeframe and budget preferences.",
      highlight: "Smart Forms"
    },
    {
      number: "2",
      title: "Get Matched with Verified Carriers",
      description: "Our AI algorithm instantly finds and suggests the best carriers based on your requirements, location, and performance history.",
      highlight: "AI Powered"
    },
    {
      number: "3",
      title: "Track Your Shipment in Real-Time",
      description: "Monitor your cargo's journey from pickup to delivery with GPS precision. Receive automated updates at every milestone.",
      highlight: "Live Tracking"
    },
    {
      number: "4",
      title: "Confirm Delivery and Release Payment",
      description: "Verify successful delivery through our app and release payment from escrow to the carrier with one click.",
      highlight: "Secure Payment"
    }
  ];

  const testimonials = [
    {
      name: "Ahmed Benali",
      company: "MoroccanExport Ltd",
      role: "Operations Director",
      rating: 5,
      text: "LogiConnect transformed our shipping operations. We've reduced costs by 30% and improved delivery times significantly. The AI matching is incredible.",
      avatar: "AB"
    },
    {
      name: "Maria Rodriguez",
      company: "EuroDistribution SA", 
      role: "Supply Chain Manager",
      rating: 5,
      text: "The AI matching is incredible. We always find the right carrier for our Europe-Africa routes within minutes. Game changer for our business.",
      avatar: "MR"
    },
    {
      name: "Youssef Alami",
      company: "Atlas Logistics",
      role: "Fleet Manager", 
      rating: 5,
      text: "Real-time tracking and predictive maintenance have revolutionized our fleet management. Downtime reduced by 40% since implementing LogiConnect.",
      avatar: "YA"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      {/* AI Solutions Section - Professional Dark Blue */}
      <section className="py-24 bg-gradient-dark text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-blue-950/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="bg-white/10 backdrop-blur-sm border-white/20 text-white mb-6 px-4 py-2">
              <Award className="h-4 w-4 mr-2" />
              Industry Leading Technology
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              AI-Powered Logistics Solutions
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Transform your fleet management with advanced technology designed 
              specifically for the logistics industry
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <div key={index} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <solution.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{solution.title}</h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  {solution.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  {solution.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-white/90">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="text-blue-300 hover:text-white p-0 h-auto font-semibold group">
                  Learn more 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose LogiConnect AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform offers innovative solutions to transform your logistics operations
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "AI-Powered Freight Matching",
                description: "Our sophisticated algorithm connects you with the perfect carriers based on location, vehicle type, and delivery requirements. Reduce waiting time and find the ideal match instantly.",
                image: "🎯"
              },
              {
                icon: BarChart3,
                title: "Predictive Route Optimization", 
                description: "Our AI analyzes traffic patterns, weather conditions, and historical data to create optimal routes that reduce fuel consumption and delivery times by up to 30%.",
                image: "📊"
              },
              {
                icon: Shield,
                title: "Predictive Maintenance",
                description: "Our AI predicts when your vehicles need maintenance before breakdowns occur, reducing downtime and extending fleet lifespan by detecting issues early.",
                image: "🛡️"
              },
              {
                icon: Zap,
                title: "Fuel Efficiency Optimization",
                description: "AI-driven insights help reduce fuel costs by 24% through optimized routes, driving behavior monitoring, and intelligent scheduling.",
                image: "⚡"
              },
              {
                icon: Database,
                title: "Fleet Utilization Analytics",
                description: "Maximize your fleet's productivity with AI analytics that identify underutilized vehicles and optimize capacity planning.",
                image: "📈"
              },
              {
                icon: Lock,
                title: "Secure Data Management",
                description: "Our platform ensures all your fleet and shipment data is protected with bank-grade security protocols and compliance standards.",
                image: "🔒"
              }
            ].map((item, index) => (
              <div key={index} className="group bg-gray-50 rounded-3xl p-8 hover:bg-blue-50 transition-all duration-300 border border-gray-100">
                <div className="text-4xl mb-6">{item.image}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{item.description}</p>
                <Button variant="ghost" className="text-blue-600 p-0 h-auto font-semibold group">
                  Learn more <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How LogiConnect Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple process designed for efficiency and transparency
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-16">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
              <button className="px-8 py-4 rounded-xl bg-blue-500 text-white font-semibold text-lg">
                For Shippers
              </button>
              <button className="px-8 py-4 rounded-xl text-gray-600 font-semibold text-lg hover:bg-gray-100">
                For Carriers
              </button>
            </div>
          </div>

          {/* Steps */}
          <div className="grid lg:grid-cols-2 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 group">
                <div className="flex-shrink-0 relative">
                  <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl">
                    {step.number}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {step.highlight}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">{step.description}</p>
                  <Button variant="ghost" className="text-blue-600 p-0 h-auto font-semibold group">
                    {step.number === "4" ? "Complete" : "Next Step"} 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="bg-blue-100 text-blue-700 mb-6 px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Trusted Platform
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose LogiConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for Morocco's strategic position connecting Europe and Africa,
              with features designed for cross-continental logistics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 group hover:scale-105">
                <CardContent className="p-8">
                  <div className="bg-blue-100 p-4 rounded-2xl inline-block mb-6 group-hover:bg-blue-200 transition-colors">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{feature.stats}</div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Leading Companies
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers say about their experience
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg text-gray-700 mb-8 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-sm text-blue-600 font-medium">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                Take LogiConnect With You Everywhere
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Manage your shipments on the go with our powerful mobile apps. 
                Available for iOS and Android devices.
              </p>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-lg font-medium text-gray-700">Manage shipments on the go from anywhere</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Globe className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-lg font-medium text-gray-700">Real-time notifications for status updates</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-lg font-medium text-gray-700">Track shipments with live GPS updates</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className="text-lg font-medium text-gray-700">Quick access to all delivery information</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="h-16 px-6 bg-black hover:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                      <div className="w-5 h-5 bg-black rounded-sm"></div>
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-gray-300">Download on the</div>
                      <div className="font-semibold text-white">App Store</div>
                    </div>
                  </div>
                </Button>
                <Button className="h-16 px-6 bg-green-600 hover:bg-green-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                      <Play className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-green-100">Get it on</div>
                      <div className="font-semibold text-white">Google Play</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-12 text-center border border-blue-100">
                <div className="w-32 h-32 bg-blue-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                  <Smartphone className="h-16 w-16 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Scan to download</h3>
                <p className="text-gray-600">
                  Point your camera at the QR code to download our mobile app
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-950/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to Transform Your Logistics Operations?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the digital revolution in Moroccan logistics today and experience 
            the power of AI-driven logistics management.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold h-16"
              onClick={() => window.location.href = '/auth'}
            >
              <Package className="mr-3 h-5 w-5" />
              Sign Up as Shipper
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold h-16 backdrop-blur-sm"
              onClick={() => window.location.href = '/auth'}
            >
              <Truck className="mr-3 h-5 w-5" />
              Sign Up as Carrier
            </Button>
          </div>
          <Button variant="ghost" className="text-white/80 hover:text-white">
            Learn more about our enterprise solutions <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Truck className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold">LogiConnect</span>
              </div>
              <p className="text-gray-300 mb-8 max-w-md leading-relaxed text-lg">
                Revolutionizing Morocco's logistics industry with our AI-powered 
                digital freight marketplace. Connecting shippers with carriers 
                through cutting-edge technology.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"></div>
                <div className="w-10 h-10 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"></div>
                <div className="w-10 h-10 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"></div>
                <div className="w-10 h-10 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"></div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-lg">PLATFORM</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="hover:text-white cursor-pointer">Features</li>
                <li className="hover:text-white cursor-pointer">Pricing</li>
                <li className="hover:text-white cursor-pointer">Enterprise</li>
                <li className="hover:text-white cursor-pointer">Integrations</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-lg">RESOURCES</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="hover:text-white cursor-pointer">Blog</li>
                <li className="hover:text-white cursor-pointer">Case Studies</li>
                <li className="hover:text-white cursor-pointer">Help Center</li>
                <li className="hover:text-white cursor-pointer">API Documentation</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-lg">COMPANY</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="hover:text-white cursor-pointer">About Us</li>
                <li className="hover:text-white cursor-pointer">Careers</li>
                <li className="hover:text-white cursor-pointer">Press</li>
                <li className="hover:text-white cursor-pointer">Contact</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-16 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-lg">
                © 2025 LogiConnect, Inc. All rights reserved.
              </p>
              <div className="flex gap-8 text-gray-400">
                <span className="hover:text-white cursor-pointer">Terms</span>
                <span className="hover:text-white cursor-pointer">Privacy</span>
                <span className="hover:text-white cursor-pointer">Cookies</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;