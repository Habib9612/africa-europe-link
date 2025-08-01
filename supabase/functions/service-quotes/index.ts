import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, company_id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const quoteId = pathParts[pathParts.length - 1];

    switch (req.method) {
      case 'GET':
        if (quoteId && quoteId !== 'service-quotes') {
          // Get specific quote
          const { data: quote, error } = await supabase
            .from('service_quotes')
            .select(`
              *,
              customers(name, email),
              shipments(origin_city, origin_state, destination_city, destination_state)
            `)
            .eq('id', quoteId)
            .eq('user_id', user.id)
            .single();

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(quote),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          // Get all quotes
          const { data: quotes, error } = await supabase
            .from('service_quotes')
            .select(`
              *,
              customers(name, email)
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
            JSON.stringify(quotes),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      case 'POST':
        if (url.pathname.includes('/generate')) {
          // Generate new quote
          const quoteRequest = await req.json();
          
          // Calculate pricing based on various factors
          const pricing = await calculatePricing(quoteRequest);
          
          const { data, error } = await supabase
            .from('service_quotes')
            .insert({
              user_id: user.id,
              customer_id: quoteRequest.customer_id,
              shipment_id: quoteRequest.shipment_id,
              quote_number: generateQuoteNumber(),
              base_rate: pricing.base_rate,
              fuel_surcharge: pricing.fuel_surcharge,
              additional_fees: pricing.additional_fees,
              total_amount: pricing.total_amount,
              valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
              terms_conditions: getDefaultTermsAndConditions(),
              status: 'draft'
            })
            .select()
            .single();

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(data),
            { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          // Create custom quote
          const quoteData = await req.json();
          
          const { data, error } = await supabase
            .from('service_quotes')
            .insert({
              ...quoteData,
              user_id: user.id,
              quote_number: generateQuoteNumber()
            })
            .select()
            .single();

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(data),
            { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      case 'PUT':
        if (url.pathname.includes('/send')) {
          // Send quote to customer
          const { data, error } = await supabase
            .from('service_quotes')
            .update({ 
              status: 'sent',
              sent_at: new Date().toISOString()
            })
            .eq('id', quoteId)
            .eq('user_id', user.id)
            .select()
            .single();

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Here you could integrate with email service to actually send the quote
          
          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else if (url.pathname.includes('/accept')) {
          // Customer accepts quote
          const { data, error } = await supabase
            .from('service_quotes')
            .update({ 
              status: 'accepted',
              accepted_at: new Date().toISOString()
            })
            .eq('id', quoteId)
            .select()
            .single();

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          // Update quote
          const updateData = await req.json();
          
          const { data, error } = await supabase
            .from('service_quotes')
            .update(updateData)
            .eq('id', quoteId)
            .eq('user_id', user.id)
            .select()
            .single();

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in service-quotes function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function calculatePricing(request: any) {
  // Base pricing calculation
  const distance = request.distance || 100; // miles
  const weight = request.weight || 1000; // lbs
  const equipmentType = request.equipment_type || 'dry_van';
  
  // Base rate per mile
  const baseRatePerMile = getBaseRateByEquipment(equipmentType);
  const baseRate = distance * baseRatePerMile;
  
  // Weight surcharge
  const weightSurcharge = weight > 26000 ? (weight - 26000) * 0.1 : 0;
  
  // Fuel surcharge (15% of base rate)
  const fuelSurcharge = baseRate * 0.15;
  
  // Additional fees
  const additionalFees = {
    detention: 0,
    loading_unloading: 50,
    insurance: baseRate * 0.02
  };
  
  const totalAdditionalFees = Object.values(additionalFees).reduce((sum, fee) => sum + fee, 0);
  
  const totalAmount = baseRate + weightSurcharge + fuelSurcharge + totalAdditionalFees;
  
  return {
    base_rate: Math.round(baseRate * 100) / 100,
    fuel_surcharge: Math.round(fuelSurcharge * 100) / 100,
    additional_fees: Math.round(totalAdditionalFees * 100) / 100,
    total_amount: Math.round(totalAmount * 100) / 100,
    breakdown: {
      base_rate_per_mile: baseRatePerMile,
      distance,
      weight_surcharge: weightSurcharge,
      additional_fees: additionalFees
    }
  };
}

function getBaseRateByEquipment(equipmentType: string): number {
  const rates = {
    'dry_van': 2.50,
    'refrigerated': 3.00,
    'flatbed': 2.75,
    'tanker': 3.25,
    'container': 2.60
  };
  
  return rates[equipmentType] || rates['dry_van'];
}

function generateQuoteNumber(): string {
  const prefix = 'QT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

function getDefaultTermsAndConditions(): string {
  return `
1. Payment Terms: Net 30 days from invoice date
2. Fuel surcharge subject to change based on current fuel prices
3. Additional charges may apply for detention, loading/unloading assistance
4. Quote valid for 7 days from issue date
5. All shipments subject to standard terms and conditions
6. Insurance coverage included up to $100,000
7. Shipper is responsible for proper packaging and documentation
8. Claims must be reported within 24 hours of delivery
  `.trim();
}