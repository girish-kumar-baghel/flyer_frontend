import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-7 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="flex flex-col col-span-2 md:col-span-1">
            <div className="flex space-x-2">
              <Image src='/logo.png' alt="logo" width={10} height={1} className="w-32 h-20 object-contain block" />
            </div>
            <p className="text-muted-foreground text-sm">
              Premium digital flyer templates for nightclubs, lounges, and events.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-card-foreground">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/howItWorks" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                How It Works
              </Link>
              <Link href="/categories" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Browse Flyers
              </Link>
              <Link
                href="/categories"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Categories
              </Link>
              <Link
                href="/pricing"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Pricing
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-card-foreground">Support</h3>
            <div className="space-y-2">
              <Link href="/help" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Help Center
              </Link>
              <Link
                href="/contact"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Contact Us
              </Link>
              <Link href="/faq" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                FAQ
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-card-foreground">Legal</h3>
            <div className="space-y-2">
              <Link
                href="/privacy"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/refund" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">© 2024 Grodify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
