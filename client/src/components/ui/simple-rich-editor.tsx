"use client";

import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import { cn } from "@/libs/utils";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface SimpleRichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Simple lightweight rich text editor without external dependencies
export function SimpleRichEditor({
  value,
  onChange,
  placeholder = "Write something...",
  className,
}: SimpleRichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeStyles, setActiveStyles] = useState<Record<string, boolean>>({});

  // Check for active styles - defined before it's used in other hooks
  const checkActiveStyles = useCallback(() => {
    if (typeof document === "undefined") return;

    try {
      // Make sure we have focus for accurate command state
      if (editorRef.current && document.activeElement !== editorRef.current) {
        // Don't focus here as it can interfere with user actions
        // Just return the current state
        return;
      }

      // Get the current selection
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      // Check if the selection is within our editor
      const range = selection.getRangeAt(0);
      if (!editorRef.current?.contains(range.commonAncestorContainer)) return;

      // Now check the command states
      setActiveStyles({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        h1:
          document.queryCommandValue("formatBlock").toLowerCase() === "h1" ||
          document.queryCommandValue("formatBlock").toLowerCase() === "<h1>",
        h2:
          document.queryCommandValue("formatBlock").toLowerCase() === "h2" ||
          document.queryCommandValue("formatBlock").toLowerCase() === "<h2>",
        ul: document.queryCommandState("insertUnorderedList"),
        ol: document.queryCommandState("insertOrderedList"),
        alignLeft: document.queryCommandState("justifyLeft"),
        alignCenter: document.queryCommandState("justifyCenter"),
        alignRight: document.queryCommandState("justifyRight"),
      });
    } catch (error) {
      // Silently handle any errors that might occur
      // We don't need to log this as it's not critical
    }
  }, []);

  // Simple content change handler
  const handleInput = useCallback(() => {
    if (!editorRef.current) return;

    // Get the current content
    const html = editorRef.current.innerHTML;

    // Update the parent component
    onChange(html);

    // Check for active styles
    checkActiveStyles();
  }, [onChange, checkActiveStyles]);

  // Execute command on the contentEditable div
  const execCommand = useCallback(
    (command: string, value: string = "") => {
      // Make sure the editor is focused first
      if (editorRef.current && document.activeElement !== editorRef.current) {
        editorRef.current.focus();
      }

      // Use a small timeout to ensure focus is established
      setTimeout(() => {
        // Execute the command
        document.execCommand(command, false, value);

        // Update the content and check styles
        handleInput();
        checkActiveStyles();

        // Keep focus on the editor
        editorRef.current?.focus();
      }, 0);
    },
    [handleInput, checkActiveStyles]
  );

  // Initialize editor content - simplified to avoid issues
  useEffect(() => {
    if (editorRef.current) {
      // Only update if the content is different to avoid cursor jumping
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value]);

  // Initial setup
  useEffect(() => {
    // Initial check for active styles - only run on client side
    if (typeof document !== "undefined") {
      // Ensure the editor is ready for commands
      if (editorRef.current) {
        // Set initial focus to make commands work on first click
        editorRef.current.focus();

        // Create a selection if there isn't one
        const selection = window.getSelection();
        if (selection && (!selection.rangeCount || !selection.toString())) {
          const range = document.createRange();
          range.setStart(editorRef.current, 0);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }

        // Check active styles
        checkActiveStyles();
      }
    }

    // Add a click handler to the document to ensure we can check styles when clicking outside
    const handleDocumentClick = () => {
      if (document.activeElement !== editorRef.current) {
        checkActiveStyles();
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [checkActiveStyles]);

  // Format buttons
  const ToolbarButton = memo(
    ({
      onClick,
      children,
      title,
      isActive = false,
    }: {
      onClick: () => void;
      children: React.ReactNode;
      title: string;
      isActive?: boolean;
    }) => (
      <button
        type="button"
        onClick={onClick}
        title={title}
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition-colors",
          isActive && "bg-gray-200 text-primary"
        )}
      >
        {children}
      </button>
    )
  );

  ToolbarButton.displayName = "ToolbarButton";

  return (
    <div
      className={cn(
        "border border-gray-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-primary",
        className
      )}
    >
      {/* Simple toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <ToolbarButton
          onClick={() => execCommand("bold")}
          title="Bold"
          isActive={activeStyles.bold}
        >
          <Bold size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => execCommand("italic")}
          title="Italic"
          isActive={activeStyles.italic}
        >
          <Italic size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => execCommand("formatBlock", "<h1>")}
          title="Heading 1"
          isActive={activeStyles.h1}
        >
          <Heading1 size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => execCommand("formatBlock", "<h2>")}
          title="Heading 2"
          isActive={activeStyles.h2}
        >
          <Heading2 size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

        <ToolbarButton
          onClick={() => execCommand("insertUnorderedList")}
          title="Bullet List"
          isActive={activeStyles.ul}
        >
          <List size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => execCommand("insertOrderedList")}
          title="Numbered List"
          isActive={activeStyles.ol}
        >
          <ListOrdered size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

        <ToolbarButton
          onClick={() => execCommand("justifyLeft")}
          title="Align Left"
          isActive={activeStyles.alignLeft}
        >
          <AlignLeft size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => execCommand("justifyCenter")}
          title="Align Center"
          isActive={activeStyles.alignCenter}
        >
          <AlignCenter size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => execCommand("justifyRight")}
          title="Align Right"
          isActive={activeStyles.alignRight}
        >
          <AlignRight size={18} />
        </ToolbarButton>
      </div>

      {/* Editable content area */}
      <div
        ref={editorRef}
        contentEditable
        className="prose prose-sm min-h-64 max-h-96 overflow-y-auto p-3 focus:outline-none w-full"
        onInput={handleInput}
        onBlur={handleInput}
        onKeyUp={checkActiveStyles}
        onMouseUp={checkActiveStyles}
        onFocus={checkActiveStyles}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
}
