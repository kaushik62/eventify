import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIAssistant";

export const metadata: Metadata = {
  title: "Eventify — Discover Your Next Unforgettable Experience",
  description: "AI-powered event discovery, booking and management platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <AIAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
