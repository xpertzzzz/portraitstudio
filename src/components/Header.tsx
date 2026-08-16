import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Camera, Menu, Search, ChevronDown, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { categoriesQuery } from "@/lib/hub";

const NAV = [
  { to: "/photographers", label: "Photographers" },
  { to: "/packages", label: "Packages" },
  { to: "/categories", label: "Categories" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { data: categories = [] } = useQuery(categoriesQuery);

  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q: term.trim().slice(0, 100) } });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur-xl">
      <div className="container-hub flex h-16 items-center gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-ink">
            <Camera className="size-4 text-gold" />
          </span>
          <span className="hidden font-display text-xl font-semibold leading-none sm:block">
            The Portrait<span className="text-gold"> Studio</span>
          </span>
        </Link>

        <form onSubmit={runSearch} className="relative hidden flex-1 md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            maxLength={100}
            placeholder="Search photographers, services or locations…"
            className="h-10 rounded-full pl-9"
            aria-label="Search"
          />
        </form>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.slice(0, 4).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "text-foreground font-semibold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/admin/login">
              <LogIn className="size-4" /> Admin
            </Link>
          </Button>
          <Button asChild variant="gold" size="sm" className="hidden sm:inline-flex">
            <Link to="/book" search={{ photographer: "", pkg: "" }}>
              Book a Photographer
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] overflow-y-auto sm:w-96">
              <SheetTitle className="font-display text-2xl">The Portrait Studio</SheetTitle>
              <form onSubmit={runSearch} className="relative mt-4">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  maxLength={100}
                  placeholder="Search photographers…"
                  className="pl-9"
                />
              </form>
              <div className="mt-5 flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <p className="mt-5 text-eyebrow">Categories</p>
              <div className="mt-2 flex flex-col">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to="/categories/$slug"
                    params={{ slug: c.slug }}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
              <div className="mt-6 grid gap-2">
                <Button asChild variant="gold">
                  <Link
                    to="/book"
                    search={{ photographer: "", pkg: "" }}
                    onClick={() => setOpen(false)}
                  >
                    Book a Photographer
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/admin/login" onClick={() => setOpen(false)}>
                    Admin Login
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Amazon-style category strip */}
      <div className="hidden border-t bg-secondary/60 lg:block">
        <div className="container-hub relative flex h-11 items-center gap-1 text-sm">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-semibold transition-colors hover:bg-accent"
          >
            <Menu className="size-4" /> All Categories
            <ChevronDown className="size-3.5" />
          </button>
          {categories.slice(0, 8).map((c) => (
            <Link
              key={c.id}
              to="/categories/$slug"
              params={{ slug: c.slug }}
              className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {c.name.replace(" Photography", "")}
            </Link>
          ))}
          <Link
            to="/categories"
            className="ml-auto text-xs font-semibold text-gold hover:underline"
          >
            View All Categories →
          </Link>

          {menuOpen && (
            <div className="absolute left-0 top-11 z-50 w-full rounded-b-2xl border bg-card p-5 shadow-elevated">
              <div className="grid grid-cols-4 gap-2">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to="/categories/$slug"
                    params={{ slug: c.slug }}
                    className="rounded-lg p-3 transition-colors hover:bg-accent"
                  >
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{c.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
