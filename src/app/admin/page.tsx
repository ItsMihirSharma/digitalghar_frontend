"use client";

import { Package, ShoppingCart, Users, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";

// Mock data
const stats = {
    revenue: { thisMonth: 45670, lastMonth: 38420 },
    orders: { total: 156, pending: 12, completed: 144 },
    products: { total: 48, active: 45 },
    users: 234,
};

const recentOrders = [
    { id: "1", orderNumber: "ORD-202601-ABC123", customer: "Rahul Sharma", amount: 348, status: "VERIFIED", date: "2026-01-13T10:30:00Z" },
    { id: "2", orderNumber: "ORD-202601-DEF456", customer: "Priya Patel", amount: 499, status: "SUBMITTED", date: "2026-01-13T09:15:00Z" },
    { id: "3", orderNumber: "ORD-202601-GHI789", customer: "Amit Kumar", amount: 149, status: "PENDING", date: "2026-01-12T16:45:00Z" },
    { id: "4", orderNumber: "ORD-202601-JKL012", customer: "Sneha Gupta", amount: 199, status: "VERIFIED", date: "2026-01-12T14:20:00Z" },
    { id: "5", orderNumber: "ORD-202601-MNO345", customer: "Vikram Singh", amount: 599, status: "VERIFIED", date: "2026-01-12T11:00:00Z" },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case "VERIFIED":
            return <Badge className="bg-green-100 text-green-700">Verified</Badge>;
        case "SUBMITTED":
            return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
        case "PENDING":
            return <Badge className="bg-gray-100 text-gray-700">Awaiting</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function AdminDashboardPage() {
    const revenueChange = ((stats.revenue.thisMonth - stats.revenue.lastMonth) / stats.revenue.lastMonth) * 100;

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold text-gray-900">Dashboard</h1>

            {/* Stats Grid */}
            <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Revenue (This Month)
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{formatPrice(stats.revenue.thisMonth)}</p>
                        <p className="mt-1 text-xs text-green-600">
                            +{revenueChange.toFixed(1)}% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Total Orders
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{stats.orders.total}</p>
                        <div className="mt-1 flex gap-2 text-xs">
                            <span className="text-yellow-600">{stats.orders.pending} pending</span>
                            <span className="text-green-600">{stats.orders.completed} completed</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Products
                        </CardTitle>
                        <Package className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{stats.products.total}</p>
                        <p className="mt-1 text-xs text-gray-500">
                            {stats.products.active} active
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Customers
                        </CardTitle>
                        <Users className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{stats.users}</p>
                        <p className="mt-1 text-xs text-gray-500">Registered users</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Orders</CardTitle>
                    <Button variant="outline" size="sm">
                        View All
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b text-left text-sm text-gray-500">
                                    <th className="pb-3 font-medium">Order</th>
                                    <th className="pb-3 font-medium">Customer</th>
                                    <th className="pb-3 font-medium">Amount</th>
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium">Date</th>
                                    <th className="pb-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b last:border-0">
                                        <td className="py-3 font-medium">{order.orderNumber}</td>
                                        <td className="py-3 text-gray-600">{order.customer}</td>
                                        <td className="py-3 font-medium">{formatPrice(order.amount)}</td>
                                        <td className="py-3">{getStatusBadge(order.status)}</td>
                                        <td className="py-3 text-sm text-gray-500">
                                            {formatDate(order.date)}
                                        </td>
                                        <td className="py-3">
                                            {order.status === "SUBMITTED" && (
                                                <Button size="sm" variant="default">
                                                    <CheckCircle className="mr-1 h-3 w-3" />
                                                    Verify
                                                </Button>
                                            )}
                                            {order.status === "PENDING" && (
                                                <Button size="sm" variant="outline">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    Remind
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
