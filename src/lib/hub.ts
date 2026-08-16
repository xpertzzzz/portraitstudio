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
    return [
      { id: "1", name: "Wedding", slug: "wedding", is_active: true, sort_order: 1, created_at: "", updated_at: "" },
      { id: "2", name: "Pre-Wedding", slug: "pre-wedding", is_active: true, sort_order: 2, created_at: "", updated_at: "" },
      { id: "3", name: "Portrait", slug: "portrait", is_active: true, sort_order: 3, created_at: "", updated_at: "" },
      { id: "4", name: "Event", slug: "event", is_active: true, sort_order: 4, created_at: "", updated_at: "" },
    ];
  },
};

export const photographersQuery = {
  queryKey: ["photographers"],
  queryFn: async (): Promise<Photographer[]> => {
    return [
      {
        id: "1",
        name: "The Portrait Studio",
        slug: "the-portrait-studio",
        is_active: true,
        rating: 5,
        location: "Bhubaneswar",
        profile_image: "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80",
        cover_image: null,
        bio: "Capturing memories through the lens 📸",
        specializations: ["Wedding", "Pre-Wedding", "Portrait"],
        created_at: "",
        updated_at: "",
      }
    ];
  },
};

export const packagesQuery = {
  queryKey: ["packages"],
  queryFn: async (): Promise<PackageWithRelations[]> => {
    return [
      {
        id: "1",
        name: "Premium Wedding Package",
        photographer_id: "1",
        category_id: "1",
        price: 75000,
        duration: "2 Days",
        photographers_count: 3,
        features: ["Candid Photography", "Cinematic Videography", "Traditional Photo & Video", "Premium Album", "Drone Coverage"],
        badge: "Most Popular",
        image_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
        is_active: true,
        created_at: "",
        updated_at: "",
        photographer: { id: "1", name: "The Portrait Studio", slug: "the-portrait-studio", location: "Bhubaneswar", rating: 5, profile_image: "" },
        category: { id: "1", name: "Wedding", slug: "wedding" },
      },
      {
        id: "2",
        name: "Pre-Wedding Shoot",
        photographer_id: "1",
        category_id: "2",
        price: 25000,
        duration: "1 Day",
        photographers_count: 2,
        features: ["Outdoor Locations", "Cinematic Teaser", "30 Edited Photos", "Props Included"],
        badge: "Trending",
        image_url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
        is_active: true,
        created_at: "",
        updated_at: "",
        photographer: { id: "1", name: "The Portrait Studio", slug: "the-portrait-studio", location: "Bhubaneswar", rating: 5, profile_image: "" },
        category: { id: "2", name: "Pre-Wedding", slug: "pre-wedding" },
      }
    ];
  },
};

export const approvedReviewsQuery = {
  queryKey: ["reviews", "approved"],
  queryFn: async (): Promise<Review[]> => {
    return [
      {
        id: "1",
        photographer_id: "1",
        customer_name: "Amit & Priya",
        rating: 5,
        body: "Amazing experience! They captured our wedding beautifully. Highly recommended in Bhubaneswar.",
        status: "approved",
        created_at: "",
        updated_at: "",
      }
    ];
  },
};

export const photographerBySlugQuery = (slug: string) => ({
  queryKey: ["photographer", slug],
  queryFn: async (): Promise<Photographer | null> => {
    if (slug === "the-portrait-studio") {
      return {
        id: "1",
        name: "The Portrait Studio",
        slug: "the-portrait-studio",
        is_active: true,
        rating: 5,
        location: "Bhubaneswar",
        profile_image: "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80",
        cover_image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1600&q=80",
        bio: "Capturing memories through the lens 📸\n\nJharapada, Mahadev Nagar , Sarala Nagar , Cenal Site Road",
        specializations: ["Wedding", "Pre-Wedding", "Portrait"],
        created_at: "",
        updated_at: "",
      };
    }
    return null;
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
  console.log("Mock booking submitted:", input);
  return { id: "mock-id", booking_ref: "BK-MOCK" };
}

export async function submitContactMessage(values: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  console.log("Mock contact message submitted:", values);
}

export async function submitReview(values: {
  photographerId: string;
  customerName: string;
  rating: number;
  body: string;
}) {
  console.log("Mock review submitted:", values);
}
