/**
 * Public site settings. Everything here is shown on the page anyway (links, names),
 * so it's safe to ship to the browser. Secrets and per-deploy values stay in env vars
 * (TEBEX_PUBLIC_TOKEN, SITE_URL), which are only read on the server.
 */
export const Config = {
  /** Use a never-expiring invite. Its live member/online counts show on the home page. */
  discordUrl: "https://discord.gg/uHv6gRA5e",
  /** Your cfx.re/join/xxxxxx link. Enables "Play now" and the live player count. Leave empty until listed. */
  connectUrl: "",
} as const;
