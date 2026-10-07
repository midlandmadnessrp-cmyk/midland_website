import Image from "next/image";
import Link from "next/link";

export function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  const lg = size === "lg";
  return (
    <Link href="/" className="group inline-flex items-center" aria-label="Midland Madness Roleplay home">
      <Image
        src="/logo-sm.webp"
        alt="Midland Madness Roleplay"
        width={lg ? 212 : 149}
        height={lg ? 80 : 56}
        priority={!lg}
        className={`w-auto drop-shadow-[0_0_14px_rgba(61,255,90,0.35)] transition-transform duration-300 group-hover:scale-105 ${lg ? "h-20" : "h-14"}`}
      />
    </Link>
  );
}
