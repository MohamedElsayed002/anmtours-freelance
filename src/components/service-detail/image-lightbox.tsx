"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ImageLightboxProps = {
  images: string[];
  currentIndex: number;
  open: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  title?: string;
};

export function ImageLightbox({
  images,
  currentIndex,
  open,
  onClose,
  onPrev,
  onNext,
  title = "Gallery",
}: ImageLightboxProps) {
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") hasPrev && onPrev();
      if (e.key === "ArrowRight") hasNext && onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="fixed inset-0 w-screen h-screen max-w-none max-h-none sm:max-w-none p-0 border-0 rounded-none bg-black/95 overflow-hidden !translate-x-0 !translate-y-0"
        showCloseButton={false}
      >
        <div className="relative flex items-center justify-center w-full h-full min-h-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10 text-white hover:bg-white/20"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-8" />
          </Button>

          {images[currentIndex] && (
            <Image
              src={images[currentIndex]}
              alt={`${title} - ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full w-auto h-auto object-contain"
              unoptimized
            />
          )}

          {hasPrev && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full text-white hover:bg-white/20"
              onClick={onPrev}
              aria-label="Previous image"
            >
              <ChevronLeft className="size-10" />
            </Button>
          )}
          {hasNext && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full text-white hover:bg-white/20"
              onClick={onNext}
              aria-label="Next image"
            >
              <ChevronRight className="size-10" />
            </Button>
          )}
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </DialogContent>
    </Dialog>
  );
}
