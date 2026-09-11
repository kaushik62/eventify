import { z } from "zod";

// Schema for creating Razorpay order
export const createOrderSchema = z.object({
  bookingId: z.number().int().positive("Invalid booking ID"),
});

// Schema for verifying Razorpay payment signature
export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, "Order ID is required"),
  razorpay_payment_id: z.string().min(1, "Payment ID is required"),
  razorpay_signature: z.string().length(64, "Invalid payment signature"),
});
