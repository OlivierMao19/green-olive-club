"use server";
import { prisma } from "./prisma";
import { sanitizeString } from "./utils";

const IMAGEKIT_UPLOAD_URL =
  process.env.IMAGEKIT_UPLOAD_URL ||
  "https://upload.imagekit.io/api/v1/files/upload";

const IMAGEKIT_BASE_URL = process.env.IMAGEKIT_URL;

export async function postEventImage(
  eventId: string,
  image: File,
  title: string
) {
  if (!eventId) throw new Error("eventId is required");
  if (!image) throw new Error("image is required");

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("Missing IMAGEKIT_PRIVATE_KEY environment variable");
  }

  const sanitizedTitle = sanitizeString(title || image.name || "image");
  const uniqueName = `${sanitizedTitle}-${eventId}`;
  const folder = "/events";
  const normalizedFolder = folder.startsWith("/") ? folder : `/${folder}`;

  const formData = new FormData();
  formData.append("file", image);
  formData.append("fileName", uniqueName);
  formData.append("folder", normalizedFolder);

  const encodedKey = Buffer.from(`${privateKey}:`).toString("base64");

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${encodedKey}`,
    },
    body: formData,
    useUniqueFileName: false,
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

  // get url or relative file path (pair with base url)
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

  if (!uploadedUrl) {
    throw new Error("Upload succeeded but response did not contain a URL");
  }

  await prisma.event
    .update({
      where: { id: eventId },
      data: { image_url: uploadedUrl },
    })
    .catch((err: Error) => {
      throw new Error(`Could not update database: ${err.message}`);
    });

  return {
    url: uploadedUrl,
    fileId: data?.fileId || data?.filePath,
    rawResponse: data,
  };
}
