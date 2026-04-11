import { cn } from '@/lib/utils'

interface BadgeProps {
  label: string
  variant?: 'default' | 'success' | 'warning'
  className?: string
}

export default function Badge({ label, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-[#F59E0B]/10 text-[#D97706]',
    success: 'bg-[#14B8A6]/10 text-[#0D9488]',
    warning: 'bg-[#F59E0B]/15 text-[#D97706]',
  }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 text-xs font-mono font-medium rounded-full', variants[variant], className)}>
      {label}
    </span>
  )
}
