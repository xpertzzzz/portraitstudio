import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { PhotographerBrowser } from "@/components/PhotographerBrowser";

const title = "Photographers — Photographer Hub";
const description =
  "Browse verified photographers across India. Filter by category, city, budget, rating and experience, then book in minutes.";

export const Route = createFileRoute("/photographers/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: PhotographersPage,
});

function PhotographersPage() {
  return (
    <>
      <PageHero
        eyebrow="The marketplace"
        title="Photographers"
        subtitle="Verified professionals, transparent pricing and portfolios you can actually judge."
        image="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1800&q=80"
        crumbs={[{ label: "Photographers" }]}
      />
      <div className="container-hub py-14">
        <PhotographerBrowser />
      </div>
    </>
  );
}
