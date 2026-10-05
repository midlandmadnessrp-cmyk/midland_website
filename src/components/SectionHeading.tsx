export function SectionHeading({ eyebrow, title, brush, sub }: { eyebrow: string; title: string; brush?: string; sub?: string }) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <div className="flex items-center justify-center gap-4">
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-neon" />
        <p className="eyebrow text-white/80">
          {eyebrow.split(" ").map((w, i, a) => (
            <span key={i} className={i === a.length - 1 ? "text-neon" : ""}>
              {w}
              {i < a.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-neon" />
      </div>
      <h2 className="mt-5 leading-[0.9]">
        <span className="chrome block text-5xl sm:text-6xl">{title}</span>
        {brush && <span className="brush -mt-1 block -rotate-2 text-5xl sm:text-6xl">{brush}</span>}
      </h2>
      {sub && <p className="mx-auto mt-6 max-w-xl text-white/60">{sub}</p>}
    </div>
  );
}
