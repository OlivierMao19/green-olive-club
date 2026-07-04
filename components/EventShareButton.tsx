"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  copyQrContainerToClipboard,
  loadQRCode,
  type QRCodeInstance,
} from "@/lib/qrcodeClient";
import { Check, Copy, Link2, LoaderIcon, QrCode, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type EventShareButtonProps = {
  eventId: string;
  eventTitle: string;
};

export default function EventShareButton({
  eventId,
  eventTitle,
}: EventShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [eventUrl, setEventUrl] = useState("");
  const [urlCopied, setUrlCopied] = useState(false);
  const [qrCopied, setQrCopied] = useState(false);
  const [isCopyingQr, setIsCopyingQr] = useState(false);
  const [activeTab, setActiveTab] = useState("link");
  const [qrContainer, setQrContainer] = useState<HTMLDivElement | null>(null);
  const [isQrLoading, setIsQrLoading] = useState(false);
  const [isQrReady, setIsQrReady] = useState(false);
  const qrInstanceRef = useRef<QRCodeInstance | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setEventUrl(`${window.location.origin}/events/${eventId}`);
    setUrlCopied(false);
    setQrCopied(false);
  }, [open, eventId]);

  useEffect(() => {
    if (!open || activeTab !== "qr" || !eventUrl || !qrContainer) {
      return;
    }

    const container = qrContainer;
    let cancelled = false;
    setIsQrLoading(true);
    setIsQrReady(false);

    async function renderQrCode() {
      try {
        const QRCode = await loadQRCode();
        if (cancelled) {
          return;
        }

        qrInstanceRef.current?.clear();
        qrInstanceRef.current = null;
        container.replaceChildren();
        qrInstanceRef.current = new QRCode(container, {
          text: eventUrl,
          width: 220,
          height: 220,
          colorDark: "#064e3b",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M,
        });

        if (!cancelled) {
          setIsQrReady(Boolean(container.querySelector("canvas, img")));
        }
      } catch (error) {
        console.error("Failed to render QR code:", error);
        if (!cancelled) {
          toast.error("Could not generate QR code");
        }
      } finally {
        if (!cancelled) {
          setIsQrLoading(false);
        }
      }
    }

    void renderQrCode();

    return () => {
      cancelled = true;
      qrInstanceRef.current?.clear();
      qrInstanceRef.current = null;
      container.replaceChildren();
      setIsQrReady(false);
      setIsQrLoading(false);
    };
  }, [open, activeTab, eventUrl, qrContainer]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setActiveTab("link");
      setQrContainer(null);
      setIsQrReady(false);
      setIsQrLoading(false);
    }
  }

  async function handleCopyUrl() {
    if (!eventUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(eventUrl);
      setUrlCopied(true);
      toast.success("Link copied to clipboard");
      window.setTimeout(() => setUrlCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toast.error("Could not copy link");
    }
  }

  async function handleCopyQr() {
    if (!qrContainer || !isQrReady) {
      return;
    }

    setIsCopyingQr(true);

    try {
      await copyQrContainerToClipboard(qrContainer);
      setQrCopied(true);
      toast.success("QR code copied — paste it into your message");
      window.setTimeout(() => setQrCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy QR code:", error);
      toast.error("Could not copy QR code");
    } finally {
      setIsCopyingQr(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="rounded-full border-emerald-200 bg-white/80 text-emerald-800 hover:bg-emerald-50"
        onClick={() => setOpen(true)}
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share event</DialogTitle>
            <DialogDescription>
              Share {eventTitle} with a link or QR code.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-emerald-50">
              <TabsTrigger value="link" className="gap-2">
                <Link2 className="h-4 w-4" />
                Link
              </TabsTrigger>
              <TabsTrigger value="qr" className="gap-2">
                <QrCode className="h-4 w-4" />
                QR code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="link" className="space-y-4 pt-2">
              <div className="space-y-2">
                <p className="text-sm text-emerald-900/70">
                  Copy the event page URL to share anywhere.
                </p>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={eventUrl}
                    aria-label="Event page URL"
                    className="font-mono text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 rounded-full border-emerald-200"
                    onClick={() => void handleCopyUrl()}
                    disabled={!eventUrl}
                  >
                    {urlCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="sr-only">Copy link</span>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="qr" className="space-y-4 pt-2">
              <p className="text-sm text-emerald-900/70">
                Scan the code or copy it as an image to paste into a chat app.
              </p>
              <div className="relative flex min-h-[252px] items-center justify-center rounded-xl border border-emerald-100 bg-white p-4">
                {isQrLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-emerald-800/70">
                    <LoaderIcon className="h-8 w-8 animate-spin text-emerald-700" />
                    <span className="text-sm">Generating QR code…</span>
                  </div>
                )}
                <div
                  ref={setQrContainer}
                  className={`min-h-[220px] min-w-[220px] ${isQrLoading ? "invisible" : ""}`}
                />
              </div>
              <Button
                type="button"
                className="w-full rounded-full"
                onClick={() => void handleCopyQr()}
                disabled={!isQrReady || isCopyingQr || isQrLoading}
              >
                {qrCopied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    {isCopyingQr ? "Copying..." : "Copy QR code"}
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
