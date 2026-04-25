export const SERVICE_LOCATION_OPTIONS = [
  { value: "sharm-elsheikh", label: "Sharm El Sheikh" },
  { value: "hurghada", label: "Hurghada" },
] as const;

export const SERVICE_LOCATION_VALUES = SERVICE_LOCATION_OPTIONS.map(
  (option) => option.value
);

export type ServiceLocation = (typeof SERVICE_LOCATION_VALUES)[number];

export function isServiceLocation(value: unknown): value is ServiceLocation {
  return (
    typeof value === "string" &&
    SERVICE_LOCATION_VALUES.includes(value as ServiceLocation)
  );
}
