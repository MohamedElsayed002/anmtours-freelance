import { TrendingUp } from "lucide-react";

type DemandNotificationProps = {
  message: string;
};

export function DemandNotification({
  message = "12 people booked this in last 24 hours",
}: DemandNotificationProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
      <TrendingUp className="size-5 shrink-0 text-amber-600" />
      <div>
        <p className="font-medium text-amber-900 dark:text-amber-100">High Demand</p>
        <p className="text-sm text-amber-800 dark:text-amber-200">{message}</p>
      </div>
    </div>
  );
}
