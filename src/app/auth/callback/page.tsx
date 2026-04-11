"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        router.push("/");
        router.refresh();
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#6B7280] font-body">Completing sign in...</p>
      </div>
    </div>
  );
}