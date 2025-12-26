


'use client'

import React, { useState, useEffect } from 'react'
import Link from "next/link"
import { useSearchParams } from "next/navigation";
import { observer } from "mobx-react-lite"
import { toJS } from "mobx"

import { FlyersCarousel } from './FlyersCarousel'
import { useStore } from "@/stores/StoreProvider"

type FlyersSectionProps = {
    type: {
        id: string;
        name: string;
        slug: string;
        homePage: boolean;
    };
};

type Filter = {
    price: string[];
    category: string[];
    type: string[];
};

const FlyersSection: React.FC<FlyersSectionProps> = ({ type }) => {

    const { flyersStore, filterBarStore } = useStore();
    const searchParams = useSearchParams();

    const [Flyers, setFlyers] = useState([]);
    const [filter, setFilter] = useState<Filter>({
        price: [],
        category: [],
        type: []
    });

    // Fetch flyers from backend once
    useEffect(() => {
        if (!flyersStore.flyers.length && !flyersStore.loading) {
            flyersStore.fetchFlyers();
        }
    }, [flyersStore]);

    // Watch MobX store flyers and update UI
    useEffect(() => {
        let data = flyersStore.flyers;

        if (type.name === 'Recently Added') {
            data = flyersStore.recentlyAdded;
        }
        else if (type.name === 'Premium Flyers') {
            data = flyersStore.premiumFlyers;
        }
        else if (type.name === 'Basic Flyers') {
            data = flyersStore.basicFlyers;
        }
        else {
            data = flyersStore.flyersByCategory(type.name);
        }

        setFlyers(toJS(data));

    }, [flyersStore.flyers, type.name, searchParams]);

    // Update filter based on MobX store
    useEffect(() => {
        setFilter(prev => ({
            ...prev,
            price: toJS(filterBarStore.price)
        }));
    }, [filterBarStore.price]);

    if (!Flyers.length) {
        if (flyersStore.loading) {
            return (
                <section className="py-4 px-5">
                    <div className="flex flex-col gap-3">
                        <div className="h-6 w-40 rounded bg-gray-800/30 animate-pulse" />
                        <div className="h-48 w-full rounded-xl bg-gray-900/40 animate-pulse" />
                    </div>
                </section>
            )
        }
        return null
    }

    return (
        <>
            {type.name === 'Premium Flyers' ? (
                <section className="my-2 py-2 sm:py-4 px-5 bg-primary/90 shadow-2xl shadow-gray-900">
                    <div className='flex flex-col gap-1'>
                        <div className='text-sm md:text-xl font-bold'>
                            <Link href={`/categories?slug=${type.slug}`}>{type.name}</Link>
                        </div>

                        <div className='col-span-8'>
                            <FlyersCarousel flyers={Flyers} />
                        </div>
                    </div>
                </section>
            ) : (
                <section className="py-1 px-5">
                    <div className='flex flex-col gap-1'>
                        <div className='text-sm md:text-lg font-semibold text-foreground'>
                            <Link href={`/categories?slug=${type.slug}`}>{type.name}</Link>
                        </div>

                        <div className='col-span-8'>
                            <FlyersCarousel flyers={Flyers} />
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default observer(FlyersSection);

