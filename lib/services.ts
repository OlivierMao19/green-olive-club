"use server";
import { Event } from "@prisma/client";
import { prisma } from "./prisma";
import { sanitizeString } from "./utils";
import { raw } from "@prisma/client/runtime/library";

const IMAGEKIT_UPLOAD_URL =
  process.env.IMAGEKIT_UPLOAD_URL ||
  "https://upload.imagekit.io/api/v1/files/upload";

const IMAGEKIT_BASE_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

const privateKey = process.env.IMAGEKIT_PRIVATE_KEY!;

const encodedKey = Buffer.from(`${privateKey}:`).toString("base64");

export async function postEventImage(
  eventId: string,
  image: File,
  title: string
) {
  if (!eventId) throw new Error("eventId is required");
  if (!image) throw new Error("image is required");

  const sanitizedTitle = sanitizeString(title || image.name || "image");
  const uniqueName = `${sanitizedTitle}-${eventId}`;
  const folder = "/events";
  const normalizedFolder = folder.startsWith("/") ? folder : `/${folder}`;

  const formData = new FormData();
  formData.append("file", image);
  formData.append("fileName", uniqueName);
  formData.append("folder", normalizedFolder);
  formData.append("useUniqueFileName", "true");

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
    const message = data?.message || JSON.stringify(data);
    throw new Error(`ImageKit upload failed: ${message}`);
  }

  const { imageId, prevImageId, rawResponse } = await updateEventImage(
    eventId,
    {
      fileId: data.fileId,
    }
  );

  if (imageId !== rawResponse.fileId) {
    throw new Error("Image ID mismatch");
  }
  return {
    imageId: imageId,
    prevImageId: prevImageId,
    rawResponse: data,
  };
}

async function updateEventImage(eventId: string, data: { fileId?: string }) {
  if (!data.fileId) {
    return {
      imageId: null,
      prevImageId: null,
      rawResponse: data,
    };
  }

  try {
    const [prev, updated] = await prisma.$transaction([
      prisma.event.findUnique({
        where: { id: eventId },
        select: { imageId: true },
      }),
      prisma.event.update({
        where: { id: eventId },
        data: { imageId: data.fileId },
        select: { imageId: true },
      }),
    ]);

    const prevImageId = prev?.imageId ?? null;

    return {
      imageId: updated.imageId,
      prevImageId,
      rawResponse: data,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Could not update event image: ${msg}`);
  }
}

export async function getEventImageId(eventId: string) {
  if (!eventId) throw new Error("eventId is required");

  const event: Event | null = await prisma.event.findUnique({
    where: { id: eventId },
  });

  return event?.imageId;
}

export async function deleteEventImage(imageId: string | null | undefined) {
  if (!imageId || imageId.length === 0) throw new Error("eventId is required");

  const url = `https://api.imagekit.io/v1/files/${imageId}`;
  const options = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${encodedKey}`,
    },
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(
      `ImageKit delete failed and returned non-JSON response (status ${response.status})`
    );
  }
}

export async function getEventImage(imageId: string) {
  if (!imageId) throw new Error("imageId is required");

  const url = `https://api.imagekit.io/v1/files/${imageId}/details`;
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${encodedKey}`,
    },
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(
      `ImageKit get failed and returned non-JSON response (status ${response.status})`
    );
  }
  const data = await response.json();

  const uploadedUrl =
    data?.url ||
    (data?.filePath && IMAGEKIT_BASE_URL
      ? (() => {
          // remove leading slash from filePath then safely append to base
          const rawPath = data.filePath.startsWith("/")
            ? data.filePath.slice(1)
            : data.filePath;
          const base = IMAGEKIT_BASE_URL.replace(/\/$/, ""); // remove trailing slash if any
          return `${base}/${encodeURI(rawPath)}`;
        })()
      : undefined);

  const relativeUrl =
    data?.filePath ||
    (data?.url && IMAGEKIT_BASE_URL && data.url.startsWith(IMAGEKIT_BASE_URL)
      ? data.url.slice(IMAGEKIT_BASE_URL.length)
      : undefined);

  return { uploadedUrl, relativeUrl };
}
