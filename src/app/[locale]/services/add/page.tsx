import { setRequestLocale } from "next-intl/server";
import { AddServiceForm } from "@/components/service/add-service-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AddServicePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto py-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Add New Service</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Create a new travel experience in 4 simple steps. Add your content in English, Arabic, Russian, and Italian.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <AddServiceForm />
        </div>
      </div>
    </div>
  );
}
