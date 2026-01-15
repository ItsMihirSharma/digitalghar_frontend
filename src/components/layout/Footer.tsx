"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
    quickLinks: [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Blog", href: "/blog" },
    ],
    categories: [
        { name: "E-Books", href: "/shop?category=ebooks-reading" },
        { name: "Online Courses", href: "/shop?category=online-courses" },
        { name: "Templates", href: "/shop?category=templates" },
        { name: "Kids Learning", href: "/shop?category=kids-parenting" },
        { name: "PLR Products", href: "/shop?category=plr-mrr" },
    ],
    help: [
        { name: "FAQ", href: "/faq" },
        { name: "Shipping & Delivery", href: "/shipping" },
        { name: "Return Policy", href: "/returns" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms & Conditions", href: "/terms" },
    ],
};

const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-600" },
    { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-pink-600" },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-sky-500" },
    { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-600" },
];

export default function Footer() {
    return (
        <footer className="bg-midnight text-silver border-t border-pearl-gray/10">
            {/* Main Footer Content */}
            <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-white font-bold text-2xl">D</span>
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-white">
                                    DigitalGhar
                                </span>
                                <span className="text-sm text-steel block leading-none">.in</span>
                            </div>
                        </Link>

                        <p className="text-sm leading-relaxed mb-6 max-w-sm">
                            Making learning accessible and affordable for every Indian family. Premium digital products for creativity, education, and growth.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-primary" />
                                <a href="mailto:support@digitalghar.in" className="hover:text-white transition-colors">
                                    support@digitalghar.in
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-primary" />
                                <a href="tel:+911234567890" className="hover:text-white transition-colors">
                                    +91 123 456 7890
                                </a>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                                <span>Mumbai, Maharashtra, India</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-10 h-10 rounded-full border border-pearl-gray/20 flex items-center justify-center transition-all hover:border-primary hover:bg-primary/10 ${social.color}`}
                                        aria-label={social.name}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-base mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            {footerLinks.quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm hover:text-white hover:translate-x-1 inline-block transition-all"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-bold text-base mb-4">Categories</h3>
                        <ul className="space-y-3">
                            {footerLinks.categories.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm hover:text-white hover:translate-x-1 inline-block transition-all"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help & Support */}
                    <div>
                        <h3 className="text-white font-bold text-base mb-4">Help & Support</h3>
                        <ul className="space-y-3">
                            {footerLinks.help.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm hover:text-white hover:translate-x-1 inline-block transition-all"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="mt-12 pt-12 border-t border-pearl-gray/10">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-white font-bold text-xl mb-2">
                                Get Learning Tips & Offers
                            </h3>
                            <p className="text-sm">
                                Join 10,000+ parents receiving weekly tips and exclusive deals
                            </p>
                        </div>
                        <div>
                            <form className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-white/10 border-pearl-gray/20 text-white placeholder:text-silver focus:border-primary h-12 rounded-xl"
                                />
                                <Button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/90 text-white h-12 px-8 rounded-xl whitespace-nowrap"
                                >
                                    Subscribe →
                                </Button>
                            </form>
                            <div className="flex gap-4 mt-3 text-xs">
                                <span className="flex items-center gap-1">
                                    ✓ Weekly tips
                                </span>
                                <span className="flex items-center gap-1">
                                    ✓ Exclusive deals
                                </span>
                                <span className="flex items-center gap-1">
                                    ✓ No spam
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-pearl-gray/10">
                <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                        <p className="text-center md:text-left">
                            © {new Date().getFullYear()} DigitalGhar.in - All rights reserved
                        </p>
                        <p className="text-center md:text-right">
                            Made with <span className="text-coral">❤️</span> in Ajmer
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
