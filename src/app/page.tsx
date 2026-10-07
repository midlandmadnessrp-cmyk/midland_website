import Image from "next/image";
import Link from "next/link";
import { getDiscordStats, getServerStatus } from "@/lib/community";
import { CONNECT_URL, DISCORD_URL, FIVEM_CONNECT, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import {
  ArrowIcon,
  BoltIcon,
  BookIcon,
  BriefcaseIcon,
  CarIcon,
  DiscordIcon,
  DownloadIcon,
  HomeIcon,
  PlayIcon,
  ServerIcon,
  ShieldIcon,
  StarIcon,
  UsersIcon,
} from "@/components/Icons";

export const revalidate = 60;
export const metadata: Metadata = { alternates: { canonical: "/" } };

const FEATURES = [
  { icon: <BoltIcon />, title: "Jobs & Economy", text: "Work your way up through legal jobs, side hustles and everything in between. Every pound in the city is earned in the city." },
  { icon: <UsersIcon />, title: "Crews & Gangs", text: "Build a crew, claim your corner and write the city's story with the people around you. Your reputation follows you." },
  { icon: <BriefcaseIcon />, title: "Own a Business", text: "Run a real player-owned business. Hire staff, set prices and turn your idea into a name everyone in Midland knows." },
  { icon: <HomeIcon />, title: "Housing", text: "From a starter flat to a premium home, find a place to call your own and make it yours." },
  { icon: <CarIcon />, title: "Custom Vehicles", text: "A garage full of custom and addon vehicles, tuned and plated the way you want." },
  { icon: <ShieldIcon />, title: "Active Staff", text: "A staff team that's actually around. Clear rules, fair calls and support tickets that get answered." },
];

const MARQUEE = ["Serious roleplay", "Player-owned businesses", "Custom vehicles", "Active staff", "Weekly events", "Built by the community"];

function fmt(n: number) {
  return new Intl.NumberFormat("en-GB").format(n);
}

export default async function Home() {
  const [discord, server] = await Promise.all([getDiscordStats(), getServerStatus()]);
  const playHref = FIVEM_CONNECT || DISCORD_URL;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${SITE_URL}/#org`,
              name: SITE_NAME,
              alternateName: ["Midland Madness", "Midland Madness RP"],
              url: SITE_URL,
              logo: `${SITE_URL}/logo.webp`,
              description: SITE_DESCRIPTION,
              sameAs: [DISCORD_URL],
            },
            { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL, publisher: { "@id": `${SITE_URL}/#org` }, inLanguage: "en-GB" },
          ],
        }}
      />
      {/* ---------------- HERO ---------------- */}
      <section className="noise bg-city relative overflow-hidden pt-32 pb-24 sm:pt-40">
        <div className="grid-lines absolute inset-0" />
        <div className="slashes absolute -left-40 top-0 h-full w-[60rem] opacity-60" />
        <div className="absolute -right-24 top-24 h-[30rem] w-[30rem] rounded-full bg-neon/20 blur-[140px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-neon" />
              <p className="eyebrow text-white/80">
                FiveM <span className="text-neon">Roleplay</span>
              </p>
            </div>

            <h1 className="mt-6 leading-[0.85]">
              <span className="chrome block text-[3.6rem] sm:text-[5.5rem] xl:text-[6.6rem]">Midland</span>
              <span className="brush -mt-2 block -rotate-[3deg] text-[3.8rem] sm:text-[6rem] xl:text-[7.2rem]">Madness</span>
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/65">
              Midland Madness is a FiveM roleplay server where you can start a business, build a crew, buy a home and make your name in a city that never sleeps.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a href={playHref} className="btn btn-neon !px-7 !py-4 text-sm" {...(FIVEM_CONNECT ? {} : { target: "_blank", rel: "noreferrer" })}>
                {FIVEM_CONNECT ? <PlayIcon /> : <DiscordIcon className="h-4 w-4" />}
                {FIVEM_CONNECT ? "Play now" : "Join the Discord"}
              </a>
              <Link href="/#join" className="btn btn-ghost !px-7 !py-4 text-sm">
                How to join
              </Link>
            </div>

            {/* Live stats */}
            <div className="mt-14 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-3">
              {server && (
                <Stat
                  label="City status"
                  value={server.online ? `${server.players}/${server.maxPlayers}` : "Offline"}
                  sub={server.online ? "players online" : "back soon"}
                  live={server.online}
                />
              )}
              {discord && <Stat label="Discord" value={fmt(discord.online)} sub="online now" live />}
              {discord && <Stat label="Community" value={fmt(discord.members)} sub="members" />}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm sm:max-w-lg lg:max-w-none">
            <div className="absolute inset-0 m-auto h-3/4 w-3/4 rounded-full bg-neon/25 blur-[100px]" />
            <Image
              src="/logo.webp"
              alt="Midland Madness Roleplay logo"
              width={1912}
              height={719}
              priority
              sizes="(max-width: 640px) 384px, (max-width: 1024px) 512px, 600px"
              className="animate-float relative h-auto w-full drop-shadow-[0_0_50px_rgba(61,255,90,0.35)]"
            />
          </div>
        </div>
      </section>

      {/* ---------------- MARQUEE ---------------- */}
      <div className="relative z-10 -mt-8 -skew-y-1 border-y border-neon/40 bg-[#071207] py-4 shadow-[0_0_40px_-10px_rgba(61,255,90,0.5)]">
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 gap-10 pr-10 whitespace-nowrap">
            {[0, 1].flatMap((k) =>
              MARQUEE.map((t) => (
                <span key={`${k}-${t}`} className="flex items-center gap-10 text-sm font-black tracking-[0.3em] text-white/80 uppercase italic">
                  {t}
                  <span className="text-neon">✦</span>
                </span>
              )),
            )}
          </div>
        </div>
      </div>

      {/* ---------------- FEATURES ---------------- */}
      <section id="features" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 pt-32 sm:px-6">
        <SectionHeading
          eyebrow="Life In The City"
          title="Welcome to"
          brush="Midland"
          sub="Everything you need to live a whole second life, and the people to share it with."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="group frame transition-transform duration-300 hover:-translate-y-1">
              <div className="frame-in relative overflow-hidden p-8">
                <span className="absolute top-4 right-6 text-7xl font-black italic text-white/[0.04] transition group-hover:text-neon/10">
                  0{i + 1}
                </span>
                <div className="grid h-14 w-14 place-items-center rounded-xl bg-neon/10 text-neon ring-1 ring-neon/40 shadow-[0_0_30px_-8px_#3dff5a] transition group-hover:bg-neon group-hover:text-ink">
                  {f.icon}
                </div>
                <h3 className="mt-6 text-xl font-black italic uppercase">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- STORE TEASER ---------------- */}
      <section className="relative mx-auto max-w-7xl px-4 pt-32 sm:px-6">
        <div className="frame glow">
          <div className="frame-in relative grid items-center gap-10 overflow-hidden p-8 sm:p-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="slashes pointer-events-none absolute -left-60 top-0 h-full w-[50rem] opacity-30" />
            <div className="relative">
              <p className="eyebrow text-white/70">
                Support <span className="text-neon">The City</span>
              </p>
              <h2 className="mt-5 leading-[0.9]">
                <span className="chrome block text-5xl sm:text-6xl">Midland</span>
                <span className="brush block -rotate-2 text-5xl sm:text-6xl">Store</span>
              </h2>
              <p className="mt-6 max-w-md text-white/60">
                Supporter packs, Resident+ housing and Business Licences. Every purchase helps keep the servers running and the updates coming.
              </p>
              <Link href="/store" className="btn btn-neon mt-8 !px-7 !py-4 text-sm">
                Visit the store <ArrowIcon />
              </Link>
            </div>
            <div className="relative grid grid-cols-3 gap-3 sm:gap-4">
              {["/packages/resident-plus.webp", "/packages/black-card.webp", "/packages/business-licence.webp"].map((src, i) => (
                <Link
                  key={src}
                  href="/store"
                  aria-label="Visit the store"
                  className={`frame block transition duration-500 hover:z-10 hover:-translate-y-2 hover:scale-[1.04] ${i === 1 ? "-translate-y-4" : "translate-y-4 opacity-85"}`}
                >
                  <div className="frame-in relative aspect-[4/5] overflow-hidden">
                    <Image src={src} alt="" fill sizes="(max-width: 1024px) 30vw, 220px" className="object-cover" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- HOW TO JOIN ---------------- */}
      <section id="join" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 pt-32 sm:px-6">
        <SectionHeading eyebrow="Four Steps In" title="How to" brush="Join" sub="You can be on the streets of Midland in a few minutes." />
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <DownloadIcon />,
              title: "Get FiveM",
              text: "Install FiveM on your PC. You'll need a legal copy of GTA V.",
              cta: { href: "https://fivem.net", label: "Download FiveM" },
            },
            {
              icon: <DiscordIcon className="h-6 w-6" />,
              title: "Join the Discord",
              text: "Announcements, support tickets, applications and the community all live here.",
              cta: { href: DISCORD_URL, label: "Open Discord" },
            },
            {
              icon: <BookIcon />,
              title: "Read the rules",
              text: "Take two minutes to read the city rules. Knowing them keeps roleplay fun for everyone.",
              cta: { href: "/rules", label: "View rules" },
            },
            {
              icon: <ServerIcon />,
              title: "Connect",
              text: CONNECT_URL
                ? "Hit connect below, or search Midland Madness in the FiveM server list."
                : "Search Midland Madness in the FiveM server list, or grab the connect link from our Discord.",
              cta: CONNECT_URL ? { href: FIVEM_CONNECT, label: "Connect now" } : { href: DISCORD_URL, label: "Get connect link" },
            },
          ].map((s, i) => (
            <li key={s.title} className="frame">
              <div className="frame-in flex flex-col p-7">
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-neon/10 text-neon ring-1 ring-neon/40">{s.icon}</div>
                  <span className="brush text-4xl opacity-80">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-black italic uppercase">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{s.text}</p>
                {s.cta.href.startsWith("/") ? (
                  <Link href={s.cta.href} className="mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon uppercase hover:underline">
                    {s.cta.label} <ArrowIcon />
                  </Link>
                ) : (
                  <a
                    href={s.cta.href}
                    target={s.cta.href.startsWith("fivem:") ? undefined : "_blank"}
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon uppercase hover:underline"
                  >
                    {s.cta.label} <ArrowIcon />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------- DISCORD CTA ---------------- */}
      <section className="relative mx-auto max-w-7xl px-4 pt-32 sm:px-6">
        <div className="frame glow">
          <div className="frame-in noise bg-city relative overflow-hidden px-8 py-16 text-center sm:py-20">
            <div className="grid-lines absolute inset-0" />
            <div className="relative">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#5865F2] text-white shadow-[0_0_50px_-6px_#5865F2]">
                <DiscordIcon className="h-8 w-8" />
              </div>
              <h2 className="mt-8 leading-[0.9]">
                <span className="chrome block text-4xl sm:text-6xl">Join the</span>
                <span className="brush block -rotate-2 text-5xl sm:text-7xl">Community</span>
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-white/60">
                News, events, giveaways, support and a few hundred people who are just as mad about Midland as you are.
              </p>
              {discord && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
                  <span className="flex items-center gap-2 text-white/80">
                    <span className="h-2.5 w-2.5 rounded-full bg-neon shadow-[0_0_10px_#3dff5a]" />
                    <b className="text-white">{fmt(discord.online)}</b> online
                  </span>
                  <span className="flex items-center gap-2 text-white/80">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
                    <b className="text-white">{fmt(discord.members)}</b> members
                  </span>
                </div>
              )}
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="btn btn-neon !px-8 !py-4 text-sm">
                  <DiscordIcon className="h-4 w-4" /> Join the Discord
                </a>
                <Link href="/store" className="btn btn-ghost !px-8 !py-4 text-sm">
                  <StarIcon className="h-4 w-4" /> Support the city
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value, sub, live }: { label: string; value: string; sub: string; live?: boolean }) {
  return (
    <div className="frame [--c:10px]">
      <div className="frame-in px-4 py-3.5">
        <p className="eyebrow flex items-center gap-2 !text-[0.58rem] text-white/60">
          {live && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon shadow-[0_0_8px_#3dff5a]" />}
          {label}
        </p>
        <p className="mt-1 text-2xl font-black italic text-white">{value}</p>
        <p className="text-[0.7rem] text-white/60">{sub}</p>
      </div>
    </div>
  );
}
