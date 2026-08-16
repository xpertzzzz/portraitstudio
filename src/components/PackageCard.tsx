import { Link } from "@tanstack/react-router";
import { Check, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { inr, type PackageWithRelations } from "@/lib/hub";
import { cn } from "@/lib/utils";

export function PackageCard({ pkg }: { pkg: PackageWithRelations }) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-elevated",
        pkg.badge === "Most Popular" && "border-gold ring-1 ring-gold/40",
      )}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={pkg.image_url}
          alt={pkg.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {pkg.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-gradient-gold px-3 py-1 text-[11px] font-semibold text-gold-foreground shadow-soft">
            {pkg.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-eyebrow">{pkg.category?.name ?? "Photography"}</p>
          <h3 className="mt-1 text-lg font-semibold">{pkg.name}</h3>
          {pkg.photographer && (
            <p className="text-xs text-muted-foreground">
              by {pkg.photographer.name} · {pkg.photographer.location}
            </p>
          )}
        </div>

        <p className="font-display text-3xl font-semibold">{inr(pkg.price)}</p>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" /> {pkg.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" /> {pkg.photographers_count} photographer
            {pkg.photographers_count > 1 ? "s" : ""}
          </span>
        </div>

        <ul className="space-y-1.5 text-sm">
          {pkg.features.slice(0, 5).map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0 text-gold" />
              <span className="text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>

        <Button asChild variant="gold" className="mt-auto w-full flex items-center justify-center gap-2">
          <a
            href={`https://wa.me/919658410830?text=Hello%20The%20Portrait%20Studio!%20I'm%20interested%20in%20buying%20the%20${encodeURIComponent(pkg.name)}%20package.`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy on WhatsApp
          </a>
        </Button>
      </div>
    </article>
  );
}
