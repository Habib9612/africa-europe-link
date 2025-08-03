import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MatchingRequest {
  shipment_id: string;
  filters?: {
    max_price?: number;
    min_rating?: number;
    equipment_type?: string;
    location_radius?: number;
  };
}

interface MatchResult {
  carrier_id: string;
  carrier_name: string;
  vehicle_id: string;
  vehicle_info: string;
  score: number;
  price: number;
  reasoning: string[];
  estimated_pickup: string;
  estimated_delivery: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { shipment_id, filters } = await req.json() as MatchingRequest

    if (!shipment_id) {
      throw new Error('shipment_id is required')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get shipment details
    const { data: shipment, error: shipmentError } = await supabase
      .from('shipments')
      .select('*')
      .eq('id', shipment_id)
      .single()

    if (shipmentError || !shipment) {
      throw new Error('Shipment not found')
    }

    // Get available carriers with vehicles
    let carriersQuery = supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        vehicles (
          id,
          equipment_type,
          status,
          make,
          model,
          year
        )
      `)
      .eq('role', 'carrier')

    // Apply filters
    if (filters?.min_rating) {
      // Note: This would need a ratings table in a real implementation
      carriersQuery = carriersQuery.gte('rating', filters.min_rating)
    }

    const { data: carriers, error: carriersError } = await carriersQuery

    if (carriersError) {
      throw carriersError
    }

    // Perform matching algorithm
    const matches = await performMatching(shipment, carriers || [], filters)

    return new Response(
      JSON.stringify({ 
        success: true, 
        matches,
        total_matches: matches.length,
        shipment_info: {
          id: shipment.id,
          origin: `${shipment.origin_city}, ${shipment.origin_state}`,
          destination: `${shipment.destination_city}, ${shipment.destination_state}`,
          equipment_type: shipment.equipment_type,
          weight: shipment.weight
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in AI matching function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function performMatching(shipment: any, carriers: any[], filters?: any): Promise<MatchResult[]> {
  const matches: MatchResult[] = []

  for (const carrier of carriers) {
    // Filter vehicles by equipment type and availability
    const compatibleVehicles = carrier.vehicles?.filter((vehicle: any) => 
      vehicle.equipment_type === shipment.equipment_type &&
      vehicle.status === 'available'
    ) || []

    for (const vehicle of compatibleVehicles) {
      const score = calculateMatchScore(carrier, vehicle, shipment, filters)
      
      if (score > 0.5) { // Only include matches with >50% score
        const price = calculatePrice(carrier, vehicle, shipment)
        
        // Apply price filter
        if (filters?.max_price && price > filters.max_price) {
          continue
        }

        const reasoning = generateReasoning(carrier, vehicle, shipment, score)
        
        matches.push({
          carrier_id: carrier.id,
          carrier_name: carrier.full_name,
          vehicle_id: vehicle.id,
          vehicle_info: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          score,
          price,
          reasoning,
          estimated_pickup: shipment.pickup_date,
          estimated_delivery: shipment.delivery_date
        })
      }
    }
  }

  // Sort by score (highest first) and return top matches
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
}

function calculateMatchScore(carrier: any, vehicle: any, shipment: any, filters?: any): number {
  const LOCATION_WEIGHT = 0.3
  const EQUIPMENT_WEIGHT = 0.25
  const PRICE_WEIGHT = 0.2
  const RATING_WEIGHT = 0.15
  const AVAILABILITY_WEIGHT = 0.1

  let totalScore = 0

  // Location proximity score (mock)
  const locationScore = 0.6 + Math.random() * 0.4
  totalScore += locationScore * LOCATION_WEIGHT

  // Equipment compatibility score
  const equipmentScore = vehicle.equipment_type === shipment.equipment_type ? 1.0 : 0.8
  totalScore += equipmentScore * EQUIPMENT_WEIGHT

  // Price competitiveness score
  const marketRate = shipment.rate
  const carrierRate = marketRate * (0.8 + Math.random() * 0.4)
  const priceScore = carrierRate <= marketRate * 0.9 ? 1.0 : 
                    carrierRate <= marketRate ? 0.8 : 
                    carrierRate <= marketRate * 1.1 ? 0.6 : 0.3
  totalScore += priceScore * PRICE_WEIGHT

  // Carrier rating score (mock)
  const ratingScore = (4.0 + Math.random() * 1.0) / 5.0
  totalScore += ratingScore * RATING_WEIGHT

  // Availability score (mock)
  const availabilityScore = 0.7 + Math.random() * 0.3
  totalScore += availabilityScore * AVAILABILITY_WEIGHT

  return Math.min(totalScore, 1.0)
}

function calculatePrice(carrier: any, vehicle: any, shipment: any): number {
  const baseRate = shipment.rate
  const distance = 500 + Math.random() * 1000 // Mock distance
  const weightMultiplier = shipment.weight / 1000
  
  return baseRate * distance * weightMultiplier * (0.9 + Math.random() * 0.2)
}

function generateReasoning(carrier: any, vehicle: any, shipment: any, score: number): string[] {
  const reasons: string[] = []

  if (score > 0.8) {
    reasons.push('Excellent match for your requirements')
  } else if (score > 0.6) {
    reasons.push('Good match with competitive pricing')
  } else {
    reasons.push('Suitable carrier for your shipment')
  }

  if (vehicle.equipment_type === shipment.equipment_type) {
    reasons.push('Perfect equipment type match')
  }

  if (score > 0.7) {
    reasons.push('Highly rated carrier with good track record')
  }

  if (Math.random() > 0.5) {
    reasons.push('Available for immediate pickup')
  }

  return reasons
}