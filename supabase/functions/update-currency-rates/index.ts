
// Follow-up message needed for Supabase Edge Function implementation
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock function to simulate fetching from XE.com since direct API access requires authentication
// In a real implementation, you would need to subscribe to XE's API service
async function fetchLatestRates() {
  // This is a mock function that returns hardcoded exchange rates
  // In production, you would fetch from XE API with proper authentication
  const baseRates = {
    USD: {
      IDR: 15600, // Example rate
      EUR: 0.93,
      GBP: 0.79,
      JPY: 150.25,
      AUD: 1.53,
    },
    IDR: {
      USD: 0.000064, // Example rate (1/15600)
      EUR: 0.000060,
      GBP: 0.000051,
      JPY: 0.0096,
      AUD: 0.000098,
    }
  };
  
  return baseRates;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch latest rates
    const rates = await fetchLatestRates();
    
    // Update rates in the database
    const updates = [];
    
    for (const fromCurrency in rates) {
      for (const toCurrency in rates[fromCurrency]) {
        const rate = rates[fromCurrency][toCurrency];
        
        // Check if the rate already exists
        const { data: existingRate } = await supabase
          .from('currency_rates')
          .select('*')
          .eq('currency_from', fromCurrency)
          .eq('currency_to', toCurrency)
          .maybeSingle();
        
        if (existingRate) {
          // Update existing rate
          updates.push(
            supabase
              .from('currency_rates')
              .update({ 
                rate: rate,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingRate.id)
          );
        } else {
          // Insert new rate
          updates.push(
            supabase
              .from('currency_rates')
              .insert({
                currency_from: fromCurrency,
                currency_to: toCurrency,
                rate: rate
              })
          );
        }
      }
    }
    
    // Execute all updates
    await Promise.all(updates.map(update => update));
    
    return new Response(
      JSON.stringify({ success: true, message: 'Currency rates updated successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error updating currency rates:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
