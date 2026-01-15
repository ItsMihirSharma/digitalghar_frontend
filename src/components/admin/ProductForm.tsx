"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";

interface ProductFormProps {
    mode: "create" | "edit";
    productId?: string;
}

interface ProductFormData {
    title: string;
    slug: string;
    shortDescription: string;
    longDescription: string;
    categoryId: string;
    price: string;
    originalPrice: string;
    productType: string;
    ageGroup: string;
    licenseType: string;
    isFeatured: boolean;
    isActive: boolean;
    tags: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

const productTypes = ["PDF", "VIDEO", "COURSE", "TEMPLATE", "PLR", "OTHER"];
const licenseTypes = ["PERSONAL", "PLR", "MRR"];

export default function ProductForm({ mode, productId }: ProductFormProps) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [productFile, setProductFile] = useState<File | null>(null);

    const [formData, setFormData] = useState<ProductFormData>({
        title: "",
        slug: "",
        shortDescription: "",
        longDescription: "",
        categoryId: "",
        price: "",
        originalPrice: "",
        productType: "PDF",
        ageGroup: "",
        licenseType: "PERSONAL",
        isFeatured: false,
        isActive: true,
        tags: "",
    });

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get("/admin/categories");
            setCategories(data.categories || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setError("Failed to load categories. Please refresh the page.");
        }
    };

    // Generate slug from title
    useEffect(() => {
        if (mode === "create" && formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            setFormData((prev) => ({ ...prev, slug }));
        }
    }, [formData.title, mode]);

    // Load product data for edit mode
    useEffect(() => {
        if (mode === "edit" && productId) {
            loadProduct();
        }
    }, [mode, productId]);

    const loadProduct = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get(`/admin/products/${productId}`);
            setFormData({
                title: data.product.title,
                slug: data.product.slug,
                shortDescription: data.product.shortDescription,
                longDescription: data.product.longDescription,
                categoryId: data.product.categoryId,
                price: String(data.product.price),
                originalPrice: data.product.originalPrice ? String(data.product.originalPrice) : "",
                productType: data.product.productType,
                ageGroup: data.product.ageGroup || "",
                licenseType: data.product.licenseType,
                isFeatured: data.product.isFeatured,
                isActive: data.product.isActive,
                tags: Array.isArray(data.product.tags) ? data.product.tags.join(", ") : "",
            });
            if (data.product.imageUrl) {
                setImagePreview(data.product.imageUrl);
            }
        } catch (error) {
            console.error("Failed to load product:", error);
            setError("Failed to load product data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProductFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSaving(true);

        try {
            // Validate required fields
            if (!formData.title || !formData.shortDescription || !formData.categoryId || !formData.price) {
                throw new Error("Please fill in all required fields (Title, Short Description, Category, Price)");
            }

            // Create FormData for file uploads
            const submitData = new FormData();

            // Add product data as JSON
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
                tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
            };
            submitData.append("data", JSON.stringify(productData));

            // Add files if present
            if (imageFile) {
                submitData.append("image", imageFile);
            }
            if (productFile) {
                submitData.append("file", productFile);
            }

            // Make API call
            if (mode === "create") {
                await api.post("/admin/products", submitData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await api.put(`/admin/products/${productId}`, submitData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            router.push("/admin/products");
        } catch (err: any) {
            // Show detailed validation error if available
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError(err.message || "Failed to save product");
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">
                    {mode === "create" ? "Add New Product" : "Edit Product"}
                </h1>
            </div>

            {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                        placeholder="Enter product title"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) =>
                                            setFormData({ ...formData, slug: e.target.value })
                                        }
                                        placeholder="product-slug"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="shortDescription">Short Description *</Label>
                                    <Input
                                        id="shortDescription"
                                        value={formData.shortDescription}
                                        onChange={(e) =>
                                            setFormData({ ...formData, shortDescription: e.target.value })
                                        }
                                        placeholder="Brief description for cards (min 10 characters)"
                                        required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        {formData.shortDescription.length}/500 characters (minimum 10)
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor="longDescription">Full Description</Label>
                                    <textarea
                                        id="longDescription"
                                        className="w-full min-h-[150px] rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.longDescription}
                                        onChange={(e) =>
                                            setFormData({ ...formData, longDescription: e.target.value })
                                        }
                                        placeholder="Detailed product description..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Media */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Media</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Product Image</Label>
                                        <div className="mt-2 flex items-center gap-4">
                                            {imagePreview ? (
                                                <div className="relative">
                                                    <Image
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        width={200}
                                                        height={150}
                                                        className="rounded-lg object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                                                        onClick={() => {
                                                            setImagePreview(null);
                                                            setImageFile(null);
                                                        }}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="flex h-32 w-48 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleImageChange}
                                                    />
                                                    <div className="text-center">
                                                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                                        <span className="mt-2 block text-sm text-gray-600">
                                                            Upload Image
                                                        </span>
                                                    </div>
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Downloadable File</Label>
                                        <div className="mt-2">
                                            <label className="flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                    accept=".pdf,.zip,.rar"
                                                />
                                                <div className="text-center">
                                                    <Upload className="mx-auto h-6 w-6 text-gray-400" />
                                                    <span className="mt-1 block text-sm text-gray-600">
                                                        {productFile ? productFile.name : "Upload PDF/ZIP file"}
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Pricing */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="price">Price (₹) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({ ...formData, price: e.target.value })
                                        }
                                        placeholder="149"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                                    <Input
                                        id="originalPrice"
                                        type="number"
                                        value={formData.originalPrice}
                                        onChange={(e) =>
                                            setFormData({ ...formData, originalPrice: e.target.value })
                                        }
                                        placeholder="299"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Leave empty if no discount
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Organization */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Organization</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="category">Category *</Label>
                                    <select
                                        id="category"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        value={formData.categoryId}
                                        onChange={(e) =>
                                            setFormData({ ...formData, categoryId: e.target.value })
                                        }
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="productType">Product Type</Label>
                                    <select
                                        id="productType"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        value={formData.productType}
                                        onChange={(e) =>
                                            setFormData({ ...formData, productType: e.target.value })
                                        }
                                    >
                                        {productTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="licenseType">License Type</Label>
                                    <select
                                        id="licenseType"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        value={formData.licenseType}
                                        onChange={(e) =>
                                            setFormData({ ...formData, licenseType: e.target.value })
                                        }
                                    >
                                        {licenseTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="ageGroup">Age Group</Label>
                                    <Input
                                        id="ageGroup"
                                        value={formData.ageGroup}
                                        onChange={(e) =>
                                            setFormData({ ...formData, ageGroup: e.target.value })
                                        }
                                        placeholder="e.g., 3-10 years"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="tags">Tags</Label>
                                    <Input
                                        id="tags"
                                        value={formData.tags}
                                        onChange={(e) =>
                                            setFormData({ ...formData, tags: e.target.value })
                                        }
                                        placeholder="tag1, tag2, tag3"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded"
                                        checked={formData.isActive}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isActive: e.target.checked })
                                        }
                                    />
                                    <span>Active (visible on site)</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded"
                                        checked={formData.isFeatured}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isFeatured: e.target.checked })
                                        }
                                    />
                                    <span>Featured Product</span>
                                </label>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : mode === "create" ? (
                                    "Create Product"
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                            <Link href="/admin/products">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
