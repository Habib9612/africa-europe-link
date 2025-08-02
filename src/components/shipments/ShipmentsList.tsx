import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Package, 
  Calendar, 
  DollarSign, 
  Search, 
  Filter, 
  Eye, 
  Edit,
  Trash2,
  Users,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Shipment {
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
  updated_at: string;
  carrier_id?: string;
  carrier?: {
    full_name: string;
    avatar_url?: string;
  } | null;
}

interface ShipmentsListProps {
  onRefresh?: () => void;
}

export function ShipmentsList({ onRefresh }: ShipmentsListProps) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchShipments();
  }, [user]);

  const fetchShipments = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select(`
          *,
          carrier:profiles!carrier_id (full_name, avatar_url)
        `)
        .eq('shipper_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShipments((data || []) as unknown as Shipment[]);
    } catch (error) {
      console.error('Error fetching shipments:', error);
      toast.error('Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.origin_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.commodity.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'secondary';
      case 'assigned': return 'warning';
      case 'in_transit': return 'accent';
      case 'delivered': return 'success';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'posted': return Clock;
      case 'assigned': return Users;
      case 'in_transit': return Package;
      case 'delivered': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const formatEquipmentType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleEditShipment = (shipment: Shipment) => {
    // TODO: Implement edit functionality
    toast.info('Edit functionality coming soon');
  };

  const handleDeleteShipment = async (shipmentId: string) => {
    if (!confirm('Are you sure you want to delete this shipment?')) return;

    try {
      const { error } = await supabase
        .from('shipments')
        .delete()
        .eq('id', shipmentId)
        .eq('shipper_id', user?.id);

      if (error) throw error;
      
      toast.success('Shipment deleted successfully');
      fetchShipments();
      onRefresh?.();
    } catch (error) {
      console.error('Error deleting shipment:', error);
      toast.error('Failed to delete shipment');
    }
  };

  const handleViewDetails = (shipment: Shipment) => {
    // TODO: Implement detailed view
    toast.info('Detailed view coming soon');
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
      {/* Filters */}
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
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Shipments List */}
      <div className="space-y-4">
        {filteredShipments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No shipments found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? "No shipments match your current filters"
                  : "You haven't posted any shipments yet"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredShipments.map((shipment) => {
            const StatusIcon = getStatusIcon(shipment.status);
            
            return (
              <Card key={shipment.id} className="hover:shadow-elegant transition-smooth">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-primary" />
                        {shipment.origin_city}, {shipment.origin_state} → {shipment.destination_city}, {shipment.destination_state}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-1" />
                          {shipment.commodity}
                        </div>
                        <div>
                          {formatEquipmentType(shipment.equipment_type)}
                        </div>
                        <div>
                          {shipment.weight.toLocaleString()} kg
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(shipment.status) as any} className="flex items-center">
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {shipment.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Pickup Date</div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(shipment.pickup_date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground">Delivery Date</div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(shipment.delivery_date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground">Rate</div>
                      <div className="flex items-center text-primary font-semibold">
                        <DollarSign className="h-4 w-4" />
                        {shipment.rate.toLocaleString()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground">Posted</div>
                      <div>{new Date(shipment.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {shipment.carrier && (
                    <div className="border rounded-lg p-3 bg-accent/10">
                      <div className="text-sm text-muted-foreground mb-1">Assigned Carrier</div>
                      <div className="flex items-center space-x-2">
                        <div className="bg-primary/10 p-2 rounded">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{shipment.carrier.full_name}</div>
                          <div className="text-sm text-muted-foreground">Professional Carrier</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {shipment.special_requirements && (
                    <div className="border-t pt-3">
                      <div className="text-sm text-muted-foreground mb-1">Special Requirements</div>
                      <div className="text-sm">{shipment.special_requirements}</div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      Updated {new Date(shipment.updated_at).toLocaleDateString()}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(shipment)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      {shipment.status === 'posted' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditShipment(shipment)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteShipment(shipment.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}