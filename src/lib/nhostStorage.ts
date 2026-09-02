import type { NhostClient } from "@nhost/nhost-js";

const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN!;
const region = process.env.NEXT_PUBLIC_NHOST_REGION!;

const STORAGE_BASE_URL = `https://${subdomain}.storage.${region}.nhost.run/v1`;

export function nhostFileUrl(fileId: string): string {
  return `${STORAGE_BASE_URL}/files/${fileId}`;
}

export async function uploadImage(nhost: NhostClient, file: File): Promise<string> {
  const res = await nhost.storage.uploadFiles({ "file[]": [file] });
  const uploaded = res.body.processedFiles?.[0];
  if (!uploaded) {
    throw new Error("Augšupielāde neizdevās");
  }
  return uploaded.id;
}

export async function deleteImage(nhost: NhostClient, fileId: string): Promise<void> {
  await nhost.storage.deleteFile(fileId);
}
