"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      closeButton
      position="top-right"
      richColors
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm",
          title: "text-sm font-semibold",
          description: "text-sm text-slate-600",
          actionButton:
            "rounded-xl bg-slate-900 text-slate-50 transition-all duration-200 ease-out active:scale-95",
          cancelButton:
            "rounded-xl border border-slate-200 bg-white text-slate-700 transition-all duration-200 ease-out active:scale-95",
        },
      }}
    />
  );
}
