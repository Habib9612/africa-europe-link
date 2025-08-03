import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Truck, 
  Clock, 
  Navigation,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TrackingMapProps {
  shipmentId: string;
}

interface TrackingEvent {
  id: string;
  event_type: string;
  location_lat: number;
  location_lng: number;
  location_address: string;
  timestamp: string;
  notes: string;
}

interface Shipment {
  id: string;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  tracking_status: string;
  current_location_lat: number;
  current_location_lng: number;
  current_location_address: string;
  estimated_delivery_time: string;
  last_location_update: string;
}

export function TrackingMap({ shipmentId }: TrackingMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchShipmentData();
    fetchTrackingEvents();
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('tracking')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tracking_events', filter: `shipment_id=eq.${shipmentId}` },
        () => {
          fetchTrackingEvents();
          fetchShipmentData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [shipmentId]);

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      initializeMap();
    }
  }, [mapContainer.current]);

  useEffect(() => {
    if (map.current && shipment && trackingEvents.length > 0) {
      updateMap();
    }
  }, [shipment, trackingEvents]);

  const fetchShipmentData = async () => {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('id', shipmentId)
        .single();

      if (error) throw error;
      setShipment(data);
    } catch (error: any) {
      console.error('Error fetching shipment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load shipment data",
      });
    }
  };

  const fetchTrackingEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('tracking_events')
        .select('*')
        .eq('shipment_id', shipmentId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      setTrackingEvents(data || []);
    } catch (error: any) {
      console.error('Error fetching tracking events:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tracking events",
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current) return;

    // Initialize Mapbox map
    map.current = new (window as any).mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-7.5898, 33.5731], // Default to Casablanca
      zoom: 10
    });

    // Add navigation controls
    map.current.addControl(new (window as any).mapboxgl.NavigationControl());

    // Add fullscreen control
    map.current.addControl(new (window as any).mapboxgl.FullscreenControl());
  };

  const updateMap = () => {
    if (!map.current || !shipment) return;

    // Clear existing markers and routes
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());

    // Add origin marker
    if (trackingEvents.length > 0) {
      const origin = trackingEvents[0];
      new (window as any).mapboxgl.Marker({ color: '#10b981' })
        .setLngLat([origin.location_lng, origin.location_lat])
        .setPopup(new (window as any).mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">Origin</h3>
            <p>${origin.location_address}</p>
            <p class="text-sm text-gray-500">${new Date(origin.timestamp).toLocaleString()}</p>
          </div>
        `))
        .addTo(map.current);
    }

    // Add current location marker
    if (shipment.current_location_lat && shipment.current_location_lng) {
      const currentMarker = new (window as any).mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat([shipment.current_location_lng, shipment.current_location_lat])
        .setPopup(new (window as any).mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">Current Location</h3>
            <p>${shipment.current_location_address}</p>
            <p class="text-sm text-gray-500">Last updated: ${new Date(shipment.last_location_update || '').toLocaleString()}</p>
          </div>
        `))
        .addTo(map.current);

      // Center map on current location
      map.current.setCenter([shipment.current_location_lng, shipment.current_location_lat]);
    }

    // Add destination marker (mock coordinates)
    const destinationLng = -3.7492; // Madrid coordinates
    const destinationLat = 40.4168;
    new (window as any).mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat([destinationLng, destinationLat])
      .setPopup(new (window as any).mapboxgl.Popup().setHTML(`
        <div class="p-2">
          <h3 class="font-semibold">Destination</h3>
          <p>${shipment.destination_city}, ${shipment.destination_state}</p>
        </div>
      `))
      .addTo(map.current);

    // Draw route line if we have multiple points
    if (trackingEvents.length > 1) {
      const coordinates = trackingEvents.map(event => [event.location_lng, event.location_lat]);
      
      // Add route line
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        }
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchShipmentData(), fetchTrackingEvents()]);
    setRefreshing(false);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      picked_up: 'default',
      in_transit: 'default',
      delivered: 'default',
      delayed: 'destructive',
      issue: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Live Tracking
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Status Overview */}
          {shipment && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(shipment.tracking_status)}
                </div>
                {shipment.estimated_delivery_time && (
                  <div>
                    <p className="text-sm text-muted-foreground">ETA</p>
                    <p className="font-semibold">
                      {new Date(shipment.estimated_delivery_time).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Route</p>
                <p className="font-semibold">
                  {shipment.origin_city} → {shipment.destination_city}
                </p>
              </div>
            </div>
          )}

          {/* Map Container */}
          <div 
            ref={mapContainer} 
            className="w-full h-96 rounded-lg border"
            style={{ minHeight: '400px' }}
          />

          {/* Recent Events */}
          <div>
            <h3 className="font-semibold mb-3">Recent Events</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {trackingEvents.slice(-5).reverse().map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium capitalize">{event.event_type.replace('_', ' ')}</p>
                    <p className="text-sm text-muted-foreground">{event.location_address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {trackingEvents.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Truck className="h-8 w-8 mx-auto mb-2" />
                  <p>No tracking events yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 