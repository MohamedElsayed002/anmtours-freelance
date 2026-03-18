"use client";

import { Shield, CreditCard, Headphones, BadgeCheck } from "lucide-react";

const BADGES = [
  {
    icon: Shield,
    label: "Secure Booking",
    desc: "Encrypted payments",
  },
  {
    icon: CreditCard,
    label: "Flexible Payment",
    desc: "Multiple options",
  },
  {
    icon: Headphones,
    label: "24/7 Support",
    desc: "Always here to help",
  },
  {
    icon: BadgeCheck,
    label: "Verified Operator",
    desc: "Quality guaranteed",
  },
];

export function TrustBadges() {
  return (
    <div className="border-y bg-muted/30 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {BADGES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-lg p-4"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-6" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{label}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
