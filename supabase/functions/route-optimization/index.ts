import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RouteOptimizationRequest {
  waypoints: Array<{
    id: string;
    latitude: number;
    longitude: number;
    address: string;
    type: 'pickup' | 'delivery';
    time_window_start?: string;
    time_window_end?: string;
    service_time?: number;
  }>;
  vehicle_constraints?: {
    max_capacity_weight?: number;
    max_capacity_volume?: number;
    max_driving_time?: number;
  };
  optimization_objectives?: Array<'minimize_distance' | 'minimize_time' | 'minimize_fuel'>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');

    switch (req.method) {
      case 'POST':
        if (url.pathname.includes('/optimize')) {
          // Route optimization
          const requestData: RouteOptimizationRequest = await req.json();
          
          // Perform route optimization (simplified algorithm)
          const optimizedRoute = await optimizeRoute(requestData);
          
          // Store the optimized route
          const { data: route, error } = await supabase
            .from('routes')
            .insert({
              user_id: user.id,
              name: `Optimized Route ${new Date().toISOString()}`,
              total_distance: optimizedRoute.total_distance,
              total_time: optimizedRoute.total_time,
              optimization_score: optimizedRoute.optimization_score,
              is_optimized: true
            })
            .select()
            .single();

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Store waypoints
          const waypointInserts = optimizedRoute.waypoints.map((waypoint, index) => ({
            route_id: route.id,
            sequence_number: index + 1,
            latitude: waypoint.latitude,
            longitude: waypoint.longitude,
            address: waypoint.address,
            waypoint_type: waypoint.type,
            estimated_arrival: waypoint.estimated_arrival,
            service_time: waypoint.service_time || 15
          }));

          await supabase.from('route_waypoints').insert(waypointInserts);

          return new Response(
            JSON.stringify({
              route_id: route.id,
              optimized_route: optimizedRoute
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        break;

      case 'GET':
        if (url.pathname.includes('/routes')) {
          // Get all routes
          const { data: routes, error } = await supabase
            .from('routes')
            .select(`
              *,
              route_waypoints(*)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(routes),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in route-optimization function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Simplified route optimization algorithm
async function optimizeRoute(request: RouteOptimizationRequest) {
  const { waypoints, vehicle_constraints, optimization_objectives } = request;
  
  // Simple greedy algorithm for demonstration
  // In a real implementation, you'd use more sophisticated algorithms like:
  // - Clarke-Wright Savings Algorithm
  // - Genetic Algorithm
  // - Simulated Annealing
  // - Google OR-Tools
  
  let optimizedWaypoints = [...waypoints];
  let totalDistance = 0;
  let totalTime = 0;
  
  // Sort waypoints to minimize distance (simplified)
  if (waypoints.length > 2) {
    const depot = waypoints[0];
    const deliveries = waypoints.slice(1);
    
    // Simple nearest neighbor algorithm
    const sortedDeliveries = [];
    let current = depot;
    const remaining = [...deliveries];
    
    while (remaining.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = calculateDistance(current, remaining[0]);
      
      for (let i = 1; i < remaining.length; i++) {
        const distance = calculateDistance(current, remaining[i]);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }
      
      const nearest = remaining.splice(nearestIndex, 1)[0];
      sortedDeliveries.push(nearest);
      totalDistance += nearestDistance;
      current = nearest;
    }
    
    optimizedWaypoints = [depot, ...sortedDeliveries];
  }
  
  // Calculate estimated arrival times
  let currentTime = new Date();
  optimizedWaypoints = optimizedWaypoints.map((waypoint, index) => {
    if (index > 0) {
      const travelTime = calculateTravelTime(optimizedWaypoints[index - 1], waypoint);
      currentTime = new Date(currentTime.getTime() + travelTime * 60000); // Convert minutes to milliseconds
    }
    
    return {
      ...waypoint,
      estimated_arrival: currentTime.toISOString(),
      service_time: waypoint.service_time || 15
    };
  });
  
  totalTime = optimizedWaypoints.reduce((sum, wp) => sum + (wp.service_time || 15), 0);
  
  // Calculate optimization score (0-100, higher is better)
  const optimizationScore = Math.max(0, 100 - (totalDistance / 10)); // Simplified scoring
  
  return {
    waypoints: optimizedWaypoints,
    total_distance: Math.round(totalDistance),
    total_time: Math.round(totalTime),
    optimization_score: Math.round(optimizationScore),
    fuel_estimate: Math.round(totalDistance * 0.3), // Rough fuel estimate
    cost_estimate: Math.round(totalDistance * 1.5) // Rough cost estimate
  };
}

function calculateDistance(point1: any, point2: any): number {
  // Haversine formula for distance calculation
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) * Math.cos(toRadians(point2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateTravelTime(point1: any, point2: any): number {
  const distance = calculateDistance(point1, point2);
  const averageSpeed = 45; // mph
  return (distance / averageSpeed) * 60; // Convert to minutes
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}