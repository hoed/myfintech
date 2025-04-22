
// Follow-up message needed for Supabase Edge Function implementation
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Using the free API from ExchangeRate-API
async function fetchLatestRates() {
  try {
    // Free API endpoint - no API key required
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("API Response:", JSON.stringify(data));
    
    if (!data.rates) {
      throw new Error('Invalid API response format');
    }
    
    // Format the rates for our database
    const baseRates = {
      USD: {},
      IDR: {}
    };
    
    // USD to other currencies
    for (const currency in data.rates) {
      if (currency !== 'USD') {
        baseRates.USD[currency] = data.rates[currency];
      }
    }
    
    // IDR to other currencies (using USD/IDR as base for conversion)
    const idrRate = data.rates.IDR;
    if (idrRate) {
      for (const currency in data.rates) {
        if (currency !== 'IDR') {
          // Calculate IDR to other currency rate
          baseRates.IDR[currency] = data.rates[currency] / idrRate;
        }
      }
    }
    
    console.log("Formatted rates:", JSON.stringify(baseRates));
    return baseRates;
  } catch (error) {
    console.error("Error fetching rates:", error);
    throw error;
  }
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
    
    console.log("Fetching latest rates...");
    // Fetch latest rates
    const rates = await fetchLatestRates();
    
    // Update rates in the database
    const updates = [];
    
    for (const fromCurrency in rates) {
      for (const toCurrency in rates[fromCurrency]) {
        const rate = rates[fromCurrency][toCurrency];
        
        console.log(`Processing rate: ${fromCurrency} to ${toCurrency} = ${rate}`);
        
        // Check if the rate already exists
        const { data: existingRate } = await supabase
          .from('currency_rates')
          .select('*')
          .eq('currency_from', fromCurrency)
          .eq('currency_to', toCurrency)
          .maybeSingle();
        
        if (existingRate) {
          // Update existing rate
          console.log(`Updating existing rate: ${fromCurrency} to ${toCurrency}`);
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
          console.log(`Inserting new rate: ${fromCurrency} to ${toCurrency}`);
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
    console.log(`Executing ${updates.length} database updates`);
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
