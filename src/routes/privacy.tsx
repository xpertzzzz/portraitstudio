import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";

const title = "Privacy Policy — Photographer Hub";
const description =
  "How Photographer Hub collects, uses and protects the information you share when booking a photographer.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS = [
  {
    h: "What we collect",
    p: "Your name, email, phone number, event city and date, plus any notes you add to a booking request or contact message.",
  },
  {
    h: "How we use it",
    p: "Only to process your booking request, share it with the photographer you selected, and follow up about your enquiry.",
  },
  {
    h: "Who sees it",
    p: "Our operations team and the photographer attached to your booking. We do not sell or rent your data to third parties.",
  },
  {
    h: "Retention",
    p: "Booking records are retained for accounting purposes. You can ask us to delete your personal details at any time.",
  },
  {
    h: "Your choices",
    p: "Write to hello@photographerhub.in to access, correct or delete the information we hold about you.",
  },
];

function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="What we collect, why we collect it, and how to have it removed."
        image="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1800&q=80"
        crumbs={[{ label: "Privacy" }]}
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
