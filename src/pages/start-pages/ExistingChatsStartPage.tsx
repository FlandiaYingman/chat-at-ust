import { Chat } from "@/chats";
import { ChatMarkdown } from "@/components/ChatMarkdown.tsx";
import { useChatStore } from "@/stores";
import { Box, Card, CardActionArea, CardContent, Collapse, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { ReactElement, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

function ExistingChatCard({ chat }: { chat: Chat }): ReactElement {
  const [hover, setHover] = useState(false);

  const promptElement = useRef<HTMLSpanElement>(null);
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    if (promptElement.current) {
      setHeight(promptElement.current.offsetHeight);
    }
  }, []);

  const navigate = useNavigate();
  const chatStore = useChatStore();

  const createChatFromExistingChat = () => {
    console.log("createChatFromExistingChat", chat);
    const id = chatStore.newChat({
      name: chat.name,
      deployment: chat.deployment,
      systemPrompt: chat.systemPrompt,
      userPromptTemplate: chat.userPromptTemplate,
      temperature: chat.temperature,
      maxResponseTokens: chat.maxResponseTokens,
      maxHistoryChats: chat.maxHistoryChats,
    });
    navigate(`/chats/${id}`);
  };

  return (
    <Card>
      <CardActionArea
        onClick={createChatFromExistingChat}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <CardContent>
          <Typography variant="h5">
            {chat.name}&nbsp;
            <Box sx={{ typography: "subtitle1", display: "inline" }}>{chat.hashtag()}</Box>
          </Typography>
          <Box
            ref={promptElement}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              position: "absolute",
              visibility: "hidden",
            }}
          >
            <ChatMarkdown noGutter base="body2" color="text.secondary">
              {chat.systemPrompt}
            </ChatMarkdown>
          </Box>
          <Collapse in={hover} collapsedSize={height}>
            <ChatMarkdown noGutter base="body2" color="text.secondary">
              {chat.systemPrompt}
            </ChatMarkdown>
          </Collapse>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function ExistingChatsStartPage(): ReactElement {
  const chatStore = useChatStore();

  return (
    <Container maxWidth="md" sx={{ mt: 8, width: "100vw" }}>
      <Typography variant="h3" gutterBottom>
        Create New Chat from an Existing Chat
      </Typography>
      <Typography variant="body1" gutterBottom>
        Choose an existing chat to start a chat. The new chat will be a copy of the existing chat. However, the messages
        will not be copied.
      </Typography>
      <Grid container spacing={2} sx={{ my: 2, maxHeight: "100vh", overflowY: "auto" }}>
        {Object.values(chatStore.chats()).map((chat) => (
          <Grid key={chat.name} xs={12}>
            <ExistingChatCard chat={chat} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
