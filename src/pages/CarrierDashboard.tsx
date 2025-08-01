import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  TrendingUp, 
  Clock, 
  DollarSign,
  MapPin,
  Truck,
  Star,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Users,
  Brain,
  Zap,
  Target,
  ArrowRight,
  Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Match {
  id: string;
  shipment_id: string;
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
  shipments: {
    origin_city: string;
    origin_state: string;
    destination_city: string;
    destination_state: string;
    commodity: string;
    weight: number;
    rate: number;
    pickup_date: string;
  };
}

const CarrierDashboard = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  const stats = [
    {
      title: "Available Matches",
      value: matches.length.toString(),
      change: "+15%",
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Avg Match Score",
      value: matches.length ? `${Math.round(matches.reduce((acc, m) => acc + m.match_score, 0) / matches.length)}%` : "0%",
      change: "+8%",
      icon: Brain,
      color: "text-purple-600"
    },
    {
      title: "Potential Revenue",
      value: `€${matches.reduce((acc, m) => acc + m.estimated_cost, 0).toLocaleString()}`,
      change: "+22%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Routes",
      value: "8",
      change: "+3%",
      icon: Truck,
      color: "text-orange-600"
    }
  ];

  useEffect(() => {
    fetchMatches();
  }, [user]);

  const fetchMatches = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('load_matches')
        .select(`
          *,
          shipments(origin_city, origin_state, destination_city, destination_state, commodity, weight, rate, pickup_date)
        `)
        .eq('carrier_id', user.id)
        .eq('status', 'pending')
        .order('match_score', { ascending: false })
        .limit(10);

      if (error) throw error;
      setMatches((data || []) as unknown as Match[]);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const viewMatchDetails = async (matchId: string) => {
    try {
      await supabase
        .from('load_matches')
        .update({ status: 'viewed' })
        .eq('id', matchId);
      
      // Refresh matches
      fetchMatches();
      toast.success('Match details viewed');
    } catch (error) {
      console.error('Error updating match status:', error);
    }
  };

  const contactShipper = async (matchId: string) => {
    try {
      await supabase
        .from('load_matches')
        .update({ status: 'contacted' })
        .eq('id', matchId);
      
      // Refresh matches
      fetchMatches();
      toast.success('Shipper contacted successfully');
    } catch (error) {
      console.error('Error contacting shipper:', error);
      toast.error('Failed to contact shipper');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getRecommendationVariant = (recommendation: string) => {
    switch (recommendation) {
      case 'Highly Recommended': return 'success';
      case 'Good Match': return 'warning';
      case 'Consider': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-hero py-12 -mx-6 -mt-6 mb-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Carrier Dashboard
                </h1>
                <p className="text-white/90">
                  Discover AI-matched loads and manage your routes
                </p>
              </div>
              <Button variant="accent" size="lg" onClick={fetchMatches} disabled={loading}>
                <Zap className="h-5 w-5 mr-2" />
                Refresh Matches
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-success flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Matches */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary" />
                AI-Recommended Load Matches
                <Badge variant="accent" className="ml-3 animate-pulse">
                  <Zap className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
              <Button variant="outline" onClick={fetchMatches} disabled={loading}>
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Finding your perfect matches...</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No AI matches available</h3>
                <p className="text-muted-foreground mb-4">
                  Check back later for new load recommendations
                </p>
                <Button variant="premium" onClick={fetchMatches}>
                  <Zap className="h-4 w-4 mr-2" />
                  Search for Matches
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {matches.map((match) => (
                  <Card key={match.id} className="shadow-elegant hover:shadow-glow transition-smooth border border-primary/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-primary p-3 rounded-xl">
                            <Package className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {match.shipments.origin_city} → {match.shipments.destination_city}
                            </h3>
                            <p className="text-muted-foreground">
                              {match.shipments.commodity} • {match.shipments.weight}kg
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant="accent" 
                          className={`text-lg font-bold ${getScoreColor(match.match_score)}`}
                        >
                          {match.match_score}% Match
                        </Badge>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-gradient-card rounded-lg">
                          <MapPin className="h-5 w-5 text-primary mx-auto mb-1" />
                          <div className="text-lg font-bold">{match.distance_km}km</div>
                          <div className="text-xs text-muted-foreground">Distance</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-card rounded-lg">
                          <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                          <div className="text-lg font-bold">{match.estimated_duration_hours}h</div>
                          <div className="text-xs text-muted-foreground">Duration</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-card rounded-lg">
                          <DollarSign className="h-5 w-5 text-primary mx-auto mb-1" />
                          <div className="text-lg font-bold">€{match.estimated_cost}</div>
                          <div className="text-xs text-muted-foreground">Revenue</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-card rounded-lg">
                          <Star className="h-5 w-5 text-primary mx-auto mb-1" />
                          <div className="text-lg font-bold">{Math.round(match.ai_insights.profitability)}%</div>
                          <div className="text-xs text-muted-foreground">Profit Score</div>
                        </div>
                      </div>

                      {/* AI Insights */}
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 flex items-center">
                          <Brain className="h-4 w-4 mr-2" />
                          AI Analysis
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Profitability</span>
                              <span>{Math.round(match.ai_insights.profitability)}%</span>
                            </div>
                            <Progress value={match.ai_insights.profitability} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Efficiency</span>
                              <span>{Math.round(match.ai_insights.efficiency)}%</span>
                            </div>
                            <Progress value={match.ai_insights.efficiency} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Reliability</span>
                              <span>{Math.round(match.ai_insights.reliability)}%</span>
                            </div>
                            <Progress value={match.ai_insights.reliability} className="h-2" />
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant={getRecommendationVariant(match.ai_insights.recommendation) as any}>
                            <Star className="h-3 w-3 mr-1" />
                            {match.ai_insights.recommendation}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Pickup: {new Date(match.shipments.pickup_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewMatchDetails(match.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => contactShipper(match.id)}
                          >
                            Contact Shipper
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CarrierDashboard;