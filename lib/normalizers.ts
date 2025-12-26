export type FlyerPriceTier = "basic" | "regular" | "premium"

export interface NormalizedFlyer {
  id: string
  name: string
  price: number
  priceType: FlyerPriceTier
  category?: string
  categories?: string[]
  image_url?: string
  imageUrl?: string
  hasPhotos?: boolean
  tags?: string[]
  isRecentlyAdded?: boolean
  [key: string]: any
}

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const normalizePriceType = (value: unknown, price: number): FlyerPriceTier => {
  const normalized = String(value ?? "").toLowerCase()
  if (normalized === "basic" || normalized === "regular" || normalized === "premium") {
    return normalized
  }

  if (price >= 35) return "premium"
  if (price >= 15) return "regular"
  return "basic"
}

const ensureArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string")
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return [value]
  }
  return []
}

export const normalizeFlyer = (record: any): NormalizedFlyer => {
  const fallbackId = `flyer-${Math.random().toString(36).slice(2)}`
  const id =
    record?.id ??
    record?.flyer_id ??
    record?.flyerId ??
    record?.slug ??
    record?.uuid ??
    fallbackId

  const name = record?.name ?? record?.title ?? record?.flyer_name ?? "Untitled Flyer"
  const price = toNumber(record?.price ?? record?.amount ?? record?.base_price ?? 0)
  const priceType = normalizePriceType(record?.priceType ?? record?.price_type, price)
  const category = record?.category ?? record?.category_name ?? record?.categoryTitle
  const categories = ensureArray(record?.categories ?? (category ? [category] : []))
  const image =
    record?.image_url ??
    record?.imageUrl ??
    record?.image ??
    record?.thumbnail ??
    record?.cover ??
    "/placeholder.svg"

  const hasPhotos = Boolean(
    record?.hasPhotos ?? record?.has_photos ?? record?.with_photo ?? true
  )

  const tags = ensureArray(record?.tags ?? record?.labels ?? [])

  return {
    ...record,
    id: String(id),
    name,
    price,
    priceType,
    category,
    categories,
    image_url: image,
    imageUrl: image,
    hasPhotos,
    tags,
    isRecentlyAdded: Boolean(
      record?.isRecentlyAdded ?? record?.recentlyAdded ?? record?.recently_added ?? false
    ),
  }
}

export const normalizeFlyers = (records: any[] = []): NormalizedFlyer[] =>
  records.map((record) => normalizeFlyer(record))

