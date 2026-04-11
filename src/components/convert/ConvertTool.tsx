"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Presentation,
  Table,
} from "lucide-react";
import Link from "next/link";
import DropZone from "@/components/shared/DropZone";
import { formatPairs } from "@/constants/formatPairs";

const categoryIconMap: Record<string, React.ElementType> = {
  documents: FileText,
  presentations: Presentation,
  spreadsheets: Table,
  images: ImageIcon,
};

export default function ConvertToolPage() {
  const params = useParams();
  const tool = params.tool as string;
  const { fromFormat, toFormat, toolData } = useMemo(() => {
    if (!tool) {
      return {
        fromFormat: "",
        toFormat: "",
        toolData: null as (typeof formatPairs)[number] | null,
      };
    }

    const parts = tool.split("-to-");
    if (parts.length !== 2) {
      return {
        fromFormat: "",
        toFormat: "",
        toolData: null as (typeof formatPairs)[number] | null,
      };
    }

    const from = parts[0].toUpperCase();
    const to = parts[1].toUpperCase();
    const found =
      formatPairs.find((fp) => fp.from === from && fp.to === to) || null;

    return {
      fromFormat: from,
      toFormat: to,
      toolData: found,
    };
  }, [tool]);

  if (!toolData) {
    return (
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-3xl font-semibold mb-4">
            Tool Not Found
          </h1>
          <p className="text-[#6B7280] dark:text-[#B0B7C3] mb-6">
            This conversion pair is not available yet.
          </p>
          <Link
            href="/tools"
            className="text-[#F59E0B] hover:underline text-sm"
          >
            &larr; Browse all tools
          </Link>
        </div>
      </section>
    );
  }

  const category = toolData.category;
  const CategoryIcon = categoryIconMap[category] || FileText;
  const relatedTools = formatPairs
    .filter((fp) => fp.category === category && fp.id !== toolData.id)
    .slice(0, 6);

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-[#6B7280] dark:text-[#B0B7C3] hover:text-[#F59E0B] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          All tools
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B] text-xs font-mono font-medium rounded-full mb-4">
            <CategoryIcon className="w-3.5 h-3.5" />
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
            {toolData.label}
          </h1>
          <p className="text-[#6B7280] dark:text-[#B0B7C3] text-lg max-w-xl mx-auto">
            Convert your {fromFormat} files to {toFormat} format instantly.
            Free, fast, and private.
          </p>
        </div>

        {/* Converter */}
        <DropZone />

        {/* Related conversions */}
        {relatedTools.length > 0 && (
          <div className="mt-16">
            <h3 className="font-display font-semibold text-lg mb-4 text-center">
              Related conversions
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {relatedTools.map((rt) => (
                <Link
                  key={rt.id}
                  href={`/convert/${rt.from.toLowerCase()}-to-${rt.to.toLowerCase()}`}
                  className="text-xs font-mono text-[#6B7280] dark:text-[#B0B7C3] hover:text-[#F59E0B] transition-colors bg-white dark:bg-[#171717] border border-[#E5E5E0] dark:border-[#2a2a2a] hover:border-[#F59E0B]/30 px-3 py-1.5 rounded-full"
                >
                  {rt.from} &rarr; {rt.to}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
