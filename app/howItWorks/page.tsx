"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Mail, Smartphone, User, Play, CheckCircle, Clock, Star } from "lucide-react"
import { Header } from "@/components/layout/header"

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(1)

  const steps = [
    {
      id: 1,
      title: "Choose Your Flyer",
      description:
        "Browse our collection of 10,000+ professional flyer templates. Filter by category, price, and style to find the perfect design for your event.",
      icon: Search,
      details: [
        "Over 10,000 premium templates",
        "Categories: Halloween, Christmas, EDM, Ladies Night & more",
        "3 price tiers: Basic ($10), Regular ($15), Premium ($40)",
        "With or without photo options available",
      ],
      image: "/edm-dj-party-flyer-neon-lights.jpg",
    },
    {
      id: 2,
      title: "Fill Out Your Details",
      description:
        "Complete our easy order form with your event information, upload your photos and logos, and select any extra options you need.",
      icon: FileText,
      details: [
        "Event details: Title, date, venue information",
        "Upload up to 5 DJ/Artist photos",
        "Add venue, promoter, and sponsor logos",
        "Extra options: Story size, animations, custom changes",
      ],
      image: "/christmas-party-flyer-elegant-gold.jpg",
    },
    {
      id: 3,
      title: "Receive Your Flyer",
      description:
        "Get your completed flyer delivered via email, SMS, and your profile dashboard. Download instantly and start promoting your event!",
      icon: Mail,
      details: [
        "Multiple delivery methods: Email, SMS, Profile",
        "Instant download once ready",
        "High-quality files ready for print and digital use",
        "Reorder anytime from your profile",
      ],
      image: "/summer-beach-party-flyer-tropical.jpg",
    },
  ]

  const deliveryOptions = [
    { time: "24 hours", price: "FREE", popular: false },
    { time: "5 hours", price: "+$10", popular: true },
    { time: "1 hour", price: "+$20", popular: false },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-transparent" />
        <div className="relative max-w-4xl mx-auto">
          <Badge className="mb-6 bg-red-600 hover:bg-red-700 text-white">Simple Process</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            How <span className="text-red-500">Grodify</span> Works
          </h1>
          <p className="text-xl text-gray-300 mb-8 text-pretty max-w-2xl mx-auto">
            Get professional event flyers in just 3 simple steps. From selection to delivery, we make it easy to promote
            your events with stunning designs.
          </p>

          {/* Video Placeholder Section */}
          <div className="relative max-w-3xl mx-auto mb-12">
            <div className="aspect-video bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center group hover:border-red-500 transition-colors cursor-pointer">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-500 transition-colors">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Watch How It Works</h3>
                <p className="text-gray-400">See the complete process in action</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Step Navigation */}
          <div className="flex justify-center mb-16">
            <div className="flex items-center space-x-4 bg-gray-900 rounded-full p-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setActiveStep(step.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${
                      activeStep === step.id ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                    <span className="font-medium">Step {step.id}</span>
                  </button>
                  {index < steps.length - 1 && <div className="w-8 h-px bg-gray-700 mx-2" />}
                </div>
              ))}
            </div>
          </div>

          {/* Active Step Content */}
          {steps.map((step) => (
            <div
              key={step.id}
              className={`transition-all duration-500 ${activeStep === step.id ? "opacity-100" : "opacity-0 hidden"}`}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Badge className="mb-2 bg-red-600/20 text-red-400 border-red-600/30">Step {step.id}</Badge>
                      <h2 className="text-3xl font-bold">{step.title}</h2>
                    </div>
                  </div>

                  <p className="text-xl text-gray-300 mb-8 text-pretty">{step.description}</p>

                  <div className="space-y-4">
                    {step.details.map((detail, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{detail}</span>
                      </div>
                    ))}
                  </div>

                  {step.id === 1 && (
                    <div className="mt-8">
                      <Link href="/catalog">
                        <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">Browse Flyers</Button>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="aspect-[4/5] relative rounded-xl overflow-hidden border border-gray-800">
                    <img
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery Options Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Choose Your Delivery Speed</h2>
          <p className="text-gray-300 mb-12 text-pretty">
            Select the delivery option that works best for your timeline
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {deliveryOptions.map((option, index) => (
              <Card
                key={index}
                className={`bg-gray-800 border-gray-700 relative ${option.popular ? "border-red-500 scale-105" : ""}`}
              >
                {option.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">{option.time}</h3>
                  <p className="text-2xl font-bold text-red-500 mb-4">{option.price}</p>
                  <p className="text-gray-400 text-sm">
                    Perfect for{" "}
                    {option.time === "24 hours"
                      ? "planned events"
                      : option.time === "5 hours"
                        ? "same-day promotion"
                        : "urgent last-minute events"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Grodify?</h2>
            <p className="text-gray-300 text-pretty max-w-2xl mx-auto">
              We make professional flyer creation simple, fast, and affordable for all your events
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Star,
                title: "10,000+ Templates",
                description: "Massive collection of professional designs",
              },
              {
                icon: User,
                title: "Easy Customization",
                description: "Simple form-based editing process",
              },
              {
                icon: Smartphone,
                title: "Multi-Platform Delivery",
                description: "Email, SMS, and profile access",
              },
              {
                icon: CheckCircle,
                title: "Quality Guaranteed",
                description: "Professional results every time",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-pretty">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-900/20 to-red-800/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Create Your Flyer?</h2>
          <p className="text-xl text-gray-300 mb-8 text-pretty">
            Join thousands of event organizers who trust Grodify for their promotional needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">Start Creating</Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3 bg-transparent"
              >
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
