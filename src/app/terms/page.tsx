import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Sale & Refund Policy",
  description: "Terms of sale and refund policy for the Midland Madness FiveM store.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-36 sm:px-6">
      <p className="eyebrow text-neon">Legal</p>
      <h1 className="mt-4 leading-[0.9]">
        <span className="chrome block text-5xl">Terms of</span>
        <span className="brush block -rotate-2 text-6xl">Sale</span>
      </h1>

      <div className="prose-tebex mt-12">
        <p>
          All purchases are digital perks for the Midland Madness FiveM server and are delivered in-game. Purchased items have no real-world monetary
          value, cannot be exchanged for real money, and cannot be transferred or sold to other players.
        </p>
        <p>
          Purchases support the running costs of the server. Perks may be adjusted or rebalanced over time. If a perk is removed, an equivalent
          replacement will be provided where possible.
        </p>
        <p>Breaking server rules can result in a ban or loss of perks without a refund.</p>
        <p>Subscriptions renew monthly until cancelled. Cancelled subscriptions stay active until the end of the paid period.</p>
        <p>You must be 18+ or have permission from a parent or guardian to purchase.</p>
        <p>Midland Madness is not affiliated with or endorsed by Rockstar Games, Take-Two Interactive or Cfx.re.</p>

        <h2 id="refunds" className="scroll-mt-28">Refund policy</h2>
        <p>
          All sales are final because items are delivered digitally and instantly. If you did not receive your items, open a support ticket in our
          Discord with your Tebex transaction ID and we will fix it. Chargebacks result in a permanent ban.
        </p>
      </div>
    </div>
  );
}
