"use client";

import { Mail, MessageCircle, Phone, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
    const helpTopics = [
        {
            icon: HelpCircle,
            title: "Getting Started",
            description: "Learn how to browse, customize, and download your first flyer",
            link: "/howItWorks",
        },
        {
            icon: MessageCircle,
            title: "Account & Billing",
            description: "Manage your account, subscriptions, and payment methods",
            link: "/faq#billing",
        },
        {
            icon: Phone,
            title: "Technical Support",
            description: "Get help with downloads, file formats, and technical issues",
            link: "/contact",
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
                        Help <span className="text-red-500">Center</span>
                    </h1>
                    <p className="text-xl text-gray-400 text-center max-w-2xl mx-auto">
                        Find answers to your questions and get the support you need
                    </p>
                </div>
            </section>

            {/* Help Topics */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        {helpTopics.map((topic, index) => (
                            <a
                                key={index}
                                href={topic.link}
                                className="bg-gray-900 border border-gray-800 rounded-lg p-8 hover:border-red-500 transition-all duration-300 group"
                            >
                                <div className="flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-6 group-hover:bg-red-500/20 transition-colors">
                                    <topic.icon className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{topic.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {topic.description}
                                </p>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 px-4 bg-gray-900/50">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Still Need <span className="text-red-500">Help</span>?
                    </h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Our support team is here to assist you
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/contact">
                            <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg">
                                <Mail className="w-5 h-5 mr-2" />
                                Contact Support
                            </Button>
                        </a>
                        <a href="/faq">
                            <Button variant="outline" className="border-gray-700 hover:border-red-500 px-8 py-6 text-lg">
                                Browse FAQ
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
