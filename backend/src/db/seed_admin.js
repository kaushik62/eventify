import bcrypt from "bcrypt";
import { query } from "./db.js";

export const seedAdmin = async () => {
  const email = "admin@eventify.com";
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  await query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, 'ADMIN')
     ON CONFLICT (email) 
     DO UPDATE SET password = $3, role = 'ADMIN', name = $1`,
    ["Super Administrator", email, hashedPassword]
  );

  console.log(`✓ Admin account ready: ${email} / ${password}`);
};

if (process.argv[1]?.endsWith("seed_admin.js")) {
  seedAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Failed to seed admin:", err);
      process.exit(1);
    });
}
