import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FileForge",
    short_name: "FileForge",
    description:
      "Browser-based file conversion tools for documents, spreadsheets, and images.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF7",
    theme_color: "#F59E0B",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
