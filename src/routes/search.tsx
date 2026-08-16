import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { PageHero } from "@/components/PageHero";
import { PhotographerCard } from "@/components/PhotographerCard";
import { PackageCard } from "@/components/PackageCard";
import { packagesQuery, photographersQuery } from "@/lib/hub";

const searchSchema = z.object({ q: fallback(z.string(), "").default("") });

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Search Photographers & Packages — Photographer Hub" },
      {
        name: "description",
        content:
          "Search photographers and photography packages by style, city or occasion across Photographer Hub.",
      },
      { property: "og:title", content: "Search — Photographer Hub" },
      {
        property: "og:description",
        content: "Find the right photographer or package in seconds.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const term = q.slice(0, 100).toLowerCase().trim();
  const { data: photographers = [] } = useQuery(photographersQuery);
  const { data: packages = [] } = useQuery(packagesQuery);

  const words = term.split(/\s+/).filter(Boolean);
  const match = (hay: string) => words.every((w) => hay.toLowerCase().includes(w));

  const p = photographers.filter((x) =>
    match(`${x.name} ${x.location} ${x.description} ${x.specializations.join(" ")}`),
  );
  const pk = packages.filter((x) =>
    match(`${x.name} ${x.description} ${x.category?.name ?? ""} ${x.photographer?.location ?? ""}`),
  );

  return (
    <>
      <PageHero
        eyebrow="Search results"
        title={term ? `“${q.slice(0, 60)}”` : "Search"}
        subtitle={`${p.length} photographers and ${pk.length} packages matched your search.`}
        image="https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?auto=format&fit=crop&w=1800&q=80"
        crumbs={[{ label: "Search" }]}
      />
      <div className="container-hub space-y-14 py-14">
        <section>
          <h2 className="mb-6 font-display text-3xl font-semibold">Photographers</h2>
          {p.length === 0 ? (
            <p className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
              No photographers matched. Try “wedding photographer” or a city name.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {p.map((x) => (
                <PhotographerCard key={x.id} photographer={x} />
              ))}
            </div>
          )}
        </section>
        <section>
          <h2 className="mb-6 font-display text-3xl font-semibold">Packages</h2>
          {pk.length === 0 ? (
            <p className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
              No packages matched your search.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pk.map((x) => (
                <PackageCard key={x.id} pkg={x} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
