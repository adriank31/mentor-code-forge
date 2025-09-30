import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@18.5.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    
    if (!signature || !webhookSecret || !stripeKey) {
      console.error('Missing required webhook configuration');
      return new Response('Webhook configuration error', { status: 400 });
    }

    const body = await req.text();
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    
    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id || session.client_reference_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        
        if (!userId) {
          console.error('No user_id found in checkout session');
          break;
        }

        // Get subscription details to determine end date
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        
        const { error } = await supabase
          .from('profiles')
          .update({
            is_pro: true,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_end: subscriptionEnd,
          })
          .eq('id', userId);
        
        if (error) {
          console.error('Error updating profile:', error);
        } else {
          console.log('✅ User upgraded to Pro:', userId);
        }
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        
        const { error } = await supabase
          .from('profiles')
          .update({
            is_pro: true,
            subscription_end: subscriptionEnd,
          })
          .eq('stripe_subscription_id', subscriptionId);
        
        if (error) {
          console.error('Error updating subscription:', error);
        } else {
          console.log('✅ Subscription renewed');
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;
        
        const { error } = await supabase
          .from('profiles')
          .update({
            is_pro: false,
            subscription_end: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionId);
        
        if (error) {
          console.error('Error canceling subscription:', error);
        } else {
          console.log('❌ Subscription canceled');
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('⚠️ Payment failed for customer:', invoice.customer);
        // Optionally notify user or take action
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