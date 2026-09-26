import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendBookingConfirmation = async ({
  email,
  name,
  eventName,
  bookingId,
  date,
  time,
  location,
  seats,
  amount,
}) => {
  return transporter.sendMail({
    from: `"Eventify" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Booking Confirmed - ${eventName}`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #16a34a;">Booking Confirmed!</h2>

        <p>Hi ${name},</p>

        <p>Your booking has been confirmed. We're excited to see you at the event!</p>

        <h3>${eventName}</h3>

        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Seats:</strong> ${seats}</p>
        <p><strong>Amount Paid:</strong> ₹${amount}</p>

        <p>Please keep your booking ID for future reference.</p>

        <p>Thank you for choosing Eventify!</p>
        <p>Team Eventify</p>
      </div>
    `,
  });
};