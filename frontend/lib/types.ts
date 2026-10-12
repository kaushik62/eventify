export type UserRole = "USER" | "ORGANIZER" | "ADMIN";

export type OrganizerStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  organizer_status?: OrganizerStatus | null;
  organizer_applied_at?: string | null;
  organizer_decided_at?: string | null;
  organizer_rejection_reason?: string | null;
  organization_name?: string | null;
  organizer_bio?: string | null;
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
  confirmed_bookings?: number;
  tickets_sold?: number;
  gross_revenue?: number;
  total_refunds?: number;
  net_revenue?: number;
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
  totalApprovedOrganizers?: number;
  pendingOrganizerApplications?: number;
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  grossRevenue?: number;
  totalRefunds?: number;
  netRevenue?: number;
}

export interface OrganizerListItem {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  organizer_status: OrganizerStatus;
  organizer_applied_at: string | null;
  organizer_decided_at: string | null;
  organizer_rejection_reason: string | null;
  organization_name: string | null;
  organizer_bio: string | null;
  created_at: string;
  decided_by_name: string | null;
  decided_by_email: string | null;
  total_events: number;
  total_bookings: number;
  tickets_sold: number;
  gross_revenue: number;
  total_refunds: number;
  net_revenue: number;
}

export interface PlatformRevenueMetrics {
  totalRegisteredOrganizers: number;
  totalApprovedOrganizers: number;
  pendingOrganizerApplications: number;
  rejectedOrganizerApplications: number;
  totalEvents: number;
  totalSuccessfulBookings: number;
  totalTicketsSold: number;
  grossBookingRevenue: number;
  totalRefunds: number;
  netBookingRevenue: number;
  currency: string;
}

export interface MonthlyTrend {
  month: string;
  booking_count: number;
  tickets_sold: number;
  gross_revenue: number;
}

export interface CategoryBreakdown {
  category: string;
  event_count: number;
  booking_count: number;
  revenue: number;
}

export interface PlatformRevenueAnalytics {
  metrics: PlatformRevenueMetrics;
  monthlyTrends: MonthlyTrend[];
  categoryBreakdown: CategoryBreakdown[];
  recentTransactions: any[];
  topOrganizers: any[];
}

export interface OrganizerAnalyticsResponse {
  organizer: OrganizerListItem;
  events: EventItem[];
  summary: {
    totalEvents: number;
    totalBookings: number;
    ticketsSold: number;
    grossRevenue: number;
    totalRefunds: number;
    netRevenue: number;
  };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
