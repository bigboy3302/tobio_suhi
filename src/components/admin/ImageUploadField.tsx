"use client";

import { useRef, useState } from "react";
import type { NhostClient } from "@nhost/nhost-js";
import { ImagePlus, Loader2, X } from "lucide-react";
import { deleteImage, nhostFileUrl, uploadImage } from "@/lib/nhostStorage";

export default function ImageUploadField({
  nhost,
  label,
  imageId,
  imageAlt,
  onImageChange,
  onAltChange,
}: {
  nhost: NhostClient;
  label: string;
  imageId: string | null;
  imageAlt: string;
  onImageChange: (id: string | null) => void;
  onAltChange: (alt: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Jāizvēlas attēla fails.");
      return;
    }
    setError(null);
    setUploading(true);
    const previousId = imageId;
    try {
      const newId = await uploadImage(nhost, file);
      onImageChange(newId);
      if (previousId) {
        deleteImage(nhost, previousId).catch(() => {});
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    if (imageId) {
      deleteImage(nhost, imageId).catch(() => {});
    }
    onImageChange(null);
    onAltChange("");
  }

  return (
    <div className="mt-3">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className="flex items-center gap-4 rounded-xl border border-dashed border-ink/25 bg-cream p-3"
      >
        {imageId ? (
          // thumbnail preview only — plain img avoids needing fixed dimensions for a small admin-only element
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={nhostFileUrl(imageId)}
            alt=""
            className="h-16 w-16 flex-none rounded-lg border border-ink/10 object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 flex-none items-center justify-center rounded-lg bg-ink/5 text-ink-soft">
            <ImagePlus className="h-6 w-6" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-full border border-ink/20 px-3 py-1.5 text-xs font-semibold hover:bg-ink/5 disabled:opacity-60"
            >
              {uploading ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Augšupielādē...
                </span>
              ) : imageId ? (
                "Nomainīt attēlu"
              ) : (
                "Izvēlēties attēlu"
              )}
            </button>
            {imageId && (
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <X className="h-3 w-3" />
                Noņemt
              </button>
            )}
          </div>
          <p className="mt-1 text-[11px] text-ink-soft">vai ievelc attēlu šeit</p>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {imageId && (
        <label className="mt-2 block text-sm">
          <span className="mb-1 block text-xs font-medium text-ink-soft">
            Alt teksts (apraksts attēlam)
          </span>
          <input
            required
            value={imageAlt}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="piem. Sake Philadelphia roll ar lasi, siera krēmu un avokado"
            className="admin-input"
          />
        </label>
      )}
    </div>
  );
}
