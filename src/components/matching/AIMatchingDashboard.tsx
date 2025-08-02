import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Star,
  Truck,
  Package,
  ArrowRight,
  Zap,
  Target,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Match {
  id: string;
  carrier_id: string;
  match_score: number;
  distance_km: number;
  estimated_cost: number;
  estimated_duration_hours: number;
  compatibility_factors: {
    distance_score: number;
    capacity_match: number;
    equipment_match: number;
    timing_score: number;
  };
  ai_insights: {
    profitability: number;
    efficiency: number;
    reliability: number;
    recommendation: string;
  };
  status: string;
  profiles: {
    full_name: string;
    role: string;
  };
}

interface Shipment {
  id: string;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  pickup_date: string;
  delivery_date: string;
  weight: number;
  equipment_type: string;
  rate: number;
  commodity: string;
}

const AIMatchingDashboard = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, [user]);

  const fetchShipments = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('shipper_id', user.id)
        .eq('status', 'posted')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShipments(data || []);
      
      if (data && data.length > 0 && !selectedShipment) {
        setSelectedShipment(data[0]);
        fetchExistingMatches(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching shipments:', error);
      toast.error('Failed to fetch shipments');
    }
  };

  const fetchExistingMatches = async (shipmentId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-matching', {
        body: { action: 'get_matches', shipmentId }
      });

      if (error) throw error;
      setMatches(data.matches || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const findMatches = async () => {
    if (!selectedShipment) return;
    
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-matching', {
        body: { action: 'find_matches', shipmentId: selectedShipment.id }
      });

      if (error) throw error;
      
      setMatches(data.matches || []);
      toast.success(`Found ${data.count} potential matches!`);
    } catch (error) {
      console.error('Error finding matches:', error);
      toast.error('Failed to find matches');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getInsightColor = (value: number) => {
    if (value >= 80) return "bg-success";
    if (value >= 60) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4">
          <Brain className="h-4 w-4 mr-2" />
          AI-Powered Matching Engine
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Intelligent Carrier Matching
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Our advanced AI analyzes thousands of variables to find the perfect carriers for your shipments
        </p>
      </div>

      {/* Shipment Selection */}
      {shipments.length === 0 ? (
        <Card className="shadow-card border-2 border-dashed border-primary/20">
          <CardContent className="p-8 text-center">
            <Package className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Shipments Found</h3>
            <p className="text-muted-foreground mb-6">
              You need to create shipments first before using AI matching. Create your first shipment to get started with intelligent carrier recommendations.
            </p>
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/shipper-dashboard'}
              className="bg-primary hover:bg-primary/90"
            >
              <Package className="h-5 w-5 mr-2" />
              Create Your First Shipment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Select Shipment for Matching
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shipments.map((shipment) => (
                <Card 
                  key={shipment.id}
                  className={`cursor-pointer transition-all hover:shadow-elegant ${
                    selectedShipment?.id === shipment.id 
                      ? 'ring-2 ring-primary bg-gradient-card' 
                      : 'hover:scale-105'
                  }`}
                  onClick={() => {
                    setSelectedShipment(shipment);
                    fetchExistingMatches(shipment.id);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{shipment.equipment_type}</Badge>
                      <span className="text-sm font-semibold text-primary">
                        €{shipment.rate}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                        {shipment.origin_city} → {shipment.destination_city}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(shipment.pickup_date).toLocaleDateString()}
                      </div>
                      <div className="text-sm font-medium">{shipment.commodity}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Button */}
      {selectedShipment && shipments.length > 0 && (
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={findMatches}
            disabled={analyzing}
            className="bg-gradient-primary text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300"
          >
            {analyzing ? (
              <>
                <Activity className="h-5 w-5 mr-2 animate-spin" />
                Analyzing Matches...
              </>
            ) : (
              <>
                <Brain className="h-5 w-5 mr-2" />
                Find AI Matches
                <Zap className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Analysis Progress */}
      {analyzing && (
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold mb-2">AI Analysis in Progress</h3>
              <p className="text-muted-foreground mb-4">
                Analyzing carrier locations, capacity, and compatibility factors...
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Scanning available carriers</span>
                <Badge variant="success">Complete</Badge>
              </div>
              <Progress value={100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Calculating route optimization</span>
                <Badge variant="success">Complete</Badge>
              </div>
              <Progress value={100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Processing compatibility scores</span>
                <Badge className="animate-pulse">Processing</Badge>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matches Results */}
      {matches.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">AI Matches Found</h2>
            <Badge variant="success" className="animate-pulse">
              <Target className="h-4 w-4 mr-2" />
              {matches.length} Matches
            </Badge>
          </div>

          <div className="grid gap-6">
            {matches.map((match) => (
              <Card key={match.id} className="shadow-elegant hover:shadow-glow transition-smooth">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Truck className="h-5 w-5 text-primary mr-2" />
                      {match.profiles.full_name}
                    </CardTitle>
                    <Badge 
                      variant="accent" 
                      className={`text-lg font-bold ${getScoreColor(match.match_score)}`}
                    >
                      {match.match_score}% Match
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-card rounded-xl">
                      <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{match.distance_km}km</div>
                      <div className="text-sm text-muted-foreground">Distance</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-card rounded-xl">
                      <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{match.estimated_duration_hours}h</div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-card rounded-xl">
                      <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">€{match.estimated_cost}</div>
                      <div className="text-sm text-muted-foreground">Est. Cost</div>
                    </div>
                  </div>

                  {/* Compatibility Factors */}
                  <div>
                    <h4 className="font-semibold mb-3">Compatibility Analysis</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Distance Score</span>
                          <span className="text-sm font-medium">{Math.round(match.compatibility_factors.distance_score)}%</span>
                        </div>
                        <Progress value={match.compatibility_factors.distance_score} className="h-2" />
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Capacity Match</span>
                          <span className="text-sm font-medium">{Math.round(match.compatibility_factors.capacity_match)}%</span>
                        </div>
                        <Progress value={match.compatibility_factors.capacity_match} className="h-2" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Equipment Match</span>
                          <span className="text-sm font-medium">{Math.round(match.compatibility_factors.equipment_match)}%</span>
                        </div>
                        <Progress value={match.compatibility_factors.equipment_match} className="h-2" />
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Timing Score</span>
                          <span className="text-sm font-medium">{Math.round(match.compatibility_factors.timing_score)}%</span>
                        </div>
                        <Progress value={match.compatibility_factors.timing_score} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div>
                    <h4 className="font-semibold mb-3">AI Insights</h4>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">Profitability</div>
                        <div className="text-lg font-bold">{Math.round(match.ai_insights.profitability)}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">Efficiency</div>
                        <div className="text-lg font-bold">{Math.round(match.ai_insights.efficiency)}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">Reliability</div>
                        <div className="text-lg font-bold">{Math.round(match.ai_insights.reliability)}%</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={match.ai_insights.recommendation === 'Highly Recommended' ? 'success' : 
                                match.ai_insights.recommendation === 'Good Match' ? 'warning' : 'secondary'}
                        className="px-3 py-1"
                      >
                        <Star className="h-4 w-4 mr-1" />
                        {match.ai_insights.recommendation}
                      </Badge>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm" className="bg-success hover:bg-success/90">
                          Contact Carrier
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMatchingDashboard;