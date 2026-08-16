import QrCodeGenerator from "@/components/QrCodeGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator | Green Olive Club",
  description:
    "Generate a custom QR code for any link with colors, rounded corners, gradients, and logos.",
};

export default function GenerateQrCodePage() {
  return (
    <div className="site-shell space-y-6 py-8 md:space-y-8 md:py-10">
      <header className="max-w-2xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800/70">
          Tools
        </p>
        <h1 className="about-heading text-4xl font-semibold text-emerald-950 md:text-5xl">
          QR code generator
        </h1>
        <p className="text-base text-emerald-900/75 md:text-lg">
          Paste any link, then customize colors, module shapes, corner styles,
          gradients, and an optional center logo before downloading.
        </p>
      </header>

      <QrCodeGenerator />
    </div>
  );
}
