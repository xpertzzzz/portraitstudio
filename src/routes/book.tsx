import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { inr, packagesQuery, photographersQuery, submitBooking } from "@/lib/hub";

const searchSchema = z.object({
  photographer: fallback(z.string(), "").default(""),
  pkg: fallback(z.string(), "").default(""),
});

const detailsSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  city: z.string().trim().min(2, "Enter the event city").max(100),
  event_date: z.string().trim().min(1, "Pick an event date"),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const Route = createFileRoute("/book")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Book a Photographer — Photographer Hub" },
      {
        name: "description",
        content:
          "Send a booking request in three steps: choose your photographer and package, share event details, and confirm.",
      },
      { property: "og:title", content: "Book a Photographer — Photographer Hub" },
      {
        property: "og:description",
        content: "Three steps to lock in your date with a verified photographer.",
      },
    ],
  }),
  component: BookPage,
});

const STEPS = ["Choose", "Details", "Confirm"];

function BookPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { data: photographers = [] } = useQuery(photographersQuery);
  const { data: packages = [] } = useQuery(packagesQuery);
  const createBooking = useMutation({ mutationFn: submitBooking });

  const [step, setStep] = useState(0);
  const [photographerSlug, setPhotographerSlug] = useState(search.photographer);
  const [packageId, setPackageId] = useState(search.pkg);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    event_date: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);

  const photographer = photographers.find((p) => p.slug === photographerSlug);
  const availablePackages = useMemo(
    () => packages.filter((p) => !photographer || p.photographer?.slug === photographerSlug),
    [packages, photographer, photographerSlug],
  );
  const pkg = packages.find((p) => p.id === packageId);
  const amount = pkg?.price ?? photographer?.starting_price ?? 0;

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function next() {
    if (step === 0) {
      if (!photographerSlug) return toast.error("Select a photographer to continue");
      return setStep(1);
    }
    if (step === 1) {
      const parsed = detailsSchema.safeParse(form);
      if (!parsed.success) {
        const e: Record<string, string> = {};
        parsed.error.issues.forEach((i) => (e[String(i.path[0])] = i.message));
        setErrors(e);
        return;
      }
      setErrors({});
      return setStep(2);
    }
  }

  async function submit() {
    if (!photographer) return;
    try {
      const booking = await createBooking.mutateAsync({
        photographerId: photographer.id,
        packageId: pkg?.id ?? null,
        categoryId: pkg?.category?.id ?? null,
        name: form.name,
        email: form.email,
        phone: form.phone,
        eventDate: form.event_date,
        eventTime: "",
        eventLocation: form.city,
        guests: 0,
        notes: form.notes,
        amount,
      });
      setDone(booking.booking_ref);
      toast.success("Booking request sent");
    } catch {
      toast.error("Could not send your request. Please try again.");
    }
  }

  if (done) {
    return (
      <div className="container-hub flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Check className="size-8" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-semibold">Request received</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Your booking reference is{" "}
          <span className="font-semibold text-foreground">{done}</span>. Our team verifies
          availability with {photographer?.name} and confirms by email within one working day.
        </p>
        <Button variant="gold" className="mt-8" onClick={() => navigate({ to: "/" })}>
          Back to home
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="Reserve your date"
        subtitle="Three quick steps. No payment needed to send a request."
        image="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80"
        crumbs={[{ label: "Book" }]}
      />

      <div className="container-hub grid gap-10 py-14 lg:grid-cols-[1fr_20rem]">
        <div>
          <ol className="mb-10 flex items-center gap-4">
            {STEPS.map((s, i) => (
              <li key={s} className="flex flex-1 items-center gap-3">
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    i <= step ? "bg-gold text-ink" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-medium">{s}</span>
                {i < STEPS.length - 1 && <span className="h-px flex-1 bg-border" />}
              </li>
            ))}
          </ol>

          {step === 0 && (
            <div className="grid gap-5 rounded-2xl border bg-card p-6 shadow-soft">
              <div className="grid gap-2">
                <Label>Photographer</Label>
                <Select
                  value={photographerSlug}
                  onValueChange={(v) => {
                    setPhotographerSlug(v);
                    setPackageId("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a photographer" />
                  </SelectTrigger>
                  <SelectContent>
                    {photographers.map((p) => (
                      <SelectItem key={p.id} value={p.slug}>
                        {p.name} — {p.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Package (optional)</Label>
                <Select value={packageId} onValueChange={setPackageId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Custom / decide later" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePackages.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} — {inr(p.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-5 rounded-2xl border bg-card p-6 shadow-soft sm:grid-cols-2">
              {[
                { k: "name", label: "Full name", type: "text" },
                { k: "email", label: "Email", type: "email" },
                { k: "phone", label: "Phone", type: "tel" },
                { k: "city", label: "Event city", type: "text" },
                { k: "event_date", label: "Event date", type: "date" },
              ].map((f) => (
                <div key={f.k} className="grid gap-2">
                  <Label htmlFor={f.k}>{f.label}</Label>
                  <Input
                    id={f.k}
                    type={f.type}
                    maxLength={255}
                    value={form[f.k as keyof typeof form]}
                    onChange={(e) => set(f.k, e.target.value)}
                  />
                  {errors[f.k] && <p className="text-xs text-destructive">{errors[f.k]}</p>}
                </div>
              ))}
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="notes">Notes for the photographer</Label>
                <Textarea
                  id="notes"
                  maxLength={1000}
                  rows={4}
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Venue, timings, must-have shots…"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <dl className="grid gap-3 rounded-2xl border bg-card p-6 text-sm shadow-soft">
              {[
                ["Photographer", photographer?.name ?? "—"],
                ["Package", pkg?.name ?? "Custom quote"],
                ["Name", form.name],
                ["Email", form.email],
                ["Phone", form.phone],
                ["Event date", form.event_date],
                ["City", form.city],
                ["Estimated amount", inr(amount)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-b pb-2 last:border-none">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6 flex gap-3">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step < 2 ? (
              <Button variant="gold" onClick={next}>
                Continue
              </Button>
            ) : (
              <Button variant="gold" onClick={submit} disabled={createBooking.isPending}>
                {createBooking.isPending ? "Sending…" : "Confirm booking request"}
              </Button>
            )}
          </div>
        </div>

        <aside>
          <div className="sticky top-32 rounded-2xl border bg-card p-6 shadow-elevated">
            <p className="text-eyebrow">Summary</p>
            <p className="mt-3 font-display text-2xl font-semibold">
              {photographer?.name ?? "Select a photographer"}
            </p>
            <p className="text-sm text-muted-foreground">{pkg?.name ?? "Custom quote"}</p>
            <p className="mt-5 font-display text-3xl font-semibold text-gold">{inr(amount)}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Final amount is confirmed after our team verifies availability.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
