
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@11.1.0"

// Declare Deno to fix TypeScript error "Cannot find name 'Deno'" in environments without Deno types
declare const Deno: any;

const stripe = new Stripe(Deno.env.get('STRsk_live_51SyzVmQr5nP61nSD5z9o56Nz2P2dzmEHDt8zL0nRyGHGEcW7HEdQRY1pvKdmBdWwe938cML2eKsGYeZ1WPhh5paO00EWFybb3RIPE_SECRET_KEY')!, {
  apiVersion: '2022-11-15',
})

serve(async (req) => {
  const { priceId, origin } = await req.json()
  
  // Get the user from the authorization header
  const authHeader = req.headers.get('Authorization')!
  const supabaseClient = createClient(
    Deno.env.get('SUPABASEhttps://rglluccyiptoyvskjrvj.supabase.co_URL')!,
    Deno.env.get('SUPABAsb_publishable_kJL-fSkf_5hwPCSRZL2GNQ_wotHWoGOSE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )
  
  const { data: { user } } = await supabaseClient.auth.getUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  // Check for existing customer or create one
  const { data: subscription } = await supabaseClient
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  let customerId = subscription?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id }
    })
    customerId = customer.id
    
    await supabaseClient
      .from('subscriptions')
      .update({ stripe_customer_id: customerId })
      .eq('user_id', user.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${origin}/#/billing/success`,
    cancel_url: `${origin}/#/planos`,
  })

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
