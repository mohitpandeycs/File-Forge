import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-[#FAFAF7] border-t border-[#1a1a1a] relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F59E0B]/40 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-[#F59E0B]/40">
                <Image
                  src="/fileforge-mark.svg"
                  alt="FileForge"
                  width={32}
                  height={32}
                  className="h-full w-full"
                />
              </div>
              <span className="font-display font-semibold text-lg">
                FileForge
              </span>
            </Link>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">
              The last file converter you&apos;ll ever need.
            </p>
          </div>

          <div>
            <h3 className="font-display font-medium text-sm mb-4 text-[#FAFAF7]">
              Tools
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/convert/docx-to-pdf"
                  className="text-sm text-[#9CA3AF] hover:text-[#F59E0B] transition-colors"
                >
                  DOCX to PDF
                </Link>
              </li>
              <li>
                <Link
                  href="/convert/jpg-to-png"
                  className="text-sm text-[#9CA3AF] hover:text-[#F59E0B] transition-colors"
                >
                  JPG to PNG
                </Link>
              </li>
              <li>
                <Link
                  href="/convert/heic-to-jpg"
                  className="text-sm text-[#9CA3AF] hover:text-[#F59E0B] transition-colors"
                >
                  HEIC to JPG
                </Link>
              </li>
              <li>
                <Link
                  href="/convert/csv-to-json"
                  className="text-sm text-[#9CA3AF] hover:text-[#F59E0B] transition-colors"
                >
                  CSV to JSON
                </Link>
              </li>
              <li>
                <Link
                  href="/convert/md-to-pdf"
                  className="text-sm text-[#9CA3AF] hover:text-[#F59E0B] transition-colors"
                >
                  Markdown to PDF
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-medium text-sm mb-4 text-[#FAFAF7]">
              PDF Tools
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pdf-tools"
                  className="text-sm text-[#9CA3AF] hover:text-[#F59E0B] transition-colors"
                >
                  Merge PDFs
                </Link>
              </li>
              <li>
                <Link
                  href="/pdf-tools"
                  className="text-sm text-[#9CA3AF] hover:text-[#F59E0B] transition-colors"
                >
                  Split PDF
                </Link>
              </li>
              <li>
                <Link
                  href="/pdf-tools"
                  className="text-sm text-[#9CA3AF] hover:text-[#F59E0B] transition-colors"
                >
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link
                  href="/compress"
                  className="text-sm text-[#9CA3AF] hover:text-[#F59E0B] transition-colors"
                >
                  Compress Images
                </Link>
              </li>
              <li>
                <Link
                  href="/base64"
                  className="text-sm text-[#9CA3AF] hover:text-[#F59E0B] transition-colors"
                >
                  Base64 Tool
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-medium text-sm mb-4 text-[#FAFAF7]">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-[#9CA3AF] hover:text-[#F59E0B] transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="text-sm text-[#9CA3AF] hover:text-[#F59E0B] transition-colors"
                >
                  All Tools
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1a1a1a] mt-8 pt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center">
          <p className="text-xs text-[#9CA3AF] text-center md:text-left">
            &copy; {CURRENT_YEAR} FileForge. All rights reserved.
          </p>
          <p className="text-xs text-[#9CA3AF] text-center">
            Built to save your time -{" "}
            <a
              href="https://github.com/mohitpandeycs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F59E0B] hover:text-[#D97706] font-medium transition-colors"
              title="Explore My Work!"
            >
              <span title="Explore My Work">Mohit :)</span>
            </a>
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
            <a
              href="https://github.com/mohitpandeycs/File-Forge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#F59E0B]/10 border border-[#2a2a2a] hover:border-[#F59E0B]/50 rounded-full text-xs text-[#9CA3AF] hover:text-[#F59E0B] transition-all"
            >
              <Star className="w-3.5 h-3.5" />
              Star on GitHub
            </a>
            <a
              href="https://github.com/mohitpandeycs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9CA3AF] hover:text-[#F59E0B] transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/mohitpandeycs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9CA3AF] hover:text-[#F59E0B] transition-colors"
              aria-label="X (Twitter)"
            >
              <FaXTwitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
