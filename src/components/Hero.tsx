import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Truck, Package, MapPin, Zap, Play, Star, Users, Clock, Sparkles, TrendingUp, Shield } from "lucide-react";

const Hero = () => {
  const stats = [
    { label: "Cost Reduction", value: "35%", icon: TrendingUp, color: "from-emerald-400 to-emerald-600" },
    { label: "Fuel Savings", value: "28%", icon: Zap, color: "from-amber-400 to-amber-600" },
    { label: "Efficiency Boost", value: "52%", icon: Star, color: "from-purple-400 to-purple-600" },
    { label: "Active Carriers", value: "15K+", icon: Users, color: "from-cyan-400 to-cyan-600" },
  ];

  const features = [
    { text: "AI-Powered Matching", icon: Sparkles },
    { text: "Real-time Tracking", icon: MapPin },
    { text: "Predictive Analytics", icon: TrendingUp }
  ];

  return (
    <div className="relative min-h-screen bg-hero-premium overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-white animate-slide-up">
            <Badge className="bg-white/10 backdrop-blur-md border border-white/20 text-white mb-8 px-6 py-3 text-sm font-medium hover-glow">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Logistics Revolution
            </Badge>
            
            <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tight">
              Transform{" "}
              <span className="text-gradient-vibrant">
                Logistics
              </span>
              <br />
              with AI Power
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed max-w-2xl font-light">
              LoadHive's AI revolutionizes Moroccan logistics, connecting Europe and Africa 
              through intelligent carrier matching, predictive analytics, and real-time optimization.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <Button className="btn-primary-glow group text-lg h-16 px-10">
                <Package className="mr-3 h-6 w-6 icon-bounce" />
                Start Shipping Now
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button className="btn-accent-glow group text-lg h-16 px-10">
                <Truck className="mr-3 h-6 w-6 icon-bounce" />
                Join as Carrier
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-white/90 bg-white/5 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10 hover-lift">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full mr-3 animate-pulse-glow"></div>
                  <feature.icon className="h-5 w-5 mr-3 text-purple-300" />
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-float hover:shadow-glow transition-all duration-300 group-hover:scale-110`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/70 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Premium AI Widget */}
          <div className="relative animate-slide-up" style={{animationDelay: '0.3s'}}>
            {/* Floating Trust Badges */}
            <div className="absolute -top-6 -left-6 card-floating z-20 p-6 hidden lg:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">100% Verified</div>
                  <div className="text-sm text-gray-600">Trusted Carriers</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 card-floating z-20 p-6 hidden lg:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">85K+ Matches</div>
                  <div className="text-sm text-gray-600">Daily AI Matches</div>
                </div>
              </div>
            </div>

            {/* Main AI Widget */}
            <div className="card-glow p-10 backdrop-blur-md relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-elegant animate-pulse-glow">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">AI Carrier Matching</h3>
                  <p className="text-gray-600">Powered by Advanced Intelligence</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Origin</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 transform -translate-y-1/2 text-purple-400 h-6 w-6" />
                    <input 
                      type="text" 
                      placeholder="Enter pickup location (Casablanca, Morocco)"
                      className="w-full pl-16 pr-6 py-6 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-lg transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium"
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 transform -translate-y-1/2 text-cyan-400 h-6 w-6" />
                    <input 
                      type="text" 
                      placeholder="Enter destination (Paris, France)"
                      className="w-full pl-16 pr-6 py-6 border-2 border-cyan-200 rounded-2xl focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 text-lg transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium"
                    />
                  </div>
                </div>

                <Button className="w-full btn-primary-glow text-xl h-18 font-bold shadow-deep group">
                  <Sparkles className="mr-3 h-6 w-6 icon-bounce" />
                  Find Perfect Match
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>

              <div className="mt-10 p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border-2 border-purple-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-purple-900 text-lg">AI Intelligence at Work</span>
                </div>
                <p className="text-purple-800 mb-6 leading-relaxed font-medium">
                  Our neural network analyzes 50+ variables for perfect carrier matching:
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-purple-900">Route Optimization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-purple-900">Capacity Analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-purple-900">Real-time Tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-purple-900">Cost Prediction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;