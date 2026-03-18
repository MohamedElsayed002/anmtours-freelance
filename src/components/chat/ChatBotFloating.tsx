"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, StopCircle, MessageCircle, Minimize2 } from "lucide-react";
import { FREQUENT_QUESTIONS } from "@/config/chat-faq";
import { cn } from "@/lib/utils";

function getApiUrl() {
  if (typeof window === "undefined") return "/api/chat";
  return "/api/chat";
}

const SUGGESTED_QUESTIONS = [
  "I want something romantic",
  "We are 4 people with kids",
  "Cheap water activity",
  "We only have one free day",
  "Something relaxing?",
  ...FREQUENT_QUESTIONS.slice(0, 2).map((q) => q.question),
];

export function ChatBotFloating() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: getApiUrl(),
        body: { locale },
      }),
    [locale]
  );
  const { messages, sendMessage, status, stop, error, clearError } = useChat({
    transport,
  });
  const [input, setInput] = useState("");

  const isLoading = status === "submitted" || status === "streaming";

  const handleSuggestedClick = (text: string) => {
    sendMessage({ text });
  };

  return (
    <>
      {/* Floating chat panel */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl transition-all duration-300 ease-out",
          "w-[calc(100vw-2rem)] sm:w-[400px]",
          isOpen ? "h-[560px] opacity-100" : "h-0 w-0 overflow-hidden opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-primary px-4 py-3 text-primary-foreground">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">Travel Assistant</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsOpen(false)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.length === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Hi! How can I help you find the perfect experience?
              </p>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Try asking:
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSuggestedClick(q)}
                      className="rounded-lg border bg-muted/50 px-3 py-2 text-left text-xs hover:bg-muted transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted rounded-bl-md"
                )}
              >
                {message.role === "user" ? (
                  <div className="whitespace-pre-wrap break-words">
                    {message.parts?.map((part, index) =>
                      part.type === "text" ? (
                        <span key={index}>{part.text}</span>
                      ) : null
                    )}
                  </div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:my-1 [&_ul]:my-2 [&_a]:text-primary [&_a]:underline [&_a]:font-medium hover:[&_a]:opacity-90">
                    <ReactMarkdown
                      components={{
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline font-medium hover:opacity-90"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {message.parts
                        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                        .map((p) => p.text)
                        .join("") ?? ""}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mx-4 mb-2 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-destructive">
              Something went wrong. Try again.
            </span>
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearError}>
              Dismiss
            </Button>
          </div>
        )}

        {/* Input */}
        <div className="border-t p-3">
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
              className="min-h-[44px] max-h-24 resize-none text-sm"
              rows={1}
            />
            {isLoading ? (
              <Button type="button" variant="outline" size="icon" onClick={stop} className="shrink-0 h-11 w-11">
                <StopCircle className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || status !== "ready"}
                className="shrink-0 h-11 w-11 bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </form>
        </div>
      </div>

      {/* Floating button - no fixed, parent FloatingActions handles position */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-lg transition-all duration-300",
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105",
          isOpen && "scale-0 opacity-0 pointer-events-none w-0 h-0 overflow-hidden"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </>
  );
}
