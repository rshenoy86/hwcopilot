import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  // Log event for debugging
  await supabase.from("stripe_events").insert({
    event_id: event.id,
    event_type: event.type,
    data: event.data,
  }).then(({ error }) => {
    if (error) console.error("Failed to log stripe event:", error);
  });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;

        if (!userId) {
          console.error("No user_id in checkout session metadata");
          break;
        }

        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        await supabase
          .from("profiles")
          .update({
            subscription_status: "pro",
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            worksheet_monthly_limit: 250,
          })
          .eq("user_id", userId);

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabase
          .from("profiles")
          .update({
            subscription_status: "free",
            stripe_subscription_id: null,
            worksheet_monthly_limit: 10,
          })
          .eq("stripe_customer_id", customerId);

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const status = subscription.status;
        // Handle failed payments / paused subscriptions
        if (status === "active" || status === "trialing") {
          await supabase
            .from("profiles")
            .update({
              subscription_status: "pro",
              worksheet_monthly_limit: 250,
            })
            .eq("stripe_customer_id", customerId);
        } else if (status === "past_due" || status === "canceled" || status === "unpaid") {
          await supabase
            .from("profiles")
            .update({
              subscription_status: "free",
              worksheet_monthly_limit: 10,
            })
            .eq("stripe_customer_id", customerId);
        }

        break;
      }

      default:
        // Unhandled event type - no action needed
        break;
    }
  } catch (err) {
    console.error(`Error handling Stripe event ${event.type}:`, err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
