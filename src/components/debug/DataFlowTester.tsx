import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Package, 
  Users,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ShipmentData {
  id: string;
  shipper_id: string;
  origin_city: string;
  destination_city: string;
  status: string;
  created_at: string;
  shipper_name?: string;
}

export function DataFlowTester() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [allShipments, setAllShipments] = useState<ShipmentData[]>([]);
  const [availableShipments, setAvailableShipments] = useState<ShipmentData[]>([]);
  const [userShipments, setUserShipments] = useState<ShipmentData[]>([]);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string, success: boolean = true) => {
    setTestResults(prev => [...prev, `${success ? '✅' : '❌'} ${result}`]);
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  const fetchAllShipments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllShipments(data || []);
      addTestResult(`Found ${data?.length || 0} total shipments`);
    } catch (error: any) {
      console.error('Error fetching all shipments:', error);
      addTestResult(`Error fetching all shipments: ${error.message}`, false);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableShipments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('status', 'posted')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAvailableShipments(data || []);
      addTestResult(`Found ${data?.length || 0} available shipments (status: posted)`);
    } catch (error: any) {
      console.error('Error fetching available shipments:', error);
      addTestResult(`Error fetching available shipments: ${error.message}`, false);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserShipments = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (profile?.role === 'shipper') {
        query = query.eq('shipper_id', user.id);
      } else if (profile?.role === 'carrier') {
        query = query.eq('carrier_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUserShipments(data || []);
      addTestResult(`Found ${data?.length || 0} shipments for current user (${profile?.role})`);
    } catch (error: any) {
      console.error('Error fetching user shipments:', error);
      addTestResult(`Error fetching user shipments: ${error.message}`, false);
    } finally {
      setLoading(false);
    }
  };

  const testDataFlow = async () => {
    setLoading(true);
    clearTestResults();

    try {
      addTestResult('Starting data flow test...');
      
      // Test 1: Check if user is authenticated
      if (!user?.id) {
        addTestResult('User not authenticated', false);
        return;
      }
      addTestResult(`User authenticated: ${user.email} (${profile?.role})`);

      // Test 2: Fetch all shipments
      await fetchAllShipments();

      // Test 3: Fetch available shipments
      await fetchAvailableShipments();

      // Test 4: Fetch user's shipments
      await fetchUserShipments();

      // Test 5: Analyze data flow
      const postedShipments = allShipments.filter(s => s.status === 'posted');
      const userPostedShipments = userShipments.filter(s => s.status === 'posted');
      
      addTestResult(`Posted shipments: ${postedShipments.length}`);
      addTestResult(`User's posted shipments: ${userPostedShipments.length}`);

      if (profile?.role === 'shipper' && userPostedShipments.length > 0) {
        addTestResult('✅ Shipper has posted shipments - should be visible to carriers');
      } else if (profile?.role === 'shipper') {
        addTestResult('❌ Shipper has no posted shipments', false);
      }

      if (profile?.role === 'carrier' && availableShipments.length > 0) {
        addTestResult('✅ Carrier can see available shipments');
      } else if (profile?.role === 'carrier') {
        addTestResult('❌ Carrier cannot see any available shipments', false);
      }

      // Test 6: Check data consistency
      if (availableShipments.length !== postedShipments.length) {
        addTestResult('❌ Data inconsistency: available vs posted shipments', false);
      } else {
        addTestResult('✅ Data consistency: available matches posted shipments');
      }

      toast({
        title: "Data Flow Test Complete",
        description: "Check the results below for details",
      });

    } catch (error: any) {
      console.error('Error in data flow test:', error);
      addTestResult(`Data flow test failed: ${error.message}`, false);
      toast({
        variant: "destructive",
        title: "Test Failed",
        description: "Error during data flow testing",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestShipment = async () => {
    if (!user?.id || profile?.role !== 'shipper') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Only shippers can create test shipments",
      });
      return;
    }

    setLoading(true);
    try {
      const testShipment = {
        shipper_id: user.id,
        origin_city: 'Test City',
        origin_state: 'Test State',
        destination_city: 'Test Destination',
        destination_state: 'Test Dest State',
        pickup_date: '2025-01-25',
        delivery_date: '2025-01-27',
        weight: 5000,
        rate: 1500.00,
        equipment_type: 'dry_van',
        commodity: 'Test Commodity',
        special_requirements: 'Test requirements',
        status: 'posted'
      };

      const { data, error } = await supabase
        .from('shipments')
        .insert(testShipment)
        .select()
        .single();

      if (error) throw error;

      addTestResult(`Created test shipment: ${data.id}`);
      toast({
        title: "Test Shipment Created",
        description: "A new test shipment has been created",
      });

      // Refresh data
      await Promise.all([
        fetchAllShipments(),
        fetchAvailableShipments(),
        fetchUserShipments()
      ]);

    } catch (error: any) {
      console.error('Error creating test shipment:', error);
      addTestResult(`Error creating test shipment: ${error.message}`, false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create test shipment",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Data Flow Tester - Shipment Visibility Debug
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current User Info */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Current User</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Email:</span> {user?.email}
            </div>
            <div>
              <span className="text-muted-foreground">Role:</span> 
              <Badge variant="outline" className="ml-2">{profile?.role || 'Unknown'}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">User ID:</span> {user?.id}
            </div>
            <div>
              <span className="text-muted-foreground">Name:</span> {profile?.full_name}
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={testDataFlow}
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Run Data Flow Test
          </Button>
          
          <Button
            onClick={fetchAllShipments}
            disabled={loading}
            variant="outline"
          >
            <Database className="h-4 w-4 mr-2" />
            Fetch All Shipments
          </Button>
          
          <Button
            onClick={fetchAvailableShipments}
            disabled={loading}
            variant="outline"
          >
            <Package className="h-4 w-4 mr-2" />
            Fetch Available Shipments
          </Button>
          
          <Button
            onClick={fetchUserShipments}
            disabled={loading}
            variant="outline"
          >
            <Users className="h-4 w-4 mr-2" />
            Fetch User Shipments
          </Button>
          
          {profile?.role === 'shipper' && (
            <Button
              onClick={createTestShipment}
              disabled={loading}
              variant="outline"
            >
              <Package className="h-4 w-4 mr-2" />
              Create Test Shipment
            </Button>
          )}
          
          <Button
            onClick={clearTestResults}
            variant="outline"
            size="sm"
          >
            Clear Results
          </Button>
        </div>

        {/* Data Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{allShipments.length}</div>
            <div className="text-sm text-muted-foreground">Total Shipments</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{availableShipments.length}</div>
            <div className="text-sm text-muted-foreground">Available (Posted)</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{userShipments.length}</div>
            <div className="text-sm text-muted-foreground">User's Shipments</div>
          </div>
        </div>

        {/* Shipment Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Available Shipments (for carriers)</h3>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {availableShipments.map((shipment) => (
                <div key={shipment.id} className="p-2 border rounded text-sm">
                  <div className="font-medium">{shipment.origin_city} → {shipment.destination_city}</div>
                  <div className="text-muted-foreground">Status: {shipment.status}</div>
                  <div className="text-muted-foreground">Created: {new Date(shipment.created_at).toLocaleDateString()}</div>
                </div>
              ))}
              {availableShipments.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No available shipments
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">User's Shipments</h3>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {userShipments.map((shipment) => (
                <div key={shipment.id} className="p-2 border rounded text-sm">
                  <div className="font-medium">{shipment.origin_city} → {shipment.destination_city}</div>
                  <div className="text-muted-foreground">Status: {shipment.status}</div>
                  <div className="text-muted-foreground">Created: {new Date(shipment.created_at).toLocaleDateString()}</div>
                </div>
              ))}
              {userShipments.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No user shipments
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm p-2 bg-muted rounded">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 