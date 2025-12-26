"use client";

import { RefreshCcw, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function RefundPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent" />
                <div className="container mx-auto max-w-4xl relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
                        Refund <span className="text-red-500">Policy</span>
                    </h1>
                    <p className="text-xl text-gray-400 text-center max-w-2xl mx-auto">
                        We stand behind our products with a 30-day money-back guarantee
                    </p>
                    <p className="text-sm text-gray-500 text-center mt-4">
                        Last updated: December 5, 2024
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl space-y-8">
                    {/* 30-Day Guarantee */}
                    <div className="bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 rounded-lg p-8">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-full">
                                <RefreshCcw className="w-6 h-6 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold">30-Day Money-Back Guarantee</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            We offer a full refund within 30 days of purchase if you're not completely satisfied with your flyer template. No questions asked.
                        </p>
                    </div>

                    {/* Eligible for Refund */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full">
                                <CheckCircle2 className="w-6 h-6 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold">Eligible for Refund</h2>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <span className="text-green-500 mt-1">✓</span>
                                <span className="text-gray-400">Purchase made within the last 30 days</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span className="text-green-500 mt-1">✓</span>
                                <span className="text-gray-400">Technical issues preventing download</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span className="text-green-500 mt-1">✓</span>
                                <span className="text-gray-400">Product significantly different from description</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span className="text-green-500 mt-1">✓</span>
                                <span className="text-gray-400">File corruption or quality issues</span>
                            </li>
                        </ul>
                    </div>

                    {/* Not Eligible */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full">
                                <XCircle className="w-6 h-6 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold">Not Eligible for Refund</h2>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <span className="text-red-500 mt-1">✗</span>
                                <span className="text-gray-400">Purchase made more than 30 days ago</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span className="text-red-500 mt-1">✗</span>
                                <span className="text-gray-400">Changed your mind after customizing</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span className="text-red-500 mt-1">✗</span>
                                <span className="text-gray-400">Subscription cancellations (no partial refunds)</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span className="text-red-500 mt-1">✗</span>
                                <span className="text-gray-400">Violation of Terms of Service</span>
                            </li>
                        </ul>
                    </div>

                    {/* How to Request */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">How to Request a Refund</h2>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="flex items-center justify-center w-8 h-8 bg-red-500/10 rounded-full flex-shrink-0 mt-1">
                                    <span className="text-red-500 font-bold">1</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Contact Support</h3>
                                    <p className="text-gray-400">Email us at support@grodify.com with your order number</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="flex items-center justify-center w-8 h-8 bg-red-500/10 rounded-full flex-shrink-0 mt-1">
                                    <span className="text-red-500 font-bold">2</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Provide Details</h3>
                                    <p className="text-gray-400">Explain the reason for your refund request</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="flex items-center justify-center w-8 h-8 bg-red-500/10 rounded-full flex-shrink-0 mt-1">
                                    <span className="text-red-500 font-bold">3</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Receive Confirmation</h3>
                                    <p className="text-gray-400">We'll process your request within 24-48 hours</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Processing Time */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full">
                                <Clock className="w-6 h-6 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold">Processing Time</h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            Once your refund is approved, it will be processed within 5-7 business days. The refund will be credited to your original payment method.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            Please note that it may take additional time for your bank or credit card company to process and post the refund to your account.
                        </p>
                    </div>

                    {/* Subscription Refunds */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-4">Subscription Refunds</h2>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            For subscription plans, you can cancel at any time. However, we do not offer partial refunds for unused time on active subscriptions.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            Your subscription will remain active until the end of your current billing period. After cancellation, you will not be charged for subsequent periods.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 px-4 bg-gray-900/50">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Need a <span className="text-red-500">Refund</span>?
                    </h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Contact our support team to start the refund process
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
