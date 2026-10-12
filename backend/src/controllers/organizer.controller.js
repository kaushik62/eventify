import { asyncHandler } from "../utils/asyncHandler.js";
import { success, ApiError } from "../utils/apiResponse.js";
import { applyOrganizerSchema } from "../schemas/auth.schema.js";
import * as authService from "../services/auth.service.js";

export const apply = asyncHandler(async (req, res) => {
  const input = applyOrganizerSchema.parse(req.body);
  const updatedUser = await authService.applyForOrganizer(req.user.id, input);
  return success(
    res,
    {
      message: "Organizer application submitted successfully and is pending review.",
      organizer: updatedUser,
    },
    200
  );
});

export const status = asyncHandler(async (req, res) => {
  const organizer = await authService.getOrganizerStatus(req.user.id);
  return success(res, {
    id: organizer.id,
    name: organizer.name,
    email: organizer.email,
    role: organizer.role,
    organizer_status: organizer.organizer_status,
    organizer_applied_at: organizer.organizer_applied_at,
    organizer_decided_at: organizer.organizer_decided_at,
    organizer_rejection_reason: organizer.organizer_rejection_reason,
    organization_name: organizer.organization_name,
    organizer_bio: organizer.organizer_bio,
    created_at: organizer.created_at,
  });
});
