"use client";

import { useState } from "react";
import { saveRecord } from "@/app/admin/actions";
import type { SectionKey } from "@/lib/sections";
import { SECTION_FIELDS, SHARED_FIELDS, type FieldDef } from "@/lib/adminFields";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function RecordForm({
  section,
  record,
}: {
  section: SectionKey;
  record?: Record<string, any> | null;
}) {
  const fields = [...SECTION_FIELDS[section], ...SHARED_FIELDS];
  const originalSlug = record?.slug || "";
  const [slugChanged, setSlugChanged] = useState(false);
  const [metaTitleLen, setMetaTitleLen] = useState(
    (record?.meta_title || "").length
  );
  const [metaDescLen, setMetaDescLen] = useState(
    (record?.meta_description || "").length
  );

  return (
    <form
      action={saveRecord}
      onSubmit={(e) => {
        if (
          record &&
          slugChanged &&
          !confirm(
            "Changing the slug will 301-redirect the old URL to the new one automatically. Continue?"
          )
        ) {
          e.preventDefault();
        }
      }}
      className="max-w-2xl bg-white border border-slate-200 rounded-xl p-6"
    >
      <input type="hidden" name="section" value={section} />
      {record?.id && <input type="hidden" name="id" value={record.id} />}
      <input type="hidden" name="original_slug" value={originalSlug} />

      <div className="mb-5">
        <label className="block text-xs font-bold text-slate-600 mb-1">
          Slug
        </label>
        <input
          type="text"
          name="slug"
          defaultValue={originalSlug}
          onChange={() => setSlugChanged(true)}
          placeholder="auto-generated from title if left blank"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-adaBlue"
        />
        {slugChanged && record && (
          <p className="text-[11px] text-amber-600 font-semibold mt-1">
            This will create a redirect from the old URL when saved.
          </p>
        )}
      </div>

      {fields.map((field) => renderField(field, record, {
        metaTitleLen,
        setMetaTitleLen,
        metaDescLen,
        setMetaDescLen,
      }))}

      <button
        type="submit"
        className="w-full mt-2 bg-adaBlue hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-lg transition"
      >
        {record ? "Save Changes" : "Create"}
      </button>
    </form>
  );
}

function renderField(
  field: FieldDef,
  record: Record<string, any> | null | undefined,
  counters: {
    metaTitleLen: number;
    setMetaTitleLen: (n: number) => void;
    metaDescLen: number;
    setMetaDescLen: (n: number) => void;
  }
) {
  const defaultValue = record?.[field.name] ?? "";

  if (field.type === "richtext") {
    return (
      <RichTextEditor
        key={field.name}
        name={field.name}
        label={field.label}
        defaultValue={defaultValue}
        required={field.required}
      />
    );
  }

  if (field.type === "image") {
    return (
      <ImageUploadField
        key={field.name}
        name={field.name}
        label={field.label}
        defaultUrl={defaultValue}
      />
    );
  }

  if (field.type === "select") {
    return (
      <div key={field.name} className="mb-5">
        <label className="block text-xs font-bold text-slate-600 mb-1">
          {field.label} {field.required && <span className="text-rose-500">*</span>}
        </label>
        <select
          name={field.name}
          defaultValue={defaultValue || field.options?.[0]?.value}
          required={field.required}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-adaBlue"
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "date") {
    return (
      <div key={field.name} className="mb-5">
        <label className="block text-xs font-bold text-slate-600 mb-1">
          {field.label}
        </label>
        <input
          type="date"
          name={field.name}
          defaultValue={defaultValue}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-adaBlue"
        />
      </div>
    );
  }

  if (field.type === "textarea") {
    const isMetaDesc = field.name === "meta_description";
    return (
      <div key={field.name} className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-bold text-slate-600">
            {field.label} {field.required && <span className="text-rose-500">*</span>}
          </label>
          {isMetaDesc && (
            <span
              className={`text-[10px] font-bold ${
                counters.metaDescLen > 155 ? "text-rose-500" : "text-slate-400"
              }`}
            >
              {counters.metaDescLen}/155
            </span>
          )}
        </div>
        <textarea
          name={field.name}
          defaultValue={defaultValue}
          required={field.required}
          rows={4}
          onChange={
            isMetaDesc
              ? (e) => counters.setMetaDescLen(e.target.value.length)
              : undefined
          }
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-adaBlue"
        />
        {field.help && !isMetaDesc && (
          <p className="text-[10px] text-slate-400 mt-1">{field.help}</p>
        )}
      </div>
    );
  }

  // text
  const isMetaTitle = field.name === "meta_title";
  return (
    <div key={field.name} className="mb-5">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-bold text-slate-600">
          {field.label} {field.required && <span className="text-rose-500">*</span>}
        </label>
        {isMetaTitle && (
          <span
            className={`text-[10px] font-bold ${
              counters.metaTitleLen > 60 ? "text-rose-500" : "text-slate-400"
            }`}
          >
            {counters.metaTitleLen}/60
          </span>
        )}
      </div>
      <input
        type="text"
        name={field.name}
        defaultValue={defaultValue}
        required={field.required}
        onChange={
          isMetaTitle
            ? (e) => counters.setMetaTitleLen(e.target.value.length)
            : undefined
        }
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-adaBlue"
      />
    </div>
  );
}
