import "server-only";
import { getCategories, getPackage, getWebstore, isLive } from "./tebex";
import type { StoreCategory, StoreData, StorePackage, TebexPackage } from "./types";

/**
 * Local artwork + marketing copy, matched to Tebex packages by name.
 * Tebex stays the source of truth for names, prices and descriptions;
 * this only adds the poster art and the short tagline / perk bullets.
 */
interface Branding {
  match: RegExp;
  art: string;
  tagline: string;
  perks: string[];
  specs?: Record<string, string>;
}

const spec = (vehicles: string, plates: string, clothing: string, queue: string) => ({
  "Supporter Discord role": "yes",
  "Custom VIP vehicles": vehicles,
  "Custom plates": plates,
  Clothing: clothing,
  "Priority queue": queue,
});

const BRANDING: Branding[] = [
  {
    match: /black\s*card|high\s*roller|kingpin|legend/i,
    art: "/packages/black-card.webp",
    tagline: "Top Tier Access",
    perks: ["Black Card supporter role", "4x custom VIP vehicles incl. 1 exclusive", "Full premium clothing set + plates", "Gold priority queue"],
    specs: spec("4 incl. 1 exclusive", "yes", "Full premium set", "Gold"),
  },
  {
    match: /collector/i,
    art: "/packages/city-collector.webp",
    tagline: "Build Your Collection",
    perks: ["City Collector supporter role", "3x custom VIP vehicles", "Custom plates + premium clothing set", "Gold priority queue"],
    specs: spec("3", "yes", "Premium set", "Gold"),
  },
  {
    match: /double\s*trouble/i,
    art: "/packages/double-trouble.webp",
    tagline: "Twice the Madness",
    perks: ["Double Trouble supporter role", "2x custom VIP vehicles (Elite tier)", "2 custom plates + clothing set", "Silver priority queue"],
    specs: spec("2", "2", "Clothing set", "Silver"),
  },
  {
    match: /elite/i,
    art: "/packages/midland-elite.webp",
    tagline: "Premium Access",
    perks: ["Midland Elite supporter role", "1x custom VIP vehicle (Elite tier)", "Custom plate + clothing set", "Silver priority queue"],
    specs: spec("1", "1", "Clothing set", "Silver"),
  },
  {
    match: /upgrade/i,
    art: "/packages/madness-upgrade.webp",
    tagline: "Level Up the Madness",
    perks: ["Madness Upgrade supporter role", "1x custom VIP vehicle (Upgrade tier)", "Custom plate + 2 clothing items", "Bronze priority queue"],
    specs: spec("1", "1", "2 items", "Bronze"),
  },
  {
    match: /street\s*entry/i,
    art: "/packages/street-entry.webp",
    tagline: "Start the Madness",
    perks: ["Street Entry supporter role", "1x custom VIP vehicle (Street tier)", "Custom plate + 1 clothing item", "Bronze priority queue"],
    specs: spec("1", "1", "1 item", "Bronze"),
  },
  {
    match: /resident/i,
    art: "/packages/resident-plus.webp",
    tagline: "Live Premium Every Month",
    perks: ["Resident+ Discord role", "Premium Housing access", "Monthly rotating cosmetic drop", "Name colour + emotes"],
  },
  {
    match: /business/i,
    art: "/packages/business-licence.webp",
    tagline: "Own It. Run The City.",
    perks: ["Own 1 approved business", "Owner & management features", "Custom business branding", "Business Owner Discord role"],
  },
];

function brand(pkg: TebexPackage): StorePackage {
  const b = BRANDING.find((x) => x.match.test(pkg.name));
  return { ...pkg, art: b?.art ?? pkg.image ?? null, tagline: b?.tagline ?? null, perks: b?.perks ?? [], specs: b?.specs ?? {} };
}

/* ---------- Demo catalog: used until TEBEX_PUBLIC_TOKEN is set ---------- */

const delivery =
  "<p>All items are delivered automatically to your character the next time you are in the city.</p><p><em>Items are cosmetic / convenience perks, have no real-world value and cannot be traded for money.</em></p>";

function demo(id: number, name: string, price: number, type: "single" | "subscription", cat: [number, string], intro: string): TebexPackage {
  return {
    id,
    name,
    description: `<p>${intro}</p>${delivery}`,
    image: null,
    type,
    category: { id: cat[0], name: cat[1] },
    base_price: price,
    sales_tax: 0,
    total_price: price,
    currency: "GBP",
    discount: 0,
    disable_quantity: type === "subscription",
    disable_gifting: false,
    expiration_date: null,
    created_at: "",
    updated_at: "",
  };
}

const PACKS: [number, string] = [1, "Supporter Packs"];
const SUBS: [number, string] = [2, "Memberships"];

const DEMO: TebexPackage[] = [
  demo(101, "Street Entry", 19.99, "single", PACKS, "Get started in Midland Madness with the Street Entry pack."),
  demo(102, "Madness Upgrade", 26.99, "single", PACKS, "Step up with the Madness Upgrade pack."),
  demo(103, "Midland Elite", 34.99, "single", PACKS, "Join the Midland Elite."),
  demo(104, "Double Trouble", 49.99, "single", PACKS, "Two times the trouble."),
  demo(105, "City Collector", 69.99, "single", PACKS, "For the collectors of Midland."),
  demo(106, "Midland Black Card", 99.99, "single", PACKS, "The top-tier Midland Madness supporter pack."),
  demo(201, "Midland Resident+", 14.99, "subscription", SUBS, "Become a Midland Resident+ and support the city every month. Billed monthly until cancelled."),
  demo(202, "Midland Business Licence", 21.99, "subscription", SUBS, "Own and run your own business in Midland Madness. Business data is kept if your subscription lapses and restored when you resubscribe."),
];

function demoCategories(): StoreCategory[] {
  return [PACKS, SUBS].map(([id, name]) => ({
    id,
    name,
    description: "",
    kind: id === SUBS[0] ? "memberships" : "packs",
    packages: DEMO.filter((p) => p.category.id === id).map(brand),
  }));
}

/* ---------- Public API ---------- */

export async function getStore(): Promise<StoreData> {
  if (!isLive()) {
    return { live: false, name: "Midland Madness", currency: "GBP", categories: demoCategories() };
  }

  const [store, cats] = await Promise.all([getWebstore(), getCategories()]);
  const categories: StoreCategory[] = cats
    .filter((c) => c.packages?.length)
    .map((c) => {
      const packages = c.packages.map(brand).sort((a, b) => a.total_price - b.total_price);
      return {
        id: c.id,
        name: c.name,
        description: c.description ?? "",
        kind: packages.every((p) => p.type === "subscription") ? "memberships" : "packs",
        packages,
      };
    });

  return { live: true, name: store.name, currency: store.currency, categories };
}

export async function getStorePackage(id: string): Promise<StorePackage | null> {
  if (!isLive()) {
    const p = DEMO.find((x) => String(x.id) === id);
    return p ? brand(p) : null;
  }
  try {
    return brand(await getPackage(id));
  } catch {
    return null;
  }
}
