import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import * as tebex from "@/lib/tebex";
import type { TebexBasket } from "@/lib/types";

const COOKIE = "mm_basket";

function siteUrl(req: NextRequest) {
  return (process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin).replace(/\/$/, "");
}

async function existingBasket(): Promise<TebexBasket | null> {
  const ident = (await cookies()).get(COOKIE)?.value;
  if (!ident) return null;
  try {
    const basket = await tebex.getBasket(ident);
    return basket.complete ? null : basket; // paid baskets can't be reused
  } catch {
    return null;
  }
}

async function ensureBasket(req: NextRequest) {
  const found = await existingBasket();
  if (found) return found;
  const basket = await tebex.createBasket(siteUrl(req));
  (await cookies()).set(COOKIE, basket.ident, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return basket;
}

const fail = (message: string, status = 400, extra: object = {}) =>
  NextResponse.json({ error: message, ...extra }, { status });

export async function GET() {
  if (!tebex.isLive()) return NextResponse.json({ basket: null, live: false });
  return NextResponse.json({ basket: await existingBasket(), live: true });
}

type Body =
  | { action: "add"; packageId: number; quantity?: number; type?: "single" | "subscription" }
  | { action: "remove"; packageId: number }
  | { action: "quantity"; packageId: number; quantity: number }
  | { action: "coupon"; code: string }
  | { action: "uncoupon"; code: string }
  | { action: "login"; returnUrl: string }
  | { action: "reset" };

export async function POST(req: NextRequest) {
  if (!tebex.isLive()) {
    return fail("The store isn't connected to Tebex yet. Add TEBEX_PUBLIC_TOKEN to your environment.", 503);
  }

  const body = (await req.json()) as Body;

  try {
    switch (body.action) {
      case "login": {
        const basket = await ensureBasket(req);
        // Only allow returning to our own site.
        const back = body.returnUrl?.startsWith(siteUrl(req)) ? body.returnUrl : siteUrl(req);
        const links = await tebex.getAuthLinks(basket.ident, back);
        if (!links.length) return fail("No login providers are configured for this store.");
        return NextResponse.json({ url: links[0].url, providers: links });
      }

      case "add": {
        const basket = await ensureBasket(req);
        if (!basket.username_id) return fail("Log in with Cfx.re to add items.", 401, { needsAuth: true });
        const updated = await tebex.addPackage(basket.ident, body.packageId, body.quantity ?? 1, body.type);
        return NextResponse.json({ basket: updated });
      }

      case "reset": {
        (await cookies()).delete(COOKIE);
        return NextResponse.json({ basket: null });
      }
    }

    const basket = await existingBasket();
    if (!basket) return fail("Your basket has expired. Please add your items again.", 404);

    switch (body.action) {
      case "remove":
        return NextResponse.json({ basket: await tebex.removePackage(basket.ident, body.packageId) });
      case "quantity":
        return NextResponse.json({
          basket:
            body.quantity < 1
              ? await tebex.removePackage(basket.ident, body.packageId)
              : await tebex.updateQuantity(basket.ident, body.packageId, body.quantity),
        });
      case "coupon":
        return NextResponse.json({ basket: await tebex.applyCoupon(basket.ident, body.code.trim()) });
      case "uncoupon":
        return NextResponse.json({ basket: await tebex.removeCoupon(basket.ident, body.code) });
      default:
        return fail("Unknown action");
    }
  } catch (err) {
    if (err instanceof tebex.TebexError) {
      const needsAuth = /log ?in|auth/i.test(err.message);
      return fail(err.message, needsAuth ? 401 : err.status >= 500 ? 502 : 400, { needsAuth });
    }
    console.error(err);
    return fail("Something went wrong talking to Tebex.", 502);
  }
}
