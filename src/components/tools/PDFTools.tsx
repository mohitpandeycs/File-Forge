"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Merge,
  Split,
  Minimize,
  FileType,
} from "lucide-react";
import {
  mergePDFs,
  splitPDF,
  compressPDF,
  extractTextFromPDF,
} from "@/lib/converter";
import { appendFileForgeSuffix, formatFileSize } from "@/lib/utils";
import SectionHeading from "@/components/shared/SectionHeading";

type PDFTool = "merge" | "split" | "compress" | "extract";

export default function PDFToolsPage() {
  const [activeTool, setActiveTool] = useState<PDFTool>("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    blob?: Blob;
    error?: string;
    message?: string;
  } | null>(null);
  const [pageRanges, setPageRanges] = useState("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const pdfFiles = acceptedFiles.filter(
        (f) =>
          f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"),
      );
      if (activeTool === "merge") {
        setFiles((prev) => [...prev, ...pdfFiles]);
      } else if (pdfFiles.length > 0) {
        setFiles([pdfFiles[0]]);
      }
    },
    [activeTool],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: activeTool === "merge",
  });

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResult(null);

    try {
      if (activeTool === "merge") {
        if (files.length < 2) {
          setResult({
            success: false,
            error: "Please add at least 2 PDF files to merge",
          });
          setIsProcessing(false);
          return;
        }
        const res = await mergePDFs(files);
        setResult({
          success: res.success,
          blob: res.blob,
          error: res.error,
          message: res.success
            ? `Merged ${files.length} files into ${res.pageCount} pages`
            : undefined,
        });
      } else if (activeTool === "split") {
        const res = await splitPDF(files[0], pageRanges || "1");
        setResult({
          success: res.success,
          error: res.error,
          message: res.success
            ? `Split into ${res.blobs?.length || 0} file(s)`
            : undefined,
        });
        if (res.success && res.blobs && res.blobs.length === 1) {
          setResult((prev) => (prev ? { ...prev, blob: res.blobs![0] } : null));
        } else if (res.success && res.blobs && res.blobs.length > 1) {
          const { createZipFromBlobs } = await import("@/lib/converter");
          const zip = await createZipFromBlobs(
            res.blobs.map((b, i) => ({
              name: appendFileForgeSuffix(`page-${i + 1}.pdf`),
              blob: b,
            })),
          );
          setResult((prev) =>
            prev
              ? { ...prev, blob: zip }
              : {
                  success: true,
                  blob: zip,
                  message: `Split into ${res.blobs!.length} files (downloaded as ZIP)`,
                },
          );
        }
      } else if (activeTool === "compress") {
        const res = await compressPDF(files[0]);
        setResult({
          success: res.success,
          blob: res.blob,
          error: res.error,
          message: res.success
            ? `Compressed: ${formatFileSize(files[0].size)} → ${formatFileSize(res.convertedSize || 0)}`
            : undefined,
        });
      } else if (activeTool === "extract") {
        const res = await extractTextFromPDF(files[0]);
        setResult({
          success: res.success,
          blob: res.blob,
          error: res.error,
          message: res.success ? "Page info extracted" : undefined,
        });
      }
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }

    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (!result?.blob) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    const downloadName =
      activeTool === "merge"
        ? "merged.pdf"
        : activeTool === "compress"
          ? "compressed.pdf"
          : activeTool === "split"
            ? "split-pages.zip"
            : "extracted.txt";
    a.download = appendFileForgeSuffix(downloadName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setPageRanges("");
  };

  const tools: {
    id: PDFTool;
    label: string;
    icon: React.ElementType;
    desc: string;
  }[] = [
    {
      id: "merge",
      icon: Merge,
      label: "Merge PDFs",
      desc: "Combine multiple PDFs into one",
    },
    {
      id: "split",
      icon: Split,
      label: "Split PDF",
      desc: "Extract pages or split into files",
    },
    {
      id: "compress",
      icon: Minimize,
      label: "Compress PDF",
      desc: "Reduce file size",
    },
    {
      id: "extract",
      icon: FileType,
      label: "Extract Info",
      desc: "Get page details",
    },
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="PDF Tools"
          title="Merge, split & compress PDFs"
          subtitle="All processing happens in your browser. Your files never leave your device."
        />

        {/* Tool tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(tool.id);
                setFiles([]);
                setResult(null);
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeTool === tool.id
                  ? "bg-[#F59E0B]/10 border-[#F59E0B]/30 shadow-[0_4px_16px_rgba(245,158,11,0.08)]"
                  : "bg-white dark:bg-[#1a1a1a] border-[#E5E5E0] dark:border-[#2a2a2a] hover:border-[#F59E0B]/20"
              }`}
            >
              <tool.icon
                className={`w-5 h-5 mb-2 ${activeTool === tool.id ? "text-[#F59E0B]" : "text-[#6B7280]"}`}
              />
              <p className="font-medium text-sm">{tool.label}</p>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                {tool.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Drop zone */}
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
          <p className="text-sm font-medium mb-1">Drop PDF files here</p>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            {activeTool === "merge"
              ? "Add multiple PDFs to merge"
              : "Select a single PDF"}
          </p>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#E5E5E0] dark:border-[#2a2a2a] p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium">
                {files.length} file(s) added
              </p>
              <button
                onClick={handleReset}
                className="text-xs text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#F59E0B] transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-2 px-3 bg-[#F0F0EB] dark:bg-[#2a2a2a] rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span className="truncate max-w-[200px]">{f.name}</span>
                  </div>
                  <span className="text-[#6B7280] dark:text-[#9CA3AF] font-mono flex-shrink-0">
                    {formatFileSize(f.size)}
                  </span>
                </div>
              ))}
            </div>

            {activeTool === "split" && (
              <div className="mt-4">
                <label className="text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wide mb-2 block">
                  Page ranges (e.g. 1-3, 5, 8-10)
                </label>
                <input
                  type="text"
                  value={pageRanges}
                  onChange={(e) => setPageRanges(e.target.value)}
                  placeholder="1-3, 5, 8-10"
                  className="w-full px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-[#E5E5E0] dark:border-[#2a2a2a] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30"
                />
              </div>
            )}

            <motion.button
              onClick={handleProcess}
              disabled={
                isProcessing ||
                files.length === 0 ||
                (activeTool === "merge" && files.length < 2)
              }
              whileHover={{ y: -2 }}
              className={`w-full mt-4 py-3 rounded-xl font-medium text-sm transition-all ${
                !isProcessing &&
                files.length > 0 &&
                (activeTool !== "merge" || files.length >= 2)
                  ? "bg-[#F59E0B] text-[#0A0A0A] hover:bg-[#D97706] shadow-[0_4px_16px_rgba(245,158,11,0.3)]"
                  : "bg-[#E5E5E0] dark:bg-[#2a2a2a] text-[#9CA3AF] cursor-not-allowed"
              }`}
            >
              {isProcessing
                ? "Processing..."
                : tools.find((t) => t.id === activeTool)?.label}
            </motion.button>
          </div>
        )}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#E5E5E0] dark:border-[#2a2a2a] p-6"
          >
            {result.success ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#14B8A6]/10 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[#14B8A6]" />
                  </div>
                  <div>
                    <p className="font-medium">Done!</p>
                    {result.message && (
                      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                        {result.message}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 bg-[#F59E0B] text-[#0A0A0A] rounded-xl font-medium text-sm hover:bg-[#D97706] transition-colors flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(245,158,11,0.3)]"
                >
                  <Download className="w-4 h-4" />
                  Download Result
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="font-medium">Failed</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                    {result.error}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={handleReset}
              className="w-full mt-3 py-2.5 bg-[#F0F0EB] dark:bg-[#2a2a2a] text-[#6B7280] dark:text-[#9CA3AF] rounded-xl font-medium text-sm hover:bg-[#E5E5E0] dark:hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
