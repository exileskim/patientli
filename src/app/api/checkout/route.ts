import { NextResponse } from 'next/server';
import { stripe, PLANS, PlanKey } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const { planKey, lookSlug } = await request.json();

    if (!planKey || !PLANS[planKey as PlanKey]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const plan = PLANS[planKey as PlanKey];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        planKey,
        lookSlug: lookSlug || '',
      },
      subscription_data: {
        metadata: {
          planKey,
          lookSlug: lookSlug || '',
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_creation: 'always',
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
