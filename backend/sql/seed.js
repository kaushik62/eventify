import bcrypt from "bcrypt";
import { query } from "../src/db/db.js";

async function seed() {
  console.log("Seeding test data...");

  // Clean existing seed data
  await query("TRUNCATE payments, bookings, events, users RESTART IDENTITY CASCADE");

  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Users
  const userRes = await query(
    `INSERT INTO users (name, email, password, role)
     VALUES 
       ('Kaushik User', 'user@example.com', $1, 'USER'),
       ('Tech Events Org', 'organizer@example.com', $1, 'ORGANIZER'),
       ('Eventify Admin', 'admin@example.com', $1, 'ADMIN')
     RETURNING id, name, email, role`,
    [passwordHash]
  );
  const user = userRes.rows[0];
  const organizer = userRes.rows[1];
  console.log("Created users:", userRes.rows.map(u => `${u.name} (${u.email})`));

  // Compute upcoming weekend dates
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sun, 6 is Sat
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + daysUntilSaturday);
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);

  const satStr = saturday.toISOString().split("T")[0];
  const sunStr = sunday.toISOString().split("T")[0];

  // 2. Events
  const eventsRes = await query(
    `INSERT INTO events (organizer_id, name, description, category, location, event_date, event_time, price, total_seats, available_seats, image_url)
     VALUES
       ($1, 'React India Summit Ranchi', 'Annual conference exploring React 19, Next.js, and AI web applications.', 'Technology', 'Ranchi, Jharkhand', $2, '10:00:00', 450.00, 100, 42, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200'),
       ($1, 'Modern Frontend & AI Workshop', 'Hands-on masterclass building LLM applications with LangGraph and React.', 'Technology', 'Ranchi, Jharkhand', $3, '14:00:00', 300.00, 50, 15, 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200'),
       ($1, 'Bangalore Tech Expo 2026', 'Premier technology expo showcasing SaaS, Cloud, and AI innovations in Silicon Valley of India.', 'Technology', 'Bangalore, Karnataka', $2, '09:00:00', 1200.00, 500, 250, 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200'),
       ($1, 'Bangalore Indie Music Night', 'Live acoustic concert featuring prominent indie rock bands and artists.', 'Music', 'Bangalore, Karnataka', $3, '19:00:00', 499.00, 200, 0, 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200'),
       ($1, 'National Open Source Hackathon', '36-hour hackathon to build open source AI tools with community mentors.', 'Technology', 'Delhi, NCR', $2, '08:00:00', 0.00, 150, 80, 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200')
     RETURNING id, name, location, price, available_seats, event_date`,
    [organizer.id, satStr, sunStr]
  );
  console.log("Created events:", eventsRes.rows.map(e => `${e.id}: ${e.name} (${e.location}) ₹${e.price} [${e.available_seats} seats]`));

  // 3. Bookings
  const bookingRes = await query(
    `INSERT INTO bookings (user_id, event_id, tickets, total_amount, status)
     VALUES ($1, $2, 2, 900.00, 'CONFIRMED')
     RETURNING *`,
    [user.id, eventsRes.rows[0].id]
  );
  console.log("Created booking:", bookingRes.rows[0].id, "for user", user.id, "on event", eventsRes.rows[0].id);

  console.log("✓ Seeding completed successfully!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seeding error:", err);
  process.exit(1);
});
