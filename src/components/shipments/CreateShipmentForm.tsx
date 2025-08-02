import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Package, Calendar, DollarSign, Truck, Weight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface CreateShipmentFormProps {
  onSuccess?: () => void;
}

export function CreateShipmentForm({ onSuccess }: CreateShipmentFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
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

  const equipmentTypes = [
    { value: 'dry_van', label: 'Dry Van' },
    { value: 'flatbed', label: 'Flatbed' },
    { value: 'refrigerated', label: 'Refrigerated' },
    { value: 'tanker', label: 'Tanker' },
    { value: 'step_deck', label: 'Step Deck' },
    { value: 'lowboy', label: 'Lowboy' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('CreateShipmentForm: No user found');
      toast.error('Please log in to create a shipment');
      return;
    }

    console.log('CreateShipmentForm: Starting shipment creation for user:', user.id);
    setLoading(true);

    try {
      const shipmentData = {
        ...formData,
        weight: parseInt(formData.weight),
        rate: parseFloat(formData.rate),
        shipper_id: user.id,
        status: 'posted'
      };

      console.log('CreateShipmentForm: Submitting shipment data:', shipmentData);

      const { data, error } = await supabase
        .from('shipments')
        .insert(shipmentData)
        .select()
        .single();

      console.log('CreateShipmentForm: Supabase response:', { data, error });

      if (error) throw error;

      console.log('CreateShipmentForm: Shipment created successfully:', data);
      toast.success('Shipment posted successfully! Carriers can now bid on it.');
      
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
    } catch (error: any) {
      console.error('Error creating shipment:', error);
      toast.error(`Error creating shipment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-5 w-5 mr-2 text-primary" />
          Post New Shipment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Origin and Destination */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center mb-2">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <Label className="text-base font-semibold">Origin</Label>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="origin_city">City</Label>
                  <Input
                    id="origin_city"
                    placeholder="e.g., Los Angeles"
                    value={formData.origin_city}
                    onChange={(e) => updateFormData('origin_city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="origin_state">State</Label>
                  <Input
                    id="origin_state"
                    placeholder="e.g., CA"
                    value={formData.origin_state}
                    onChange={(e) => updateFormData('origin_state', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center mb-2">
                <MapPin className="h-4 w-4 mr-2 text-accent" />
                <Label className="text-base font-semibold">Destination</Label>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="destination_city">City</Label>
                  <Input
                    id="destination_city"
                    placeholder="e.g., New York"
                    value={formData.destination_city}
                    onChange={(e) => updateFormData('destination_city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="destination_state">State</Label>
                  <Input
                    id="destination_state"
                    placeholder="e.g., NY"
                    value={formData.destination_state}
                    onChange={(e) => updateFormData('destination_state', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="pickup_date" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Pickup Date
              </Label>
              <Input
                id="pickup_date"
                type="date"
                value={formData.pickup_date}
                onChange={(e) => updateFormData('pickup_date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="delivery_date" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Delivery Date
              </Label>
              <Input
                id="delivery_date"
                type="date"
                value={formData.delivery_date}
                onChange={(e) => updateFormData('delivery_date', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Weight and Rate */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="weight" className="flex items-center">
                <Weight className="h-4 w-4 mr-2" />
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="e.g., 2000"
                value={formData.weight}
                onChange={(e) => updateFormData('weight', e.target.value)}
                required
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="rate" className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Starting Rate ($)
              </Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                placeholder="e.g., 2500.00"
                value={formData.rate}
                onChange={(e) => updateFormData('rate', e.target.value)}
                required
                min="0"
              />
            </div>
          </div>

          {/* Equipment and Commodity */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="equipment_type" className="flex items-center">
                <Truck className="h-4 w-4 mr-2" />
                Equipment Type
              </Label>
              <Select value={formData.equipment_type} onValueChange={(value) => updateFormData('equipment_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="commodity">Commodity</Label>
              <Input
                id="commodity"
                placeholder="e.g., Electronics"
                value={formData.commodity}
                onChange={(e) => updateFormData('commodity', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <Label htmlFor="special_requirements">Special Requirements (Optional)</Label>
            <Textarea
              id="special_requirements"
              placeholder="Any special handling, temperature requirements, hazmat, etc."
              value={formData.special_requirements}
              onChange={(e) => updateFormData('special_requirements', e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Shipment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}