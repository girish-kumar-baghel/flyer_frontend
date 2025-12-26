"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Check, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { toast } from "sonner";

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

interface BirthdayFormProps {
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

const BirthdayForm: React.FC<BirthdayFormProps> = ({ flyer }) => {
    const { flyerFormStore, cartStore, authStore } = useStore();

    const [birthdayPersonPhoto, setBirthdayPersonPhoto] = useState<File | null>(null);
    const [birthdayPhotoPreview, setBirthdayPhotoPreview] = useState<string | null>(null);
    const [hostList, setHostList] = useState<{ name: string }[]>([{ name: "" }]);
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const FIXED_BIRTHDAY_PRICE = 10; // Fixed $10 price for Birthday flyers

    // Handle Birthday Person Photo upload
    const handleBirthdayPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBirthdayPersonPhoto(file);
            flyerFormStore.updateEventDetails("venueLogo", file);

            const reader = new FileReader();
            reader.onload = () => {
                setBirthdayPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove Birthday Person Photo
    const handleRemoveBirthdayPhoto = () => {
        setBirthdayPersonPhoto(null);
        setBirthdayPhotoPreview(null);
        flyerFormStore.updateEventDetails("venueLogo", null);
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
            toast.error("Maximum 2 hosts allowed for Birthday forms");
        }
    };

    // Remove Host field
    const handleRemoveHost = (index: number) => {
        if (hostList.length > 1) {
            setHostList(hostList.filter((_, i) => i !== index));
            flyerFormStore.removeHost(index);
        }
    };

    // Validate Birthday form
    const validateBirthdayForm = () => {
        const errors: string[] = [];

        // Birthday Person Photo is OPTIONAL
        // Only Event Title and Delivery Time are required (handled by base validation)

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

        const { valid, errors } = validateBirthdayForm();
        if (!valid) {
            toast.error(errors.join("\n"));
            return;
        }

        flyerFormStore.setUserId(authStore.user.id);

        const formDetailForCart = {
            ...flyerFormStore.flyerFormDetail,
            eventDetails: {
                ...flyerFormStore.flyerFormDetail.eventDetails,
                venueLogo: birthdayPersonPhoto || undefined
            }
        };

        const cartFormData = createCartFormData(formDetailForCart, {
            flyerId: flyer?.id || "",
            categoryId: flyer?.category_id || flyer?.category || "",
            totalPrice: String(FIXED_BIRTHDAY_PRICE),
            subtotal: String(FIXED_BIRTHDAY_PRICE),
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

        const { valid, errors } = validateBirthdayForm();
        if (!valid) {
            toast.error(errors.join("\n"));
            return;
        }

        setIsSubmitting(true);

        try {
            // Implement checkout logic here
            toast.success("Proceeding to checkout...");
            // Redirect to checkout page or create Stripe session
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
                                {formatCurrency(FIXED_BIRTHDAY_PRICE)}
                            </span>
                            <span className="text-sm text-gray-400">(Fixed Birthday Price)</span>
                        </div>
                    </div>
                </div>

                {/* Right: Birthday Form */}
                <form className="space-y-6">
                    {/* Birthday Person Photo - SINGLE UPLOAD ONLY */}
                    <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border border-gray-800">
                        <h2 className="text-xl font-bold">Birthday Person Photo</h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <label htmlFor="birthday-photo-upload" className="cursor-pointer">
                                    <div className="flex items-center gap-2 text-primary">
                                        <span className="text-sm font-semibold">Upload Photo</span>
                                        <Upload className="w-4 h-4" />
                                    </div>
                                    <input
                                        id="birthday-photo-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBirthdayPhotoUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {birthdayPhotoPreview && (
                                <div className="flex items-center gap-3 bg-gray-950 border rounded-lg p-3 shadow-md">
                                    <img
                                        src={birthdayPhotoPreview}
                                        alt="Birthday Person"
                                        className="w-16 h-16 rounded-lg object-cover border-2 border-primary"
                                    />
                                    <span className="text-sm text-gray-300 flex-1">
                                        {birthdayPersonPhoto?.name || "Photo uploaded"}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleRemoveBirthdayPhoto}
                                        className="text-primary text-xs hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Event Details */}
                    <EventDetails />

                    {/* Host Section - FULL WIDTH, TEXT ONLY, MAX 2 */}
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
                                {formatCurrency(flyerFormStore.subtotal > 0 ? flyerFormStore.subtotal : FIXED_BIRTHDAY_PRICE)}
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

export default observer(BirthdayForm);
