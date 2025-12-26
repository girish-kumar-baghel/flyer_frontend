"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import { getCategoriesWithFlyers, getCategoryCounts } from "@/lib/types"

interface FilterState {
  search: string
  categories: string[]
  priceRange: string
  hasPhotos: boolean | null
  sortBy: string
}

interface FlyerFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
}

export function FlyerFilters({ filters, onFiltersChange, onClearFilters }: FlyerFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const categories = getCategoriesWithFlyers()
  const categoryCounts = getCategoryCounts()

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleCategory = (categorySlug: string) => {
    const newCategories = filters.categories.includes(categorySlug)
      ? filters.categories.filter((c) => c !== categorySlug)
      : [...filters.categories, categorySlug]
    updateFilter("categories", newCategories)
  }

  const hasActiveFilters =
    filters.search || filters.categories.length > 0 || filters.priceRange || filters.hasPhotos !== null

  return (
    <div className="space-y-4">
      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search flyers..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="bg-input border-border"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
            <SelectTrigger className="w-40 bg-input border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)} className="bg-transparent">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter("search", "")} />
            </Badge>
          )}
          {filters.categories.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1">
              {categories.find((c) => c.slug === category)?.name}
              <X className="w-3 h-3 cursor-pointer" onClick={() => toggleCategory(category)} />
            </Badge>
          ))}
          {filters.priceRange && (
            <Badge variant="secondary" className="gap-1">
              {filters.priceRange}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter("priceRange", "")} />
            </Badge>
          )}
          {filters.hasPhotos !== null && (
            <Badge variant="secondary" className="gap-1">
              {filters.hasPhotos ? "With Photos" : "Without Photos"}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter("hasPhotos", null)} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
        </div>
      )}

      {/* Expanded Filters */}
      {isExpanded && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Filter Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories */}
            <div>
              <Label className="text-base font-medium mb-3 block">Categories</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.slug}
                      checked={filters.categories.includes(category.slug)}
                      onCheckedChange={() => toggleCategory(category.slug)}
                    />
                    <Label htmlFor={category.slug} className="text-sm cursor-pointer">
                      {category.name} ({categoryCounts[category.name] ?? 0})
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <Label className="text-base font-medium mb-3 block">Price Range</Label>
              <Select value={filters.priceRange} onValueChange={(value) => updateFilter("priceRange", value)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic ($10)</SelectItem>
                  <SelectItem value="regular">Regular ($15)</SelectItem>
                  <SelectItem value="premium">Premium ($40)</SelectItem>
                  <SelectItem value="10-15">$10 - $15</SelectItem>
                  <SelectItem value="15-40">$15 - $40</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Photo Options */}
            <div>
              <Label className="text-base font-medium mb-3 block">Photo Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="with-photos"
                    checked={filters.hasPhotos === true}
                    onCheckedChange={(checked) => updateFilter("hasPhotos", checked ? true : null)}
                  />
                  <Label htmlFor="with-photos" className="text-sm cursor-pointer">
                    With Photos (Upload up to 5 images)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="without-photos"
                    checked={filters.hasPhotos === false}
                    onCheckedChange={(checked) => updateFilter("hasPhotos", checked ? false : null)}
                  />
                  <Label htmlFor="without-photos" className="text-sm cursor-pointer">
                    Without Photos (Original design only)
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
