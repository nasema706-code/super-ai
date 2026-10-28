"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

function textFrom(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

function toolLabel(type: string) {
  if (type === "tool-getWalletSnapshot") return "Chain";
  if (type === "tool-getMarketPulse") return "Market";
  if (type === "tool-consultOracle") return "Oracle";
  if (type === "tool-remember") return "Memory";
  return "Tool";
}

export function CompanionChat({ initialMessages }: { initialMessages: UIMessage[] }) {
  const { messages, sendMessage, status, error, clearError } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const [input, setInput] = useState("");
  const busy = status === "submitted" || status === "streaming";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScrollArea className="min-h-[320px] flex-1">
        <div className="flex flex-col gap-4 px-4 py-5 md:px-5">
          {messages.length === 0 ? (
            <p className="text-sm leading-6 font-light text-muted">
              Dialogue is still in the build stage. A message sent from here will not be answered yet.
            </p>
          ) : null}
          {messages.map((message) => (
            <article key={message.id} className={message.role === "user" ? "text-right" : "text-left"}>
              <p className="kicker">
                {message.role === "user" ? "Holder" : "Super AI"}
              </p>
              <div
                className={
                  message.role === "user"
                    ? "mt-2 inline-block max-w-[92%] bg-foreground px-3 py-2 text-left text-sm font-light text-background"
                    : "mt-2 max-w-[95%] font-display text-base leading-7 font-light text-foreground"
                }
              >
                {textFrom(message) ? <p className="whitespace-pre-wrap">{textFrom(message)}</p> : null}
                {message.parts.map((part, index) => {
                  if (!part.type.startsWith("tool-")) return null;
                  const state = "state" in part ? String(part.state) : "";
                  const output = "output" in part ? part.output : undefined;
                  return (
                    <p key={`${part.type}-${index}`} className="mt-2 text-[11px] tracking-wide text-faint">
                      {toolLabel(part.type)} · {state === "output-available" ? "answered" : "listening"}
                      {output && typeof output === "object" && "line" in output
                        ? ` — ${String((output as { line?: string }).line ?? "")}`
                        : ""}
                    </p>
                  );
                })}
              </div>
            </article>
          ))}
          {busy ? <p className="kicker">Answering</p> : null}
        </div>
      </ScrollArea>
      {error ? (
        <p className="px-4 text-xs text-red-200/80 md:px-5">
          {error.message}{" "}
          <button type="button" className="underline" onClick={() => clearError()}>
            Dismiss
          </button>
        </p>
      ) : null}
      <form
        className="border-t border-border p-4 md:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          const text = input.trim();
          if (!text || busy) return;
          setInput("");
          void sendMessage({ text });
        }}
      >
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Speak to the companion"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <div className="mt-3 flex justify-end">
          <Button type="submit" size="sm" disabled={busy || !input.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
