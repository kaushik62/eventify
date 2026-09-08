import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIAssistant";

export const metadata: Metadata = {
  title: {
    default: "Eventify — Discover Your Next Unforgettable Experience",
    template: "%s | Eventify",
  },
  description:
    "Discover, book, and manage unforgettable events with Eventify — your AI-powered event discovery and booking platform.",
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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">

            {/* Global navigation */}
            <Navbar />

            {/* Main application content */}
            <main className="flex-1">
              {children}
            </main>

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
