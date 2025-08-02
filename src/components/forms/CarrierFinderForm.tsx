import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPin, Truck, DollarSign, Search, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CarrierFinderFormProps {
  trigger?: React.ReactNode;
}

export function CarrierFinderForm({ trigger }: CarrierFinderFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    origin_city: '',
    origin_state: '',
    destination_city: '',
    destination_state: '',
    pickup_date: '',
    delivery_date: '',
    weight: '',
    equipment_type: 'dry_van',
    commodity: '',
    max_rate: '',
    special_requirements: ''
  });

  // Mock carrier results
  const mockCarriers = [
    {
      id: 1,
      name: "FastTrack Logistics",
      rating: 4.8,
      equipment: "Dry Van",
      rate: "$2,450",
      eta: "24 hours",
      location: "15 miles away",
      match: 95
    },
    {
      id: 2,
      name: "Atlas Transport",
      rating: 4.6,
      equipment: "Dry Van",
      rate: "$2,380",
      eta: "18 hours",
      location: "8 miles away",
      match: 89
    },
    {
      id: 3,
      name: "Prime Carriers",
      rating: 4.9,
      equipment: "Dry Van",
      rate: "$2,520",
      eta: "12 hours",
      location: "3 miles away",
      match: 92
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form data
    if (!formData.origin_city || !formData.destination_city || !formData.weight || !formData.max_rate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before searching.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    // Simulate search delay
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
      toast({
        title: "Carriers found!",
        description: `Found ${mockCarriers.length} available carriers for your route.`,
      });
    }, 2000);
  };

  const handleBookCarrier = (carrier: any) => {
    toast({
      title: "Carrier contacted",
      description: `Request sent to ${carrier.name}! They will respond within 30 minutes.`,
    });
    setOpen(false);
    setShowResults(false);
    // Reset form
    setFormData({
      origin_city: '',
      origin_state: '',
      destination_city: '',
      destination_state: '',
      pickup_date: '',
      delivery_date: '',
      weight: '',
      equipment_type: 'dry_van',
      commodity: '',
      max_rate: '',
      special_requirements: ''
    });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const defaultTrigger = (
    <Button variant="outline" className="w-full">
      <Truck className="h-4 w-4 mr-2" />
      Find Carriers
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Search className="h-6 w-6 mr-2 text-primary" />
            Find Available Carriers
          </DialogTitle>
          <DialogDescription>
            Enter your shipment details to find the best carriers for your route
          </DialogDescription>
        </DialogHeader>
        
        {!showResults ? (
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
                <Label htmlFor="max_rate">Max Rate ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="max_rate"
                    type="number"
                    step="0.01"
                    placeholder="2500.00"
                    value={formData.max_rate}
                    onChange={(e) => updateFormData('max_rate', e.target.value)}
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
              {loading ? "Searching Carriers..." : "Find Carriers"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Available Carriers</h3>
              <Button variant="outline" onClick={() => setShowResults(false)}>
                New Search
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockCarriers.map((carrier) => (
                <Card key={carrier.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Truck className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{carrier.name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                              {carrier.rating}
                            </div>
                            <span>•</span>
                            <span>{carrier.equipment}</span>
                            <span>•</span>
                            <span>{carrier.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{carrier.rate}</div>
                        <div className="text-sm text-muted-foreground">ETA: {carrier.eta}</div>
                        <Badge variant="success" className="mt-1">
                          {carrier.match}% match
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <Button 
                        variant="premium" 
                        className="flex-1"
                        onClick={() => handleBookCarrier(carrier)}
                      >
                        Book Now
                      </Button>
                      <Button variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}