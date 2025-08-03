import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Users, 
  Package, 
  DollarSign,
  Truck,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ShipmentService } from '@/lib/services/shipmentService';
import { SampleDataInitializer } from '@/lib/init/sampleData';

interface DataStats {
  users: number;
  shipments: number;
  bids: number;
  vehicles: number;
  companies: number;
}

export function DataTester() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DataStats | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string, success: boolean = true) => {
    setTestResults(prev => [...prev, `${success ? '✅' : '❌'} ${result}`]);
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  const fetchDataStats = async () => {
    setLoading(true);
    try {
      const [
        { count: users },
        { count: shipments },
        { count: bids },
        { count: vehicles },
        { count: companies }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('shipments').select('*', { count: 'exact', head: true }),
        supabase.from('bids').select('*', { count: 'exact', head: true }),
        supabase.from('vehicles').select('*', { count: 'exact', head: true }),
        supabase.from('companies').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        users: users || 0,
        shipments: shipments || 0,
        bids: bids || 0,
        vehicles: vehicles || 0,
        companies: companies || 0
      });

      addTestResult(`Fetched data stats: ${users} users, ${shipments} shipments, ${bids} bids`);
    } catch (error) {
      console.error('Error fetching stats:', error);
      addTestResult('Failed to fetch data stats', false);
    } finally {
      setLoading(false);
    }
  };

  const testShipmentFlow = async () => {
    setLoading(true);
    clearTestResults();

    try {
      // Test 1: Create a sample shipment
      addTestResult('Testing shipment creation...');
      const sampleShipment = await SampleDataInitializer.createSampleShipment(user?.id || '');
      addTestResult(`Created shipment: ${sampleShipment.id}`);

      // Test 2: Fetch available shipments
      addTestResult('Testing available shipments fetch...');
      const availableShipments = await ShipmentService.getAvailableShipments();
      addTestResult(`Found ${availableShipments.length} available shipments`);

      // Test 3: Fetch shipper shipments
      addTestResult('Testing shipper shipments fetch...');
      const shipperShipments = await ShipmentService.getShipperShipments(user?.id || '');
      addTestResult(`Found ${shipperShipments.length} shipper shipments`);

      // Test 4: Test data relationships
      addTestResult('Testing data relationships...');
      const shipmentWithRelations = await ShipmentService.getShipmentById(sampleShipment.id);
      if (shipmentWithRelations?.shipper) {
        addTestResult('Shipment-shipper relationship working');
      } else {
        addTestResult('Shipment-shipper relationship failed', false);
      }

      toast({
        title: "Data Flow Test Complete",
        description: "All tests completed successfully!",
      });

    } catch (error) {
      console.error('Error in shipment flow test:', error);
      addTestResult('Shipment flow test failed', false);
      toast({
        variant: "destructive",
        title: "Test Failed",
        description: "Error during data flow testing",
      });
    } finally {
      setLoading(false);
    }
  };

  const testBiddingFlow = async () => {
    setLoading(true);
    clearTestResults();

    try {
      // Test 1: Get available shipments
      addTestResult('Testing bidding flow...');
      const availableShipments = await ShipmentService.getAvailableShipments();
      
      if (availableShipments.length === 0) {
        addTestResult('No available shipments for bidding test', false);
        return;
      }

      const testShipment = availableShipments[0];

      // Test 2: Create a bid
      addTestResult(`Creating bid for shipment: ${testShipment.id}`);
      const sampleBid = await SampleDataInitializer.createSampleBid(testShipment.id, user?.id || '');
      addTestResult(`Created bid: ${sampleBid.id}`);

      // Test 3: Fetch bids for shipment
      addTestResult('Testing bid retrieval...');
      const { data: bids } = await supabase
        .from('bids')
        .select(`
          *,
          carrier:profiles!bids_carrier_id_fkey(
            id,
            full_name
          )
        `)
        .eq('shipment_id', testShipment.id);

      addTestResult(`Found ${bids?.length || 0} bids for shipment`);

      // Test 4: Test bid relationships
      if (bids && bids.length > 0 && bids[0].carrier) {
        addTestResult('Bid-carrier relationship working');
      } else {
        addTestResult('Bid-carrier relationship failed', false);
      }

      toast({
        title: "Bidding Flow Test Complete",
        description: "Bidding system working correctly!",
      });

    } catch (error) {
      console.error('Error in bidding flow test:', error);
      addTestResult('Bidding flow test failed', false);
      toast({
        variant: "destructive",
        title: "Test Failed",
        description: "Error during bidding flow testing",
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeSampleData = async () => {
    setLoading(true);
    clearTestResults();

    try {
      addTestResult('Initializing sample data...');
      await SampleDataInitializer.initializeSampleData();
      addTestResult('Sample data initialization completed');
      
      // Refresh stats
      await fetchDataStats();
      
      toast({
        title: "Sample Data Initialized",
        description: "Sample data has been created successfully!",
      });

    } catch (error) {
      console.error('Error initializing sample data:', error);
      addTestResult('Sample data initialization failed', false);
      toast({
        variant: "destructive",
        title: "Initialization Failed",
        description: "Error during sample data initialization",
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
          Data Flow Tester
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

        {/* Data Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stats.users}</div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stats.shipments}</div>
              <div className="text-sm text-muted-foreground">Shipments</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stats.bids}</div>
              <div className="text-sm text-muted-foreground">Bids</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Truck className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stats.vehicles}</div>
              <div className="text-sm text-muted-foreground">Vehicles</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stats.companies}</div>
              <div className="text-sm text-muted-foreground">Companies</div>
            </div>
          </div>
        )}

        {/* Test Controls */}
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={fetchDataStats}
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Fetch Stats
          </Button>
          
          <Button
            onClick={initializeSampleData}
            disabled={loading}
            variant="outline"
          >
            <Database className="h-4 w-4 mr-2" />
            Initialize Sample Data
          </Button>
          
          <Button
            onClick={testShipmentFlow}
            disabled={loading}
            variant="outline"
          >
            <Package className="h-4 w-4 mr-2" />
            Test Shipment Flow
          </Button>
          
          <Button
            onClick={testBiddingFlow}
            disabled={loading}
            variant="outline"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Test Bidding Flow
          </Button>
          
          <Button
            onClick={clearTestResults}
            variant="outline"
            size="sm"
          >
            Clear Results
          </Button>
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