"use client";

import SectionHeading from "@/components/shared/SectionHeading";
import { Zap, Heart, Shield, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="About Us"
          title="Built for everyone who works with files"
          subtitle="FileForge was born from frustration with clunky, ad-filled converter sites. We believe file conversion should be fast, private, and beautiful."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
          {[
            {
              icon: Zap,
              title: "Speed First",
              desc: "Every millisecond matters. Our conversion flow is optimized for quick browser-side processing.",
            },
            {
              icon: Shield,
              title: "Privacy Always",
              desc: "Supported tools process files in your browser, and file contents are not stored by default.",
            },
            {
              icon: Heart,
              title: "Crafted with Care",
              desc: "Every pixel, every animation, every interaction is designed to feel effortless.",
            },
            {
              icon: Globe,
              title: "Accessible to All",
              desc: "Built to work smoothly across modern devices and browsers with a responsive UI.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1a1a1a] border border-[#E5E5E0] dark:border-[#2a2a2a] rounded-2xl p-8"
            >
              <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
