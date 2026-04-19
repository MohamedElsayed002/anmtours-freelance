"use client";

import ReactMarkdown from "react-markdown";
import { Check } from "lucide-react";

type ServiceOverviewProps = {
  description: string;
  highlights: string[];
  highlightsLabel: string;
  descriptionLabel: string;
};

export function ServiceOverview({
  description,
  highlights,
  highlightsLabel,
  descriptionLabel,
}: ServiceOverviewProps) {
  return (
    <div className="space-y-8">
      {highlights.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">{highlightsLabel}</h3>
          <ul className="space-y-3 rtl:text-right">
            {highlights.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rtl:flex-row-reverse rtl:text-right"
              >
                <Check className="size-5 shrink-0 text-teal-600 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {description && (
        <div>
          <h3 className="text-lg font-semibold mb-4">{descriptionLabel}</h3>
          <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none prose-p:text-muted-foreground prose-ul:ps-6 prose-ol:ps-6">
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-3 leading-relaxed">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">
                    {children}
                  </strong>
                ),
                ul: ({ children }) => (
                  <ul className="my-3 list-disc space-y-1 ps-6 text-muted-foreground">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-3 list-decimal space-y-1 ps-6 text-muted-foreground">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
              }}
            >
              {description}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
