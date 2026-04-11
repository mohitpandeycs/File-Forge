"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import DropZone from "@/components/shared/DropZone";

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F59E0B]/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#14B8A6]/[0.03] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F59E0B]/[0.02] rounded-full blur-3xl" />
        {/* Noise texture overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.015]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 bg-[#F59E0B]/15 text-[#F59E0B] text-xs font-mono font-medium rounded-full mb-6 tracking-wide uppercase">
            30+ Tools &middot; Free forever
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-6"
        >
          Convert any file.
          <br />
          <span className="text-[#F59E0B]">Instantly.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[#B0B7C3] text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The last file converter you&apos;ll ever need. Documents, images,
          spreadsheets — all in one place. No sign-up. No ads. Supported tools
          run directly in your browser.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          <Link
            href="/tools"
            className="px-5 py-2.5 rounded-xl bg-[#F59E0B] text-[#0A0A0A] text-sm font-semibold hover:bg-[#D97706] transition-colors shadow-[0_6px_22px_rgba(245,158,11,0.35)]"
          >
            Explore All Tools
          </Link>
          <Link
            href="/pdf-tools"
            className="px-5 py-2.5 rounded-xl border border-[#3A3A3A] text-[#E5E7EB] text-sm font-semibold hover:border-[#F59E0B]/60 hover:text-[#F59E0B] transition-colors"
          >
            Open PDF Suite
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-8"
        >
          {["Fast conversions", "No waiting queue", "High-quality outputs"].map(
            (chip) => (
              <span
                key={chip}
                className="text-xs px-3 py-1 rounded-full border border-[#2f2f2f] bg-[#1a1a1a] text-[#D1D5DB]"
              >
                {chip}
              </span>
            ),
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <DropZone />
        </motion.div>
      </div>
    </section>
  );
}
