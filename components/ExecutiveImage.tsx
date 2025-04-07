import { LoaderIcon } from "lucide-react";

interface ExecutiveImageProps {
  execName: string;
  execRole: string;
  execMail: string;
  execPhotoPath: string | undefined;
  execDescription: string | undefined;
}

export default function ExecutiveImage({
  execPhotoPath,
  execDescription,
}: ExecutiveImageProps) {
  return (
    <div className="h-[300px] text-justify group perspective-[1000px]">
      <div className="relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <div className="flex rounded-lg bg-gray-100 mb-4 overflow-hidden h-full w-full items-center justify-center">
            {execPhotoPath ? (
              <img
                alt="photo"
                src={execPhotoPath}
                className={"executive-imag object-cover w-full"}
              ></img>
            ) : (
              <LoaderIcon className="animate-[spin_2s_linear_infinite] h-10 w-10 text-green-400" />
            )}
          </div>
        </div>

        <div className="absolute inset-0 h-full w-full text-center rounded-lg bg-emerald-500 mb-4 overflow-hidden items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="flex h-full flex-col items-center text-white justify-center p-2">
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p className="text-base text-white text-center mb-4">
              {execDescription ?? "Description to be written..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
