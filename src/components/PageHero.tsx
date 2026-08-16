import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  crumbs = [],
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
  crumbs?: { label: string; to?: string }[];
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 overlay-cinematic" />
      <div className="container-hub py-20 text-ink-foreground md:py-24">
        <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs opacity-75">
          <Link to="/" className="hover:text-gold">
            Home
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <ChevronRight className="size-3" />
              {c.to ? (
                <Link to={c.to} className="hover:text-gold">
                  {c.label}
                </Link>
              ) : (
                <span className="text-gold">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <p className="text-eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-sm opacity-85 md:text-base">{subtitle}</p>}
      </div>
    </section>
  );
}
