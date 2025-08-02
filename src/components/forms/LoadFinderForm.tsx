import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Truck, DollarSign, Package, Search, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoadFinderFormProps {
  trigger?: React.ReactNode;
}

export function LoadFinderForm({ trigger }: LoadFinderFormProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    current_location: '',
    equipment_type: 'dry_van',
    capacity: '',
    preferred_routes: '',
    bid_amount: '',
    availability_date: ''
  });

  // Mock load results
  const mockLoads = [
    {
      id: "LD001",
      origin: "Chicago, IL",
      destination: "Atlanta, GA",
      commodity: "Electronics",
      weight: "35,000 lbs",
      equipment: "Dry Van",
      rate: "$2,450",
      pickup: "Tomorrow",
      distance: "715 miles",
      match: 96
    },
    {
      id: "LD002", 
      origin: "Milwaukee, WI",
      destination: "Nashville, TN",
      commodity: "Auto Parts",
      weight: "28,500 lbs",
      equipment: "Dry Van",
      rate: "$1,980",
      pickup: "2 days",
      distance: "612 miles",
      match: 89
    },
    {
      id: "LD003",
      origin: "Detroit, MI",
      destination: "Jacksonville, FL",
      commodity: "General Freight",
      weight: "42,000 lbs",
      equipment: "Dry Van", 
      rate: "$3,200",
      pickup: "3 days",
      distance: "1,025 miles",
      match: 92
    }
  ];

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate AI matching delay
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      toast({
        title: "Loads found!",
        description: `Found ${mockLoads.length} matching loads for your criteria.`,
      });
    }, 2000);
  };

  const handleBookLoad = (load: any) => {
    toast({
      title: "Load booked successfully!",
      description: `You've been assigned load ${load.id}. Check your dashboard for details.`,
    });
    setOpen(false);
    setStep(1);
    navigate('/auth');
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const defaultTrigger = (
    <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      Request now
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Search className="h-6 w-6 mr-2 text-primary" />
            Find Available Loads
            <Badge variant="secondary" className="ml-2">Step {step} of 3</Badge>
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Tell us about your equipment and location"}
            {step === 2 && "Enter your bidding preferences"}
            {step === 3 && "Choose from available loads"}
          </DialogDescription>
        </DialogHeader>
        
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current_location">Current Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="current_location"
                  placeholder="Chicago, IL"
                  value={formData.current_location}
                  onChange={(e) => updateFormData('current_location', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (lbs)</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="80000"
                  value={formData.capacity}
                  onChange={(e) => updateFormData('capacity', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability_date">Available From</Label>
              <Input
                id="availability_date"
                type="date"
                value={formData.availability_date}
                onChange={(e) => updateFormData('availability_date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred_routes">Preferred Routes (Optional)</Label>
              <Input
                id="preferred_routes"
                placeholder="Chicago to Atlanta, Midwest to Southeast, etc."
                value={formData.preferred_routes}
                onChange={(e) => updateFormData('preferred_routes', e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Next: Set Your Bid
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Bidding Preferences
                </CardTitle>
                <CardDescription>
                  Set your minimum rate to ensure profitable loads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bid_amount">Minimum Rate per Mile ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="bid_amount"
                      type="number"
                      step="0.01"
                      placeholder="2.50"
                      value={formData.bid_amount}
                      onChange={(e) => updateFormData('bid_amount', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Rate Guidelines</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Dry Van: $2.00 - $3.50 per mile</p>
                    <p>• Refrigerated: $2.50 - $4.00 per mile</p>
                    <p>• Flatbed: $2.25 - $3.75 per mile</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Finding Loads..." : "Find Matching Loads"}
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Available Loads</h3>
              <Button variant="outline" onClick={() => setStep(2)}>
                Adjust Criteria
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockLoads.map((load) => (
                <Card key={load.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{load.id}</h4>
                          <p className="text-sm text-muted-foreground">{load.commodity}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{load.rate}</div>
                        <Badge variant="success" className="text-xs">
                          {load.match}% match
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Route:</span>
                        <p className="font-medium">{load.origin} → {load.destination}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Weight:</span>
                        <p className="font-medium">{load.weight}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Distance:</span>
                        <p className="font-medium">{load.distance}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pickup:</span>
                        <p className="font-medium flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {load.pickup}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="premium" 
                        className="flex-1"
                        onClick={() => handleBookLoad(load)}
                      >
                        Book This Load
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