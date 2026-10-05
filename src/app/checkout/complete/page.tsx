import Link from "next/link";
import { DISCORD_URL } from "@/lib/site";
import type { Metadata } from "next";
import { CheckIcon, DiscordIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Thank you", robots: { index: false, follow: false } };

export default function Complete() {
  const discord = DISCORD_URL;
  return (
    <div className="noise bg-city relative grid min-h-[80dvh] place-items-center overflow-hidden px-4 pt-32 pb-16">
      <div className="grid-lines absolute inset-0" />
      <div className="relative w-full max-w-xl text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-neon text-ink shadow-[0_0_60px_-6px_#3dff5a]">
          <CheckIcon className="h-10 w-10" />
        </div>
        <h1 className="mt-8 leading-[0.88]">
          <span className="chrome block text-5xl sm:text-6xl">Payment</span>
          <span className="brush block -rotate-2 text-6xl sm:text-7xl">Complete</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-white/65">
          Thanks for supporting Midland Madness. Your perks will be delivered to your character automatically. If you&apos;re offline, they&apos;ll be waiting
          next time you join.
        </p>
        <p className="mt-3 text-sm text-white/55">A receipt has been emailed to you by Tebex.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/store" className="btn btn-neon">Back to store</Link>
          {discord && (
            <a href={discord} target="_blank" rel="noreferrer" className="btn btn-ghost">
              <DiscordIcon className="h-4 w-4" /> Need help?
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
