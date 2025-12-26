import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  return (
    <div>
      <h2 className="mb-3 text-lg font-medium">Quick actions</h2>
      <div className="grid grid-cols-2 gap-3">
        <Action href="/orders" label="My Orders">
          <IconOrders />
        </Action>
        <Action href="/favorites" label="Favorites">
          <IconHeart />
        </Action>
        <Action href="/messages" label="Messages">
          <IconMessage />
        </Action>
        <Action href="/payment-methods" label="Payment Methods">
          <IconCard />
        </Action>
      </div>
    </div>
  )
}

function Action({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <Button
      asChild
      variant="outline"
      className="justify-start gap-3 rounded-xl border-border/60 bg-card/60 hover:border-primary hover:text-primary"
    >
      <Link href={href} aria-label={label}>
        <span className="inline-flex h-5 w-5 items-center justify-center">{children}</span>
        <span className="text-sm">{label}</span>
      </Link>
    </Button>
  )
}

/* Minimal inline icons (no extra deps) */
function IconOrders() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path
        d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.65-7 10-7 10Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function IconMessage() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M21 12a8 8 0 1 1-3.3-6.46L21 6v6Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 12h6" strokeLinecap="round" />
    </svg>
  )
}
function IconCard() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </svg>
  )
}
