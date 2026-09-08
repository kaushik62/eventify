export type UserRole = "USER" | "ORGANIZER" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface EventItem {
  id: number;
  organizer_id: number;
  organizer_name?: string;
  name: string;
  description: string;
  category: string;
  location: string;
  event_date: string;
  event_time: string;
  price: string | number;
  total_seats: number;
  available_seats: number;
  image_url: string | null;
  created_at: string;
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "FAILED";

export interface Booking {
  id: number;
  user_id: number;
  event_id: number;
  event_name?: string;
  event_date?: string;
  event_time?: string;
  location?: string;
  image_url?: string | null;
  tickets: number;
  total_amount: string | number;
  status: BookingStatus;
  created_at: string;
}

export interface OrganizerStats {
  total_events: number;
  total_bookings: number;
  tickets_sold: number;
  revenue: number;
}

export interface AdminStats {
  totalUsers: number;
  totalOrganizers: number;
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
