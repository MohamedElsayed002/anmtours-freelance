"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createServiceSchema,
  type ServiceFormValues,
} from "@/lib/validations/service";
import { CoverImageUploader, GalleryImageUploader } from "./image-uploader";
import { LocaleArrayEditor } from "./locale-array-editor";
import { AddServiceStepper } from "./add-service-stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { routing } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE_LOCATION_OPTIONS } from "@/lib/service-location";

const LOCALES = routing.locales;
const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  ar: "العربية",
  ru: "Русский",
  it: "Italiano",
};

function filterLocaleItems(
  arr: { lang: string; items: string[] }[]
): { lang: string; items: string[] }[] {
  return arr
    .map((entry) => ({
      lang: entry.lang,
      items: (entry.items ?? []).filter((s) => s?.trim()),
    }))
    .filter((e) => e.items.length > 0);
}

type ServiceData = {
  id: string;
  coverImage: string | null;
  images: string[];
  details: Array<{ lang: string; title: string; description: string }>;
  highlights: Array<{ lang: string; items: string[] }> | null;
  includes: Array<{ lang: string; items: string[] }> | null;
  excludes: Array<{ lang: string; items: string[] }> | null;
  goodToKnow: Array<{ lang: string; items: string[] }> | null;
  priceAdult: number;
  priceKids: number;
  duration: string | null;
  location: string | null;
  category: string | null;
  serviceLocation: string;
  maxParticipants: number | null;
  slug: string;
  isActive: boolean;
};

type EditServiceFormProps = {
  serviceId: string;
};

export function EditServiceForm({ serviceId }: EditServiceFormProps) {
  const t = useTranslations("Form");
  const tForm = (key: string, values?: Record<string, string | number>) =>
    t(key, values as Record<string, string>);

  const schema = createServiceSchema(tForm);
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      coverImage: "",
      images: [],
      details: LOCALES.map((lang) => ({ lang, title: "", description: "" })),
      highlights: LOCALES.map((lang) => ({ lang, items: [""] })),
      includes: LOCALES.map((lang) => ({ lang, items: [""] })),
      excludes: LOCALES.map((lang) => ({ lang, items: [""] })),
      goodToKnow: LOCALES.map((lang) => ({ lang, items: [""] })),
      priceAdult: "",
      priceKids: "",
      duration: "",
      location: "",
      category: "",
      serviceLocation: "sharm-elsheikh",
      maxParticipants: "",
      slug: "",
    },
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const details = form.watch("details");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/admin/services/${serviceId}`);
        if (!res.ok) {
          setError("Failed to load service");
          return;
        }
        const data: ServiceData = await res.json();
        if (cancelled) return;

        const detailsFromService = (data.details ?? []) as Array<{
          lang: string;
          title: string;
          description: string;
        }>;
        const detailsMerged = LOCALES.map((lang) => {
          const found = detailsFromService.find((d) => d.lang === lang);
          return found ?? { lang, title: "", description: "" };
        });

        const mergeLocaleItems = (
          raw: Array<{ lang: string; items: string[] }> | null
        ) =>
          LOCALES.map((lang) => {
            const found = (raw ?? []).find((d) => d.lang === lang);
            const items = found?.items?.filter(Boolean) ?? [];
            return { lang, items: items.length > 0 ? items : [""] };
          });

        form.reset({
          coverImage: data.coverImage ?? "",
          images: data.images ?? [],
          details: detailsMerged,
          highlights: mergeLocaleItems(data.highlights),
          includes: mergeLocaleItems(data.includes),
          excludes: mergeLocaleItems(data.excludes),
          goodToKnow: mergeLocaleItems(data.goodToKnow),
          priceAdult: String(data.priceAdult),
          priceKids: String(data.priceKids ?? 0),
          duration: data.duration ?? "",
          location: data.location ?? "",
          category: data.category ?? "",
          serviceLocation: data.serviceLocation ?? "sharm-elsheikh",
          maxParticipants: data.maxParticipants
            ? String(data.maxParticipants)
            : "",
          slug: data.slug ?? "",
        });
        setIsActive(data.isActive);
      } catch {
        if (!cancelled) setError("Failed to load service");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [serviceId, form]);

  const validateStep = async (s: number) => {
    const fields: (keyof ServiceFormValues)[] =
      s === 1
        ? ["details"]
        : s === 2
          ? ["priceAdult", "slug", "duration", "location", "category", "serviceLocation", "maxParticipants"]
          : ["coverImage", "images"];
    const result = await form.trigger(fields);
    return result;
  };

  const nextStep = async () => {
    if (await validateStep(step)) setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      const priceAdult =
        typeof data.priceAdult === "string" ? parseFloat(data.priceAdult) : data.priceAdult;
      const priceKids =
        typeof data.priceKids === "string"
          ? parseFloat(data.priceKids as string)
          : (data.priceKids ?? 0);
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coverImage: data.coverImage,
          images: data.images ?? [],
          details: data.details,
          highlights: filterLocaleItems(data.highlights ?? []),
          includes: filterLocaleItems(data.includes ?? []),
          excludes: filterLocaleItems(data.excludes ?? []),
          goodToKnow: filterLocaleItems(data.goodToKnow ?? []),
          priceAdult: isNaN(priceAdult) ? 0 : priceAdult,
          priceKids: isNaN(priceKids) ? 0 : Math.max(0, priceKids),
          duration: data.duration || undefined,
          location: data.location || undefined,
          category: data.category || undefined,
          serviceLocation: data.serviceLocation,
          maxParticipants: data.maxParticipants || undefined,
          slug: data.slug,
          isActive,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t("error"));
      }

      alert(t("success"));
    } catch (err) {
      alert(err instanceof Error ? err.message : t("error"));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
        {error}
      </div>
    );
  }

  const handleSaveClick = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <Form {...form}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <AddServiceStepper currentStep={step} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="size-4 rounded border-input"
            />
            <span className="text-sm font-medium">Active</span>
          </label>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">{t("step1Title")}</h2>
            <p className="text-muted-foreground">{t("step1Desc")}</p>
            <FormDescription>
              Description supports Markdown: **bold**, *italic*, - lists
            </FormDescription>
            <div className="grid gap-6 sm:grid-cols-2">
              {details.map((_, index) => (
                <Card key={details[index]?.lang}>
                  <CardHeader className="pb-3">
                    <span className="text-base font-medium">
                      {LOCALE_LABELS[details[index]?.lang ?? "en"]}
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`details.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("title")}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Service title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`details.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("description")}</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={6}
                              placeholder="Full description (Markdown supported)"
                              className="font-mono text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold">{t("step2Title")}</h2>
              <p className="text-muted-foreground">{t("step2Desc")}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="priceAdult"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (Adult)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 480"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priceKids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (Kids)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 240"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("duration")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("durationPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("location")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("locationPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("category")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("categoryPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Location</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SERVICE_LOCATION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the destination bucket shown on the homepage.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("slug")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("slugPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL-friendly identifier (e.g. shark-elsheikh)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("maxParticipants")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("maxParticipantsPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-8 border-t pt-8">
              <FormField
                control={form.control}
                name="highlights"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <LocaleArrayEditor
                        value={field.value ?? []}
                        onChange={field.onChange}
                        title="Highlights"
                        placeholder="e.g. Exclusive access to pristine beaches"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <LocaleArrayEditor
                        value={field.value ?? []}
                        onChange={field.onChange}
                        title="Includes"
                        placeholder="e.g. Hotel pickup and drop-off"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="excludes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <LocaleArrayEditor
                        value={field.value ?? []}
                        onChange={field.onChange}
                        title="Excludes"
                        placeholder="e.g. Personal expenses"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goodToKnow"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <LocaleArrayEditor
                        value={field.value ?? []}
                        onChange={field.onChange}
                        title="Good to Know"
                        placeholder="e.g. Bring sunscreen"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">{t("step4Title")}</h2>
            <p className="text-muted-foreground">{t("step4Desc")}</p>
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("coverImage")}</FormLabel>
                  <FormControl>
                    <CoverImageUploader
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>{t("coverImageDesc")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("images")}</FormLabel>
                  <FormControl>
                    <GalleryImageUploader
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>{t("imagesDesc")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
          {step < 3 ? (
            <Button type="button" onClick={nextStep}>
              Next
              <ArrowRight className="ml-2 size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSaveClick}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? t("submitting") : "Save Changes"}
            </Button>
          )}
        </div>
      </div>
    </Form>
  );
}
