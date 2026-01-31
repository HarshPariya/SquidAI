"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-context";
import { AuthUI } from "@/components/auth/auth-ui";

// New design imports
import { Hero } from "@/components/landing/Hero";
import ShapesBackground from "@/components/landing/ShapesBackground";
import { Features } from "@/components/landing/Features";
import { ChatDemo } from "@/components/landing/ChatDemo";
import { AIShowcase } from "@/components/landing/AIShowcase";
import { Footer } from "@/components/landing/Footer";
import SiteHeader from "@/components/landing/SiteHeader";

export default function App() {
  // Auth state
  const { isAuthenticated, isGuest, loading: authLoading } = useAuth();
  
  // Show auth UI if not authenticated and not a guest
  const showAuth = !authLoading && !isAuthenticated && !isGuest;

  // Loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to footer when navigating with #site-footer (e.g. Back from sub-pages)
  useEffect(() => {
    if (showAuth || loading || authLoading) return;
    if (typeof window === "undefined" || window.location.hash !== "#site-footer") return;

    const scrollToFooter = () => {
      const el = document.getElementById("site-footer");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const t = setTimeout(scrollToFooter, 150);
    return () => clearTimeout(t);
  }, [showAuth, loading, authLoading]);

  // Show auth UI if not authenticated and not a guest
  if (showAuth) {
    return <AuthUI />;
  }

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 border-4 border-pink-500 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pink-500">Initializing SquidAI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ShapesBackground />
      <div className="fixed top-0 left-0 right-0 z-30">
        <SiteHeader />
      </div>
      <Hero />
      <Features />
      <ChatDemo />
      <AIShowcase />
      <Footer />
    </div>
  );
}
