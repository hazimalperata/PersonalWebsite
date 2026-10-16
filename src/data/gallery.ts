// TODO: Bu alt metinler geçici ve numaralı; yayından önce site sahibi gerçek açıklamalarla değiştirmeli.
import type { L } from "./profile";

export type Orientation = "horizontal" | "vertical";

export interface GalleryPhoto {
  src: string;
  orientation: Orientation;
  width: number;
  height: number;
  alt: L;
}

const SIZES: Record<Orientation, { width: number; height: number }> = {
  horizontal: { width: 2000, height: 1126 },
  vertical: { width: 1126, height: 2000 },
};

function photo(orientation: Orientation, n: number): GalleryPhoto {
  const landscape = orientation === "horizontal";
  return {
    src: `/images/gallery/${orientation}-${n}.jpeg`,
    orientation,
    ...SIZES[orientation],
    alt: {
      en: `Photo ${n} from Hazim's gallery, ${landscape ? "landscape" : "portrait"}`,
      tr: `Hazım'ın galerisinden ${n}. fotoğraf, ${landscape ? "yatay" : "dikey"}`,
    },
  };
}

/** Alternates landscape and portrait, as on the previous site. */
export const gallery: GalleryPhoto[] = Array.from({ length: 8 }, (_, i) => [
  photo("horizontal", i + 1),
  photo("vertical", i + 1),
]).flat();
