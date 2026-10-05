/** Community links. Override with env vars, these are the defaults. */
export const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/uHv6gRA5e";
export const DISCORD_INVITE = DISCORD_URL.split("/").filter(Boolean).pop() ?? "";

/** e.g. https://cfx.re/join/abc123 — leave empty until the server is listed. */
export const CONNECT_URL = process.env.NEXT_PUBLIC_CONNECT_URL?.includes("xxxxxx") ? "" : process.env.NEXT_PUBLIC_CONNECT_URL || "";
export const JOIN_CODE = CONNECT_URL.match(/join\/([a-z0-9]+)/i)?.[1] ?? "";
/** Opens FiveM directly and connects. */
export const FIVEM_CONNECT = JOIN_CODE ? `fivem://connect/cfx.re/join/${JOIN_CODE}` : "";

/* ---------- SEO ---------- */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "Midland Madness Roleplay";
export const SITE_DESCRIPTION =
  "Midland Madness is a FiveM roleplay server. Get a job, build a crew, own a business, buy a home and drive custom vehicles. Join our Discord and start your story today.";
export const KEYWORDS = [
  "Midland Madness",
  "Midland Madness RP",
  "Midland Madness Roleplay",
  "FiveM server",
  "FiveM roleplay server",
  "GTA RP server",
  "GTA 5 roleplay",
  "FiveM RP",
  "FiveM store",
];
