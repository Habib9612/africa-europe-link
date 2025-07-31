import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, MapPin, Package, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function CreateLoadForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    origin_city: '',
    origin_state: '',
    destination_city: '',
    destination_state: '',
    pickup_date: '',
    delivery_date: '',
    weight: '',
    rate: '',
    equipment_type: 'dry_van',
    commodity: '',
    special_requirements: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('shipments')
        .insert({
          shipper_id: user.id,
          origin_city: formData.origin_city,
          origin_state: formData.origin_state,
          destination_city: formData.destination_city,
          destination_state: formData.destination_state,
          pickup_date: formData.pickup_date,
          delivery_date: formData.delivery_date,
          weight: parseInt(formData.weight),
          rate: parseFloat(formData.rate),
          equipment_type: formData.equipment_type,
          commodity: formData.commodity,
          special_requirements: formData.special_requirements || null,
          status: 'posted'
        });

      if (error) throw error;

      toast({
        title: "Load posted successfully",
        description: "Your load is now available for carriers to bid on.",
      });

      // Reset form
      setFormData({
        origin_city: '',
        origin_state: '',
        destination_city: '',
        destination_state: '',
        pickup_date: '',
        delivery_date: '',
        weight: '',
        rate: '',
        equipment_type: 'dry_van',
        commodity: '',
        special_requirements: ''
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating load:', error);
      toast({
        variant: "destructive",
        title: "Error posting load",
        description: "Failed to post your load. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-6 w-6 mr-2 text-primary" />
          Post a New Load
        </CardTitle>
        <CardDescription>
          Create a shipment posting to find available carriers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin_city">Origin City</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="origin_city"
                  placeholder="Chicago"
                  value={formData.origin_city}
                  onChange={(e) => updateFormData('origin_city', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="origin_state">Origin State</Label>
              <Input
                id="origin_state"
                placeholder="IL"
                value={formData.origin_state}
                onChange={(e) => updateFormData('origin_state', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destination_city">Destination City</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="destination_city"
                  placeholder="Atlanta"
                  value={formData.destination_city}
                  onChange={(e) => updateFormData('destination_city', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination_state">Destination State</Label>
              <Input
                id="destination_state"
                placeholder="GA"
                value={formData.destination_state}
                onChange={(e) => updateFormData('destination_state', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickup_date">Pickup Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pickup_date"
                  type="date"
                  value={formData.pickup_date}
                  onChange={(e) => updateFormData('pickup_date', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delivery_date">Delivery Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="delivery_date"
                  type="date"
                  value={formData.delivery_date}
                  onChange={(e) => updateFormData('delivery_date', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="40000"
                value={formData.weight}
                onChange={(e) => updateFormData('weight', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rate">Rate ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="rate"
                  type="number"
                  step="0.01"
                  placeholder="2500.00"
                  value={formData.rate}
                  onChange={(e) => updateFormData('rate', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment_type">Equipment Type</Label>
              <Select value={formData.equipment_type} onValueChange={(value) => updateFormData('equipment_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dry_van">Dry Van</SelectItem>
                  <SelectItem value="refrigerated">Refrigerated</SelectItem>
                  <SelectItem value="flatbed">Flatbed</SelectItem>
                  <SelectItem value="step_deck">Step Deck</SelectItem>
                  <SelectItem value="lowboy">Lowboy</SelectItem>
                  <SelectItem value="tanker">Tanker</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="commodity">Commodity</Label>
            <Input
              id="commodity"
              placeholder="General freight, Electronics, etc."
              value={formData.commodity}
              onChange={(e) => updateFormData('commodity', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_requirements">Special Requirements (Optional)</Label>
            <Textarea
              id="special_requirements"
              placeholder="Any special handling, equipment, or delivery instructions..."
              value={formData.special_requirements}
              onChange={(e) => updateFormData('special_requirements', e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Posting Load..." : "Post Load"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}