import { Link } from "@tanstack/react-router";
import { Camera, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { to: "/photographers", label: "Photographers" },
      { to: "/packages", label: "Packages" },
      { to: "/categories", label: "Categories" },
      { to: "/how-it-works", label: "How It Works" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/terms", label: "Terms" },
      { to: "/privacy", label: "Privacy Policy" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "/contact", label: "Help Center" },
      { to: "/contact", label: "Booking Support" },
      { to: "/admin/login", label: "Admin Login" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-24 bg-gradient-ink text-ink-foreground">
      <div className="container-hub grid gap-10 py-16 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-gold/15">
              <Camera className="size-4 text-gold" />
            </span>
            <span className="font-display text-xl font-semibold">The Portrait Studio</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm opacity-70">
            Wedding Photographers in Bhubaneswar. Capturing memories through the lens 📸
          </p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <span
                key={i}
                className="grid size-9 cursor-pointer place-items-center rounded-full border border-ink-foreground/15 transition-colors hover:border-gold hover:text-gold"
              >
                <Icon className="size-4" />
              </span>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-eyebrow">{col.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="opacity-75 transition-opacity hover:opacity-100">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-foreground/10">
        <div className="container-hub flex flex-col gap-2 py-6 text-xs opacity-60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} The Portrait Studio. All rights reserved.</p>
          <p>Jharapada, Mahadev Nagar, Sarala Nagar, Cenal Site Road | +91 96584 10830</p>
        </div>
      </div>
    </footer>
  );
}
