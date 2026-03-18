import { Check, X } from "lucide-react";

type ServiceWhatIncludedProps = {
  items?: string[];
  variant?: "includes" | "excludes" | "list";
};

export function ServiceWhatIncluded({
  items = [],
  variant = "includes",
}: ServiceWhatIncludedProps) {
  if (items.length === 0) {
    return <p className="text-muted-foreground">No items listed.</p>;
  }

  const Icon = variant === "excludes" ? X : Check;
  const iconClass =
    variant === "excludes"
      ? "size-5 shrink-0 text-destructive mt-0.5"
      : "size-5 shrink-0 text-teal-600 mt-0.5";

  return (
    <ul
      className={
        variant === "list"
          ? "list-disc list-inside space-y-2 text-muted-foreground ps-4"
          : "space-y-3"
      }
    >
      {items.map((item, i) => (
        <li
          key={i}
          className={
            variant !== "list"
              ? "flex items-start gap-3 rtl:flex-row-reverse rtl:text-right"
              : undefined
          }
        >
          {variant !== "list" && <Icon className={iconClass} />}
          <span className="text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}
