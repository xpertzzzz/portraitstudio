import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/PageHero";
import { PackageCard } from "@/components/PackageCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoriesQuery, packagesQuery } from "@/lib/hub";

const title = "Product Catalog — The Portrait Studio";
const description =
  "Compare transparent photography packages — coverage hours, edited photos, albums, drone and cinematic video — and book the right one.";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: PackagesPage,
});

function PackagesPage() {
  const { data: packages, isLoading } = useQuery(packagesQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("popular");

  const results = useMemo(() => {
    let list = (packages ?? []).filter((p) => {
      const hay = `${p.name} ${p.description} ${p.photographer?.name ?? ""} ${p.category?.name ?? ""}`.toLowerCase();
      if (term && !hay.includes(term.toLowerCase())) return false;
      if (category !== "all" && p.category?.slug !== category) return false;
      return true;
    });
    list = list.slice().sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "newest")
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return (b.badge ? 1 : 0) - (a.badge ? 1 : 0);
    });
    return list;
  }, [packages, term, category, sort]);

  return (
    <>
      <PageHero
        eyebrow="Our Offerings"
        title="Product Catalog"
        subtitle="Explore our premium photography packages and order directly via WhatsApp."
        image="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=80"
        crumbs={[{ label: "Products" }]}
      />

      <div className="container-hub py-14">
        <div className="mb-8 grid gap-3 rounded-2xl border bg-card p-4 shadow-soft md:grid-cols-[1fr_14rem_14rem]">
          <Input
            value={term}
            maxLength={100}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search packages…"
            aria-label="Search packages"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger aria-label="Category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger aria-label="Sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-asc">Lowest Price</SelectItem>
              <SelectItem value="price-desc">Highest Price</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[30rem] rounded-2xl" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-16 text-center">
            <p className="font-display text-2xl">No packages found</p>
            <p className="mt-2 text-sm text-muted-foreground">Try another category or search term.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <PackageCard key={p.id} pkg={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
