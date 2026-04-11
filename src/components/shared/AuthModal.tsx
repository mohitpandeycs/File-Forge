'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'signup'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const { signUp, signIn } = useAuth()
  const [mode, setMode] = useState(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    let result
    if (mode === 'signup') {
      result = await signUp(formData.email, formData.password, formData.name)
      if (!result.error) {
        setSuccess('Account created! Check your email for verification.')
        setTimeout(onClose, 2000)
      }
    } else {
      result = await signIn(formData.email, formData.password)
      if (!result.error) {
        onClose()
      }
    }

    if (result.error) setError(result.error)
    setIsLoading(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold">
                    {mode === 'login' ? 'Welcome back' : 'Create account'}
                  </h2>
                  <button onClick={onClose} className="p-2 hover:bg-[#F0F0EB] dark:hover:bg-[#2a2a2a] rounded-lg transition-colors" aria-label="Close">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl text-sm text-red-700 dark:text-red-400">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-xl text-sm text-[#0D9488] dark:text-[#14B8A6]">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                      <input
                        type="text"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#111] border border-[#E5E5E0] dark:border-[#2a2a2a] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30 focus:border-[#F59E0B]/50"
                        required
                      />
                    </div>
                  )}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#9CA3AF]" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#111] border border-[#E5E5E0] dark:border-[#2a2a2a] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30 focus:border-[#F59E0B]/50"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      minLength={6}
                      className="w-full pl-10 pr-10 py-3 bg-white dark:bg-[#111] border border-[#E5E5E0] dark:border-[#2a2a2a] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30 focus:border-[#F59E0B]/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#0A0A0A] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#F59E0B] text-[#0A0A0A] rounded-xl font-medium text-sm hover:bg-[#D97706] transition-colors shadow-[0_4px_16px_rgba(245,158,11,0.3)] disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                <p className="text-center text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-6">
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setSuccess(null) }}
                    className="text-[#F59E0B] font-medium hover:underline"
                  >
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
