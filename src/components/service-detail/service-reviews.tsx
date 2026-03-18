import { Star } from "lucide-react";

type Review = {
  author: string;
  rating: number;
  date: string;
  content: string;
};

type ServiceReviewsProps = {
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
};

const DEFAULT_REVIEWS: Review[] = [
  {
    author: "Sarah M.",
    rating: 5,
    date: "2 weeks ago",
    content:
      "An absolutely incredible experience! The guides were knowledgeable and the itinerary was perfectly planned. Would highly recommend to anyone visiting.",
  },
  {
    author: "James K.",
    rating: 5,
    date: "1 month ago",
    content:
      "Best tour I've ever been on. Every detail was taken care of. The accommodation was excellent and the activities were unforgettable.",
  },
];

export function ServiceReviews({
  reviews = DEFAULT_REVIEWS,
  averageRating = 4.9,
  totalReviews = 124,
}: ServiceReviewsProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`size-5 ${
                i <= Math.round(averageRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
        <span className="font-semibold">{averageRating}</span>
        <span className="text-muted-foreground">({totalReviews} reviews)</span>
      </div>
      <div className="space-y-6">
        {reviews.map((review, i) => (
          <div key={i} className="border-b pb-6 last:border-0 last:pb-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="font-medium">{review.author}</span>
              <span className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`size-4 ${
                      j < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </span>
              <span className="text-sm text-muted-foreground">{review.date}</span>
            </div>
            <p className="text-muted-foreground">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
