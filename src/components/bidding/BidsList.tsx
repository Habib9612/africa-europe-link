import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User,
  Truck,
  Star
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Bid {
  id: string;
  amount: number;
  notes: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  created_at: string;
  carrier: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

interface BidsListProps {
  shipmentId: string;
  onBidAction?: () => void;
}

export function BidsList({ shipmentId, onBidAction }: BidsListProps) {
  const { user } = useAuth();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchBids();
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('bids')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bids', filter: `shipment_id=eq.${shipmentId}` },
        () => {
          fetchBids();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [shipmentId]);

  const fetchBids = async () => {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          id,
          amount,
          notes,
          status,
          created_at,
          carrier:profiles!bids_carrier_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('shipment_id', shipmentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBids(data || []);
    } catch (error: any) {
      console.error('Error fetching bids:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load bids",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBidAction = async (bidId: string, action: 'accept' | 'reject') => {
    setActionLoading(bidId);
    
    try {
      const newStatus = action === 'accept' ? 'accepted' : 'rejected';
      
      const { error } = await supabase
        .from('bids')
        .update({ status: newStatus })
        .eq('id', bidId);

      if (error) throw error;

      // If accepting, update shipment status and accepted_bid_id
      if (action === 'accept') {
        const { error: shipmentError } = await supabase
          .from('shipments')
          .update({ 
            status: 'assigned',
            accepted_bid_id: bidId
          })
          .eq('id', shipmentId);

        if (shipmentError) throw shipmentError;
      }

      toast({
        title: "Success",
        description: `Bid ${action}ed successfully`,
      });

      onBidAction?.();
    } catch (error: any) {
      console.error(`Error ${action}ing bid:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${action} bid`,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'default',
      accepted: 'default',
      rejected: 'destructive',
      withdrawn: 'secondary'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (bids.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Bids Yet</h3>
          <p className="text-muted-foreground">
            Carriers will be able to bid on your shipment once it's posted.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Bids ({bids.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bids.map((bid) => (
            <div key={bid.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {bid.carrier.full_name?.charAt(0) || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{bid.carrier.full_name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(bid.created_at)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {formatAmount(bid.amount)}
                  </div>
                  {getStatusBadge(bid.status)}
                </div>
              </div>

              {bid.notes && (
                <div className="mb-3 p-3 bg-muted rounded-md">
                  <p className="text-sm">{bid.notes}</p>
                </div>
              )}

              {bid.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleBidAction(bid.id, 'accept')}
                    disabled={actionLoading === bid.id}
                    className="flex-1"
                  >
                    {actionLoading === bid.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBidAction(bid.id, 'reject')}
                    disabled={actionLoading === bid.id}
                    className="flex-1"
                  >
                    {actionLoading === bid.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 