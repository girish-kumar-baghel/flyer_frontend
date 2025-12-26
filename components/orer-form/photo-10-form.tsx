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
import { FlyerRibbon } from "./flyer-ribbon";
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

interface Photo10FormProps {
    flyer?: Flyer;
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

const Photo10Form: React.FC<Photo10FormProps> = ({ flyer }) => {
    const { flyerFormStore, cartStore, authStore } = useStore();

    const FIXED_PRICE = 10; // $10 With Photo

    // DJ List: First 2 with photo, Last 2 text-only
    const [djList, setDjList] = useState<{ name: string; image: string | null; hasPhoto: boolean }[]>([
        { name: "", image: null, hasPhoto: true },  // DJ 1 - with photo
        { name: "", image: null, hasPhoto: true },  // DJ 2 - with photo
        { name: "", image: null, hasPhoto: false }, // DJ 3 - text only
        { name: "", image: null, hasPhoto: false }, // DJ 4 - text only
    ]);

    // Host List: First with photo, Second text-only
    const [hostList, setHostList] = useState<{ name: string; image: string | null; hasPhoto: boolean }[]>([
        { name: "", image: null, hasPhoto: true },  // Host 1 - with photo
        { name: "", image: null, hasPhoto: false }, // Host 2 - text only
    ]);

    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAllDJs, setShowAllDJs] = useState(false); // Control visibility of DJ 3 & 4

    // Handle DJ name change
    const handleDjNameChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newDjList = [...djList];
        newDjList[index].name = e.target.value;
        setDjList(newDjList);
        flyerFormStore.updateDJ(index, "name", e.target.value);
    };

    // Handle DJ photo upload (only for DJ 1 and 2)
    const handleDjPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file && djList[index].hasPhoto) {
            flyerFormStore.updateDJ(index, "image", file);

            const reader = new FileReader();
            reader.onload = () => {
                setDjList((prev) => {
                    const newList = [...prev];
                    newList[index].image = reader.result as string;
                    return newList;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove DJ photo
    const handleRemoveDjPhoto = (index: number) => {
        flyerFormStore.updateDJ(index, "image", null);
        setDjList((prev) => {
            const newList = [...prev];
            newList[index].image = null;
            return newList;
        });
    };

    // Ensure store has enough hosts for this form (2 hosts)
    useEffect(() => {
        if (!flyerFormStore.flyerFormDetail.host) {
            flyerFormStore.addHost(); // 1st
            flyerFormStore.addHost(); // 2nd
        } else {
            while (flyerFormStore.flyerFormDetail.host.length < 2) {
                flyerFormStore.addHost();
            }
        }
    }, [flyerFormStore]);

    // Handle Host name change
    const handleHostNameChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newHostList = [...hostList];
        newHostList[index].name = e.target.value;
        setHostList(newHostList);
        flyerFormStore.updateHost(index, "name", e.target.value);
    };

    // Handle Host photo upload (only for Host 1)
    const handleHostPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file && hostList[index].hasPhoto) {
            flyerFormStore.updateHost(index, "image", file);

            const reader = new FileReader();
            reader.onload = () => {
                setHostList((prev) => {
                    const newList = [...prev];
                    newList[index].image = reader.result as string;
                    return newList;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove Host photo
    const handleRemoveHostPhoto = (index: number) => {
        flyerFormStore.updateHost(index, "image", null);
        setHostList((prev) => {
            const newList = [...prev];
            newList[index].image = null;
            return newList;
        });
    };

    // Add to cart
    const addToCart = async () => {
        if (!authStore.user?.id) {
            toast.error("Please sign in to add items to your cart.");
            authStore.handleAuthModal();
            return;
        }

        const { valid, errors } = flyerFormStore.validateForm();
        if (!valid) {
            toast.error(errors.join("\n"));
            return;
        }

        flyerFormStore.setUserId(authStore.user.id);

        const cartFormData = createCartFormData(flyerFormStore.flyerFormDetail, {
            flyerId: flyer?.id || "",
            categoryId: flyer?.category_id || flyer?.category || "",
            totalPrice: String(FIXED_PRICE),
            subtotal: String(FIXED_PRICE),
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

        const { valid, errors } = flyerFormStore.validateForm();
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

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="grid lg:grid-cols-2 gap-8 p-3 md:p-5 max-w-[1600px] mx-auto">
                {/* Left: Flyer Preview */}
                <div className="space-y-4">
                    {/* Header: Title & Price */}
                    <div className="flex justify-between items-start gap-4">
                        <h1 className="text-3xl font-bold text-white leading-tight max-w-[70%]">{flyerName}</h1>

                        <div className="flex flex-col items-end shrink-0 bg-gray-900/50 px-4 py-2 rounded-xl border border-gray-800">
                            <span className="text-primary font-bold text-xl leading-none">
                                {formatCurrency(FIXED_PRICE)}
                            </span>
                            {/* <span className="text-[10px] uppercase tracking-wider text-gray-300 font-medium mt-1">
                                $10 With Photo
                            </span> */}
                        </div>
                    </div>

                    <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl bg-gray-900/50">
                        <img
                            src={flyerImage}
                            alt={flyerName}
                            className="w-full h-full object-contain"
                        />
                        {/* Dynamic Ribbon */}
                        <FlyerRibbon flyer={flyer} />
                    </div>
                </div>

                {/* Right: $10 With Photo Form */}
                <form className="space-y-6">
                    {/* Event Details */}
                    <EventDetails />

                    {/* Split Layout: DJ/Artist (Left) + Host (Right) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* DJ/Artist Section - 2 WITH PHOTO + 2 TEXT ONLY */}
                        <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border border-gray-800">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">DJ or Artist</h2>
                                {/* <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-md font-semibold">
                                    $10 Form
                                </span> */}
                            </div>
                            <p className="text-xs text-gray-400">First 2 with photo, Last 2 text-only</p>

                            {djList.map((dj, index) => {
                                // Show DJ 1 & 2 always, DJ 3 & 4 only if showAllDJs is true
                                if (index >= 2 && !showAllDJs) return null;

                                return (
                                    <div key={index} className="space-y-2">
                                        <Label className="text-sm font-semibold flex items-center gap-2">
                                            <Music className="w-4 h-4 text-primary" />
                                            DJ/Artist {index + 1} {dj.hasPhoto && "(With Photo)"}
                                        </Label>

                                        {/* Input field with inline upload button and preview */}
                                        <div className="relative">
                                            <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-lg shadow-md hover:border-primary hover:shadow-[0_0_15px_rgba(185,32,37,0.8)] transition-all duration-300 pr-3">
                                                {/* Name input - takes full width */}
                                                <Input
                                                    value={dj.name}
                                                    onChange={(e) => handleDjNameChange(e, index)}
                                                    placeholder="Enter DJ name..."
                                                    className="bg-transparent border-none text-white placeholder:text-gray-600 
                                                      focus-visible:ring-0 focus-visible:ring-offset-0 h-10 flex-1 pl-3"
                                                />

                                                {/* Image preview (if uploaded) */}
                                                {dj.hasPhoto && dj.image && (
                                                    <>
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                src={dj.image}
                                                                alt="DJ"
                                                                className="w-8 h-8 rounded object-cover border border-primary"
                                                            />
                                                        </div>

                                                        {/* Remove image button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveDjPhoto(index)}
                                                            className="text-primary text-xs hover:underline font-semibold flex-shrink-0"
                                                        >
                                                            Remove
                                                        </button>
                                                    </>
                                                )}

                                                {/* Upload button (only show if hasPhoto and NO image) */}
                                                {dj.hasPhoto && !dj.image && (
                                                    <label htmlFor={`dj-upload-${index}`} className="cursor-pointer flex-shrink-0">
                                                        <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 hover:bg-primary/20 transition-all">
                                                            <Upload className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <input
                                                            id={`dj-upload-${index}`}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleDjPhotoUpload(e, index)}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Add More / Show Less Button */}
                            <Button
                                type="button"
                                onClick={() => setShowAllDJs(!showAllDJs)}
                                className="mt-2 bg-primary hover:bg-red-550 hover:cursor-pointer w-full"
                            >
                                {showAllDJs ? `Show Less (${djList.length}/4)` : `Add More (2/4)`}
                            </Button>
                        </div>

                        {/* Host Section - 1 WITH PHOTO + 1 TEXT ONLY */}
                        <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border border-gray-800">
                            <h2 className="text-xl font-bold">Host</h2>
                            <p className="text-xs text-gray-400">First with photo, Second text-only</p>

                            {hostList.map((host, index) => (
                                <div key={index} className="space-y-2">
                                    <Label className="text-sm font-semibold">
                                        Host {index + 1} {host.hasPhoto && "(With Photo)"}
                                    </Label>

                                    {/* Input field with inline upload button and preview */}
                                    <div className="relative">
                                        <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-lg shadow-md hover:border-primary hover:shadow-[0_0_15px_rgba(185,32,37,0.8)] transition-all duration-300 pr-3">
                                            {/* Name input - takes full width */}
                                            <Input
                                                value={host.name}
                                                onChange={(e) => handleHostNameChange(e, index)}
                                                placeholder="Enter host name..."
                                                className="bg-transparent border-none text-white placeholder:text-gray-600 
                                                  focus-visible:ring-0 focus-visible:ring-offset-0 h-10 flex-1 pl-3"
                                            />

                                            {/* Image preview (if uploaded) */}
                                            {host.hasPhoto && host.image && (
                                                <>
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={host.image}
                                                            alt="Host"
                                                            className="w-8 h-8 rounded object-cover border border-primary"
                                                        />
                                                    </div>

                                                    {/* Remove image button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveHostPhoto(index)}
                                                        className="text-primary text-xs hover:underline font-semibold flex-shrink-0"
                                                    >
                                                        Remove
                                                    </button>
                                                </>
                                            )}

                                            {/* Upload button (only show if hasPhoto and NO image) */}
                                            {host.hasPhoto && !host.image && (
                                                <label htmlFor={`host-upload-${index}`} className="cursor-pointer flex-shrink-0">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 hover:bg-primary/20 transition-all">
                                                        <Upload className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <input
                                                        id={`host-upload-${index}`}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleHostPhotoUpload(e, index)}
                                                        className="hidden"
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                                {formatCurrency(flyerFormStore.subtotal > 0 ? flyerFormStore.subtotal : FIXED_PRICE)}
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

export default observer(Photo10Form);
