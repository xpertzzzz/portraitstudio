import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoriesQuery } from "@/lib/hub";

export function Hero() {
  const navigate = useNavigate();
  const { data: categories = [] } = useQuery(categoriesQuery);
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/search",
      search: {
        q: [type, location].filter(Boolean).join(" ").slice(0, 100),
      },
    });
  };

  return (
    <section className="relative isolate overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80"
        alt="Wedding photographer capturing a couple at golden hour"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 overlay-cinematic" />

      <div className="container-hub flex flex-col items-center py-28 text-center text-ink-foreground md:py-36">
        <p className="text-eyebrow animate-fade-up">Premium Photography Marketplace</p>
        <h1 className="mt-4 max-w-3xl animate-fade-up font-display text-5xl font-semibold leading-[1.05] md:text-7xl">
          Capture Moments.
          <br />
          <span className="text-gold">Create Memories.</span>
        </h1>
        <p className="mt-5 max-w-xl animate-fade-up text-sm opacity-85 md:text-base">
          Discover talented photographers and premium photography packages for every occasion.
        </p>

        <div className="mt-8 flex animate-fade-up flex-wrap justify-center gap-3">
          <Button asChild variant="gold" size="xl">
            <Link to="/photographers">Find a Photographer</Link>
          </Button>
          <Button
            asChild
            size="xl"
            variant="outline"
            className="border-ink-foreground/40 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
          >
            <Link to="/packages">Explore Packages</Link>
          </Button>
        </div>

        <form
          onSubmit={search}
          className="mt-12 w-full max-w-5xl animate-fade-up rounded-2xl surface-glass p-4 text-left text-foreground shadow-elevated"
        >
          <p className="px-1 pb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            What are you looking for?
          </p>
          <div className="grid gap-3 md:grid-cols-5">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger aria-label="Photography type">
                <SelectValue placeholder="Photography type" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Location"
              value={location}
              maxLength={60}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Location"
            />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label="Event date"
            />
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger aria-label="Budget">
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10000">Under ₹10,000</SelectItem>
                <SelectItem value="25000">₹10,000 – ₹25,000</SelectItem>
                <SelectItem value="50000">₹25,000 – ₹50,000</SelectItem>
                <SelectItem value="100000">₹50,000+</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" variant="gold" className="h-9 w-full">
              <Search className="size-4" /> Search
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
