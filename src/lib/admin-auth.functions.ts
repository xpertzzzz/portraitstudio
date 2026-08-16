import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const credentialsSchema = z.object({
  username: z.string().trim().min(1).max(64),
  password: z.string().min(1).max(128),
});

/**
 * Demo admin sign-in.
 *
 * The public credentials (default `admin` / `admin`) are only an alias for a
 * real backend account. Change them at any time by setting the ADMIN_USERNAME
 * and ADMIN_PASSWORD secrets — no code change required.
 */
export const adminSignIn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => credentialsSchema.parse(data))
  .handler(async ({ data }) => {
    const expectedUser = process.env["ADMIN_USERNAME"] ?? "admin";
    const expectedPass = process.env["ADMIN_PASSWORD"] ?? "admin";

    if (data.username.toLowerCase() !== expectedUser.toLowerCase() || data.password !== expectedPass) {
      return { ok: false as const, error: "Invalid username or password" };
    }

    const email = process.env["ADMIN_EMAIL"] ?? "admin@photographerhub.in";
    const internalPassword =
      process.env["ADMIN_INTERNAL_PASSWORD"] ?? "PhotographerHub#Admin-2026";

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    let userId = existing?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;

    if (!userId) {
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: internalPassword,
        email_confirm: true,
      });
      if (error || !created.user) {
        return { ok: false as const, error: "Could not initialise the admin account" };
      }
      userId = created.user.id;
    } else {
      await supabaseAdmin.auth.admin.updateUserById(userId, { password: internalPassword });
    }

    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

    const { createClient } = await import("@supabase/supabase-js");
    const anonClient = createClient(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"]!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { data: session, error: signInError } = await anonClient.auth.signInWithPassword({
      email,
      password: internalPassword,
    });

    if (signInError || !session.session) {
      return { ok: false as const, error: "Sign-in failed, please try again" };
    }

    return {
      ok: true as const,
      access_token: session.session.access_token,
      refresh_token: session.session.refresh_token,
    };
  });
