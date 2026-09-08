import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { createOrderSchema, verifyPaymentSchema } from "../schemas/payment.schema";
import * as paymentService from "../services/payment.service";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const input = createOrderSchema.parse(req.body);
  const { order, booking } = await paymentService.createRazorpayOrder(input.bookingId, req.user!.id);
  return success(
    res,
    {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      booking,
    },
    201
  );
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const input = verifyPaymentSchema.parse(req.body);
  const booking = await paymentService.verifyRazorpayPayment(input);
  return success(res, booking);
});
