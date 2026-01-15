"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Filter, SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product/ProductCard";
import api from "@/lib/api";
import type { Product, Category } from "@/types";

const productTypes = ["PDF", "VIDEO", "COURSE", "TEMPLATE", "PLR", "OTHER"];

export default function ShopPage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        searchParams.get("category")
    );
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get("/categories");
            setCategories(data.categories || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    // Fetch products when filters change
    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, selectedType, searchQuery]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const params: any = {
                status: 'active',
            };

            if (selectedCategory) {
                params.category = selectedCategory;
            }

            if (selectedType) {
                params.type = selectedType;
            }

            if (searchQuery) {
                params.search = searchQuery;
            }

            const { data } = await api.get("/products", { params });
            setProducts(data.products || []);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedType(null);
        setSearchQuery("");
    };

    const activeFiltersCount = [selectedCategory, selectedType, searchQuery].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-white">
            {/* Page Header */}
            <div className="bg-gradient-to-b from-muted to-white border-b border-pearl-gray">
                <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="mb-6 text-sm text-steel">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-midnight font-medium">Shop All Products</span>
                    </nav>

                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-midnight mb-3">
                                Shop All Products
                            </h1>
                            <p className="text-lg text-steel">
                                Discover our collection of premium digital products
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                {/* Search and Filter Bar */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 gap-2">
                        <Input
                            type="search"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="max-w-md border-2 focus:border-primary rounded-xl h-12"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="gap-2 border-2 rounded-xl hover:bg-primary hover:text-white hover:border-primary"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <Badge variant="default" className="ml-1 bg-coral">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </Button>
                        <div className="flex border-2 border-pearl-gray rounded-xl overflow-hidden">
                            <Button
                                variant={viewMode === "grid" ? "secondary" : "ghost"}
                                size="icon"
                                onClick={() => setViewMode("grid")}
                                className="rounded-none"
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "secondary" : "ghost"}
                                size="icon"
                                onClick={() => setViewMode("list")}
                                className="rounded-none"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Sidebar Filters */}
                    <aside
                        className={`w-full shrink-0 lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}
                    >
                        <Card className="sticky top-24 bg-muted border-2 border-pearl-gray">
                            <CardContent className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="font-bold text-lg text-midnight">Filters</h3>
                                    {activeFiltersCount > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearFilters}
                                            className="text-primary hover:text-primary/80"
                                        >
                                            Clear all
                                        </Button>
                                    )}
                                </div>

                                {/* Categories */}
                                <div className="mb-6">
                                    <h4 className="mb-3 text-sm font-semibold text-charcoal">
                                        Category
                                    </h4>
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <label
                                                key={category.id}
                                                className="flex cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-white transition-colors"
                                            >
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    checked={selectedCategory === category.slug}
                                                    onChange={() =>
                                                        setSelectedCategory(
                                                            selectedCategory === category.slug
                                                                ? null
                                                                : category.slug
                                                        )
                                                    }
                                                    className="h-4 w-4 text-primary border-2 focus:ring-primary"
                                                />
                                                <span className="text-sm font-medium text-charcoal flex items-center gap-2">
                                                    <span>{category.icon}</span>
                                                    {category.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Product Type */}
                                <div>
                                    <h4 className="mb-3 text-sm font-semibold text-charcoal">
                                        Product Type
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {productTypes.map((type) => (
                                            <Badge
                                                key={type}
                                                variant={selectedType === type ? "default" : "outline"}
                                                className={`cursor-pointer transition-all hover:scale-105 ${selectedType === type
                                                        ? "bg-primary text-white"
                                                        : "hover:bg-primary/10"
                                                    }`}
                                                onClick={() =>
                                                    setSelectedType(selectedType === type ? null : type)
                                                }
                                            >
                                                {type}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {/* Results count & Active filters */}
                        <div className="mb-6">
                            <p className="text-sm text-steel mb-3">
                                Showing <span className="font-semibold text-midnight">{products.length}</span> products
                            </p>

                            {/* Active Filter Badges */}
                            {activeFiltersCount > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedCategory && (
                                        <Badge variant="secondary" className="gap-2">
                                            {categories.find(c => c.slug === selectedCategory)?.name}
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() => setSelectedCategory(null)}
                                            />
                                        </Badge>
                                    )}
                                    {selectedType && (
                                        <Badge variant="secondary" className="gap-2">
                                            {selectedType}
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() => setSelectedType(null)}
                                            />
                                        </Badge>
                                    )}
                                    {searchQuery && (
                                        <Badge variant="secondary" className="gap-2">
                                            Search: "{searchQuery}"
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() => setSearchQuery("")}
                                            />
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="skeleton h-96 rounded-2xl" />
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <Card className="bg-muted border-2 border-pearl-gray">
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                    <Filter className="h-16 w-16 text-steel mb-4" />
                                    <h3 className="text-xl font-bold text-midnight mb-2">
                                        No products found
                                    </h3>
                                    <p className="text-steel mb-4">
                                        Try adjusting your filters or search query
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={clearFilters}
                                        className="border-2 hover:bg-primary hover:text-white hover:border-primary"
                                    >
                                        Clear filters
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div
                                className={
                                    viewMode === "grid"
                                        ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                                        : "space-y-4"
                                }
                            >
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
