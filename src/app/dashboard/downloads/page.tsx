"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { OrderItem } from "@/types";

// Mock data - replace with API call
const mockDownloads: (OrderItem & { orderNumber: string; expiresAt: string })[] = [
    {
        id: "1",
        productTitle: "Kids Coloring Book - Animals",
        productPrice: 149,
        downloadLimit: 5,
        downloadCount: 2,
        downloadUrl: "#",
        orderNumber: "ORD-202601-ABC123",
        expiresAt: "2026-01-17T10:30:00Z",
        product: {
            title: "Kids Coloring Book - Animals",
            imageUrl: "https://placehold.co/100x100/E8E8E8/171717?text=CB",
            slug: "kids-coloring-book-animals",
        },
    },
    {
        id: "2",
        productTitle: "Math Worksheets - Grade 1-3",
        productPrice: 199,
        downloadLimit: 5,
        downloadCount: 0,
        downloadUrl: "#",
        orderNumber: "ORD-202601-ABC123",
        expiresAt: "2026-01-17T10:30:00Z",
        product: {
            title: "Math Worksheets",
            imageUrl: "https://placehold.co/100x100/E8E8E8/171717?text=MW",
            slug: "math-worksheets",
        },
    },
];

export default function DownloadsPage() {
    const [downloads, setDownloads] = useState<typeof mockDownloads>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDownloads(mockDownloads);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const handleDownload = async (id: string) => {
        // In real app: call API to get signed download URL
        alert(`Downloading file for item ${id}`);
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-900">My Downloads</h1>
                {[...Array(2)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <Skeleton className="h-24 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (downloads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-16 w-16 text-gray-300" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">No downloads available</h2>
                <p className="mt-2 text-gray-600">
                    Complete a purchase to access your downloads
                </p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">My Downloads</h1>
            <p className="mb-6 text-sm text-gray-500">
                <AlertCircle className="mr-1 inline h-4 w-4" />
                Download links expire 7 days after purchase. Downloads are limited to 5 per product.
            </p>

            <div className="space-y-4">
                {downloads.map((item) => (
                    <Card key={item.id}>
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                    <Image
                                        src={item.product.imageUrl}
                                        alt={item.productTitle}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{item.productTitle}</h3>
                                    <p className="text-sm text-gray-500">Order: {item.orderNumber}</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <Badge variant="outline">
                                            {item.downloadLimit - item.downloadCount} downloads remaining
                                        </Badge>
                                        <Badge variant="outline" className="text-amber-600">
                                            Expires: {formatDate(item.expiresAt)}
                                        </Badge>
                                    </div>
                                </div>
                                <Button
                                    className="gap-2"
                                    onClick={() => handleDownload(item.id)}
                                    disabled={item.downloadCount >= item.downloadLimit}
                                >
                                    <Download className="h-4 w-4" />
                                    Download
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
