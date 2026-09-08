"use client";

import { useTransition } from "react";
import { deleteRecord } from "@/app/admin/actions";
import type { SectionKey } from "@/lib/sections";

export default function DeleteButton({
  section,
  id,
  title,
}: {
  section: SectionKey;
  id: string;
  title: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        startTransition(() => deleteRecord(section, id));
      }}
      className="text-rose-600 font-bold text-xs hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
