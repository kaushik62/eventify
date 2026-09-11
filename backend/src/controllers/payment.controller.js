import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import { createOrderSchema, verifyPaymentSchema } from "../schemas/payment.schema.js";
import * as paymentService from "../services/payment.service.js";

export const createOrder = asyncHandler(async (req, res) => {
  const input = createOrderSchema.parse(req.body);
  const result = await paymentService.createRazorpayOrder(input.bookingId, req.user.id);
  return success(res, result);
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const input = verifyPaymentSchema.parse(req.body);
  const booking = await paymentService.verifyRazorpayPayment(input, req.user.id);
  return success(res, booking);
});
