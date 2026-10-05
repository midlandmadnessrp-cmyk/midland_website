import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStore, getStorePackage } from "@/lib/catalog";
import { cleanHtml, money } from "@/lib/format";
import { AddToBasket } from "@/components/AddToBasket";
import { BoltIcon, CheckIcon, LockIcon, RepeatIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

/** Prebuild every package page; new packages are rendered on first visit. */
export async function generateStaticParams() {
  try {
    const store = await getStore();
    return store.categories.flatMap((c) => c.packages.map((p) => ({ id: String(p.id) })));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pkg = await getStorePackage((await params).id);
  if (!pkg) return { title: "Package not found", robots: { index: false } };
  const sub = pkg.type === "subscription";
  const price = `${money(pkg.total_price, pkg.currency)}${sub ? "/month" : ""}`;
  const includes = pkg.perks.length ? `Includes: ${pkg.perks.join(", ")}.` : "";
  const description = `${pkg.name} (${price}) on the Midland Madness FiveM store. ${includes} Secure Tebex checkout, instant in-city delivery.`.slice(0, 300);
  const url = `/store/${pkg.id}`;
  return {
    title: `${pkg.name} – ${price}`,
    description,
    alternates: { canonical: url },
    openGraph: { url, title: `${pkg.name} – ${price} | Midland Madness Store`, description, ...(pkg.art ? { images: [{ url: pkg.art, alt: pkg.name }] } : {}) },
    twitter: { card: "summary_large_image", title: `${pkg.name} – ${price}`, description, ...(pkg.art ? { images: [pkg.art] } : {}) },
  };
}

export default async function PackagePage({ params }: Props) {
  const pkg = await getStorePackage((await params).id);
  if (!pkg) notFound();

  const sub = pkg.type === "subscription";
  const words = pkg.name.split(" ");
  const head = words.length > 1 ? words.slice(0, -1).join(" ") : pkg.name;
  const tail = words.length > 1 ? words.at(-1) : null;

  const image = pkg.art ? (pkg.art.startsWith("/") ? `${SITE_URL}${pkg.art}` : pkg.art) : undefined;

  return (
    <div className="noise bg-city relative overflow-hidden pt-28 pb-10 sm:pt-32">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Product",
              name: pkg.name,
              image,
              description: [pkg.tagline, ...pkg.perks].filter(Boolean).join(". "),
              sku: String(pkg.id),
              brand: { "@type": "Brand", name: SITE_NAME },
              offers: {
                "@type": "Offer",
                url: `${SITE_URL}/store/${pkg.id}`,
                price: pkg.total_price.toFixed(2),
                priceCurrency: pkg.currency,
                availability: "https://schema.org/InStock",
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: "Store", item: `${SITE_URL}/store` },
                { "@type": "ListItem", position: 3, name: pkg.name, item: `${SITE_URL}/store/${pkg.id}` },
              ],
            },
          ],
        }}
      />
      <div className="grid-lines absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <nav className="mb-8 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-white/55 uppercase">
          <Link href="/store" className="hover:text-neon">Store</Link>
          <span>/</span>
          <Link href={sub ? "/store#memberships" : "/store#packs"} className="hover:text-neon">{pkg.category.name}</Link>
          <span>/</span>
          <span className="text-white/80">{pkg.name}</span>
        </nav>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <div className="frame glow">
              <div className="frame-in relative aspect-[4/5] overflow-hidden bg-black">
                {pkg.art && <Image src={pkg.art} alt={pkg.name} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />}
              </div>
            </div>
          </div>

          <div>
            <span className="chamfer inline-block bg-neon/10 px-3 py-1 text-[0.62rem] font-black tracking-[0.22em] text-neon uppercase ring-1 ring-neon/40 [--c:6px]">
              {sub ? "Monthly membership" : pkg.type === "both" ? "One-off or monthly" : "One-off pack"}
            </span>
            <h1 className="mt-5 leading-[0.88]">
              <span className="chrome block text-5xl sm:text-7xl">{head}</span>
              {tail && <span className="brush block -rotate-2 text-5xl sm:text-7xl">{tail}</span>}
            </h1>
            {pkg.tagline && <p className="eyebrow mt-5 text-white/70">{pkg.tagline}</p>}

            <div className="frame mt-10">
              <div className="frame-in p-6 sm:p-8">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black italic neon-text">{money(pkg.total_price, pkg.currency)}</span>
                  {sub && <span className="text-lg font-bold text-white/60">/ month</span>}
                  {pkg.discount > 0 && (
                    <span className="text-lg text-white/55 line-through">{money(pkg.base_price + pkg.discount, pkg.currency)}</span>
                  )}
                </div>
                {pkg.sales_tax > 0 && <p className="mt-1 text-xs text-white/55">Includes {money(pkg.sales_tax, pkg.currency)} tax</p>}

                <div className="mt-6">
                  <AddToBasket id={pkg.id} name={pkg.name} type={pkg.type} disableQuantity={pkg.disable_quantity} full />
                </div>

                <ul className="mt-6 grid gap-3 border-t border-line pt-6 text-xs text-white/60 sm:grid-cols-3">
                  <li className="flex items-center gap-2"><BoltIcon className="h-4 w-4 text-neon" /> Instant delivery</li>
                  <li className="flex items-center gap-2"><LockIcon className="h-4 w-4 text-neon" /> Secure Tebex checkout</li>
                  <li className="flex items-center gap-2"><RepeatIcon className="h-4 w-4 text-neon" /> {sub ? "Cancel anytime" : "No subscription"}</li>
                </ul>
              </div>
            </div>

            {pkg.perks.length > 0 && (
              <div className="mt-10">
                <p className="eyebrow text-neon">What&apos;s included</p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {pkg.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-3 rounded-lg border border-line bg-black/30 px-4 py-3 text-sm text-white/85">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-neon/10 text-neon ring-1 ring-neon/40">
                        <CheckIcon className="h-3.5 w-3.5" />
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {pkg.description && (
              <div className="mt-10">
                <p className="eyebrow text-neon">Details</p>
                <div className="prose-tebex mt-5" dangerouslySetInnerHTML={{ __html: cleanHtml(pkg.description) }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
