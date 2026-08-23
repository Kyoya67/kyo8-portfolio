"use client";

import { useEffect } from "react";
import { PanelFrame } from "@kyo8/ui";

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm animate-fade-up">
        <PanelFrame className="bg-bg-elevated">
          <div className="flex items-center justify-between gap-4 border-b border-border-strong px-6 py-4">
            <h2 className="text-xs font-bold tracking-[0.15em] uppercase sm:text-sm">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-fg-dim transition-colors hover:text-fg cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="p-6">{children}</div>
        </PanelFrame>
      </div>
    </div>
  );
}
