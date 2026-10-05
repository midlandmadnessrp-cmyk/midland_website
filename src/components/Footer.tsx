import Link from "next/link";
import { Logo } from "./Logo";
import { DiscordIcon } from "./Icons";
import { CONNECT_URL, DISCORD_URL } from "@/lib/site";

const COLS: { title: string; links: [string, string][] }[] = [
  {
    title: "Server",
    links: [
      ["/", "Home"],
      ["/#features", "The City"],
      ["/#join", "How to join"],
      ["/rules", "Rules"],
    ],
  },
  {
    title: "Store",
    links: [
      ["/store#packs", "Supporter packs"],
      ["/store#memberships", "Memberships"],
      ["/store#faq", "Store FAQ"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["/terms", "Terms of sale"],
      ["/terms#refunds", "Refund policy"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line bg-panel/60">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Logo size="lg" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">
            Midland Madness Roleplay is a FiveM city built by its community. Grab a character, find your crew and make your name.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="btn btn-ghost !px-4 !py-2.5">
              <DiscordIcon className="h-4 w-4" /> Discord
            </a>
            {CONNECT_URL && (
              <a href={CONNECT_URL} target="_blank" rel="noreferrer" className="btn btn-neon !px-4 !py-2.5">
                Join the city
              </a>
            )}
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <p className="eyebrow mb-4 text-neon">{col.title}</p>
            <ul className="space-y-0.5 text-sm text-white/60">
              {col.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="inline-block py-1.5 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-[0.72rem] text-white/55 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Midland Madness Roleplay. Store payments handled by Tebex.</p>
          <p>Not affiliated with or endorsed by Rockstar Games, Take-Two Interactive or Cfx.re.</p>
        </div>
      </div>
    </footer>
  );
}
