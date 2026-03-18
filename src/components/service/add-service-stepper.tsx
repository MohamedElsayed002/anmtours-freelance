"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Info" },
  { id: 3, label: "Images" },
];

type AddServiceStepperProps = {
  currentStep: number;
};

export function AddServiceStepper({ currentStep }: AddServiceStepperProps) {
  return (
    <nav aria-label="Progress" className="mb-10">
      <ol className="flex items-center">
        {STEPS.map((step, index) => {
          const isComplete = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isLast = index === STEPS.length - 1;

          return (
            <li key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isComplete && "border-teal-600 bg-teal-600 text-white",
                    isCurrent &&
                      "border-teal-600 bg-teal-50 text-teal-700 dark:bg-teal-950/50",
                    !isComplete &&
                      !isCurrent &&
                      "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {isComplete ? <Check className="size-5" /> : step.id}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 min-w-[24px]",
                    isComplete ? "bg-teal-600" : "bg-muted"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
