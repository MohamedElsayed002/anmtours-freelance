import { setRequestLocale } from "next-intl/server";
import { ChatBot } from "@/components/chat/ChatBot";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Props = { params: Promise<{ locale: string }> };

export default async function ChatPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container max-w-3xl py-8">
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <h1 className="text-2xl font-bold">Travel Assistant</h1>
          <p className="text-muted-foreground text-sm">
            Get personalized recommendations for experiences in Sharm El Sheikh
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="min-h-[500px]">
            <ChatBot />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
