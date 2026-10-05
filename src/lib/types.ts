// Shapes returned by the Tebex Headless API (https://docs.tebex.io/developers/headless-api)

export type PackageType = "single" | "subscription" | "both";

export interface TebexPackage {
  id: number;
  name: string;
  description: string; // HTML
  image: string | null;
  type: PackageType;
  category: { id: number; name: string };
  base_price: number;
  sales_tax: number;
  total_price: number;
  currency: string;
  discount: number;
  disable_quantity: boolean;
  disable_gifting: boolean;
  expiration_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TebexCategory {
  id: number;
  name: string;
  slug?: string;
  description: string;
  order?: number;
  display_type?: string;
  parent?: unknown;
  packages: TebexPackage[];
}

export interface TebexWebstore {
  id: number;
  name: string;
  description: string;
  webstore_url: string;
  currency: string;
  lang: string;
  logo: string | null;
  platform_type: string;
}

export interface BasketPackage {
  id: number;
  name: string;
  description: string;
  image: string | null;
  in_basket: {
    quantity: number;
    price: number;
    gift_username_id: string | null;
    gift_username: string | null;
  };
}

export interface TebexBasket {
  ident: string;
  complete: boolean;
  id: number;
  country: string;
  ip: string;
  username_id: string | null;
  username: string | null;
  base_price: number;
  sales_tax: number;
  total_price: number;
  currency: string;
  packages: BasketPackage[];
  coupons: { coupon_code: string }[];
  giftcards: { card_number: string }[];
  creator_code: string;
  links: { payment?: string; checkout: string };
}

export interface AuthLink {
  name: string;
  url: string;
}

/** What the UI works with: Tebex data plus local artwork / copy. */
export interface StorePackage extends TebexPackage {
  art: string | null;
  tagline: string | null;
  perks: string[];
  /** Comparison-table values, keyed by row label. */
  specs: Record<string, string>;
}

export interface StoreCategory {
  id: number;
  name: string;
  description: string;
  kind: "packs" | "memberships";
  packages: StorePackage[];
}

export interface StoreData {
  live: boolean; // false = demo catalog (no TEBEX_PUBLIC_TOKEN)
  name: string;
  currency: string;
  categories: StoreCategory[];
}
