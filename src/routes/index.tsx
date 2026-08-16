import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import {
  CtaBand,
  FeaturedCategories,
  HowItWorksSection,
  PopularPackages,
  Testimonials,
  TopPhotographers,
  WhyHub,
} from "@/components/home/Sections";

const title = "Photographer Hub — Book Premium Photographers in India";
const description =
  "Browse verified wedding, portrait, event and product photographers with transparent packages. Compare, choose and book in minutes.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <TopPhotographers />
      <PopularPackages />
      <HowItWorksSection />
      <WhyHub />
      <Testimonials />
      <CtaBand />
    </>
  );
}
