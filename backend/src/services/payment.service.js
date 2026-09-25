import Razorpay from "razorpay";
import crypto from "crypto";
import { query } from "../db/db.js";
import { ApiError } from "../utils/apiResponse.js";
import { getBookingById, confirmBooking, failBooking } from "./booking.service.js";

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

export const createRazorpayOrder = async (bookingId, userId) => {
  if (!razorpay) {
    throw new ApiError(503, "Payment service is not configured. Add Razorpay keys to continue.");
  }

  const booking = await getBookingById(bookingId);
  if (booking.user_id !== userId) {
    throw new ApiError(403, "This booking does not belong to you");
  }
  if (booking.status !== "PENDING") {
    throw new ApiError(400, "This booking is not awaiting payment");
  }
  if (Date.now() - new Date(booking.created_at).getTime() > 15 * 60 * 1000) {
    await failBooking(booking.id);
    throw new ApiError(410, "This booking hold has expired. Please book again.");
  }

  const order = await razorpay.orders.create({
    amount: Math.round(Number(booking.total_amount) * 100),
    currency: "INR",
    receipt: `booking_${booking.id}`,
  });

  await query(
    `INSERT INTO payments (booking_id, razorpay_order_id, amount, status)
     VALUES ($1, $2, $3, 'CREATED')`,
    [bookingId, order.id, booking.total_amount]
  );

  return {
    order,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    booking,
  };
};

export const verifyRazorpayPayment = async (input, userId) => {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(503, "Payment service is not configured");
  }

  const paymentResult = await query(
    `SELECT p.booking_id, p.status AS payment_status, b.user_id, b.status AS booking_status
     FROM payments p JOIN bookings b ON b.id = p.booking_id
     WHERE p.razorpay_order_id = $1`,
    [input.razorpay_order_id]
  );
  const payment = paymentResult.rows[0];
  if (!payment) throw new ApiError(404, "Payment order not found");
  if (payment.user_id !== userId) throw new ApiError(403, "This payment does not belong to you");
  if (payment.payment_status === "PAID") return getBookingById(payment.booking_id, userId);
  if (payment.booking_status !== "PENDING") throw new ApiError(409, "This booking is no longer awaiting payment");

  const body = `${input.razorpay_order_id}|${input.razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  const isValid = crypto.timingSafeEqual(
    Buffer.from(expectedSignature, "utf8"),
    Buffer.from(input.razorpay_signature, "utf8")
  );

  if (!isValid) {
    await failBooking(payment.booking_id);
    await query(
      "UPDATE payments SET status = 'FAILED' WHERE razorpay_order_id = $1",
      [input.razorpay_order_id]
    );
    throw new ApiError(400, "Payment signature verification failed");
  }

  await query(
    `UPDATE payments SET razorpay_payment_id = $1, status = 'PAID' WHERE razorpay_order_id = $2`,
    [input.razorpay_payment_id, input.razorpay_order_id]
  );

  return confirmBooking(payment.booking_id);
};