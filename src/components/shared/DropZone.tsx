"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  RotateCcw,
  Settings,
  Image as ImageIcon,
  FileStack,
  Archive,
} from "lucide-react";
import { useConversionStore } from "@/lib/store";
import { appendFileForgeSuffix, formatFileSize } from "@/lib/utils";
import {
  detectFormatFromExtension,
  getCompatibleTargets,
  formatPairs,
} from "@/constants/formatPairs";
import {
  convertFile,
  batchConvertImages,
  createZipFromBlobs,
} from "@/lib/converter";

const IMAGE_SOURCE_FORMATS = [
  "JPG",
  "PNG",
  "WEBP",
  "BMP",
  "AVIF",
  "ICO",
  "SVG",
  "TIFF",
  "HEIC",
  "HEIF",
  "GIF",
];
const BATCH_TARGET_FORMATS = ["JPG", "PNG", "WEBP"];

export default function DropZone() {
  const {
    file,
    setFile,
    targetFormat,
    setTargetFormat,
    isConverting,
    setIsConverting,
    progress,
    setProgress,
    result,
    setResult,
    quality,
    setQuality,
    addToHistory,
    batchFiles,
    setBatchFiles,
    isBatchMode,
    setIsBatchMode,
  } = useConversionStore();
  const [showSettings, setShowSettings] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      if (acceptedFiles.length > 1) {
        setIsBatchMode(true);
        setBatchFiles(acceptedFiles);
        setFile(null);
      } else {
        setIsBatchMode(false);
        setBatchFiles([]);
        setFile(acceptedFiles[0]);
      }
    },
    [setFile, setBatchFiles, setIsBatchMode],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 50 * 1024 * 1024,
    multiple: true,
    noClick: !!file || (isBatchMode && batchFiles.length > 0),
  });

  const detectedFormat = file
    ? detectFormatFromExtension(file.name.split(".").pop() || "")
    : null;
  const compatibleTargets = detectedFormat
    ? getCompatibleTargets(detectedFormat)
    : [];
  const isImageFormat = detectedFormat
    ? IMAGE_SOURCE_FORMATS.includes(detectedFormat)
    : false;
  const isDataFormat = detectedFormat
    ? ["CSV", "JSON", "XML"].includes(detectedFormat)
    : false;

  const handleConvert = async () => {
    if (isBatchMode && batchFiles.length > 0) {
      await handleBatchConvert();
      return;
    }
    if (!file || !targetFormat) return;

    setIsConverting(true);
    setProgress(0);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress = Math.min(currentProgress + Math.random() * 20, 90);
      setProgress(currentProgress);
    }, 150);

    try {
      const conversionResult = await convertFile(
        file,
        targetFormat,
        isImageFormat ? { quality } : undefined,
      );

      setResult({
        success: conversionResult.success,
        blob: conversionResult.blob || null,
        error: conversionResult.error || null,
        convertedSize: conversionResult.convertedSize || null,
      });

      if (conversionResult.success) {
        addToHistory({
          id: Date.now().toString(),
          fileName: file.name,
          fromFormat: detectedFormat || "UNKNOWN",
          toFormat: targetFormat,
          fileSize: file.size,
          convertedSize: conversionResult.convertedSize || null,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      setResult({
        success: false,
        blob: null,
        error:
          err instanceof Error ? err.message : "Conversion failed unexpectedly",
        convertedSize: null,
      });
    } finally {
      clearInterval(interval);
      setProgress(100);
      setIsConverting(false);
    }
  };

  const handleBatchConvert = async () => {
    if (!targetFormat || batchFiles.length === 0) return;

    if (!BATCH_TARGET_FORMATS.includes(targetFormat)) {
      setResult({
        success: false,
        blob: null,
        error: `Batch conversion currently supports ${BATCH_TARGET_FORMATS.join(", ")} outputs only.`,
        convertedSize: null,
      });
      return;
    }

    const unsupportedFiles = batchFiles.filter((batchFile) => {
      const format = detectFormatFromExtension(
        batchFile.name.split(".").pop() || "",
      );
      return !format || !IMAGE_SOURCE_FORMATS.includes(format);
    });

    if (unsupportedFiles.length > 0) {
      setResult({
        success: false,
        blob: null,
        error:
          "Batch mode supports image files only. Please remove unsupported files and try again.",
        convertedSize: null,
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);

    const results = await batchConvertImages(batchFiles, targetFormat, quality);
    const successful = results.filter((r) => r.result.success);
    const failed = results.filter((r) => !r.result.success);

    setProgress(100);

    if (successful.length > 0) {
      const zip = await createZipFromBlobs(
        successful.map((r) => ({
          name: appendFileForgeSuffix(
            `${r.fileName.replace(/\.[^.]+$/, "")}.${targetFormat.toLowerCase()}`,
          ),
          blob: r.result.blob!,
        })),
      );

      setResult({
        success: true,
        blob: zip,
        error: failed.length > 0 ? `${failed.length} file(s) failed` : null,
        convertedSize: zip.size,
      });

      addToHistory({
        id: Date.now().toString(),
        fileName: `${batchFiles.length} files`,
        fromFormat:
          detectFormatFromExtension(
            batchFiles[0].name.split(".").pop() || "",
          ) || "UNKNOWN",
        toFormat: targetFormat,
        fileSize: batchFiles.reduce((sum, f) => sum + f.size, 0),
        convertedSize: zip.size,
        timestamp: Date.now(),
      });
    } else {
      setResult({
        success: false,
        blob: null,
        error: "All conversions failed",
        convertedSize: null,
      });
    }
    setIsConverting(false);
  };

  const handleDownload = () => {
    if (!result?.blob) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;

    if (isBatchMode) {
      a.download = appendFileForgeSuffix(`fileforge-batch-${Date.now()}.zip`);
    } else if (file) {
      const ext = targetFormat?.toLowerCase() || "converted";
      const baseName = file.name.replace(/\.[^.]+$/, "");
      a.download = appendFileForgeSuffix(`${baseName}.${ext}`);
    } else {
      a.download = appendFileForgeSuffix(`converted-file-${Date.now()}`);
    }

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setBatchFiles([]);
    setTargetFormat(null);
    setResult(null);
    setProgress(0);
    setShowSettings(false);
    setIsBatchMode(false);
  };

  const FormatIcon =
    detectedFormat === "PDF" || detectedFormat === "DOCX"
      ? FileText
      : isDataFormat
        ? FileStack
        : ImageIcon;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {!file && !isBatchMode && !result ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl p-12 sm:p-16 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? "border-[#F59E0B] bg-[#F59E0B]/5 scale-[1.02]"
                  : "border-[#E5E5E0] dark:border-[#2a2a2a] hover:border-[#F59E0B]/50 hover:bg-[#F59E0B]/[0.02]"
              }`}
            >
              <input {...getInputProps()} />
              <motion.div
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                className="w-16 h-16 mx-auto mb-6 bg-[#F59E0B]/10 rounded-2xl flex items-center justify-center"
              >
                <Upload className="w-7 h-7 text-[#F59E0B]" />
              </motion.div>
              <h3 className="font-display text-xl font-semibold mb-2">
                {isDragActive ? "Drop your files here" : "Drop your file here"}
              </h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-4">
                or{" "}
                <span className="text-[#F59E0B] font-medium">browse files</span>{" "}
                from your device
              </p>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-mono">
                Max 50 MB per file &middot; Drop multiple for batch conversion
              </p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#F59E0B]/[0.03] to-transparent pointer-events-none" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {isBatchMode && batchFiles.length > 0 && !result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#E5E5E0] dark:border-[#2a2a2a] shadow-[0_8px_32px_rgba(245,158,11,0.06)] overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center">
                  <Archive className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {batchFiles.length} files selected
                  </p>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-mono">
                    {formatFileSize(
                      batchFiles.reduce((sum, f) => sum + f.size, 0),
                    )}{" "}
                    total
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="p-2 hover:bg-[#F0F0EB] dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                aria-label="Clear files"
              >
                <X className="w-4 h-4 text-[#6B7280] dark:text-[#9CA3AF]" />
              </button>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1 mb-4">
              {batchFiles.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-1.5 px-2 bg-[#F0F0EB] dark:bg-[#2a2a2a] rounded"
                >
                  <span className="truncate max-w-[200px]">{f.name}</span>
                  <span className="text-[#6B7280] dark:text-[#9CA3AF] font-mono flex-shrink-0 ml-2">
                    {formatFileSize(f.size)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wide mb-2 block">
                Convert all to
              </label>
              <div className="flex flex-wrap gap-2">
                {BATCH_TARGET_FORMATS.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setTargetFormat(fmt)}
                    className={`px-4 py-2 rounded-full text-sm font-mono font-medium transition-all ${
                      targetFormat === fmt
                        ? "bg-[#F59E0B] text-[#0A0A0A] shadow-[0_2px_8px_rgba(245,158,11,0.3)]"
                        : "bg-[#F0F0EB] dark:bg-[#2a2a2a] text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#E5E5E0] dark:hover:bg-[#333]"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              onClick={handleConvert}
              disabled={!targetFormat || isConverting}
              whileHover={targetFormat && !isConverting ? { y: -2 } : {}}
              whileTap={targetFormat && !isConverting ? { scale: 0.98 } : {}}
              className={`w-full py-3.5 rounded-xl font-medium text-sm transition-all ${
                targetFormat && !isConverting
                  ? "bg-[#F59E0B] text-[#0A0A0A] hover:bg-[#D97706] shadow-[0_4px_16px_rgba(245,158,11,0.3)]"
                  : "bg-[#E5E5E0] dark:bg-[#2a2a2a] text-[#9CA3AF] cursor-not-allowed"
              }`}
            >
              {isConverting
                ? `Converting ${batchFiles.length} files...`
                : `Convert ${batchFiles.length} files to ${targetFormat || "..."}`}
            </motion.button>
          </div>

          {isConverting && (
            <div className="px-6 pb-6">
              <div className="relative w-20 h-20 mx-auto">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#E5E5E0"
                    className="dark:stroke-[#2a2a2a]"
                    strokeWidth="4"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-mono font-medium">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {file && !result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#E5E5E0] dark:border-[#2a2a2a] shadow-[0_8px_32px_rgba(245,158,11,0.06)] overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center">
                  {<FormatIcon className="w-5 h-5 text-[#F59E0B]" />}
                </div>
                <div>
                  <p className="font-medium text-sm truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-mono">
                    {formatFileSize(file.size)} &middot;{" "}
                    {detectedFormat || "Unknown"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="p-2 hover:bg-[#F0F0EB] dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                aria-label="Remove file"
              >
                <X className="w-4 h-4 text-[#6B7280] dark:text-[#9CA3AF]" />
              </button>
            </div>

            <div className="mb-4">
              <label className="text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wide mb-2 block">
                Convert to
              </label>
              {compatibleTargets.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {compatibleTargets.map((format) => (
                    <button
                      key={format}
                      onClick={() => setTargetFormat(format)}
                      className={`px-4 py-2 rounded-full text-sm font-mono font-medium transition-all ${
                        targetFormat === format
                          ? "bg-[#F59E0B] text-[#0A0A0A] shadow-[0_2px_8px_rgba(245,158,11,0.3)]"
                          : "bg-[#F0F0EB] dark:bg-[#2a2a2a] text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#E5E5E0] dark:hover:bg-[#333]"
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-yellow-400/40 bg-yellow-50/80 dark:bg-yellow-900/20 px-3 py-2 text-xs text-yellow-700 dark:text-yellow-300">
                  This file type is detected but has no reliable conversion
                  targets in the current browser-only toolset.
                </div>
              )}
            </div>

            {isImageFormat && (
              <div className="mb-4">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#0A0A0A] dark:hover:text-[#FAFAF7] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Quality settings
                </button>
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-3"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono">Low</span>
                        <input
                          type="range"
                          min="0.3"
                          max="1"
                          step="0.05"
                          value={quality}
                          onChange={(e) =>
                            setQuality(parseFloat(e.target.value))
                          }
                          className="flex-1 accent-[#F59E0B]"
                        />
                        <span className="text-xs font-mono">Lossless</span>
                        <span className="text-xs font-mono text-[#F59E0B] w-10 text-right">
                          {Math.round(quality * 100)}%
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <motion.button
              onClick={handleConvert}
              disabled={!targetFormat || isConverting}
              whileHover={targetFormat && !isConverting ? { y: -2 } : {}}
              whileTap={targetFormat && !isConverting ? { scale: 0.98 } : {}}
              className={`w-full py-3.5 rounded-xl font-medium text-sm transition-all ${
                targetFormat && !isConverting
                  ? "bg-[#F59E0B] text-[#0A0A0A] hover:bg-[#D97706] shadow-[0_4px_16px_rgba(245,158,11,0.3)]"
                  : "bg-[#E5E5E0] dark:bg-[#2a2a2a] text-[#9CA3AF] cursor-not-allowed"
              }`}
            >
              {isConverting
                ? "Converting..."
                : `Convert to ${targetFormat || "..."}`}
            </motion.button>
          </div>

          {isConverting && (
            <div className="px-6 pb-6">
              <div className="relative w-20 h-20 mx-auto">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#E5E5E0"
                    className="dark:stroke-[#2a2a2a]"
                    strokeWidth="4"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-mono font-medium">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#E5E5E0] dark:border-[#2a2a2a] shadow-[0_8px_32px_rgba(245,158,11,0.06)] overflow-hidden"
        >
          <div className="p-6">
            {result.success ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#14B8A6]/10 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[#14B8A6]" />
                  </div>
                  <div>
                    <p className="font-medium">Conversion Complete</p>
                    {result.convertedSize && (
                      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-mono">
                        {formatFileSize(file?.size || 0)} &rarr;{" "}
                        {formatFileSize(result.convertedSize)}
                        {result.convertedSize < (file?.size || 0) && (
                          <span className="text-[#14B8A6] ml-1">
                            (
                            {Math.round(
                              (1 - result.convertedSize / (file?.size || 1)) *
                                100,
                            )}
                            % smaller)
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full py-3.5 bg-[#F59E0B] text-[#0A0A0A] rounded-xl font-medium text-sm hover:bg-[#D97706] transition-colors flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(245,158,11,0.3)]"
                >
                  <Download className="w-4 h-4" />
                  {isBatchMode
                    ? "Download ZIP"
                    : `Download ${targetFormat?.toUpperCase()}`}
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium">Conversion Failed</p>
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                      {result.error}
                    </p>
                  </div>
                </div>
              </>
            )}
            <button
              onClick={handleReset}
              className="w-full mt-3 py-3 bg-[#F0F0EB] dark:bg-[#2a2a2a] text-[#6B7280] dark:text-[#9CA3AF] rounded-xl font-medium text-sm hover:bg-[#E5E5E0] dark:hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Convert Another File
            </button>
          </div>
        </motion.div>
      )}

      {!file && !isBatchMode && !result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            Popular:
          </span>
          {formatPairs
            .filter((fp) => fp.popular)
            .slice(0, 6)
            .map((fp) => (
              <a
                key={fp.id}
                href={`/convert/${fp.from.toLowerCase()}-to-${fp.to.toLowerCase()}`}
                className="text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#F59E0B] transition-colors bg-[#F0F0EB] dark:bg-[#2a2a2a] hover:bg-[#F59E0B]/10 px-2.5 py-1 rounded-full"
              >
                {fp.from} &rarr; {fp.to}
              </a>
            ))}
        </motion.div>
      )}
    </div>
  );
}
