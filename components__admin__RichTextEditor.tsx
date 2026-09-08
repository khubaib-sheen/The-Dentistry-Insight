"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import { useState } from "react";

export default function RichTextEditor({
  name,
  label,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  const [html, setHtml] = useState(defaultValue || "");
  const [showPreview, setShowPreview] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Link, TiptapImage],
    content: defaultValue || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[220px] px-3 py-2 focus:outline-none",
      },
    },
  });

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-bold text-slate-600">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className="text-[11px] font-semibold text-adaBlue hover:underline"
        >
          {showPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {editor && (
        <div className="flex flex-wrap gap-1.5 border border-b-0 border-slate-300 rounded-t-lg bg-slate-50 px-2 py-1.5">
          <ToolbarButton
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            label="B"
          />
          <ToolbarButton
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            label="I"
          />
          <ToolbarButton
            active={editor.isActive("heading", { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            label="H2"
          />
          <ToolbarButton
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            label="• List"
          />
          <ToolbarButton
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            label="1. List"
          />
          <ToolbarButton
            active={editor.isActive("link")}
            onClick={() => {
              const url = window.prompt("Link URL");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            label="Link"
          />
        </div>
      )}

      <div className="border border-slate-300 rounded-b-lg bg-white">
        {showPreview ? (
          <div
            className="prose prose-sm max-w-none min-h-[220px] px-3 py-2"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      <input type="hidden" name={name} value={html} required={required} />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 text-[11px] font-bold rounded ${
        active ? "bg-adaBlue text-white" : "bg-white text-slate-600 border border-slate-200"
      }`}
    >
      {label}
    </button>
  );
}
