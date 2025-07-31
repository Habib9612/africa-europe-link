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
  Play,
  Sparkles,
  Brain,
  Rocket,
  Building2,
  FileCheck,
  Eye,
  DollarSign,
  Activity,
  Timer,
  Layers,
  Bell
} from "lucide-react";

const Index = () => {
  const aiSolutions = [
    {
      icon: Brain,
      title: "Neural Route Optimization",
      description: "Advanced machine learning algorithms analyze traffic patterns, weather data, and historical routes to create optimal delivery paths, reducing fuel consumption by up to 35%.",
      features: ["Real-time traffic analysis", "Weather integration", "Predictive modeling"],
      gradient: "from-purple-500 to-pink-500",
      delay: "0.1s"
    },
    {
      icon: Sparkles,
      title: "Intelligent Carrier Matching",
      description: "Our AI processes 50+ variables including vehicle capacity, driver ratings, route efficiency, and real-time availability to create perfect shipper-carrier matches.",
      features: ["50+ matching variables", "Real-time availability", "Performance analytics"],
      gradient: "from-cyan-500 to-blue-500",
      delay: "0.2s"
    },
    {
      icon: Activity,
      title: "Predictive Fleet Analytics",
      description: "Advanced analytics predict maintenance needs, optimize fleet utilization, and forecast demand patterns to maximize operational efficiency and reduce costs.",
      features: ["Maintenance prediction", "Utilization optimization", "Demand forecasting"],
      gradient: "from-emerald-500 to-teal-500",
      delay: "0.3s"
    },
    {
      icon: Target,
      title: "Dynamic Pricing Engine",
      description: "Real-time pricing optimization based on supply and demand, route complexity, fuel costs, and market conditions to ensure competitive yet profitable rates.",
      features: ["Dynamic pricing", "Market analysis", "Profit optimization"],
      gradient: "from-amber-500 to-orange-500",
      delay: "0.4s"
    },
    {
      icon: Eye,
      title: "Real-time Visibility Platform",
      description: "Complete shipment visibility with GPS tracking, ETA predictions, exception alerts, and automated status updates for all stakeholders.",
      features: ["GPS tracking", "ETA predictions", "Exception alerts"],
      gradient: "from-indigo-500 to-purple-500",
      delay: "0.5s"
    },
    {
      icon: Shield,
      title: "Intelligent Risk Management",
      description: "AI-powered risk assessment analyzes routes, weather conditions, carrier performance, and cargo type to proactively identify and mitigate potential issues.",
      features: ["Risk assessment", "Proactive monitoring", "Issue mitigation"],
      gradient: "from-red-500 to-pink-500",
      delay: "0.6s"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "100% Verified Network",
      description: "Every carrier undergoes rigorous verification including insurance checks, vehicle inspections, and performance monitoring.",
      stats: "15,000+ Verified",
      color: "from-emerald-400 to-emerald-600"
    },
    {
      icon: Clock,
      title: "Real-time Intelligence",
      description: "Advanced tracking and analytics provide complete visibility across your entire logistics network.",
      stats: "24/7 Monitoring",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Globe,
      title: "Cross-border Expertise",
      description: "Specialized in Morocco-Europe trade corridors with automated customs documentation and compliance.",
      stats: "45+ Countries",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Performance Optimization",
      description: "AI-driven insights and recommendations to continuously improve your logistics operations.",
      stats: "35% Cost Reduction",
      color: "from-pink-400 to-pink-600"
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Smart Request Creation",
      description: "Use our intelligent form that auto-suggests optimal routes, vehicle types, and timing based on your cargo requirements and destination.",
      highlight: "AI-Powered",
      icon: FileCheck,
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "02", 
      title: "Instant AI Matching",
      description: "Our neural network analyzes 50+ variables to instantly match you with the perfect carrier based on performance, availability, and route efficiency.",
      highlight: "Neural Network",
      icon: Brain,
      color: "from-cyan-500 to-blue-500"
    },
    {
      number: "03",
      title: "Real-time Orchestration",
      description: "Track every aspect of your shipment with GPS precision, predictive ETAs, automated alerts, and seamless communication channels.",
      highlight: "Live Updates",
      icon: Activity,
      color: "from-emerald-500 to-teal-500"
    },
    {
      number: "04",
      title: "Automated Settlement",
      description: "Smart contracts and automated payment processing ensure instant, secure transactions upon verified delivery confirmation.",
      highlight: "Smart Contracts",
      icon: DollarSign,
      color: "from-amber-500 to-orange-500"
    }
  ];

  const testimonials = [
    {
      name: "Ahmed Benali",
      company: "AtlasCorp International",
      role: "Chief Supply Chain Officer",
      rating: 5,
      text: "LoadHive's AI has revolutionized our Morocco-Europe operations. We've seen 35% cost reduction and 50% faster carrier matching. The predictive analytics are game-changing.",
      avatar: "AB",
      savings: "€2.3M Saved",
      efficiency: "50% Faster"
    },
    {
      name: "Sofia Martinez",
      company: "EuroMed Logistics", 
      role: "Operations Director",
      rating: 5,
      text: "The neural network matching is incredible. What used to take hours now happens in seconds. LoadHive has become essential to our cross-border operations.",
      avatar: "SM",
      savings: "60% Time Saved",
      efficiency: "98% Match Rate"
    },
    {
      name: "Youssef Alami",
      company: "Maghreb Trade Solutions",
      role: "Fleet Manager", 
      rating: 5,
      text: "Real-time visibility and predictive maintenance have transformed our fleet efficiency. Our vehicles are 40% more utilized and downtime has nearly disappeared.",
      avatar: "YA",
      savings: "40% Better Utilization",
      efficiency: "90% Uptime"
    }
  ];

  const trustLogos = [
    { name: "Flexport Partner", logo: "🚀" },
    { name: "EU Certified", logo: "🇪🇺" },
    { name: "ISO 27001", logo: "🔒" },
    { name: "Morocco Tech", logo: "🇲🇦" },
    { name: "AI Verified", logo: "🧠" },
    { name: "Enterprise Ready", logo: "🏢" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      {/* Trust Bar */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Trusted by Industry Leaders</p>
          </div>
          <div className="flex justify-center items-center gap-8 flex-wrap opacity-60">
            {trustLogos.map((logo, index) => (
              <div key={index} className="flex items-center gap-2 text-2xl font-bold text-gray-700 hover:opacity-100 transition-opacity">
                <span className="text-3xl">{logo.logo}</span>
                <span className="text-sm font-semibold">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Solutions - Premium Dark Section */}
      <section className="py-32 bg-gradient-dark text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <Badge className="bg-white/10 backdrop-blur-md border border-white/20 text-white mb-8 px-6 py-3 text-sm font-medium">
              <Award className="h-4 w-4 mr-2" />
              Advanced AI Technology
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-black mb-8 tracking-tight">
              Revolutionary AI{" "}
              <span className="text-gradient-vibrant">Solutions</span>
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Harness the power of artificial intelligence to transform your logistics operations 
              with cutting-edge technology designed for the future of freight.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {aiSolutions.map((solution, index) => (
              <div 
                key={index} 
                className="group card-glow p-8 text-white hover:scale-105 transition-all duration-500 animate-slide-up"
                style={{animationDelay: solution.delay}}
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${solution.gradient} rounded-3xl flex items-center justify-center mb-8 shadow-elegant group-hover:shadow-glow transition-all duration-300 group-hover:scale-110`}>
                  <solution.icon className="h-10 w-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-6">{solution.title}</h3>
                <p className="text-white/90 mb-8 leading-relaxed text-lg">
                  {solution.description}
                </p>
                
                <div className="space-y-4 mb-8">
                  {solution.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-white/80">
                      <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 p-0 h-auto font-semibold group/btn">
                  Explore Technology 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow - Modern White Section */}
      <section className="py-32 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-8 tracking-tight">
              How LoadHive{" "}
              <span className="text-gradient-primary">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of logistics with our streamlined, AI-powered process 
              designed for maximum efficiency and transparency.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {processSteps.map((step, index) => (
              <div 
                key={index} 
                className="flex gap-8 group animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex-shrink-0 relative">
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center shadow-elegant group-hover:shadow-glow transition-all duration-300 group-hover:scale-110`}>
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 bg-white border-2 border-gray-200 text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {step.highlight}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-200 text-gray-600 text-sm font-bold px-4 py-1 rounded-full">
                    {step.number}
                  </div>
                </div>
                
                <div className="flex-1 pt-2">
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">{step.title}</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed text-lg">{step.description}</p>
                  <Button variant="ghost" className="text-purple-600 hover:text-purple-700 p-0 h-auto font-semibold group/btn">
                    Learn More 
                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <Badge className="bg-purple-100 text-purple-700 mb-8 px-6 py-3 text-sm font-medium">
              <CheckCircle className="h-4 w-4 mr-2" />
              Enterprise Grade Platform
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-8 tracking-tight">
              Why LoadHive Leads{" "}
              <span className="text-gradient-accent">Innovation</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Built for Morocco's strategic position as the gateway between Europe and Africa, 
              our platform delivers unmatched performance and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card-floating group text-center p-8 animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-elegant group-hover:shadow-glow transition-all duration-300 group-hover:scale-110`}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                
                <div className="text-4xl font-black text-purple-600 mb-4">{feature.stats}</div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Testimonials */}
      <section className="py-32 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-8 tracking-tight">
              Trusted by{" "}
              <span className="text-gradient-primary">Industry Leaders</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how leading companies transform their logistics operations with LoadHive
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="card-floating bg-white p-10 animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-center mb-8">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-xl text-gray-700 mb-10 italic leading-relaxed font-medium">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-elegant">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                    <p className="text-purple-600 font-semibold">{testimonial.role}</p>
                    <p className="text-gray-600">{testimonial.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{testimonial.savings}</div>
                    <div className="text-sm text-gray-600">Cost Impact</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{testimonial.efficiency}</div>
                    <div className="text-sm text-gray-600">Performance</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App - Premium Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="animate-slide-up">
              <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 mb-8 px-6 py-3 text-sm font-medium border border-purple-200">
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile Excellence
              </Badge>
              
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-8 tracking-tight">
                LoadHive{" "}
                <span className="text-gradient-vibrant">Everywhere</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                Take the power of AI-driven logistics in your pocket. Our award-winning mobile apps 
                deliver enterprise-grade functionality with consumer-level simplicity.
              </p>
              
              <div className="space-y-6 mb-12">
                {[
                  { icon: Smartphone, text: "Manage shipments anywhere, anytime", color: "from-blue-500 to-cyan-500" },
                  { icon: Bell, text: "Real-time AI-powered notifications", color: "from-purple-500 to-pink-500" },
                  { icon: MapPin, text: "Live GPS tracking with ETA predictions", color: "from-emerald-500 to-teal-500" },
                  { icon: BarChart3, text: "Advanced analytics and performance insights", color: "from-amber-500 to-orange-500" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-6 group">
                    <div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center shadow-elegant group-hover:shadow-glow transition-all duration-300 group-hover:scale-110`}>
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-6">
                <Button className="btn-primary-glow h-16 px-8 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-sm"></div>
                    </div>
                    <div className="text-left">
                      <div className="text-xs opacity-90">Download on</div>
                      <div className="font-bold">App Store</div>
                    </div>
                  </div>
                </Button>
                
                <Button className="btn-accent-glow h-16 px-8 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs opacity-90">Get it on</div>
                      <div className="font-bold">Google Play</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="card-glow p-16 text-center backdrop-blur-md">
                <div className="w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-elegant animate-pulse-glow">
                  <Smartphone className="h-20 w-20 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Scan & Download</h3>
                <p className="text-gray-600 text-lg">
                  Point your camera at the QR code to instantly download our premium mobile experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-32 bg-hero-premium relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <h2 className="text-6xl lg:text-7xl font-black text-white mb-10 tracking-tight leading-tight">
              Ready to{" "}
              <span className="text-gradient-vibrant">Revolutionize</span>
              <br />
              Your Logistics?
            </h2>
            <p className="text-2xl text-white/90 mb-16 max-w-4xl mx-auto leading-relaxed">
              Join the AI revolution transforming North African and European logistics. 
              Experience the future of freight management today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-12">
              <Button className="btn-primary-glow text-xl h-20 px-12 group">
                <Package className="mr-4 h-7 w-7 icon-bounce" />
                Start Shipping
                <ArrowRight className="ml-4 h-7 w-7 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button className="btn-outline-glow text-xl h-20 px-12 group">
                <Truck className="mr-4 h-7 w-7 icon-bounce" />
                Join as Carrier
              </Button>
            </div>
            
            <p className="text-white/70 text-lg">
              Free 30-day trial • No setup fees • Enterprise support included
            </p>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-gray-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-elegant">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <span className="text-3xl font-black">LoadHive</span>
              </div>
              <p className="text-gray-300 mb-10 max-w-md leading-relaxed text-lg">
                Revolutionizing logistics across Morocco, Europe, and Africa through 
                cutting-edge AI technology and intelligent automation.
              </p>
              <div className="flex gap-6">
                {['🌐', '📧', '💼', '📱'].map((icon, index) => (
                  <div key={index} className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-2xl flex items-center justify-center transition-colors cursor-pointer text-2xl">
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {[
              {
                title: "PLATFORM",
                links: ["AI Solutions", "Pricing", "Enterprise", "Integrations", "API"]
              },
              {
                title: "RESOURCES", 
                links: ["Documentation", "Case Studies", "Support", "Blog", "Webinars"]
              },
              {
                title: "COMPANY",
                links: ["About", "Careers", "Press", "Contact", "Partners"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-bold mb-8 text-lg tracking-wide">{section.title}</h3>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg cursor-pointer">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 mt-20 pt-10">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <p className="text-gray-400 text-lg">
                © 2025 LoadHive Technologies. All rights reserved.
              </p>
              <div className="flex gap-10 text-gray-400">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link, index) => (
                  <a key={index} href="#" className="hover:text-white transition-colors cursor-pointer">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;