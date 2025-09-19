"use server";
import { prisma } from "./prisma";
import { sanitizeString } from "./utils";
import { v4 as uuidv4 } from "uuid";

const IMAGEKIT_UPLOAD_URL =
  process.env.IMAGEKIT_UPLOAD_URL ||
  "https://upload.imagekit.io/api/v1/files/upload";

export async function postEventImage(
  eventId: string,
  image: File,
  title: string
) {
  if (!eventId) throw new Error("eventId is required");
  if (!image) throw new Error("image is required");
  if (!process.env.IMAGE_KIT_PRIVATE_KEY) {
    throw new Error("Missing IMAGEKIT_PRIVATE_KEY environment variable");
  }
  const sanitizedTitle = sanitizeString(title || image.name || "image");
  const uniqueName = `${sanitizedTitle}-${Date.now()}-${uuidv4()}`;
  const fullPath = `${IMAGEKIT_UPLOAD_URL}`;

  const formData = new FormData();
  formData.append("image", image);
  formData.append("fileName", uniqueName);
  formData.append("folder", "/events");

  const encodedKey = Buffer.from(
    `${process.env.IMAGE_KIT_PRIVATE_KEY}:`
  ).toString("base64");

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${encodedKey}`,
    },
    body: formData,
  };

  const response = await fetch(IMAGEKIT_UPLOAD_URL, options);
  const data = await response.json().catch(() => {
    throw new Error(
      `Upload failed and returned non-JSON response (status ${response.status})`
    );
  });

  if (!response.ok) {
    // include ImageKit error message if present
    const message = data?.message || JSON.stringify(data);
    throw new Error(`ImageKit upload failed: ${message}`);
  }

  const uploadedUrl =
    data?.url ||
    (data.filePath ? `${IMAGEKIT_UPLOAD_URL}/${data.filePath}` : undefined);
  if (!uploadedUrl) {
    throw new Error("Upload succeeded but response did not contain a URL");
  }

  await prisma.event
    .update({
      where: { id: eventId },
      data: { image_url: fullPath },
    })
    .catch(() => {
      throw new Error("Could not update database");
    });

  return uploadedUrl;
}
