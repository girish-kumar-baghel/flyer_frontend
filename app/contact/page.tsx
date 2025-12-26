"use client";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { useLoading } from "@/hooks/useLoading";

export default function ContactPage() {
    const { withLoading } = useLoading();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await withLoading(async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success("Message sent! We'll get back to you soon.");
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, "Sending message...");
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
                        Contact <span className="text-red-500">Us</span>
                    </h1>
                    <p className="text-xl text-gray-400 text-center max-w-2xl mx-auto">
                        Have a question? We'd love to hear from you
                    </p>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Name</label>
                                    <Input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Your name"
                                        required
                                        className="bg-black border-gray-700 focus:border-red-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="your@email.com"
                                        required
                                        className="bg-black border-gray-700 focus:border-red-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Subject</label>
                                    <Input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="How can we help?"
                                        required
                                        className="bg-black border-gray-700 focus:border-red-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Message</label>
                                    <Textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Tell us more..."
                                        required
                                        rows={5}
                                        className="bg-black border-gray-700 focus:border-red-500"
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Message
                                </Button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 hover:border-red-500 transition-colors">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full">
                                        <Mail className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Email</h3>
                                        <p className="text-gray-400">support@grodify.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 hover:border-red-500 transition-colors">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full">
                                        <Phone className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Phone</h3>
                                        <p className="text-gray-400">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 hover:border-red-500 transition-colors">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full">
                                        <MapPin className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Address</h3>
                                        <p className="text-gray-400">123 Design Street<br />Creative City, CC 12345</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                                <h3 className="font-semibold text-lg mb-2">Response Time</h3>
                                <p className="text-gray-400">
                                    We typically respond within 24 hours during business days.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
