'use client'
import React, { useState, useEffect } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FLYER_CATEGORIES, SAMPLE_FLYERS } from "@/lib/types"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { toJS, reaction } from 'mobx'
import { FlyerCard } from '../flyer/flyer-card'


type FlyersCategorysectionProps = {
    categories: {
        id: string;
        name: string;
        slug: string;
        homePage: boolean;
    };
}


type Flyer = {
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
};


const FlyersCategorysection = () => {

    const { authStore, filterBarStore, categoryStore } = useStore()

    const flyers = categoryStore.flyers

    // useeffect 
    useEffect(() => {
        const disposer = reaction(
            () => toJS(filterBarStore.price),  // observe this value
            (price) => {
                
                categoryStore.setFlyerByFilter(price); // or any function you want to run
            }
        );

        return () => disposer(); // cleanup on unmount
    }, [filterBarStore, categoryStore]);



    return (
        <div className='p-4 flex flex-col gap-2'>
            {/* heading  */}
            <div className='text-sm md:text-lg font-semibold text-foreground'>
                <h3>{categoryStore.category}</h3>
            </div>

            {/* flyers  */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {flyers.map(flyer => { return <FlyerCard flyer={flyer} /> })}
            </div>
        </div>
    )
}

export default observer(FlyersCategorysection)