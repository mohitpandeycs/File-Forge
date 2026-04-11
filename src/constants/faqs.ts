export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: "free-limit",
    question: "What are the limits on the free plan?",
    answer:
      "You can convert files up to 50 MB each. Batch mode supports up to 10 image files at once. No account is required for core tools.",
  },
  {
    id: "file-safety",
    question: "Are my files safe?",
    answer:
      "Yes. Supported conversions run directly in your browser and file contents are not uploaded by default. If you sign in, conversion history may store metadata (name, formats, sizes), not file contents.",
  },
  {
    id: "quality",
    question: "Will my formatting be preserved?",
    answer:
      "Image conversions include quality controls. Document conversions prioritize reliable browser-side output, but complex layouts and fonts can vary by format.",
  },
  {
    id: "batch",
    question: "Can I convert multiple files at once?",
    answer:
      "Yes, for image files. Drag and drop multiple images, choose one target format, and download the converted results as a ZIP archive.",
  },
  {
    id: "heic",
    question: "How do I convert HEIC files from my iPhone?",
    answer:
      "Simply drag and drop your .heic file and choose JPG or PNG as the target format. HEIC→JPG conversion happens entirely in your browser — no upload needed for image conversions.",
  },
  {
    id: "pro",
    question: "What do I get with Pro?",
    answer:
      "Pro is marked as coming soon. The pricing page lists planned features, but they are not active yet.",
  },
];
