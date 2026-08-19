import { OpenAIProvider } from "./providers/openai";
import { AnthropicProvider } from "./providers/anthropic";
import { GoogleProvider } from "./providers/google";
import { AIProvider, ChatMessage } from "./providers/types";

export type ProviderName = "auto" | "openai" | "anthropic" | "google";

function available(name: ProviderName) {
  if (name === "openai") return !!process.env.OPENAI_API_KEY;
  if (name === "anthropic") return !!process.env.ANTHROPIC_API_KEY;
  if (name === "google") return !!process.env.GOOGLE_API_KEY;
  return false;
}

export function chooseProvider(requested: ProviderName, messages: ChatMessage[]): AIProvider {
  const chosen = requested === "auto"
    ? (available("openai") ? "openai" : available("anthropic") ? "anthropic" : "google")
    : requested;

  if (chosen === "openai" && available("openai")) return new OpenAIProvider();
  if (chosen === "anthropic" && available("anthropic")) return new AnthropicProvider();
  if (chosen === "google" && available("google")) return new GoogleProvider();

  throw new Error("No configured AI provider. Add an API key to .env.local.");
}