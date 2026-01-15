"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { formatPrice } from "@/lib/utils";

interface Product {
    id: string;
    title: string;
    slug: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    isActive: boolean;
    isFeatured: boolean;
    createdAt: string;
    category?: { name: string };
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get("/admin/products");
            setProducts(data.products || []);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            // Use mock data as fallback
            setProducts([
                { id: "1", title: "Kids Coloring Book - Animals", slug: "kids-coloring-book-animals", category: { name: "Kids Activities" }, price: 149, originalPrice: 299, isActive: true, isFeatured: true, createdAt: "2026-01-10", imageUrl: "https://placehold.co/100x100/E8E8E8/171717?text=CB" },
                { id: "2", title: "Math Worksheets - Grade 1-3", slug: "math-worksheets-grade-1-3", category: { name: "Educational PDFs" }, price: 199, originalPrice: 399, isActive: true, isFeatured: true, createdAt: "2026-01-08", imageUrl: "https://placehold.co/100x100/E8E8E8/171717?text=MW" },
                { id: "3", title: "Digital Planner 2026 - PLR", slug: "digital-planner-2026-plr", category: { name: "PLR Products" }, price: 499, originalPrice: 999, isActive: true, isFeatured: true, createdAt: "2026-01-05", imageUrl: "https://placehold.co/100x100/E8E8E8/171717?text=DP" },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        setDeleteId(id);
        try {
            await api.delete(`/admin/products/${id}`);
            setProducts(products.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Failed to delete product:", error);
            alert("Failed to delete product");
        } finally {
            setDeleteId(null);
        }
    };

    const filteredProducts = products.filter(
        (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                <Link href="/admin/products/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Products ({products.length})</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="py-12 text-center text-gray-500">
                            No products found. <Link href="/admin/products/new" className="text-blue-600 hover:underline">Add your first product</Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b text-left text-sm text-gray-500">
                                        <th className="pb-3 font-medium">Product</th>
                                        <th className="pb-3 font-medium">Category</th>
                                        <th className="pb-3 font-medium">Price</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="border-b last:border-0">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                                                        <Image
                                                            src={product.imageUrl || "https://placehold.co/100x100/E8E8E8/171717?text=No+Image"}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{product.title}</p>
                                                        <p className="text-xs text-gray-500">{product.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-gray-600">{product.category?.name || "-"}</td>
                                            <td className="py-4">
                                                <span className="font-medium">{formatPrice(product.price)}</span>
                                                {product.originalPrice && (
                                                    <span className="ml-2 text-sm text-gray-400 line-through">
                                                        {formatPrice(product.originalPrice)}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex gap-1">
                                                    <Badge
                                                        variant={product.isActive ? "default" : "secondary"}
                                                        className={product.isActive ? "bg-green-100 text-green-700" : ""}
                                                    >
                                                        {product.isActive ? "Active" : "Draft"}
                                                    </Badge>
                                                    {product.isFeatured && (
                                                        <Badge className="bg-amber-100 text-amber-700">Featured</Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex gap-1">
                                                    <Link href={`/product/${product.slug}`} target="_blank">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/products/${product.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(product.id)}
                                                        disabled={deleteId === product.id}
                                                    >
                                                        {deleteId === product.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
