/**
 * FAQ and company info for the chatbot.
 * Edit this file to update answers - the chatbot uses ONLY this data to avoid hallucination.
 */

export const COMPANY_INFO = {
  name: "A&M Tours ",
  tagline: "Your trusted travel partner in Sharm El Sheikh",
  description:
    "A&M Tours  is a premium travel agency based in Sharm El Sheikh, Egypt. We specialize in curating unforgettable experiences including desert safaris, diving, snorkeling, cultural tours, and day trips. Founded with a passion for showcasing Egypt's beauty, we offer personalized service and handpicked adventures for couples, families, and groups.",
  founded: "2020",
  location: "Sharm El Sheikh, Egypt",
  services: "Safaris, diving, snorkeling, desert trips, cultural tours, day trips",
  contact: {
    email: "info@amtours.com",
    phone: "+20 123 456 7890",
  },
};

export const FREQUENT_QUESTIONS: { question: string; answer: string }[] = [
  {
    question: "Who am I?",
    answer:
      "You are chatting with the A&M Tours  Travel Assistant. I'm here to help you discover the perfect experiences in Sharm El Sheikh—whether you're looking for adventure, relaxation, family fun, or romantic getaways. Ask me anything about our tours!",
  },
  {
    question: "Who is A&M Tours ?",
    answer:
      "A&M Tours  is a premium travel agency in Sharm El Sheikh, Egypt. We offer curated experiences including safaris, diving, snorkeling, desert trips, and cultural tours. Contact us at info@amtours.com or +20 123 456 7890.",
  },
  {
    question: "What does A&M Tours  offer?",
    answer:
      "We offer safaris, diving, snorkeling, desert trips, cultural tours, and day trips in Sharm El Sheikh. Each experience is handpicked for quality and tailored for couples, families, and groups.",
  },
  {
    question: "How can I contact A&M Tours ?",
    answer:
      "You can reach us at info@amtours.com or call +20 123 456 7890. We're based in Sharm El Sheikh, Egypt.",
  },
];
