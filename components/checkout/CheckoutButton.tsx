"use client";

import { loadStripe } from "@stripe/stripe-js";
import React from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Item {
    name: string;
    price: number;
    quantity: number;
}

interface Props {
    items: Item[];
}

const CheckoutButton: React.FC<Props> = ({ items }) => {
    const handleCheckout = async () => {
        const res = await fetch("/api/checkout/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
        });

        const data = await res.json();
        window.location.href = data.url; // Redirect to Stripe Checkout
    };

    return (
        <button
            onClick={handleCheckout}
            className="px-4 py-2 bg-blue-600 text-white rounded"
        >
            Checkout
        </button>
    );
};

export default CheckoutButton;
