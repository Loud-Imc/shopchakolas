import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";
import StoreInitializer from "@/components/StoreInitializer";
import ProgressBar from "@/components/ProgressBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Chakolas - Ayurvedic Skincare Since 1922",
    description: "Experience the purity of Ayurveda with Chakolas skincare products.",
};

// Force dynamic rendering for all pages to avoid static generation Suspense issues
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <ProgressBar />
                    <StoreInitializer />
                    <Header />
                    <main className="min-h-screen bg-gray-50 uppercase-headings">
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
