"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Music, Check, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { toast } from "sonner";
import SponsorsBlock from "./sponser";
import ExtrasBlock from "./extra-block";
import DeliveryTimeBlock from "./delivery-time-block";
import { FlyersCarousel } from "../home/FlyersCarousel";
import EventDetails from "./event-details";
import { createCartFormData, setUserIdInFormData } from "@/lib/cart";

type Flyer = {
    id: string;
    name: string;
    category: string;
    price: number;
    priceType: "basic" | "regular" | "premium";
    hasPhotos: boolean;
    imageUrl: string;
    image_url?: string;
    category_id?: string;
    tags: string[];
    isRecentlyAdded?: boolean;
    isFeatured?: boolean;
};

interface NoPhotoFormProps {
    flyer?: Flyer;
    fixedPrice: 10 | 15 | 40; // Fixed prices for No-Photo forms
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
});

const formatCurrency = (value: number | string | null | undefined) => {
    const numericValue = typeof value === "number" ? value : Number(value ?? 0);
    if (Number.isNaN(numericValue)) {
        return currencyFormatter.format(0);
    }
    return currencyFormatter.format(numericValue);
};

const NoPhotoForm: React.FC<NoPhotoFormProps> = ({ flyer, fixedPrice }) => {
    const { flyerFormStore, cartStore, authStore } = useStore();

    const [venueLogo, setVenueLogo] = useState<File | null>(null);
    const [venueLogoPreview, setVenueLogoPreview] = useState<string | null>(null);
    const [showVenueText, setShowVenueText] = useState(false);
    const [venueText, setVenueText] = useState("");

    const [djList, setDjList] = useState<{ name: string }[]>([{ name: "" }, { name: "" }]);
    const [hostList, setHostList] = useState<{ name: string }[]>([{ name: "" }]);
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle Venue Logo upload
    const handleVenueLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVenueLogo(file);
            setShowVenueText(false);

            const reader = new FileReader();
            reader.onload = () => {
                setVenueLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            flyerFormStore.updateEventDetails("venueLogo", file);
        }
    };

    // Remove Venue Logo
    const handleRemoveVenueLogo = () => {
        setVenueLogo(null);
        setVenueLogoPreview(null);
        flyerFormStore.updateEventDetails("venueLogo", null);
    };

    // Toggle to text field if no logo
    const handleNoLogoClick = () => {
        setShowVenueText(true);
        setVenueLogo(null);
        setVenueLogoPreview(null);
        flyerFormStore.updateEventDetails("venueLogo", null);
    };

    // Handle DJ name change
    const handleDjNameChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newDjList = [...djList];
        newDjList[index].name = e.target.value;
        setDjList(newDjList);
        flyerFormStore.updateDJ(index, "name", e.target.value);
    };

    // Add DJ field (max 4)
    const handleAddDj = () => {
        if (djList.length < 4) {
            setDjList([...djList, { name: "" }]);
            flyerFormStore.addDJ();
        } else {
            toast.error("Maximum 4 DJs allowed");
        }
    };

    // Remove DJ field
    const handleRemoveDj = (index: number) => {
        if (djList.length > 1) {
            setDjList(djList.filter((_, i) => i !== index));
            flyerFormStore.removeDJ(index);
        }
    };

    // Handle Host name change
    const handleHostNameChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newHostList = [...hostList];
        newHostList[index].name = e.target.value;
        setHostList(newHostList);
        flyerFormStore.updateHost(index, "name", e.target.value);
    };

    // Add Host field (max 2)
    const handleAddHost = () => {
        if (hostList.length < 2) {
            setHostList([...hostList, { name: "" }]);
            flyerFormStore.addHost();
        } else {
            toast.error("Maximum 2 hosts allowed");
        }
    };

    // Remove Host field
    const handleRemoveHost = (index: number) => {
        if (hostList.length > 1) {
            setHostList(hostList.filter((_, i) => i !== index));
            flyerFormStore.removeHost(index);
        }
    };

    // Validate form
    const validateNoPhotoForm = () => {
        const errors: string[] = [];

        if (!venueLogo && !venueText.trim()) {
            errors.push("Venue logo or venue text is required");
        }

        const { valid: baseValid, errors: baseErrors } = flyerFormStore.validateForm();
        if (!baseValid) {
            errors.push(...baseErrors);
        }

        return {
            valid: errors.length === 0,
            errors
        };
    };

    // Add to cart
    const addToCart = async () => {
        if (!authStore.user?.id) {
            toast.error("Please sign in to add items to your cart.");
            authStore.handleAuthModal();
            return;
        }

        const { valid, errors } = validateNoPhotoForm();
        if (!valid) {
            toast.error(errors.join("\n"));
            return;
        }

        flyerFormStore.setUserId(authStore.user.id);

        const formDetailForCart = {
            ...flyerFormStore.flyerFormDetail,
            eventDetails: {
                ...flyerFormStore.flyerFormDetail.eventDetails,
                venueLogo: venueLogo || undefined,
                venueText: venueText
            }
        };

        const cartFormData = createCartFormData(formDetailForCart, {
            flyerId: flyer?.id || "",
            categoryId: flyer?.category_id || flyer?.category || "",
            totalPrice: String(fixedPrice),
            subtotal: String(fixedPrice),
            deliveryTime: flyerFormStore.flyerFormDetail.deliveryTime || "24hours",
            imageUrl: flyer?.image_url || flyer?.imageUrl || ""
        });

        const finalFormData = setUserIdInFormData(cartFormData, authStore.user.id);

        try {
            await cartStore.addToCart(finalFormData);
            toast.success("Added to cart. You can keep shopping.");
        } catch (error) {
            console.error("Cart save error", error);
            toast.error("Unable to add to cart. Please try again.");
        }
    };

    // Checkout
    const handleCheckout = async () => {
        if (!authStore.user?.id) {
            toast.error("Please sign in to continue with checkout.");
            authStore.handleAuthModal();
            return;
        }

        const { valid, errors } = validateNoPhotoForm();
        if (!valid) {
            toast.error(errors.join("\n"));
            return;
        }

        setIsSubmitting(true);

        try {
            toast.success("Proceeding to checkout...");
            // Implement checkout logic here
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("An error occurred during checkout. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const flyerImage = flyer?.image_url || flyer?.imageUrl || "/placeholder.svg";
    const flyerName = flyer?.name || "";
    const priceLabel = fixedPrice === 40 ? "Premium No-Photo" : `$${fixedPrice} No-Photo`;

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="grid lg:grid-cols-2 gap-8 p-3 md:p-5 max-w-[1600px] mx-auto">
                {/* Left: Flyer Preview */}
                <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                    <img
                        src={flyerImage}
                        alt={flyerName}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                        <h1 className="text-2xl font-bold text-white mb-2">{flyerName}</h1>
                        <div className="flex items-center gap-2">
                            <span className="text-primary font-bold text-xl">
                                {formatCurrency(fixedPrice)}
                            </span>
                            <span className="text-sm text-gray-400">({priceLabel})</span>
                        </div>
                    </div>
                </div>

                {/* Right: No-Photo Form */}
                <form className="space-y-6">
                    {/* Venue Logo - ONLY UPLOAD IN NO-PHOTO FORMS */}
                    <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border border-gray-800">
                        <h2 className="text-xl font-bold">Venue Logo (Attachment)</h2>

                        {!showVenueText ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <label htmlFor="venue-logo-upload" className="cursor-pointer">
                                        <div className="flex items-center gap-2 text-primary">
                                            <span className="text-sm font-semibold">Upload Logo</span>
                                            <Upload className="w-4 h-4" />
                                        </div>
                                        <input
                                            id="venue-logo-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleVenueLogoUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                {venueLogoPreview && (
                                    <div className="flex items-center gap-3 bg-gray-950 border rounded-lg p-3 shadow-md">
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
                                            className="text-primary text-xs hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleNoLogoClick}
                                    className="text-sm text-primary hover:underline"
                                >
                                    If you don't have a logo, click here
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold">Venue Name (Text)</Label>
                                <Input
                                    value={venueText}
                                    onChange={(e) => {
                                        setVenueText(e.target.value);
                                        flyerFormStore.updateEventDetails("venueText", e.target.value);
                                    }}
                                    placeholder="Enter venue name..."
                                    className="bg-gray-950 border border-gray-800 text-white placeholder:text-gray-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowVenueText(false)}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Upload logo instead
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Event Details */}
                    <EventDetails />

                    {/* Split Layout: DJ/Artist (Left) + Host (Right) - TEXT ONLY */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* DJ/Artist Section - TEXT ONLY, MAX 4 */}
                        <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border border-gray-800">
                            <h2 className="text-xl font-bold">DJ or Artist (Text Only)</h2>

                            {djList.map((dj, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-semibold flex items-center gap-2">
                                            <Music className="w-4 h-4 text-primary" />
                                            DJ/Artist {index + 1}
                                        </Label>
                                        {djList.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveDj(index)}
                                                className="text-primary cursor-pointer text-xs hover:underline"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <Input
                                        value={dj.name}
                                        onChange={(e) => handleDjNameChange(e, index)}
                                        placeholder="Enter DJ name..."
                                        className="bg-gray-950 border border-gray-800 text-white placeholder:text-gray-600"
                                    />
                                </div>
                            ))}

                            {djList.length < 4 && (
                                <Button
                                    type="button"
                                    onClick={handleAddDj}
                                    className="mt-2 bg-primary hover:cursor-pointer w-full"
                                >
                                    Add DJ/Artist ({djList.length}/4)
                                </Button>
                            )}
                        </div>

                        {/* Host Section - TEXT ONLY, MAX 2 */}
                        <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border border-gray-800">
                            <h2 className="text-xl font-bold">Host (Text Only)</h2>

                            {hostList.map((host, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-semibold">
                                            Host {index + 1}
                                        </Label>
                                        {hostList.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveHost(index)}
                                                className="text-primary cursor-pointer text-xs hover:underline"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <Input
                                        value={host.name}
                                        onChange={(e) => handleHostNameChange(e, index)}
                                        placeholder="Enter host name..."
                                        className="bg-gray-950 border border-gray-800 text-white placeholder:text-gray-600"
                                    />
                                </div>
                            ))}

                            {hostList.length < 2 && (
                                <Button
                                    type="button"
                                    onClick={handleAddHost}
                                    className="mt-2 bg-primary hover:cursor-pointer w-full"
                                >
                                    Add Host ({hostList.length}/2)
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Sponsors Section */}
                    <SponsorsBlock />

                    {/* Split Layout: Delivery Time (Left) + Extras (Right) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DeliveryTimeBlock />
                        <ExtrasBlock />
                    </div>

                    {/* Note for the Designer */}
                    <div className="space-y-2">
                        <Textarea
                            value={note}
                            rows={3}
                            onChange={(e) => {
                                setNote(e.target.value);
                                flyerFormStore.updateCustomNote(e.target.value);
                            }}
                            placeholder="Note for the Designer"
                            className="bg-gray-950 border border-gray-800 text-white
             placeholder:text-gray-600 rounded-lg 
             shadow-md
             focus-visible:!ring-0 focus-visible:!outline-none
             focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
             transition-all duration-300"
                        />
                    </div>



                    {/* Submit Section */}
                    <div className="bg-gradient-to-br from-red-950/30 to-black p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
                        <div className="flex gap-4 justify-center items-center">
                            <Button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleCheckout}
                                className="bg-primary hover:bg-red-550 text-white px-3 
                rounded-lg hover:cursor-pointer transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/50"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Check className="w-5 h-5" />
                                        Checkout Now
                                    </span>
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="hover:cursor-pointer"
                                onClick={addToCart}
                            >
                                Add To Cart
                            </Button>
                        </div>

                        {/* Right: Total Amount */}
                        <div className="text-right">
                            <span className="block text-sm text-gray-300 font-semibold">
                                Total
                            </span>
                            <span className="text-primary font-bold text-lg">
                                {formatCurrency(flyerFormStore.subtotal > 0 ? flyerFormStore.subtotal : fixedPrice)}
                            </span>
                        </div>
                    </div>

                    {/* Similar Flyers */}
                    <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border border-gray-800">
                        <h3 className="text-xl font-bold text-white">Similar Flyers</h3>
                        <div className="">
                            <FlyersCarousel flyers={flyerFormStore.similarFlyers} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default observer(NoPhotoForm);
