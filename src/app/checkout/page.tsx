"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Smartphone, Building2, Wallet, Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";

type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, total, clearCart } = useCartStore();
    const { user } = useAuthStore();

    const [formData, setFormData] = useState({
        email: user?.email || "",
        name: user?.name || "",
        phone: "",
    });
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = items.reduce((sum, item) => sum + item.price, 0);

    if (items.length === 0) {
        router.push("/cart");
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckout = async () => {
        // Validate form
        if (!formData.email || !formData.name) {
            alert("Please fill all required fields");
            return;
        }

        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            // Mock success - in production, this would call your payment gateway
            clearCart();
            router.push("/order-success");
        }, 2000);
    };

    const paymentMethods = [
        {
            id: "upi",
            name: "UPI",
            description: "Pay with any UPI app",
            icon: Smartphone,
            popular: true,
        },
        {
            id: "card",
            name: "Card",
            description: "Credit or Debit Card",
            icon: CreditCard,
        },
        {
            id: "netbanking",
            name: "Net Banking",
            description: "All major banks",
            icon: Building2,
        },
        {
            id: "wallet",
            name: "Wallet",
            description: "Paytm, PhonePe, etc.",
            icon: Wallet,
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Progress Indicator */}
            <div className="bg-muted border-b border-pearl-gray">
                <div className="mx-auto max-w-4xl px-4 py-6">
                    <div className="flex items-center justify-center gap-4">
                        {["Cart", "Payment", "Confirmation"].map((step, index) => (
                            <div key={step} className="flex items-center">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${index === 0
                                        ? "bg-primary text-white"
                                        : index === 1
                                            ? "bg-primary text-white"
                                            : "bg-pearl-gray text-steel"
                                        }`}>
                                        {index === 0 ? <Check className="h-4 w-4" /> : index + 1}
                                    </div>
                                    <span className={`text-sm font-medium hidden sm:block ${index <= 1 ? "text-midnight" : "text-steel"
                                        }`}>
                                        {step}
                                    </span>
                                </div>
                                {index < 2 && (
                                    <div className={`w-12 sm:w-20 h-0.5 mx-2 ${index < 1 ? "bg-primary" : "bg-pearl-gray"
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Form - Left Side (2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Contact Information */}
                        <Card className="border-2 border-pearl-gray">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold text-midnight mb-1">Contact Information</h2>
                                <p className="text-sm text-steel mb-6">
                                    No account needed. We'll email your downloads.
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="email" className="text-charcoal font-medium">
                                            Email Address *
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="mt-2 h-12 border-2 rounded-xl"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="name" className="text-charcoal font-medium">
                                            Full Name *
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="mt-2 h-12 border-2 rounded-xl"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="phone" className="text-charcoal font-medium">
                                            Phone Number (Optional)
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="mt-2 h-12 border-2 rounded-xl"
                                            placeholder="+91 9876543210"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card className="border-2 border-pearl-gray">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold text-midnight mb-6">Payment Method</h2>

                                <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={(value: string) => setPaymentMethod(value as PaymentMethod)}
                                    className="space-y-3"
                                >
                                    {paymentMethods.map((method) => {
                                        const Icon = method.icon;
                                        return (
                                            <label
                                                key={method.id}
                                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-pearl-gray hover:border-steel"
                                                    }`}
                                            >
                                                <RadioGroupItem value={method.id} id={method.id} />
                                                <Icon className={`h-5 w-5 ${paymentMethod === method.id ? "text-primary" : "text-steel"
                                                    }`} />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-midnight">{method.name}</span>
                                                        {method.popular && (
                                                            <span className="text-xs bg-mint text-white px-2 py-0.5 rounded-full">
                                                                Popular
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-steel">{method.description}</span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </RadioGroup>

                                {/* UPI Details */}
                                {paymentMethod === "upi" && (
                                    <div className="mt-6 p-4 bg-muted rounded-xl">
                                        <div className="flex justify-center gap-4 mb-3">
                                            {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                                                <div key={app} className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-xs font-semibold text-charcoal shadow-sm">
                                                    {app}
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-sm text-steel text-center">
                                            You'll be redirected to complete payment
                                        </p>
                                    </div>
                                )}

                                {/* Card Details */}
                                {paymentMethod === "card" && (
                                    <div className="mt-6 space-y-4">
                                        <div>
                                            <Label className="text-charcoal font-medium">Card Number</Label>
                                            <Input
                                                className="mt-2 h-12 border-2 rounded-xl"
                                                placeholder="1234 5678 9012 3456"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-charcoal font-medium">Expiry</Label>
                                                <Input
                                                    className="mt-2 h-12 border-2 rounded-xl"
                                                    placeholder="MM/YY"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-charcoal font-medium">CVV</Label>
                                                <Input
                                                    className="mt-2 h-12 border-2 rounded-xl"
                                                    placeholder="123"
                                                    type="password"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Complete Purchase Button */}
                        <Button
                            size="lg"
                            onClick={handleCheckout}
                            disabled={isProcessing}
                            className="w-full h-14 bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg hover:shadow-xl transition-all"
                        >
                            <Lock className="h-5 w-5" />
                            {isProcessing ? "Processing..." : `Pay ₹${subtotal}`}
                        </Button>

                        <p className="text-sm text-steel text-center">
                            🔒 Secure payment powered by Razorpay • 256-bit SSL encryption
                        </p>
                    </div>

                    {/* Order Summary - Right Side (1/3) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card className="bg-muted border-2 border-pearl-gray">
                                <CardContent className="p-6">
                                    <h2 className="text-lg font-bold text-midnight mb-4">Order Summary</h2>

                                    {/* Products */}
                                    <div className="space-y-3 mb-6 pb-6 border-b border-pearl-gray">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-3">
                                                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                                                    {item.imageUrl ? (
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-pearl-gray" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-midnight line-clamp-2">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-sm font-bold text-primary mt-1">
                                                        ₹{item.price}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-charcoal">
                                            <span>Subtotal</span>
                                            <span className="font-semibold">₹{subtotal}</span>
                                        </div>
                                        <div className="flex justify-between text-charcoal">
                                            <span>Tax</span>
                                            <span className="font-semibold">₹0</span>
                                        </div>
                                        <div className="pt-3 border-t border-pearl-gray flex justify-between">
                                            <span className="font-bold text-midnight">Total</span>
                                            <span className="text-2xl font-bold text-primary">
                                                ₹{subtotal}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Edit Cart Link */}
                            <div className="mt-4 text-center">
                                <Link href="/cart" className="text-sm text-primary hover:text-primary/80 font-medium">
                                    ← Edit Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
