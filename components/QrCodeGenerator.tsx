"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, ImagePlus, Trash2 } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import type {
  CornerDotType,
  CornerSquareType,
  DotType,
  ErrorCorrectionLevel,
  FileExtension,
  GradientType,
  Options,
  ShapeType,
} from "qr-code-styling";

const DOT_TYPES: DotType[] = [
  "square",
  "dots",
  "rounded",
  "extra-rounded",
  "classy",
  "classy-rounded",
];

const CORNER_SQUARE_TYPES: CornerSquareType[] = [
  "square",
  "dot",
  "extra-rounded",
  "rounded",
  "dots",
  "classy",
  "classy-rounded",
];

const CORNER_DOT_TYPES: CornerDotType[] = [
  "square",
  "dot",
  "rounded",
  "dots",
  "classy",
  "classy-rounded",
  "extra-rounded",
];

const ERROR_LEVELS: ErrorCorrectionLevel[] = ["L", "M", "Q", "H"];
const SHAPES: ShapeType[] = ["square", "circle"];
const DOWNLOAD_FORMATS: FileExtension[] = ["png", "svg", "jpeg", "webp"];

type ColorMode = "solid" | "gradient";

type GeneratorState = {
  data: string;
  size: number;
  margin: number;
  shape: ShapeType;
  errorCorrectionLevel: ErrorCorrectionLevel;
  dotsType: DotType;
  dotsColorMode: ColorMode;
  dotsColor: string;
  dotsGradientType: GradientType;
  dotsGradientFrom: string;
  dotsGradientTo: string;
  cornersSquareType: CornerSquareType;
  cornersSquareColorMode: ColorMode;
  cornersSquareColor: string;
  cornersSquareGradientType: GradientType;
  cornersSquareGradientFrom: string;
  cornersSquareGradientTo: string;
  cornersDotType: CornerDotType;
  cornersDotColorMode: ColorMode;
  cornersDotColor: string;
  cornersDotGradientType: GradientType;
  cornersDotGradientFrom: string;
  cornersDotGradientTo: string;
  backgroundColorMode: ColorMode;
  backgroundColor: string;
  backgroundGradientType: GradientType;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  backgroundRound: number;
  image: string;
  hideBackgroundDots: boolean;
  imageSize: number;
  imageMargin: number;
};

const DEFAULT_STATE: GeneratorState = {
  data: "https://greenoliveclub.com",
  size: 280,
  margin: 12,
  shape: "square",
  errorCorrectionLevel: "M",
  dotsType: "rounded",
  dotsColorMode: "solid",
  dotsColor: "#064e3b",
  dotsGradientType: "linear",
  dotsGradientFrom: "#064e3b",
  dotsGradientTo: "#84cc16",
  cornersSquareType: "extra-rounded",
  cornersSquareColorMode: "solid",
  cornersSquareColor: "#064e3b",
  cornersSquareGradientType: "linear",
  cornersSquareGradientFrom: "#064e3b",
  cornersSquareGradientTo: "#166534",
  cornersDotType: "dot",
  cornersDotColorMode: "solid",
  cornersDotColor: "#065f46",
  cornersDotGradientType: "linear",
  cornersDotGradientFrom: "#065f46",
  cornersDotGradientTo: "#84cc16",
  backgroundColorMode: "solid",
  backgroundColor: "#ffffff",
  backgroundGradientType: "radial",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ecfdf5",
  backgroundRound: 0,
  image: "",
  hideBackgroundDots: true,
  imageSize: 0.35,
  imageMargin: 4,
};

function buildGradient(
  type: GradientType,
  from: string,
  to: string
): NonNullable<Options["dotsOptions"]>["gradient"] {
  return {
    type,
    rotation: 0,
    colorStops: [
      { offset: 0, color: from },
      { offset: 1, color: to },
    ],
  };
}

function buildOptions(state: GeneratorState): Options {
  return {
    width: state.size,
    height: state.size,
    type: "canvas",
    shape: state.shape,
    margin: state.margin,
    data: state.data.trim() || " ",
    image: state.image || undefined,
    qrOptions: {
      errorCorrectionLevel: state.errorCorrectionLevel,
    },
    imageOptions: {
      crossOrigin: "anonymous",
      hideBackgroundDots: state.hideBackgroundDots,
      imageSize: state.imageSize,
      margin: state.imageMargin,
    },
    dotsOptions: {
      type: state.dotsType,
      ...(state.dotsColorMode === "solid"
        ? { color: state.dotsColor, gradient: undefined }
        : {
            gradient: buildGradient(
              state.dotsGradientType,
              state.dotsGradientFrom,
              state.dotsGradientTo
            ),
          }),
    },
    cornersSquareOptions: {
      type: state.cornersSquareType,
      ...(state.cornersSquareColorMode === "solid"
        ? { color: state.cornersSquareColor, gradient: undefined }
        : {
            gradient: buildGradient(
              state.cornersSquareGradientType,
              state.cornersSquareGradientFrom,
              state.cornersSquareGradientTo
            ),
          }),
    },
    cornersDotOptions: {
      type: state.cornersDotType,
      ...(state.cornersDotColorMode === "solid"
        ? { color: state.cornersDotColor, gradient: undefined }
        : {
            gradient: buildGradient(
              state.cornersDotGradientType,
              state.cornersDotGradientFrom,
              state.cornersDotGradientTo
            ),
          }),
    },
    backgroundOptions: {
      round: state.backgroundRound,
      ...(state.backgroundColorMode === "solid"
        ? { color: state.backgroundColor, gradient: undefined }
        : {
            gradient: buildGradient(
              state.backgroundGradientType,
              state.backgroundGradientFrom,
              state.backgroundGradientTo
            ),
          }),
    },
  };
}

function FieldSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function ColorControls({
  idPrefix,
  colorMode,
  solidColor,
  gradientType,
  gradientFrom,
  gradientTo,
  onColorModeChange,
  onSolidColorChange,
  onGradientTypeChange,
  onGradientFromChange,
  onGradientToChange,
}: {
  idPrefix: string;
  colorMode: ColorMode;
  solidColor: string;
  gradientType: GradientType;
  gradientFrom: string;
  gradientTo: string;
  onColorModeChange: (mode: ColorMode) => void;
  onSolidColorChange: (color: string) => void;
  onGradientTypeChange: (type: GradientType) => void;
  onGradientFromChange: (color: string) => void;
  onGradientToChange: (color: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-mode`}>Fill</Label>
        <select
          id={`${idPrefix}-mode`}
          value={colorMode}
          onChange={(event) =>
            onColorModeChange(event.target.value as ColorMode)
          }
          className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
        >
          <option value="solid">Solid</option>
          <option value="gradient">Gradient</option>
        </select>
      </div>

      {colorMode === "solid" ? (
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-color`}>Color</Label>
          <div className="flex items-center gap-2">
            <input
              id={`${idPrefix}-color`}
              type="color"
              value={solidColor}
              onChange={(event) => onSolidColorChange(event.target.value)}
              className="h-9 w-12 cursor-pointer rounded-md border border-emerald-200 bg-white p-1"
            />
            <Input
              value={solidColor}
              onChange={(event) => onSolidColorChange(event.target.value)}
              className="font-mono uppercase"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <FieldSelect
            id={`${idPrefix}-gradient-type`}
            label="Gradient type"
            value={gradientType}
            options={["linear", "radial"]}
            onChange={(value) =>
              onGradientTypeChange(value as GradientType)
            }
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`${idPrefix}-from`}>From</Label>
              <div className="flex items-center gap-2">
                <input
                  id={`${idPrefix}-from`}
                  type="color"
                  value={gradientFrom}
                  onChange={(event) =>
                    onGradientFromChange(event.target.value)
                  }
                  className="h-9 w-12 cursor-pointer rounded-md border border-emerald-200 bg-white p-1"
                />
                <Input
                  value={gradientFrom}
                  onChange={(event) =>
                    onGradientFromChange(event.target.value)
                  }
                  className="font-mono uppercase"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${idPrefix}-to`}>To</Label>
              <div className="flex items-center gap-2">
                <input
                  id={`${idPrefix}-to`}
                  type="color"
                  value={gradientTo}
                  onChange={(event) => onGradientToChange(event.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-md border border-emerald-200 bg-white p-1"
                />
                <Input
                  value={gradientTo}
                  onChange={(event) => onGradientToChange(event.target.value)}
                  className="font-mono uppercase"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 border-t border-emerald-100 pt-5 first:border-t-0 first:pt-0">
      <div>
        <h2 className="text-base font-semibold text-emerald-950">{title}</h2>
        <p className="mt-1 text-sm text-emerald-900/65">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function QrCodeGenerator() {
  const [state, setState] = useState<GeneratorState>(DEFAULT_STATE);
  const [downloadFormat, setDownloadFormat] = useState<FileExtension>("png");
  const [isReady, setIsReady] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const qrRef = useRef<InstanceType<
    typeof import("qr-code-styling").default
  > | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      const { default: QRCodeStyling } = await import("qr-code-styling");
      if (cancelled || !previewRef.current) {
        return;
      }

      previewRef.current.replaceChildren();
      const qrCode = new QRCodeStyling(buildOptions(state));
      qrCode.append(previewRef.current);
      qrRef.current = qrCode;
      setIsReady(true);
    }

    void setup();

    return () => {
      cancelled = true;
      qrRef.current = null;
      if (previewRef.current) {
        previewRef.current.replaceChildren();
      }
      setIsReady(false);
    };
    // Intentionally mount once; updates happen via update() below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!qrRef.current || !isReady) {
      return;
    }

    qrRef.current.update(buildOptions(state));
  }, [state, isReady]);

  function patch(partial: Partial<GeneratorState>) {
    setState((current) => ({ ...current, ...partial }));
  }

  async function handleLogoUpload(file: File | null) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        patch({ image: reader.result });
      }
    };
    reader.onerror = () => toast.error("Could not read that image");
    reader.readAsDataURL(file);
  }

  async function handleDownload() {
    if (!qrRef.current) {
      toast.error("QR code is not ready yet");
      return;
    }

    try {
      await qrRef.current.download({
        name: "green-olive-qr",
        extension: downloadFormat,
      });
      toast.success(`Downloaded as ${downloadFormat.toUpperCase()}`);
    } catch (error) {
      console.error("Failed to download QR code:", error);
      toast.error("Could not download QR code");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <div className="space-y-6 rounded-2xl border border-emerald-200/80 bg-white/70 p-5 shadow-sm backdrop-blur md:p-6">
        <Section
          title="Link"
          description="Paste any URL or text you want encoded in the QR code."
        >
          <div className="space-y-1.5">
            <Label htmlFor="qr-data">Content</Label>
            <Input
              id="qr-data"
              value={state.data}
              onChange={(event) => patch({ data: event.target.value })}
              placeholder="https://example.com"
            />
          </div>
        </Section>

        <Section
          title="Layout"
          description="Overall size, quiet zone, shape, and scan reliability."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="qr-size">Size ({state.size}px)</Label>
              <input
                id="qr-size"
                type="range"
                min={160}
                max={512}
                step={8}
                value={state.size}
                onChange={(event) =>
                  patch({ size: Number(event.target.value) })
                }
                className="w-full accent-emerald-700"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qr-margin">Margin ({state.margin}px)</Label>
              <input
                id="qr-margin"
                type="range"
                min={0}
                max={48}
                step={1}
                value={state.margin}
                onChange={(event) =>
                  patch({ margin: Number(event.target.value) })
                }
                className="w-full accent-emerald-700"
              />
            </div>
            <FieldSelect
              id="qr-shape"
              label="Shape"
              value={state.shape}
              options={SHAPES}
              onChange={(value) => patch({ shape: value as ShapeType })}
            />
            <FieldSelect
              id="qr-error"
              label="Error correction"
              value={state.errorCorrectionLevel}
              options={ERROR_LEVELS}
              onChange={(value) =>
                patch({
                  errorCorrectionLevel: value as ErrorCorrectionLevel,
                })
              }
            />
          </div>
        </Section>

        <Section
          title="Dots"
          description="Style and color of the main QR modules."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldSelect
              id="dots-type"
              label="Dot style"
              value={state.dotsType}
              options={DOT_TYPES}
              onChange={(value) => patch({ dotsType: value as DotType })}
            />
            <ColorControls
              idPrefix="dots"
              colorMode={state.dotsColorMode}
              solidColor={state.dotsColor}
              gradientType={state.dotsGradientType}
              gradientFrom={state.dotsGradientFrom}
              gradientTo={state.dotsGradientTo}
              onColorModeChange={(dotsColorMode) => patch({ dotsColorMode })}
              onSolidColorChange={(dotsColor) => patch({ dotsColor })}
              onGradientTypeChange={(dotsGradientType) =>
                patch({ dotsGradientType })
              }
              onGradientFromChange={(dotsGradientFrom) =>
                patch({ dotsGradientFrom })
              }
              onGradientToChange={(dotsGradientTo) =>
                patch({ dotsGradientTo })
              }
            />
          </div>
        </Section>

        <Section
          title="Corner squares"
          description="The three large finder patterns in the corners."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldSelect
              id="corners-square-type"
              label="Outer style"
              value={state.cornersSquareType}
              options={CORNER_SQUARE_TYPES}
              onChange={(value) =>
                patch({ cornersSquareType: value as CornerSquareType })
              }
            />
            <ColorControls
              idPrefix="corners-square"
              colorMode={state.cornersSquareColorMode}
              solidColor={state.cornersSquareColor}
              gradientType={state.cornersSquareGradientType}
              gradientFrom={state.cornersSquareGradientFrom}
              gradientTo={state.cornersSquareGradientTo}
              onColorModeChange={(cornersSquareColorMode) =>
                patch({ cornersSquareColorMode })
              }
              onSolidColorChange={(cornersSquareColor) =>
                patch({ cornersSquareColor })
              }
              onGradientTypeChange={(cornersSquareGradientType) =>
                patch({ cornersSquareGradientType })
              }
              onGradientFromChange={(cornersSquareGradientFrom) =>
                patch({ cornersSquareGradientFrom })
              }
              onGradientToChange={(cornersSquareGradientTo) =>
                patch({ cornersSquareGradientTo })
              }
            />
          </div>
        </Section>

        <Section
          title="Corner dots"
          description="The inner eyes inside each finder pattern."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldSelect
              id="corners-dot-type"
              label="Inner style"
              value={state.cornersDotType}
              options={CORNER_DOT_TYPES}
              onChange={(value) =>
                patch({ cornersDotType: value as CornerDotType })
              }
            />
            <ColorControls
              idPrefix="corners-dot"
              colorMode={state.cornersDotColorMode}
              solidColor={state.cornersDotColor}
              gradientType={state.cornersDotGradientType}
              gradientFrom={state.cornersDotGradientFrom}
              gradientTo={state.cornersDotGradientTo}
              onColorModeChange={(cornersDotColorMode) =>
                patch({ cornersDotColorMode })
              }
              onSolidColorChange={(cornersDotColor) =>
                patch({ cornersDotColor })
              }
              onGradientTypeChange={(cornersDotGradientType) =>
                patch({ cornersDotGradientType })
              }
              onGradientFromChange={(cornersDotGradientFrom) =>
                patch({ cornersDotGradientFrom })
              }
              onGradientToChange={(cornersDotGradientTo) =>
                patch({ cornersDotGradientTo })
              }
            />
          </div>
        </Section>

        <Section
          title="Background"
          description="Fill behind the QR modules, including optional rounding."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="bg-round">
                Roundness ({state.backgroundRound.toFixed(2)})
              </Label>
              <input
                id="bg-round"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={state.backgroundRound}
                onChange={(event) =>
                  patch({ backgroundRound: Number(event.target.value) })
                }
                className="w-full accent-emerald-700"
              />
            </div>
            <ColorControls
              idPrefix="background"
              colorMode={state.backgroundColorMode}
              solidColor={state.backgroundColor}
              gradientType={state.backgroundGradientType}
              gradientFrom={state.backgroundGradientFrom}
              gradientTo={state.backgroundGradientTo}
              onColorModeChange={(backgroundColorMode) =>
                patch({ backgroundColorMode })
              }
              onSolidColorChange={(backgroundColor) =>
                patch({ backgroundColor })
              }
              onGradientTypeChange={(backgroundGradientType) =>
                patch({ backgroundGradientType })
              }
              onGradientFromChange={(backgroundGradientFrom) =>
                patch({ backgroundGradientFrom })
              }
              onGradientToChange={(backgroundGradientTo) =>
                patch({ backgroundGradientTo })
              }
            />
          </div>
        </Section>

        <Section
          title="Center logo"
          description="Optional image in the middle of the QR code."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3 sm:col-span-2">
              <div className="flex flex-wrap items-center gap-2">
                <Label
                  htmlFor="logo-upload"
                  className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 text-sm font-medium text-emerald-900 hover:bg-emerald-100"
                >
                  <ImagePlus className="h-4 w-4" />
                  Upload logo
                </Label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    void handleLogoUpload(event.target.files?.[0] ?? null);
                    event.target.value = "";
                  }}
                />
                {state.image ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => patch({ image: "" })}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove logo
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="image-size">
                Logo size ({Math.round(state.imageSize * 100)}%)
              </Label>
              <input
                id="image-size"
                type="range"
                min={0.15}
                max={0.5}
                step={0.01}
                value={state.imageSize}
                onChange={(event) =>
                  patch({ imageSize: Number(event.target.value) })
                }
                className="w-full accent-emerald-700"
                disabled={!state.image}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="image-margin">
                Logo margin ({state.imageMargin}px)
              </Label>
              <input
                id="image-margin"
                type="range"
                min={0}
                max={24}
                step={1}
                value={state.imageMargin}
                onChange={(event) =>
                  patch({ imageMargin: Number(event.target.value) })
                }
                className="w-full accent-emerald-700"
                disabled={!state.image}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-emerald-950 sm:col-span-2">
              <input
                type="checkbox"
                checked={state.hideBackgroundDots}
                onChange={(event) =>
                  patch({ hideBackgroundDots: event.target.checked })
                }
                className="size-4 accent-emerald-700"
                disabled={!state.image}
              />
              Hide dots behind logo
            </label>
          </div>
        </Section>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <div className="rounded-2xl border border-emerald-200/80 bg-white/80 p-5 shadow-sm backdrop-blur">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-emerald-800/70">
            Preview
          </p>
          <div className="flex min-h-[280px] items-center justify-center rounded-xl bg-[radial-gradient(circle_at_top,_#ecfdf5,_#ffffff_70%)] p-4">
            <div ref={previewRef} className="overflow-hidden" />
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <FieldSelect
              id="download-format"
              label="Download format"
              value={downloadFormat}
              options={DOWNLOAD_FORMATS}
              onChange={(value) =>
                setDownloadFormat(value as FileExtension)
              }
            />
            <Button type="button" onClick={() => void handleDownload()}>
              <Download className="h-4 w-4" />
              Download QR code
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setState(DEFAULT_STATE)}
            >
              Reset styles
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
