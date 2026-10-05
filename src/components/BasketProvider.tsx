"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { TebexBasket } from "@/lib/types";

type Toast = { id: number; tone: "ok" | "err"; text: string };
type AddOpts = { quantity?: number; type?: "single" | "subscription" };

interface BasketCtx {
  basket: TebexBasket | null;
  live: boolean;
  busy: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  count: number;
  add: (packageId: number, name: string, opts?: AddOpts) => Promise<boolean>;
  remove: (packageId: number) => Promise<void>;
  setQuantity: (packageId: number, quantity: number) => Promise<void>;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: (code: string) => Promise<void>;
  login: (returnUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkout: () => void;
  toasts: Toast[];
}

const Ctx = createContext<BasketCtx | null>(null);

export function useBasket() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBasket must be used inside <BasketProvider>");
  return ctx;
}

async function post(body: object) {
  const res = await fetch("/api/basket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export function BasketProvider({ children }: { children: ReactNode }) {
  const [basket, setBasket] = useState<TebexBasket | null>(null);
  const [live, setLive] = useState(true);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const toast = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, tone, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const login = useCallback(
    async (returnUrl?: string) => {
      setBusy(true);
      const { ok, data } = await post({ action: "login", returnUrl: returnUrl ?? window.location.href });
      if (ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setBusy(false);
      toast(data.error ?? "Couldn't start login.", "err");
    },
    [toast],
  );

  const add = useCallback(
    async (packageId: number, name: string, opts: AddOpts = {}) => {
      setBusy(true);
      const { ok, data } = await post({ action: "add", packageId, ...opts });
      if (ok) {
        setBasket(data.basket);
        setBusy(false);
        setOpen(true);
        toast(`${name} added to your basket`);
        return true;
      }
      if (data.needsAuth) {
        // Send them to Cfx.re, then come back and finish adding this package.
        const back = new URL(window.location.href);
        back.searchParams.set("add", String(packageId));
        if (opts.type) back.searchParams.set("type", opts.type);
        if (opts.quantity && opts.quantity > 1) back.searchParams.set("qty", String(opts.quantity));
        toast("Log in with Cfx.re to continue…");
        await login(back.toString());
        return false;
      }
      setBusy(false);
      toast(data.error ?? "Couldn't add that package.", "err");
      return false;
    },
    [login, toast],
  );

  const mutate = useCallback(
    async (body: object, okMsg?: string) => {
      setBusy(true);
      const { ok, data } = await post(body);
      setBusy(false);
      if (ok) {
        setBasket(data.basket);
        if (okMsg) toast(okMsg);
      } else toast(data.error ?? "Something went wrong.", "err");
      return ok;
    },
    [toast],
  );

  // Initial load + finish an "add" that was interrupted by the Cfx.re login redirect.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/basket", { cache: "no-store" }).then((r) => r.json()).catch(() => null);
      if (cancelled || !res) return;
      setBasket(res.basket);
      setLive(res.live);

      const url = new URL(window.location.href);
      const pending = url.searchParams.get("add");
      if (url.searchParams.get("checkout") === "cancelled") toast("Checkout cancelled — your basket is saved.");
      if (pending || url.searchParams.has("checkout")) {
        const type = url.searchParams.get("type") as AddOpts["type"] | null;
        const qty = Number(url.searchParams.get("qty")) || undefined;
        ["add", "type", "qty", "checkout"].forEach((k) => url.searchParams.delete(k));
        window.history.replaceState(null, "", url.toString());
        if (pending && res.basket?.username_id) await add(Number(pending), "Package", { type: type ?? undefined, quantity: qty });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [add, toast]);

  const value: BasketCtx = {
    basket,
    live,
    busy,
    open,
    setOpen,
    count: basket?.packages.reduce((n, p) => n + p.in_basket.quantity, 0) ?? 0,
    add,
    remove: async (packageId) => void (await mutate({ action: "remove", packageId }, "Removed from basket")),
    setQuantity: async (packageId, quantity) => void (await mutate({ action: "quantity", packageId, quantity })),
    applyCoupon: (code) => mutate({ action: "coupon", code }, "Coupon applied"),
    removeCoupon: async (code) => void (await mutate({ action: "uncoupon", code })),
    login,
    logout: async () => {
      await post({ action: "reset" });
      setBasket(null);
      toast("Logged out");
    },
    checkout: () => {
      if (basket?.links.checkout) window.location.href = basket.links.checkout;
    },
    toasts,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
