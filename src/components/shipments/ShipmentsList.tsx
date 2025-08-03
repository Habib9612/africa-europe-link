import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Truck,
  Clock,
  Eye,
  MessageSquare,
  Users,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { BidForm } from '@/components/bidding/BidForm';
import { BidsList } from '@/components/bidding/BidsList';
import { TrackingMap } from '@/components/tracking/TrackingMap';
import { ShipmentService, Shipment } from '@/lib/services/shipmentService';



interface ShipmentsListProps {
  onRefresh?: () => void;
  showMyShipments?: boolean;
}

export function ShipmentsList({ onRefresh, showMyShipments = false }: ShipmentsListProps) {
  const { user, profile } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [showBidsList, setShowBidsList] = useState(false);
  const [showTracking, setShowTracking] = useState(false);

  useEffect(() => {
    fetchShipments();
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('shipments')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'shipments' },
        () => {
          fetchShipments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [showMyShipments]);

  const fetchShipments = async () => {
    try {
      let data: any[] = [];
      
      if (showMyShipments) {
        // Show user's own shipments
        if (profile?.role === 'shipper') {
          const { data: shipments, error } = await supabase
            .from('shipments')
            .select('*')
            .eq('shipper_id', user?.id)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          data = shipments || [];
        } else if (profile?.role === 'carrier') {
          const { data: shipments, error } = await supabase
            .from('shipments')
            .select('*')
            .eq('carrier_id', user?.id)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          data = shipments || [];
        }
      } else {
        // Show available shipments for carriers
        const { data: shipments, error } = await supabase
          .from('shipments')
          .select('*')
          .eq('status', 'posted')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        data = shipments || [];
      }

      // Transform data to match Shipment interface
      const transformedData = data.map(item => ({
        ...item,
        bid_count: item.bid_count || 0,
        tracking_status: item.tracking_status || 'pending',
        payment_status: item.payment_status || 'pending'
      }));

      setShipments(transformedData);
    } catch (error: any) {
      console.error('Error fetching shipments:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load shipments",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async () => {
    setShowBidForm(false);
    setSelectedShipment(null);
    toast({
      title: "Success",
      description: "Bid submitted successfully!",
    });
    onRefresh?.();
  };

  const handleBidAction = () => {
    setShowBidsList(false);
    setSelectedShipment(null);
    fetchShipments();
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      posted: 'default',
      assigned: 'default',
      picked_up: 'default',
      in_transit: 'default',
      delivered: 'default',
      cancelled: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getEquipmentTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'dry_van': 'Dry Van',
      'refrigerated': 'Refrigerated',
      'flatbed': 'Flatbed',
      'step_deck': 'Step Deck',
      'lowboy': 'Lowboy',
      'tanker': 'Tanker'
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (shipments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {showMyShipments ? 'No Shipments Yet' : 'No Available Shipments'}
          </h3>
          <p className="text-muted-foreground">
            {showMyShipments 
              ? 'Create your first shipment to get started.'
              : 'Check back later for new shipment opportunities.'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shipments Grid */}
      <div className="grid gap-6">
        {shipments.map((shipment) => (
          <Card key={shipment.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {shipment.commodity} - {getEquipmentTypeLabel(shipment.equipment_type)}
                    </h3>
                    {getStatusBadge(shipment.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{shipment.origin_city}, {shipment.origin_state}</p>
                        <p className="text-muted-foreground">Origin</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{shipment.destination_city}, {shipment.destination_state}</p>
                        <p className="text-muted-foreground">Destination</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{formatDate(shipment.pickup_date)}</p>
                        <p className="text-muted-foreground">Pickup</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{formatCurrency(shipment.rate)}</p>
                        <p className="text-muted-foreground">Rate</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      <span>{shipment.weight} kg</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{shipment.shipper.full_name}</span>
                    </div>
                    {shipment.bid_count > 0 && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{shipment.bid_count} bids</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  {profile?.role === 'carrier' && shipment.status === 'posted' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedShipment(shipment);
                        setShowBidForm(true);
                      }}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Bid Now
                    </Button>
                  )}
                  
                  {profile?.role === 'shipper' && shipment.bid_count > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedShipment(shipment);
                        setShowBidsList(true);
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View Bids ({shipment.bid_count})
                    </Button>
                  )}
                  
                  {shipment.status !== 'posted' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedShipment(shipment);
                        setShowTracking(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Track
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bid Form Modal */}
      {showBidForm && selectedShipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <BidForm
              shipmentId={selectedShipment.id}
              currentRate={selectedShipment.rate}
              onSuccess={handleBidSubmit}
              onCancel={() => {
                setShowBidForm(false);
                setSelectedShipment(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Bids List Modal */}
      {showBidsList && selectedShipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <BidsList
              shipmentId={selectedShipment.id}
              onBidAction={handleBidAction}
            />
            <Button
              className="mt-4"
              onClick={() => {
                setShowBidsList(false);
                setSelectedShipment(null);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {showTracking && selectedShipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <TrackingMap shipmentId={selectedShipment.id} />
            <Button
              className="mt-4"
              onClick={() => {
                setShowTracking(false);
                setSelectedShipment(null);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}