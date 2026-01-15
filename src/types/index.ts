export interface User {
    id: string;
    email: string;
    name: string;
    role: "CUSTOMER" | "ADMIN";
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    _count?: {
        products: number;
    };
}

export interface Product {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    longDescription: string;
    price: number;
    originalPrice?: number;
    discountPercent?: number;
    productType: "PDF" | "VIDEO" | "COURSE" | "TEMPLATE" | "PLR" | "OTHER";
    ageGroup?: string;
    imageUrl: string;
    galleryImages?: string[];
    isFeatured: boolean;
    ratingAvg: number;
    ratingCount: number;
    tags?: string[];
    licenseType: "PERSONAL" | "PLR" | "MRR";
    category: Category;
    categoryId?: string;
    fileSize?: number;
    downloadCount?: number;
}

export interface CartItem {
    id: string;
    title: string;
    slug: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    category: {
        name: string;
        slug: string;
    };
}

export interface Order {
    id: string;
    orderNumber: string;
    totalAmount: number;
    paymentStatus: "PENDING" | "SUBMITTED" | "VERIFIED" | "FAILED" | "REFUNDED";
    orderStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
    utrNumber?: string;
    items: OrderItem[];
    createdAt: string;
    paidAt?: string;
}

export interface OrderItem {
    id: string;
    productTitle: string;
    productPrice: number;
    downloadUrl?: string;
    downloadLimit: number;
    downloadCount: number;
    product: {
        title: string;
        imageUrl: string;
        slug: string;
    };
}

export interface PaymentDetails {
    upiId: string;
    amount: number;
    qrCode: string;
    note?: string;
}
