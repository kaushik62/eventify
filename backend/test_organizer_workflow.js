import { pool, query } from "./src/db/db.js";
import { registerUser, loginUser } from "./src/services/auth.service.js";
import * as adminService from "./src/services/admin.service.js";
import * as eventService from "./src/services/event.service.js";

async function runTests() {
  console.log("=== STARTING ORGANIZER APPROVAL & WORKFLOW TESTS ===");

  const timestamp = Date.now();
  const adminEmail = `admin_${timestamp}@eventify.test`;
  const organizerEmail = `org_${timestamp}@eventify.test`;
  const attendeeEmail = `user_${timestamp}@eventify.test`;

  try {
    // 1. Create Admin
    const { user: adminUser } = await registerUser({
      name: "Super Admin",
      email: adminEmail,
      password: "password123",
      role: "ADMIN",
    });
    // Manually ensure role is ADMIN in database since registerUser defaults to USER/ORGANIZER
    await query("UPDATE users SET role = 'ADMIN' WHERE id = $1", [adminUser.id]);
    console.log("✔ Admin created with ID:", adminUser.id);

    // 2. Register Organizer - Must be PENDING
    const { user: orgUser } = await registerUser({
      name: "Summit Productions",
      email: organizerEmail,
      password: "password123",
      role: "ORGANIZER",
      organizationName: "Summit Inc",
      bio: "Tech summit conference organizer",
    });

    if (orgUser.organizer_status !== "PENDING") {
      throw new Error(`Expected organizer_status to be PENDING, got: ${orgUser.organizer_status}`);
    }
    console.log("✔ Newly registered organizer correctly set to PENDING");

    // 3. Verify Admin can list pending organizers
    const pendingList = await adminService.listOrganizers({ status: "PENDING" });
    const foundPending = pendingList.organizers.find((o) => o.id === orgUser.id);
    if (!foundPending) {
      throw new Error("Admin listOrganizers failed to find the pending organizer");
    }
    console.log("✔ Admin can view pending organizer in list");

    // 4. Admin approves organizer
    const approvedOrg = await adminService.approveOrganizer(orgUser.id, adminUser.id);
    if (approvedOrg.organizer_status !== "APPROVED") {
      throw new Error(`Expected status to be APPROVED, got: ${approvedOrg.organizer_status}`);
    }
    console.log("✔ Admin approved organizer successfully");

    // 5. Approved organizer creates an event
    const newEvent = await eventService.createEvent(orgUser.id, {
      name: "Global Tech Summit 2026",
      description: "Premier AI and software engineering conference",
      category: "Technology",
      location: "Bengaluru Convention Hall",
      eventDate: "2026-11-20",
      eventTime: "09:00:00",
      price: 2500,
      totalSeats: 100,
      imageUrl: "https://example.com/banner.jpg",
    });
    console.log("✔ Approved organizer successfully created event ID:", newEvent.id);

    // 6. Attendee registers and books tickets
    const { user: attendee } = await registerUser({
      name: "Aarav Patel",
      email: attendeeEmail,
      password: "password123",
      role: "USER",
    });

    const bookingRes = await query(
      `INSERT INTO bookings (user_id, event_id, tickets, total_amount, status)
       VALUES ($1, $2, 2, 5000, 'CONFIRMED')
       RETURNING *`,
      [attendee.id, newEvent.id]
    );
    const booking = bookingRes.rows[0];
    console.log("✔ Attendee booked confirmed tickets for event, Booking ID:", booking.id);

    // Insert verified payment
    await query(
      `INSERT INTO payments (booking_id, razorpay_order_id, razorpay_payment_id, amount, status)
       VALUES ($1, 'order_test_123', 'pay_test_456', 5000, 'PAID')`,
      [booking.id]
    );
    console.log("✔ Payment marked PAID in database");

    // 7. Verify Organizer Analytics
    const orgAnalytics = await adminService.getOrganizerAnalytics(orgUser.id);
    if (orgAnalytics.summary.grossRevenue !== 5000) {
      throw new Error(`Expected gross revenue 5000, got: ${orgAnalytics.summary.grossRevenue}`);
    }
    if (orgAnalytics.summary.totalBookings !== 1) {
      throw new Error(`Expected total bookings 1, got: ${orgAnalytics.summary.totalBookings}`);
    }
    console.log("✔ Organizer Analytics accurate: Revenue = ₹" + orgAnalytics.summary.grossRevenue);

    // 8. Add Refund and verify Net Revenue
    await query(
      `INSERT INTO refunds (booking_id, amount, reason, status)
       VALUES ($1, 1000, 'Partial refund requested', 'PROCESSED')`,
      [booking.id]
    );

    const orgAnalyticsAfterRefund = await adminService.getOrganizerAnalytics(orgUser.id);
    if (orgAnalyticsAfterRefund.summary.netRevenue !== 4000) {
      throw new Error(`Expected net revenue 4000 after refund, got: ${orgAnalyticsAfterRefund.summary.netRevenue}`);
    }
    console.log("✔ Refund correctly deducted from net revenue: ₹" + orgAnalyticsAfterRefund.summary.netRevenue);

    // 9. Verify Platform Revenue Analytics
    const platformAnalytics = await adminService.getPlatformRevenueAnalytics();
    if (platformAnalytics.metrics.totalApprovedOrganizers < 1) {
      throw new Error("Platform analytics failed to count approved organizers");
    }
    if (platformAnalytics.metrics.grossBookingRevenue < 5000) {
      throw new Error("Platform analytics gross booking revenue calculation mismatch");
    }
    if (platformAnalytics.metrics.totalRefunds < 1000) {
      throw new Error("Platform analytics total refunds calculation mismatch");
    }
    console.log("✔ Platform Revenue Analytics verified:", platformAnalytics.metrics);

    // 10. Admin rejects / revokes organizer
    const rejectedOrg = await adminService.rejectOrganizer(
      orgUser.id,
      adminUser.id,
      "Policy violation or quality concern"
    );
    if (rejectedOrg.organizer_status !== "REJECTED") {
      throw new Error(`Expected status REJECTED, got: ${rejectedOrg.organizer_status}`);
    }
    console.log("✔ Admin rejected organizer with reason logged");

    console.log("\nALL TESTS PASSED WITH 100% SUCCESS!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Test failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runTests();
