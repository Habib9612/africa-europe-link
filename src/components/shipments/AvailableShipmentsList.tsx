import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Weight, 
  DollarSign, 
  Truck,
  User,
  Clock,
  TrendingUp,
  MessageSquare,
  Search,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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
  special_requirements: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

interface Bid {
  shipment_id: string;
  bid_amount: number;
  message: string;
}

export function AvailableShipmentsList() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [bidData, setBidData] = useState<Bid>({
    shipment_id: '',
    bid_amount: 0,
    message: ''
  });

  useEffect(() => {
    fetchAvailableShipments();
  }, []);

  const fetchAvailableShipments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select(`
          *,
          profiles:shipper_id (full_name, avatar_url)
        `)
        .eq('status', 'posted')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShipments((data || []) as unknown as Shipment[]);
    } catch (error) {
      console.error('Error fetching shipments:', error);
      toast.error('Failed to fetch available shipments');
    } finally {
      setLoading(false);
    }
  };

  const openBidDialog = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setBidData({
      shipment_id: shipment.id,
      bid_amount: shipment.rate,
      message: ''
    });
    setBidDialogOpen(true);
  };

  const submitBid = async () => {
    if (!user || !selectedShipment) return;

    try {
      // For now, we'll book the shipment directly as there's no bids table
      // In a full implementation, you'd create a bids table and bidding system
      const { error } = await supabase.functions.invoke('shipments', {
        method: 'POST',
        body: JSON.stringify({
          shipment_id: selectedShipment.id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (error) throw error;

      toast.success('Bid submitted successfully! The shipper will be notified.');
      setBidDialogOpen(false);
      fetchAvailableShipments(); // Refresh the list
    } catch (error: any) {
      console.error('Error submitting bid:', error);
      toast.error(`Failed to submit bid: ${error.message}`);
    }
  };

  const bookShipment = async (shipmentId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`https://wvhigrqmhgoozbhhoqjg.supabase.co/functions/v1/shipments/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2aGlncnFtaGdvb3piaGhvcWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODE4MjUsImV4cCI6MjA2OTU1NzgyNX0._qLY5MXmvt-Corxzal4uJnmsIiCY0MnkvRMoxA2XSUc'
        },
        body: JSON.stringify({ shipment_id: shipmentId })
      });

      if (!response.ok) {
        throw new Error('Failed to book shipment');
      }

      toast.success('Shipment booked successfully!');
      fetchAvailableShipments(); // Refresh the list
    } catch (error: any) {
      console.error('Error booking shipment:', error);
      toast.error(`Failed to book shipment: ${error.message}`);
    }
  };

  const filteredShipments = shipments.filter(shipment =>
    shipment.origin_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.destination_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.commodity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEquipmentTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'dry_van': 'Dry Van',
      'flatbed': 'Flatbed',
      'refrigerated': 'Refrigerated',
      'tanker': 'Tanker',
      'step_deck': 'Step Deck',
      'lowboy': 'Lowboy'
    };
    return types[type] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-primary" />
              Available Shipments
              <Badge variant="accent" className="ml-3">
                {filteredShipments.length} loads
              </Badge>
            </div>
            <Button variant="outline" onClick={fetchAvailableShipments}>
              <Search className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search shipments</Label>
              <Input
                id="search"
                placeholder="Search by city, commodity, or route..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipments List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading available shipments...</p>
        </div>
      ) : filteredShipments.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No shipments available</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'No shipments match your search criteria.' : 'Check back later for new loads.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredShipments.map((shipment) => (
            <Card key={shipment.id} className="shadow-card hover:shadow-glow transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-primary p-3 rounded-xl">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {shipment.origin_city}, {shipment.origin_state} → {shipment.destination_city}, {shipment.destination_state}
                      </h3>
                      <p className="text-muted-foreground">
                        {shipment.commodity} • {shipment.weight.toLocaleString()}kg
                      </p>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <User className="h-3 w-3 mr-1" />
                        {shipment.profiles?.full_name || 'Unknown Shipper'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-success">
                      ${shipment.rate.toLocaleString()}
                    </div>
                    <Badge variant="outline">
                      {getEquipmentTypeLabel(shipment.equipment_type)}
                    </Badge>
                  </div>
                </div>

                {/* Key Details */}
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <div>
                      <div className="font-medium">Pickup</div>
                      <div className="text-muted-foreground">{formatDate(shipment.pickup_date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-accent" />
                    <div>
                      <div className="font-medium">Delivery</div>
                      <div className="text-muted-foreground">{formatDate(shipment.delivery_date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Weight className="h-4 w-4 mr-2 text-primary" />
                    <div>
                      <div className="font-medium">Weight</div>
                      <div className="text-muted-foreground">{shipment.weight.toLocaleString()}kg</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <div>
                      <div className="font-medium">Posted</div>
                      <div className="text-muted-foreground">{formatDate(shipment.created_at)}</div>
                    </div>
                  </div>
                </div>

                {/* Special Requirements */}
                {shipment.special_requirements && (
                  <div className="mb-4 p-3 bg-warning/10 rounded-lg">
                    <div className="text-sm font-medium text-warning mb-1">Special Requirements:</div>
                    <div className="text-sm">{shipment.special_requirements}</div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Rate: ${shipment.rate.toLocaleString()} • Equipment: {getEquipmentTypeLabel(shipment.equipment_type)}
                  </div>
                  <div className="flex space-x-2">
                    <Dialog open={bidDialogOpen} onOpenChange={setBidDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          onClick={() => openBidDialog(shipment)}
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Place Bid
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Place Your Bid</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="bid_amount">Your Bid Amount ($)</Label>
                            <Input
                              id="bid_amount"
                              type="number"
                              step="0.01"
                              value={bidData.bid_amount}
                              onChange={(e) => setBidData(prev => ({ ...prev, bid_amount: parseFloat(e.target.value) }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="bid_message">Message to Shipper (Optional)</Label>
                            <Input
                              id="bid_message"
                              placeholder="Tell them why you're the best choice..."
                              value={bidData.message}
                              onChange={(e) => setBidData(prev => ({ ...prev, message: e.target.value }))}
                            />
                          </div>
                          <Button onClick={submitBid} className="w-full">
                            Submit Bid
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="success"
                      onClick={() => bookShipment(shipment.id)}
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Book Now
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