// /home/ubuntu/colorin_frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Color in - 오늘의 나는, 무슨 색일까?",
  description: "가볍게 놀고, 마시고, 웃고, 창작하는 라이트 클래스 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen pt-16"> {/* Add padding top to avoid overlap with fixed header */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

