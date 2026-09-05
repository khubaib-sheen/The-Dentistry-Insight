"use client";

import { useTransition } from "react";
import { duplicateRecord } from "@/app/admin/actions";
import type { SectionKey } from "@/lib/sections";

export default function DuplicateButton({
  section,
  id,
}: {
  section: SectionKey;
  id: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => duplicateRecord(section, id))}
      className="text-slate-500 font-bold text-xs hover:underline disabled:opacity-50"
    >
      {pending ? "Duplicating…" : "Duplicate"}
    </button>
  );
}
