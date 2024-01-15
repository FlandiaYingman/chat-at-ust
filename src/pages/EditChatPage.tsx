import { ChatParams } from "@/chats";
import ChatEditor from "@/components/ChatEditor.tsx";
import { useChatStore } from "@/stores";
import { Container, Link, Typography } from "@mui/material";
import { ReactElement } from "react";
import { useNavigate, useParams } from "react-router";

export default function EditChatPage(): ReactElement {
  const params = useParams();
  const id = params.id;
  const chatStore = useChatStore();
  if (id == null) return <div>404 Not Found</div>;

  const chat = chatStore.chat(id);
  if (chat == null) return <div>404 Not Found</div>;

  const navigate = useNavigate();

  const editChat = (params: ChatParams): void => {
    chatStore.setChat({
      ...chat,
      ...params,
    });
    navigate(`/chats/${id}`);
  };

  return (
    <Container maxWidth="md" sx={{ my: 8, width: "100vw" }}>
      <Typography variant="h3" gutterBottom>
        Edit Chat: {chat.name}
      </Typography>
      <Typography gutterBottom>
        If you are not sure how to write a system prompt and user prompt template, you can read through OpenAI&apos;s{" "}
        <Link href="https://platform.openai.com/docs/guides/gpt-best-practices" target="_blank">
          GPT Best Practices
        </Link>{" "}
        to learn more.
      </Typography>
      <ChatEditor
        name={chat.name}
        deployment={chat.deployment}
        temperature={chat.temperature}
        maxTokens={chat.maxTokens}
        maxMessages={chat.maxMessages}
        systemPrompt={chat.systemPrompt}
        userTemplatePrompt={chat.userTemplatePrompt}
        onSubmit={editChat}
      />
    </Container>
  );
}
