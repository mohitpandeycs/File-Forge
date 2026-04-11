'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { faqs } from '@/constants/faqs'
import SectionHeading from '@/components/shared/SectionHeading'

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="FAQ"
          title="Common questions"
          subtitle="Everything you need to know about FileForge."
        />

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="bg-white dark:bg-[#1a1a1a] border border-[#E5E5E0] dark:border-[#2a2a2a] rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#F0F0EB]/50 dark:hover:bg-[#2a2a2a]/50 transition-colors"
                aria-expanded={openId === faq.id}
              >
                <span className="font-medium text-sm pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-[#6B7280] dark:text-[#9CA3AF] flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-5 text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
