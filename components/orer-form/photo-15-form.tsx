"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Music, Check } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { toast } from "sonner";
import { saveToLibrary, saveToTemp } from "@/lib/uploads";
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
    const [djList, setDjList] = useState<{ name: string; image: string | null; }[]>(() => {
        return [0, 1, 2, 3].map((i) => ({
            name: "",
            image: null
        }));
    });

    // Host List: ALL 2 with photo support
    const [hostList, setHostList] = useState<{ name: string; image: string | null; }[]>(() => {
        return [0, 1].map((i) => ({
            name: "",
            image: null
        }));
    });

    // Sync from MobX store after mount to be SSR-safe
    useEffect(() => {
        const storeDJs = flyerFormStore.flyerFormDetail.djsOrArtists;
        setDjList([0, 1, 2, 3].map((i) => ({
            name: storeDJs[i]?.name || "",
            image: (storeDJs[i]?.image && typeof window !== 'undefined') ? URL.createObjectURL(storeDJs[i].image!) : null
        })));

        const storeHosts = flyerFormStore.flyerFormDetail.host || [];
        setHostList([0, 1].map((i) => ({
            name: storeHosts[i]?.name || "",
            image: (storeHosts[i]?.image && typeof window !== 'undefined') ? URL.createObjectURL(storeHosts[i].image!) : null
        })));
    }, [flyerFormStore.flyerFormDetail]);

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

    // Ensure store has enough hosts for this form (2 hosts) and DJs (4)
    useEffect(() => {
        // Expand DJs to 4
        while (flyerFormStore.flyerFormDetail.djsOrArtists.length < 4) {
            flyerFormStore.addDJ();
        }

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
            toast.info("Uploading images to temp storage...");

            // Track temp files to send to backend later
            const tempFiles: Record<string, string> = {};

            // 1. Upload Venue Logo to TEMP
            let venueLogoUrl = "";
            if (flyerFormStore.flyerFormDetail.eventDetails.venueLogo) {
                const res = await saveToTemp(flyerFormStore.flyerFormDetail.eventDetails.venueLogo, "venue_logo");
                if (res) {
                    tempFiles['venue_logo'] = res.filepath;
                    venueLogoUrl = res.filepath;
                }
            }

            // 2. Upload DJs to TEMP
            const djsWithUrls = await Promise.all(flyerFormStore.flyerFormDetail.djsOrArtists.map(async (dj, idx) => {
                let imageUrl = "";
                if (dj.image) {
                    const res = await saveToTemp(dj.image, `dj_${idx}`);
                    if (res) {
                        tempFiles[`dj_${idx}`] = res.filepath;
                        imageUrl = res.filepath;
                    }
                }
                return { name: dj.name, image_url: imageUrl };
            }));

            // 3. Upload Hosts to TEMP
            const hostsWithUrls = await Promise.all((flyerFormStore.flyerFormDetail.host || []).map(async (h, idx) => {
                let imageUrl = "";
                if (h.image) {
                    const res = await saveToTemp(h.image, `host_${idx}`);
                    if (res) {
                        tempFiles[`host_${idx}`] = res.filepath;
                        imageUrl = res.filepath;
                    }
                }
                return { name: h.name, image_url: imageUrl };
            }));

            // 4. Upload Sponsors to TEMP
            const sponsors = flyerFormStore.flyerFormDetail.sponsors;
            const sponsorData: Array<{ name: string; image_url: string }> = [];

            if (sponsors.sponsor1) {
                const res = await saveToTemp(sponsors.sponsor1, "sponsor_0");
                if (res) {
                    tempFiles['sponsor_0'] = res.filepath;
                    sponsorData.push({ name: sponsors.sponsor1.name || "Sponsor 1", image_url: res.filepath });
                }
            } else {
                sponsorData.push({ name: "", image_url: "" });
            }

            if (sponsors.sponsor2) {
                const res = await saveToTemp(sponsors.sponsor2, "sponsor_1");
                if (res) {
                    tempFiles['sponsor_1'] = res.filepath;
                    sponsorData.push({ name: sponsors.sponsor2.name || "Sponsor 2", image_url: res.filepath });
                }
            } else {
                sponsorData.push({ name: "", image_url: "" });
            }

            if (sponsors.sponsor3) {
                const res = await saveToTemp(sponsors.sponsor3, "sponsor_2");
                if (res) {
                    tempFiles['sponsor_2'] = res.filepath;
                    sponsorData.push({ name: sponsors.sponsor3.name || "Sponsor 3", image_url: res.filepath });
                }
            } else {
                sponsorData.push({ name: "", image_url: "" });
            }

            // Construct API Body
            const apiBody = {
                presenting: flyerFormStore.flyerFormDetail.eventDetails.presenting,
                event_title: flyerFormStore.flyerFormDetail.eventDetails.mainTitle,
                event_date: flyerFormStore.flyerFormDetail.eventDetails.date
                    ? new Date(flyerFormStore.flyerFormDetail.eventDetails.date).toISOString().split("T")[0]
                    : "",
                flyer_info: flyerFormStore.flyerFormDetail.eventDetails.flyerInfo,
                address_phone: flyerFormStore.flyerFormDetail.eventDetails.addressAndPhone,

                djs: djsWithUrls,
                host: hostsWithUrls,
                sponsors: sponsorData,
                venue_logo_url: venueLogoUrl,
                venue_text: flyerFormStore.flyerFormDetail.eventDetails.venueText,

                story_size_version: flyerFormStore.flyerFormDetail.extras.storySizeVersion,
                custom_flyer: flyerFormStore.flyerFormDetail.extras.customFlyer,
                animated_flyer: flyerFormStore.flyerFormDetail.extras.animatedFlyer,
                instagram_post_size: flyerFormStore.flyerFormDetail.extras.instagramPostSize,

                custom_notes: flyerFormStore.flyerFormDetail.customNote,
                flyer_is: flyer?.id ?? flyerFormStore.flyerFormDetail.flyerId ?? "15",
                category_id: flyer?.category_id ?? flyerFormStore.flyerFormDetail.categoryId,
                user_id: authStore.user.id,

                delivery_time: flyerFormStore.flyerFormDetail.deliveryTime,
                total_price: flyerFormStore.subtotal > 0 ? flyerFormStore.subtotal : FIXED_PRICE,
                subtotal: flyerFormStore.subtotal > 0 ? flyerFormStore.subtotal : FIXED_PRICE,
                image_url: flyer?.image_url || flyer?.imageUrl || "",

                // IMPORTANT: Pass the temp file mapping so success handler can pick them up
                temp_files: tempFiles
            };

            // Create Stripe Session
            const res = await fetch("/api/checkout/create-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: apiBody.total_price,
                    orderData: {
                        userId: authStore.user.id,
                        userEmail: authStore.user.email || authStore.user.name || 'unknown@example.com',
                        formData: apiBody
                    }
                })
            });

            if (!res.ok) throw new Error("Failed to create checkout session");

            const data = await res.json();
            if (!data.sessionId) throw new Error("No session ID returned");

            const stripeSession = await fetch(`/api/checkout/get-session-url?sessionId=${data.sessionId}`);
            const { url } = await stripeSession.json();

            if (url) {
                window.location.href = url;
            } else {
                throw new Error("No checkout URL");
            }

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
        <div className="min-h-screen bg-black text-white overflow-x-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-3 md:p-5 max-w-[1600px] mx-auto w-full">
                {/* Left: Flyer Preview */}
                <div className="relative aspect-[4/5] w-full max-w-[280px] mx-auto lg:max-w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
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
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleCheckout}
                                className="h-10 px-6 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/50 bg-[#b92025] hover:bg-red-600 font-semibold"
                                style={{ backgroundColor: '#b92025', color: 'white' }}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2 text-white">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 text-white">
                                        <Check className="w-5 h-5" />
                                        Checkout Now
                                    </span>
                                )}
                            </button>

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
