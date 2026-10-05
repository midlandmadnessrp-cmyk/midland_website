"use client";

import { useState } from "react";
import { useBasket } from "./BasketProvider";
import { BagIcon, CheckIcon, MinusIcon, PlusIcon, RepeatIcon } from "./Icons";
import type { PackageType } from "@/lib/types";

interface Props {
  id: number;
  name: string;
  type: PackageType;
  disableQuantity?: boolean;
  full?: boolean; // detail page: show type toggle + quantity
  className?: string;
  label?: string;
}

export function AddToBasket({ id, name, type, disableQuantity, full, className = "", label }: Props) {
  const { add, busy } = useBasket();
  const [mode, setMode] = useState<"single" | "subscription">(type === "subscription" ? "subscription" : "single");
  const [qty, setQty] = useState(1);
  const [pending, setPending] = useState(false);
  const [added, setAdded] = useState(false);
  const sub = mode === "subscription";

  const onClick = async () => {
    // In demo mode (no Tebex token) the API answers with a friendly "not connected" toast.
    setPending(true);
    const ok = await add(id, name, { type: type === "both" ? mode : undefined, quantity: full && !disableQuantity && !sub ? qty : undefined });
    setPending(false);
    if (ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  };

  return (
    <div className={full ? "space-y-4" : ""}>
      {full && type === "both" && (
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-line bg-black/40 p-1">
          {(["single", "subscription"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md py-2.5 text-xs font-bold tracking-[0.16em] uppercase transition ${
                mode === m ? "bg-neon text-ink shadow-[0_0_20px_-4px_#3dff5a]" : "text-white/60 hover:text-white"
              }`}
            >
              {m === "single" ? "One-off" : "Monthly"}
            </button>
          ))}
        </div>
      )}

      <div className={full ? "flex gap-3" : ""}>
        {full && !disableQuantity && !sub && (
          <div className="flex items-center rounded-md border border-line bg-black/40">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-full w-11 place-items-center hover:text-neon" aria-label="Decrease">
              <MinusIcon />
            </button>
            <span className="w-8 text-center font-bold">{qty}</span>
            <button onClick={() => setQty((q) => Math.min(10, q + 1))} className="grid h-full w-11 place-items-center hover:text-neon" aria-label="Increase">
              <PlusIcon />
            </button>
          </div>
        )}
        <button
          onClick={onClick}
          disabled={busy}
          aria-busy={pending}
          className={`btn btn-neon group/add ${added ? "btn-added" : ""} ${full ? "flex-1 !py-4 text-sm" : ""} ${className}`}
        >
          {pending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : added ? (
            <CheckIcon />
          ) : sub ? (
            <RepeatIcon className="h-4 w-4 transition-transform duration-500 group-hover/add:rotate-180" />
          ) : (
            <BagIcon className="h-4 w-4 transition-transform duration-300 group-hover/add:-translate-y-0.5 group-hover/add:scale-110" />
          )}
          {pending ? "Adding…" : added ? "Added" : label ?? (sub ? "Subscribe" : "Add to basket")}
        </button>
      </div>
    </div>
  );
}
