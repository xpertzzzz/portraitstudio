import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/PageHero";
import { CategoryCard } from "@/components/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { categoriesQuery, packagesQuery } from "@/lib/hub";

const title = "Photography Categories — Photographer Hub";
const description =
  "Wedding, pre-wedding, portrait, fashion, product, corporate, maternity, drone and more — explore every photography category.";

export const Route = createFileRoute("/categories/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: categories, isLoading } = useQuery(categoriesQuery);
  const { data: packages = [] } = useQuery(packagesQuery);

  return (
    <>
      <PageHero
        eyebrow="Browse the catalogue"
        title="Photography Categories"
        subtitle="Every occasion has its own craft. Start with the moment you want captured."
        image="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1800&q=80"
        crumbs={[{ label: "Categories" }]}
      />
      <div className="container-hub grid gap-5 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)
          : categories?.map((c) => (
              <CategoryCard
                key={c.id}
                category={c}
                count={packages.filter((p) => p.category?.id === c.id).length}
              />
            ))}
      </div>
    </>
  );
}
