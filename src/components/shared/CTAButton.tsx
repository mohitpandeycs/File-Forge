import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CTAButtonProps {
  label: string
  href?: string
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  className?: string
  icon?: React.ReactNode
}

export default function CTAButton({ label, href, variant = 'primary', onClick, className, icon }: CTAButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 px-6 py-3 font-body font-medium rounded-lg transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2 active:scale-[0.98]'
  const variantClasses = {
    primary: 'bg-[#F59E0B] text-[#0A0A0A] hover:bg-[#D97706] shadow-[0_4px_16px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_24px_rgba(245,158,11,0.4)]',
    secondary: 'bg-[#0A0A0A] text-[#FAFAF7] hover:bg-[#1a1a1a] shadow-[0_4px_16px_rgba(10,10,10,0.15)]',
  }

  const classes = cn(baseClasses, variantClasses[variant], className)

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ y: -2 }}
        onClick={onClick}
      >
        {icon}
        {label}
      </motion.a>
    )
  }

  return (
    <motion.button
      className={classes}
      whileHover={{ y: -2 }}
      onClick={onClick}
    >
      {icon}
      {label}
    </motion.button>
  )
}
