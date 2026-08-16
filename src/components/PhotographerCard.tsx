import { Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin } from "lucide-react";
import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import { inr, type Photographer } from "@/lib/hub";

export function PhotographerCard({ photographer }: { photographer: Photographer }) {
  const preview = photographer.portfolio.slice(0, 3);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-elevated">
      <div className="relative h-44 overflow-hidden">
        <img
          src={photographer.cover_image}
          alt={`${photographer.name} photography cover`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 overlay-cinematic" />
        {photographer.availability === "Available" && (
          <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-semibold text-foreground">
            <span className="mr-1.5 inline-block size-1.5 rounded-full bg-success align-middle" />
            Available
          </span>
        )}
      </div>

      <div className="-mt-8 px-5">
        <img
          src={photographer.profile_image}
          alt={photographer.name}
          loading="lazy"
          className="size-16 rounded-full border-4 border-card object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 pt-3">
        <div>
          <h3 className="flex items-center gap-1.5 text-lg font-semibold">
            {photographer.name}
            {photographer.is_verified && <BadgeCheck className="size-4 text-gold" />}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5" /> {photographer.location}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <RatingStars rating={Number(photographer.rating)} showValue />
          <span className="text-xs text-muted-foreground">
            ({photographer.reviews_count} reviews)
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          {photographer.specializations.join(" • ")}
        </p>

        {preview.length > 0 && (
          <div className="grid grid-cols-3 gap-1.5">
            {preview.map((src) => (
              <img
                key={src}
                src={src}
                alt={`${photographer.name} portfolio preview`}
                loading="lazy"
                className="h-14 w-full rounded-md object-cover"
              />
            ))}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-[11px] text-muted-foreground">Starting from</p>
            <p className="font-display text-xl font-semibold">
              {inr(photographer.starting_price)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/photographers/$slug" params={{ slug: photographer.slug }}>
              View Profile
            </Link>
          </Button>
          <Button asChild size="sm" variant="gold">
            <Link to="/book" search={{ photographer: photographer.slug, pkg: "" }}>
              Book Now
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
