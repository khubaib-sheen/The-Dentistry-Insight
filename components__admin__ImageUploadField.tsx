"use client";

import { useState } from "react";
import Image from "next/image";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function ImageUploadField({
  name,
  label,
  defaultUrl,
}: {
  name: string;
  label: string;
  defaultUrl?: string | null;
}) {
  const [url, setUrl] = useState(defaultUrl || "");
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!alt.trim()) {
      setError("Add alt text before uploading — required for every image.");
      e.target.value = "";
      return;
    }

    setError(null);
    setUploading(true);
    const supabase = getSupabaseBrowserClient();
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;

    const { error: uploadError } = await supabase.storage
      .from("content-images")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("content-images").getPublicUrl(path);
    setUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="mb-5">
      <label className="block text-xs font-bold text-slate-600 mb-1">
        {label}
      </label>

      {url && (
        <div className="relative w-full h-40 bg-slate-100 rounded-lg overflow-hidden mb-2">
          <Image src={url} alt={alt || "preview"} fill className="object-cover" />
        </div>
      )}

      <input
        type="text"
        placeholder="Alt text (required before upload)"
        value={alt}
        onChange={(e) => setAlt(e.target.value)}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-adaBlue"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={uploading}
        className="text-xs"
      />

      {uploading && <p className="text-xs text-slate-400 mt-1">Uploading…</p>}
      {error && <p className="text-xs text-rose-600 mt-1 font-semibold">{error}</p>}

      {/* Hidden fields actually submitted with the form */}
      <input type="hidden" name={name} value={url} />
      <input type="hidden" name={`${name}_alt`} value={alt} />
    </div>
  );
}
