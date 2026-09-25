import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generatePresignedUploadUrl } from "../services/upload.service.js";

const presignedUrlSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileType: z.string().min(1, "File type is required"),
});

export const getPresignedUrl = asyncHandler(async (req, res) => {
  const { fileName, fileType } = presignedUrlSchema.parse(req.body);

  const data = await generatePresignedUploadUrl(fileName, fileType);

  return res.status(200).json({ success: true, data });
});