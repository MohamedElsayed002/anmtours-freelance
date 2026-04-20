"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

type BookingSidebarProps = {
  serviceId?: string;
  priceAdult: number;
  priceKids: number;
  perPersonLabel: string;
  selectDatesLabel: string;
  travelersLabel: string;
  travelersHintLabel: string;
  adultsLabel: string;
  childrenLabel: string;
  infantsLabel: string;
  localTaxesLabel: string;
  totalLabel: string;
  bookButtonLabel: string;
  secureLabel: string;
};

export function BookingSidebar({
  serviceId,
  priceAdult,
  priceKids,
  perPersonLabel,
  selectDatesLabel,
  travelersLabel,
  travelersHintLabel,
  adultsLabel,
  childrenLabel,
  infantsLabel,
  localTaxesLabel,
  totalLabel,
  bookButtonLabel,
  secureLabel,
}: BookingSidebarProps) {
  const user = useUser();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const t = useTranslations("BookingSidebar")

  const subtotal = adults * priceAdult + children * priceKids;
  // const tax = Math.round(subtotal * 0.025);
  const total = subtotal;

  const handleRequestBooking = async () => {
    if (!user.user) return;
    if (!date) {
      alert(t("selectDate"));
      return;
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date.toISOString(),
          adults,
          children,
          total,
          ...(serviceId && { serviceId }),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to create booking");
      }
      alert(t("bookingSuccess"));
    } catch (e) {
      alert(e instanceof Error ? e.message : t("bookingError"));
    }
  };

  return (
    <div className="space-y-6 rounded-xl border bg-card p-6 shadow-md">
      <div>
        <p className="text-sm text-muted-foreground">
          From{" "}
          <span className="text-2xl font-bold text-foreground">
            ${Math.round(priceAdult)}
          </span>{" "}
          /{perPersonLabel}
        </p>
        {priceKids > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            Kids: ${Math.round(priceKids)} /{perPersonLabel}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            {selectDatesLabel}
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-start font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="me-2 size-4 shrink-0" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            {travelersLabel}
          </label>
          <p className="mb-2 text-xs text-muted-foreground">
            {travelersHintLabel}
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <span className="text-sm">{adultsLabel}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => setAdults((n) => Math.max(0, n - 1))}
                  disabled={adults <= 0}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="min-w-[1.5rem] text-center font-medium">
                  {adults}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => setAdults((n) => n + 1)}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <span className="text-sm">{childrenLabel}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => setChildren((n) => Math.max(0, n - 1))}
                  disabled={children <= 0}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="min-w-[1.5rem] text-center font-medium">
                  {children}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => setChildren((n) => n + 1)}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
            {/* <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <span className="text-sm">{infantsLabel}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => setInfants((n) => Math.max(0, n - 1))}
                  disabled={infants <= 0}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="min-w-[1.5rem] text-center font-medium">
                  {infants}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => setInfants((n) => n + 1)}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="space-y-2 border-t pt-4">
        {adults > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ${Math.round(priceAdult)} x {adults} Adult{adults !== 1 ? "s" : ""}
            </span>
            <span>${(adults * priceAdult).toLocaleString()}</span>
          </div>
        )}
        {children > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ${Math.round(priceKids)} x {children} Child
              {children !== 1 ? "ren" : ""}
            </span>
            <span>${(children * priceKids).toLocaleString()}</span>
          </div>
        )}
        {/* <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{localTaxesLabel}</span>
          <span>${tax}</span>
        </div> */}
        <div className="flex justify-between pt-2 text-base font-bold">
          <span>{totalLabel}</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>
      <Button onClick={handleRequestBooking} className="w-full bg-teal-600">
        {user.user ? t("requestBooking") : t("signInToRequestBooking")}
      </Button>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>🔒</span>
        <span>{secureLabel}</span>
      </div>
    </div>
  );
}
