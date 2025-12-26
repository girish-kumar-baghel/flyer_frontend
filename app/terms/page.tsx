"use client";

import { FileText, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent" />
                <div className="container mx-auto max-w-4xl relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
                        Terms of <span className="text-red-500">Service</span>
                    </h1>
                    <p className="text-xl text-gray-400 text-center max-w-2xl mx-auto">
                        Please read these terms carefully before using our services
                    </p>
                    <p className="text-sm text-gray-500 text-center mt-4">
                        Last updated: December 5, 2024
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl space-y-8">
                    {/* Acceptance */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full">
                                <FileText className="w-6 h-6 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold">Acceptance of Terms</h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            By accessing and using Grodify, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>
                    </div>

                    {/* License */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full">
                                <CheckCircle2 className="w-6 h-6 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold">License to Use</h2>
                        </div>
                        <div className="space-y-4 text-gray-400">
                            <p className="font-semibold text-white">You MAY:</p>
                            <ul className="space-y-2 ml-6">
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>Use flyers for personal or commercial projects</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>Modify and customize the templates</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>Use for unlimited client projects</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>Print and distribute the final designs</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Restrictions */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full">
                                <XCircle className="w-6 h-6 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold">Restrictions</h2>
                        </div>
                        <div className="space-y-4 text-gray-400">
                            <p className="font-semibold text-white">You MAY NOT:</p>
                            <ul className="space-y-2 ml-6">
                                <li className="flex items-start space-x-2">
                                    <span className="text-red-500 mt-1">✗</span>
                                    <span>Resell or redistribute the templates</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-red-500 mt-1">✗</span>
                                    <span>Share your account credentials</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-red-500 mt-1">✗</span>
                                    <span>Claim the templates as your own work</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-red-500 mt-1">✗</span>
                                    <span>Use templates for illegal purposes</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-4">Payment Terms</h2>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            All payments are processed securely through Stripe. Prices are in USD and may be subject to applicable taxes. By making a purchase, you agree to provide accurate payment information.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            Subscriptions renew automatically unless cancelled before the renewal date. You can cancel your subscription at any time from your account settings.
                        </p>
                    </div>

                    {/* Intellectual Property */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
                        <p className="text-gray-400 leading-relaxed">
                            All templates, designs, and content on Grodify are protected by copyright and other intellectual property laws. The purchase of a template grants you a license to use it as specified in these terms, but does not transfer ownership of the intellectual property.
                        </p>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full">
                                <AlertCircle className="w-6 h-6 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold">Disclaimer</h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            Our services are provided "as is" without warranties of any kind. We do not guarantee that our services will be uninterrupted or error-free. We are not liable for any damages arising from the use of our services.
                        </p>
                    </div>

                    {/* Changes */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
                        <p className="text-gray-400 leading-relaxed">
                            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of our services after changes constitutes acceptance of the modified terms.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 px-4 bg-gray-900/50">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Questions About Our <span className="text-red-500">Terms</span>?
                    </h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Contact us if you need clarification on any of these terms
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
