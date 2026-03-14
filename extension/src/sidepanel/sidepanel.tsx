import { useEffect } from "react";
import { createRoot } from "react-dom/client";

const SidePanel = () => {
  useEffect(() => {
    // Connect to background so it can track our lifecycle reliably
    const port = chrome.runtime.connect({ name: "lia-sidepanel" });

    const messageListener = (message: any) => {
      if (message.action === "closeSidePanel") {
        window.close();
      }
    };
    chrome.runtime.onMessage.addListener(messageListener);
    
    // Cleanup on unmount
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
      port.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0a66c2, #004182)",
          color: "white",
          padding: "16px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
          <circle cx="16" cy="4" r="2" fill="currentColor" />
          <path d="M12 8a4 4 0 0 1 4-4" stroke="currentColor" />
        </svg>
        <span style={{ fontWeight: 600, fontSize: "16px" }}>
          LIA Side Panel
        </span>
      </div>

      <div
        style={{
          flex: 1,
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px",
          border: "1px solid #dee2e6",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <p style={{ color: "#495057", lineHeight: 1.5 }}>
          The side panel is ready. We will migrate the chatbot window interface
          here soon!
        </p>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<SidePanel />);
}
