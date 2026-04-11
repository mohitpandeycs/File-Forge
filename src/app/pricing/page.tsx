"use client";

import Link from "next/link";
import SectionHeading from "@/components/shared/SectionHeading";

export default function PricingPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Pricing"
          title="Simple, transparent pricing"
          subtitle="Start free. More features coming soon."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-12">
          {/* Free */}
          <div className="bg-white dark:bg-[#1a1a1a] border border-[#E5E5E0] dark:border-[#2a2a2a] rounded-2xl p-8">
            <h3 className="font-display font-semibold text-xl mb-2">Free</h3>
            <p className="text-3xl font-display font-bold mb-1">$0</p>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-6">
              Forever free
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Files up to 50 MB",
                "Browser-based conversion tools",
                "Batch convert up to 10 images",
                "No sign-up required",
                "Optional account for conversion history",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <span className="w-4 h-4 bg-[#14B8A6]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="w-1.5 h-1.5 bg-[#14B8A6] rounded-full" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className="block text-center py-3 bg-[#0A0A0A] dark:bg-[#FAFAF7] text-[#FAFAF7] dark:text-[#0A0A0A] rounded-xl font-medium text-sm hover:bg-[#1a1a1a] dark:hover:bg-[#E5E5E0] transition-colors"
            >
              Start Converting
            </Link>
          </div>

          {/* Pro - Coming Soon */}
          <div className="bg-[#0A0A0A] dark:bg-[#FAFAF7] text-[#FAFAF7] dark:text-[#0A0A0A] border border-[#1a1a1a] dark:border-[#2a2a2a] rounded-2xl p-8 relative">
            <span className="absolute top-4 right-4 text-[10px] font-mono bg-[#F59E0B] text-[#0A0A0A] px-2 py-0.5 rounded-full font-medium">
              Coming Soon
            </span>
            <h3 className="font-display font-semibold text-xl mb-2">Pro</h3>
            <p className="text-3xl font-display font-bold mb-1">$9.99</p>
            <p className="text-[#9CA3AF] dark:text-[#6B7280] text-sm mb-6">
              per month or $79.99/year
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Files up to 2 GB",
                "Unlimited conversions",
                "Batch convert up to 50 files",
                "Priority processing",
                "API access",
                "Persistent conversion history",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <span className="w-4 h-4 bg-[#F59E0B]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              disabled
              className="block w-full text-center py-3 bg-[#F59E0B]/50 text-[#0A0A0A] rounded-xl font-medium text-sm cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
