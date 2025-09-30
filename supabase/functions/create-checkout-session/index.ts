import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STRIPE_PRICES = {
  monthly: 'price_1SDCXqPsOyMuSwL6i80Z8ETV',
  yearly: 'price_1SDCYWPsOyMuSwL6rsCV9fAP',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { interval } = await req.json();
    
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Stripe secret key not configured');
    }

    // Get authenticated user
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const baseUrl = req.headers.get('origin') || 'https://curecee.lovable.app';
    
    // Determine which price to use
    const stripePriceId = interval === 'year' ? STRIPE_PRICES.yearly : STRIPE_PRICES.monthly;

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'subscription',
        'line_items[0][price]': stripePriceId,
        'line_items[0][quantity]': '1',
        'success_url': `${baseUrl}/pricing?status=success&session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${baseUrl}/pricing?status=cancel`,
        'customer_email': user.email!,
        'client_reference_id': user.id,
        'metadata[user_id]': user.id,
        'metadata[interval]': interval,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Stripe API error:', error);
      throw new Error('Failed to create checkout session');
    }

    const session = await response.json();

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});