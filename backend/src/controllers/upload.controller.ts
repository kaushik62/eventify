import { Request, Response } from "express";
import multer from "multer";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { generatePresignedUploadUrl, getImageFromS3, uploadImageToS3 } from "../services/upload.service";

const presignedUrlSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().regex(/^image\//, "Only image uploads are allowed"),
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed"));
      return;
    }
    cb(null, true);
  },
});

export const getPresignedUrl = asyncHandler(async (req: Request, res: Response) => {
  const { fileName, fileType } = presignedUrlSchema.parse(req.body);
  const result = await generatePresignedUploadUrl(fileName, fileType);
  return success(res, result);
});

export const uploadImage = [
  upload.single("image"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const { publicUrl } = await uploadImageToS3(req.file);
    return success(res, { imageUrl: publicUrl });
  }),
];

export const getImage = asyncHandler(async (req: Request, res: Response) => {
  const key = req.params[0];
  if (!key || !key.startsWith("events/")) {
    return res.status(400).json({ success: false, message: "Invalid image key" });
  }

  const image = await getImageFromS3(key);
  if (!image.Body) {
    return res.status(404).end();
  }

  res.setHeader("Content-Type", image.ContentType || "image/jpeg");
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  (image.Body as NodeJS.ReadableStream).pipe(res);
});
