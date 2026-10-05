import "server-only";
import { DISCORD_INVITE, JOIN_CODE } from "./site";

export interface DiscordStats {
  members: number;
  online: number;
}

export interface ServerStatus {
  online: boolean;
  players: number;
  maxPlayers: number;
}

/** Public invite endpoint, no bot token needed. Refreshed every 5 minutes. */
export async function getDiscordStats(): Promise<DiscordStats | null> {
  if (!DISCORD_INVITE) return null;
  try {
    const res = await fetch(`https://discord.com/api/v10/invites/${DISCORD_INVITE}?with_counts=true`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const d = await res.json();
    return { members: d.approximate_member_count ?? 0, online: d.approximate_presence_count ?? 0 };
  } catch {
    return null;
  }
}

/** FiveM server list lookup by cfx.re join code. Refreshed every minute. */
export async function getServerStatus(): Promise<ServerStatus | null> {
  if (!JOIN_CODE) return null;
  try {
    const res = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${JOIN_CODE}`, {
      headers: { "User-Agent": "MidlandMadnessWebsite/1.0" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return { online: false, players: 0, maxPlayers: 0 };
    const { Data } = await res.json();
    return { online: true, players: Data?.clients ?? 0, maxPlayers: Data?.sv_maxclients ?? Data?.svMaxclients ?? 0 };
  } catch {
    return null;
  }
}
