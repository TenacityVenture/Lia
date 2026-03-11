import React, { useEffect, useState } from "react";

interface ToolbarProps {
  onFormat: (type: string) => void;
  onTransform: (type: string) => void;
  onRewrite: () => void;
}

export const TextSelectionToolbar: React.FC<ToolbarProps> = ({
  onFormat,
  onTransform,
  onRewrite,
}) => {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();

      if (selectedText && selectedText.length > 0) {
        // Check if we're in a LinkedIn editor
        const activeElement = document.activeElement;
        const isInEditor =
          activeElement &&
          (activeElement.classList.contains("ql-editor") ||
            activeElement.closest(".ql-editor") ||
            activeElement.closest(".share-box") ||
            activeElement.closest(".comments-comment-texteditor"));

        if (isInEditor) {
          const range = selection!.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          setPosition({
            left: rect.left + window.scrollX + rect.width / 2,
            top: rect.top + window.scrollY - 50,
          });
          return;
        }
      }
      setPosition(null);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const toolbar = document.getElementById("linkedin-ai-text-toolbar");
      if (toolbar && !toolbar.contains(e.target as Node)) {
        setPosition(null);
      }
    };

    document.addEventListener("mouseup", handleTextSelection);
    document.addEventListener("keyup", handleTextSelection);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
      document.removeEventListener("keyup", handleTextSelection);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  if (!position) return null;

  const buttons = [
    {
      id: "bold",
      icon: "B",
      title: "Make Bold",
      style: { fontWeight: 700, fontSize: "14px" },
      action: () => onFormat("bold"),
    },
    {
      id: "italic",
      icon: "I",
      title: "Make Italic",
      style: { fontStyle: "italic", fontSize: "14px" },
      action: () => onFormat("italic"),
    },
    { id: "divider1", type: "divider" },
    {
      id: "ai-rewrite",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0a66c2"
          strokeWidth="2"
        >
          <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
        </svg>
      ),
      title: "AI Rewrite Paragraph",
      action: onRewrite,
    },
    {
      id: "shorten",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0a66c2"
          strokeWidth="2"
        >
          <path d="M8 18L12 6l4 12" />
          <path d="M9.5 12h5" />
        </svg>
      ),
      title: "Make Shorter",
      action: () => onTransform("shorten"),
    },
    {
      id: "expand",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0a66c2"
          strokeWidth="2"
        >
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      ),
      title: "Expand Text",
      action: () => onTransform("expand"),
    },
    { id: "divider2", type: "divider" },
    {
      id: "professional",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0a66c2"
          strokeWidth="2"
        >
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
      ),
      title: "Make Professional",
      action: () => onTransform("professional"),
    },
    {
      id: "emoji",
      icon: "😊",
      title: "Add Emojis",
      style: { fontSize: "14px" },
      action: () => onTransform("emoji"),
    },
    {
      id: "grammar",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0a66c2"
          strokeWidth="2"
        >
          <path d="M9 12l2 2 4-4" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
      title: "Fix Grammar",
      action: () => onTransform("grammar"),
    },
  ];

  return (
    <div
      id="linkedin-ai-text-toolbar"
      className="linkedin-ai-text-toolbar"
      style={{
        position: "absolute",
        background: "white",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        padding: "8px",
        display: "flex",
        zIndex: 10000,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        gap: "4px",
        alignItems: "center",
        backdropFilter: "blur(10px)",
        left: position.left,
        top: position.top,
        transform: "translateX(-50%)",
      }}
    >
      <div
        className="toolbar-logo"
        style={{
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a66c2, #004182)",
          borderRadius: "8px 0 0 8px",
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <svg
          className="lia-logo"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
          <circle cx="16" cy="4" r="2" fill="#ffffff" />
          <path d="M12 8a4 4 0 0 1 4-4" stroke="#ffffff" />
        </svg>
      </div>

      {buttons.map((btn, idx) => {
        if (btn.type === "divider") {
          return (
            <div
              key={idx}
              style={{
                width: "1px",
                height: "20px",
                background: "#e0e0e0",
                margin: "0 4px",
              }}
            />
          );
        }

        return (
          <button
            key={btn.id}
            className="linkedin-ai-toolbar-btn"
            title={btn.title}
            style={{
              background: "none",
              border: "none",
              padding: "6px 8px",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s",
              color: "#0a66c2",
              ...(btn.style || {}),
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#e7f3ff")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (btn.action) btn.action();
            }}
          >
            {btn.icon}
          </button>
        );
      })}
    </div>
  );
};
