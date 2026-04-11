"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import {
  Upload,
  Download,
  CheckCircle2,
  RotateCcw,
  Image as ImageIcon,
} from "lucide-react";
import { compressImage } from "@/lib/converter";
import { appendFileForgeSuffix, formatFileSize } from "@/lib/utils";
import SectionHeading from "@/components/shared/SectionHeading";

export default function ImageCompressPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(60);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<
    { name: string; original: number; compressed: number; blob: Blob }[]
  >([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const images = acceptedFiles.filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...images]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff", ".heic"],
    },
    multiple: true,
  });

  const handleCompress = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResults([]);

    const newResults: {
      name: string;
      original: number;
      compressed: number;
      blob: Blob;
    }[] = [];

    for (const file of files) {
      const res = await compressImage(file, quality / 100, maxWidth, maxWidth);
      if (res.success && res.blob) {
        newResults.push({
          name: file.name,
          original: file.size,
          compressed: res.convertedSize || res.blob.size,
          blob: res.blob,
        });
      }
    }

    setResults(newResults);
    setIsProcessing(false);
  };

  const handleDownloadAll = async () => {
    if (results.length === 0) return;
    const { createZipFromBlobs } = await import("@/lib/converter");
    const zip = await createZipFromBlobs(
      results.map((r) => ({
        name: appendFileForgeSuffix(r.name),
        blob: r.blob,
      })),
    );
    const url = URL.createObjectURL(zip);
    const a = document.createElement("a");
    a.href = url;
    a.download = appendFileForgeSuffix("compressed-images.zip");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
  };

  const totalSaved = results.reduce(
    (sum, r) => sum + (r.original - r.compressed),
    0,
  );
  const totalOriginal = results.reduce((sum, r) => sum + r.original, 0);

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Image Compressor"
          title="Compress images without losing quality"
          subtitle="Reduce file sizes for JPG, PNG, and WEBP. All processing happens in your browser."
        />

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 ${
            isDragActive
              ? "border-[#F59E0B] bg-[#F59E0B]/5"
              : "border-[#E5E5E0] dark:border-[#2a2a2a] hover:border-[#F59E0B]/50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 text-[#F59E0B] mx-auto mb-3" />
          <p className="text-sm font-medium mb-1">Drop images here</p>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            JPG, PNG, WEBP, BMP, TIFF, HEIC — up to 20 files
          </p>
        </div>

        {files.length > 0 && (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#E5E5E0] dark:border-[#2a2a2a] p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium">
                {files.length} image(s) selected
              </p>
              <button
                onClick={handleReset}
                className="text-xs text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#F59E0B] transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div>
                <label className="text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wide mb-2 block">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-[#F59E0B]"
                />
                <div className="flex justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF] font-mono mt-1">
                  <span>Smaller</span>
                  <span>Better quality</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wide mb-2 block">
                  Max width: {maxWidth}px
                </label>
                <input
                  type="range"
                  min="320"
                  max="3840"
                  step="160"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                  className="w-full accent-[#F59E0B]"
                />
                <div className="flex justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF] font-mono mt-1">
                  <span>320px</span>
                  <span>3840px</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6 max-h-40 overflow-y-auto">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-2 px-3 bg-[#F0F0EB] dark:bg-[#2a2a2a] rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span className="truncate max-w-[200px]">{f.name}</span>
                  </div>
                  <span className="text-[#6B7280] dark:text-[#9CA3AF] font-mono">
                    {formatFileSize(f.size)}
                  </span>
                </div>
              ))}
            </div>

            <motion.button
              onClick={handleCompress}
              disabled={isProcessing}
              whileHover={{ y: -2 }}
              className="w-full py-3.5 bg-[#F59E0B] text-[#0A0A0A] rounded-xl font-medium text-sm hover:bg-[#D97706] transition-colors shadow-[0_4px_16px_rgba(245,158,11,0.3)]"
            >
              {isProcessing
                ? "Compressing..."
                : `Compress ${files.length} image(s)`}
            </motion.button>
          </div>
        )}

        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#E5E5E0] dark:border-[#2a2a2a] p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#14B8A6]/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <div>
                <p className="font-medium">
                  {results.length} image(s) compressed
                </p>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-mono">
                  Saved {formatFileSize(totalSaved)} (
                  {totalOriginal > 0
                    ? Math.round((totalSaved / totalOriginal) * 100)
                    : 0}
                  % reduction)
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-2 px-3 bg-[#F0F0EB] dark:bg-[#2a2a2a] rounded-lg"
                >
                  <span className="truncate max-w-[200px]">{r.name}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[#6B7280] dark:text-[#9CA3AF] line-through">
                      {formatFileSize(r.original)}
                    </span>
                    <span className="text-[#14B8A6] font-medium">
                      {formatFileSize(r.compressed)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleDownloadAll}
              className="w-full py-3 bg-[#F59E0B] text-[#0A0A0A] rounded-xl font-medium text-sm hover:bg-[#D97706] transition-colors flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(245,158,11,0.3)]"
            >
              <Download className="w-4 h-4" />
              Download All as ZIP
            </button>
            <button
              onClick={handleReset}
              className="w-full mt-3 py-2.5 bg-[#F0F0EB] dark:bg-[#2a2a2a] text-[#6B7280] dark:text-[#9CA3AF] rounded-xl font-medium text-sm hover:bg-[#E5E5E0] dark:hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Compress More Images
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
