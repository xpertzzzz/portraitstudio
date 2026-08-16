import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminSignIn } from "@/lib/admin-auth.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — Photographer Hub" },
      { name: "description", content: "Sign in to the Photographer Hub admin dashboard." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Sign In — Photographer Hub" },
      { property: "og:description", content: "Photographer Hub admin access." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await adminSignIn({ data: { username: username.trim(), password } });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      await supabase.auth.setSession({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      });
      toast.success("Welcome back");
      navigate({ to: "/admin" });
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-border/40 bg-card p-8 shadow-elevated"
      >
        <div className="mb-6 flex size-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
          <Lock className="size-5" />
        </div>
        <h1 className="font-display text-2xl font-semibold">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Photographer Hub control room.</p>

        <div className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              maxLength={60}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              maxLength={100}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" variant="gold" size="lg" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </div>
      </form>
    </div>
  );
}
