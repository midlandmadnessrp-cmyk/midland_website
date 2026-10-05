"use client";

import { useEffect, useState } from "react";
import { useBasket } from "./BasketProvider";
import { BagIcon } from "./Icons";
import { money } from "@/lib/format";

/** Sticky category bar under the header, highlights the section in view. */
export function StoreTabs({ tabs }: { tabs: { id: string; label: string; count?: number }[] }) {
  const { count, basket, setOpen } = useBasket();
  const [active, setActive] = useState(tabs[0]?.id);

  useEffect(() => {
    const els = tabs.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-160px 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [tabs]);

  return (
    <div className="sticky top-20 z-30 border-y border-line bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6">
        <nav className="-mx-1 flex flex-1 gap-1 overflow-x-auto py-2.5 [scrollbar-width:none]">
          {tabs.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className={`flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-[0.72rem] font-bold tracking-[0.16em] uppercase transition ${
                active === t.id ? "bg-neon text-ink shadow-[0_0_20px_-4px_#3dff5a]" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span className={`rounded px-1.5 text-[0.62rem] ${active === t.id ? "bg-ink/20" : "bg-white/10"}`}>{t.count}</span>
              )}
            </a>
          ))}
        </nav>
        <button
          onClick={() => setOpen(true)}
          className="hidden shrink-0 items-center gap-3 rounded-md border border-line px-4 py-2 text-xs font-bold transition hover:border-neon/60 sm:flex"
        >
          <BagIcon className="h-4 w-4 text-neon" />
          <span className="text-white/60">{count} items</span>
          <span className="text-neon">{money(basket?.total_price ?? 0, basket?.currency ?? "GBP")}</span>
        </button>
      </div>
    </div>
  );
}
