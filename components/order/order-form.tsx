"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Upload, X, Plus, Calendar, MapPin, Phone, User, Music, Star, Loader2 } from "lucide-react"
import { DELIVERY_OPTIONS, type OrderItem } from "@/lib/orders"
import type { Flyer } from "@/lib/types"
import { useOrderSubmission } from "@/hooks/useOrderSubmission"
import { useCheckout } from "@/hooks/useCheckout"
import { loadStripe } from "@stripe/stripe-js"
import type { OrderSubmission } from "@/types/order"
import { useAuth } from "@/lib/auth"

interface OrderFormProps {
  selectedFlyer: Flyer
  onCancel: () => void
}

export function OrderForm({ selectedFlyer, onCancel }: OrderFormProps) {
  const { handleSubmitOrder, isSubmitting, error: submissionError } = useOrderSubmission()
  const { processCheckout, isProcessing, error: checkoutError } = useCheckout()
  const { user } = useAuth()
  const [orderData, setOrderData] = useState<OrderSubmission | null>(null)
  const [formData, setFormData] = useState({
    presenting: "",
    mainTitle: "",
    date: "",
    eventInformation: "",
    mainDJ: "",
    additionalDJs: [""],
    hostedBy: "",
    address: "",
    phoneNumber: "",
    customNotes: "",
  })

  const [extras, setExtras] = useState({
    storySize: false,
    makeDifferent: false,
    animated: false,
    instagramPost: true, // Included by default
  })

  const [deliveryOption, setDeliveryOption] = useState<string>("24hours")
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [logos, setLogos] = useState({
    venue: null as File | null,
    promoter: null as File | null,
    sponsor: null as File | null,
  })

  const calculateTotal = () => {
    let total = selectedFlyer.price
    if (extras.storySize) total += 10
    if (extras.makeDifferent) total += 10
    if (extras.animated) total += 25

    const delivery = DELIVERY_OPTIONS.find((d) => d.value === deliveryOption)
    if (delivery) total += delivery.price

    return total
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (uploadedImages.length + files.length <= 5) {
      setUploadedImages([...uploadedImages, ...files])
    }
  }

  const handleLogoUpload = (type: keyof typeof logos, file: File) => {
    setLogos({ ...logos, [type]: file })
  }

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
  }

  const addDJField = () => {
    setFormData({
      ...formData,
      additionalDJs: [...formData.additionalDJs, ""],
    })
  }

  const updateDJ = (index: number, value: string) => {
    const newDJs = [...formData.additionalDJs]
    newDJs[index] = value
    setFormData({ ...formData, additionalDJs: newDJs })
  }

  const removeDJ = (index: number) => {
    setFormData({
      ...formData,
      additionalDJs: formData.additionalDJs.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prepare order data with real user data
    const orderSubmission: OrderSubmission = {
      formData: {
        presenting: formData.presenting,
        event_title: formData.mainTitle,
        event_date: formData.date,
        address_phone: `${formData.address} | ${formData.phoneNumber}`,
        flyer_info: formData.eventInformation,
        custom_notes: formData.customNotes,
        delivery_time: deliveryOption,
        email: user?.email || "user@example.com", // Use real user email
        story_size_version: extras.storySize,
        custom_flyer: extras.makeDifferent,
        animated_flyer: extras.animated,
        instagram_post_size: extras.instagramPost,
        flyer_is: parseInt(selectedFlyer.id) || 26,
        category_id: parseInt(selectedFlyer.id) || 9, // Use flyer id as category_id since Flyer has category as string
        user_id: user?.id || "99ae0488-f0a1-70db-db50-da298fdef51esery", // Use real user ID
        total_price: calculateTotal(),
        subtotal: calculateTotal(),
        image_url: selectedFlyer.imageUrl || "https://images.unsplash.com/photo.jpg",
        djs: [
          { name: formData.mainDJ },
          ...formData.additionalDJs.filter(dj => dj.trim() !== '').map(name => ({ name }))
        ],
        host: { name: formData.hostedBy },
        sponsors: uploadedImages.map((_, index) => ({ name: `Sponsor ${index + 1}` }))
      },
      files: {
        venueLogoFile: logos.venue,
        hostFile: logos.promoter,
        djFiles: uploadedImages,
        sponsorFiles: []
      },
      userId: user?.id || "99ae0488-f0a1-70db-db50-da298fdef51esery", // Use real user ID
      userEmail: user?.email || "user@example.com" // Use real user email
    }

    console.log('Submitting order:', orderSubmission)

    // Process checkout with Stripe
    setOrderData(orderSubmission)

    const result = await processCheckout(orderSubmission)

    if (!result.success) {
      // If Stripe fails, show error
      console.error('Stripe checkout failed:', result.error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Selected Flyer */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Selected Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <img
              src={selectedFlyer.imageUrl || "/placeholder.svg"}
              alt={selectedFlyer.name}
              className="w-20 h-28 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground">{selectedFlyer.name}</h3>
              <p className="text-muted-foreground text-sm">{selectedFlyer.category}</p>
              <Badge className="mt-2">${selectedFlyer.price}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Details */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="presenting">Presenting</Label>
                <div className="relative">
                  <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="presenting"
                    value={formData.presenting}
                    onChange={(e) => setFormData({ ...formData, presenting: e.target.value })}
                    placeholder="Club/Venue Name"
                    className="pl-10 bg-input border-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mainTitle">Main Title</Label>
                <Input
                  id="mainTitle"
                  value={formData.mainTitle}
                  onChange={(e) => setFormData({ ...formData, mainTitle: e.target.value })}
                  placeholder="Event Title"
                  className="bg-input border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Event Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="pl-10 bg-input border-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hostedBy">Hosted By</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="hostedBy"
                    value={formData.hostedBy}
                    onChange={(e) => setFormData({ ...formData, hostedBy: e.target.value })}
                    placeholder="Host Name"
                    className="pl-10 bg-input border-border"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventInformation">Event Information</Label>
              <Textarea
                id="eventInformation"
                value={formData.eventInformation}
                onChange={(e) => setFormData({ ...formData, eventInformation: e.target.value })}
                placeholder="Describe your event..."
                className="bg-input border-border"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Venue Address"
                    className="pl-10 bg-input border-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="Contact Number"
                    className="pl-10 bg-input border-border"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DJ Information */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">DJ Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mainDJ">Main DJ</Label>
              <div className="relative">
                <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="mainDJ"
                  value={formData.mainDJ}
                  onChange={(e) => setFormData({ ...formData, mainDJ: e.target.value })}
                  placeholder="Main DJ Name"
                  className="pl-10 bg-input border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional DJs (up to 4)</Label>
              {formData.additionalDJs.map((dj, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={dj}
                    onChange={(e) => updateDJ(index, e.target.value)}
                    placeholder={`DJ ${index + 1} Name`}
                    className="bg-input border-border"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeDJ(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {formData.additionalDJs.length < 4 && (
                <Button type="button" variant="outline" size="sm" onClick={addDJField} className="bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add DJ
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
        {selectedFlyer.hasPhotos && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Upload Images (Up to 5)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground mb-2">Upload DJ/Host/Artist photos</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button type="button" variant="outline" className="bg-transparent" asChild>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    Choose Images
                  </label>
                </Button>
              </div>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {uploadedImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Extra Options */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Extra Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="storySize"
                    checked={extras.storySize}
                    onCheckedChange={(checked) => setExtras({ ...extras, storySize: !!checked })}
                  />
                  <Label htmlFor="storySize" className="cursor-pointer">
                    Story Size Version
                  </Label>
                </div>
                <Badge variant="outline">+$10</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="makeDifferent"
                    checked={extras.makeDifferent}
                    onCheckedChange={(checked) => setExtras({ ...extras, makeDifferent: !!checked })}
                  />
                  <Label htmlFor="makeDifferent" className="cursor-pointer">
                    Make Flyer Different/Custom
                  </Label>
                </div>
                <Badge variant="outline">+$10</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="animated"
                    checked={extras.animated}
                    onCheckedChange={(checked) => setExtras({ ...extras, animated: !!checked })}
                  />
                  <Label htmlFor="animated" className="cursor-pointer">
                    Animated Flyer
                  </Label>
                </div>
                <Badge variant="outline">+$25</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border border-green-500/20 bg-green-500/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="instagramPost"
                    checked={extras.instagramPost}
                    onCheckedChange={(checked) => setExtras({ ...extras, instagramPost: !!checked })}
                    disabled
                  />
                  <Label htmlFor="instagramPost" className="cursor-pointer">
                    Instagram Post Size
                  </Label>
                </div>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Included</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Options */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Delivery Options</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={deliveryOption} onValueChange={setDeliveryOption}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DELIVERY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      <span className="ml-4 text-muted-foreground">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Custom Notes */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Custom Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.customNotes}
              onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
              placeholder="Any special requests or design changes..."
              className="bg-input border-border"
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Base Price ({selectedFlyer.priceType})</span>
              <span>${selectedFlyer.price}</span>
            </div>
            {extras.storySize && (
              <div className="flex justify-between text-muted-foreground">
                <span>Story Size Version</span>
                <span>+$10</span>
              </div>
            )}
            {extras.makeDifferent && (
              <div className="flex justify-between text-muted-foreground">
                <span>Make Different/Custom</span>
                <span>+$10</span>
              </div>
            )}
            {extras.animated && (
              <div className="flex justify-between text-muted-foreground">
                <span>Animated Flyer</span>
                <span>+$25</span>
              </div>
            )}
            {deliveryOption !== "24hours" && (
              <div className="flex justify-between text-muted-foreground">
                <span>Express Delivery</span>
                <span>+${DELIVERY_OPTIONS.find((d) => d.value === deliveryOption)?.price}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-primary">${calculateTotal()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent" disabled={isProcessing || isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isProcessing || isSubmitting}>
            {isProcessing || isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </div>

        {/* Error Display */}
        {(checkoutError || submissionError) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">{checkoutError || submissionError}</p>
          </div>
        )}
      </form>
    </div>
  )
}
