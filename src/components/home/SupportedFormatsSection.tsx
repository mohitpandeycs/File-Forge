"use client";

import { motion } from "framer-motion";
import {
  formatPairs,
  categories,
  supportedFormats,
} from "@/constants/formatPairs";
import SectionHeading from "@/components/shared/SectionHeading";
import { useState } from "react";
import { FileText, Presentation, Table, Image } from "lucide-react";

const categoryIconMap: Record<string, React.ElementType> = {
  documents: FileText,
  presentations: Presentation,
  spreadsheets: Table,
  images: Image,
};

export default function SupportedFormatsSection() {
  const [activeCategory, setActiveCategory] = useState("images");

  const filteredPairs = formatPairs.filter(
    (fp) => fp.category === activeCategory,
  );

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Supported Formats"
          title={`${supportedFormats.length} formats, ${formatPairs.length} conversion pairs`}
          subtitle="From common documents to specialized image formats, focused on reliable browser-side conversion."
        />

        {/* Category tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const Icon = categoryIconMap[cat.id] || FileText;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#F59E0B] text-[#0A0A0A] shadow-[0_2px_8px_rgba(245,158,11,0.3)]"
                    : "bg-[#F0F0EB] dark:bg-[#2a2a2a] text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#E5E5E0] dark:hover:bg-[#333]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Format pairs grid */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        >
          {filteredPairs.map((pair, index) => (
            <motion.a
              key={pair.id}
              href={`/convert/${pair.from.toLowerCase()}-to-${pair.to.toLowerCase()}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ y: -2 }}
              className="group flex items-center justify-between bg-white dark:bg-[#1a1a1a] border border-[#E5E5E0] dark:border-[#2a2a2a] rounded-xl px-4 py-3 hover:border-[#F59E0B]/30 hover:shadow-[0_4px_16px_rgba(245,158,11,0.06)] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-medium">
                  {pair.from}
                </span>
                <span className="text-[#6B7280] dark:text-[#9CA3AF]">
                  &rarr;
                </span>
                <span className="font-mono text-sm font-medium">{pair.to}</span>
              </div>
              {pair.popular && (
                <span className="text-[10px] font-mono bg-[#F59E0B]/10 text-[#D97706] px-2 py-0.5 rounded-full">
                  Popular
                </span>
              )}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
