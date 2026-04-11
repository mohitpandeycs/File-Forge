import { motion } from 'framer-motion'

interface SectionHeadingProps {
  badge?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  light?: boolean
}

export default function SectionHeading({ badge, title, subtitle, align = 'center', light = false }: SectionHeadingProps) {
  return (
    <div className={`max-w-3xl mx-auto mb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-3 py-1 bg-[#F59E0B]/10 text-[#D97706] text-xs font-mono font-medium rounded-full mb-4 tracking-wide uppercase"
        >
          {badge}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight ${
          light ? 'text-[#FAFAF7]' : 'text-[#0A0A0A] dark:text-[#FAFAF7]'
        }`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`mt-4 text-lg leading-relaxed ${
            light ? 'text-[#9CA3AF]' : 'text-[#6B7280] dark:text-[#9CA3AF]'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
