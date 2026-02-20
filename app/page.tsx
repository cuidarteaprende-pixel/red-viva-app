"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // By default, if session exists, we attempt home
        // In Phase 4, /care/home is the main interface
        router.push("/care/home");
      } else {
        router.push("/gateway");
      }
    };
    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}
