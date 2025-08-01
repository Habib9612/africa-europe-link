import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Package, MapPin, Zap, CheckCircle2 } from "lucide-react";
const Hero = () => {
  const stats = [{
    label: "Trucks",
    value: "1M+",
    icon: Truck
  }, {
    label: "MSME",
    value: "16K+",
    icon: Package
  }, {
    label: "Daily Loads",
    value: "1,200+",
    icon: MapPin
  }, {
    label: "Pincodes Covered",
    value: "10k+",
    icon: Zap
  }];
  return <div className="relative min-h-screen overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/src/assets/hero-logistics.jpg')`
    }} />
      
      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium">Goods gotta go? LoadHive delivers, instantly.</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Ship Smarter.{" "}
              <span className="text-green-400">
                Worry Less.
              </span>
              <br />
              <span className="text-blue-300">Deliver More</span>
            </h1>
            
            
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="bg-green-500 text-white hover:bg-green-600 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300" onClick={() => window.location.href = '/auth'}>
                Contact us
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300" onClick={() => window.location.href = '/auth'}>
                Learn more
              </Button>
            </div>
          </div>

          {/* Right Content - Load Request Widget */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Request a</p>
              <h3 className="text-3xl font-bold text-gray-900">Load now!</h3>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg z-10"></div>
                <input type="text" placeholder="Enter pickup location" className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg transition-all duration-200" />
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg z-10"></div>
                <div className="absolute left-[18px] top-0 w-0.5 h-full bg-gray-300 -translate-x-1/2"></div>
                <input type="text" placeholder="Enter destination" className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg transition-all duration-200" />
              </div>

              <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Request now
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 text-white">
          {stats.map((stat, index) => <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>)}
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl lg:text-4xl font-bold mb-2">200,000+</div>
            <div className="text-sm text-gray-300">App Downloads</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl lg:text-4xl font-bold mb-2">100M+</div>
            <div className="text-sm text-gray-300">Kilometers Driven</div>
          </div>
        </div>
      </div>
    </div>;
};
export default Hero;