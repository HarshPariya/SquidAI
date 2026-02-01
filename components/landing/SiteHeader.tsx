"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-context';
import { useEffect, useState } from 'react';

export default function SiteHeader() {
  const pathname = usePathname();
  const { isAuthenticated, isGuest, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const showLogout = isAuthenticated || isGuest;
  const showBack = pathname !== '/';

  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Navigate to home with hash - home will scroll to footer on mount
    try {
      router.push('/#site-footer');
    } catch {
      // Fallback
      window.location.href = '/#site-footer';
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Scroll to top smoothly without navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prevent rendering issues before hydration
  if (!mounted) {
    return (
      <header className="w-full py-3 sm:py-4 px-4 sm:px-6 flex justify-between items-center z-70 safe-area-inset-top fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-b border-pink-500/10">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <span className="text-lg sm:text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-pink-500 to-red-500 truncate">SquidAI</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-linear-to-r from-pink-500 to-red-500 text-white rounded-md text-sm sm:text-base touch-manipulation min-h-11">Start Chatting</button>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full py-3 sm:py-4 px-4 sm:px-6 flex justify-between items-center z-70 safe-area-inset-top fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-b border-pink-500/10 pointer-events-auto">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 pointer-events-auto">
        {showBack && (
          <button
            onClick={handleBackClick}
            className="relative z-60 inline-block px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md bg-zinc-900/40 text-gray-200 hover:bg-zinc-900/60 text-sm sm:text-base touch-manipulation min-h-11 active:bg-zinc-900/80 transition-colors cursor-pointer pointer-events-auto"
            aria-label="Back to footer"
          >
            Back
          </button>
        )}
        <Link href="/" className="min-w-0 pointer-events-auto active:opacity-80" onClick={handleLogoClick}>
          <span className="text-lg sm:text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-pink-500 to-red-500 truncate">SquidAI</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0 pointer-events-auto">
        {showLogout && (
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-gray-200 rounded-md text-sm sm:text-base touch-manipulation min-h-11 transition-colors cursor-pointer pointer-events-auto"
            aria-label="Logout"
          >
            <LogOut size={16} />
            Logout
          </button>
        )}
        <Link href="/chat" className="pointer-events-auto active:opacity-80">
          <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-linear-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 active:from-pink-700 active:to-red-700 text-white rounded-md text-sm sm:text-base touch-manipulation min-h-11 transition-colors cursor-pointer">Start Chatting</button>
        </Link>
      </div>
    </header>
  );
}
