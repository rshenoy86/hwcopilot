"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export async function createCheckoutSession() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, first_name")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/onboarding");

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_PRO!,
          quantity: 1,
        },
      ],
      customer: profile.stripe_customer_id || undefined,
      customer_email: !profile.stripe_customer_id ? user.email : undefined,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      metadata: {
        user_id: user.id,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
        },
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create checkout session";
    return { error: msg };
  }

  if (!session.url) {
    return { error: "Stripe did not return a checkout URL. Please try again." };
  }

  redirect(session.url);
}

export async function createPortalSession() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return { error: "No billing account found" };
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  });

  redirect(portalSession.url);
}
