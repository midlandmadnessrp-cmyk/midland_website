import Link from "next/link";
import { getStore } from "@/lib/catalog";
import { DISCORD_URL } from "@/lib/site";
import { PackageCard } from "@/components/PackageCard";
import { CompareTable } from "@/components/CompareTable";
import { StoreTabs } from "@/components/StoreChrome";
import { BoltIcon, CheckIcon, DiscordIcon, LockIcon, RepeatIcon, ShieldIcon, UserIcon } from "@/components/Icons";
import type { StoreCategory } from "@/lib/types";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Store – Supporter Packs & Memberships",
  description:
    "Official Midland Madness FiveM store. Supporter packs with custom VIP vehicles and cosmetics, Resident+ premium housing and Business Licence memberships. Secure checkout by Tebex, instant in-city delivery.",
  alternates: { canonical: "/store" },
  openGraph: { url: "/store", title: "Midland Madness Store – Supporter Packs & Memberships" },
};

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <h2 className="text-3xl font-black tracking-tight text-white uppercase italic sm:text-4xl">{title}</h2>
      <p className="max-w-md text-sm text-white/55 sm:text-right">{sub}</p>
    </div>
  );
}

export default async function StorePage() {
  const store = await getStore();

  const packs = store.categories.filter((c) => c.kind === "packs");
  const memberships = store.categories.filter((c) => c.kind === "memberships");
  const allPacks = packs.flatMap((c) => c.packages);
  const comparable = allPacks.filter((p) => Object.keys(p.specs).length);
  const popular = allPacks[Math.floor(allPacks.length / 2)];
  const top = allPacks.reduce<(typeof allPacks)[number] | undefined>((t, p) => (!t || p.total_price > t.total_price ? p : t), undefined);

  const badgeFor = (id: number) => (id === popular?.id && allPacks.length > 2 ? "Most popular" : id === top?.id ? "Top tier" : undefined);

  const tabs = [
    ...packs.map((c, i) => ({ id: i === 0 ? "packs" : `cat-${c.id}`, label: c.name, count: c.packages.length })),
    ...(comparable.length > 1 ? [{ id: "compare", label: "Compare" }] : []),
    ...memberships.map((c, i) => ({ id: i === 0 ? "memberships" : `cat-${c.id}`, label: c.name, count: c.packages.length })),
    { id: "faq", label: "FAQ" },
  ];

  const grid = (cat: StoreCategory, id: string, sub: string, cols: string) => (
    <section key={cat.id} id={id} className="mx-auto max-w-7xl scroll-mt-36 px-4 pt-16 sm:px-6">
      <Heading title={cat.name} sub={sub} />
      <div className={`grid gap-6 ${cols}`}>
        {cat.packages.map((p, i) => (
          <PackageCard key={p.id} pkg={p} priority={cat.kind === "packs" && cat.id === packs[0]?.id && i < 3} badge={cat.kind === "packs" ? badgeFor(p.id) : undefined} highlight={cat.kind === "packs" && p.id === popular?.id} />
        ))}
      </div>
    </section>
  );

  const absolute = (u: string | null) => (!u ? undefined : u.startsWith("/") ? `${SITE_URL}${u}` : u);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ItemList",
              name: `${SITE_NAME} Store`,
              itemListElement: store.categories
                .flatMap((c) => c.packages)
                .map((p, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  item: {
                    "@type": "Product",
                    name: p.name,
                    url: `${SITE_URL}/store/${p.id}`,
                    image: absolute(p.art),
                    description: [p.tagline, ...p.perks].filter(Boolean).join(". "),
                    brand: { "@type": "Brand", name: SITE_NAME },
                    offers: { "@type": "Offer", price: p.total_price.toFixed(2), priceCurrency: p.currency, availability: "https://schema.org/InStock" },
                  },
                })),
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
            },
          ],
        }}
      />
      {/* ---------------- HEADER ---------------- */}
      <section className="relative overflow-hidden border-b border-white/10 pt-28 pb-10 sm:pt-32">
        <div className="absolute -top-48 left-1/2 h-[24rem] w-[50rem] -translate-x-1/2 rounded-full bg-neon/12 blur-[130px]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
          {!store.live && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-200">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" /> Demo catalog: add your Tebex token to go live
            </div>
          )}
          <h1 className="leading-none">
            <span className="chrome text-5xl sm:text-7xl">Midland </span>
            <span className="brush inline-block -rotate-2 text-5xl sm:text-7xl">Store</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/65 sm:text-lg">
            Support the city and unlock VIP vehicles, cosmetics, premium housing and your own business, delivered straight to your character.
          </p>

          <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-white/70">
            {[
              [<LockIcon key="l" className="h-4 w-4" />, "Secure checkout by Tebex"],
              [<BoltIcon key="b" className="h-4 w-4" />, "Instant in-city delivery"],
              [<ShieldIcon key="s" className="h-4 w-4" />, "Card, PayPal & more"],
              [<RepeatIcon key="r" className="h-4 w-4" />, "Cancel memberships anytime"],
            ].map(([icon, text]) => (
              <li key={text as string} className="flex items-center gap-2">
                <span className="text-neon">{icon}</span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <StoreTabs tabs={tabs} />

      {/* ---------------- PACKS ---------------- */}
      {packs.map((cat, i) =>
        grid(cat, i === 0 ? "packs" : `cat-${cat.id}`, "One-off payment. Everything is delivered the next time you join the city.", "sm:grid-cols-2 lg:grid-cols-3"),
      )}

      {/* ---------------- COMPARE ---------------- */}
      {comparable.length > 1 && (
        <section id="compare" className="mx-auto max-w-7xl scroll-mt-36 px-4 pt-20 sm:px-6">
          <Heading title="Compare packs" sub="Not sure which pack to pick? Here's exactly what each one includes." />
          <CompareTable packages={comparable} highlightId={popular?.id} />
        </section>
      )}

      {/* ---------------- MEMBERSHIPS ---------------- */}
      {memberships.map((cat, i) =>
        grid(cat, i === 0 ? "memberships" : `cat-${cat.id}`, "Billed monthly. Benefits stay active until the end of the month you've paid for.", "md:grid-cols-2 lg:grid-cols-3"),
      )}

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {[
            { icon: <UserIcon className="h-5 w-5" />, t: "1. Log in with Cfx.re", d: "Use the account you play FiveM on so we know where to deliver." },
            { icon: <LockIcon className="h-5 w-5" />, t: "2. Pay with Tebex", d: "Checkout is handled securely by Tebex. We never see your card details." },
            { icon: <BoltIcon className="h-5 w-5" />, t: "3. Play", d: "Your perks land on your character automatically, even if you were offline." },
          ].map((s) => (
            <div key={s.t} className="flex gap-4 bg-panel-2 p-6">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-neon/10 text-neon ring-1 ring-neon/30">{s.icon}</div>
              <div>
                <p className="font-bold text-white">{s.t}</p>
                <p className="mt-1 text-sm text-white/55">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="mx-auto max-w-7xl scroll-mt-36 px-4 pt-20 sm:px-6">
        <Heading title="Questions" sub="Everything you need to know before you buy." />
        <div className="grid items-start gap-3 md:grid-cols-2">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group rounded-xl border border-white/10 bg-panel-2 transition open:border-neon/40">
              <summary className="flex list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-white transition hover:text-neon [&::-webkit-details-marker]:hidden">
                {q}
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-white/15 text-neon transition group-open:rotate-45">+</span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-white/60">{a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/10 bg-panel-2 p-6 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-4">
            <CheckIcon className="hidden h-8 w-8 text-neon sm:block" />
            <div>
              <p className="font-bold text-white">Still not sure which pack is right for you?</p>
              <p className="text-sm text-white/55">Ask in our Discord and the team will help you pick.</p>
            </div>
          </div>
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="btn btn-ghost shrink-0">
            <DiscordIcon className="h-4 w-4" /> Ask on Discord
          </a>
        </div>
        <p className="mt-6 text-center text-xs text-white/55">
          By purchasing you agree to our{" "}
          <Link href="/terms" className="underline hover:text-white">
            terms of sale
          </Link>
          .
        </p>
      </section>
    </>
  );
}

const FAQ: [string, string][] = [
  ["How long does delivery take?", "Usually under a minute. If you're not in the city when you buy, your items are queued and delivered the next time you join."],
  ["Which account do I log in with?", "The Cfx.re account linked to your FiveM client. That's how we know which player to deliver to."],
  ["Can I cancel a membership?", "Yes, anytime from your Tebex or PayPal account. Your benefits stay active until the end of the period you've paid for."],
  ["What happens to my business if my licence ends?", "Ownership is paused at the end of your paid period, but your business data is saved and restored if you resubscribe."],
  ["I didn't receive my items. What now?", "Open a support ticket in our Discord with your Tebex transaction ID and the team will sort it out."],
  ["Do items have real-world value?", "No. All perks are in-game cosmetic and convenience items and can't be traded for real money."],
];
