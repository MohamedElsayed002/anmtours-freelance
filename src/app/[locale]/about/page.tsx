import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold">About Us</h1>
      <p className="mt-4 text-muted-foreground">
        We are a travel agency dedicated to creating unforgettable experiences.
      </p>
    </div>
  );
}
