export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const features: Feature[] = [
  {
    id: "speed",
    title: "Lightning Fast",
    description:
      "Optimized for quick browser-side conversions with no upload queue.",
    icon: "zap",
  },
  {
    id: "privacy",
    title: "Private & Secure",
    description:
      "Supported tools run in your browser, and file contents are not stored.",
    icon: "shield",
  },
  {
    id: "quality",
    title: "Quality Controls",
    description:
      "Tune image quality and keep output predictable across common formats.",
    icon: "sparkles",
  },
  {
    id: "formats",
    title: "30+ Conversion Tools",
    description: "Documents, spreadsheets, and images in one clean workflow.",
    icon: "file-stack",
  },
  {
    id: "batch",
    title: "Batch Processing",
    description: "Convert multiple image files at once and download as a ZIP.",
    icon: "layers",
  },
  {
    id: "free",
    title: "Free to Use",
    description:
      "No sign-up required. Up to 50 MB per file in the free experience.",
    icon: "gift",
  },
];
