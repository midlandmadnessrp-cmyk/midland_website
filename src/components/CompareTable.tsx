import Link from "next/link";
import { AddToBasket } from "./AddToBasket";
import { CheckIcon } from "./Icons";
import { money } from "@/lib/format";
import type { StorePackage } from "@/lib/types";

/** Side-by-side tier comparison. Rows come from each package's `specs`. */
export function CompareTable({ packages, highlightId }: { packages: StorePackage[]; highlightId?: number }) {
  const rows = [...new Set(packages.flatMap((p) => Object.keys(p.specs)))];
  if (!rows.length) return null;

  const cell = (v?: string) =>
    !v ? <span className="text-white/20">—</span> : v === "yes" ? <CheckIcon className="mx-auto h-5 w-5 text-neon" /> : <span>{v}</span>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-panel-2">
      <table className="w-full min-w-[56rem] border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-48 p-5 text-left text-xs font-bold tracking-[0.16em] text-white/55 uppercase">Pack</th>
            {packages.map((p) => (
              <th key={p.id} className={`p-5 text-center align-bottom ${p.id === highlightId ? "bg-neon/[0.07]" : ""}`}>
                {p.id === highlightId && (
                  <span className="mb-2 inline-block rounded-full bg-neon px-2.5 py-0.5 text-[0.6rem] font-black tracking-[0.16em] text-ink uppercase">Popular</span>
                )}
                <Link href={`/store/${p.id}`} className="block font-extrabold text-white hover:text-neon">
                  {p.name}
                </Link>
                <span className="mt-1 block text-xl font-black text-neon">{money(p.total_price, p.currency)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row} className="border-t border-white/[0.07]">
              <th className="p-5 text-left font-semibold text-white/70">{row}</th>
              {packages.map((p) => (
                <td key={p.id} className={`p-5 text-center text-white/85 ${p.id === highlightId ? "bg-neon/[0.07]" : ""}`}>
                  {cell(p.specs[row])}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-white/[0.07]">
            <td className="p-5" />
            {packages.map((p) => (
              <td key={p.id} className={`p-4 ${p.id === highlightId ? "bg-neon/[0.07]" : ""}`}>
                <AddToBasket id={p.id} name={p.name} type={p.type} label="Add" className="w-full !px-3 !py-3" />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
