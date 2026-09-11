import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const AWS_REGION = process.env.AWS_REGION || "ap-south-1";
const BUCKET = process.env.AWS_S3_BUCKET || "eventify-event-images";
const PUBLIC_API_URL = process.env.PUBLIC_API_URL || "http://localhost:5000";

const s3 = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
  ? new S3Client({ region: AWS_REGION })
  : null;

// Sanitize filename to avoid S3 path issues
const sanitizeFileName = (fileName) => {
  const safeName = fileName.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
  return safeName || `upload-${Date.now()}`;
};

// Generate presigned upload URL
export const generatePresignedUploadUrl = async (fileName, fileType) => {
  if (!s3) {
    throw new Error("S3 upload is not configured. Add AWS credentials and region to enable file uploads.");
  }

  const key = `events/${Date.now()}-${crypto.randomUUID()}-${sanitizeFileName(fileName)}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  const publicUrl = `https://${BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;

  return { uploadUrl, publicUrl, key };
};

// Direct buffer upload to S3
export const uploadImageToS3 = async (file) => {
  if (!s3) {
    throw new Error("S3 upload is not configured. Add AWS credentials and region to enable file uploads.");
  }

  const key = `events/${Date.now()}-${crypto.randomUUID()}-${sanitizeFileName(file.originalname)}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || "image/jpeg",
    })
  );

  const publicUrl = `${PUBLIC_API_URL}/api/uploads/image/${encodeURIComponent(key)}`;
  return { publicUrl, key };
};

// Retrieve image stream from S3
export const getImageFromS3 = async (key) => {
  if (!s3) {
    throw new Error("S3 upload is not configured. Add AWS credentials and region to enable file uploads.");
  }

  return s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
};
