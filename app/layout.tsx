import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"
import "react-multi-carousel/lib/styles.css"
import { StoreProvider } from "@/stores/StoreProvider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import PageTransitionLoader from "@/components/ui/page-transition-loader"
import { FavoritesSync } from "@/components/favorites/FavoritesSync"


export const metadata: Metadata = {
  title: "Flyers - Premium Digital Flyers",
  description: "Professional flyer templates for nightclubs, lounges, and events",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AuthProvider>
          <Suspense fallback={null}>
            <StoreProvider>
              <FavoritesSync />
              <PageTransitionLoader />
              <Header />
              {children}
              <Footer />
            </StoreProvider>
            <Toaster position="top-left" />
            <Analytics />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}

// import type React from "react";
// import type { Metadata } from "next";
// import { GeistSans } from "geist/font/sans";
// import { GeistMono } from "geist/font/mono";
// import { Analytics } from "@vercel/analytics/next";
// import { Suspense } from "react";
// import { Toaster } from "@/components/ui/sonner";
// import "./globals.css";
// import "react-multi-carousel/lib/styles.css";
// import { StoreProvider } from "@/stores/StoreProvider";
// import { Header } from "@/components/layout/header";
// import { Footer } from "@/components/layout/footer";
// import AuthGuard from "@/components/AuthGuard";   // ← Added this

// export const metadata: Metadata = {
//   title: "Flyers - Premium Digital Flyers",
//   description: "Professional flyer templates for nightclubs, lounges, and events",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
//         <AuthGuard>
//           <Suspense fallback={null}>
//             <StoreProvider>
//               <Header />
//               {children}
//               <Footer />
//             </StoreProvider>

//             <Toaster position="top-left" />
//             <Analytics />
//           </Suspense>
//         </AuthGuard>
//       </body>
//     </html>
//   );
// }

