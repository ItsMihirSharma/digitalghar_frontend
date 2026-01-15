"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Download, Shield, Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/product/ProductCard";
import api from "@/lib/api";
import type { Product, Category } from "@/types";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products", { params: { featured: true, limit: 6 } }),
        api.get("/categories", { params: { limit: 6 } }),
      ]);

      setFeaturedProducts(productsRes.data.products || []);
      setCategories(categoriesRes.data.categories || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - "Above the Fold Magic" */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{ animationDelay: '1s' }} />

        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 backdrop-blur mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Premium Digital Products</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
                <span className="text-charcoal">Turn Screen Time</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-purple to-primary bg-clip-text text-transparent">
                  Into Learning Time 🚀
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg lg:text-xl text-steel max-w-lg mb-8 leading-relaxed">
                Affordable digital products for creativity, learning & smart skills. Made for Indian families.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/shop">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group"
                  >
                    Explore Digital Products
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 border-2 hover:bg-muted"
                  >
                    How it works
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Download, text: "Instant Download" },
                  { icon: Shield, text: "Safe & Legal" },
                  { icon: Heart, text: "Made for India" }
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-mint/20 flex items-center justify-center">
                      <badge.icon className="h-4 w-4 text-mint" />
                    </div>
                    <span className="text-sm font-medium text-charcoal">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Floating Product Cards */}
            <div className="hidden lg:block relative h-[500px]">
              {featuredProducts.slice(0, 3).map((product, i) => (
                <div
                  key={product.id}
                  className="absolute w-64 animate-float"
                  style={{
                    top: `${i * 80}px`,
                    left: `${i * 60}px`,
                    animationDelay: `${i * 0.5}s`,
                    zIndex: 3 - i
                  }}
                >
                  <Card className="overflow-hidden shadow-elevated hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-white/95 backdrop-blur">
                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {product.discountPercent && (
                        <div className="absolute top-2 right-2 bg-coral text-white px-3 py-1 rounded-full text-xs font-bold">
                          -{product.discountPercent}%
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-2 text-midnight">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {product.originalPrice && (
                            <span className="text-xs text-steel line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                          <span className="text-lg font-bold text-primary">
                            ₹{product.price}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-muted py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "⚡", title: "Instant Download", desc: "in seconds" },
              { icon: "🔒", title: "Secure Payments", desc: "SSL protected" },
              { icon: "💬", title: "24/7 Support", desc: "Free help" },
              { icon: "✅", title: "100% Legal", desc: "Licensed" }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 text-3xl flex items-center justify-center transform hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold text-midnight mb-1">{item.title}</h3>
                <p className="text-sm text-steel">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-midnight mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-steel max-w-2xl mx-auto">
              Find exactly what you need for your family's learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-48 rounded-2xl" />
              ))
            ) : categories.length > 0 ? (
              categories.map((category, i) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className="group"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Card className="h-full hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 hover:border-primary border-2 border-transparent bg-white">
                    <CardContent className="p-8">
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <span className="group-hover:scale-125 transition-transform">
                          {category.icon || "📚"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-midnight mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-steel line-clamp-2 mb-4">
                        {category.description || "Explore our collection"}
                      </p>

                      {/* Browse Link */}
                      <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                        Browse
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-steel text-lg">No categories available yet</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products - "Best Sellers" */}
      <section className="py-20 bg-gradient-to-b from-white to-muted">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-midnight mb-3">
                Best Sellers 🔥
              </h2>
              <p className="text-lg text-steel">Most loved by our customers</p>
            </div>
            <Link href="/shop" className="hidden md:block">
              <Button variant="outline" className="gap-2 hover:bg-primary hover:text-white transition-colors">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-96 rounded-2xl" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="bg-white">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-steel text-lg mb-4">No featured products available yet</p>
                <Link href="/shop">
                  <Button className="bg-primary hover:bg-primary/90">
                    Browse All Products
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Why Choose Us - Value Propositions */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50/30 to-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-midnight mb-4">
              Why Choose DigitalGhar?
            </h2>
            <p className="text-lg text-steel max-w-2xl mx-auto">
              We make digital learning accessible, affordable, and delightful
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                number: "01",
                icon: Download,
                title: "Instant Access",
                description: "Download your products immediately after purchase. No waiting, no shipping."
              },
              {
                number: "02",
                icon: "₹",
                title: "Affordable Pricing",
                description: "Premium quality at prices every Indian family can afford. Education shouldn't be expensive."
              },
              {
                number: "03",
                icon: Shield,
                title: "Quality Guaranteed",
                description: "Every product is carefully curated and tested. 100% satisfaction or your money back."
              },
              {
                number: "04",
                icon: Heart,
                title: "Family Safe",
                description: "Age-appropriate content designed with Indian values and culture in mind."
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="text-6xl font-bold text-muted mb-4">{feature.number}</div>
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  {typeof feature.icon === 'string' ? (
                    <span className="text-2xl">{feature.icon}</span>
                  ) : (
                    <feature.icon className="h-7 w-7 text-primary" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-midnight mb-3">{feature.title}</h3>
                <p className="text-steel leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Card className="overflow-hidden bg-gradient-to-br from-primary via-purple to-primary relative">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <CardContent className="relative p-12 lg:p-16 text-center text-white">
              <h2 className="text-3xl lg:text-5xl font-bold mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                Join thousands of families who trust DigitalGhar for quality digital resources
              </p>
              <Link href="/shop">
                <Button
                  size="lg"
                  className="h-14 px-10 bg-white text-primary hover:bg-blue-50 shadow-xl hover:scale-105 transition-all"
                >
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
