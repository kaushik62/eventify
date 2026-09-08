const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getEventImageUrl = (imageUrl: string | null | undefined) => {
  if (!imageUrl) return null;

  try {
    const url = new URL(imageUrl);
    if (url.hostname.endsWith("amazonaws.com")) {
      const key = url.pathname.replace(/^\//, "");
      return `${API_URL}/uploads/image/${key.split("/").map(encodeURIComponent).join("/")}`;
    }
  } catch {
    return imageUrl;
  }

  return imageUrl;
};