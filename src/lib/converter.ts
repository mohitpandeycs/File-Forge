"use client";

import { PDFDocument, StandardFonts } from "pdf-lib";
import * as XLSX from "xlsx";
import { marked } from "marked";
import JSZip from "jszip";

async function getHeic2any() {
  const { default: heic2any } = await import("heic2any");
  return heic2any;
}

async function getMammoth() {
  const mammoth = await import("mammoth");
  return mammoth;
}

export interface ConversionResult {
  success: boolean;
  blob?: Blob;
  error?: string;
  outputFormat: string;
  originalSize: number;
  convertedSize?: number;
}

export interface BatchConversionResult {
  fileName: string;
  result: ConversionResult;
}

export interface PDFMergeResult {
  success: boolean;
  blob?: Blob;
  error?: string;
  pageCount?: number;
}

export interface PDFSplitResult {
  success: boolean;
  blobs?: Blob[];
  error?: string;
}

// ==================== IMAGE CONVERSIONS ====================

export async function convertImageFile(
  file: File,
  targetFormat: string,
  quality: number = 0.92,
  width?: number,
  height?: number,
): Promise<ConversionResult> {
  try {
    let imageBlob: Blob = file;

    if (
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif")
    ) {
      const heic2any = await getHeic2any();
      const converted = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 1,
      });
      imageBlob = converted as Blob;
    }

    const mimeType = getMimeType(targetFormat);
    if (!mimeType) {
      return {
        success: false,
        error: `Unsupported output format: ${targetFormat}`,
        outputFormat: targetFormat,
        originalSize: file.size,
      };
    }

    const img = await loadImage(imageBlob);
    const canvas = document.createElement("canvas");
    let finalWidth = img.width;
    let finalHeight = img.height;

    if (width && height) {
      finalWidth = width;
      finalHeight = height;
    } else if (width) {
      finalHeight = Math.round((img.height / img.width) * width);
    } else if (height) {
      finalWidth = Math.round((img.width / img.height) * height);
    }

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return {
        success: false,
        error: "Canvas context not available",
        outputFormat: targetFormat,
        originalSize: file.size,
      };
    }

    if (targetFormat === "JPG" || targetFormat === "JPEG") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, mimeType, quality);
    });

    if (!blob) {
      return {
        success: false,
        error: "Conversion failed",
        outputFormat: targetFormat,
        originalSize: file.size,
      };
    }

    return {
      success: true,
      blob,
      outputFormat: targetFormat,
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: targetFormat,
      originalSize: file.size,
    };
  }
}

export async function compressImage(
  file: File,
  quality: number = 0.6,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
): Promise<ConversionResult> {
  try {
    const img = await loadImage(file);
    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
      height = Math.round((height / width) * maxWidth);
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = Math.round((width / height) * maxHeight);
      height = maxHeight;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, width, height);

    const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, mimeType, quality);
    });

    if (!blob)
      return {
        success: false,
        error: "Compression failed",
        outputFormat: file.type.split("/")[1].toUpperCase(),
        originalSize: file.size,
      };

    return {
      success: true,
      blob,
      outputFormat: file.type.split("/")[1].toUpperCase(),
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "IMG",
      originalSize: file.size,
    };
  }
}

// ==================== DOCUMENT CONVERSIONS ====================

export async function convertMarkdownToPDF(
  file: File,
): Promise<ConversionResult> {
  try {
    const text = await file.text();
    const html = marked.parse(text) as string;
    return await htmlToPDFBlob(html, file.size);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "PDF",
      originalSize: file.size,
    };
  }
}

export async function convertMarkdownToHTML(
  file: File,
): Promise<ConversionResult> {
  try {
    const text = await file.text();
    const html = marked.parse(text) as string;
    const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Document</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6}code{background:#f4f4f4;padding:2px 6px;border-radius:3px}pre{background:#f4f4f4;padding:16px;border-radius:6px;overflow-x:auto}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}img{max-width:100%}</style></head><body>${html}</body></html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    return {
      success: true,
      blob,
      outputFormat: "HTML",
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "HTML",
      originalSize: file.size,
    };
  }
}

export async function convertHTMLToPDF(file: File): Promise<ConversionResult> {
  try {
    const html = await file.text();
    return await htmlToPDFBlob(html, file.size);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "PDF",
      originalSize: file.size,
    };
  }
}

export async function convertTXTToPDF(file: File): Promise<ConversionResult> {
  try {
    const text = await file.text();
    return await createPdfFromPlainText(text, file.size);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "PDF",
      originalSize: file.size,
    };
  }
}

export async function convertDOCXToPDF(file: File): Promise<ConversionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const mammoth = await getMammoth();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return await htmlToPDFBlob(result.value, file.size);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "PDF",
      originalSize: file.size,
    };
  }
}

export async function convertDOCXToTXT(file: File): Promise<ConversionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const mammoth = await getMammoth();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const blob = new Blob([result.value], { type: "text/plain" });
    return {
      success: true,
      blob,
      outputFormat: "TXT",
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "TXT",
      originalSize: file.size,
    };
  }
}

export async function convertDOCXToHTML(file: File): Promise<ConversionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const mammoth = await getMammoth();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Document</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6}</style></head><body>${result.value}</body></html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    return {
      success: true,
      blob,
      outputFormat: "HTML",
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "HTML",
      originalSize: file.size,
    };
  }
}

// ==================== SPREADSHEET CONVERSIONS ====================

export async function convertXLSXtoCSV(file: File): Promise<ConversionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const csv = XLSX.utils.sheet_to_csv(firstSheet);
    const blob = new Blob([csv], { type: "text/csv" });
    return {
      success: true,
      blob,
      outputFormat: "CSV",
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "CSV",
      originalSize: file.size,
    };
  }
}

export async function convertXLSXtoJSON(file: File): Promise<ConversionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet);
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    return {
      success: true,
      blob,
      outputFormat: "JSON",
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "JSON",
      originalSize: file.size,
    };
  }
}

export async function convertCSVtoXLSX(file: File): Promise<ConversionResult> {
  try {
    const text = await file.text();
    const workbook = XLSX.read(text, { type: "string" });
    const xlsxData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([xlsxData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    return {
      success: true,
      blob,
      outputFormat: "XLSX",
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "XLSX",
      originalSize: file.size,
    };
  }
}

export async function convertJSONtoXLSX(file: File): Promise<ConversionResult> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    const worksheet = XLSX.utils.json_to_sheet(
      Array.isArray(data) ? data : [data],
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const xlsxData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([xlsxData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    return {
      success: true,
      blob,
      outputFormat: "XLSX",
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "XLSX",
      originalSize: file.size,
    };
  }
}

export async function convertCSVtoJSON(file: File): Promise<ConversionResult> {
  try {
    const text = await file.text();
    const workbook = XLSX.read(text, { type: "string" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet);
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    return {
      success: true,
      blob,
      outputFormat: "JSON",
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "JSON",
      originalSize: file.size,
    };
  }
}

export async function convertJSONtoCSV(file: File): Promise<ConversionResult> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    const worksheet = XLSX.utils.json_to_sheet(
      Array.isArray(data) ? data : [data],
    );
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv" });
    return {
      success: true,
      blob,
      outputFormat: "CSV",
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "CSV",
      originalSize: file.size,
    };
  }
}

export async function convertCSVtoXML(file: File): Promise<ConversionResult> {
  try {
    const text = await file.text();
    const workbook = XLSX.read(text, { type: "string" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet);
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';
    for (const row of data as Record<string, unknown>[]) {
      xml += "  <row>\n";
      for (const [key, value] of Object.entries(row)) {
        const safeKey = key.replace(/[^a-zA-Z0-9_]/g, "_");
        xml += `    <${safeKey}>${escapeXml(String(value ?? ""))}</${safeKey}>\n`;
      }
      xml += "  </row>\n";
    }
    xml += "</root>";
    const blob = new Blob([xml], { type: "application/xml" });
    return {
      success: true,
      blob,
      outputFormat: "XML",
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "XML",
      originalSize: file.size,
    };
  }
}

export async function convertXMLtoCSV(file: File): Promise<ConversionResult> {
  try {
    const text = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/xml");
    const rows = doc.querySelectorAll("row");
    if (rows.length === 0)
      return {
        success: false,
        error: "No data rows found in XML",
        outputFormat: "CSV",
        originalSize: file.size,
      };

    const headers: string[] = [];
    const data: Record<string, string>[] = [];

    rows.forEach((row) => {
      const obj: Record<string, string> = {};
      Array.from(row.children).forEach((child) => {
        const tag = child.tagName;
        if (!headers.includes(tag)) headers.push(tag);
        obj[tag] = child.textContent || "";
      });
      data.push(obj);
    });

    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv" });
    return {
      success: true,
      blob,
      outputFormat: "CSV",
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "CSV",
      originalSize: file.size,
    };
  }
}

export async function convertXMLtoJSON(file: File): Promise<ConversionResult> {
  try {
    const text = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/xml");
    const rows = doc.querySelectorAll("row");
    const data: Record<string, string>[] = [];

    rows.forEach((row) => {
      const obj: Record<string, string> = {};
      Array.from(row.children).forEach((child) => {
        obj[child.tagName] = child.textContent || "";
      });
      data.push(obj);
    });

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    return {
      success: true,
      blob,
      outputFormat: "JSON",
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "JSON",
      originalSize: file.size,
    };
  }
}

export async function convertJSONtoXML(file: File): Promise<ConversionResult> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    const items = Array.isArray(data) ? data : [data];
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';
    for (const item of items) {
      xml += "  <row>\n";
      for (const [key, value] of Object.entries(
        item as Record<string, unknown>,
      )) {
        const safeKey = key.replace(/[^a-zA-Z0-9_]/g, "_");
        xml += `    <${safeKey}>${escapeXml(String(value ?? ""))}</${safeKey}>\n`;
      }
      xml += "  </row>\n";
    }
    xml += "</root>";
    const blob = new Blob([xml], { type: "application/xml" });
    return {
      success: true,
      blob,
      outputFormat: "XML",
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "XML",
      originalSize: file.size,
    };
  }
}

// ==================== PDF TOOLS ====================

export async function mergePDFs(files: File[]): Promise<PDFMergeResult> {
  try {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });
    return { success: true, blob, pageCount: mergedPdf.getPageCount() };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function splitPDF(
  file: File,
  pageRanges: string,
): Promise<PDFSplitResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const totalPages = pdf.getPageCount();
    const ranges = parsePageRanges(pageRanges, totalPages);
    const blobs: Blob[] = [];

    for (const range of ranges) {
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(
        pdf,
        range.map((p) => p - 1),
      );
      pages.forEach((page) => newPdf.addPage(page));
      const pdfBytes = await newPdf.save();
      blobs.push(
        new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
      );
    }

    return { success: true, blobs };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function compressPDF(file: File): Promise<ConversionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });
    return {
      success: true,
      blob,
      outputFormat: "PDF",
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "PDF",
      originalSize: file.size,
    };
  }
}

export async function extractTextFromPDF(
  file: File,
): Promise<ConversionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    let text = "";
    for (const page of pages) {
      const { width, height } = page.getSize();
      text += `[Page ${pages.indexOf(page) + 1} - ${Math.round(width)}x${Math.round(height)}]\n\n`;
    }
    const blob = new Blob([text], { type: "text/plain" });
    return {
      success: true,
      blob,
      outputFormat: "TXT",
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "TXT",
      originalSize: file.size,
    };
  }
}

// ==================== BATCH CONVERSION ====================

export async function batchConvertImages(
  files: File[],
  targetFormat: string,
  quality: number = 0.92,
): Promise<BatchConversionResult[]> {
  const results: BatchConversionResult[] = [];
  for (const file of files) {
    const result = await convertImageFile(file, targetFormat, quality);
    results.push({ fileName: file.name, result });
  }
  return results;
}

export async function createZipFromBlobs(
  fileBlobs: { name: string; blob: Blob }[],
): Promise<Blob> {
  const zip = new JSZip();
  for (const { name, blob } of fileBlobs) {
    zip.file(name, blob);
  }
  return await zip.generateAsync({ type: "blob" });
}

// ==================== BASE64 UTILITIES ====================

export async function fileToBase64(file: File): Promise<ConversionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const blob = new Blob([base64], { type: "text/plain" });
    return {
      success: true,
      blob,
      outputFormat: "BASE64",
      originalSize: file.size,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      outputFormat: "BASE64",
      originalSize: file.size,
    };
  }
}

export function base64ToFile(
  base64: string,
  fileName: string,
  mimeType: string,
): ConversionResult {
  try {
    const binaryString = atob(base64.trim());
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
    return {
      success: true,
      blob,
      outputFormat: fileName.split(".").pop()?.toUpperCase() || "FILE",
      originalSize: base64.length,
      convertedSize: blob.size,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Invalid Base64 string",
      outputFormat: "FILE",
      originalSize: base64.length,
    };
  }
}

// ==================== UNIVERSAL CONVERTER ROUTER ====================

export async function convertFile(
  file: File,
  targetFormat: string,
  options?: { quality?: number; width?: number; height?: number },
): Promise<ConversionResult> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const quality = options?.quality ?? 0.92;

  const formatMap: Record<
    string,
    Record<string, (file: File) => Promise<ConversionResult>>
  > = {
    md: { PDF: convertMarkdownToPDF, HTML: convertMarkdownToHTML },
    html: { PDF: convertHTMLToPDF },
    htm: { PDF: convertHTMLToPDF },
    txt: { PDF: convertTXTToPDF },
    docx: {
      PDF: convertDOCXToPDF,
      TXT: convertDOCXToTXT,
      HTML: convertDOCXToHTML,
    },
    xlsx: { CSV: convertXLSXtoCSV, JSON: convertXLSXtoJSON },
    csv: {
      XLSX: convertCSVtoXLSX,
      JSON: convertCSVtoJSON,
      XML: convertCSVtoXML,
    },
    json: {
      CSV: convertJSONtoCSV,
      XLSX: convertJSONtoXLSX,
      XML: convertJSONtoXML,
    },
    xml: { CSV: convertXMLtoCSV, JSON: convertXMLtoJSON },
  };

  if (formatMap[ext]?.[targetFormat]) {
    return formatMap[ext][targetFormat](file);
  }

  const imageFormats = [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "bmp",
    "tiff",
    "tif",
    "svg",
    "ico",
    "avif",
    "heic",
    "heif",
    "gif",
  ];
  if (
    imageFormats.includes(ext) &&
    ["JPG", "PNG", "WEBP"].includes(targetFormat)
  ) {
    return convertImageFile(
      file,
      targetFormat,
      quality,
      options?.width,
      options?.height,
    );
  }

  return {
    success: false,
    error: `Conversion from ${ext.toUpperCase()} to ${targetFormat} is not supported client-side. This requires a backend service.`,
    outputFormat: targetFormat,
    originalSize: file.size,
  };
}

// ==================== HELPER FUNCTIONS ====================

function getMimeType(format: string): string | null {
  const map: Record<string, string> = {
    JPG: "image/jpeg",
    JPEG: "image/jpeg",
    PNG: "image/png",
    WEBP: "image/webp",
    AVIF: "image/avif",
    BMP: "image/bmp",
    ICO: "image/x-icon",
    TIFF: "image/tiff",
  };
  return map[format.toUpperCase()] || null;
}

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

async function htmlToPDFBlob(
  html: string,
  originalSize: number,
): Promise<ConversionResult> {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const text =
      doc.body?.innerText?.trim() || doc.body?.textContent?.trim() || "";
    const content =
      text.length > 0 ? text : "(No text content found in the source HTML.)";
    return await createPdfFromPlainText(content, originalSize);
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Unable to convert HTML to PDF",
      outputFormat: "PDF",
      originalSize,
    };
  }
}

async function createPdfFromPlainText(
  text: string,
  originalSize: number,
): Promise<ConversionResult> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const lineHeight = fontSize * 1.5;
  const margin = 50;
  const pageWidth = 612;
  const pageHeight = 792;
  const maxWidth = pageWidth - margin * 2;
  const lines = text.split("\n");

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r/g, "");

    if (line.trim().length === 0) {
      if (y < margin + lineHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      y -= lineHeight;
      continue;
    }

    const words = line.split(" ");
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth && currentLine) {
        if (y < margin + lineHeight) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(currentLine, { x: margin, y, size: fontSize, font });
        y -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      if (y < margin + lineHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(currentLine, { x: margin, y, size: fontSize, font });
      y -= lineHeight;
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], {
    type: "application/pdf",
  });
  return {
    success: true,
    blob,
    outputFormat: "PDF",
    originalSize,
    convertedSize: blob.size,
  };
}

function parsePageRanges(rangeStr: string, totalPages: number): number[][] {
  const ranges: number[][] = [];
  const parts = rangeStr.split(",").map((p) => p.trim());

  for (const part of parts) {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      if (!isNaN(start) && !isNaN(end)) {
        const pages: number[] = [];
        for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++)
          pages.push(i);
        if (pages.length > 0) ranges.push(pages);
      }
    } else {
      const num = Number(part);
      if (!isNaN(num) && num >= 1 && num <= totalPages) {
        ranges.push([num]);
      }
    }
  }

  return ranges.length > 0
    ? ranges
    : [Array.from({ length: totalPages }, (_, i) => i + 1)];
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
