"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, Presentation, Table, Image } from "lucide-react";
import { formatPairs, categories } from "@/constants/formatPairs";
import SectionHeading from "@/components/shared/SectionHeading";

const categoryIconMap: Record<string, React.ElementType> = {
  documents: FileText,
  presentations: Presentation,
  spreadsheets: Table,
  images: Image,
};

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filteredPairs = formatPairs.filter((fp) => {
    const matchesCategory =
      activeCategory === "all" || fp.category === activeCategory;
    const matchesSearch =
      search === "" ||
      fp.label.toLowerCase().includes(search.toLowerCase()) ||
      fp.from.toLowerCase().includes(search.toLowerCase()) ||
      fp.to.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="All Tools"
          title="Every conversion tool"
          subtitle="Browse by category or search for your specific format pair."
        />

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search formats (e.g. 'jpg to png')"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#141414] border border-[#E5E5E0] dark:border-[#2a2a2a] rounded-xl text-sm text-[#0A0A0A] dark:text-[#E5E7EB] placeholder:text-[#9CA3AF] dark:placeholder:text-[#8B93A1] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30 focus:border-[#F59E0B]/50 transition-all"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === "all"
                ? "bg-[#F59E0B] text-[#0A0A0A] shadow-[0_2px_8px_rgba(245,158,11,0.3)]"
                : "bg-[#F0F0EB] dark:bg-[#1f1f1f] text-[#6B7280] dark:text-[#B0B7C3] hover:bg-[#E5E5E0] dark:hover:bg-[#2a2a2a]"
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const Icon = categoryIconMap[cat.id] || FileText;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#F59E0B] text-[#0A0A0A] shadow-[0_2px_8px_rgba(245,158,11,0.3)]"
                    : "bg-[#F0F0EB] dark:bg-[#1f1f1f] text-[#6B7280] dark:text-[#B0B7C3] hover:bg-[#E5E5E0] dark:hover:bg-[#2a2a2a]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Tools grid */}
        <motion.div
          key={`${activeCategory}-${search}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        >
          {filteredPairs.map((pair, index) => (
            <motion.a
              key={pair.id}
              href={`/convert/${pair.from.toLowerCase()}-to-${pair.to.toLowerCase()}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ y: -2 }}
              className="group flex items-center justify-between bg-white dark:bg-[#171717] border border-[#E5E5E0] dark:border-[#2a2a2a] rounded-xl px-4 py-3.5 hover:border-[#F59E0B]/30 hover:dark:bg-[#1d1d1d] hover:shadow-[0_4px_16px_rgba(245,158,11,0.06)] transition-all"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-medium">
                    {pair.from}
                  </span>
                  <span className="text-[#6B7280] dark:text-[#B0B7C3] text-xs">
                    &rarr;
                  </span>
                  <span className="font-mono text-sm font-medium">
                    {pair.to}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] dark:text-[#B0B7C3]">
                  {pair.label}
                </p>
              </div>
              {pair.popular && (
                <span className="text-[10px] font-mono bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B] px-2 py-0.5 rounded-full flex-shrink-0">
                  Popular
                </span>
              )}
            </motion.a>
          ))}
        </motion.div>

        {filteredPairs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#6B7280] dark:text-[#B0B7C3] text-sm">
              No conversion tools match your search.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
              className="mt-3 text-sm text-[#F59E0B] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
