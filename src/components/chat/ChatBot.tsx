"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, Send, StopCircle, MessageCircle } from "lucide-react";

function getApiUrl() {
  if (typeof window === "undefined") return "/api/chat";
  return "/api/chat";
}

export function ChatBot() {
  const { messages, sendMessage, status, stop, error, clearError } = useChat({
    transport: new DefaultChatTransport({ api: getApiUrl() }),
  });
  const [input, setInput] = useState("");

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8 space-y-2">
            <MessageCircle className="h-12 w-12 mx-auto opacity-50" />
            <p className="font-medium">Travel Assistant</p>
            <p className="text-sm">
              Ask me about experiences in Sharm El Sheikh! Try:
            </p>
            <ul className="text-sm space-y-1 text-left max-w-xs mx-auto">
              <li>• &quot;I want something romantic&quot;</li>
              <li>• &quot;We are 4 people with kids&quot;</li>
              <li>• &quot;Cheap water activity&quot;</li>
              <li>• &quot;We only have one free day&quot;</li>
              <li>• &quot;Something relaxing?&quot;</li>
            </ul>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <Card
              className={`max-w-[85%] ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <CardContent className="py-3 px-4">
                <p className="text-xs font-medium opacity-80 mb-1">
                  {message.role === "user" ? "You" : "Assistant"}
                </p>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {message.parts?.map((part, index) =>
                    part.type === "text" ? (
                      <span key={index} className="whitespace-pre-wrap">
                        {part.text}
                      </span>
                    ) : null
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-muted">
              <CardContent className="py-3 px-4 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 pb-2">
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="py-2 px-4 flex items-center justify-between">
              <span className="text-sm text-destructive">
                Something went wrong. Please try again.
              </span>
              <Button variant="ghost" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) {
              sendMessage({ text: input });
              setInput("");
            }
          }}
          className="flex gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim()) {
                  sendMessage({ text: input });
                  setInput("");
                }
              }
            }}
            placeholder="Ask about experiences..."
            disabled={status !== "ready"}
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
          />
          {isLoading ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={stop}
              className="shrink-0"
            >
              <StopCircle className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || status !== "ready"}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
