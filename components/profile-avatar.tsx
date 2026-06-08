import Image from "next/image";
import { withBasePath } from "@/lib/base-path";

export function ProfileAvatar({
  image,
  className = "",
  imageClassName = ""
}: {
  image: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={`profile-avatar group relative grid shrink-0 place-items-center overflow-hidden rounded-full border border-[#B18D43]/35 bg-white/[0.045] text-paper ${className}`}>
      {image ? (
        <Image
          src={withBasePath(image)}
          alt="Ahmed Alaraby"
          fill
          unoptimized
          sizes="240px"
          className={`object-cover transition duration-700 ease-out group-hover:scale-105 ${imageClassName}`}
        />
      ) : (
        <span className="text-lg font-semibold tracking-[0.08em] text-[#D4B66F]">AA</span>
      )}
    </div>
  );
}
