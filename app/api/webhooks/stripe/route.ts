import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from "@supabase/supabase-js";

// Initialize securely and bypass Next.js build-time static data collection errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

const stripeSecret = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const stripe = new Stripe(stripeSecret, {
    apiVersion: '2025-10-27' as any, // Typed as any to bypass potential version mismatch in types
});

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        // 1. Extract Project Metadata (Assumes you pass 'projectName' to Stripe)
        const projectName = session.metadata?.projectName || 'General Revenue';
        const amount = session.amount_total ? session.amount_total / 100 : 0;

        console.log(`Processing successful payment for project: ${projectName}, Amount: $${amount}`);

        // 2. LOG FINANCIAL INTELLIGENCE
        const { error: financialError } = await supabase.from('project_intelligence').insert([{
            agent_role: 'CFO Agent',
            category: 'Financial Log',
            content: {
                project: projectName,
                amount: amount,
                customer: session.customer_details?.email,
                summary: `💰 Revenue Verified: $${amount.toFixed(2)} credited to ${projectName}`,
                details: `Session ID: ${session.id}`
            },
            status: 'completed'
        }]);

        if (financialError) {
            console.error('Error logging financial intelligence:', financialError);
        }

        // 3. LOG SECURITY WARDEN VERIFICATION
        const { error: securityError } = await supabase.from('project_intelligence').insert([{
            agent_role: 'Security Warden',
            category: 'Security Alert',
            content: {
                project: projectName,
                alert: 'Transaction Verified',
                details: `Encrypted handshake confirmed for session ${session.id}`
            },
            status: 'active'
        }]);

        if (securityError) {
            console.error('Error logging security verification:', securityError);
        }
    }

    return NextResponse.json({ received: true });
}
