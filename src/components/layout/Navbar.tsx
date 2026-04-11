"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Clock, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { navLinks } from "@/constants/nav";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userEmail = user?.email || "";
  const userInitial = userEmail.charAt(0).toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-xl border-b border-[#242424] shadow-[0_1px_0_rgba(245,158,11,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-[#F59E0B]/40 group-hover:ring-[#D97706]/60 transition-colors">
              <Image
                src="/fileforge-mark.svg"
                alt="FileForge"
                width={32}
                height={32}
                priority
                className="h-full w-full"
              />
            </div>
            <span className="font-display font-semibold text-lg tracking-tight">
              FileForge
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#F59E0B] ${
                  pathname === link.href
                    ? "text-[#F59E0B]"
                    : "text-[#6B7280] dark:text-[#9CA3AF]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/history"
              className={`text-sm font-medium transition-colors hover:text-[#F59E0B] ${
                pathname === "/history"
                  ? "text-[#F59E0B]"
                  : "text-[#6B7280] dark:text-[#9CA3AF]"
              }`}
              aria-label="Conversion history"
            >
              <Clock className="w-4 h-4" />
            </Link>

            {loading ? (
              <div className="w-20 h-9 bg-[#2a2a2a] rounded-lg animate-pulse" />
            ) : user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] hover:bg-[#242424] rounded-lg transition-colors"
                >
                  <div className="w-6 h-6 bg-[#F59E0B] rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-[#0A0A0A]">
                      {userInitial}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#6B7280] dark:text-[#9CA3AF] transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a1a1a] border border-[#E5E5E0] dark:border-[#2a2a2a] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-[#E5E5E0] dark:border-[#2a2a2a]">
                        <p className="text-sm font-medium truncate">
                          {userEmail}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/history"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F0F0EB] dark:hover:bg-[#2a2a2a] transition-colors"
                        >
                          <Clock className="w-4 h-4" />
                          Conversion History
                        </Link>
                        <button
                          onClick={async () => {
                            await signOut();
                            setShowUserMenu(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] text-[#0A0A0A] text-sm font-medium rounded-lg hover:bg-[#D97706] transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden bg-[#0F0F0F] border-b border-[#242424] px-4 py-4 space-y-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-medium py-2 transition-colors hover:text-[#F59E0B] ${
                  pathname === link.href
                    ? "text-[#F59E0B]"
                    : "text-[#6B7280] dark:text-[#9CA3AF]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/history"
              onClick={() => setIsOpen(false)}
              className={`block text-sm font-medium py-2 transition-colors hover:text-[#F59E0B] ${
                pathname === "/history"
                  ? "text-[#F59E0B]"
                  : "text-[#6B7280] dark:text-[#9CA3AF]"
              }`}
            >
              Conversion History
            </Link>
            {!loading && !user && (
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-2.5 bg-[#F59E0B] text-[#0A0A0A] text-sm font-medium rounded-lg"
              >
                Sign In
              </Link>
            )}
            {!loading && user && (
              <button
                onClick={async () => {
                  await signOut();
                  setIsOpen(false);
                }}
                className="w-full text-center px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 text-sm font-medium rounded-lg"
              >
                Sign Out
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
