'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, Sparkles, FileStack, Layers, Gift } from 'lucide-react'
import { features } from '@/constants/features'
import SectionHeading from '@/components/shared/SectionHeading'

const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  shield: Shield,
  sparkles: Sparkles,
  'file-stack': FileStack,
  layers: Layers,
  gift: Gift,
}

export default function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Features"
          title="Everything you need to convert files"
          subtitle="No bloat, no ads, no sign-ups. Just fast, reliable conversions."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Zap
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="group bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#E5E5E0] dark:border-[#2a2a2a] p-6 hover:border-[#F59E0B]/30 hover:shadow-[0_8px_32px_rgba(245,158,11,0.08)] transition-all duration-300"
              >
                <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#F59E0B]/20 transition-colors">
                  <Icon className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
