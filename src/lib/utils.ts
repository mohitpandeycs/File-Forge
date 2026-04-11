import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function getFormatFromExtension(ext: string): string {
  return ext.replace(".", "").toUpperCase();
}

export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function appendFileForgeSuffix(fileName: string): string {
  const trimmedName = fileName.trim();
  if (!trimmedName) return "download by FileForge";

  const suffix = " by FileForge";
  const dotIndex = trimmedName.lastIndexOf(".");

  if (dotIndex <= 0) {
    return trimmedName.endsWith(suffix)
      ? trimmedName
      : `${trimmedName}${suffix}`;
  }

  const baseName = trimmedName.slice(0, dotIndex);
  const extension = trimmedName.slice(dotIndex);
  const withSuffix = baseName.endsWith(suffix)
    ? baseName
    : `${baseName}${suffix}`;

  return `${withSuffix}${extension}`;
}
