"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { routing } from "@/i18n/routing";

const LOCALES = routing.locales;
const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  ar: "العربية",
  ru: "Русский",
  it: "Italiano",
};

type LocaleItems = { lang: string; items: string[] };

type LocaleArrayEditorProps = {
  value: LocaleItems[];
  onChange: (value: LocaleItems[]) => void;
  title: string;
  placeholder?: string;
};

export function LocaleArrayEditor({
  value,
  onChange,
  title,
  placeholder = "Add item...",
}: LocaleArrayEditorProps) {
  const itemsByLang = value.length > 0
    ? value
    : LOCALES.map((lang) => ({ lang, items: [""] }));

  const updateItems = (lang: string, items: string[]) => {
    const next = itemsByLang.map((entry) =>
      entry.lang === lang ? { ...entry, items } : entry
    );
    onChange(next);
  };

  const addItem = (lang: string) => {
    const entry = itemsByLang.find((e) => e.lang === lang);
    const items = [...(entry?.items ?? []), ""];
    updateItems(lang, items);
  };

  const removeItem = (lang: string, index: number) => {
    const entry = itemsByLang.find((e) => e.lang === lang);
    const items = (entry?.items ?? []).filter((_, i) => i !== index);
    updateItems(lang, items.length > 0 ? items : [""]);
  };

  const setItem = (lang: string, index: number, text: string) => {
    const entry = itemsByLang.find((e) => e.lang === lang);
    const items = [...(entry?.items ?? [])];
    items[index] = text;
    updateItems(lang, items);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {itemsByLang.map((entry) => (
          <Card key={entry.lang}>
            <CardHeader className="pb-2">
              <span className="text-sm font-medium">
                {LOCALE_LABELS[entry.lang]}
              </span>
            </CardHeader>
            <CardContent className="space-y-2">
              {(entry.items.length === 0 ? [""] : entry.items).map(
                (item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => setItem(entry.lang, idx, e.target.value)}
                      placeholder={placeholder}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(entry.lang, idx)}
                      disabled={entry.items.length <= 1}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                )
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem(entry.lang)}
              >
                <Plus className="mr-1 size-4" />
                Add
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
