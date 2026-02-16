import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const session = await stripe.billingPortal.sessions.create({
    customer: "cus_placeholder",
    return_url: process.env.NEXT_PUBLIC_APP_URL + "/billing"
  });

  return NextResponse.json({ ok: true, url: session.url });
}
