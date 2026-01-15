"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ShoppingCart, Heart, Share2, Download, Shield, Star,
    Clock, FileText, Award, Check, ChevronLeft, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/product/ProductCard";
import { useCartStore } from "@/store/cart";
import api from "@/lib/api";
import type { Product } from "@/types";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    const { addToCart, items } = useCartStore();
    const isInCart = product ? items.some((item) => item.id === product.id) : false;

    useEffect(() => {
        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    const fetchProduct = async () => {
        try {
            const { data } = await api.get(`/products/${slug}`);
            setProduct(data.product);

            // Fetch related products
            if (data.product.categoryId) {
                const relatedRes = await api.get("/products", {
                    params: { category: data.product.category?.slug, limit: 4 }
                });
                setRelatedProducts(
                    relatedRes.data.products.filter((p: Product) => p.id !== data.product.id)
                );
            }
        } catch (error) {
            console.error("Failed to fetch product:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
        }
    };

    const handleBuyNow = () => {
        if (product) {
            addToCart(product);
            router.push("/cart");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white py-12">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="animate-pulse">
                        <div className="skeleton h-8 w-48 mb-8" />
                        <div className="grid lg:grid-cols-2 gap-12">
                            <div className="skeleton h-96 rounded-2xl" />
                            <div className="space-y-4">
                                <div className="skeleton h-12 w-full" />
                                <div className="skeleton h-6 w-32" />
                                <div className="skeleton h-32 w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-midnight mb-4">Product Not Found</h1>
                    <Link href="/shop">
                        <Button className="bg-primary hover:bg-primary/90">
                            Browse Products
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const images = product.galleryImages
        ? (typeof product.galleryImages === 'string' ? JSON.parse(product.galleryImages) : product.galleryImages)
        : [product.imageUrl];

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="bg-muted border-b border-pearl-gray">
                <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
                    <nav className="flex items-center gap-2 text-sm text-steel">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                        <span>/</span>
                        {product.category && (
                            <>
                                <Link
                                    href={`/shop?category=${product.category.slug}`}
                                    className="hover:text-primary transition-colors"
                                >
                                    {product.category.name}
                                </Link>
                                <span>/</span>
                            </>
                        )}
                        <span className="text-midnight font-medium line-clamp-1">{product.title}</span>
                    </nav>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    className="mb-6 -ml-4 gap-2 hover:text-primary"
                    onClick={() => router.back()}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                </Button>

                {/* Product Hero Section */}
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Left: Images */}
                    <div>
                        {/* Main Image */}
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted border-2 border-pearl-gray mb-4 group">
                            {images[selectedImage] ? (
                                <img
                                    src={images[selectedImage]}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-pearl-gray">
                                    <FileText className="h-24 w-24 text-steel" />
                                </div>
                            )}

                            {/* Discount Badge */}
                            {product.discountPercent && product.discountPercent > 0 && (
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-coral to-warm-coral text-white px-4 py-2 rounded-full font-bold shadow-lg">
                                    {product.discountPercent}% OFF
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {images.slice(0, 4).map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx
                                            ? "border-primary shadow-md scale-105"
                                            : "border-pearl-gray hover:border-steel"
                                            }`}
                                    >
                                        {img ? (
                                            <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <FileText className="h-8 w-8 text-steel" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div>
                        {/* Category Badge */}
                        {product.category && (
                            <Link href={`/shop?category=${product.category.slug}`}>
                                <Badge
                                    variant="secondary"
                                    className="mb-4 text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                                >
                                    {product.category.icon} {product.category.name}
                                </Badge>
                            </Link>
                        )}

                        {/* Title */}
                        <h1 className="text-4xl lg:text-5xl font-bold text-midnight mb-4 leading-tight">
                            {product.title}
                        </h1>

                        {/* Rating */}
                        {product.ratingAvg > 0 && (
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.round(product.ratingAvg)
                                                ? "fill-yellow text-yellow"
                                                : "fill-pearl-gray text-pearl-gray"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-midnight font-semibold">{product.ratingAvg.toFixed(1)}</span>
                                <span className="text-steel">({product.ratingCount} reviews)</span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-4 mb-6">
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-2xl text-steel line-through">
                                    ₹{product.originalPrice}
                                </span>
                            )}
                            <span className="text-5xl font-bold text-primary">
                                ₹{product.price}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <Badge className="bg-mint text-white">
                                    Save ₹{product.originalPrice - product.price}
                                </Badge>
                            )}
                        </div>

                        {/* Short Description */}
                        <p className="text-lg text-steel leading-relaxed mb-8">
                            {product.shortDescription}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex gap-4 mb-8">
                            <Button
                                size="lg"
                                onClick={handleAddToCart}
                                className={`flex-1 h-14 text-base gap-2 ${isInCart
                                    ? "bg-mint hover:bg-mint/90"
                                    : "bg-primary hover:bg-primary/90"
                                    } text-white shadow-lg hover:shadow-xl transition-all`}
                                disabled={isInCart}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {isInCart ? "Added to Cart" : "Add to Cart"}
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={handleBuyNow}
                                className="flex-1 h-14 text-base border-2 hover:bg-primary hover:text-white hover:border-primary transition-all"
                            >
                                Buy Now
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 p-6 bg-muted rounded-2xl mb-8">
                            {[
                                { icon: Download, text: "Instant Download" },
                                { icon: Shield, text: "Secure Payment" },
                                { icon: Award, text: "Quality Guaranteed" }
                            ].map((badge, i) => (
                                <div key={i} className="text-center">
                                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-mint/20 flex items-center justify-center">
                                        <badge.icon className="h-5 w-5 text-mint" />
                                    </div>
                                    <p className="text-xs font-medium text-charcoal">{badge.text}</p>
                                </div>
                            ))}
                        </div>

                        {/* Product Meta */}
                        <div className="space-y-3 text-sm">
                            {product.productType && (
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-steel" />
                                    <span className="text-steel">Format:</span>
                                    <span className="font-semibold text-midnight">{product.productType}</span>
                                </div>
                            )}
                            {product.licenseType && (
                                <div className="flex items-center gap-2">
                                    <Award className="h-4 w-4 text-steel" />
                                    <span className="text-steel">License:</span>
                                    <Badge variant="secondary" className="bg-purple/10 text-purple">
                                        {product.licenseType}
                                    </Badge>
                                </div>
                            )}
                            {product.downloadCount && product.downloadCount > 0 && (
                                <div className="flex items-center gap-2">
                                    <Download className="h-4 w-4 text-steel" />
                                    <span className="text-steel">Downloads:</span>
                                    <span className="font-semibold text-midnight">{product.downloadCount}+</span>
                                </div>
                            )}
                        </div>

                        {/* Share */}
                        <div className="mt-8 pt-8 border-t border-pearl-gray">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-charcoal">Share:</span>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="rounded-full">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <Tabs defaultValue="description" className="mb-16">
                    <TabsList className="w-full justify-start border-b border-pearl-gray bg-transparent p-0 h-auto">
                        <TabsTrigger
                            value="description"
                            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-4"
                        >
                            Description
                        </TabsTrigger>
                        <TabsTrigger
                            value="details"
                            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-4"
                        >
                            Details
                        </TabsTrigger>
                        <TabsTrigger
                            value="reviews"
                            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-4"
                        >
                            Reviews ({product.ratingCount || 0})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-8">
                        <div className="prose max-w-none">
                            <p className="text-lg text-charcoal leading-relaxed whitespace-pre-wrap">
                                {product.longDescription || product.shortDescription}
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="details" className="mt-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="border-2 border-pearl-gray">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-lg text-midnight mb-4">Product Information</h3>
                                    <dl className="space-y-3">
                                        <div className="flex justify-between">
                                            <dt className="text-steel">Format:</dt>
                                            <dd className="font-semibold text-midnight">{product.productType}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-steel">License:</dt>
                                            <dd className="font-semibold text-midnight">{product.licenseType}</dd>
                                        </div>
                                        {product.fileSize && (
                                            <div className="flex justify-between">
                                                <dt className="text-steel">File Size:</dt>
                                                <dd className="font-semibold text-midnight">
                                                    {(Number(product.fileSize) / 1024 / 1024).toFixed(2)} MB
                                                </dd>
                                            </div>
                                        )}
                                        {product.ageGroup && (
                                            <div className="flex justify-between">
                                                <dt className="text-steel">Age Group:</dt>
                                                <dd className="font-semibold text-midnight">{product.ageGroup}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-pearl-gray">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-lg text-midnight mb-4">What's Included</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-mint mt-0.5" />
                                            <span className="text-charcoal">Instant download after purchase</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-mint mt-0.5" />
                                            <span className="text-charcoal">Lifetime access to your downloads</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-mint mt-0.5" />
                                            <span className="text-charcoal">Free updates when available</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-mint mt-0.5" />
                                            <span className="text-charcoal">Customer support via email</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-8">
                        <div className="text-center py-12">
                            <Star className="h-12 w-12 text-steel mx-auto mb-4" />
                            <p className="text-steel">No reviews yet. Be the first to review this product!</p>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bold text-midnight mb-8">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
