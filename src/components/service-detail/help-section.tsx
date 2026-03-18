import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type HelpSectionProps = {
  title: string;
  description: string;
  buttonLabel: string;
};

export function HelpSection({
  title = "Need Help?",
  description = "Our travel experts are available 24/7 to answer your questions.",
  buttonLabel = "Chat with an Expert",
}: HelpSectionProps) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <h4 className="font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <Button variant="outline" className="mt-4 w-full" asChild>
        <a href="/contact">
          <MessageCircle className="mr-2 size-4" />
          {buttonLabel}
        </a>
      </Button>
    </div>
  );
}
