"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, MapPin, UploadCloud, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";

const CATEGORIES = [
  "Music",
  "Technology",
  "Art",
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
      throw new Error("Image file size exceeds the 10 MB limit.");
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
        "Failed to create event. Please check all fields.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Back button & Title */}
      <div>
        <Link
          href="/organizer/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to My Events</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Publish New Event Listing
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Fill in your event details, configure ticket quantity, and upload promotional media.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-12">
        {/* Left: Main Form Fields */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {error}
              </div>
            )}

            {/* Event Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                Event Title *
              </label>
              <Input
                required
                placeholder="e.g. Annual Tech Leadership Summit 2026"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="h-10 text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                Event Overview & Description *
              </label>
              <textarea
                required
                minLength={10}
                rows={5}
                placeholder="Describe what attendees can expect, speakers, schedule, and experience details..."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className="flex w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-xs text-foreground shadow-subtle outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Category & Location */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-border bg-white px-3 text-xs text-foreground shadow-subtle outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  Venue / Location *
                </label>
                <Input
                  required
                  placeholder="e.g. Jio Convention Centre, Mumbai"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  className="h-10 text-xs"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  Event Date *
                </label>
                <Input
                  required
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => update("eventDate", e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  Start Time *
                </label>
                <Input
                  required
                  type="time"
                  value={form.eventTime}
                  onChange={(e) => update("eventTime", e.target.value)}
                  className="h-10 text-xs"
                />
              </div>
            </div>

            {/* Pricing & Capacity */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-border pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  Ticket Price (₹ INR) *
                </label>
                <Input
                  required
                  type="number"
                  min={0}
                  placeholder="e.g. 999"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  className="h-10 text-xs"
                />
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  Set 0 for free admission.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  Total Ticket Capacity *
                </label>
                <Input
                  required
                  type="number"
                  min={1}
                  placeholder="e.g. 150"
                  value={form.totalSeats}
                  onChange={(e) => update("totalSeats", e.target.value)}
                  className="h-10 text-xs"
                />
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  Maximum tickets bookable for this event.
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
                {submitting ? "Publishing Listing..." : "Publish Event"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Cover Image & Quality Checklist */}
        <div className="lg:col-span-4 space-y-4">
          {/* Cover Image Upload Card */}
          <div className="rounded-xl border border-border bg-white p-5 shadow-card">
            <label className="block text-xs font-bold text-slate-900 mb-2">
              Event Cover Photo
            </label>

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-dashed border-border bg-slate-50 flex items-center justify-center">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Event cover preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="p-4 text-center text-slate-400">
                  <ImagePlus className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">
                    No image chosen
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Recommended 16:9 landscape format
                  </p>
                </div>
              )}
            </div>

            <label className="mt-3 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900">
              <UploadCloud className="h-4 w-4" />
              <span>{imageFile ? "Replace Cover Photo" : "Upload Image"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="sr-only"
              />
            </label>
            <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
              PNG, JPG, or WebP up to 10 MB (AWS S3 Hosted)
            </p>
          </div>

          {/* Publishing Checklist */}
          <div className="rounded-xl border border-border bg-white p-5 shadow-card">
            <h3 className="text-xs font-bold text-slate-900 mb-3">
              Event Quality Checklist
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Clear event title and detailed schedule</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Exact address or GPS venue identifier</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Ticket inventory matched to physical room limits</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Instant attendee notifications upon booking</span>
              </li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}
