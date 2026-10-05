import Image from "next/image";
import Link from "next/link";
import { AddToBasket } from "./AddToBasket";
import { CheckIcon } from "./Icons";
import { money } from "@/lib/format";
import type { StorePackage } from "@/lib/types";

export function PackageCard({ pkg, badge, highlight, priority }: { pkg: StorePackage; badge?: string; highlight?: boolean; priority?: boolean }) {
  const sub = pkg.type === "subscription";
  const was = pkg.discount > 0 ? pkg.base_price + pkg.discount : null;

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-panel-2 transition duration-300 hover:-translate-y-1 ${
        highlight ? "border-neon shadow-[0_0_50px_-12px_rgba(61,255,90,0.6)]" : "border-white/10 hover:border-neon/50"
      }`}
    >
      {badge && (
        <span className="absolute top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-neon px-3 py-1 text-[0.62rem] font-black tracking-[0.18em] whitespace-nowrap text-ink uppercase shadow-[0_0_20px_-2px_#3dff5a]">
          {badge}
        </span>
      )}

      <Link href={`/store/${pkg.id}`} className="relative block aspect-[4/5] overflow-hidden bg-black" aria-label={`View ${pkg.name}`}>
        {pkg.art ? (
          <Image src={pkg.art} alt={pkg.name} fill priority={priority} sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 400px" className="card-art object-cover" />
        ) : (
          <div className="grid h-full place-items-center">
            <span className="brush text-3xl">{pkg.name}</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-extrabold text-white">{pkg.name}</h3>
            {pkg.tagline && <p className="mt-0.5 text-sm text-white/50">{pkg.tagline}</p>}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-2xl font-black text-white">{money(pkg.total_price, pkg.currency)}</p>
            <p className="text-xs text-white/60">{sub ? "per month" : "one-off"}</p>
            {was && <p className="text-xs text-white/55 line-through">{money(was, pkg.currency)}</p>}
          </div>
        </div>

        {pkg.perks.length > 0 && (
          <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-5 text-sm text-white/80">
            {pkg.perks.map((perk) => (
              <li key={perk} className="flex gap-2.5">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-neon" />
                {perk}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-6">
          <AddToBasket id={pkg.id} name={pkg.name} type={pkg.type} className="w-full" />
          <Link href={`/store/${pkg.id}`} className="mt-1 block py-2.5 text-center text-xs font-semibold text-white/60 transition hover:text-neon">
            View full details
          </Link>
        </div>
      </div>
    </article>
  );
}
