import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarCheck, IndianRupee, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { inr, prettyDate, STATUS_LABELS, type Booking, type Message } from "@/lib/hub";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Photographer Hub" },
      { name: "description", content: "Bookings, enquiries and marketplace activity at a glance." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Dashboard — Photographer Hub" },
      { property: "og:description", content: "Photographer Hub operations dashboard." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate({ to: "/admin/login", replace: true });
      else setChecked(true);
    });
  }, [navigate]);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin", "bookings"],
    enabled: checked,
    queryFn: async (): Promise<Booking[]> => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["admin", "messages"],
    enabled: checked,
    queryFn: async (): Promise<Message[]> => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      return data ?? [];
    },
  });

  if (!checked) return null;

  const revenue = bookings.reduce((sum, b) => sum + Number(b.amount ?? 0), 0);
  const pending = bookings.filter((b) => b.status === "pending").length;

  const stats = [
    { icon: CalendarCheck, label: "Recent bookings", value: String(bookings.length) },
    { icon: IndianRupee, label: "Pipeline value", value: inr(revenue) },
    { icon: Users, label: "Pending approval", value: String(pending) },
    { icon: MessageSquare, label: "Messages", value: String(messages.length) },
  ];

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-card">
        <div className="container-hub flex items-center justify-between py-5">
          <div>
            <p className="text-eyebrow">Photographer Hub</p>
            <h1 className="font-display text-2xl font-semibold">Admin dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/">View site</Link>
            </Button>
            <Button variant="ink" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container-hub space-y-10 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl border bg-card p-5 shadow-soft">
              <Icon className="size-5 text-gold" />
              <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="mb-4 font-display text-xl font-semibold">Latest bookings</h2>
          {isLoading ? (
            <Skeleton className="h-48 rounded-xl" />
          ) : bookings.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No bookings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="py-2">Reference</th>
                    <th>Customer</th>
                    <th>Event date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-t">
                      <td className="py-3 font-medium">{b.booking_ref}</td>
                      <td>{b.customer_name}</td>
                      <td>{prettyDate(b.event_date)}</td>
                      <td>{inr(Number(b.amount ?? 0))}</td>
                      <td>
                        <Badge variant="secondary">
                          {STATUS_LABELS[b.status ?? "pending"] ?? b.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="mb-4 font-display text-xl font-semibold">Recent messages</h2>
          {messages.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            <ul className="divide-y">
              {messages.map((m) => (
                <li key={m.id} className="py-3">
                  <p className="font-medium">{m.title}</p>
                  <p className="text-sm text-muted-foreground">{m.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{prettyDate(m.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
