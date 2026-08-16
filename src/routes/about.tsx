import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";

const title = "About Photographer Hub — Premium Photography Marketplace";
const description =
  "Photographer Hub connects customers with verified photographers across India through transparent packages and effortless booking.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: AboutPage,
});

const STATS = [
  { value: "500+", label: "Verified photographers" },
  { value: "12k+", label: "Moments captured" },
  { value: "9", label: "Cities covered" },
  { value: "4.9", label: "Average rating" },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title="A marketplace built for photographers and the people who hire them"
        subtitle="We started Photographer Hub because booking a photographer should feel as considered as the photographs themselves."
        image="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1800&q=80"
        crumbs={[{ label: "About" }]}
      />
      <div className="container-hub grid gap-12 py-16 lg:grid-cols-2">
        <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            Photographer Hub is a curated marketplace. Every photographer is reviewed by our team
            before they appear here — portfolio, delivery record and client feedback included.
          </p>
          <p>
            Packages are published with their full deliverables: coverage hours, edited photo
            counts, albums, drone and cinematic film. No hidden add-ons, no surprise invoices.
          </p>
          <p>
            When you send a booking request, our team verifies availability with the photographer
            and confirms within a working day. Payments stay flexible — advance or full — and are
            tracked transparently in your booking record.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border bg-card p-6 shadow-soft">
              <p className="font-display text-4xl font-semibold text-gold">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
