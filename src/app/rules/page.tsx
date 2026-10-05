import type { Metadata } from "next";
import { DISCORD_URL } from "@/lib/site";
import { DiscordIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Server Rules",
  description: "The Midland Madness FiveM roleplay server rules: general conduct, roleplay standards, crime and combat, vehicles and store perks. Read before you play.",
  alternates: { canonical: "/rules" },
  openGraph: { url: "/rules", title: "Server Rules | Midland Madness Roleplay" },
};

/** Edit the city rules here. Each section gets its own card and anchor link. */
const RULES: { id: string; title: string; rules: [string, string][] }[] = [
  {
    id: "general",
    title: "General",
    rules: [
      ["Respect everyone", "No harassment, hate speech, discrimination or targeted abuse, in character or out of character."],
      ["18+ community", "You must be 18 or older, or have permission from a parent or guardian, to play."],
      ["No cheating or exploits", "Mod menus, macros and abusing bugs are a permanent ban. Found a bug? Report it in a ticket."],
      ["Staff decisions", "Staff have the final say in game. If you disagree, play it out and open a ticket afterwards."],
      ["One account", "One character slot per person unless staff say otherwise. Alt accounts used to dodge bans are banned too."],
    ],
  },
  {
    id: "roleplay",
    title: "Roleplay",
    rules: [
      ["Stay in character", "Keep out-of-character chat to OOC channels. Don't break immersion for other players."],
      ["No metagaming", "Don't use information your character hasn't learned in the city, like streams or Discord."],
      ["No powergaming", "Don't force actions on others or do things that would be impossible in real life."],
      ["Value your life", "Act as if your character's life matters. Fear guns, injuries and the consequences of your actions."],
      ["New life rule", "After you're downed and respawn, you don't remember the events that led to it."],
    ],
  },
  {
    id: "combat",
    title: "Crime & Combat",
    rules: [
      ["No RDM or VDM", "Every attack needs a clear roleplay reason first. Random deathmatch and vehicle deathmatch are not allowed."],
      ["Initiation", "Make your intent clear before using force, and give the other side a fair chance to respond."],
      ["Safe zones", "No crime in hospitals, police stations or other marked safe zones."],
      ["Combat logging", "Don't log off or leave the server to avoid roleplay, arrests or losing items."],
    ],
  },
  {
    id: "vehicles",
    title: "Vehicles",
    rules: [
      ["Realistic driving", "Drive like the vehicle and terrain allow. Supercars don't go off-road and nobody walks away from a 200mph crash."],
      ["No car surfing", "Don't stand on or ram vehicles for fun. Keep it in roleplay."],
    ],
  },
  {
    id: "store",
    title: "Store & Perks",
    rules: [
      ["No real-money trading", "Store perks can't be sold, traded or transferred to other players for real money."],
      ["Perks aren't immunity", "Supporting the city doesn't put you above the rules. Bans apply the same to everyone."],
    ],
  },
];

export default function Rules() {
  return (
    <div className="noise bg-city relative overflow-hidden pt-32 pb-10 sm:pt-40">
      <div className="grid-lines absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="eyebrow text-white/80">
            Read Before You <span className="text-neon">Play</span>
          </p>
          <h1 className="mt-5 leading-[0.88]">
            <span className="chrome block text-6xl sm:text-7xl">City</span>
            <span className="brush block -rotate-2 text-6xl sm:text-8xl">Rules</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-white/60">
            These keep Midland fun and fair for everyone. Not knowing a rule isn&apos;t an excuse, so give them a read.
          </p>
        </div>

        <div className="mt-16 grid items-start gap-10 lg:grid-cols-[14rem_1fr]">
          <nav className="frame top-28 hidden lg:sticky lg:block">
            <div className="frame-in p-5">
              <p className="eyebrow mb-3 !text-[0.6rem] text-neon">Sections</p>
              <ul className="space-y-1">
                {RULES.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-bold text-white/70 transition hover:bg-neon/10 hover:text-neon">
                      <span className="text-xs text-neon/70">0{i + 1}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="space-y-8">
            {RULES.map((section, si) => (
              <section key={section.id} id={section.id} className="frame scroll-mt-28">
                <div className="frame-in p-6 sm:p-8">
                  <div className="flex items-baseline gap-4">
                    <span className="brush text-4xl">0{si + 1}</span>
                    <h2 className="text-2xl font-black italic uppercase sm:text-3xl">{section.title}</h2>
                  </div>
                  <ol className="mt-6 divide-y divide-line">
                    {section.rules.map(([title, text], ri) => (
                      <li key={title} className="flex gap-4 py-4">
                        <span className="mt-0.5 shrink-0 font-mono text-xs font-bold text-neon">
                          {si + 1}.{ri + 1}
                        </span>
                        <div>
                          <p className="font-bold text-white">{title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-white/60">{text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            ))}

            <div className="frame glow">
              <div className="frame-in flex flex-col items-center justify-between gap-6 p-8 text-center sm:flex-row sm:text-left">
                <div>
                  <p className="text-xl font-black italic uppercase">Questions or a report?</p>
                  <p className="mt-1 text-sm text-white/60">Open a ticket in our Discord and a staff member will get back to you.</p>
                </div>
                <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="btn btn-neon shrink-0">
                  <DiscordIcon className="h-4 w-4" /> Open a ticket
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
