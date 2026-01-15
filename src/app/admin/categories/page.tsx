"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    displayOrder: number;
    isActive: boolean;
    _count?: { products: number };
}

interface CategoryFormData {
    name: string;
    slug: string;
    description: string;
    icon: string;
    displayOrder: number;
    isActive: boolean;
}

const defaultFormData: CategoryFormData = {
    name: "",
    slug: "",
    description: "",
    icon: "📁",
    displayOrder: 0,
    isActive: true,
};

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<CategoryFormData>(defaultFormData);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get("/admin/categories");
            setCategories(data.categories || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            // Fallback mock data
            setCategories([
                { id: "1", name: "Kids Activities", slug: "kids-activities", icon: "🎨", displayOrder: 1, isActive: true, _count: { products: 45 } },
                { id: "2", name: "Educational PDFs", slug: "educational-pdfs", icon: "📚", displayOrder: 2, isActive: true, _count: { products: 128 } },
                { id: "3", name: "PLR Products", slug: "plr-products", icon: "📦", displayOrder: 3, isActive: true, _count: { products: 67 } },
                { id: "4", name: "Templates", slug: "templates", icon: "📄", displayOrder: 4, isActive: true, _count: { products: 89 } },
                { id: "5", name: "Video Courses", slug: "video-courses", icon: "🎥", displayOrder: 5, isActive: true, _count: { products: 23 } },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData(defaultFormData);
        setShowModal(true);
    };

    const openEditModal = (category: Category) => {
        setEditingId(category.id);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || "",
            icon: category.icon || "📁",
            displayOrder: category.displayOrder,
            isActive: category.isActive,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.name) {
            alert("Category name is required");
            return;
        }

        setIsSaving(true);
        try {
            const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            const payload = { ...formData, slug };

            if (editingId) {
                await api.put(`/admin/categories/${editingId}`, payload);
            } else {
                await api.post("/admin/categories", payload);
            }

            await fetchCategories();
            setShowModal(false);
        } catch (error) {
            console.error("Failed to save category:", error);
            alert("Failed to save category");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, productCount: number) => {
        if (productCount > 0) {
            alert("Cannot delete category with products. Move or delete products first.");
            return;
        }

        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            await api.delete(`/admin/categories/${id}`);
            setCategories(categories.filter((c) => c.id !== id));
        } catch (error) {
            console.error("Failed to delete category:", error);
            alert("Failed to delete category");
        }
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                <Button className="gap-2" onClick={openAddModal}>
                    <Plus className="h-4 w-4" />
                    Add Category
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Categories ({categories.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b text-left text-sm text-gray-500">
                                        <th className="pb-3 font-medium">Category</th>
                                        <th className="pb-3 font-medium">Slug</th>
                                        <th className="pb-3 font-medium">Products</th>
                                        <th className="pb-3 font-medium">Order</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category) => (
                                        <tr key={category.id} className="border-b last:border-0">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{category.icon || "📁"}</span>
                                                    <span className="font-medium text-gray-900">{category.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <code className="rounded bg-gray-100 px-2 py-1 text-sm">
                                                    {category.slug}
                                                </code>
                                            </td>
                                            <td className="py-4 font-medium">{category._count?.products || 0}</td>
                                            <td className="py-4">{category.displayOrder}</td>
                                            <td className="py-4">
                                                <Badge
                                                    variant={category.isActive ? "default" : "secondary"}
                                                    className={category.isActive ? "bg-green-100 text-green-700" : ""}
                                                >
                                                    {category.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => openEditModal(category)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(category.id, category._count?.products || 0)}
                                                        disabled={(category._count?.products || 0) > 0}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
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

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                {editingId ? "Edit Category" : "Add Category"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    placeholder="Category name"
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
                                    placeholder="auto-generated-from-name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="icon">Icon (emoji)</Label>
                                <Input
                                    id="icon"
                                    value={formData.icon}
                                    onChange={(e) =>
                                        setFormData({ ...formData, icon: e.target.value })
                                    }
                                    placeholder="📁"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    placeholder="Brief description..."
                                />
                            </div>
                            <div>
                                <Label htmlFor="displayOrder">Display Order</Label>
                                <Input
                                    id="displayOrder"
                                    type="number"
                                    value={formData.displayOrder}
                                    onChange={(e) =>
                                        setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                                    }
                                />
                            </div>
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded"
                                    checked={formData.isActive}
                                    onChange={(e) =>
                                        setFormData({ ...formData, isActive: e.target.checked })
                                    }
                                />
                                <span>Active</span>
                            </label>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <Button
                                className="flex-1"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : editingId ? (
                                    "Save Changes"
                                ) : (
                                    "Create Category"
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
