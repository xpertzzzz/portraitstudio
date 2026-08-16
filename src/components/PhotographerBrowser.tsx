import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhotographerCard } from "@/components/PhotographerCard";
import { categoriesQuery, inr, photographersQuery } from "@/lib/hub";

const SORTS = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-asc", label: "Lowest Price" },
  { value: "price-desc", label: "Highest Price" },
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
];

export function PhotographerBrowser({
  presetCategory,
  initialQuery = "",
}: {
  presetCategory?: string;
  initialQuery?: string;
}) {
  const { data: photographers, isLoading } = useQuery(photographersQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);

  const [term, setTerm] = useState(initialQuery);
  const [category, setCategory] = useState(presetCategory ?? "all");
  const [location, setLocation] = useState("all");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRating, setMinRating] = useState("0");
  const [minExperience, setMinExperience] = useState("0");
  const [sort, setSort] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  const locations = useMemo(
    () => Array.from(new Set((photographers ?? []).map((p) => p.location))).sort(),
    [photographers],
  );

  const results = useMemo(() => {
    let list = (photographers ?? []).filter((p) => {
      const haystack =
        `${p.name} ${p.location} ${p.description} ${p.specializations.join(" ")}`.toLowerCase();
      if (term && !term.toLowerCase().split(" ").every((w) => haystack.includes(w))) return false;
      if (category !== "all") {
        const catName = categories.find((c) => c.slug === category)?.name ?? category;
        const key = catName.replace(" Photography", "").replace(" Videography", "").toLowerCase();
        if (!p.specializations.some((s) => s.toLowerCase().includes(key))) return false;
      }
      if (location !== "all" && p.location !== location) return false;
      if (p.starting_price > maxPrice) return false;
      if (Number(p.rating) < Number(minRating)) return false;
      if (p.experience_years < Number(minExperience)) return false;
      return true;
    });

    list = list.slice().sort((a, b) => {
      switch (sort) {
        case "rating":
          return Number(b.rating) - Number(a.rating);
        case "price-asc":
          return a.starting_price - b.starting_price;
        case "price-desc":
          return b.starting_price - a.starting_price;
        case "popular":
          return b.reviews_count - a.reviews_count;
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return Number(b.rating) * b.reviews_count - Number(a.rating) * a.reviews_count;
      }
    });
    return list;
  }, [photographers, categories, term, category, location, maxPrice, minRating, minExperience, sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
        <div className="space-y-6 rounded-2xl border bg-card p-5 shadow-soft lg:sticky lg:top-32">
          <p className="font-display text-xl font-semibold">Filters</p>

          <div className="space-y-2">
            <Label>Search</Label>
            <Input
              value={term}
              maxLength={100}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Name, style, city…"
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
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
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                {locations.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Max starting price — {inr(maxPrice)}</Label>
            <Slider
              value={[maxPrice]}
              onValueChange={([v]) => setMaxPrice(v ?? 100000)}
              min={5000}
              max={100000}
              step={1000}
            />
          </div>

          <div className="space-y-2">
            <Label>Minimum rating</Label>
            <Select value={minRating} onValueChange={setMinRating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any rating</SelectItem>
                <SelectItem value="4">4.0+</SelectItem>
                <SelectItem value="4.5">4.5+</SelectItem>
                <SelectItem value="4.8">4.8+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Experience</Label>
            <Select value={minExperience} onValueChange={setMinExperience}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any experience</SelectItem>
                <SelectItem value="3">3+ years</SelectItem>
                <SelectItem value="5">5+ years</SelectItem>
                <SelectItem value="10">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              setTerm("");
              setCategory(presetCategory ?? "all");
              setLocation("all");
              setMaxPrice(100000);
              setMinRating("0");
              setMinExperience("0");
            }}
          >
            Reset filters
          </Button>
        </div>
      </aside>

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading photographers…" : `${results.length} photographers available`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setShowFilters((v) => !v)}
            >
              <SlidersHorizontal className="size-4" /> Filters
            </Button>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-16 text-center">
            <p className="font-display text-2xl">No photographers match those filters</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try widening your budget or clearing a filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p) => (
              <PhotographerCard key={p.id} photographer={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
