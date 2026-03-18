import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";

type ServiceBreadcrumbsProps = {
  title: string;
  category?: string | null;
  homeLabel: string;
  toursLabel: string;
};

export function ServiceBreadcrumbs({
  title,
  category,
  homeLabel,
  toursLabel,
}: ServiceBreadcrumbsProps) {
  return (
    <nav className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
      <Link href="/" className="transition-colors hover:text-foreground">
        {homeLabel}
      </Link>
      <ChevronRight className="size-4" />
      <Link href="/destinations" className="transition-colors hover:text-foreground">
        {toursLabel}
      </Link>
      {category && (
        <>
          <ChevronRight className="size-4" />
          <span className="text-muted-foreground">{category}</span>
        </>
      )}
      <ChevronRight className="size-4" />
      <span className="font-medium text-foreground">{title}</span>
    </nav>
  );
}
