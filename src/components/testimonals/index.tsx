"use client";

import Image from "next/image";
import { MoreVertical, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Review = {
  id: string;
  authorName: string;
  authorImage: string | null;
  rating: number;
  text: string;
  images: string[];
  addedAt?: Date;
  createdAt: Date;
};

type TestimonalsProps = {
  reviews?: Review[];
  locale?: string;
};

export const Testimonals = ({ reviews = [], locale = "en" }: TestimonalsProps) => {
  const isRtl = locale === "ar";

  return (
    <section className="py-20 px-4 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        {/* Business Info Header */}
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">A&M tours - Sharm El-Sheikh</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            branching off from Rixos Seagate، Al Moez Street، Nabq area, Sharm El Sheikh 2, South Sinai Governorate 46619, Egypt
          </p>
          <div className="flex items-center gap-4">
            <span className="text-5xl font-bold text-gray-900">5.0</span>
            <div className="space-y-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-5 fill-current" />
                ))}
              </div>
              <a 
                href="https://www.google.com/search?sxsrf=ANbL-n5683fRBSVIHwYSh8PmGN1goWJG1A:1776501455693&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOdk2d2-lw5uDucYYcrr8K92xDupxIx8Fx1jR3TZXZWINVImh8NOVYst7hcYOI5bDLivOdVESVPnyE__H0NLGeXi5OZWXnaclXGzZ9avF9f2t0q2DUw%3D%3D&q=A%26M+tours+-+Sharm+El-Sheikh+Reviews" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-muted-foreground font-medium hover:underline cursor-pointer"
              >
                86 reviews
              </a>
              <a
                              href="https://www.google.com/search?sxsrf=ANbL-n5683fRBSVIHwYSh8PmGN1goWJG1A:1776501455693&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOdk2d2-lw5uDucYYcrr8K92xDupxIx8Fx1jR3TZXZWINVImh8NOVYst7hcYOI5bDLivOdVESVPnyE__H0NLGeXi5OZWXnaclXGzZ9avF9f2t0q2DUw%3D%3D&q=A%26M+tours+-+Sharm+El-Sheikh+Reviews" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm text-blue-500 ml-1 underline font-medium hover:underline cursor-pointer"
              >
                See all reviews
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Carousel */}
      {reviews.length > 0 ? (
        <Carousel
          opts={{
            align: "start",
            direction: isRtl ? "rtl" : "ltr",
          }}
          className="w-full"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <CarouselContent className="ml-0">
            {reviews.map((review) => (
              <CarouselItem key={review.id} className="pl-0">
                <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4 items-center">
                        {review.authorImage ? (
                          <Image
                            src={review.authorImage}
                            alt={review.authorName}
                            width={40}
                            height={40}
                            className="rounded-full object-cover w-10 h-10 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                            {review.authorName[0]}
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-lg">{review.authorName}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex text-yellow-400">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="size-3.5 fill-current" />
                              ))}
                            </span>
                            <span>•</span>
                            <span>
                              {new Date(review.addedAt || review.createdAt).toLocaleDateString(
                                undefined,
                                { year: "numeric", month: "short", day: "numeric" }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors">
                        <MoreVertical className="size-5" />
                      </button>
                    </div>

                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {review.text}
                    </p>
                  </div>

                  {review.images && review.images.length > 0 && (
                    <div className="px-6 pb-6 pt-4">
                      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory">
                        {review.images.map((img, i) => (
                          <div key={i} className="relative w-full min-w-full h-96 snap-start">
                            <Image
                              src={img}
                              alt={`Review image ${i + 1}`}
                              fill
                              className="object-contain rounded-xl"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* <div className="flex gap-4 text-muted-foreground px-6 pb-6 pt-2 border-t">
                    <button className="flex items-center gap-2 text-sm font-medium hover:text-foreground transition-colors">
                      <ThumbsUp className="size-4" /> Helpful
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium hover:text-foreground transition-colors">
                      <Share2 className="size-4" /> Share
                    </button>
                  </div> */}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-2 size-10 border-2 bg-white shadow-md hover:bg-muted md:-left-6" />
          <CarouselNext className="-right-2 size-10 border-2 bg-white shadow-md hover:bg-muted md:-right-6" />
        </Carousel>
      ) : (
        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-2xl border border-dashed">
          No reviews available yet.
        </div>
      )}
    </section>
  );
};