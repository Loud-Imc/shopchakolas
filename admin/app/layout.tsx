import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Chakolas Admin Panel",
    description: "Admin management panel for Chakolas Ayurvedic Skincare",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
