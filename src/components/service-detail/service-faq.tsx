import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQItem = {
  question: string;
  answer: string;
};

type ServiceFAQProps = {
  items?: FAQItem[];
};

const DEFAULT_FAQ: FAQItem[] = [
  {
    question: "What is the cancellation policy?",
    answer:
      "You can cancel up to 30 days before the departure date for a full refund. Cancellations within 30 days may be subject to a fee. Please contact us for specific details.",
  },
  {
    question: "What should I pack?",
    answer:
      "We recommend comfortable walking shoes, layered clothing for varying temperatures, sunscreen, and a reusable water bottle. A detailed packing list will be sent upon booking.",
  },
  {
    question: "Is travel insurance included?",
    answer:
      "Travel insurance is not included but highly recommended. We can assist you in finding suitable coverage for your trip.",
  },
];

export function ServiceFAQ({ items = DEFAULT_FAQ }: ServiceFAQProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
