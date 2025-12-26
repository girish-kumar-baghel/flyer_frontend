import { SAMPLE_FLYERS } from "@/lib/types"

export interface OrderItem {
  id: string
  flyerId: string
  flyerName: string
  flyerImage: string
  price: number
  priceType: "basic" | "regular" | "premium"
  hasPhotos: boolean
  extras: {
    storySize: boolean
    makeDifferent: boolean
    animated: boolean
    instagramPost: boolean
  }
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  orderDetails: {
    presenting: string
    mainTitle: string
    date: string
    eventInformation: string
    mainDJ: string
    additionalDJs: string[]
    hostedBy: string
    address: string
    phoneNumber: string
    venueLogo?: File
    promoterLogo?: File
    sponsorLogo?: File
    customNotes: string
    uploadedImages: File[]
  }
  deliveryOption: "24hours" | "5hours" | "1hour"
  status: "pending" | "in-progress" | "designing" | "ready" | "delivered"
  totalAmount: number
  createdAt: string
  updatedAt: string
  deliveryDeadline: string
  trackingUpdates: {
    status: string
    message: string
    timestamp: string
  }[]
}

export const DELIVERY_OPTIONS = [
  { value: "24hours", label: "24 Hours", price: 0, description: "Standard delivery - Free" },
  { value: "5hours", label: "5 Hours", price: 10, description: "Fast delivery - $10 extra" },
  { value: "1hour", label: "1 Hour", price: 20, description: "Express delivery - $20 extra" },
] as const

export const ORDER_STATUSES = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  "in-progress": { label: "In Progress", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  designing: { label: "Designing", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  ready: { label: "Ready", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  delivered: { label: "Delivered", color: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
}

// Mock orders data
export const SAMPLE_ORDERS: Order[] = [
  {
    id: "ORD-001",
    userId: "1",
    items: [
      {
        id: "1",
        flyerId: "f1",
        flyerName: "Neon Nights Party",
        flyerImage: "/pic10.jpg",
        price: 15,
        priceType: "regular",
        hasPhotos: true,
        extras: {
          storySize: true,
          makeDifferent: false,
          animated: true,
          instagramPost: true,
        },
      },
    ],
    orderDetails: {
      presenting: "Club Neon",
      mainTitle: "Neon Nights Party",
      date: "2024-12-31",
      eventInformation: "New Year's Eve celebration with neon theme",
      mainDJ: "DJ Neon Master",
      additionalDJs: ["DJ Light", "DJ Glow"],
      hostedBy: "Club Neon Management",
      address: "123 Party Street, Miami, FL",
      phoneNumber: "+1 (555) 123-4567",
      customNotes: "Please make the neon colors extra bright",
      uploadedImages: [],
    },
    deliveryOption: "5hours",
    status: "designing",
    totalAmount: 50, // 15 + 10 (story) + 25 (animated) + 10 (5hr delivery)
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    deliveryDeadline: "2024-01-15T15:00:00Z",
    trackingUpdates: [
      {
        status: "pending",
        message: "Order received and payment confirmed",
        timestamp: "2024-01-15T10:00:00Z",
      },
      {
        status: "in-progress",
        message: "Order details reviewed and approved",
        timestamp: "2024-01-15T12:00:00Z",
      },
      {
        status: "designing",
        message: "Designer started working on your flyer",
        timestamp: "2024-01-15T14:30:00Z",
      },
    ],
  },
  
]

export function getSampleOrdersForUser(userId: string): Order[] {
  const now = new Date()
  const minutesFromNow = (m: number) => new Date(now.getTime() + m * 60 * 1000).toISOString()
  const minutesAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000).toISOString()

  // Clone existing sample orders but bind them to the current user
  const base = SAMPLE_ORDERS.map((o) => ({
    ...o,
    userId,
  }))

  // Additional sample orders to show different statuses and urgency
  const ord2: Order = {
    id: "ORD-002",
    userId,
    items: [
      {
        id: "2",
        flyerId: SAMPLE_FLYERS[1]?.id || "2",
        flyerName: SAMPLE_FLYERS[1]?.name || "Halloween Horror Night",
        flyerImage: SAMPLE_FLYERS[1]?.imageUrl || "/halloween-horror-party-flyer-spooky.jpg",
        price: SAMPLE_FLYERS[1]?.price || 40,
        priceType: SAMPLE_FLYERS[1]?.priceType || "premium",
        hasPhotos: SAMPLE_FLYERS[1]?.hasPhotos ?? false,
        extras: {
          storySize: false,
          makeDifferent: true,
          animated: false,
          instagramPost: true,
        },
      },
      {
        id: "3",
        flyerId: SAMPLE_FLYERS[2]?.id || "3",
        flyerName: SAMPLE_FLYERS[2]?.name || "Ladies Night Elegance",
        flyerImage: SAMPLE_FLYERS[2]?.imageUrl || "/ladies-night-elegant-party-flyer.jpg",
        price: SAMPLE_FLYERS[2]?.price || 10,
        priceType: SAMPLE_FLYERS[2]?.priceType || "basic",
        hasPhotos: SAMPLE_FLYERS[2]?.hasPhotos ?? true,
        extras: {
          storySize: true,
          makeDifferent: false,
          animated: false,
          instagramPost: true,
        },
      },
    ],
    orderDetails: {
      presenting: "Grodify Events",
      mainTitle: "Spooky Double Feature",
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2).toISOString(),
      eventInformation: "Two themed flyers for back-to-back events.",
      mainDJ: "DJ Phantom",
      additionalDJs: ["DJ Night", "DJ Velvet"],
      hostedBy: "Grodify Team",
      address: "456 Night Ave, NYC, NY",
      phoneNumber: "+1 (555) 987-6543",
      customNotes: "Keep it premium and moody. Add subtle smoke effect.",
      uploadedImages: [],
    },
    deliveryOption: "1hour",
    status: "in-progress",
    totalAmount: (SAMPLE_FLYERS[1]?.price || 40) + (SAMPLE_FLYERS[2]?.price || 10) + 20 /* 1hr */,
    createdAt: minutesAgo(180), // 3 hours ago
    updatedAt: minutesAgo(30), // 30 min ago
    deliveryDeadline: minutesFromNow(45), // urgent (red) in 45 minutes
    trackingUpdates: [
      { status: "pending", message: "Order received and payment confirmed", timestamp: minutesAgo(180) },
      { status: "in-progress", message: "Preparing design assets", timestamp: minutesAgo(60) },
    ],
  }

  const ord3: Order = {
    id: "ORD-003",
    userId,
    items: [
      {
        id: "4",
        flyerId: SAMPLE_FLYERS[3]?.id || "4",
        flyerName: SAMPLE_FLYERS[3]?.name || "EDM Festival Vibes",
        flyerImage: SAMPLE_FLYERS[3]?.imageUrl || "/edm-festival-electronic-music-flyer.jpg",
        price: SAMPLE_FLYERS[3]?.price || 15,
        priceType: SAMPLE_FLYERS[3]?.priceType || "regular",
        hasPhotos: SAMPLE_FLYERS[3]?.hasPhotos ?? true,
        extras: {
          storySize: false,
          makeDifferent: false,
          animated: true,
          instagramPost: true,
        },
      },
    ],
    orderDetails: {
      presenting: "Bass Arena",
      mainTitle: "EDM Festival Vibes",
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).toISOString(),
      eventInformation: "High-energy EDM flyer with neon accents and motion.",
      mainDJ: "DJ Voltage",
      additionalDJs: ["DJ Surge"],
      hostedBy: "Bass Arena",
      address: "789 Sound Blvd, LA, CA",
      phoneNumber: "+1 (555) 246-8100",
      customNotes: "Add waveform motif and bold title lockup.",
      uploadedImages: [],
    },
    deliveryOption: "24hours",
    status: "ready",
    totalAmount: (SAMPLE_FLYERS[3]?.price || 15) + 25 /* animated */,
    createdAt: minutesAgo(1440), // 24h ago
    updatedAt: minutesAgo(10), // 10 min ago
    deliveryDeadline: minutesFromNow(600), // far out, not urgent
    trackingUpdates: [
      { status: "pending", message: "Order received and payment confirmed", timestamp: minutesAgo(1440) },
      { status: "in-progress", message: "Design brief prepared", timestamp: minutesAgo(1260) },
      { status: "designing", message: "Design in progress with animation", timestamp: minutesAgo(720) },
      { status: "ready", message: "Your flyer is ready for download!", timestamp: minutesAgo(10) },
    ],
  }

  return [...base, ord2, ord3]
}
