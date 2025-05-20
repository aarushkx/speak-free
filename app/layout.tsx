import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from "@/lib/constants";
import AuthProvider from "@/context/AuthProvier";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/custom/Navbar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// TODO: Add metadata
export const metadata: Metadata = {
    title: `${APP_NAME} \u2013 ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <AuthProvider>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Navbar />
                        <main>{children}</main>
                        <Toaster />
                    </ThemeProvider>
                </body>
            </AuthProvider>
        </html>
    );
}
