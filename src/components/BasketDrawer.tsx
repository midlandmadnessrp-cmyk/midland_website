"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useBasket } from "./BasketProvider";
import { money } from "@/lib/format";
import { BagIcon, CloseIcon, LockIcon, MinusIcon, PlusIcon, TrashIcon, UserIcon } from "./Icons";

export function BasketDrawer({ artByPackage }: { artByPackage: Record<number, string | null> }) {
  const { open, setOpen, basket, busy, remove, setQuantity, applyCoupon, removeCoupon, checkout, login, live, count } = useBasket();
  const [code, setCode] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const items = basket?.packages ?? [];
  const currency = basket?.currency ?? "GBP";

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        aria-label="Basket"
        aria-hidden={!open}
        inert={!open}
        className={`fixed top-0 right-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-line bg-panel shadow-[-30px_0_80px_-20px_rgba(61,255,90,0.25)] transition-transform duration-400 ease-[cubic-bezier(.2,.8,.2,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <p className="eyebrow text-neon">Your basket</p>
            <p className="mt-1 text-xl font-black italic uppercase">
              {count} {count === 1 ? "item" : "items"}
            </p>
          </div>
          <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-md text-white/70 hover:bg-white/5 hover:text-white" aria-label="Close basket">
            <CloseIcon />
          </button>
        </div>

        {basket?.username && (
          <div className="flex items-center gap-2 border-b border-line bg-neon/5 px-6 py-3 text-xs text-white/70">
            <UserIcon className="h-3.5 w-3.5 text-neon" /> Buying for <span className="font-bold text-white">{basket.username}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-5 grid h-20 w-20 place-items-center rounded-full border border-line bg-neon/5 text-neon">
                <BagIcon className="h-8 w-8" />
              </div>
              <p className="text-lg font-black italic uppercase">Your basket is empty</p>
              <p className="mt-2 max-w-xs text-sm text-mute">Pick a pack or membership to support the city and unlock your perks.</p>
              {live && !basket?.username && (
                <button onClick={() => login()} disabled={busy} className="btn btn-ghost mt-6">
                  <UserIcon /> Log in with Cfx.re
                </button>
              )}
              <button onClick={() => setOpen(false)} className="mt-4 text-xs font-bold tracking-[0.2em] text-neon uppercase hover:underline">
                Browse the store
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((p) => {
                const art = artByPackage[p.id] ?? p.image;
                return (
                  <li key={p.id} className="frame">
                    <div className="frame-in flex gap-4 p-3">
                      <div className="chamfer relative h-24 w-20 shrink-0 overflow-hidden bg-black [--c:8px]">
                        {art && <Image src={art} alt="" fill sizes="80px" className="object-cover object-top" />}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate font-extrabold uppercase italic">{p.name}</p>
                          <button onClick={() => remove(p.id)} disabled={busy} className="text-white/55 hover:text-red-400" aria-label={`Remove ${p.name}`}>
                            <TrashIcon />
                          </button>
                        </div>
                        <p className="mt-1 text-lg font-black text-neon">{money(p.in_basket.price * p.in_basket.quantity, currency)}</p>
                        <div className="mt-auto flex items-center gap-1">
                          <button
                            onClick={() => setQuantity(p.id, p.in_basket.quantity - 1)}
                            disabled={busy}
                            className="grid h-7 w-7 place-items-center rounded border border-line hover:border-neon hover:text-neon"
                            aria-label="Decrease quantity"
                          >
                            <MinusIcon className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{p.in_basket.quantity}</span>
                          <button
                            onClick={() => setQuantity(p.id, p.in_basket.quantity + 1)}
                            disabled={busy}
                            className="grid h-7 w-7 place-items-center rounded border border-line hover:border-neon hover:text-neon"
                            aria-label="Increase quantity"
                          >
                            <PlusIcon className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && basket && (
          <div className="border-t border-line bg-ink/60 px-6 py-5">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (code.trim() && (await applyCoupon(code))) setCode("");
              }}
              className="mb-4 flex gap-2"
            >
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Coupon code"
                className="min-w-0 flex-1 rounded-md border border-line bg-black/50 px-3 py-2.5 text-sm uppercase placeholder:text-white/50 focus:border-neon focus:outline-none"
              />
              <button disabled={busy || !code.trim()} className="btn btn-ghost !px-4 !py-2.5">
                Apply
              </button>
            </form>

            {basket.coupons.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {basket.coupons.map((c) => (
                  <button
                    key={c.coupon_code}
                    onClick={() => removeCoupon(c.coupon_code)}
                    className="rounded-full border border-neon/50 bg-neon/10 px-3 py-1 text-xs font-bold text-neon"
                    title="Remove coupon"
                  >
                    {c.coupon_code} ✕
                  </button>
                ))}
              </div>
            )}

            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between text-white/60">
                <dt>Subtotal</dt>
                <dd>{money(basket.base_price, currency)}</dd>
              </div>
              {basket.sales_tax > 0 && (
                <div className="flex justify-between text-white/60">
                  <dt>Tax</dt>
                  <dd>{money(basket.sales_tax, currency)}</dd>
                </div>
              )}
              <div className="flex items-end justify-between pt-2">
                <dt className="eyebrow text-white/80">Total</dt>
                <dd className="text-3xl font-black italic neon-text">{money(basket.total_price, currency)}</dd>
              </div>
            </dl>

            <button onClick={checkout} disabled={busy} className="btn btn-neon mt-5 w-full !py-4 text-sm">
              <LockIcon /> Secure checkout
            </button>
            <p className="mt-3 text-center text-[0.7rem] text-white/55">Payments are processed securely by Tebex.</p>
          </div>
        )}
      </aside>
    </>
  );
}
