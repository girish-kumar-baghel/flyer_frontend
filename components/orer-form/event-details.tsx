"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { CalendarIcon, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { toJS } from "mobx"


// Format date display
function formatDate(date: Date | undefined) {
    if (!date) return ""
    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

function isValidDate(date: Date | undefined) {
    return date instanceof Date && !isNaN(date.getTime())
}

const EventDetails = observer(() => {





    const { flyerFormStore } = useStore()
    const inputRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = useState(false)

    // Venue Logo System State
    const [venueLogo, setVenueLogo] = useState<File | null>(null)
    const [venueLogoPreview, setVenueLogoPreview] = useState<string | null>(null)
    const [showVenueText, setShowVenueText] = useState(false)

    const { eventDetails } = flyerFormStore.flyerFormDetail

    // Handle Venue Logo upload
    const handleVenueLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setVenueLogo(file)
            setShowVenueText(false)

            const reader = new FileReader()
            reader.onload = () => {
                setVenueLogoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)

            flyerFormStore.updateEventDetails("venueLogo", file)
        }
    }

    // Remove Venue Logo
    const handleRemoveVenueLogo = () => {
        setVenueLogo(null)
        setVenueLogoPreview(null)
        flyerFormStore.updateEventDetails("venueLogo", null)
    }

    // Toggle to text field if no logo
    const handleNoLogoClick = () => {
        setShowVenueText(true)
        setVenueLogo(null)
        setVenueLogoPreview(null)
        flyerFormStore.updateEventDetails("venueLogo", null)
    }


    useEffect(() => {
        console.log(toJS(flyerFormStore.flyerFormDetail))
    }, [toJS(flyerFormStore.flyerFormDetail)])



    return (
        <div
            className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl 
      border border-gray-800"
        >
            <h2 className="text-xl font-bold flex items-center gap-3">
                <CalendarIcon className="w-4 h-4" />
                Event Details *
            </h2>

            <div className="grid grid-cols-2 gap-6">
                {/* Presenting */}
                <div className="col-span-1">
                    <Label htmlFor="presenting" className="text-sm mb-2 block font-semibold">
                        Presenting
                    </Label>
                    <Input
                        id="presenting"
                        value={eventDetails.presenting}
                        onChange={(e) =>
                            flyerFormStore.updateEventDetails("presenting", e.target.value)
                        }
                        placeholder="Presenting..."
                        className="bg-card border border-border text-white
              placeholder:text-gray-600 rounded-lg  shadow-md
              focus-visible:!ring-0 focus-visible:!outline-none
              focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
              transition-all duration-300"
                    />
                </div>

                {/* Main Title */}
                <div className="col-span-1">
                    <Label htmlFor="eventTitle" className="text-sm mb-2 block font-semibold">
                        Event Title
                    </Label>
                    <Input
                        id="eventTitle"
                        value={eventDetails.mainTitle}
                        onChange={(e) =>
                            flyerFormStore.updateEventDetails("mainTitle", e.target.value)
                        }
                        placeholder="Enter event name..."
                        className="bg-gray-950 border border-gray-800 text-white
              placeholder:text-gray-600 rounded-lg h-10 shadow-md
              focus-visible:!ring-0 focus-visible:!outline-none
              focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
              transition-all duration-300"
                    />
                </div>

                {/* Date */}
                <div>
                    <Label
                        htmlFor="date"
                        className="text-sm mb-2 font-semibold flex items-center gap-2"
                    >
                        <CalendarIcon className="w-4 h-4" />
                        Date *
                    </Label>
                    <div className="relative flex gap-2">
                        <Input
                            id="date"
                            value={eventDetails.date ? formatDate(eventDetails.date) : ""}
                            placeholder="June 01, 2025"
                            className="bg-gray-950 border border-gray-800 text-white
                placeholder:text-gray-600 rounded-lg h-10 shadow-md
                focus-visible:!ring-0 focus-visible:!outline-none
                focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
                transition-all duration-300"
                            onChange={(e) => {
                                const date = new Date(e.target.value)
                                if (isValidDate(date)) flyerFormStore.updateEventDetails("date", date)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "ArrowDown") {
                                    e.preventDefault()
                                    setOpen(true)
                                }
                            }}
                        />
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <div
                                    id="date-picker"
                                    className="absolute top-1/2 right-2 size-6 -translate-y-1/2 cursor-pointer"
                                >
                                    <CalendarIcon className="size-3.5" />
                                    <span className="sr-only">Select date</span>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="end"
                                alignOffset={-8}
                                sideOffset={10}
                            >
                                <Calendar
                                    mode="single"
                                    selected={eventDetails.date ?? undefined}
                                    onSelect={(date) => {
                                        if (date) flyerFormStore.updateEventDetails("date", date)
                                        setOpen(false)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Flyer Information */}
                <div className="col-span-2">
                    <Label htmlFor="information" className="text-sm mb-2 block font-semibold">
                        Flyer Information
                    </Label>
                    <Textarea
                        id="information"
                        value={eventDetails.flyerInfo}
                        onChange={(e) =>
                            flyerFormStore.updateEventDetails("flyerInfo", e.target.value)
                        }
                        placeholder="Enter flyer information..."
                        className="bg-gray-950 border border-gray-800 text-white
              placeholder:text-gray-600 rounded-lg shadow-md
              focus-visible:!ring-0 focus-visible:!outline-none
              focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
              transition-all duration-300"
                    />
                </div>

                {/* Address & Phone */}
                <div className="col-span-2">
                    <Label htmlFor="address" className="text-sm mb-2 block font-semibold">
                        Address & Phone no.
                    </Label>
                    <Input
                        id="address"
                        value={eventDetails.addressAndPhone}
                        onChange={(e) =>
                            flyerFormStore.updateEventDetails("addressAndPhone", e.target.value)
                        }
                        placeholder="Enter address & phone number..."
                        className="bg-gray-950 border border-gray-800 text-white
              placeholder:text-gray-600 rounded-lg h-10 shadow-md
              focus-visible:!ring-0 focus-visible:!outline-none
              focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
              transition-all duration-300"
                    />
                </div>

                {/* Venue Logo (Universal System) */}
                <div className="col-span-2">
                    <Label htmlFor="logo" className="text-sm mb-2 block font-semibold">
                        Venue Logo (Attachment)
                    </Label>

                    {!showVenueText ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <label htmlFor="venue-logo-upload" className="cursor-pointer">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary rounded-lg hover:bg-primary/20 transition-all">
                                        <Upload className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-semibold text-primary">Upload Logo</span>
                                    </div>
                                    <input
                                        id="venue-logo-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleVenueLogoUpload}
                                        className="hidden"
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={handleNoLogoClick}
                                    className="text-xs text-primary hover:underline font-medium"
                                >
                                    Don't have a logo?
                                </button>
                            </div>

                            {venueLogoPreview && (
                                <div className="flex items-center gap-3 bg-gray-950 border border-gray-800 rounded-lg p-3 shadow-md">
                                    <img
                                        src={venueLogoPreview}
                                        alt="Venue Logo"
                                        className="w-16 h-16 rounded-lg object-cover border-2 border-primary"
                                    />
                                    <span className="text-sm text-gray-300 flex-1">
                                        {venueLogo?.name || "Logo uploaded"}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleRemoveVenueLogo}
                                        className="text-primary text-xs hover:underline font-semibold"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-400">Venue Name (Text)</Label>
                            <Input
                                value={eventDetails.venueText}
                                onChange={(e) =>
                                    flyerFormStore.updateEventDetails("venueText", e.target.value)
                                }
                                placeholder="Enter venue name..."
                                className="bg-gray-950 border border-gray-800 text-white placeholder:text-gray-600 rounded-lg h-10 shadow-md
                                    focus-visible:!ring-0 focus-visible:!outline-none
                                    focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
                                    transition-all duration-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowVenueText(false)}
                                className="text-sm text-primary hover:underline font-medium"
                            >
                                Upload logo instead
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
})

export default EventDetails
