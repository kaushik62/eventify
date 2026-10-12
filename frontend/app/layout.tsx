import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIAssistant";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Eventify — Discover & Book Exceptional Live Events",
    template: "%s | Eventify",
  },
  description:
    "Curated event discovery, instant ticketing, and real-time organizer workspaces. Powered by secure payments and verified creators.",
  applicationName: "Eventify",
  keywords: [
    "events",
    "event booking",
    "concerts",
    "workshops",
    "conferences",
    "sports events",
    "Eventify",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            {/* Global navigation */}
            <Navbar />

            {/* Main application content */}
            <div className="flex-1">
              {children}
            </div>

            {/* Global footer */}
            <Footer />

            {/* Floating AI assistant */}
            <AIAssistant />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
