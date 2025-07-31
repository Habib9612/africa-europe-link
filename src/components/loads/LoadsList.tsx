import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Package, Calendar, DollarSign, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Load {
  id: string;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  pickup_date: string;
  delivery_date: string;
  weight: number;
  rate: number;
  equipment_type: string;
  commodity: string;
  status: string;
  special_requirements?: string;
  created_at: string;
}

export function LoadsList() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const { user, profile } = useAuth();

  useEffect(() => {
    fetchLoads();
  }, []);

  const fetchLoads = async () => {
    try {
      let query = supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      // If user is a shipper, only show their loads
      if (profile?.role === 'shipper' || profile?.role === 'individual') {
        query = query.eq('shipper_id', user?.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      setLoads(data || []);
    } catch (error) {
      console.error('Error fetching loads:', error);
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: "Failed to fetch loads. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredLoads = loads.filter(load => {
    const matchesSearch = 
      load.origin_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.destination_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.commodity.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || load.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'default';
      case 'in_transit': return 'secondary';
      case 'delivered': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const formatEquipmentType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by city or commodity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="posted">Posted</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredLoads.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No loads found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? "No loads match your current filters"
                  : "No loads available at the moment"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredLoads.map((load) => (
            <Card key={load.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      {load.origin_city}, {load.origin_state} → {load.destination_city}, {load.destination_state}
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <Package className="h-4 w-4 mr-1" />
                      {load.commodity} • {formatEquipmentType(load.equipment_type)}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusColor(load.status)}>
                    {load.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Pickup Date</div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(load.pickup_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-muted-foreground">Delivery Date</div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(load.delivery_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-muted-foreground">Weight</div>
                    <div>{load.weight.toLocaleString()} lbs</div>
                  </div>
                  
                  <div>
                    <div className="text-muted-foreground">Rate</div>
                    <div className="flex items-center text-green-600 font-semibold">
                      <DollarSign className="h-4 w-4" />
                      {load.rate.toLocaleString()}
                    </div>
                  </div>
                </div>

                {load.special_requirements && (
                  <div className="border-t pt-3">
                    <div className="text-sm text-muted-foreground mb-1">Special Requirements</div>
                    <div className="text-sm">{load.special_requirements}</div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Posted {new Date(load.created_at).toLocaleDateString()}
                  </div>
                  
                  {profile?.role === 'carrier' && load.status === 'posted' && (
                    <Button size="sm">
                      Submit Bid
                    </Button>
                  )}
                  
                  {(profile?.role === 'shipper' || profile?.role === 'individual') && (
                    <Button variant="outline" size="sm">
                      Manage Load
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}