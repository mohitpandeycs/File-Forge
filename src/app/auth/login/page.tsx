"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Zap, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function LoginForm() {
  const { signUp, signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    let result;
    if (mode === "signup") {
      result = await signUp(formData.email, formData.password, formData.name);
      if (!result.error) {
        setSuccess("Account created! Check your email to verify your account.");
      }
    } else {
      result = await signIn(formData.email, formData.password);
      if (!result.error) {
        router.push(redirect);
        router.refresh();
      }
    }

    if (result.error) setError(result.error);
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[460px] h-[460px] bg-[#F59E0B]/[0.06] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#14B8A6]/[0.04] rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-10 h-10 bg-[#F59E0B] rounded-xl flex items-center justify-center group-hover:bg-[#D97706] transition-colors">
              <Zap className="w-5 h-5 text-[#0A0A0A]" />
            </div>
            <span className="font-display font-semibold text-xl tracking-tight">
              FileForge
            </span>
          </Link>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            {mode === "login" ? "Welcome back" : "Get started"}
          </h1>
          <p className="text-[#6B7280] dark:text-[#B0B7C3] text-base font-body">
            {mode === "login"
              ? "Sign in to access your conversion history"
              : "Create a free account to start converting files"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#161616] border border-[#E5E5E0] dark:border-[#2a2a2a] rounded-2xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(245,158,11,0.09)]">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl text-sm text-red-700 dark:text-red-400 font-body"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-xl text-sm text-[#0D9488] dark:text-[#14B8A6] font-body"
            >
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-1.5 font-body text-[#0A0A0A] dark:text-[#E5E7EB]">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#9CA3AF]" />
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-[#FAFAF7] dark:bg-[#101010] border border-[#E5E5E0] dark:border-[#2a2a2a] rounded-xl text-sm font-body text-[#0A0A0A] dark:text-[#E5E7EB] placeholder:text-[#9CA3AF] dark:placeholder:text-[#8B93A1] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30 focus:border-[#F59E0B]/50 transition-all"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium mb-1.5 font-body text-[#0A0A0A] dark:text-[#E5E7EB]">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#9CA3AF]" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-[#FAFAF7] dark:bg-[#101010] border border-[#E5E5E0] dark:border-[#2a2a2a] rounded-xl text-sm font-body text-[#0A0A0A] dark:text-[#E5E7EB] placeholder:text-[#9CA3AF] dark:placeholder:text-[#8B93A1] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30 focus:border-[#F59E0B]/50 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 font-body text-[#0A0A0A] dark:text-[#E5E7EB]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#9CA3AF]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  minLength={6}
                  className="w-full pl-10 pr-10 py-3 bg-[#FAFAF7] dark:bg-[#101010] border border-[#E5E5E0] dark:border-[#2a2a2a] rounded-xl text-sm font-body text-[#0A0A0A] dark:text-[#E5E7EB] placeholder:text-[#9CA3AF] dark:placeholder:text-[#8B93A1] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30 focus:border-[#F59E0B]/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#0A0A0A] dark:hover:text-[#E5E7EB] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#F59E0B] text-[#0A0A0A] rounded-xl font-medium text-sm font-body hover:bg-[#D97706] transition-all shadow-[0_4px_16px_rgba(245,158,11,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 group mt-6"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#0A0A0A]/25 border-t-[#0A0A0A] rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-body">
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setError(null);
                  setSuccess(null);
                }}
                className="text-[#F59E0B] font-medium hover:underline"
              >
                {mode === "login" ? "Sign up free" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-[#6B7280] dark:text-[#B0B7C3] mt-6 font-body">
          By continuing, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
