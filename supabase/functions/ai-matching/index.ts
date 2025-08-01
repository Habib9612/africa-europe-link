import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Location {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  available_from: string;
  available_until: string | null;
  capacity_kg: number;
  equipment_types: string[];
}

interface Shipment {
  id: string;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  pickup_date: string;
  delivery_date: string;
  weight: number;
  equipment_type: string;
  rate: number;
  shipper_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Authenticate user
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, shipmentId } = await req.json();

    if (action === 'find_matches') {
      console.log(`Finding matches for shipment: ${shipmentId}`);

      // Get shipment details
      const { data: shipment, error: shipmentError } = await supabaseClient
        .from('shipments')
        .select('*')
        .eq('id', shipmentId)
        .single();

      if (shipmentError || !shipment) {
        return new Response(JSON.stringify({ error: 'Shipment not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get available carriers with locations
      const { data: locations, error: locationsError } = await supabaseClient
        .from('locations')
        .select(`
          *,
          profiles!inner(user_id, role, full_name)
        `)
        .eq('is_current', true)
        .eq('profiles.role', 'carrier')
        .gte('available_until', new Date().toISOString())
        .contains('equipment_types', [shipment.equipment_type]);

      if (locationsError) {
        console.error('Locations error:', locationsError);
        return new Response(JSON.stringify({ error: 'Failed to fetch carriers' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Calculate matches using AI algorithm
      const matches = await calculateMatches(shipment, locations || []);

      // Store matches in database
      for (const match of matches) {
        await supabaseClient
          .from('load_matches')
          .insert({
            shipment_id: shipmentId,
            carrier_id: match.carrier_id,
            match_score: match.match_score,
            distance_km: match.distance_km,
            estimated_cost: match.estimated_cost,
            estimated_duration_hours: match.estimated_duration_hours,
            compatibility_factors: match.compatibility_factors,
            ai_insights: match.ai_insights,
          });
      }

      return new Response(JSON.stringify({ matches, count: matches.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get_matches') {
      // Get existing matches for a shipment
      const { data: matches, error: matchesError } = await supabaseClient
        .from('load_matches')
        .select(`
          *,
          profiles!carrier_id(full_name, role)
        `)
        .eq('shipment_id', shipmentId)
        .order('match_score', { ascending: false });

      if (matchesError) {
        console.error('Matches error:', matchesError);
        return new Response(JSON.stringify({ error: 'Failed to fetch matches' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ matches: matches || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-matching function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// AI Matching Algorithm
async function calculateMatches(shipment: Shipment, locations: Location[]) {
  const matches = [];

  for (const location of locations) {
    // Calculate distance using Haversine formula (simplified)
    const distance = calculateDistance(
      getCoordinatesFromCity(shipment.origin_city, shipment.origin_state),
      { lat: location.latitude, lng: location.longitude }
    );

    // AI Scoring Algorithm
    let score = 100;
    
    // Distance factor (closer is better)
    const distancePenalty = Math.min(distance / 50, 50); // Max 50 point penalty
    score -= distancePenalty;

    // Capacity factor
    const capacityRatio = location.capacity_kg / shipment.weight;
    if (capacityRatio >= 1.2) {
      score += 10; // Bonus for extra capacity
    } else if (capacityRatio < 1) {
      score -= 30; // Penalty for insufficient capacity
    }

    // Equipment type exact match
    if (location.equipment_types.includes(shipment.equipment_type)) {
      score += 15;
    }

    // Availability timing
    const pickupDate = new Date(shipment.pickup_date);
    const availableFrom = new Date(location.available_from);
    const timeDiff = Math.abs(pickupDate.getTime() - availableFrom.getTime()) / (1000 * 60 * 60 * 24);
    
    if (timeDiff <= 1) {
      score += 20; // Perfect timing
    } else if (timeDiff <= 3) {
      score += 10; // Good timing
    } else if (timeDiff > 7) {
      score -= 15; // Poor timing
    }

    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, Math.round(score)));

    // Calculate estimated cost based on distance and rate
    const estimatedCost = shipment.rate * (1 + (distance / 1000) * 0.1);
    const estimatedDuration = Math.ceil(distance / 80); // Assuming 80 km/h average speed

    // AI Insights
    const aiInsights = {
      profitability: Math.min(100, 60 + (shipment.rate / 100)),
      efficiency: Math.min(100, 80 - (distance / 20)),
      reliability: 75 + Math.random() * 20, // Simulated based on carrier history
      recommendation: score >= 80 ? 'Highly Recommended' : 
                     score >= 60 ? 'Good Match' : 
                     score >= 40 ? 'Consider' : 'Not Recommended'
    };

    // Compatibility factors
    const compatibilityFactors = {
      distance_score: Math.max(0, 100 - distancePenalty),
      capacity_match: capacityRatio >= 1 ? 100 : (capacityRatio * 100),
      equipment_match: location.equipment_types.includes(shipment.equipment_type) ? 100 : 0,
      timing_score: timeDiff <= 1 ? 100 : Math.max(0, 100 - (timeDiff * 10))
    };

    if (score >= 30) { // Only include reasonable matches
      matches.push({
        carrier_id: location.user_id,
        match_score: score,
        distance_km: Math.round(distance),
        estimated_cost: Math.round(estimatedCost),
        estimated_duration_hours: estimatedDuration,
        compatibility_factors: compatibilityFactors,
        ai_insights: aiInsights,
        carrier_location: {
          city: location.city,
          state: location.state,
          latitude: location.latitude,
          longitude: location.longitude
        }
      });
    }
  }

  // Sort by score and return top 10 matches
  return matches
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 10);
}

// Helper function to calculate distance between two points
function calculateDistance(point1: {lat: number, lng: number}, point2: {lat: number, lng: number}): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper function to get approximate coordinates from city names
function getCoordinatesFromCity(city: string, state: string): {lat: number, lng: number} {
  // Simplified Morocco coordinates mapping
  const cityCoords: {[key: string]: {lat: number, lng: number}} = {
    'casablanca': { lat: 33.5731, lng: -7.5898 },
    'rabat': { lat: 33.9716, lng: -6.8498 },
    'fes': { lat: 34.0331, lng: -5.0003 },
    'marrakech': { lat: 31.6295, lng: -7.9811 },
    'tangier': { lat: 35.7595, lng: -5.8340 },
    'agadir': { lat: 30.4278, lng: -9.5981 },
    'meknes': { lat: 33.8935, lng: -5.5473 },
    'oujda': { lat: 34.6814, lng: -1.9086 },
    'kenitra': { lat: 34.2610, lng: -6.5802 },
    'tetouan': { lat: 35.5889, lng: -5.3626 }
  };

  const key = city.toLowerCase();
  return cityCoords[key] || { lat: 33.5731, lng: -7.5898 }; // Default to Casablanca
}