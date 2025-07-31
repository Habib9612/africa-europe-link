import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { 
      origin_city, 
      origin_state, 
      destination_city, 
      destination_state,
      weight,
      equipment_type,
      urgency = "standard",
      distance_km = null
    } = body;

    // AI-powered pricing calculation
    const pricing = calculateDynamicPricing({
      origin: `${origin_city}, ${origin_state}`,
      destination: `${destination_city}, ${destination_state}`,
      weight,
      equipment_type,
      urgency,
      distance_km
    });

    return new Response(JSON.stringify(pricing), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Pricing engine error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

function calculateDynamicPricing(params: {
  origin: string;
  destination: string;
  weight: number;
  equipment_type: string;
  urgency: string;
  distance_km?: number;
}) {
  // Mock distance calculation if not provided
  const distance = params.distance_km || calculateMockDistance(params.origin, params.destination);
  
  // Base rates per km by equipment type (in EUR)
  const baseRates = {
    dry_van: 1.2,
    refrigerated: 1.8,
    flatbed: 1.4,
    tanker: 2.0,
    container: 1.3
  };

  const baseRate = baseRates[params.equipment_type as keyof typeof baseRates] || 1.2;
  
  // Distance-based pricing
  let price = distance * baseRate;
  
  // Weight factor (for loads over 10 tons)
  if (params.weight > 10000) {
    const weightMultiplier = 1 + ((params.weight - 10000) / 20000) * 0.3;
    price *= weightMultiplier;
  }
  
  // Urgency multiplier
  const urgencyMultipliers = {
    urgent: 1.5,
    standard: 1.0,
    economy: 0.8
  };
  
  price *= urgencyMultipliers[params.urgency as keyof typeof urgencyMultipliers] || 1.0;
  
  // Market conditions (mock fluctuation)
  const marketFactor = 0.9 + (Math.random() * 0.2); // ±10% market variation
  price *= marketFactor;
  
  // Fuel surcharge (mock 8-15%)
  const fuelSurcharge = price * (0.08 + Math.random() * 0.07);
  
  // Calculate breakdown
  const subtotal = Math.round(price * 100) / 100;
  const fuel = Math.round(fuelSurcharge * 100) / 100;
  const tax = Math.round((subtotal + fuel) * 0.20 * 100) / 100; // 20% VAT
  const total = subtotal + fuel + tax;
  
  // Generate alternative pricing options
  const alternatives = [
    {
      type: "economy",
      price: Math.round(total * 0.85 * 100) / 100,
      delivery_time: "5-7 days",
      description: "Standard delivery with flexible timing"
    },
    {
      type: "standard",
      price: Math.round(total * 100) / 100,
      delivery_time: "3-5 days",
      description: "Reliable delivery within business days"
    },
    {
      type: "express",
      price: Math.round(total * 1.3 * 100) / 100,
      delivery_time: "1-2 days",
      description: "Priority delivery with dedicated transport"
    }
  ];
  
  return {
    pricing: {
      base_price: subtotal,
      fuel_surcharge: fuel,
      tax: tax,
      total: total,
      currency: "EUR",
      distance_km: distance,
      rate_per_km: baseRate
    },
    alternatives,
    factors: {
      distance_factor: distance > 500 ? "long_haul" : "regional",
      weight_factor: params.weight > 10000 ? "heavy" : "standard",
      equipment_factor: params.equipment_type,
      urgency_factor: params.urgency,
      market_conditions: marketFactor > 1.05 ? "high_demand" : marketFactor < 0.95 ? "low_demand" : "normal"
    },
    valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  };
}

function calculateMockDistance(origin: string, destination: string): number {
  // Mock distance calculation based on city pairs
  const distances: { [key: string]: number } = {
    // Morocco domestic routes
    "casablanca-rabat": 87,
    "casablanca-marrakech": 240,
    "casablanca-fes": 300,
    "rabat-fes": 200,
    "marrakech-agadir": 250,
    
    // Morocco to Europe routes
    "casablanca-madrid": 1050,
    "casablanca-barcelona": 1200,
    "casablanca-marseille": 1400,
    "tangier-gibraltar": 35,
    "tangier-sevilla": 350,
    
    // European routes
    "madrid-barcelona": 620,
    "madrid-paris": 1270,
    "barcelona-marseille": 350,
    "paris-berlin": 1050,
    "berlin-amsterdam": 580
  };
  
  // Create a simple key from origin and destination
  const key1 = `${origin.toLowerCase().replace(/[^a-z]/g, '')}-${destination.toLowerCase().replace(/[^a-z]/g, '')}`;
  const key2 = `${destination.toLowerCase().replace(/[^a-z]/g, '')}-${origin.toLowerCase().replace(/[^a-z]/g, '')}`;
  
  // Look up distance or generate a realistic estimate
  return distances[key1] || distances[key2] || (300 + Math.random() * 800);
}