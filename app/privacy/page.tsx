"use client";

import { Shield, Lock, Eye, UserCheck } from "lucide-react";

export default function PrivacyPage() {
    const sections = [
        {
            icon: Shield,
            title: "Information We Collect",
            content: [
                "Personal information (name, email, billing address)",
                "Payment information (processed securely through Stripe)",
                "Usage data (pages visited, features used)",
                "Device information (browser type, IP address)",
            ],
        },
        {
            icon: Lock,
            title: "How We Use Your Information",
            content: [
                "Process your orders and deliver purchased flyers",
                "Send order confirmations and updates",
                "Improve our services and user experience",
                "Send promotional emails (you can opt-out anytime)",
            ],
        },
        {
            icon: Eye,
            title: "Information Sharing",
            content: [
                "We never sell your personal information",
                "Payment processing through Stripe (PCI compliant)",
                "Analytics providers (Google Analytics)",
                "Legal requirements (if required by law)",
            ],
        },
        {
            icon: UserCheck,
            title: "Your Rights",
            content: [
                "Access your personal data",
                "Request data deletion",
                "Opt-out of marketing emails",
                "Update your information anytime",
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
                        Privacy <span className="text-red-500">Policy</span>
                    </h1>
                    <p className="text-xl text-gray-400 text-center max-w-2xl mx-auto">
                        Your privacy is important to us. Learn how we protect your data.
                    </p>
                    <p className="text-sm text-gray-500 text-center mt-4">
                        Last updated: December 5, 2024
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="space-y-12">
                        {sections.map((section, index) => (
                            <div
                                key={index}
                                className="bg-gray-900 border border-gray-800 rounded-lg p-8 hover:border-red-500/50 transition-colors"
                            >
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full">
                                        <section.icon className="w-6 h-6 text-red-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold">{section.title}</h2>
                                </div>
                                <ul className="space-y-3">
                                    {section.content.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-start space-x-3">
                                            <span className="text-red-500 mt-1">•</span>
                                            <span className="text-gray-400">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Additional Sections */}
                    <div className="mt-12 space-y-8">
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                            <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                            <p className="text-gray-400 leading-relaxed">
                                We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted using SSL technology and processed through Stripe, a PCI-compliant payment processor. We regularly update our security practices to ensure your data remains safe.
                            </p>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                            <h2 className="text-2xl font-bold mb-4">Cookies</h2>
                            <p className="text-gray-400 leading-relaxed">
                                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences. Essential cookies are required for the site to function properly.
                            </p>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
                            <p className="text-gray-400 leading-relaxed">
                                Our services are not directed to children under 13. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                            </p>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                            <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
                            <p className="text-gray-400 leading-relaxed">
                                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 px-4 bg-gray-900/50">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Questions About <span className="text-red-500">Privacy</span>?
                    </h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Contact us if you have any questions about our privacy practices
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                    >
                        Contact Us
                    </a>
                </div>
            </section>
        </div>
    );
}
