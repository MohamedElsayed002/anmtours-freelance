import { MapPin } from "lucide-react";

type ServiceLocationProps = {
  location?: string | null;
  description?: string;
};

export function ServiceLocation({
  location,
  description = "This experience takes place in a stunning location with easy access from major cities. Detailed meeting point and directions will be provided upon booking.",
}: ServiceLocationProps) {
  return (
    <div className="space-y-4">
      {location && (
        <div className="flex items-start gap-3">
          <MapPin className="size-5 shrink-0 text-teal-600 mt-0.5" />
          <div>
            <p className="font-medium">{location}</p>
          </div>
        </div>
      )}
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
