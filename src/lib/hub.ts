import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];
export type Category = Tables["categories"]["Row"];
export type Photographer = Tables["photographers"]["Row"];
export type Package = Tables["packages"]["Row"];
export type Booking = Tables["bookings"]["Row"];
export type Customer = Tables["customers"]["Row"];
export type Review = Tables["reviews"]["Row"];
export type Message = Tables["messages"]["Row"];

export type PackageWithRelations = Package & {
  photographer: Pick<Photographer, "id" | "name" | "slug" | "location" | "rating" | "profile_image"> | null;
  category: Pick<Category, "id" | "name" | "slug"> | null;
};

export const inr = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export const prettyDate = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const PAYMENT_LABELS: Record<string, string> = {
  unpaid: "Unpaid",
  advance_paid: "Advance Paid",
  fully_paid: "Fully Paid",
  refunded: "Refunded",
};

/* ---------------- public reads ---------------- */

export const categoriesQuery = {
  queryKey: ["categories"],
  queryFn: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
};

export const photographersQuery = {
  queryKey: ["photographers"],
  queryFn: async (): Promise<Photographer[]> => {
    const { data, error } = await supabase
      .from("photographers")
      .select("*")
      .eq("is_active", true)
      .order("rating", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
};

export const packagesQuery = {
  queryKey: ["packages"],
  queryFn: async (): Promise<PackageWithRelations[]> => {
    const { data, error } = await supabase
      .from("packages")
      .select(
        "*, photographer:photographers(id,name,slug,location,rating,profile_image), category:categories(id,name,slug)",
      )
      .eq("is_active", true)
      .order("price");
    if (error) throw error;
    return (data ?? []) as unknown as PackageWithRelations[];
  },
};

export const approvedReviewsQuery = {
  queryKey: ["reviews", "approved"],
  queryFn: async (): Promise<Review[]> => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
};

export const photographerBySlugQuery = (slug: string) => ({
  queryKey: ["photographer", slug],
  queryFn: async (): Promise<Photographer | null> => {
    const { data, error } = await supabase
      .from("photographers")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
});

/* ---------------- booking submission ---------------- */

export type BookingInput = {
  name: string;
  email: string;
  phone: string;
  categoryId: string | null;
  photographerId: string | null;
  packageId: string | null;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  guests: number;
  notes: string;
  amount: number;
};

export async function submitBooking(input: BookingInput) {
  const { data: customer } = await supabase
    .from("customers")
    .insert({ name: input.name, email: input.email, phone: input.phone })
    .select("id")
    .maybeSingle();

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      customer_id: customer?.id ?? null,
      photographer_id: input.photographerId,
      package_id: input.packageId,
      category_id: input.categoryId,
      customer_name: input.name,
      customer_email: input.email,
      customer_phone: input.phone,
      event_date: input.eventDate,
      event_time: input.eventTime,
      event_location: input.eventLocation,
      guests: input.guests,
      notes: input.notes,
      amount: input.amount,
      status: "pending",
      payment_status: "unpaid",
    })
    .select("*")
    .single();
  if (error) throw error;

  await supabase.from("messages").insert({
    type: "booking",
    title: "New Booking Received",
    body: `${input.name} requested a booking (${booking.booking_ref}) for ${prettyDate(input.eventDate)} — ${inr(input.amount)}`,
    name: input.name,
    email: input.email,
    phone: input.phone,
    booking_id: booking.id,
  });

  return booking;
}

export async function submitContactMessage(values: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  const { error } = await supabase.from("messages").insert({
    type: "contact",
    title: "New Contact Enquiry",
    body: values.message,
    name: values.name,
    email: values.email,
    phone: values.phone,
    subject: values.subject,
  });
  if (error) throw error;
}

export async function submitReview(values: {
  photographerId: string;
  customerName: string;
  rating: number;
  body: string;
}) {
  const { error } = await supabase.from("reviews").insert({
    photographer_id: values.photographerId,
    customer_name: values.customerName,
    rating: values.rating,
    body: values.body,
    status: "pending",
  });
  if (error) throw error;
}
