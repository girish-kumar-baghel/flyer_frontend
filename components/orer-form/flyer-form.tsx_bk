"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  Music,
  Check,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { toJS } from "mobx";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SponsorsBlock from "./sponser";
import ExtrasBlock from "./extra-block";
import DeliveryTimeBlock from "./delivery-time-block";
import { FlyersCarousel } from "../home/FlyersCarousel";
import HostSection from "./host-block";
import EventDetails from "./event-details";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Item {
  name: string;
  price: number;
  quantity: number;
}

interface Props {
  items: Item[];
}


type Flyer = {
  id: string;
  name: string;
  category: string;
  price: number;
  priceType: "basic" | "regular" | "premium";
  hasPhotos: boolean;
  imageUrl: string;
  tags: string[];
  isRecentlyAdded?: boolean;
  isFeatured?: boolean;
};



const EventBookingForm = () => {

  const { flyerFormStore, cartStore } = useStore();

  const [flyer, setFlyer] = useState<Flyer | undefined>(undefined);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [djList, setDjList] = useState<
    { name: string; image: string | null }[]
  >([
    { name: "", image: null },
    { name: "", image: null },
  ]);

  const [djListText, setDjListText] = useState<
    { name: string }[]
  >([
    { name: "" },
    { name: "" },
  ]);



  // ✅ Handle DJ name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    flyerFormStore.updateDJ(index, "name", e.target.value)


    // 3️⃣ Update local UI preview (if you’re using local state for preview)
    if (flyer?.hasPhotos == true) {
      setDjList((prev) => {
        const newList = [...prev];
        newList[index].name = e.target.value; // base64 preview
        return newList;
      })
    } else {
      setDjListText((prev) => {
        const newList2 = [...prev];
        newList2[index].name = e.target.value
        return newList2;
      })
    }
  }

  // ✅ Handle image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1️⃣ Update the MobX store with the raw File
      flyerFormStore.updateDJ(index, "image", file);

      // 2️⃣ Create a preview using FileReader
      const reader = new FileReader();
      reader.onload = () => {
        // 3️⃣ Update local UI preview (if you’re using local state for preview)
        setDjList((prev) => {
          const newList = [...prev];
          newList[index].image = reader.result as string; // base64 preview
          return newList;
        });
      };
      reader.readAsDataURL(file); // 4️⃣ Convert file → base64
    }
  };


  // ✅ Remove image
  const handleRemoveImage = (index: number) => {
    flyerFormStore.updateDJ(index, "image", null)
    setDjList((prev) => {
      const newList = [...prev];
      newList[index].image = null;
      return newList;
    });
  }

  // ✅ Add new DJ field
  const handleAddField = () => {
    flyerFormStore.addDJ()
    if (flyer?.hasPhotos == true) {
      setDjList(prev => [...prev, { name: "", image: null }])
    } else {
      setDjListText(prev => [...prev, { name: '' }])
    }


  }

  const handleRemoveField = (index: number) => {
    flyerFormStore.removeDJ(index);

    if (flyer?.hasPhotos === true) {
      setDjList(prev => prev.filter((_, i) => i !== index));
    } else {
      setDjListText(prev => prev.filter((_, i) => i !== index));
    }
  };


  useEffect(() => {
    // whenever store.flyer changes, update local state
    setFlyer(flyerFormStore.flyer ?? undefined);
  }, [flyerFormStore.flyer]);


  // submit function 
  const handleSubmit = async (e: React.FormEvent) => {


    e.preventDefault();
    setIsSubmitting(true);

    // valiadte 
    const { valid, errors } = flyerFormStore.validateForm()
    if (!valid) {
      alert(errors.join("\n"))
      return
    }





    const handleCheckout = async () => {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: flyerFormStore.flyerFormDetail }), // key must match backend
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        alert("Checkout URL not generated. Please try again.");
        console.error("Stripe session response:", data);
      }
    };


    await handleCheckout();


    setIsSubmitting(false);
  };

  // add to cart function 
  const addtoCart = (id: string) => {

    if (flyerFormStore.flyerFormDetail.eventDetails.date == null || flyerFormStore.flyerFormDetail.deliveryTime == '') {
      toast("Please fill date field and choose delivery time.")
      return
    }

    cartStore.addToCart(id)
    toast.success('Added to cart. You can keep shopping.')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid lg:grid-cols-2 gap-8 p-3 md:p-5 max-w-[1600px] mx-auto">
        {/* Left Side - Event Flyer */}
        <div className="space-y-6">
          <div className="relative bg-gradient-to-br from-orange-900/20 via-black to-purple-900/20 rounded-2xl overflow-hidden  glow-effect transition-all duration-300 ">


            <div className="relative p-3 md:p-6 space-y-4">
              <div className="space-y-2 float-effect flex justify-between items-center">
                <h1
                  className="text-xl md:text-2xl font-bold text-white "

                >
                  {flyer?.name}
                </h1>

                {/* Price Section */}
                <div className="flex">

                  <span className="text-sm font-semibold text-white border-1 border-primary px-4 py-1 rounded-md shadow-md">
                    ${flyer?.price}
                  </span>

                </div>
              </div>

              <div className="aspect-[4/5]  rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-primary hover:scale-[1.02]">
                <img
                  src={flyer?.imageUrl}
                  alt="Event promotional image"
                  className="w-full h-full object-cover"
                />
              </div>


            </div>
          </div>
        </div>


        {/* Right Side - Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Event Details Section */}
          <EventDetails />

          {/* Additional Information Section */}
          <div
            className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 
        rounded-2xl border border-gray-800"
          >
            <h2 className="text-xl font-bold">DJ or Artist</h2>

            {flyer?.hasPhotos == true ? djList.map((dj, index) => (
              <div key={index} className="grid grid-cols-2 gap-6 mb-4">
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Music className="w-4 h-4 text-theme text-sm" />
                      Main DJ or Artist {index + 1}
                    </Label>

                    <div className="flex items-center gap-4">
                      {/* Upload */}
                      <label htmlFor={`dj-upload-${index}`} className="cursor-pointer">
                        <div className="flex items-center gap-2 text-primary">
                          <span className="text-sm font-semibold">Upload Image</span>
                          <Upload className="w-4 h-4" />
                        </div>
                        <input
                          id={`dj-upload-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, index)}
                          className="hidden"
                        />
                      </label>

                      {/* Remove Field Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveField(index)}
                        className="text-primary cursor-pointer text-xs hover:underline"
                      >
                        Remove Field
                      </button>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-3 bg-gray-950 border rounded-lg p-3 h-10 shadow-md
                hover:border-primary hover:shadow-[0_0_15px_rgba(185,32,37,0.8)]
                transition-all duration-300"
                  >
                    {dj.image && (
                      <>
                        <img
                          src={dj.image}
                          alt="DJ"
                          className="w-8 h-8 rounded-full object-fill border-2 border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="text-primary text-xs hover:underline"
                        >
                          Remove Image
                        </button>
                      </>
                    )}

                    <Input
                      value={dj.name}
                      onChange={(e) => handleNameChange(e, index)}
                      placeholder="Enter DJ name..."
                      className="bg-transparent border-none text-white placeholder:text-gray-600 
                  focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                    />

                    <span className="text-gray-500 text-sm whitespace-nowrap">
                      {dj.image ? "Image uploaded" : "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>
            ))
              :
              djListText.map((dj, index) => (
                <div key={index} className="grid grid-cols-2 gap-6 mb-4">
                  <div className="col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <Music className="w-4 h-4 text-theme text-sm" />
                        Main DJ or Artist {index + 1}
                      </Label>

                      {/* Remove Field Button (same as photo version) */}
                      <button
                        type="button"
                        onClick={() => handleRemoveField(index)}
                        className="text-primary cursor-pointer text-xs hover:underline"
                      >
                        Remove Field
                      </button>
                    </div>

                    <div
                      className="flex items-center gap-3 bg-gray-950 border rounded-lg p-3 h-10 shadow-md
        hover:border-primary hover:shadow-[0_0_15px_rgba(185,32,37,0.8)]
        transition-all duration-300"
                    >
                      <Input
                        value={dj.name}
                        onChange={(e) => handleNameChange(e, index)}
                        placeholder="Enter DJ name..."
                        className="bg-transparent border-none text-white placeholder:text-gray-600 
          focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                      />
                    </div>
                  </div>
                </div>
              ))
            }

            <Button
              type="button"
              onClick={handleAddField}
              className="mt-2 bg-primary hover:cursor-pointer"
            >
              Add More
            </Button>
          </div>

          {/* Host Information Section */}
          <HostSection />

          {/* sponser Section */}
          <SponsorsBlock />

          {/* Extras Section */}
          <ExtrasBlock />

          {/* Delivery Time Section */}
          <DeliveryTimeBlock />

          {/* Note Section */}
          <div className="space-y-2">
            <Textarea
              value={note}
              rows={3}
              onChange={(e) => (setNote(e.target.value), flyerFormStore.updateCustomNote(e.target.value))}
              placeholder="Custom note..."
              className="bg-gray-950 border border-gray-800 text-white
             placeholder:text-gray-600 rounded-lg 
             shadow-md
             focus-visible:!ring-0 focus-visible:!outline-none
             focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
             transition-all duration-300"
            />
          </div>

          {/* Submit Section */}
          <div
            className="bg-gradient-to-br from-red-950/30 to-black p-4 rounded-2xl border border-gray-800 
          flex items-center justify-between"
          >
            <div className="flex gap-4 justify-center items-center">
              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
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

              {/* Add to Cart Button */}
              <Button type="button" variant={'outline'} className="hover:cursor-pointer" onClick={() => addtoCart(flyer?.id ?? '')}>Add To Cart</Button>

            </div>
            {/* Right: Total Amount */}
            <div className="text-right">
              <span className="block text-sm text-gray-300 font-semibold">
                Total
              </span>
              <span className="text-primary font-bold text-lg">
                ${flyerFormStore.subtotal}
              </span>
            </div>
          </div>
        </form>
      </div>
      {/* Similar Flyers */}
      <div className="space-y-4 p-4  rounded-2xl mt-10">
        <h3 className="text-xl font-bold text-white">Similar Flyers</h3>

        <div className="">
          <FlyersCarousel flyers={flyerFormStore.similarFlyers} />
        </div>
      </div>
    </div>
  );
};

export default observer(EventBookingForm);
