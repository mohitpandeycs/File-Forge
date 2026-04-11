"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Trash2, Clock, FileText, LogIn } from "lucide-react";
import Link from "next/link";
import { useConversionStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { formatFileSize } from "@/lib/utils";
import SectionHeading from "@/components/shared/SectionHeading";

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const { history, clearHistory, loadHistory } = useConversionStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <LogIn className="w-12 h-12 text-[#E5E5E0] dark:text-[#2a2a2a] mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold mb-2">
              Sign in to view history
            </h2>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-6 text-sm">
              Your conversion history is saved when you sign in.
            </p>
            <Link
              href="/auth/login?redirect=/history"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] dark:bg-[#FAFAF7] text-[#FAFAF7] dark:text-[#0A0A0A] text-sm font-medium rounded-lg hover:bg-[#1a1a1a] dark:hover:bg-[#E5E5E0] transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="History"
          title="Recent conversions"
          subtitle="Your synced conversion history."
        />

        {history.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="w-12 h-12 text-[#E5E5E0] dark:text-[#2a2a2a] mx-auto mb-4" />
            <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-4">
              No conversions yet.
            </p>
            <Link href="/" className="text-[#F59E0B] hover:underline text-sm">
              Start converting &rarr;
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                {history.length} conversion(s)
              </p>
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#9CA3AF] hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear history
              </button>
            </div>

            <div className="space-y-3">
              {history.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-[#1a1a1a] border border-[#E5E5E0] dark:border-[#2a2a2a] rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-[#F59E0B]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px]">
                        {item.fileName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#9CA3AF] font-mono">
                        <span>{item.fromFormat}</span>
                        <span>&rarr;</span>
                        <span>{item.toFormat}</span>
                        <span className="text-[#E5E5E0] dark:text-[#2a2a2a]">
                          &middot;
                        </span>
                        <span>{formatFileSize(item.fileSize)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                      {formatTimestamp(item.timestamp)}
                    </span>
                    <Link
                      href={`/convert/${item.fromFormat.toLowerCase()}-to-${item.toFormat.toLowerCase()}`}
                      className="p-2 hover:bg-[#F0F0EB] dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                      title="Convert again"
                    >
                      <RotateCcw className="w-4 h-4 text-[#6B7280] dark:text-[#9CA3AF]" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
