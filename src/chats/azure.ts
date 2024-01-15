import { type Chat, type MessageRole } from "./index";
import { AzureKeyCredential, ChatRequestMessage, OpenAIClient } from "@azure/openai";

export async function completeChat(chat: Chat, azureApiKey: string, azureApiUrl: string): Promise<Chat> {
  const client = new OpenAIClient(azureApiUrl, new AzureKeyCredential(azureApiKey), {
    allowInsecureConnection: true,
    apiVersion: "2023-05-15",
  });

  const lastNMessages = -(chat.maxMessages * 2 + 1);
  const messages = [
    {
      role: "system",
      content: chat.systemPrompt,
    },
    ...chat.messages.slice(lastNMessages).map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ] as ChatRequestMessage[];
  const deployment = chat.deployment;

  console.log("Completing Messages", messages);
  return await client
    .getChatCompletions(deployment, messages, {
      maxTokens: chat.maxTokens,
      temperature: chat.temperature,
      n: 1,
    })
    .then(
      (completions) => {
        const message = completions.choices[0].message;
        if (message != null) {
          return chat.newMessage(message.role as MessageRole, message.content ?? "");
        } else {
          console.log(completions);
          console.log(chat);
          return chat.newMessage("error", JSON.stringify(completions));
        }
      },
      (error) => {
        console.log(error);
        console.log(chat);
        return chat.newMessage("error", error.message);
      },
    );
}
