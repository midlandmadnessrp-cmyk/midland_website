import Link from "next/link";

export default function NotFound() {
  return (
    <div className="noise bg-city relative grid min-h-[80dvh] place-items-center overflow-hidden px-4 pt-28 text-center">
      <div className="grid-lines absolute inset-0" />
      <div className="relative">
        <p className="chrome text-[8rem] leading-none sm:text-[11rem]">404</p>
        <p className="brush -mt-6 -rotate-2 text-5xl">Lost in the city</p>
        <p className="mt-6 text-white/60">That page or package doesn&apos;t exist.</p>
        <Link href="/" className="btn btn-neon mt-8">Back to home</Link>
      </div>
    </div>
  );
}
