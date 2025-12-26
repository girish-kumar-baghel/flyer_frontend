"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Music, Check } from "lucide-react";
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

interface Photo15FormProps {
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

const Photo15Form: React.FC<Photo15FormProps> = ({ flyer }) => {
    const { flyerFormStore, cartStore, authStore } = useStore();

    const FIXED_PRICE = 15; // $15 With Photo

    // DJ List: ALL 4 with photo support
    const [djList, setDjList] = useState<{ name: string; image: string | null }[]>([
        { name: "", image: null },
        { name: "", image: null },
        { name: "", image: null },
        { name: "", image: null },
    ]);

    // Host List: ALL 2 with photo support
    const [hostList, setHostList] = useState<{ name: string; image: string | null }[]>([
        { name: "", image: null },
        { name: "", image: null },
    ]);

    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle DJ name change
    const handleDjNameChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newDjList = [...djList];
        newDjList[index].name = e.target.value;
        setDjList(newDjList);
        flyerFormStore.updateDJ(index, "name", e.target.value);
    };

    // Handle DJ photo upload (all 4 DJs)
    const handleDjPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
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
    useEffect(() => { // Using explicit useEffect if needed, but since we are modifying state, let's just do it
        if (!flyerFormStore.flyerFormDetail.host) {
            flyerFormStore.addHost();
            flyerFormStore.addHost();
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

    // Handle Host photo upload (all 2 Hosts)
    const handleHostPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
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
                <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                    <img
                        src={flyerImage}
                        alt={flyerName}
                        className="w-full h-full object-cover"
                    />
                    {/* Dynamic Ribbon */}
                    <FlyerRibbon flyer={flyer} />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                        <h1 className="text-2xl font-bold text-white mb-2">{flyerName}</h1>
                        <div className="flex items-center gap-2">
                            <span className="text-primary font-bold text-xl">
                                {formatCurrency(FIXED_PRICE)}
                            </span>
                            <span className="text-sm text-gray-400">($15 With Photo - Full Support)</span>
                        </div>
                    </div>
                </div>

                {/* Right: $15 With Photo Form */}
                <form className="space-y-6">
                    {/* Event Details */}
                    <EventDetails />

                    {/* Split Layout: DJ/Artist (Left) + Host (Right) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* DJ/Artist Section - ALL 4 WITH PHOTO */}
                        <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border border-gray-800">
                            <h2 className="text-xl font-bold">DJ or Artist</h2>
                            <p className="text-xs text-gray-400">All 4 DJs with photo support</p>

                            {djList.map((dj, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-semibold flex items-center gap-2">
                                            <Music className="w-4 h-4 text-primary" />
                                            DJ/Artist {index + 1}
                                        </Label>
                                        <label htmlFor={`dj-upload-${index}`} className="cursor-pointer">
                                            <div className="flex items-center gap-2 text-primary">
                                                <span className="text-xs font-semibold">Upload Photo</span>
                                                <Upload className="w-3 h-3" />
                                            </div>
                                            <input
                                                id={`dj-upload-${index}`}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleDjPhotoUpload(e, index)}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    {dj.image && (
                                        <div className="flex items-center gap-3 bg-gray-950 border rounded-lg p-2">
                                            <img
                                                src={dj.image}
                                                alt="DJ"
                                                className="w-12 h-12 rounded-lg object-cover border-2 border-primary"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveDjPhoto(index)}
                                                className="text-primary text-xs hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}

                                    <Input
                                        value={dj.name}
                                        onChange={(e) => handleDjNameChange(e, index)}
                                        placeholder="Enter DJ name..."
                                        className="bg-gray-950 border border-gray-800 text-white placeholder:text-gray-600"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Host Section - ALL 2 WITH PHOTO */}
                        <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border border-gray-800">
                            <h2 className="text-xl font-bold">Host</h2>
                            <p className="text-xs text-gray-400">All 2 Hosts with photo support</p>

                            {hostList.map((host, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-semibold">
                                            Host {index + 1}
                                        </Label>
                                        <label htmlFor={`host-upload-${index}`} className="cursor-pointer">
                                            <div className="flex items-center gap-2 text-primary">
                                                <span className="text-xs font-semibold">Upload Photo</span>
                                                <Upload className="w-3 h-3" />
                                            </div>
                                            <input
                                                id={`host-upload-${index}`}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleHostPhotoUpload(e, index)}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    {host.image && (
                                        <div className="flex items-center gap-3 bg-gray-950 border rounded-lg p-2">
                                            <img
                                                src={host.image}
                                                alt="Host"
                                                className="w-12 h-12 rounded-lg object-cover border-2 border-primary"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveHostPhoto(index)}
                                                className="text-primary text-xs hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}

                                    <Input
                                        value={host.name}
                                        onChange={(e) => handleHostNameChange(e, index)}
                                        placeholder="Enter host name..."
                                        className="bg-gray-950 border border-gray-800 text-white placeholder:text-gray-600"
                                    />
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

export default observer(Photo15Form);
