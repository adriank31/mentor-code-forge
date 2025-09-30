import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!signature || !webhookSecret) {
      console.error('Missing signature or webhook secret');
      return new Response('Webhook signature verification failed', { status: 400 });
    }

    const body = await req.text();
    
    // In a real implementation, you'd verify the webhook signature here
    // For test mode, we'll skip verification but log it
    console.log('Webhook received:', body.substring(0, 100) + '...');
    
    const event = JSON.parse(body);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        
        console.log('Checkout completed for customer:', customerId);
        
        // In a real app, you'd update the user's subscription status here
        // For now, we'll just log it
        console.log('Would update user subscription:', {
          customerId,
          subscriptionId,
          status: 'active'
        });
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const subscriptionId = invoice.subscription;
        
        console.log('Payment succeeded for customer:', customerId);
        
        // Update subscription status to active
        console.log('Would ensure user is Pro:', {
          customerId,
          subscriptionId,
          status: 'active'
        });
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        console.log('Subscription deleted for customer:', customerId);
        
        // Downgrade user to free tier
        console.log('Would downgrade user to free:', {
          customerId,
          status: 'canceled'
        });
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        
        console.log('Payment failed for customer:', customerId);
        
        // Handle payment failure (e.g., send notification)
        console.log('Would handle payment failure for:', customerId);
        break;
      }
      
      default:
        console.log('Unhandled webhook event type:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});