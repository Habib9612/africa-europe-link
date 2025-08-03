import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BidFormProps {
  shipmentId: string;
  currentRate: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BidForm({ shipmentId, currentRate, onSuccess, onCancel }: BidFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to submit a bid');
      return;
    }

    const bidAmount = parseFloat(amount);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('bids')
        .insert({
          shipment_id: shipmentId,
          carrier_id: user.id,
          amount: bidAmount,
          notes: notes.trim() || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Bid submitted successfully!');
      setAmount('');
      setNotes('');
      onSuccess?.();
    } catch (error: any) {
      console.error('Error submitting bid:', error);
      toast.error(error.message || 'Failed to submit bid');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal points
    const sanitized = value.replace(/[^0-9.]/g, '');
    setAmount(sanitized);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Submit Your Bid
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Bid Amount (EUR)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Enter your bid amount"
                required
                className="pl-8"
              />
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Current rate: €{currentRate.toFixed(2)}
            </p>
          </div>

          <div>
            <Label htmlFor="notes" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional information about your bid..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading || !amount.trim()}
              className="flex-1"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Bid
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            <p>• Your bid will be visible to the shipper</p>
            <p>• You can withdraw your bid before it's accepted</p>
            <p>• The shipper will be notified of your bid</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 