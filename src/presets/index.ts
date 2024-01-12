import promptsChatGPTAtHKUST from "./chatgpt@hkust-prompts.tsx";
import promptsChatPrompts from "./prompts.chat-prompts.json";
import Fuse from "fuse.js";

export type Preset = {
  name: string;
  systemPrompt: string;
  userPromptTemplate?: string;
};

export const presetsChatAtHKUST = promptsChatGPTAtHKUST;
export const presetsPromptsChat = promptsChatPrompts;
export const presets: Record<string, Preset[]> = {
  "chat@hkust": presetsChatAtHKUST,
  "prompts.chat": presetsPromptsChat,
};

export function filterPresets(presets: Preset[], pattern: string): Preset[] {
  if (pattern === "") return presets;
  const fuse = new Fuse(presets, {
    ignoreLocation: true,
    keys: ["name", "systemPrompt", "userPromptTemplate"],
  });
  return fuse.search(pattern).map((result) => result.item);
}
