import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, MapPin, Star, Truck, Package, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Match {
  id: string;
  score: number;
  type: 'load' | 'carrier';
  data: {
    origin: string;
    destination: string;
    rate: number;
    equipment: string;
    distance: number;
    compatibility: string[];
  };
  aiInsights: {
    profitability: number;
    efficiency: number;
    reliability: number;
    recommendation: string;
  };
}

export function AIMatchingEngine() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { profile } = useAuth();

  const generateMatches = () => {
    setLoading(true);
    setAnalysisComplete(false);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockMatches: Match[] = [
        {
          id: '1',
          score: 94,
          type: profile?.role === 'carrier' ? 'load' : 'carrier',
          data: {
            origin: 'Chicago, IL',
            destination: 'Atlanta, GA',
            rate: 2850,
            equipment: 'Dry Van',
            distance: 715,
            compatibility: ['Route Optimization', 'Equipment Match', 'Timeline Fit']
          },
          aiInsights: {
            profitability: 89,
            efficiency: 92,
            reliability: 96,
            recommendation: 'Excellent match with high profit potential and optimal route efficiency.'
          }
        },
        {
          id: '2',
          score: 87,
          type: profile?.role === 'carrier' ? 'load' : 'carrier',
          data: {
            origin: 'Dallas, TX',
            destination: 'Miami, FL',
            rate: 3200,
            equipment: 'Refrigerated',
            distance: 1285,
            compatibility: ['Equipment Specialization', 'Premium Rate']
          },
          aiInsights: {
            profitability: 91,
            efficiency: 78,
            reliability: 93,
            recommendation: 'High-value specialized freight with premium pricing.'
          }
        },
        {
          id: '3',
          score: 82,
          type: profile?.role === 'carrier' ? 'load' : 'carrier',
          data: {
            origin: 'Phoenix, AZ',
            destination: 'Seattle, WA',
            rate: 2750,
            equipment: 'Flatbed',
            distance: 1420,
            compatibility: ['Backhaul Optimization', 'Network Coverage']
          },
          aiInsights: {
            profitability: 76,
            efficiency: 85,
            reliability: 88,
            recommendation: 'Good backhaul opportunity to optimize return trips.'
          }
        }
      ];
      
      setMatches(mockMatches);
      setLoading(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getInsightColor = (value: number) => {
    if (value >= 90) return 'bg-green-500';
    if (value >= 80) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-6 w-6 mr-2 text-primary" />
            AI-Powered Matching Engine
          </CardTitle>
          <CardDescription>
            Advanced algorithms analyze thousands of factors to find your optimal matches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">94%</div>
              <div className="text-sm text-muted-foreground">Match Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">2.4s</div>
              <div className="text-sm text-muted-foreground">Avg. Analysis Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">847</div>
              <div className="text-sm text-muted-foreground">Available Options</div>
            </div>
          </div>
          
          <Button 
            onClick={generateMatches} 
            disabled={loading} 
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Brain className="mr-2 h-5 w-5 animate-pulse" />
                Analyzing Opportunities...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-5 w-5" />
                Find AI Matches
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Analyzing market data...</span>
                <span className="text-sm text-muted-foreground">33%</span>
              </div>
              <Progress value={33} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing route optimization...</span>
                <span className="text-sm text-muted-foreground">67%</span>
              </div>
              <Progress value={67} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Calculating compatibility scores...</span>
                <span className="text-sm text-muted-foreground">100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {analysisComplete && matches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Top AI Matches
          </h3>
          
          {matches.map((match, index) => (
            <Card key={match.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center">
                      <Star className="h-5 w-5 mr-2 text-yellow-500" />
                      Match #{index + 1}
                      <Badge variant="outline" className={`ml-2 ${getScoreColor(match.score)}`}>
                        {match.score}% Match
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {match.data.origin} → {match.data.destination}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {match.type === 'load' ? <Package className="h-3 w-3 mr-1" /> : <Truck className="h-3 w-3 mr-1" />}
                    {match.type.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Rate</div>
                    <div className="font-semibold text-green-600">${match.data.rate.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Equipment</div>
                    <div>{match.data.equipment}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Distance</div>
                    <div>{match.data.distance} miles</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">$/Mile</div>
                    <div className="font-semibold">${(match.data.rate / match.data.distance).toFixed(2)}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Compatibility Factors</h4>
                  <div className="flex flex-wrap gap-2">
                    {match.data.compatibility.map((factor, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 border-t pt-3">
                  <h4 className="text-sm font-medium flex items-center">
                    <Brain className="h-4 w-4 mr-1" />
                    AI Insights
                  </h4>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Profitability</div>
                      <div className="flex items-center">
                        <div className="flex-1 bg-muted rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${getInsightColor(match.aiInsights.profitability)}`}
                            style={{ width: `${match.aiInsights.profitability}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{match.aiInsights.profitability}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground mb-1">Efficiency</div>
                      <div className="flex items-center">
                        <div className="flex-1 bg-muted rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${getInsightColor(match.aiInsights.efficiency)}`}
                            style={{ width: `${match.aiInsights.efficiency}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{match.aiInsights.efficiency}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground mb-1">Reliability</div>
                      <div className="flex items-center">
                        <div className="flex-1 bg-muted rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${getInsightColor(match.aiInsights.reliability)}`}
                            style={{ width: `${match.aiInsights.reliability}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{match.aiInsights.reliability}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm">{match.aiInsights.recommendation}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    Analyzed 2 minutes ago
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">
                      {match.type === 'load' ? 'Book Load' : 'Contact Carrier'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}