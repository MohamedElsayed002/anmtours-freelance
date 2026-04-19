"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";

import { SITE_CONFIG, getWhatsAppUrl } from "@/config/site";

const CONTACT = SITE_CONFIG.contact;

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image src="/logo.jpeg" alt="A&M Tours " width={220} height={200} className="h-14 w-auto object-contain md:h-16" />
            </Link>
            <p className="text-sm text-muted-foreground">{t("tagline")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("destinations")}
                </Link>
              </li>
              <li>
                <Link
                  href="/travel-tips"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("travelTips")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              {t("contactUs")}
            </h3>
            <ul className="space-y-3">
              {/* <li>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[#25D366]"
                >
                  <MessageCircle className="size-4 shrink-0" />
                  {t("whatsapp")}
                </a>
              </li> */}
              {/* <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="size-4 shrink-0" />
                  {CONTACT.email}
                </a>
              </li> */}
              <li>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="size-4 shrink-0" />
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{CONTACT.location}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              {t("followUs")}
            </h3>
            <p className="text-sm text-muted-foreground">{t("followDesc")}</p>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} A&M Tours . {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
