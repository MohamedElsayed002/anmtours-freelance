"use client";

import ReactMarkdown from "react-markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type ItineraryDay = {
  day: number;
  title: string;
  content: string;
};

type ServiceItineraryProps = {
  days: ItineraryDay[];
  expandAllLabel: string;
  dayLabel: string;
};

export function ServiceItinerary({
  days,
  expandAllLabel,
  dayLabel,
}: ServiceItineraryProps) {
  if (days.length === 0) {
    return (
      <p className="text-muted-foreground">No itinerary available.</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Day-by-Day Itinerary</h3>
        <button
          type="button"
          className="text-sm font-medium text-teal-600 hover:underline"
        >
          {expandAllLabel}
        </button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={[`day-${days[0]?.day}`]}
        className="space-y-0"
      >
        {days.map((day) => (
          <AccordionItem
            key={day.day}
            value={`day-${day.day}`}
            className="border-b border-l-4 border-l-teal-500/30 pl-4 last:border-b-0"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="text-left">
                <span className="font-semibold">
                  {dayLabel} {day.day}
                </span>{" "}
                {day.title || "Untitled"}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-3 text-muted-foreground leading-relaxed">
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">
                        {children}
                      </strong>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-3 list-disc space-y-1 pl-6 text-muted-foreground">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="my-3 list-decimal space-y-1 pl-6 text-muted-foreground">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                  }}
                >
                  {day.content || "_No content for this day._"}
                </ReactMarkdown>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
