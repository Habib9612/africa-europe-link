import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Truck, Package, MapPin, Zap } from "lucide-react";
import heroImage from "@/assets/hero-logistics.jpg";

const Hero = () => {
  const stats = [
    { label: "Active Carriers", value: "15K+", icon: Truck },
    { label: "Daily Shipments", value: "8K+", icon: Package },
    { label: "Countries Connected", value: "25+", icon: MapPin },
    { label: "AI Matches/Day", value: "50K+", icon: Zap },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Logistics connecting Europe and Africa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Connecting{" "}
            <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
              Europe & Africa
            </span>
            <br />
            Through Smart Logistics
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            AI-powered platform connecting carriers and shippers across Morocco, 
            bridging European and African markets with intelligent matching and 
            real-time tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="lg" className="text-lg">
              Find Trucks Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
              Post Your Load
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center shadow-glow">
                <stat.icon className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-200">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 text-background"
          viewBox="0 0 1440 64"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,37.3C960,32,1056,32,1152,37.3C1248,43,1344,53,1392,58.7L1440,64L1440,64L1392,64C1344,64,1248,64,1152,64C1056,64,960,64,864,64C768,64,672,64,576,64C480,64,384,64,288,64C192,64,96,64,48,64L0,64Z" />
        </svg>
      </div>
    </div>
  );
};

export default Hero;