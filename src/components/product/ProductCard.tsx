"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart";
import { Product } from "@/types";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { addToCart, items } = useCartStore();
    const isInCart = items.some((item) => item.id === product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    return (
        <Link href={`/products/${product.slug}`}>
            <Card
                className="group h-full overflow-hidden border-2 border-transparent hover:border-primary hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-white"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-pearl-gray">
                            <span className="text-6xl opacity-20">📄</span>
                        </div>
                    )}

                    {/* Discount Badge */}
                    {product.discountPercent && product.discountPercent > 0 && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-coral to-warm-coral text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                            -{product.discountPercent}%
                        </div>
                    )}

                    {/* Quick View Overlay */}
                    <div
                        className={`absolute inset-0 bg-midnight/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2 bg-white text-midnight hover:bg-white/90 shadow-xl"
                        >
                            <Eye className="h-4 w-4" />
                            Quick View
                        </Button>
                    </div>
                </div>

                <CardContent className="p-4">
                    {/* Category Badge */}
                    {product.category && (
                        <div className="mb-2">
                            <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                                {product.category.name}
                            </span>
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="font-bold text-base text-midnight line-clamp-2 mb-2 min-h-[3rem] group-hover:text-primary transition-colors">
                        {product.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-steel line-clamp-2 mb-3">
                        {product.shortDescription}
                    </p>

                    {/* Rating */}
                    {product.ratingAvg > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-3.5 w-3.5 ${i < Math.round(product.ratingAvg)
                                            ? "fill-yellow text-yellow"
                                            : "fill-pearl-gray text-pearl-gray"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-steel">
                                ({product.ratingCount || 0})
                            </span>
                        </div>
                    )}

                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-3 border-t border-pearl-gray">
                        <div className="flex items-center gap-2">
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-steel line-through">
                                    ₹{product.originalPrice}
                                </span>
                            )}
                            <span className="text-2xl font-bold text-primary">
                                ₹{product.price}
                            </span>
                        </div>

                        <Button
                            size="sm"
                            onClick={handleAddToCart}
                            className={`gap-2 transition-all duration-200 ${isInCart
                                ? "bg-mint hover:bg-mint/90"
                                : "bg-primary hover:bg-primary/90"
                                } text-white shadow-soft hover:shadow-md hover:scale-105`}
                        >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            {isInCart ? "Added" : "Add"}
                        </Button>
                    </div>

                    {/* License Type Badge */}
                    {product.licenseType && product.licenseType !== "PERSONAL" && (
                        <div className="mt-3 pt-3 border-t border-pearl-gray">
                            <span className="inline-block text-xs font-semibold text-purple bg-purple/10 px-2 py-1 rounded">
                                {product.licenseType} License
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
