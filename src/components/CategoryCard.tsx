import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/hub";

export function CategoryCard({ category, count }: { category: Category; count?: number }) {
  return (
    <Link
      to="/categories/$slug"
      params={{ slug: category.slug }}
      className="group relative block h-64 overflow-hidden rounded-2xl shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-elevated"
    >
      <img
        src={category.image_url}
        alt={`${category.name} example`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 overlay-cinematic" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-ink-foreground">
        <h3 className="font-display text-2xl font-semibold">{category.name}</h3>
        <p className="mt-1 line-clamp-1 text-xs opacity-80">{category.description}</p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gold">
          {count !== undefined ? `${count} photographers` : "Explore"}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </p>
      </div>
    </Link>
  );
}
