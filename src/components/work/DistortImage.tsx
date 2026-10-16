'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { useTier } from '@/lib/useTier';
import { useHoverDistort } from './useHoverDistort';

interface DistortImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * A normal `next/image` that, on fine-pointer hover, gets a single WebGL canvas laid over it.
 * The real <img> always stays in the DOM beneath (no-JS, touch, poster tier, reduced motion).
 */
export function DistortImage({
  src,
  alt,
  sizes,
  priority,
  className,
}: DistortImageProps) {
  const tier = useTier();
  const [loaded, setLoaded] = useState(false);
  const enabled = loaded && tier !== null && tier !== 'poster';
  const imgRef = useRef<HTMLImageElement>(null);
  const { wrapperRef, handlers } = useHoverDistort(imgRef, src, enabled);

  return (
    <div
      ref={wrapperRef}
      className={cn('relative overflow-hidden', className)}
      {...handlers}
    >
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className="object-cover"
      />
    </div>
  );
}
