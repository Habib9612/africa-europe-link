import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { User, Truck, Package, AlertTriangle, Phone, Mail, MapPin } from 'lucide-react';

interface Driver {
  id: string;
  user_id: string;
  license_number: string;
  phone: string;
  email: string;
  status: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

export function DriverManagement() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    license_number: '',
    phone: '',
    email: '',
    status: 'active'
  });

  useEffect(() => {
    fetchDrivers();
  }, [user]);

  const fetchDrivers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('drivers', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;
      setDrivers(data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.functions.invoke('drivers', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: formData
      });

      if (error) throw error;
      
      toast.success('Driver created successfully');
      setShowCreateForm(false);
      setFormData({
        license_number: '',
        phone: '',
        email: '',
        status: 'active'
      });
      fetchDrivers();
    } catch (error) {
      console.error('Error creating driver:', error);
      toast.error('Failed to create driver');
    }
  };

  const updateDriverStatus = async (driverId: string, status: string) => {
    try {
      const { error } = await supabase.functions.invoke(`drivers/${driverId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: { status }
      });

      if (error) throw error;
      
      toast.success('Driver status updated');
      fetchDrivers();
    } catch (error) {
      console.error('Error updating driver status:', error);
      toast.error('Failed to update driver status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Driver Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <User className="mr-2 h-4 w-4" />
          Add Driver
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Driver</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateDriver} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">License Number</label>
                  <Input
                    value={formData.license_number}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">Create Driver</Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {drivers.map((driver) => (
          <Card key={driver.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{driver.profiles?.full_name || 'Unknown Driver'}</h3>
                    <p className="text-sm text-muted-foreground">License: {driver.license_number}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge variant={driver.status === 'active' ? 'default' : 'secondary'}>
                    {driver.status}
                  </Badge>
                  
                  <Select
                    value={driver.status}
                    onValueChange={(value) => updateDriverStatus(driver.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{driver.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{driver.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>Available</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {drivers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No drivers found</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first driver.</p>
            <Button onClick={() => setShowCreateForm(true)}>
              Add Driver
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}