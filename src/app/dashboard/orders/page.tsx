"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

// Mock data - replace with API call
const mockOrders: Order[] = [
    {
        id: "1",
        orderNumber: "ORD-202601-ABC123",
        totalAmount: 348,
        paymentStatus: "VERIFIED",
        orderStatus: "COMPLETED",
        items: [
            {
                id: "1",
                productTitle: "Kids Coloring Book - Animals",
                productPrice: 149,
                downloadLimit: 5,
                downloadCount: 2,
                product: {
                    title: "Kids Coloring Book - Animals",
                    imageUrl: "https://placehold.co/100x100/E8E8E8/171717?text=CB",
                    slug: "kids-coloring-book-animals",
                },
            },
            {
                id: "2",
                productTitle: "Math Worksheets",
                productPrice: 199,
                downloadLimit: 5,
                downloadCount: 0,
                product: {
                    title: "Math Worksheets",
                    imageUrl: "https://placehold.co/100x100/E8E8E8/171717?text=MW",
                    slug: "math-worksheets",
                },
            },
        ],
        createdAt: "2026-01-10T10:30:00Z",
        paidAt: "2026-01-10T10:35:00Z",
    },
    {
        id: "2",
        orderNumber: "ORD-202601-DEF456",
        totalAmount: 499,
        paymentStatus: "SUBMITTED",
        orderStatus: "PENDING",
        utrNumber: "123456789012",
        items: [
            {
                id: "3",
                productTitle: "Digital Planner 2026 - PLR",
                productPrice: 499,
                downloadLimit: 5,
                downloadCount: 0,
                product: {
                    title: "Digital Planner 2026 - PLR",
                    imageUrl: "https://placehold.co/100x100/E8E8E8/171717?text=DP",
                    slug: "digital-planner-2026-plr",
                },
            },
        ],
        createdAt: "2026-01-12T14:20:00Z",
    },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case "VERIFIED":
            return <Badge className="bg-green-100 text-green-700"><CheckCircle className="mr-1 h-3 w-3" /> Verified</Badge>;
        case "SUBMITTED":
            return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="mr-1 h-3 w-3" /> Pending Verification</Badge>;
        case "PENDING":
            return <Badge className="bg-gray-100 text-gray-700"><AlertCircle className="mr-1 h-3 w-3" /> Awaiting Payment</Badge>;
        case "FAILED":
            return <Badge className="bg-red-100 text-red-700"><XCircle className="mr-1 h-3 w-3" /> Failed</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        const timer = setTimeout(() => {
            setOrders(mockOrders);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <Skeleton className="mb-4 h-6 w-48" />
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <Package className="h-16 w-16 text-gray-300" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">No orders yet</h2>
                <p className="mt-2 text-gray-600">Start shopping to see your orders here</p>
                <Link href="/shop">
                    <Button className="mt-4">Browse Products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">My Orders</h1>
            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.id}>
                        <CardHeader className="pb-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <CardTitle className="text-base">
                                        Order #{order.orderNumber}
                                    </CardTitle>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(order.createdAt)}
                                    </p>
                                </div>
                                {getStatusBadge(order.paymentStatus)}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                            <Image
                                                src={item.product.imageUrl}
                                                alt={item.productTitle}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Link
                                                href={`/product/${item.product.slug}`}
                                                className="font-medium text-gray-900 hover:text-blue-600"
                                            >
                                                {item.productTitle}
                                            </Link>
                                            <p className="text-sm text-gray-500">
                                                {formatPrice(Number(item.productPrice))}
                                            </p>
                                        </div>
                                        {order.paymentStatus === "VERIFIED" && (
                                            <Link href={`/dashboard/downloads`}>
                                                <Button size="sm" variant="outline">
                                                    Download
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t pt-4">
                                <div>
                                    <span className="text-sm text-gray-500">Total: </span>
                                    <span className="font-semibold">{formatPrice(Number(order.totalAmount))}</span>
                                </div>
                                <Link href={`/dashboard/orders/${order.id}`}>
                                    <Button variant="ghost" size="sm" className="gap-1">
                                        View Details
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
