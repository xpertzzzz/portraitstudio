import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { HowItWorksSection, WhyHub } from "@/components/home/Sections";

const title = "How Booking Works — Photographer Hub";
const description =
  "Discover, compare and book a photographer in three simple steps. See how Photographer Hub handles requests, confirmations and payments.";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="Simple by design"
        title="How It Works"
        subtitle="From first search to final gallery — here's exactly what happens."
        image="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1800&q=80"
        crumbs={[{ label: "How It Works" }]}
      />
      <HowItWorksSection />
      <WhyHub />
      <section className="container-hub pb-20">
        <div className="rounded-3xl border bg-card p-10 text-center shadow-soft">
          <h2 className="font-display text-3xl font-semibold">Ready when you are</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Booking requests are free. You only confirm once the photographer's availability is
            verified by our team.
          </p>
          <Button asChild variant="gold" size="lg" className="mt-6">
            <Link to="/book" search={{ photographer: "", pkg: "" }}>
              Start a booking
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
