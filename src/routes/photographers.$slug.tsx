import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Calendar, Languages, MapPin, Phone, Mail, Briefcase } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { RatingStars } from "@/components/RatingStars";
import { PackageCard } from "@/components/PackageCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import {
  inr,
  packagesQuery,
  photographerBySlugQuery,
  prettyDate,
  type Review,
} from "@/lib/hub";

export const Route = createFileRoute("/photographers/$slug")({
  head: ({ params }) => {
    const pretty = params.slug
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
    const title = `${pretty} — Photographer Hub`;
    const description = `View ${pretty}'s portfolio, packages, reviews and availability, then send a booking request on Photographer Hub.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: PhotographerProfile,
});

function PhotographerProfile() {
  const { slug } = Route.useParams();
  const { data: photographer, isLoading } = useQuery(photographerBySlugQuery(slug));
  const { data: packages = [] } = useQuery(packagesQuery);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", "photographer", photographer?.id],
    enabled: !!photographer?.id,
    queryFn: async (): Promise<Review[]> => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("photographer_id", photographer!.id)
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  if (isLoading) {
    return (
      <div className="container-hub space-y-4 py-20">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (!photographer) {
    return (
      <div className="container-hub py-32 text-center">
        <h1 className="font-display text-4xl">Photographer not found</h1>
        <Button asChild variant="gold" className="mt-6">
          <Link to="/photographers">Browse photographers</Link>
        </Button>
      </div>
    );
  }

  const ownPackages = packages.filter((p) => p.photographer?.slug === slug);

  return (
    <>
      <PageHero
        eyebrow={photographer.specializations.join(" • ")}
        title={photographer.name}
        subtitle={photographer.description}
        image={photographer.cover_image}
        crumbs={[{ label: "Photographers", to: "/photographers" }, { label: photographer.name }]}
      />

      <div className="container-hub grid gap-10 py-14 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-14">
          <section className="flex flex-wrap items-center gap-6 rounded-2xl border bg-card p-6 shadow-soft">
            <img
              src={photographer.profile_image}
              alt={photographer.name}
              className="size-24 rounded-full object-cover"
            />
            <div className="space-y-1.5">
              <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
                {photographer.name}
                {photographer.is_verified && <BadgeCheck className="size-5 text-gold" />}
              </h2>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" /> {photographer.location}
              </p>
              <RatingStars rating={Number(photographer.rating)} showValue />
              <p className="text-xs text-muted-foreground">
                {photographer.reviews_count} reviews · {photographer.availability}
              </p>
            </div>
            <dl className="ml-auto grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Briefcase className="size-3.5" /> Experience
                </dt>
                <dd className="font-semibold">{photographer.experience_years} years</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Languages className="size-3.5" /> Languages
                </dt>
                <dd className="font-semibold">{photographer.languages.join(", ")}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="size-3.5" /> Phone
                </dt>
                <dd className="font-semibold">{photographer.phone}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="size-3.5" /> Email
                </dt>
                <dd className="font-semibold">{photographer.email}</dd>
              </div>
            </dl>
          </section>

          <section>
            <p className="text-eyebrow">Portfolio</p>
            <h2 className="mb-6 mt-2 font-display text-3xl font-semibold">Selected work</h2>
            <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
              {photographer.portfolio.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setLightbox(src)}
                  className="block w-full overflow-hidden rounded-xl"
                >
                  <img
                    src={src}
                    alt={`${photographer.name} portfolio image ${i + 1}`}
                    loading="lazy"
                    className={`w-full object-cover transition-transform duration-700 hover:scale-105 ${
                      i % 3 === 0 ? "h-72" : "h-52"
                    }`}
                  />
                </button>
              ))}
            </div>
          </section>

          {ownPackages.length > 0 && (
            <section>
              <p className="text-eyebrow">Pricing</p>
              <h2 className="mb-6 mt-2 font-display text-3xl font-semibold">Packages</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {ownPackages.map((p) => (
                  <PackageCard key={p.id} pkg={p} />
                ))}
              </div>
            </section>
          )}

          <section>
            <p className="text-eyebrow">Reviews</p>
            <h2 className="mb-6 mt-2 font-display text-3xl font-semibold">What clients say</h2>
            {reviews.length === 0 ? (
              <p className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                No reviews published yet.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-2xl border bg-card p-5 shadow-soft">
                    <RatingStars rating={r.rating} />
                    <p className="mt-3 text-sm text-muted-foreground">“{r.body}”</p>
                    <p className="mt-4 text-sm font-semibold">
                      {r.customer_name}{" "}
                      <span className="font-normal text-muted-foreground">
                        · {prettyDate(r.created_at)}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside>
          <div className="sticky top-32 rounded-2xl border bg-card p-6 shadow-elevated">
            <p className="text-xs text-muted-foreground">Starting from</p>
            <p className="font-display text-4xl font-semibold">{inr(photographer.starting_price)}</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3.5" /> {photographer.availability} for new bookings
            </p>
            <Button asChild variant="gold" size="lg" className="mt-5 w-full">
              <Link to="/book" search={{ photographer: photographer.slug, pkg: "" }}>
                Book Now
              </Link>
            </Button>
            <Button asChild variant="outline" className="mt-2 w-full">
              <Link to="/contact">Ask a question</Link>
            </Button>
          </div>
        </aside>
      </div>

      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          {lightbox && (
            <img src={lightbox} alt="Portfolio preview" className="w-full rounded-xl" />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
