"use server";
import { imageKitUrl } from "./consts";
import { prisma } from "./prisma";
import { sanitizeString } from "./utils";

export async function postEventImage(
  eventId: string,
  image: File,
  name: string
) {
  const title = sanitizeString(name);
  const fullPath = `${imageKitUrl}/${title}`;

  const formData = new FormData();
  formData.append("image", image);
  formData.append("fileName", title);
  formData.append("filePath", `/${title}`);

  const key = process.env.IMAGE_KIT_PRIVATE_KIT;

  const encodedKey = btoa(key!);

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${encodedKey}`,
    },
    body: formData,
  };
  let response;
  try {
    response = await fetch(imageKitUrl, options);
    const data = await response.json();
    console.log(data);
  } catch (error) {}

  if (response && response.ok) {
    await prisma.event
      .update({
        where: { id: eventId },
        data: { image_url: fullPath },
      })
      .catch((error) => {});
  }
}
