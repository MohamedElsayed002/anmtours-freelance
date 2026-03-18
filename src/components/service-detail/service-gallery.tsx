"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ImageLightbox } from "./image-lightbox";

type ServiceGalleryProps = {
  coverImage: string | null;
  images: string[];
  title: string;
  viewAllPhotosLabel: string;
};

export function ServiceGallery({
  coverImage,
  images,
  title,
  viewAllPhotosLabel,
}: ServiceGalleryProps) {
  const allImages = coverImage ? [coverImage, ...images] : images;
  const mainImage = allImages[0];
  const gridImages = allImages.slice(1, 5);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (!mainImage) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
        <div className="flex h-full items-center justify-center text-muted-foreground">
          No image
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-1 gap-2 md:grid-cols-3 md:grid-rows-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        {/* Main large image - left side */}
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative aspect-[4/3] overflow-hidden rounded-t-xl md:col-span-2 md:row-span-2 md:aspect-[16/10] md:rounded-l-xl md:rounded-tr-none cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={mainImage}
            alt={title}
            fill
            className="object-cover transition-opacity hover:opacity-95"
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
            unoptimized
          />
        </motion.button>
        {/* 2x2 grid - right side */}
        <div className="grid grid-cols-2 gap-2 md:col-span-1 md:row-span-2 md:grid-rows-2 md:min-h-0">
          {gridImages.length > 0 ? (
            gridImages.slice(0, 4).map((url, index) => (
              <motion.button
                key={url + index}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.05 * index }}
                className="relative aspect-square overflow-hidden rounded-lg cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                onClick={() => openLightbox(index + 1)}
              >
                <Image
                  src={url}
                  alt={`${title} - ${index + 2}`}
                  fill
                  className="object-cover transition-opacity hover:opacity-95"
                  sizes="(max-width: 768px) 50vw, 17vw"
                  unoptimized
                />
                {index === 3 && allImages.length > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm font-medium">
                    {viewAllPhotosLabel}
                  </div>
                )}
              </motion.button>
            ))
          ) : (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-muted/50" />
            ))
          )}
        </div>
      </motion.div>

      <ImageLightbox
        images={allImages}
        currentIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((i) => Math.max(0, i - 1))}
        onNext={() =>
          setLightboxIndex((i) => Math.min(allImages.length - 1, i + 1))
        }
        title={title}
      />
    </>
  );
}
