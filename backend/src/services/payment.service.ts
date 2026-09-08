import Razorpay from "razorpay";
import crypto from "crypto";
import { query } from "../db/db";
import { ApiError } from "../utils/apiResponse";
import { getBookingById, confirmBooking, failBooking } from "./booking.service";

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

export const createRazorpayOrder = async (bookingId: number, userId: number) => {
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

  const order = await razorpay.orders.create({
    amount: Math.round(Number(booking.total_amount) * 100), // paise
    currency: "INR",
    receipt: `booking_${booking.id}`,
  });

  await query(
    `INSERT INTO payments (booking_id, razorpay_order_id, amount, status)
     VALUES ($1, $2, $3, 'CREATED')`,
    [bookingId, order.id, booking.total_amount]
  );

  return { order, booking };
};

export const verifyRazorpayPayment = async (input: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  bookingId: number;
}) => {
  const body = `${input.razorpay_order_id}|${input.razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
    .update(body)
    .digest("hex");

  const isValid = expectedSignature === input.razorpay_signature;

  if (!isValid) {
    await failBooking(input.bookingId);
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

  const booking = await confirmBooking(input.bookingId);
  return booking;
};
