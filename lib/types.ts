export interface Flyer {
  id: string
  name: string
  category: string
  price: number
  priceType: "basic" | "regular" | "premium"
  hasPhotos: boolean
  imageUrl: string
  tags: string[]
  isRecentlyAdded?: boolean
  isFeatured?: boolean
  form_type?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  homePage: boolean
}


export const FLYER_CATEGORIES: Category[] = [
  { "id": "1", "name": "Recently Added", "slug": "recently-added", "homePage": true },
  { "id": "2", "name": "Premium Flyers", "slug": "premium-flyers", "homePage": true },
  { "id": "3", "name": "Basic Flyers", "slug": "basic-flyers", "homePage": true },
  { "id": "4", "name": "DJ Image Flyers", "slug": "dj-image-flyers", "homePage": true },
  { "id": "5", "name": "Ladies Night", "slug": "ladies-night", "homePage": true },
  { "id": "6", "name": "Brunch", "slug": "brunch", "homePage": true },
  { "id": "7", "name": "Summer", "slug": "summer", "homePage": true },
  { "id": "8", "name": "Hookah Flyers", "slug": "hookah-flyers", "homePage": true },
  { "id": "9", "name": "Clean Flyers", "slug": "clean-flyers", "homePage": true },
  { "id": "10", "name": "Hip Hop Flyers", "slug": "hip-hop-flyers", "homePage": false },
  { "id": "11", "name": "Drinks Flyers", "slug": "drinks-flyers", "homePage": true },
  { "id": "12", "name": "Food Flyers", "slug": "food-flyers", "homePage": false },
  { "id": "13", "name": "Birthday Flyers", "slug": "birthday-flyers", "homePage": true },
  { "id": "14", "name": "Foam Party", "slug": "foam-party", "homePage": false },
  { "id": "15", "name": "White Party", "slug": "white-party", "homePage": false },
  { "id": "16", "name": "All Black Party", "slug": "all-black-party", "homePage": false },
  { "id": "17", "name": "Tropical", "slug": "tropical", "homePage": false },
  { "id": "18", "name": "Beach Party", "slug": "beach-party", "homePage": false },
  { "id": "19", "name": "Pool Party", "slug": "pool-party", "homePage": false },
  { "id": "20", "name": "Halloween", "slug": "halloween", "homePage": false },
  { "id": "21", "name": "Winter", "slug": "winter", "homePage": false },
  { "id": "22", "name": "Christmas", "slug": "christmas", "homePage": false },
  { "id": "23", "name": "Memorial Day", "slug": "memorial-day", "homePage": false },
  { "id": "24", "name": "President’s Day", "slug": "presidents-day", "homePage": false },
  { "id": "25", "name": "Valentine’s Day", "slug": "valentines-day", "homePage": false },
  { "id": "26", "name": "Cinco de Mayo / Mexican Day", "slug": "cinco-de-mayo-mexican-day", "homePage": false },
  { "id": "27", "name": "Autumn / Fall", "slug": "autumn-fall", "homePage": false },
  { "id": "28", "name": "Party Flyers (General)", "slug": "party-flyers-general", "homePage": false },
  { "id": "29", "name": "Luxury Flyers", "slug": "luxury-flyers", "homePage": false },
  { "id": "30", "name": "EDM / DJ Flyers", "slug": "edm-dj-flyers", "homePage": false },
  { "id": "31", "name": "Game Night Flyers", "slug": "game-night-flyers", "homePage": false }
]


// Mock flyer data
export const SAMPLE_FLYERS: Flyer[] = [
  { "id": "f1", "name": "DJ Spin Night", "category": "DJ Image Flyers", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic10.jpg", "tags": ["dj", "music", "party"], "isRecentlyAdded": true },
  { "id": "f2", "name": "DJ Groove Party", "category": "DJ Image Flyers", "price": 40, "priceType": "premium", "hasPhotos": true, "imageUrl": "/pic25.jpg", "tags": ["dj", "dance", "night"] },
  { "id": "f3", "name": "DJ Night Vibes", "category": "DJ Image Flyers", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic26.jpg", "tags": ["music", "dance", "club"] },

  { "id": "f4", "name": "Ladies Night Out", "category": "Ladies Night", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic21.jpg", "tags": ["ladies", "fun", "night"], "isRecentlyAdded": true },
  { "id": "f5", "name": "Girls Night Party", "category": "Ladies Night", "price": 40, "priceType": "premium", "hasPhotos": true, "imageUrl": "/pic22.jpg", "tags": ["party", "night", "vip"] },
  { "id": "f6", "name": "Ladies Weekend Bash", "category": "Ladies Night", "price": 10, "priceType": "basic", "hasPhotos": false, "imageUrl": "/pic34.jpg", "tags": ["weekend", "fun"] },

  { "id": "f7", "name": "Sunday Brunch Vibes", "category": "Brunch", "price": 10, "priceType": "basic", "hasPhotos": true, "imageUrl": "/pic39.jpg", "tags": ["food", "daytime", "friends"], "isRecentlyAdded": true },
  { "id": "f8", "name": "Weekend Brunch", "category": "Brunch", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic30.jpg", "tags": ["food", "friends", "fun"] },
  { "id": "f9", "name": "Brunch and Beats", "category": "Brunch", "price": 40, "priceType": "premium", "hasPhotos": true, "imageUrl": "/pic21.jpg", "tags": ["music", "food", "daytime"] },

  { "id": "f10", "name": "Summer Beach Bash", "category": "Summer", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic41.jpg", "tags": ["summer", "beach", "party"] },
  { "id": "f11", "name": "Hot Summer Nights", "category": "Summer", "price": 40, "priceType": "premium", "hasPhotos": true, "imageUrl": "/pic26.jpg", "tags": ["night", "summer", "fun"], "isRecentlyAdded": true },
  { "id": "f12", "name": "Summer Vibes Party", "category": "Summer", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic41.jpg", "tags": ["music", "summer", "daytime"] },

  { "id": "f13", "name": "Hookah Lounge Night", "category": "Hookah Flyers", "price": 10, "priceType": "basic", "hasPhotos": true, "imageUrl": "/pic31.jpg", "tags": ["hookah", "relax", "night"] },
  { "id": "f14", "name": "Hookah Party Fun", "category": "Hookah Flyers", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic37.jpg", "tags": ["hookah", "party", "friends"], "isRecentlyAdded": true },
  { "id": "f15", "name": "Chill Hookah Night", "category": "Hookah Flyers", "price": 10, "priceType": "basic", "hasPhotos": false, "imageUrl": "/pic24.jpg", "tags": ["relax", "night", "friends"] },

  { "id": "f16", "name": "Clean Party Designs", "category": "Clean Flyers", "price": 10, "priceType": "basic", "hasPhotos": false, "imageUrl": "/pic39.jpg", "tags": ["minimal", "clean", "party"] },
  { "id": "f17", "name": "Sleek Flyer Night", "category": "Clean Flyers", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic21.jpg", "tags": ["minimal", "sleek", "event"], "isRecentlyAdded": true },
  { "id": "f18", "name": "Elegant Night Flyers", "category": "Clean Flyers", "price": 40, "priceType": "premium", "hasPhotos": true, "imageUrl": "/pic39.jpg", "tags": ["elegant", "night", "party"] },

  { "id": "f19", "name": "Hip Hop Jam", "category": "Hip Hop Flyers", "price": 40, "priceType": "premium", "hasPhotos": true, "imageUrl": "/pic38.jpg", "tags": ["hiphop", "music", "dance"] },
  { "id": "f20", "name": "Hip Hop Night", "category": "Hip Hop Flyers", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic23.jpg", "tags": ["hiphop", "party", "music"] },

  { "id": "f21", "name": "Drinks Specials Night", "category": "Drinks Flyers", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic24.jpg", "tags": ["drinks", "bar", "night"], "isRecentlyAdded": true },
  { "id": "f22", "name": "Cocktail Night Party", "category": "Drinks Flyers", "price": 40, "priceType": "premium", "hasPhotos": true, "imageUrl": "/pic10.jpg", "tags": ["cocktail", "fun", "night"] },
  { "id": "f23", "name": "Beer Bash", "category": "Drinks Flyers", "price": 10, "priceType": "basic", "hasPhotos": false, "imageUrl": "/pic37.jpg", "tags": ["beer", "party", "fun"] },

  { "id": "f24", "name": "Food Festival", "category": "Food Flyers", "price": 40, "priceType": "premium", "hasPhotos": true, "imageUrl": "/pic39.jpg", "tags": ["food", "festival", "event"] },
  { "id": "f25", "name": "Food & Fun Night", "category": "Food Flyers", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic11.jpg", "tags": ["food", "party", "fun"] },
  { "id": "f26", "name": "Gourmet Night Party", "category": "Food Flyers", "price": 10, "priceType": "basic", "hasPhotos": false, "imageUrl": "/pic24.jpg", "tags": ["gourmet", "night", "event"] },

  { "id": "f27", "name": "Birthday Bash Flyer", "category": "Birthday Flyers", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic30.jpg", "tags": ["birthday", "party", "fun"], "isRecentlyAdded": true },
  { "id": "f28", "name": "Birthday Glow Night", "category": "Birthday Flyers", "price": 40, "priceType": "premium", "hasPhotos": true, "imageUrl": "/pic26.jpg", "tags": ["birthday", "night", "vip"] },
  { "id": "f29", "name": "Birthday Fun Flyer", "category": "Birthday Flyers", "price": 10, "priceType": "basic", "hasPhotos": false, "imageUrl": "/pic41.jpg", "tags": ["fun", "birthday", "friends"] },

  { "id": "f30", "name": "Foam Party Madness", "category": "Foam Party", "price": 40, "priceType": "premium", "hasPhotos": true, "imageUrl": "/pic41.jpg", "tags": ["foam", "party", "night"] },
  { "id": "f31", "name": "Foam Fun Night", "category": "Foam Party", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic33.jpg", "tags": ["foam", "dance", "fun"] },
  { "id": "f32", "name": "Foam Party Splash", "category": "Foam Party", "price": 10, "priceType": "basic", "hasPhotos": false, "imageUrl": "/pic36.jpg", "tags": ["splash", "party", "friends"] },

  { "id": "f33", "name": "White Party Night", "category": "White Party", "price": 40, "priceType": "premium", "hasPhotos": true, "imageUrl": "/pic21.jpg", "tags": ["white", "night", "party"] },
  { "id": "f34", "name": "All White Bash", "category": "White Party", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic33.jpg", "tags": ["white", "fun", "vip"] },
  { "id": "f35", "name": "White Glow Party", "category": "White Party", "price": 10, "priceType": "basic", "hasPhotos": false, "imageUrl": "/pic21.jpg", "tags": ["glow", "white", "night"] },

  { "id": "f36", "name": "All Black Bash", "category": "All Black Party", "price": 40, "priceType": "premium", "hasPhotos": true, "imageUrl": "/pic23.jpg", "tags": ["black", "party", "vip"] },
  { "id": "f37", "name": "Blackout Party", "category": "All Black Party", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic40.jpg", "tags": ["black", "dance", "night"] },
  { "id": "f38", "name": "Black Magic Night", "category": "All Black Party", "price": 10, "priceType": "basic", "hasPhotos": false, "imageUrl": "/pic28.jpg", "tags": ["black", "magic", "fun"] },

  { "id": "f39", "name": "Tropical Vibes Party", "category": "Tropical", "price": 40, "priceType": "premium", "hasPhotos": true, "imageUrl": "/pic40.jpg", "tags": ["tropical", "summer", "fun"] },
  { "id": "f40", "name": "Tropical Night Bash", "category": "Tropical", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic25.jpg", "tags": ["tropical", "party", "night"] },
  { "id": "f41", "name": "Tropical Island Party", "category": "Tropical", "price": 10, "priceType": "basic", "hasPhotos": false, "imageUrl": "/pic30.jpg", "tags": ["island", "tropical", "fun"] },

  { "id": "f42", "name": "Beach Party Bash", "category": "Beach Party", "price": 40, "priceType": "premium", "hasPhotos": true, "imageUrl": "/pic41.jpg", "tags": ["beach", "party", "fun"] },
  { "id": "f43", "name": "Sun & Sand Night", "category": "Beach Party", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic37.jpg", "tags": ["beach", "summer", "night"] },
  { "id": "f44", "name": "Beach Glow Party", "category": "Beach Party", "price": 10, "priceType": "basic", "hasPhotos": false, "imageUrl": "/pic41.jpg", "tags": ["glow", "beach", "fun"] },

  { "id": "f45", "name": "Pool Party Splash", "category": "Pool Party", "price": 40, "priceType": "premium", "hasPhotos": true, "imageUrl": "/pic10.jpg", "tags": ["pool", "party", "fun"], "isRecentlyAdded": true },
  { "id": "f46", "name": "Poolside Night Bash", "category": "Pool Party", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic24.jpg", "tags": ["pool", "summer", "night"] },
  { "id": "f47", "name": "Pool Party Fiesta", "category": "Pool Party", "price": 10, "priceType": "basic", "hasPhotos": false, "imageUrl": "/pic25.jpg", "tags": ["pool", "fiesta", "fun"] },

  { "id": "f48", "name": "Halloween Spook Night", "category": "Halloween", "price": 40, "priceType": "premium", "hasPhotos": true, "imageUrl": "/pic29.jpg", "tags": ["halloween", "spooky", "night"] },
  { "id": "f49", "name": "Halloween Costume Party", "category": "Halloween", "price": 15, "priceType": "regular", "hasPhotos": true, "imageUrl": "/pic35.jpg", "tags": ["costume", "fun", "night"] },
  { "id": "f50", "name": "Haunted Night Bash", "category": "Halloween", "price": 10, "priceType": "basic", "hasPhotos": false, "imageUrl": "/pic32.jpg", "tags": ["haunted", "party", "fun"] }
]

const ALWAYS_VISIBLE_CATEGORIES = new Set(["Recently Added", "Premium Flyers", "Basic Flyers"])

const normalizeCategoryName = (value: any): string | null => {
  if (!value) return null
  if (typeof value === "string") return value
  if (typeof value === "object") {
    return value?.name ?? value?.title ?? null
  }
  return null
}

export const extractFlyerCategories = (flyer: any): string[] => {
  if (!flyer) return []

  const names = new Set<string>()

  if (Array.isArray(flyer.categories)) {
    flyer.categories.forEach((category: any) => {
      const name = normalizeCategoryName(category)
      if (name) names.add(name)
    })
  }

  const singleCategory =
    flyer.category ?? flyer.category_name ?? flyer.categoryName ?? normalizeCategoryName(flyer?.category_id)
  if (singleCategory) names.add(singleCategory)

  return Array.from(names)
}

export const getCategoryCounts = (flyers: any[] = SAMPLE_FLYERS): Record<string, number> => {
  const counts: Record<string, number> = {}
  flyers.forEach((flyer) => {
    extractFlyerCategories(flyer).forEach((name) => {
      counts[name] = (counts[name] ?? 0) + 1
    })
  })
  return counts
}

export const getCategoriesWithFlyers = (flyers: any[] = SAMPLE_FLYERS): Category[] => {
  const counts = getCategoryCounts(flyers)
  return FLYER_CATEGORIES.filter((category) => ALWAYS_VISIBLE_CATEGORIES.has(category.name) || counts[category.name])
}

// Generate categories dynamically from API flyers data
export const getDynamicCategoriesFromFlyers = (apiFlyers: any[]): Category[] => {
  if (!apiFlyers || apiFlyers.length === 0) {
    // Return default categories if no flyers
    return FLYER_CATEGORIES.filter(cat => cat.homePage)
  }

  const categoryCounts: Record<string, number> = {}

  // Count flyers per category
  apiFlyers.forEach((flyer) => {
    if (Array.isArray(flyer.categories)) {
      flyer.categories.forEach((categoryName: string) => {
        categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1
      })
    }
  })

  console.log('📊 Category counts from API:', categoryCounts)

  // Create category objects for categories that have flyers
  const dynamicCategories: Category[] = []
  const processedNames = new Set<string>()

  // First, add predefined categories that have flyers
  FLYER_CATEGORIES.forEach((category) => {
    if (ALWAYS_VISIBLE_CATEGORIES.has(category.name) || categoryCounts[category.name]) {
      // Override homePage to true for categories with flyers
      dynamicCategories.push({
        ...category,
        homePage: true // Force all categories with flyers to show on homepage
      })
      processedNames.add(category.name)
    }
  })

  // Then add any new categories from API that aren't in our predefined list
  Object.keys(categoryCounts).forEach((categoryName) => {
    if (!processedNames.has(categoryName)) {
      // Create a slug from the category name
      const slug = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

      dynamicCategories.push({
        id: `dynamic-${slug}`,
        name: categoryName,
        slug: slug,
        homePage: true // Show all categories with flyers on home page
      })

      console.log('🆕 New category from API:', categoryName)
    }
  })

  console.log('✅ Total dynamic categories:', dynamicCategories.length)
  console.log('📋 Category names:', dynamicCategories.map(c => c.name))

  return dynamicCategories
}

