"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Code,
} from "lucide-react";
import { fileToBase64, base64ToFile } from "@/lib/converter";
import { appendFileForgeSuffix, formatFileSize } from "@/lib/utils";
import SectionHeading from "@/components/shared/SectionHeading";

export default function Base64ToolPage() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [file, setFile] = useState<File | null>(null);
  const [base64Text, setBase64Text] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEncode = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    const res = await fileToBase64(file);
    if (res.success && res.blob) {
      const text = await res.blob.text();
      setOutput(text);
    } else {
      setError(res.error || "Encoding failed");
    }
    setIsProcessing(false);
  };

  const handleDecode = () => {
    if (!base64Text.trim()) return;
    setError(null);
    const res = base64ToFile(
      base64Text,
      "decoded-file.bin",
      "application/octet-stream",
    );
    if (res.success && res.blob) {
      const url = URL.createObjectURL(res.blob);
      setOutput(url);
    } else {
      setError(res.error || "Invalid Base64 string");
    }
  };

  const handleCopy = async () => {
    if (output && !output.startsWith("blob:")) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadDecoded = () => {
    if (output && output.startsWith("blob:")) {
      const a = document.createElement("a");
      a.href = output;
      a.download = appendFileForgeSuffix("decoded-file");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleReset = () => {
    setFile(null);
    setBase64Text("");
    setOutput(null);
    setError(null);
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Base64 Tool"
          title="Encode & decode Base64"
          subtitle="Convert files to Base64 strings or decode Base64 back to files."
        />

        {/* Mode toggle */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            onClick={() => {
              setMode("encode");
              handleReset();
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === "encode"
                ? "bg-[#F59E0B] text-[#0A0A0A] shadow-[0_2px_8px_rgba(245,158,11,0.3)]"
                : "bg-white dark:bg-[#1a1a1a] border border-[#E5E5E0] dark:border-[#2a2a2a] text-[#6B7280] dark:text-[#9CA3AF]"
            }`}
          >
            <Upload className="w-4 h-4" />
            Encode to Base64
          </button>
          <button
            onClick={() => {
              setMode("decode");
              handleReset();
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === "decode"
                ? "bg-[#F59E0B] text-[#0A0A0A] shadow-[0_2px_8px_rgba(245,158,11,0.3)]"
                : "bg-white dark:bg-[#1a1a1a] border border-[#E5E5E0] dark:border-[#2a2a2a] text-[#6B7280] dark:text-[#9CA3AF]"
            }`}
          >
            <Code className="w-4 h-4" />
            Decode from Base64
          </button>
        </div>

        {mode === "encode" ? (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#E5E5E0] dark:border-[#2a2a2a] p-6">
            <div
              className="border-2 border-dashed border-[#E5E5E0] dark:border-[#2a2a2a] rounded-xl p-8 text-center cursor-pointer hover:border-[#F59E0B]/50 transition-all mb-4"
              onClick={() => document.getElementById("b64-file-input")?.click()}
            >
              <input
                id="b64-file-input"
                type="file"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && setFile(e.target.files[0])
                }
              />
              <Upload className="w-8 h-8 text-[#F59E0B] mx-auto mb-3" />
              <p className="text-sm font-medium">
                {file ? file.name : "Click or drop a file"}
              </p>
              {file && (
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-mono mt-1">
                  {formatFileSize(file.size)}
                </p>
              )}
            </div>

            <motion.button
              onClick={handleEncode}
              disabled={!file || isProcessing}
              whileHover={{ y: -2 }}
              className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
                file && !isProcessing
                  ? "bg-[#F59E0B] text-[#0A0A0A] hover:bg-[#D97706] shadow-[0_4px_16px_rgba(245,158,11,0.3)]"
                  : "bg-[#E5E5E0] dark:bg-[#2a2a2a] text-[#9CA3AF] cursor-not-allowed"
              }`}
            >
              {isProcessing ? "Encoding..." : "Encode to Base64"}
            </motion.button>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#E5E5E0] dark:border-[#2a2a2a] p-6">
            <textarea
              value={base64Text}
              onChange={(e) => setBase64Text(e.target.value)}
              placeholder="Paste Base64 string here..."
              rows={6}
              className="w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-[#E5E5E0] dark:border-[#2a2a2a] rounded-xl text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30 focus:border-[#F59E0B]/50"
            />
            <motion.button
              onClick={handleDecode}
              disabled={!base64Text.trim()}
              whileHover={{ y: -2 }}
              className={`w-full mt-4 py-3 rounded-xl font-medium text-sm transition-all ${
                base64Text.trim()
                  ? "bg-[#F59E0B] text-[#0A0A0A] hover:bg-[#D97706] shadow-[0_4px_16px_rgba(245,158,11,0.3)]"
                  : "bg-[#E5E5E0] dark:bg-[#2a2a2a] text-[#9CA3AF] cursor-not-allowed"
              }`}
            >
              Decode Base64
            </motion.button>
          </div>
        )}

        {output && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#E5E5E0] dark:border-[#2a2a2a] p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#14B8A6]/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <p className="font-medium">
                {mode === "encode"
                  ? "Encoded successfully"
                  : "Decoded successfully"}
              </p>
            </div>

            {mode === "encode" && output && !output.startsWith("blob:") ? (
              <>
                <div className="bg-[#F0F0EB] dark:bg-[#2a2a2a] rounded-lg p-4 max-h-48 overflow-y-auto">
                  <pre className="text-xs font-mono break-all whitespace-pre-wrap">
                    {output.slice(0, 2000)}
                    {output.length > 2000 ? "..." : ""}
                  </pre>
                </div>
                <button
                  onClick={handleCopy}
                  className="mt-3 w-full py-2.5 bg-[#F59E0B] text-[#0A0A0A] rounded-xl font-medium text-sm hover:bg-[#D97706] transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </button>
              </>
            ) : mode === "decode" && output && output.startsWith("blob:") ? (
              <button
                onClick={handleDownloadDecoded}
                className="w-full py-3 bg-[#F59E0B] text-[#0A0A0A] rounded-xl font-medium text-sm hover:bg-[#D97706] transition-colors flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(245,158,11,0.3)]"
              >
                <Download className="w-4 h-4" />
                Download Decoded File
              </button>
            ) : null}

            <button
              onClick={handleReset}
              className="w-full mt-3 py-2.5 bg-[#F0F0EB] dark:bg-[#2a2a2a] text-[#6B7280] dark:text-[#9CA3AF] rounded-xl font-medium text-sm hover:bg-[#E5E5E0] dark:hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </button>
          </motion.div>
        )}

        {error && (
          <div className="mt-6 bg-white dark:bg-[#1a1a1a] rounded-xl border border-red-200 dark:border-red-900/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-medium">Error</p>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
