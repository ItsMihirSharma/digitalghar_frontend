"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Download, Mail, ArrowRight, Package, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OrderSuccessPage() {
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        // Hide confetti after animation
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    // Mock order data - in production, fetch from API
    const orderData = {
        orderId: `DGH-${Date.now()}`,
        email: "user@example.com",
        total: 597,
        items: [
            {
                id: "1",
                title: "Kids Learning Activity Pack - 100+ Worksheets",
                downloadUrl: "#",
                expiryDate: "Jan 21, 2026",
            },
            {
                id: "2",
                title: "Premium Coloring Pages Bundle",
                downloadUrl: "#",
                expiryDate: "Jan 21, 2026",
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-muted to-white relative overflow-hidden">
            {/* Confetti Effect */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-20px`,
                                background: ["#4F46E5", "#FF6B6B", "#51CF66", "#FFD93D"][Math.floor(Math.random() * 4)],
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${3 + Math.random() * 2}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="mx-auto max-w-4xl px-4 py-20">
                {/* Success Animation */}
                <div className="text-center mb-12 animate-fade-up">
                    <div className="relative inline-block mb-6">
                        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-mint to-mint/80 flex items-center justify-center animate-pulse">
                            <CheckCircle2 className="h-20 w-20 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-mint animate-ping opacity-20" />
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold text-midnight mb-4">
                        Order Placed Successfully! 🎉
                    </h1>
                    <p className="text-xl text-steel max-w-2xl mx-auto">
                        Thank you for your purchase! Your digital products are ready to download.
                    </p>
                </div>

                {/* Order Details Card */}
                <Card className="mb-8 border-2 border-pearl-gray shadow-elevated">
                    <CardContent className="p-8">
                        <div className="grid md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-pearl-gray">
                            <div className="text-center md:text-left">
                                <p className="text-sm text-steel mb-1">Order Number</p>
                                <p className="font-mono font-bold text-primary text-lg">{orderData.orderId}</p>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-sm text-steel mb-1">Email Sent To</p>
                                <p className="font-semibold text-midnight truncate">{orderData.email}</p>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-sm text-steel mb-1">Total Paid</p>
                                <p className="text-2xl font-bold text-midnight">₹{orderData.total}</p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-midnight mb-6 flex items-center gap-2">
                            <Download className="h-6 w-6 text-primary" />
                            Your Downloads
                        </h2>

                        <div className="space-y-4">
                            {orderData.items.map((item, index) => (
                                <Card key={item.id} className="bg-muted border-2 border-dashed border-mint/50">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className="w-10 h-10 rounded-lg bg-mint/20 flex items-center justify-center flex-shrink-0">
                                                        <Package className="h-5 w-5 text-mint" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-midnight mb-1">
                                                            {item.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-sm text-steel">
                                                            <Clock className="h-4 w-4" />
                                                            <span>Valid until: {item.expiryDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="lg"
                                                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 gap-2 shadow-md"
                                                >
                                                    <Download className="h-5 w-5" />
                                                    Download Now
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Link href="/dashboard" className="flex-1">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full border-2 hover:bg-muted"
                        >
                            View Order Details
                        </Button>
                    </Link>
                    <Link href="/shop" className="flex-1">
                        <Button
                            size="lg"
                            className="w-full bg-primary hover:bg-primary/90 gap-2"
                        >
                            Continue Shopping
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>

                {/* Help Section */}
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50/30 border-2 border-pearl-gray">
                    <CardContent className="p-8 text-center">
                        <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-midnight mb-2">
                            Check Your Email
                        </h3>
                        <p className="text-steel mb-6 max-w-xl mx-auto">
                            We've sent download links and order details to <strong>{orderData.email}</strong>.
                            Save this page for future reference.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <Badge variant="secondary" className="gap-2">
                                💡 Bookmark this page
                            </Badge>
                            <Badge variant="secondary" className="gap-2">
                                📧 Check spam folder
                            </Badge>
                            <Badge variant="secondary" className="gap-2">
                                💬 Need help? Contact us
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
