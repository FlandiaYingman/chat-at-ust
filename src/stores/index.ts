import { Chat, ChatData, compareChat } from "@/chats";
import superjson from "superjson";
import { v1 } from "uuid";
import { create } from "zustand";
import { combine, persist } from "zustand/middleware";

const useSettingsStore = create(
  persist(
    combine(
      {
        azureApiKey: "",
        azureApiUrl: "https://chatgpt-at-hkust-cors.flandia.dev/",
      },
      (set) => ({
        setAzureApiKey: (azureApiKey: string) => {
          set({ azureApiKey });
        },
        setAzureApiUrl: (azureApiUrl: string) => {
          set({ azureApiUrl });
        },
      }),
    ),
    {
      name: "settings-storage",
    },
  ),
);

type ChatParams = {
  name: string;
  systemPrompt: string;
  userPromptTemplate: string;
  deployment: string;
  temperature: number;
  maxResponseTokens: number;
  messageHistoryLimit: number;
};

interface ChatState {
  data: Record<string, ChatData>;
  chats: () => Record<string, Chat>;

  newChat: (chat: ChatParams | ChatData) => string;
  removeChat: (id: string) => void;

  chat: (id: string) => Chat | null;
  setChat: (chat: ChatData) => void;

  balance: number;
  setBalance: (balance: number) => void;
}

const useChatStore = create(
  persist<ChatState>(
    (set, get) => ({
      data: {},
      chats: () => {
        const dataEntries: [string, ChatData][] = Object.entries(get().data);
        const chatEntries: [string, Chat][] = dataEntries.map(([id, data]) => [id, new Chat(data)]);
        chatEntries.sort(([, aChat], [, bChat]) => compareChat(aChat, bChat));
        return Object.fromEntries(chatEntries);
      },

      newChat: (chat) => {
        const id = v1();
        get().setChat(
          new Chat({
            ...chat,
            id,
          }),
        );
        return id;
      },
      removeChat: (id) => {
        set((state) => {
          const data = { ...state.data };
          delete data[id];
          return { data };
        });
      },
      chat: (id) => {
        return get().data[id] ? new Chat(get().data[id]) : null;
      },
      setChat: (chat) => {
        set((state) => ({
          data: {
            ...state.data,
            [chat.id]: { ...chat },
          },
        }));
      },

      balance: NaN,
      setBalance: (balance: number) => {
        set(() => ({
          balance: balance,
        }));
      },
    }),
    {
      name: "chat-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (str) return superjson.parse(str);
          else return null;
        },
        setItem: (name, value) => {
          const str = superjson.stringify(value);
          localStorage.setItem(name, str);
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    },
  ),
);

export { useSettingsStore, useChatStore };
