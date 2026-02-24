import Image from "next/image";

interface ExecutiveImageProps {
  execName: string;
  execRole: string;
  execMail: string;
  execPhotoPath: string | undefined;
  execDescription: string | undefined;
}

export default function ExecutiveImage({
  execName,
  execRole,
  execPhotoPath,
  execDescription,
}: ExecutiveImageProps) {
  const photoSrc = execPhotoPath
    ? execPhotoPath.startsWith("/")
      ? execPhotoPath
      : `/${execPhotoPath}`
    : undefined;

  const defaultDescription = `${execName} serves as ${execRole} and helps build a welcoming, faith-centered community through consistent support, collaboration, and care.`;

  return (
    <div className="h-[300px] text-justify group perspective-[1000px]">
      <div className="relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <div className="flex rounded-lg bg-gray-100 mb-4 overflow-hidden h-full w-full items-center justify-center">
            {photoSrc ? (
              <div className="relative h-full w-full">
                <Image
                  alt="Executive photo"
                  src={photoSrc}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="executive-image object-cover"
                />
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-20 w-20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4"></circle>
                  <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"></path>
                </svg>
                <p className="mt-2 text-sm font-semibold tracking-wide">No photo yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="absolute inset-0 h-full w-full text-center rounded-lg bg-emerald-500 mb-4 overflow-hidden items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="flex h-full flex-col items-center text-white justify-center p-2">
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p className="text-base text-white text-center mb-4">
              {execDescription ?? defaultDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
