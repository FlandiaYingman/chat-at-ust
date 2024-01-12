import ChatEditor, { ChatParams } from "@/components/ChatEditor.tsx";
import { DefaultDeployment } from "@/deployments";
import { useChatStore } from "@/stores";
import { Container, Link, Typography } from "@mui/material";
import { type ReactElement } from "react";
import { useNavigate } from "react-router";

export default function CustomizationStartPage(): ReactElement {
  const navigate = useNavigate();
  const chatStore = useChatStore();
  const createChat = (params: ChatParams): void => {
    const id = chatStore.newChat({
      name: params.chatName,
      deployment: params.deployment.deployment,
      systemPrompt: params.systemPrompt,
      userPromptTemplate: params.userPromptTemplate,
      temperature: params.temperature,
      maxResponseTokens: params.maxResponseTokens,
      maxHistoryChats: params.maxHistoryChats,
    });
    navigate(`/chats/${id}`);
  };

  return (
    <Container maxWidth="md" sx={{ my: 8, width: "100vw" }}>
      <Typography variant="h3" gutterBottom>
        Create New Chat
      </Typography>
      <Typography gutterBottom>
        If you are not sure how to write a system prompt and user prompt template, you can read through OpenAI&apos;s{" "}
        <Link href="https://platform.openai.com/docs/guides/gpt-best-practices" target="_blank">
          GPT Best Practices
        </Link>{" "}
        to learn more.
      </Typography>
      <ChatEditor
        deployment={DefaultDeployment}
        temperature={0.5}
        maxResponseTokens={2048}
        maxHistoryChats={20}
        chatName="New Chat"
        systemPrompt="You are a helpful assistant."
        userPromptTemplate=""
        onSubmit={createChat}
      />
    </Container>
  );
}
