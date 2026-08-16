import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, ReceiptText, MousePointerClick, Sparkles, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CategoryCard } from "@/components/CategoryCard";
import { PhotographerCard } from "@/components/PhotographerCard";
import { PackageCard } from "@/components/PackageCard";
import { RatingStars } from "@/components/RatingStars";
import {
  approvedReviewsQuery,
  categoriesQuery,
  packagesQuery,
  photographersQuery,
} from "@/lib/hub";

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: { to: string; label: string };
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-eyebrow">{eyebrow}</p>
        <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold md:text-4xl">{title}</h2>
      </div>
      {action && (
        <Button asChild variant="outlineGold" size="sm">
          <Link to={action.to}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}

function CardSkeletons({ count = 4, height = "h-80" }: { count?: number; height?: string }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`${height} rounded-2xl`} />
      ))}
    </>
  );
}

export function FeaturedCategories() {
  const { data: categories, isLoading } = useQuery(categoriesQuery);
  const { data: photographers = [] } = useQuery(photographersQuery);

  const countFor = (slug: string) =>
    photographers.filter((p) =>
      p.specializations.some((s) => slug.includes((s.toLowerCase().split(" ")[0] ?? s.toLowerCase()))),
    ).length;

  return (
    <section className="container-hub py-20">
      <SectionHeading
        eyebrow="Browse by occasion"
        title="Find the Perfect Photographer for Your Moment"
        action={{ to: "/categories", label: "View All Categories" }}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <CardSkeletons count={8} height="h-64" />
        ) : (
          categories
            ?.slice(0, 8)
            .map((c) => <CategoryCard key={c.id} category={c} count={countFor(c.slug) || 3} />)
        )}
      </div>
    </section>
  );
}

export function TopPhotographers() {
  const { data: photographers, isLoading } = useQuery(photographersQuery);
  return (
    <section className="bg-secondary/50 py-20">
      <div className="container-hub">
        <SectionHeading
          eyebrow="Verified professionals"
          title="Top Photographers"
          action={{ to: "/photographers", label: "Browse All" }}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <CardSkeletons />
          ) : (
            photographers?.slice(0, 8).map((p) => <PhotographerCard key={p.id} photographer={p} />)
          )}
        </div>
      </div>
    </section>
  );
}

export function PopularPackages() {
  const { data: packages, isLoading } = useQuery(packagesQuery);
  const featured = packages
    ?.slice()
    .sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0))
    .slice(0, 3);

  return (
    <section className="container-hub py-20">
      <SectionHeading
        eyebrow="Transparent pricing"
        title="Popular Photography Packages"
        action={{ to: "/packages", label: "All Packages" }}
      />
      <div className="grid gap-6 md:grid-cols-3">
        {isLoading ? <CardSkeletons count={3} /> : featured?.map((p) => <PackageCard key={p.id} pkg={p} />)}
      </div>
    </section>
  );
}

const STEPS = [
  {
    n: "01",
    title: "Discover",
    text: "Find photographers based on your event, location and budget.",
  },
  { n: "02", title: "Choose", text: "Compare photographers and photography packages." },
  { n: "03", title: "Book", text: "Send a booking request and connect with the photographer." },
];

export function HowItWorksSection() {
  return (
    <section className="bg-gradient-ink py-20 text-ink-foreground">
      <div className="container-hub">
        <p className="text-eyebrow">Simple by design</p>
        <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">How It Works</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="border-t border-ink-foreground/15 pt-6">
              <p className="font-display text-5xl font-semibold text-gold">{s.n}</p>
              <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm opacity-70">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const WHY = [
  {
    icon: BadgeCheck,
    title: "Verified Photographers",
    text: "Work with trusted professionals, reviewed and verified by our team.",
  },
  {
    icon: ReceiptText,
    title: "Transparent Packages",
    text: "Know exactly what you are getting before you book — no surprises.",
  },
  {
    icon: MousePointerClick,
    title: "Easy Booking",
    text: "Book photography services in just a few clicks, any time of day.",
  },
  {
    icon: Sparkles,
    title: "Premium Experience",
    text: "A seamless experience from discovery to delivery of your gallery.",
  },
];

export function WhyHub() {
  return (
    <section className="container-hub py-20">
      <SectionHeading eyebrow="Why us" title="Why Photographer Hub" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {WHY.map((w) => (
          <div
            key={w.title}
            className="rounded-2xl border bg-card p-6 shadow-soft transition-transform duration-500 hover:-translate-y-1"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-gold-soft">
              <w.icon className="size-5 text-gold-foreground" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{w.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{w.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Testimonials() {
  const { data: reviews = [] } = useQuery(approvedReviewsQuery);
  if (reviews.length === 0) return null;

  return (
    <section className="bg-secondary/50 py-20">
      <div className="container-hub">
        <SectionHeading eyebrow="Loved by couples & brands" title="Customer Reviews" />
        <Carousel opts={{ align: "start", loop: true }}>
          <CarouselContent>
            {reviews.map((r) => (
              <CarouselItem key={r.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-soft">
                  <Quote className="size-6 text-gold" />
                  <RatingStars rating={r.rating} className="mt-4" />
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    “{r.body}”
                  </p>
                  <p className="mt-5 text-sm font-semibold">— {r.customer_name}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="container-hub py-20">
      <div className="relative overflow-hidden rounded-3xl">
        <img
          src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1800&q=80"
          alt="Couple photographed at their wedding reception"
          loading="lazy"
          className="h-[22rem] w-full object-cover"
        />
        <div className="absolute inset-0 overlay-cinematic" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-ink-foreground">
          <h2 className="max-w-2xl font-display text-4xl font-semibold md:text-5xl">
            Your story deserves a great photographer
          </h2>
          <p className="mt-3 max-w-lg text-sm opacity-80">
            Send a booking request in under two minutes. Our team confirms availability with the
            photographer for you.
          </p>
          <Button asChild variant="gold" size="xl" className="mt-7">
            <Link to="/book" search={{ photographer: "", pkg: "" }}>
              Book a Photographer
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
