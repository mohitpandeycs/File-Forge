'use client'

import { motion } from 'framer-motion'
import { Upload, ArrowRightLeft, Download } from 'lucide-react'
import { steps } from '@/constants/howItWorks'
import SectionHeading from '@/components/shared/SectionHeading'

const iconMap: Record<string, React.ElementType> = {
  upload: Upload,
  'arrow-right-left': ArrowRightLeft,
  download: Download,
}

export default function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="How It Works"
          title="Three steps. That's it."
          subtitle="No accounts, no waiting, no complexity. Just drop, pick, download."
          light
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-[#F59E0B]/30 to-transparent" />

          {steps.map((step, index) => {
            const Icon = iconMap[step.icon] || Upload
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center"
              >
                <div className="relative z-10 w-16 h-16 mx-auto mb-6 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-2xl flex items-center justify-center">
                  <Icon className="w-7 h-7 text-[#F59E0B]" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#F59E0B] text-[#0A0A0A] text-xs font-mono font-bold rounded-full flex items-center justify-center">
                    {step.id}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-xl text-[#FAFAF7] mb-3">{step.title}</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
