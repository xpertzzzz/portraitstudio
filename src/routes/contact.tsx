import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { submitContactMessage } from "@/lib/hub";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().min(2, "Add a subject").max(150),
  body: z.string().trim().min(10, "Tell us a little more").max(1000),
});

const title = "Contact The Portrait Studio";
const description =
  "Questions about booking, packages or our services? Send The Portrait Studio team a message or reach us on WhatsApp.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const createMessage = useMutation({ mutationFn: submitContactMessage });
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const err: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (err[String(i.path[0])] = i.message));
      setErrors(err);
      return;
    }
    setErrors({});
    try {
      await createMessage.mutateAsync({ ...parsed.data, phone: "", message: parsed.data.body });
      toast.success("Message sent — we'll reply within a working day.");
      setForm({ name: "", email: "", subject: "", body: "" });
    } catch {
      toast.error("Could not send your message. Please try again.");
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Talk to us"
        title="Contact"
        subtitle="Booking help, package advice, or general inquiries."
        image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1800&q=80"
        crumbs={[{ label: "Contact" }]}
      />
      <div className="container-hub grid gap-10 py-16 lg:grid-cols-[1fr_20rem]">
        <form onSubmit={onSubmit} className="grid gap-5 rounded-2xl border bg-card p-6 shadow-soft sm:grid-cols-2">
          {[
            { k: "name", label: "Your name", type: "text" },
            { k: "email", label: "Email", type: "email" },
          ].map((f) => (
            <div key={f.k} className="grid gap-2">
              <Label htmlFor={f.k}>{f.label}</Label>
              <Input
                id={f.k}
                type={f.type}
                maxLength={255}
                value={form[f.k as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
              />
              {errors[f.k] && <p className="text-xs text-destructive">{errors[f.k]}</p>}
            </div>
          ))}
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              maxLength={150}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            {errors["subject"] && <p className="text-xs text-destructive">{errors["subject"]}</p>}
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              rows={6}
              maxLength={1000}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
            {errors["body"] && <p className="text-xs text-destructive">{errors["body"]}</p>}
          </div>
          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="sm:col-span-2"
            disabled={createMessage.isPending}
          >
            {createMessage.isPending ? "Sending…" : "Send message"}
          </Button>
        </form>

        <aside className="space-y-4">
          {[
            { icon: Mail, label: "hello@theportraitstudio.com" },
            { icon: Phone, label: "+91 96584 10830" },
            { icon: MapPin, label: "Jharapada, Mahadev Nagar, Sarala Nagar, Cenal Site Road" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl border bg-card p-5 shadow-soft">
              <Icon className="size-5 text-gold" />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </aside>
      </div>
    </>
  );
}
