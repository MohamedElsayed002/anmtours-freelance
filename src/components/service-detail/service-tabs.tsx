"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceOverview } from "./service-overview";
import { ServiceWhatIncluded } from "./service-what-included";
import { ServiceLocation } from "./service-location";
import { ServiceFAQ } from "./service-faq";

type ServiceTabsProps = {
  description: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  goodToKnow: string[];
  location?: string | null;
  overviewTabLabel: string;
  highlightsLabel: string;
  descriptionLabel: string;
  includesTabLabel: string;
  excludesTabLabel: string;
  goodToKnowTabLabel: string;
  locationTabLabel: string;
  faqTabLabel: string;
};

export function ServiceTabs({
  description,
  highlights,
  includes,
  excludes,
  goodToKnow,
  location,
  overviewTabLabel,
  highlightsLabel,
  descriptionLabel,
  includesTabLabel,
  excludesTabLabel,
  goodToKnowTabLabel,
  locationTabLabel,
  faqTabLabel,
}: ServiceTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full rtl:float-end rtl:text-right">
      <TabsList variant="line" className="flex-wrap gap-1 bg-transparent rtl:float-end rtl:text-right rtl:direction-rtl">
        <TabsTrigger value="overview">{overviewTabLabel}</TabsTrigger>
        <TabsTrigger value="included">{includesTabLabel}</TabsTrigger>
        <TabsTrigger value="excluded">{excludesTabLabel}</TabsTrigger>
        <TabsTrigger value="goodToKnow">{goodToKnowTabLabel}</TabsTrigger>
        <TabsTrigger value="location">{locationTabLabel}</TabsTrigger>
        <TabsTrigger value="faq">{faqTabLabel}</TabsTrigger>
      </TabsList>
      <div className="mt-6 rtl:float-end rtl:text-right">
        <TabsContent value="overview">
          <ServiceOverview
  description={description}
  highlights={highlights}
  highlightsLabel={highlightsLabel}
  descriptionLabel={descriptionLabel}
/>
        </TabsContent>
        <TabsContent value="included">
          <ServiceWhatIncluded items={includes} />
        </TabsContent>
        <TabsContent value="excluded">
          <ServiceWhatIncluded items={excludes} variant="excludes" />
        </TabsContent>
        <TabsContent value="goodToKnow">
          <ServiceWhatIncluded items={goodToKnow} variant="list" />
        </TabsContent>
        <TabsContent value="location">
          <ServiceLocation location={location} />
        </TabsContent>
        <TabsContent value="faq">
          <ServiceFAQ />
        </TabsContent>
      </div>
    </Tabs>
  );
}
