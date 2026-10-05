"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { useBasket } from "./BasketProvider";
import { BagIcon, DiscordIcon, UserIcon } from "./Icons";
import { DISCORD_URL } from "@/lib/site";

const SITE_NAV = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "The City" },
  { href: "/#join", label: "How to join" },
  { href: "/rules", label: "Rules" },
  { href: "/store", label: "Store" },
];

const STORE_NAV = [
  { href: "/", label: "Home" },
  { href: "/store", label: "Store" },
  { href: "/rules", label: "Rules" },
];

const isStoreRoute = (p: string) => p.startsWith("/store") || p.startsWith("/checkout") || p.startsWith("/terms");

export function Header() {
  const { count, setOpen, basket, login, logout, busy, live } = useBasket();
  const pathname = usePathname();
  const inStore = isStoreRoute(pathname);
  const nav = inStore ? STORE_NAV : SITE_NAV;
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenu(false), [pathname]);

  const active = (href: string) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || menu ? "border-b border-line bg-ink/85 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Logo />
        {inStore && (
          <span className="chamfer hidden bg-neon/10 px-2.5 py-1 text-[0.6rem] font-black tracking-[0.25em] text-neon uppercase ring-1 ring-neon/40 [--c:5px] sm:inline-block">
            Store
          </span>
        )}

        <nav className="ml-2 hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`relative px-4 py-2 text-[0.78rem] font-bold tracking-[0.18em] uppercase transition hover:text-neon ${
                active(n.href) ? "text-neon" : "text-white/70"
              }`}
            >
              {n.label}
              {active(n.href) && <span className="absolute inset-x-4 -bottom-0.5 h-0.5 bg-neon shadow-[0_0_10px_#3dff5a]" />}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden h-10 w-10 items-center justify-center rounded-md text-white/70 transition hover:bg-white/5 hover:text-[#8f9bff] sm:flex"
            aria-label="Discord"
          >
            <DiscordIcon />
          </a>

          {inStore ? (
            <>
              {live &&
                (basket?.username ? (
                  <button
                    onClick={logout}
                    title="Log out"
                    className="hidden items-center gap-2 rounded-md border border-line bg-neon/5 px-3 py-2 text-xs font-bold text-white/90 transition hover:border-neon/60 sm:flex"
                  >
                    <span className="h-2 w-2 rounded-full bg-neon shadow-[0_0_8px_#3dff5a]" />
                    {basket.username}
                  </button>
                ) : (
                  <button onClick={() => login()} disabled={busy} className="btn btn-ghost hidden !px-4 !py-2.5 sm:inline-flex">
                    <UserIcon /> Log in
                  </button>
                ))}
              <button onClick={() => setOpen(true)} className="btn btn-neon relative !px-4 !py-2.5" aria-label={`Open basket, ${count} items`}>
                <BagIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Basket</span>
                {count > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.68rem] text-neon">{count}</span>}
              </button>
            </>
          ) : (
            <Link href="/store" className="btn btn-neon !px-4 !py-2.5">
              <BagIcon className="h-4 w-4" />
              Store
              {count > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.68rem] text-neon">{count}</span>}
            </Link>
          )}

          <button
            onClick={() => setMenu((m) => !m)}
            className="grid h-10 w-10 place-items-center rounded-md text-white lg:hidden"
            aria-label="Menu"
            aria-expanded={menu}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-0.5 w-5 bg-current transition ${menu ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-0.5 w-5 bg-current transition ${menu ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      {menu && (
        <div className="border-t border-line lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMenu(false)}
                className={`py-3 text-sm font-bold tracking-[0.2em] uppercase hover:text-neon ${active(n.href) ? "text-neon" : "text-white/80"}`}
              >
                {n.label}
              </Link>
            ))}
            <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="btn btn-ghost mt-2">
              <DiscordIcon className="h-4 w-4" /> Join the Discord
            </a>
            {inStore && live && !basket?.username && (
              <button onClick={() => login()} className="btn btn-ghost mt-2 sm:hidden">
                <UserIcon /> Log in with Cfx.re
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
