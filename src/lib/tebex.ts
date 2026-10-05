import "server-only";
import type { AuthLink, TebexBasket, TebexCategory, TebexPackage, TebexWebstore } from "./types";

const API = "https://headless.tebex.io/api";

export const TOKEN = process.env.TEBEX_PUBLIC_TOKEN?.trim() || "";
export const isLive = () => TOKEN.length > 0;

export class TebexError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function call<T>(path: string, init: RequestInit & { revalidate?: number } = {}): Promise<T> {
  const { revalidate, ...rest } = init;
  const res = await fetch(`${API}${path}`, {
    ...rest,
    headers: { "Content-Type": "application/json", Accept: "application/json", ...rest.headers },
    ...(revalidate !== undefined ? { next: { revalidate } } : { cache: "no-store" }),
  });

  const text = await res.text();
  const body = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const msg = body?.detail || body?.message || body?.title || `Tebex request failed (${res.status})`;
    throw new TebexError(msg, res.status);
  }
  return body as T;
}

type Wrapped<T> = { data: T };

/* ---------- Catalog (cached for 60s) ---------- */

export async function getWebstore() {
  return (await call<Wrapped<TebexWebstore>>(`/accounts/${TOKEN}`, { revalidate: 60 })).data;
}

export async function getCategories() {
  return (await call<Wrapped<TebexCategory[]>>(`/accounts/${TOKEN}/categories?includePackages=1`, { revalidate: 60 })).data;
}

export async function getPackage(id: number | string) {
  return (await call<Wrapped<TebexPackage>>(`/accounts/${TOKEN}/packages/${id}`, { revalidate: 60 })).data;
}

/* ---------- Baskets (never cached) ---------- */

export async function createBasket(siteUrl: string) {
  return (
    await call<Wrapped<TebexBasket>>(`/accounts/${TOKEN}/baskets`, {
      method: "POST",
      body: JSON.stringify({
        complete_url: `${siteUrl}/checkout/complete`,
        cancel_url: `${siteUrl}/store?checkout=cancelled`,
        complete_auto_redirect: true,
      }),
    })
  ).data;
}

export async function getBasket(ident: string) {
  return (await call<Wrapped<TebexBasket>>(`/accounts/${TOKEN}/baskets/${ident}`)).data;
}

export async function getAuthLinks(ident: string, returnUrl: string) {
  const res = await call<AuthLink[] | Wrapped<AuthLink[]>>(
    `/accounts/${TOKEN}/baskets/${ident}/auth?returnUrl=${encodeURIComponent(returnUrl)}`,
  );
  return Array.isArray(res) ? res : res.data;
}

export async function addPackage(ident: string, packageId: number, quantity = 1, type?: "single" | "subscription") {
  return (
    await call<Wrapped<TebexBasket>>(`/baskets/${ident}/packages`, {
      method: "POST",
      body: JSON.stringify({ package_id: packageId, quantity, ...(type ? { type } : {}) }),
    })
  ).data;
}

export async function removePackage(ident: string, packageId: number) {
  return (
    await call<Wrapped<TebexBasket>>(`/baskets/${ident}/packages/remove`, {
      method: "POST",
      body: JSON.stringify({ package_id: packageId }),
    })
  ).data;
}

export async function updateQuantity(ident: string, packageId: number, quantity: number) {
  await call(`/baskets/${ident}/packages/${packageId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
  return getBasket(ident);
}

export async function applyCoupon(ident: string, code: string) {
  await call(`/accounts/${TOKEN}/baskets/${ident}/coupons`, {
    method: "POST",
    body: JSON.stringify({ coupon_code: code }),
  });
  return getBasket(ident);
}

export async function removeCoupon(ident: string, code: string) {
  await call(`/accounts/${TOKEN}/baskets/${ident}/coupons/remove`, {
    method: "POST",
    body: JSON.stringify({ coupon_code: code }),
  });
  return getBasket(ident);
}
