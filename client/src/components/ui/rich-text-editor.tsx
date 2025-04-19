"use client";

import React, { useEffect, useState, useCallback, memo, useRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Code, Quote } from "lucide-react";
import { cn } from "@/libs/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Memoized toolbar button to prevent unnecessary re-renders
const ToolbarButton = memo(
  ({
    onClick,
    isActive = false,
    disabled = false,
    children,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition-colors",
        isActive && "bg-gray-200 text-primary",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  )
);

ToolbarButton.displayName = "ToolbarButton";

// Memoized toolbar to prevent unnecessary re-renders
const Toolbar = memo(({ editor }: { editor: Editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
      >
        <Bold size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
      >
        <Italic size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
      >
        <Heading1 size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
      >
        <Heading2 size={18} />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
      >
        <List size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
      >
        <ListOrdered size={18} />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
      >
        <Code size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
      >
        <Quote size={18} />
      </ToolbarButton>
    </div>
  );
});

Toolbar.displayName = "Toolbar";

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something...",
  className,
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Use a ref to store the latest content
  const contentRef = useRef(value);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized update handler with throttling
  const handleUpdate = useCallback(
    (html: string) => {
      contentRef.current = html;

      // Clear any existing timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Set a new timeout to update the parent component
      updateTimeoutRef.current = setTimeout(() => {
        onChange(contentRef.current);
      }, 250);
    },
    [onChange]
  );

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
        // Disable history as it can be performance intensive
        history: {
          depth: 10, // Reduce history depth
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm focus:outline-none w-full max-w-full p-3",
          !value &&
            "before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:pointer-events-none"
        ),
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      // Only update if content has actually changed
      const html = editor.getHTML();
      if (html !== contentRef.current) {
        handleUpdate(html);
      }
    },
  });

  // Handle SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update editor content when value changes externally
  // Use a ref to track if this is the initial render
  const isInitialRender = useRef(true);
  const isExternalUpdate = useRef(false);

  useEffect(() => {
    // Skip if this is the initial render or if the update is coming from the editor itself
    if (!editor || isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    // Only update if the value has actually changed and it's not from the editor
    if (editor.getHTML() !== value && !isExternalUpdate.current) {
      isExternalUpdate.current = true;
      // Use transaction for better performance
      editor.view.dispatch(
        editor.view.state.tr.setContent(
          editor.schema.nodeFromJSON({
            type: "doc",
            content: editor.schema
              .nodeFromJSON({
                type: "paragraph",
                content: value ? [{ type: "text", text: value }] : [],
              })
              .toJSON().content,
          })
        )
      );

      // Reset the flag after a short delay
      setTimeout(() => {
        isExternalUpdate.current = false;
      }, 10);
    }
  }, [editor, value]);

  if (!isMounted) {
    return (
      <div className={cn("border border-gray-300 rounded-md min-h-64 w-full", className)}>
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
          {/* Toolbar placeholder */}
          <div className="h-8 flex gap-1">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="w-8 h-8 rounded bg-gray-200" />
              ))}
          </div>
        </div>
        <div className="p-3 text-gray-400">{placeholder}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border border-gray-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-primary",
        className
      )}
    >
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} className="min-h-64 max-h-96 overflow-y-auto" />
    </div>
  );
}
