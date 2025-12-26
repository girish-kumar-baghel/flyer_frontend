import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text(); // IMPORTANT: raw body
  const signature = headers().get("stripe-signature") as string;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET! // from Stripe dashboard
    );

    // 🔥 Payment success event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("🎉 PAYMENT SUCCESSFUL");
      console.log("Customer:", session.customer_email);
      console.log("Amount Paid:", session.amount_total);
      console.log("Payment Intent:", session.payment_intent);

      // 👉 Save into DB if needed
      // await prisma.payment.create({...});
    }

    // ❌ Payment failed
    if (event.type === "checkout.session.async_payment_failed") {
      console.log("❌ Payment Failed");
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook Error:", err);
    return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
  }
}

// Disable body parser (very important)
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };


