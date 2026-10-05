"use client";

import { useBasket } from "./BasketProvider";
import { CheckIcon, CloseIcon } from "./Icons";

export function Toasts() {
  const { toasts } = useBasket();
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex w-[min(92vw,26rem)] -translate-x-1/2 flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`chamfer flex items-center gap-3 border px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur-xl [--c:8px] animate-[float_0.4s_ease-out] ${
            t.tone === "ok" ? "border-neon/50 bg-[#061a09]/95 text-white" : "border-red-500/50 bg-[#1a0606]/95 text-red-100"
          }`}
        >
          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${t.tone === "ok" ? "bg-neon text-ink" : "bg-red-500 text-white"}`}>
            {t.tone === "ok" ? <CheckIcon className="h-3.5 w-3.5" /> : <CloseIcon className="h-3.5 w-3.5" />}
          </span>
          {t.text}
        </div>
      ))}
    </div>
  );
}
