"use client";

import { Check, Zap, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
    const plans = [
        {
            name: "Starter",
            icon: Sparkles,
            price: "9",
            period: "per flyer",
            description: "Perfect for occasional events",
            features: [
                "1 Premium Flyer Template",
                "High-Resolution Download",
                "PNG & PDF Formats",
                "Commercial License",
                "Basic Customization",
                "Email Support",
            ],
            buttonText: "Get Started",
            buttonVariant: "outline" as const,
            popular: false,
        },
        {
            name: "Pro",
            icon: Zap,
            price: "29",
            period: "per month",
            description: "Best for regular event organizers",
            features: [
                "10 Flyer Downloads/Month",
                "All Premium Templates",
                "High-Resolution Downloads",
                "PNG, PDF & PSD Formats",
                "Advanced Customization",
                "Priority Email Support",
                "Cancel Anytime",
            ],
            buttonText: "Start Free Trial",
            buttonVariant: "default" as const,
            popular: true,
        },
        {
            name: "Business",
            icon: Crown,
            price: "79",
            period: "per month",
            description: "For agencies and businesses",
            features: [
                "Unlimited Downloads",
                "All Premium Templates",
                "Early Access to New Designs",
                "All File Formats",
                "White-Label Options",
                "Dedicated Account Manager",
                "24/7 Priority Support",
                "Custom Templates on Request",
            ],
            buttonText: "Contact Sales",
            buttonVariant: "outline" as const,
            popular: false,
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
                        Simple, Transparent <span className="text-red-500">Pricing</span>
                    </h1>
                    <p className="text-xl text-gray-400 text-center max-w-2xl mx-auto">
                        Choose the perfect plan for your needs. All plans include commercial license.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative bg-gray-900 border rounded-lg p-8 hover:border-red-500 transition-all duration-300 ${plan.popular
                                        ? "border-red-500 scale-105 md:scale-110"
                                        : "border-gray-800"
                                    }`}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                        Most Popular
                                    </div>
                                )}

                                {/* Icon */}
                                <div className="flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-6">
                                    <plan.icon className="w-8 h-8 text-red-500" />
                                </div>

                                {/* Plan Name */}
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-gray-400 mb-6">{plan.description}</p>

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="flex items-baseline">
                                        <span className="text-5xl font-bold">${plan.price}</span>
                                        <span className="text-gray-400 ml-2">/{plan.period.split(" ")[1]}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{plan.period}</p>
                                </div>

                                {/* Features */}
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start space-x-3">
                                            <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <Button
                                    className={`w-full ${plan.buttonVariant === "default"
                                            ? "bg-red-500 hover:bg-red-600 text-white"
                                            : "border-gray-700 hover:border-red-500 bg-transparent"
                                        }`}
                                    variant={plan.buttonVariant}
                                    size="lg"
                                >
                                    {plan.buttonText}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-4 bg-gray-900/50">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Frequently Asked <span className="text-red-500">Questions</span>
                    </h2>
                    <div className="space-y-6">
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                            <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
                            <p className="text-gray-400">
                                Yes! You can cancel your subscription at any time. Your access will continue until the end of your current billing period.
                            </p>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                            <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
                            <p className="text-gray-400">
                                We accept all major credit cards, debit cards, and PayPal through our secure payment processor Stripe.
                            </p>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                            <h3 className="font-semibold text-lg mb-2">Do you offer refunds?</h3>
                            <p className="text-gray-400">
                                Yes, we offer a 30-day money-back guarantee on all plans. If you're not satisfied, contact us for a full refund.
                            </p>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                            <h3 className="font-semibold text-lg mb-2">Can I upgrade or downgrade my plan?</h3>
                            <p className="text-gray-400">
                                Absolutely! You can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Ready to Get <span className="text-red-500">Started</span>?
                    </h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Join thousands of event organizers creating stunning flyers
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/categories">
                            <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg">
                                Browse Templates
                            </Button>
                        </a>
                        <a href="/contact">
                            <Button variant="outline" className="border-gray-700 hover:border-red-500 px-8 py-6 text-lg">
                                Contact Sales
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
