import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "DigitalGhar - Premium Digital Products for Indian Families",
    template: "%s | DigitalGhar",
  },
  description:
    "Discover premium digital products for kids, educators, and entrepreneurs. Download PDFs, templates, courses, and more instantly.",
  keywords: [
    "digital products",
    "kids activities",
    "educational PDFs",
    "PLR products",
    "India",
    "printables",
    "worksheets",
  ],
  authors: [{ name: "DigitalGhar" }],
  creator: "DigitalGhar",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://digitalghar.in",
    siteName: "DigitalGhar",
    title: "DigitalGhar - Premium Digital Products",
    description:
      "Premium digital products for Indian families, kids, and educators.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
