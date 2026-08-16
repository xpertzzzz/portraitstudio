import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/PageHero";
import { PhotographerBrowser } from "@/components/PhotographerBrowser";
import { PackageCard } from "@/components/PackageCard";
import { Button } from "@/components/ui/button";
import { categoriesQuery, packagesQuery } from "@/lib/hub";

export const Route = createFileRoute("/categories/$slug")({
  head: ({ params }) => {
    const pretty = params.slug
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
    const title = `${pretty} Photographers & Packages — Photographer Hub`;
    const description = `Compare ${pretty.toLowerCase()} photographers, portfolios and packages across India, then send a booking request.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: packages = [] } = useQuery(packagesQuery);
  const category = categories.find((c) => c.slug === slug);
  const categoryPackages = packages.filter((p) => p.category?.slug === slug);

  return (
    <>
      <PageHero
        eyebrow="Category"
        title={category?.name ?? "Photography"}
        subtitle={category?.description ?? "Explore photographers in this category."}
        image={
          category?.image_url ??
          "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1800&q=80"
        }
        crumbs={[{ label: "Categories", to: "/categories" }, { label: category?.name ?? slug }]}
      />

      <div className="container-hub py-14">
        {categoryPackages.length > 0 && (
          <section className="mb-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-eyebrow">Ready-made</p>
                <h2 className="mt-2 font-display text-3xl font-semibold">Packages in this category</h2>
              </div>
              <Button asChild variant="outlineGold" size="sm">
                <Link to="/packages">All packages</Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {categoryPackages.slice(0, 3).map((p) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </div>
          </section>
        )}

        <PhotographerBrowser presetCategory={slug} />
      </div>
    </>
  );
}
