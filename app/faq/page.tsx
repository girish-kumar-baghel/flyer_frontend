"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            category: "General",
            questions: [
                {
                    q: "What is Grodify?",
                    a: "Grodify is a premium platform offering high-quality digital flyer templates for nightclubs, lounges, events, and businesses. Our templates are professionally designed and easy to customize.",
                },
                {
                    q: "How do I download a flyer?",
                    a: "Simply browse our collection, select a flyer you like, customize it if needed, add it to your cart, and complete the checkout process. You'll receive instant access to download your flyer in high resolution.",
                },
                {
                    q: "What file formats do you provide?",
                    a: "All flyers are provided in high-resolution PNG and PDF formats, perfect for both digital sharing and printing.",
                },
            ],
        },
        {
            category: "Pricing & Payment",
            questions: [
                {
                    q: "How much do flyers cost?",
                    a: "Our flyers are priced individually, with most templates ranging from $5 to $20. We also offer subscription plans for unlimited downloads.",
                },
                {
                    q: "What payment methods do you accept?",
                    a: "We accept all major credit cards, debit cards, and PayPal through our secure payment processor Stripe.",
                },
                {
                    q: "Do you offer refunds?",
                    a: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your purchase, contact us for a full refund.",
                },
            ],
        },
        {
            category: "Customization",
            questions: [
                {
                    q: "Can I customize the flyers?",
                    a: "Yes! All our templates are fully customizable. You can change text, colors, images, and more using our built-in editor or your preferred design software.",
                },
                {
                    q: "Do I need design skills?",
                    a: "No design skills required! Our templates are ready to use and easy to customize, even for beginners.",
                },
                {
                    q: "Can I use my own images?",
                    a: "Absolutely! You can upload and use your own images in any template.",
                },
            ],
        },
        {
            category: "Licensing",
            questions: [
                {
                    q: "Can I use flyers for commercial purposes?",
                    a: "Yes, all our flyers come with a commercial license. You can use them for your business, events, or client projects.",
                },
                {
                    q: "Can I resell the templates?",
                    a: "No, you cannot resell or redistribute the templates themselves. However, you can use them for unlimited client projects.",
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent" />
                <div className="container mx-auto max-w-4xl relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
                        Frequently Asked <span className="text-red-500">Questions</span>
                    </h1>
                    <p className="text-xl text-gray-400 text-center max-w-2xl mx-auto">
                        Find answers to common questions about Grodify
                    </p>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    {faqs.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="mb-12">
                            <h2 className="text-2xl font-bold mb-6 text-red-500">
                                {category.category}
                            </h2>
                            <div className="space-y-4">
                                {category.questions.map((faq, faqIndex) => {
                                    const globalIndex = categoryIndex * 100 + faqIndex;
                                    const isOpen = openIndex === globalIndex;

                                    return (
                                        <div
                                            key={faqIndex}
                                            className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-red-500/50 transition-colors"
                                        >
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                                                className="w-full flex items-center justify-between p-6 text-left"
                                            >
                                                <span className="font-semibold text-lg pr-8">{faq.q}</span>
                                                <ChevronDown
                                                    className={`w-5 h-5 text-red-500 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </button>
                                            {isOpen && (
                                                <div className="px-6 pb-6">
                                                    <p className="text-gray-400 leading-relaxed">{faq.a}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16 px-4 bg-gray-900/50">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Still Have <span className="text-red-500">Questions</span>?
                    </h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Our support team is here to help
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                    >
                        Contact Support
                    </a>
                </div>
            </section>
        </div>
    );
}
