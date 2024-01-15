import promptsChatAtUST from "./chat-at-ust-prompts.yaml";
import promptsPromptsDotChat from "./prompts-dot-chat-prompts.yaml";
import Fuse from "fuse.js";

export type Preset = {
  name: string;
  systemPrompt: string;
  userTemplatePrompt?: string;
};

export const presetsChatAtHKUST = promptsChatAtUST as Preset[];
export const presetsPromptsChat = promptsPromptsDotChat as Preset[]
export const presets: Record<string, Preset[]> = {
  "chat@hkust": presetsChatAtHKUST,
  "prompts.chat": presetsPromptsChat,
};

export function filterPresets(presets: Preset[], pattern: string): Preset[] {
  if (pattern === "") return presets;
  const fuse = new Fuse(presets, {
    ignoreLocation: true,
    keys: ["name", "systemPrompt", "userTemplatePrompt"],
  });
  return fuse.search(pattern).map((result) => result.item);
}
