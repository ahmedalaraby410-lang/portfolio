import Link from "next/link";

const nav = [
  ["Work", "/#featured-work"],
  ["Journey", "/#journey"],
  ["About", "/#about"],
  ["Contact", "/#contact"]
];

export function SiteNav() {
  const links = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true"
    ? nav
    : [...nav, ["Admin", "/admin"]];

  return (
    <header className="container-x fixed left-1/2 top-4 z-50 -translate-x-1/2">
      <nav className="glass flex items-center justify-between rounded-full px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-wide">
          Ahmed Alaraby
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map(([label, href]) => (
            <Link key={label} href={href} className="rounded-full px-4 py-2 text-sm text-paper/68 transition hover:bg-white/10 hover:text-paper">
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
