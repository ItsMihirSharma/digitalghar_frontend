import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ShoppingCart, Download, Shield, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

// Mock product data - replace with API call
const getProduct = async (slug: string): Promise<Product | null> => {
    const products: Record<string, Product> = {
        "kids-coloring-book-animals": {
            id: "1",
            title: "Kids Coloring Book - Animals",
            slug: "kids-coloring-book-animals",
            shortDescription: "50+ adorable animal coloring pages for kids aged 3-10",
            longDescription: `
        <h3>About This Product</h3>
        <p>This beautifully illustrated coloring book features over 50 adorable animal pages perfect for keeping kids entertained while developing their creativity and motor skills.</p>
        
        <h3>What's Included</h3>
        <ul>
          <li>50+ unique animal designs</li>
          <li>Mix of simple and detailed pages</li>
          <li>High-quality PDF format</li>
          <li>A4 size, ready to print</li>
          <li>Instant download after purchase</li>
        </ul>
        
        <h3>Perfect For</h3>
        <ul>
          <li>Kids aged 3-10 years</li>
          <li>Homeschooling activities</li>
          <li>Rainy day entertainment</li>
          <li>Birthday party activities</li>
        </ul>
      `,
            price: 149,
            originalPrice: 299,
            productType: "PDF",
            ageGroup: "3-10 years",
            imageUrl: "https://placehold.co/600x400/E8E8E8/171717?text=Coloring+Book",
            galleryImages: [
                "https://placehold.co/600x400/E8E8E8/171717?text=Page+1",
                "https://placehold.co/600x400/E8E8E8/171717?text=Page+2",
                "https://placehold.co/600x400/E8E8E8/171717?text=Page+3",
            ],
            isFeatured: true,
            ratingAvg: 4.8,
            ratingCount: 125,
            tags: ["coloring", "kids", "animals", "printable"],
            licenseType: "PERSONAL",
            category: { id: "1", name: "Kids Activities", slug: "kids-activities" },
        },
    };

    return products[slug] || null;
};

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    const discount = product.originalPrice
        ? Math.round(
            ((Number(product.originalPrice) - Number(product.price)) /
                Number(product.originalPrice)) *
            100
        )
        : null;

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-blue-600">Home</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/shop" className="hover:text-blue-600">Shop</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href={`/shop?category=${product.category.slug}`} className="hover:text-blue-600">
                        {product.category.name}
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-gray-900">{product.title}</span>
                </nav>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Images */}
                    <div className="space-y-4">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
                            <Image
                                src={product.imageUrl}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            {discount && (
                                <Badge className="absolute left-4 top-4 bg-red-500">
                                    {discount}% OFF
                                </Badge>
                            )}
                        </div>
                        {product.galleryImages && product.galleryImages.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.galleryImages.map((img, i) => (
                                    <div
                                        key={i}
                                        className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.title} preview ${i + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <Badge variant="secondary" className="mb-2">
                            {product.category.name}
                        </Badge>
                        <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

                        {/* Rating */}
                        {product.ratingCount > 0 && (
                            <div className="mt-3 flex items-center gap-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.round(Number(product.ratingAvg))
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="font-medium">{Number(product.ratingAvg).toFixed(1)}</span>
                                <span className="text-gray-500">({product.ratingCount} reviews)</span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="mt-4 flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-gray-900">
                                {formatPrice(Number(product.price))}
                            </span>
                            {product.originalPrice && (
                                <>
                                    <span className="text-xl text-gray-400 line-through">
                                        {formatPrice(Number(product.originalPrice))}
                                    </span>
                                    <Badge variant="success" className="bg-green-100 text-green-700">
                                        Save {formatPrice(Number(product.originalPrice) - Number(product.price))}
                                    </Badge>
                                </>
                            )}
                        </div>

                        {/* Short Description */}
                        <p className="mt-4 text-gray-600">{product.shortDescription}</p>

                        {/* Meta Info */}
                        <div className="mt-6 flex flex-wrap gap-4">
                            {product.ageGroup && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="font-medium">Age:</span> {product.ageGroup}
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium">Type:</span> {product.productType}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium">License:</span> {product.licenseType}
                            </div>
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {product.tags.map((tag) => (
                                    <Badge key={tag} variant="outline">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button size="lg" className="flex-1 gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Add to Cart
                            </Button>
                            <Link href="/checkout" className="flex-1">
                                <Button size="lg" variant="outline" className="w-full">
                                    Buy Now
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-200 pt-6">
                            <div className="text-center">
                                <Download className="mx-auto h-6 w-6 text-blue-600" />
                                <p className="mt-1 text-xs text-gray-600">Instant Download</p>
                            </div>
                            <div className="text-center">
                                <Shield className="mx-auto h-6 w-6 text-green-600" />
                                <p className="mt-1 text-xs text-gray-600">Secure Payment</p>
                            </div>
                            <div className="text-center">
                                <Clock className="mx-auto h-6 w-6 text-purple-600" />
                                <p className="mt-1 text-xs text-gray-600">24/7 Access</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Tabs */}
                <div className="mt-12">
                    <Card>
                        <CardContent className="prose max-w-none p-6">
                            <h2 className="text-xl font-bold">Product Description</h2>
                            <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
