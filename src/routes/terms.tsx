import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";

const title = "Terms of Service — Photographer Hub";
const description =
  "The terms that govern bookings, cancellations and payments made through the Photographer Hub marketplace.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: TermsPage,
});

const SECTIONS = [
  {
    h: "Bookings",
    p: "A booking request is an enquiry, not a confirmed reservation. A booking becomes confirmed only after our team verifies the photographer's availability and notifies you by email.",
  },
  {
    h: "Payments",
    p: "Photographers may require an advance to hold a date. Amounts shown on package pages are inclusive of the listed deliverables; travel and outstation stay may be quoted separately.",
  },
  {
    h: "Cancellations",
    p: "Cancellations made more than 30 days before the event date are eligible for a refund of the advance minus processing charges. Later cancellations are at the photographer's discretion.",
  },
  {
    h: "Deliverables",
    p: "Edited photo counts, albums and film durations are as stated on the package. Delivery timelines begin from the event date and are confirmed in writing at booking.",
  },
  {
    h: "Content and rights",
    p: "Photographers retain copyright of their work unless otherwise agreed. Portfolio images displayed on Photographer Hub belong to the respective photographers.",
  },
];

function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="Plain-language terms for booking through Photographer Hub."
        image="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1800&q=80"
        crumbs={[{ label: "Terms" }]}
      />
      <div className="container-hub max-w-3xl space-y-8 py-16">
        {SECTIONS.map((s) => (
          <section key={s.h}>
            <h2 className="font-display text-2xl font-semibold">{s.h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
          </section>
        ))}
      </div>
    </>
  );
}
