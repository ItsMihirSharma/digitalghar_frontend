"use client";

import { Suspense } from "react";
import ShopContent from "./ShopContent";

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white">
                <div className="bg-gradient-to-b from-muted to-white border-b border-pearl-gray">
                    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
                        <h1 className="text-4xl lg:text-5xl font-bold text-midnight mb-3">
                            Shop All Products
                        </h1>
                        <p className="text-lg text-steel">
                            Loading products...
                        </p>
                    </div>
                </div>
                <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="skeleton h-96 rounded-2xl bg-muted animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}
