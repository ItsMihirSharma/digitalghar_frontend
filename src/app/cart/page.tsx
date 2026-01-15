"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingBag, ArrowRight, Tag, Shield, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart";

export default function CartPage() {
    const router = useRouter();
    const { items, removeFromCart, clearCart, total } = useCartStore();
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    const finalTotal = subtotal - discount;

    const handleApplyCoupon = () => {
        // Mock coupon validation
        if (couponCode.toUpperCase() === "SAVE10") {
            setAppliedCoupon({ code: couponCode, discount: subtotal * 0.1 });
        } else {
            alert("Invalid coupon code");
        }
    };

    const handleCheckout = () => {
        if (items.length > 0) {
            router.push("/checkout");
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center py-20">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                        <ShoppingBag className="h-12 w-12 text-steel" />
                    </div>
                    <h1 className="text-3xl font-bold text-midnight mb-3">Your Cart is Empty</h1>
                    <p className="text-lg text-steel mb-8">
                        Looks like you haven't added anything to your cart yet.
                    </p>
                    <Link href="/shop">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                            Browse Products
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Page Header */}
            <div className="bg-gradient-to-b from-muted to-white border-b border-pearl-gray">
                <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
                    <nav className="mb-6 text-sm text-steel">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-midnight font-medium">Shopping Cart</span>
                    </nav>
                    <h1 className="text-4xl lg:text-5xl font-bold text-midnight mb-2">
                        Shopping Cart
                    </h1>
                    <p className="text-lg text-steel">
                        {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items - Left Side (2/3) */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <Card key={item.id} className="overflow-hidden border-2 border-pearl-gray hover:border-primary/50 transition-all">
                                <CardContent className="p-6">
                                    <div className="flex gap-6">
                                        {/* Product Image */}
                                        <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-pearl-gray">
                                                    <ShoppingBag className="h-12 w-12 text-steel" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <Link
                                                        href={`/products/${item.slug}`}
                                                        className="font-bold text-lg text-midnight hover:text-primary transition-colors line-clamp-2"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                    {item.category && (
                                                        <Badge variant="secondary" className="mt-2">
                                                            {item.category.name}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-end justify-between mt-4">
                                                <div>
                                                    {item.originalPrice && item.originalPrice > item.price && (
                                                        <span className="text-sm text-steel line-through block">
                                                            ₹{item.originalPrice}
                                                        </span>
                                                    )}
                                                    <span className="text-2xl font-bold text-primary">
                                                        ₹{item.price}
                                                    </span>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-coral hover:text-coral/80 hover:bg-coral/10 gap-2"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Continue Shopping */}
                        <div className="pt-4">
                            <Link href="/shop">
                                <Button variant="outline" className="border-2 hover:bg-muted gap-2">
                                    ← Continue Shopping
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary - Right Side (1/3) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card className="bg-muted border-2 border-pearl-gray">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold text-midnight mb-6">Order Summary</h2>

                                    {/* Coupon Code */}
                                    <div className="mb-6">
                                        <label className="text-sm font-medium text-charcoal mb-2 block">
                                            Have a coupon code?
                                        </label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Enter code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                className="border-2 rounded-xl"
                                            />
                                            <Button
                                                variant="outline"
                                                onClick={handleApplyCoupon}
                                                className="border-2 hover:bg-primary hover:text-white hover:border-primary"
                                            >
                                                Apply
                                            </Button>
                                        </div>
                                        {appliedCoupon && (
                                            <div className="mt-2 flex items-center gap-2 text-sm text-mint">
                                                <Tag className="h-4 w-4" />
                                                Coupon "{appliedCoupon.code}" applied!
                                            </div>
                                        )}
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="space-y-3 mb-6 pb-6 border-b border-pearl-gray">
                                        <div className="flex justify-between text-charcoal">
                                            <span>Subtotal ({items.length} items)</span>
                                            <span className="font-semibold">₹{subtotal}</span>
                                        </div>
                                        {appliedCoupon && (
                                            <div className="flex justify-between text-mint">
                                                <span>Discount</span>
                                                <span className="font-semibold">-₹{discount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-charcoal">
                                            <span>Delivery</span>
                                            <span className="font-semibold text-mint">FREE</span>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-lg font-bold text-midnight">Total</span>
                                        <span className="text-3xl font-bold text-primary">
                                            ₹{finalTotal.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Checkout Button */}
                                    <Button
                                        size="lg"
                                        onClick={handleCheckout}
                                        className="w-full h-14 bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg hover:shadow-xl transition-all mb-4"
                                    >
                                        Proceed to Checkout
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>

                                    {/* Trust Badges */}
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-2 text-charcoal">
                                            <Shield className="h-4 w-4 text-mint" />
                                            <span>Secure payment</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-charcoal">
                                            <Download className="h-4 w-4 text-mint" />
                                            <span>Instant download</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-charcoal">
                                            <Tag className="h-4 w-4 text-mint" />
                                            <span>Money-back guarantee</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Methods */}
                            <Card className="mt-6 border-2 border-pearl-gray">
                                <CardContent className="p-4">
                                    <p className="text-xs text-steel text-center mb-2">We accept</p>
                                    <div className="flex justify-center items-center gap-3 flex-wrap">
                                        {['💳', '🏦', '📱', '💰'].map((icon, i) => (
                                            <div key={i} className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xl">
                                                {icon}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
