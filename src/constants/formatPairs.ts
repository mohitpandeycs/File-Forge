export interface FormatCategory {
  id: string;
  label: string;
  icon: string;
}

export interface FormatPair {
  id: string;
  from: string;
  to: string;
  category: string;
  label: string;
  popular?: boolean;
}

export const categories: FormatCategory[] = [
  { id: "documents", label: "Documents", icon: "file-text" },
  { id: "spreadsheets", label: "Spreadsheets", icon: "table" },
  { id: "images", label: "Images", icon: "image" },
];

export const formatPairs: FormatPair[] = [
  // Documents
  {
    id: "docx-pdf",
    from: "DOCX",
    to: "PDF",
    category: "documents",
    label: "Word to PDF",
    popular: true,
  },
  {
    id: "docx-txt",
    from: "DOCX",
    to: "TXT",
    category: "documents",
    label: "Word to Text",
  },
  {
    id: "docx-html",
    from: "DOCX",
    to: "HTML",
    category: "documents",
    label: "Word to HTML",
  },
  {
    id: "txt-pdf",
    from: "TXT",
    to: "PDF",
    category: "documents",
    label: "Text to PDF",
  },
  {
    id: "md-pdf",
    from: "MD",
    to: "PDF",
    category: "documents",
    label: "Markdown to PDF",
    popular: true,
  },
  {
    id: "md-html",
    from: "MD",
    to: "HTML",
    category: "documents",
    label: "Markdown to HTML",
  },
  {
    id: "html-pdf",
    from: "HTML",
    to: "PDF",
    category: "documents",
    label: "HTML to PDF",
  },

  // Spreadsheets
  {
    id: "xlsx-csv",
    from: "XLSX",
    to: "CSV",
    category: "spreadsheets",
    label: "Excel to CSV",
    popular: true,
  },
  {
    id: "xlsx-json",
    from: "XLSX",
    to: "JSON",
    category: "spreadsheets",
    label: "Excel to JSON",
  },
  {
    id: "csv-xlsx",
    from: "CSV",
    to: "XLSX",
    category: "spreadsheets",
    label: "CSV to Excel",
    popular: true,
  },
  {
    id: "csv-json",
    from: "CSV",
    to: "JSON",
    category: "spreadsheets",
    label: "CSV to JSON",
  },
  {
    id: "csv-xml",
    from: "CSV",
    to: "XML",
    category: "spreadsheets",
    label: "CSV to XML",
  },
  {
    id: "json-csv",
    from: "JSON",
    to: "CSV",
    category: "spreadsheets",
    label: "JSON to CSV",
  },
  {
    id: "json-xlsx",
    from: "JSON",
    to: "XLSX",
    category: "spreadsheets",
    label: "JSON to Excel",
  },
  {
    id: "json-xml",
    from: "JSON",
    to: "XML",
    category: "spreadsheets",
    label: "JSON to XML",
  },
  {
    id: "xml-csv",
    from: "XML",
    to: "CSV",
    category: "spreadsheets",
    label: "XML to CSV",
  },
  {
    id: "xml-json",
    from: "XML",
    to: "JSON",
    category: "spreadsheets",
    label: "XML to JSON",
  },

  // Images
  {
    id: "jpg-png",
    from: "JPG",
    to: "PNG",
    category: "images",
    label: "JPG to PNG",
    popular: true,
  },
  {
    id: "png-jpg",
    from: "PNG",
    to: "JPG",
    category: "images",
    label: "PNG to JPG",
    popular: true,
  },
  {
    id: "jpg-webp",
    from: "JPG",
    to: "WEBP",
    category: "images",
    label: "JPG to WEBP",
    popular: true,
  },
  {
    id: "webp-jpg",
    from: "WEBP",
    to: "JPG",
    category: "images",
    label: "WEBP to JPG",
    popular: true,
  },
  {
    id: "png-webp",
    from: "PNG",
    to: "WEBP",
    category: "images",
    label: "PNG to WEBP",
  },
  {
    id: "webp-png",
    from: "WEBP",
    to: "PNG",
    category: "images",
    label: "WEBP to PNG",
  },
  {
    id: "heic-jpg",
    from: "HEIC",
    to: "JPG",
    category: "images",
    label: "HEIC to JPG",
    popular: true,
  },
  {
    id: "heic-png",
    from: "HEIC",
    to: "PNG",
    category: "images",
    label: "HEIC to PNG",
  },
  {
    id: "heif-jpg",
    from: "HEIF",
    to: "JPG",
    category: "images",
    label: "HEIF to JPG",
  },
  {
    id: "heif-png",
    from: "HEIF",
    to: "PNG",
    category: "images",
    label: "HEIF to PNG",
  },
  {
    id: "bmp-jpg",
    from: "BMP",
    to: "JPG",
    category: "images",
    label: "BMP to JPG",
  },
  {
    id: "bmp-png",
    from: "BMP",
    to: "PNG",
    category: "images",
    label: "BMP to PNG",
  },
  {
    id: "svg-png",
    from: "SVG",
    to: "PNG",
    category: "images",
    label: "SVG to PNG",
  },
  {
    id: "svg-jpg",
    from: "SVG",
    to: "JPG",
    category: "images",
    label: "SVG to JPG",
  },
  {
    id: "ico-png",
    from: "ICO",
    to: "PNG",
    category: "images",
    label: "ICO to PNG",
  },
  {
    id: "avif-jpg",
    from: "AVIF",
    to: "JPG",
    category: "images",
    label: "AVIF to JPG",
  },
  {
    id: "gif-jpg",
    from: "GIF",
    to: "JPG",
    category: "images",
    label: "GIF to JPG",
  },
  {
    id: "gif-png",
    from: "GIF",
    to: "PNG",
    category: "images",
    label: "GIF to PNG",
  },
];

export const supportedFormats = [
  "DOCX",
  "PDF",
  "TXT",
  "MD",
  "HTML",
  "XLSX",
  "CSV",
  "JSON",
  "XML",
  "JPG",
  "PNG",
  "WEBP",
  "HEIC",
  "HEIF",
  "BMP",
  "SVG",
  "ICO",
  "AVIF",
  "GIF",
];

export const formatExtensions: Record<string, string[]> = {
  DOCX: [".docx"],
  PDF: [".pdf"],
  TXT: [".txt"],
  MD: [".md", ".markdown"],
  HTML: [".html", ".htm"],
  XLSX: [".xlsx"],
  CSV: [".csv"],
  JSON: [".json"],
  XML: [".xml"],
  JPG: [".jpg", ".jpeg"],
  PNG: [".png"],
  WEBP: [".webp"],
  HEIC: [".heic"],
  HEIF: [".heif"],
  BMP: [".bmp"],
  SVG: [".svg"],
  ICO: [".ico"],
  AVIF: [".avif"],
  GIF: [".gif"],
};

export function detectFormatFromExtension(ext: string): string | null {
  const trimmed = ext.trim().toLowerCase();
  if (!trimmed) return null;

  const normalized = trimmed.startsWith(".") ? trimmed : `.${trimmed}`;
  for (const [format, extensions] of Object.entries(formatExtensions)) {
    if (extensions.includes(normalized)) return format;
  }
  return null;
}

export function getCompatibleTargets(format: string): string[] {
  return formatPairs
    .filter((fp) => fp.from === format)
    .map((fp) => fp.to)
    .filter((to, i, arr) => arr.indexOf(to) === i);
}
