import "server-only";
import { UTApi } from "uploadthing/server";

export interface PhotoStorage {
  save(file: File): Promise<string>;
}

class UploadThingPhotoStorage implements PhotoStorage {
  private readonly client = new UTApi({
    token: process.env.UPLOADTHING_TOKEN,
  });

  async save(file: File) {
    if (!process.env.UPLOADTHING_TOKEN) {
      throw new Error("UPLOADTHING_TOKEN is not configured");
    }
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are supported");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Photo must be smaller than 5 MB");
    }

    const result = await this.client.uploadFiles(file);
    if (result.error || !result.data) {
      throw new Error(result.error?.message ?? "Employee photo upload failed");
    }
    return result.data.ufsUrl;
  }
}

export const photoStorage: PhotoStorage = new UploadThingPhotoStorage();
