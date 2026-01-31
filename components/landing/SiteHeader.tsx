"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-context';

export default function SiteHeader() {
  const pathname = usePathname();
  const { isAuthenticated, isGuest, logout } = useAuth();
  const showLogout = isAuthenticated || isGuest;
  const showBack = pathname !== '/';

  return (
    <header className="w-full py-3 sm:py-4 px-4 sm:px-6 flex justify-between items-center z-20 safe-area-inset-top">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {showBack && (
          <Link
            href="/#site-footer"
            className="inline-block px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md bg-zinc-900/40 text-gray-200 hover:bg-zinc-900/60 text-sm sm:text-base touch-manipulation min-h-[44px]"
            aria-label="Back to footer"
          >
            Back
          </Link>
        )}
        <Link href="/" className="min-w-0">
          <span className="text-lg sm:text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-500 truncate">SquidAI</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {showLogout && (
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-200 rounded-md text-sm sm:text-base touch-manipulation min-h-[44px] transition-colors"
            aria-label="Logout"
          >
            <LogOut size={16} />
            Logout
          </button>
        )}
        <Link href="/chat">
          <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-md text-sm sm:text-base touch-manipulation min-h-[44px]">Start Chatting</button>
        </Link>
      </div>
    </header>
  );
}
