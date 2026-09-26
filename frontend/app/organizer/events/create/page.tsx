"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, MapPin, Sparkles, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";

const CATEGORIES = [
  "Music",
  "Art",
  "Technology",
  "Sports",
  "Conferences",
  "Food",
];

export default function CreateEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: CATEGORIES[0],
    location: "",
    eventDate: "",
    eventTime: "",
    price: "",
    totalSeats: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const uploadImage = async (): Promise<string | undefined> => {
    if (!imageFile) return undefined;

    const fileType = imageFile.type || "image/jpeg";

    if (imageFile.size > 10 * 1024 * 1024) {
      throw new Error("Image file size exceeds 10 MB limit.");
    }

    const presignedRes = await api.post("/uploads/presigned-url", {
      fileName: imageFile.name,
      fileType,
    });

    const { uploadUrl, publicUrl } = presignedRes.data.data;

    if (!uploadUrl || !publicUrl) {
      throw new Error("Failed to generate S3 upload URL");
    }

    const uploadResult = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": fileType,
      },
      body: imageFile,
    });

    if (!uploadResult.ok) {
      const responseText = await uploadResult.text();
      console.error("S3 upload failed:", uploadResult.status, responseText);
      throw new Error(`Image upload failed: ${uploadResult.status}`);
    }

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const imageUrl = await uploadImage();
      await api.post("/events", {
        name: form.name,
        description: form.description,
        category: form.category,
        location: form.location,
        eventDate: form.eventDate,
        eventTime: form.eventTime,
        price: Number(form.price),
        totalSeats: Number(form.totalSeats),
        imageUrl,
      });
      router.push("/organizer/events");
    } catch (err: any) {
      const message =
        err?.message ||
        err?.response?.data?.message ||
        "Failed to create event";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Bring your event to life
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create an event</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Give your audience a clear reason to show up. You can edit these
            details later.
          </p>
        </div>
        <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
          <MapPin className="h-4 w-4 text-primary" /> Your event, beautifully
          presented
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[1fr_340px]"
      >
        <div className="soft-panel space-y-5 p-5 sm:p-7">
          {error && (
            <p className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Event name
            </label>
            <Input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Description
            </label>
            <textarea
              required
              minLength={10}
              rows={4}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="glass-input w-full p-3 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Location
              </label>
              <Input
                required
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Date</label>
              <Input
                required
                type="date"
                value={form.eventDate}
                onChange={(e) => update("eventDate", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Time</label>
              <Input
                required
                type="time"
                value={form.eventTime}
                onChange={(e) => update("eventTime", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Ticket price (₹)
              </label>
              <Input
                required
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Total seats
              </label>
              <Input
                required
                type="number"
                min={1}
                value={form.totalSeats}
                onChange={(e) => update("totalSeats", e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Creating…" : "Create Event"}
          </Button>
        </div>

        <aside className="space-y-4">
          <div className="soft-panel overflow-hidden p-3">
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-muted">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="px-8 text-center text-muted-foreground">
                  <ImagePlus className="mx-auto mb-3 h-9 w-9 text-primary/70" />
                  <p className="text-sm font-semibold text-foreground">
                    Your event cover
                  </p>
                  <p className="mt-1 text-xs">
                    Use a bright, high-quality image in landscape format.
                  </p>
                </div>
              )}
              {imagePreview && (
                <div className="absolute inset-x-3 bottom-3 rounded-lg bg-black/65 px-3 py-2 text-xs text-white">
                  Preview ready
                </div>
              )}
            </div>
            <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-primary/35 bg-primary/5 px-3 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10">
              <UploadCloud className="h-4 w-4" />
              {imageFile ? "Choose another image" : "Upload event image"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="sr-only"
              />
            </label>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              JPG, PNG or WebP · up to 10 MB
            </p>
          </div>
          <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm">
            <p className="font-semibold">A great listing includes</p>
            <p className="mt-2 leading-6 text-muted-foreground">
              A specific title, a vivid description, an accurate venue, and a
              cover image that tells the story at a glance.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
