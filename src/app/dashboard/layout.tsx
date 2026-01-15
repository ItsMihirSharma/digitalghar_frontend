"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Download, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { name: "My Orders", href: "/dashboard/orders", icon: Package },
    { name: "Downloads", href: "/dashboard/downloads", icon: Download },
    { name: "Profile", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-4">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <div className="mb-6 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                                    {user?.name?.charAt(0) || "U"}
                                </div>
                                <h2 className="mt-3 font-semibold text-gray-900">{user?.name}</h2>
                                <p className="text-sm text-gray-500">{user?.email}</p>
                            </div>

                            <nav className="space-y-1">
                                {sidebarLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                                            pathname === link.href
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-600 hover:bg-gray-100"
                                        )}
                                    >
                                        <link.icon className="h-5 w-5" />
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-6 border-t pt-6">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={logout}
                                >
                                    <LogOut className="h-5 w-5" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">{children}</main>
                </div>
            </div>
        </div>
    );
}
