'use client'

import { motion } from 'framer-motion'
import { benefits } from '@/constants/benefits'
import SectionHeading from '@/components/shared/SectionHeading'

export default function BenefitsSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#FAFAF7] dark:bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Why FileForge"
          title="Built different"
          subtitle="We obsess over the details so you don't have to think about them."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#E5E5E0] dark:border-[#2a2a2a] p-8 hover:border-[#F59E0B]/30 hover:shadow-[0_8px_32px_rgba(245,158,11,0.08)] transition-all duration-300"
            >
              {benefit.stat && (
                <span className="absolute top-6 right-6 font-mono text-3xl font-bold text-[#F59E0B]/20 group-hover:text-[#F59E0B]/30 transition-colors">
                  {benefit.stat.split(' ')[0]}
                </span>
              )}
              <h3 className="font-display font-semibold text-xl mb-3 pr-20">{benefit.title}</h3>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed">{benefit.description}</p>
              {benefit.stat && (
                <p className="mt-4 text-xs font-mono text-[#F59E0B]">{benefit.stat}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
