import multer from "multer";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import { generatePresignedUploadUrl, getImageFromS3, uploadImageToS3 } from "../services/upload.service.js";

const presignedUrlSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileType: z.string().min(1, "File type is required"),
});

// Configure multer for memory storage and image filtering
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image uploads are allowed"));
    }
  },
});

export const getPresignedUrl = asyncHandler(async (req, res) => {
  const { fileName, fileType } = presignedUrlSchema.parse(req.body);
  const data = await generatePresignedUploadUrl(fileName, fileType);
  return success(res, data);
});

export const uploadImage = [
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const { publicUrl, key } = await uploadImageToS3(req.file);
    return success(res, { imageUrl: publicUrl, key });
  }),
];

export const getImage = asyncHandler(async (req, res) => {
  const key = req.params[0] || req.params.key;
  if (!key) {
    return res.status(400).json({ success: false, message: "Image key is required" });
  }

  const response = await getImageFromS3(key);

  if (response.ContentType) {
    res.setHeader("Content-Type", response.ContentType);
  }
  if (response.ContentLength) {
    res.setHeader("Content-Length", response.ContentLength.toString());
  }
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

  if (response.Body) {
    response.Body.pipe(res);
  } else {
    res.status(404).json({ success: false, message: "Image not found" });
  }
});
