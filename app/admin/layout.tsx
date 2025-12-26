import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - Grodify",
  description: "Admin panel for managing Grodify platform",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
