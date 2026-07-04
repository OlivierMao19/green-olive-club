"use client";

import type {
  QRCodeConstructor,
  QRCodeInstance,
} from "@/lib/qrcodejs/qrcode.js";

let qrcodePromise: Promise<QRCodeConstructor> | null = null;

export async function loadQRCode(): Promise<QRCodeConstructor> {
  if (typeof window === "undefined") {
    throw new Error("QRCode can only be loaded in the browser");
  }

  if (!qrcodePromise) {
    qrcodePromise = import("@/lib/qrcodejs/qrcode.js")
      .then((mod) => {
        const QRCode = mod.default;
        if (typeof QRCode !== "function") {
          throw new Error("Failed to load qrcodejs");
        }
        return QRCode;
      })
      .catch((err) => {
        qrcodePromise = null;
        throw err;
      });
  }

  return qrcodePromise;
}

export async function copyQrContainerToClipboard(
  container: HTMLElement
): Promise<void> {
  const canvas = container.querySelector("canvas");
  if (canvas) {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );
    if (!blob) {
      throw new Error("Failed to generate QR code image");
    }
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
    return;
  }

  const img = container.querySelector("img");
  if (img?.src) {
    const response = await fetch(img.src);
    const blob = await response.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
    return;
  }

  throw new Error("QR code is not ready yet");
}

export type { QRCodeConstructor, QRCodeInstance };
