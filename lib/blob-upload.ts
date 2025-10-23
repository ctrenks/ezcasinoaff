import { put } from "@vercel/blob";
import { nanoid } from "./utils";

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

/**
 * Upload an image file to Vercel Blob storage
 */
export async function uploadForumImage(file: File): Promise<UploadResult> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 10MB limit");
  }

  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed"
    );
  }

  // Generate unique filename
  const ext = file.name.split(".").pop();
  const filename = `forum/${nanoid()}.${ext}`;

  // Upload to Vercel Blob
  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: false,
  });

  // Get image dimensions if it's an image
  const dimensions = await getImageDimensions(file);

  return {
    url: blob.url,
    filename: file.name,
    size: file.size,
    mimeType: file.type,
    width: dimensions?.width,
    height: dimensions?.height,
  };
}

/**
 * Get image dimensions from a File object
 */
async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      resolve(null);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    img.src = url;
  });
}

/**
 * Validate and parse form data for file uploads
 */
export async function extractFileFromFormData(
  formData: FormData,
  fieldName: string = "image"
): Promise<File> {
  const file = formData.get(fieldName);

  if (!file) {
    throw new Error("No file provided");
  }

  if (!(file instanceof File)) {
    throw new Error("Invalid file data");
  }

  return file;
}
