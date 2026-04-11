export interface Benefit {
  id: string;
  title: string;
  description: string;
  stat?: string;
}

export const benefits: Benefit[] = [
  {
    id: "no-signup",
    title: "No Account Needed",
    description:
      "Start converting immediately. Sign up only if you want history and higher limits.",
    stat: "0 clicks to start",
  },
  {
    id: "local-processing",
    title: "Browser-First Privacy",
    description:
      "Supported conversions run locally in your browser, so file contents stay on your device.",
    stat: "On-device",
  },
  {
    id: "all-formats",
    title: "Every Format You Need",
    description:
      "From DOCX to PDF and HEIC to JPG, we focus on practical pairs that work reliably in-browser.",
    stat: "30+ pairs",
  },
  {
    id: "mobile-ready",
    title: "Works Everywhere",
    description:
      "Fully responsive. Convert files on your phone, tablet, or desktop.",
    stat: "100% responsive",
  },
];
