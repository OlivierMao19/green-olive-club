"use server";
import { imageKitUrl } from "./consts";
import { sanitizeString } from "./utils";

export async function postEventImage(
  eventId: string,
  image: File,
  name: string
) {
  const formData = new FormData();
  const title = sanitizeString(name);
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
  try {
    const response = await fetch(imageKitUrl, options);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
