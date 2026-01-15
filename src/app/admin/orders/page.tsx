"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, Eye, Clock, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";

interface Order {
    id: string;
    orderNumber: string;
    userEmail: string;
    totalAmount: number;
    paymentStatus: string;
    orderStatus: string;
    utrNumber?: string;
    createdAt: string;
    user?: { name: string; email: string };
    items?: { id: string; productTitle: string; productPrice: number }[];
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "VERIFIED":
            return <Badge className="bg-green-100 text-green-700"><CheckCircle className="mr-1 h-3 w-3" /> Verified</Badge>;
        case "SUBMITTED":
            return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="mr-1 h-3 w-3" /> Pending Verification</Badge>;
        case "PENDING":
            return <Badge className="bg-gray-100 text-gray-700">Awaiting Payment</Badge>;
        case "FAILED":
            return <Badge className="bg-red-100 text-red-700"><XCircle className="mr-1 h-3 w-3" /> Failed</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get("/admin/orders");
            setOrders(data.orders || []);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            // Fallback mock data
            setOrders([
                { id: "1", orderNumber: "ORD-202601-ABC123", userEmail: "rahul@example.com", user: { name: "Rahul Sharma", email: "rahul@example.com" }, totalAmount: 348, paymentStatus: "VERIFIED", orderStatus: "COMPLETED", utrNumber: "123456789012", createdAt: "2026-01-13T10:30:00Z", items: [{ id: "1", productTitle: "Kids Coloring Book", productPrice: 149 }, { id: "2", productTitle: "Math Worksheets", productPrice: 199 }] },
                { id: "2", orderNumber: "ORD-202601-DEF456", userEmail: "priya@example.com", user: { name: "Priya Patel", email: "priya@example.com" }, totalAmount: 499, paymentStatus: "SUBMITTED", orderStatus: "PENDING", utrNumber: "987654321098", createdAt: "2026-01-13T09:15:00Z", items: [{ id: "3", productTitle: "Digital Planner 2026", productPrice: 499 }] },
                { id: "3", orderNumber: "ORD-202601-GHI789", userEmail: "amit@example.com", user: { name: "Amit Kumar", email: "amit@example.com" }, totalAmount: 149, paymentStatus: "PENDING", orderStatus: "PENDING", createdAt: "2026-01-12T16:45:00Z", items: [{ id: "4", productTitle: "Hindi Flashcards", productPrice: 149 }] },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (orderId: string) => {
        if (!confirm("Are you sure you want to verify this payment? This will grant download access to the customer.")) return;

        setActionLoading(orderId);
        try {
            await api.post(`/admin/orders/${orderId}/verify`);
            await fetchOrders();
            setSelectedOrder(null);
        } catch (error) {
            console.error("Failed to verify order:", error);
            alert("Failed to verify order");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (orderId: string) => {
        if (!rejectReason) {
            alert("Please provide a reason for rejection");
            return;
        }

        setActionLoading(orderId);
        try {
            await api.post(`/admin/orders/${orderId}/reject`, { reason: rejectReason });
            await fetchOrders();
            setSelectedOrder(null);
            setRejectReason("");
        } catch (error) {
            console.error("Failed to reject order:", error);
            alert("Failed to reject order");
        } finally {
            setActionLoading(null);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || order.paymentStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                <p className="mt-2 text-gray-600">Manage and verify customer orders</p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search orders, customers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    {[null, "SUBMITTED", "PENDING", "VERIFIED", "FAILED"].map((status) => (
                        <Button
                            key={status || "all"}
                            variant={statusFilter === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter(status)}
                        >
                            {status === null ? "All" :
                                status === "SUBMITTED" ? "Pending Verification" :
                                    status.charAt(0) + status.slice(1).toLowerCase()}
                        </Button>
                    ))}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Orders ({filteredOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="py-12 text-center text-gray-500">
                            No orders found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b text-left text-sm text-gray-500">
                                        <th className="pb-3 font-medium">Order</th>
                                        <th className="pb-3 font-medium">Customer</th>
                                        <th className="pb-3 font-medium">Amount</th>
                                        <th className="pb-3 font-medium">UTR</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Date</th>
                                        <th className="pb-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="border-b last:border-0">
                                            <td className="py-4">
                                                <p className="font-medium">{order.orderNumber}</p>
                                                <p className="text-xs text-gray-500">{order.items?.length || 0} item(s)</p>
                                            </td>
                                            <td className="py-4">
                                                <p className="font-medium text-gray-900">{order.user?.name || "-"}</p>
                                                <p className="text-xs text-gray-500">{order.userEmail}</p>
                                            </td>
                                            <td className="py-4 font-semibold">{formatPrice(order.totalAmount)}</td>
                                            <td className="py-4">
                                                {order.utrNumber ? (
                                                    <code className="rounded bg-gray-100 px-2 py-1 text-xs font-mono">
                                                        {order.utrNumber}
                                                    </code>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="py-4">{getStatusBadge(order.paymentStatus)}</td>
                                            <td className="py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                                            <td className="py-4">
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => setSelectedOrder(order)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {order.paymentStatus === "SUBMITTED" && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                className="h-8 gap-1 bg-green-600 hover:bg-green-700"
                                                                onClick={() => handleVerify(order.id)}
                                                                disabled={actionLoading === order.id}
                                                            >
                                                                {actionLoading === order.id ? (
                                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                                ) : (
                                                                    <>
                                                                        <CheckCircle className="h-3 w-3" />
                                                                        Verify
                                                                    </>
                                                                )}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 gap-1 text-red-600 hover:bg-red-50"
                                                                onClick={() => setSelectedOrder(order)}
                                                            >
                                                                <XCircle className="h-3 w-3" />
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
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

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6 max-h-[90vh] overflow-y-auto">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Order Details</h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-gray-500">Order Number</Label>
                                    <p className="font-medium">{selectedOrder.orderNumber}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-500">Date</Label>
                                    <p>{formatDate(selectedOrder.createdAt)}</p>
                                </div>
                            </div>

                            <div>
                                <Label className="text-gray-500">Customer</Label>
                                <p className="font-medium">{selectedOrder.user?.name}</p>
                                <p className="text-sm text-gray-500">{selectedOrder.userEmail}</p>
                            </div>

                            <div>
                                <Label className="text-gray-500">Status</Label>
                                <div className="mt-1">{getStatusBadge(selectedOrder.paymentStatus)}</div>
                            </div>

                            {selectedOrder.utrNumber && (
                                <div>
                                    <Label className="text-gray-500">UTR Number</Label>
                                    <code className="mt-1 block rounded bg-gray-100 px-3 py-2 font-mono">
                                        {selectedOrder.utrNumber}
                                    </code>
                                </div>
                            )}

                            <div>
                                <Label className="text-gray-500">Items</Label>
                                <div className="mt-2 space-y-2">
                                    {selectedOrder.items?.map((item) => (
                                        <div key={item.id} className="flex justify-between rounded bg-gray-50 p-3">
                                            <span>{item.productTitle}</span>
                                            <span className="font-medium">{formatPrice(item.productPrice)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-2 flex justify-between border-t pt-2">
                                    <span className="font-medium">Total</span>
                                    <span className="font-bold">{formatPrice(selectedOrder.totalAmount)}</span>
                                </div>
                            </div>

                            {selectedOrder.paymentStatus === "SUBMITTED" && (
                                <div className="border-t pt-4">
                                    <div className="mb-4">
                                        <Label htmlFor="rejectReason">Rejection Reason (if rejecting)</Label>
                                        <textarea
                                            id="rejectReason"
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                                            rows={2}
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            placeholder="e.g., UTR not found in bank statement"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                            onClick={() => handleVerify(selectedOrder.id)}
                                            disabled={actionLoading === selectedOrder.id}
                                        >
                                            {actionLoading === selectedOrder.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Verify Payment
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 text-red-600 hover:bg-red-50"
                                            onClick={() => handleReject(selectedOrder.id)}
                                            disabled={actionLoading === selectedOrder.id}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
