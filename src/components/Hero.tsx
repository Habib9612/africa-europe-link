import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Truck, Package, MapPin, Zap, Play, Star, Users, Clock } from "lucide-react";

const Hero = () => {
  const stats = [
    { label: "30% Cost Reduction", value: "Average Savings", icon: Star },
    { label: "24% Fuel Savings", value: "Route Optimization", icon: Zap },
    { label: "45% Increased Efficiency", value: "AI Matching", icon: Clock },
    { label: "Real-time Monitoring", value: "GPS Tracking", icon: MapPin },
  ];

  const features = [
    "Predictive Maintenance",
    "Route Optimization", 
    "Real-time Monitoring"
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-hero min-h-screen flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-blue-950/20 opacity-30"></div>
      
      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-white">
            <Badge className="bg-white/10 backdrop-blur-sm border-white/20 text-white mb-8 px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              AI-Powered Logistics Platform
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-[1.1]">
              Connect Shippers{" "}
              <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                with Carriers
              </span>
              <br />
              Instantly
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed max-w-2xl">
              Our AI-powered platform matches shippers with the perfect carriers based on location, 
              vehicle type, and delivery requirements. Reduce waiting time and find the ideal match instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold h-14 shadow-xl">
                <Package className="mr-3 h-5 w-5" />
                I'm a Shipper
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold h-14 backdrop-blur-sm">
                <Truck className="mr-3 h-5 w-5" />
                I'm a Carrier
              </Button>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-white/90">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.label}</div>
                  <div className="text-sm text-white/70">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Enhanced AI Matching Widget */}
          <div className="relative">
            {/* Floating Stats Cards */}
            <div className="absolute -top-8 -left-8 bg-white rounded-2xl p-4 shadow-2xl z-10 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">15,000+</div>
                  <div className="text-sm text-gray-600">Active Carriers</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-4 shadow-2xl z-10 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">50,000+</div>
                  <div className="text-sm text-gray-600">AI Matches/Day</div>
                </div>
              </div>
            </div>

            {/* Main Widget */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">AI-Powered Carrier Matching</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Origin</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input 
                      type="text" 
                      placeholder="Enter pickup city or location"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input 
                      type="text" 
                      placeholder="Enter delivery city or location"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all"
                    />
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 text-lg font-semibold h-14 rounded-xl shadow-lg">
                  Find Carriers
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-blue-900 text-lg">How our matching works</span>
                </div>
                <p className="text-blue-800 mb-4 leading-relaxed">
                  Our AI algorithm analyzes multiple factors to find your perfect carrier match:
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-blue-900">Location proximity</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-blue-900">Vehicle compatibility</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-blue-900">Performance history</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-blue-900">Price optimization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;