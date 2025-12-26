import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlyerCard } from "@/components/flyer/flyer-card"
import { Star, Zap, Clock, Shield } from "lucide-react"
import Link from "next/link"
import Image from 'next/image'
import { useStore } from "@/stores/StoreProvider"
import { observer } from "mobx-react-lite"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

const FeaturedCategories = () => {
    const { categoryStore } = useStore()

    useEffect(() => {
        categoryStore.fetchCategories()
    }, [categoryStore])

    const categories = categoryStore.categories.length > 0
        ? categoryStore.categories
        : []

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Popular Categories</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Discover flyer templates for every type of event and occasion
                    </p>
                </div>

                <div className="px-12">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {categories.map((category) => (
                                <CarouselItem key={category.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                                    <Link className='flex flex-col gap-2 items-center group' href={`/catalog?category=${encodeURIComponent(category.name)}`}>
                                        <div className='relative w-full aspect-[3/4] border rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:border-primary/50'>
                                            <Image
                                                src={"/placeholder.svg"}
                                                alt={category.name}
                                                fill
                                                className="absolute object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                            <div className="absolute bottom-4 left-0 right-0 text-center px-2 transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-300">
                                                <Badge variant="secondary" className="backdrop-blur-sm bg-black/50 hover:bg-primary hover:text-white transition-colors border-white/20">
                                                    {category.rank ? `#${category.rank}` : null} Explore
                                                </Badge>
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mt-2">{category.name}</h3>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-12 border-primary/20 hover:border-primary hover:bg-primary/10" />
                        <CarouselNext className="hidden md:flex -right-12 border-primary/20 hover:border-primary hover:bg-primary/10" />
                    </Carousel>
                </div>
            </div>
        </section>
    )
}

export default observer(FeaturedCategories)