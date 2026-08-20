import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import ChatbotWidget from "@/components/common/ChatbotWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LuxeBeauty - Mỹ Phẩm Chiết Xuất Thiên Nhiên & Son Môi High-End",
  description:
    "Thiên đường mua sắm mỹ phẩm, son môi chính hãng MAC, Dior, YSL, 3CE, Romand. Giao hàng toàn quốc, cam kết Authentic 100%.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatbotWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
