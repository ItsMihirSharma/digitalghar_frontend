"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
];

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { items } = useCartStore();
    const { isAuthenticated, user } = useAuthStore();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                scrolled
                    ? "bg-white/80 backdrop-blur-xl shadow-soft"
                    : "bg-transparent"
            )}
        >
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-8">
                {/* Logo */}
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="text-white font-bold text-xl">D</span>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple bg-clip-text text-transparent">
                                DigitalGhar
                            </span>
                            <span className="text-xs text-steel block leading-none">.in</span>
                        </div>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-charcoal hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="sr-only">Toggle menu</span>
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Desktop navigation */}
                <div className="hidden lg:flex lg:gap-x-10">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="relative text-base font-medium text-charcoal hover:text-primary transition-colors group"
                        >
                            {item.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                        </Link>
                    ))}
                </div>

                {/* Right side actions */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3">
                    {/* Search */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-charcoal hover:text-primary hover:bg-primary/10 rounded-full"
                    >
                        <Search className="h-5 w-5" />
                    </Button>

                    {/* Cart */}
                    <Link href="/cart">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-charcoal hover:text-primary hover:bg-primary/10 rounded-full"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {items.length > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-coral text-white text-xs font-bold animate-pulse">
                                    {items.length}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {/* Auth */}
                    {isAuthenticated ? (
                        <Link href={user?.role === "ADMIN" ? "/admin" : "/dashboard"}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 border-2 hover:bg-primary hover:text-white hover:border-primary transition-all"
                            >
                                <User className="h-4 w-4" />
                                {user?.name?.split(" ")[0]}
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/auth/login">
                            <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-white shadow-soft hover:shadow-md transition-all"
                            >
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </nav>

            {/* Mobile menu */}
            <div
                className={cn(
                    "lg:hidden transition-all duration-300 ease-in-out overflow-hidden",
                    mobileMenuOpen ? "max-h-screen" : "max-h-0"
                )}
            >
                <div className="border-t border-pearl-gray/50 bg-white px-4 pb-4 pt-2 shadow-lg">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="block rounded-xl px-4 py-3 text-base font-medium text-charcoal hover:bg-muted hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <div className="mt-4 flex gap-2">
                        <Link href="/cart" className="flex-1">
                            <Button variant="outline" className="w-full gap-2 border-2">
                                <ShoppingCart className="h-4 w-4" />
                                Cart ({items.length})
                            </Button>
                        </Link>
                        {isAuthenticated ? (
                            <Link href={user?.role === "ADMIN" ? "/admin" : "/dashboard"} className="flex-1">
                                <Button className="w-full bg-primary hover:bg-primary/90">
                                    {user?.role === "ADMIN" ? "Admin Panel" : "Dashboard"}
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/auth/login" className="flex-1">
                                <Button className="w-full bg-primary hover:bg-primary/90">Login</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
