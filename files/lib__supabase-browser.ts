"use client";

import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://rtzxxeeqfhmmnoubwzvq.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "sb_publishable_v8RouLqDckbyAXURXFo18w_Q0M3Qx5-"
  );
}
