import { completeChat } from "../chats/azure";
import "./styles/ChatPage.css";
import { type Message } from "@/chats";
import { ChatMarkdown } from "@/components/ChatMarkdown.tsx";
import { DeploymentMap } from "@/deployments";
import { useTokenizer } from "@/deployments/tokenizer.ts";
import { useChatStore, useSettingsStore } from "@/stores";
import { formatUSD } from "@/utils/currency.ts";
import { isMarkdown } from "@/utils/markdown.ts";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AssistantIcon from "@mui/icons-material/Assistant";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import SubjectIcon from "@mui/icons-material/Subject";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { type ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router";
import { unstable_usePrompt } from "react-router-dom";
import { v4 } from "uuid";

function Message(props: { message?: Message; history?: boolean; completing?: boolean }): ReactElement {
  const { message = { role: "assistant", content: "" }, history = false, completing = false } = props;

  const theme = useTheme();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [markdown, setMarkdown] = React.useState(isMarkdown(message.content));

  const content = () => {
    if (completing) {
      return <Skeleton />;
    }

    if (message.content === "") {
      return (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          (The prompt is empty.)
        </Typography>
      );
    }
    if (message.error && message.role === "assistant") {
      return (
        <ChatMarkdown variant="body2" color="text.secondary" fontStyle="italic">
          {message.content}
        </ChatMarkdown>
      );
    }

    if (markdown) {
      return <ChatMarkdown>{message.content}</ChatMarkdown>;
    } else {
      return <Typography sx={{ whiteSpace: "break-spaces" }}>{message.content}</Typography>;
    }
  };

  return (
    <Stack spacing={2} direction="row">
      <Stack direction="column" alignItems="center" spacing={0.5} useFlexGap>
        <IconButton
          sx={{
            my: 0.5,
            p: 0,
          }}
        >
          <Avatar
            sx={{
              width: "1.75em",
              height: "1.75em",
              bgcolor: !message.error ? theme.palette.primary.main : theme.palette.error.main,
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {(() => {
              switch (message.role) {
                case "user":
                  return <PersonIcon />;
                case "assistant":
                  return <AssistantIcon />;
              }
            })()}
          </Avatar>
        </IconButton>
        <Collapse in={menuOpen}>
          <Stack direction="column" alignItems="center" spacing={0.5} useFlexGap>
            <Divider sx={{ width: "100%" }} />
            <IconButton size="small" color="primary" onClick={() => setMarkdown(!markdown)}>
              {markdown ? (
                <SubjectIcon />
              ) : (
                <SvgIcon>
                  <FontAwesomeIcon icon={faMarkdown} />
                </SvgIcon>
              )}
            </IconButton>
          </Stack>
        </Collapse>
      </Stack>

      <Paper
        sx={{ p: 2, height: "fit-content", flexGrow: 1, ...(history ? { background: grey[100] } : {}) }}
        variant="outlined"
      >
        <Typography variant="body2" sx={{ overflowWrap: "anywhere" }} component="div">
          {content()}
        </Typography>
      </Paper>
    </Stack>
  );
}

function Messages(props: { messages: Message[]; maxMessages: number; completing: boolean }): ReactElement {
  const { completing, maxMessages } = props;

  function splitMessages<T>(messages: (Message & T)[]): { hMessages: (Message & T)[]; messages: (Message & T)[] } {
    if (maxMessages === 0) return { hMessages: messages, messages: [] };
    for (let count = 0, i = messages.length - 1; i >= 0; i--) {
      if (!messages[i].error) count++;
      if (count === maxMessages * 2) {
        // If it is completing, leave space for the skeleton message.
        if (completing) {
          i = i + 1;
        }
        return { hMessages: messages.slice(0, i), messages: messages.slice(i) };
      }
    }
    return { hMessages: [], messages };
  }

  const { hMessages, messages } = splitMessages(props.messages.map((m) => ({ ...m, id: v4() })));
  const { hidden, history } =
    hMessages.length <= 2
      ? { hidden: [], history: hMessages }
      : { hidden: hMessages.slice(0, -2), history: hMessages.slice(-2) };
  const [showHistory, setShowHistory] = useState(false);

  return (
    <Stack sx={{ my: 2 }} spacing={2}>
      {/* History Messages */}
      {hMessages.length > 0 && (
        <>
          <Collapse in={showHistory}>
            <Stack spacing={2}>
              {hidden.map((m) => (
                <Message key={m.id} message={m} history />
              ))}
            </Stack>
          </Collapse>
          {history.map((m) => (
            <Message key={m.id} message={m} history />
          ))}
          <Divider onClick={() => setShowHistory(!showHistory)} sx={{ cursor: "pointer" }}>
            <Typography variant="caption" color="text.secondary">
              Max Messages (={maxMessages}) Exceeded: Earlier Messages will be Hidden.{" "}
              {showHistory ? (
                <Visibility fontSize="small" sx={{ mb: -0.5 }} />
              ) : (
                <VisibilityOff fontSize="small" sx={{ mb: -0.5 }} />
              )}
            </Typography>
          </Divider>
        </>
      )}

      {/* Active Messages */}
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}

      {/* Skeleton Message */}
      {completing && <Message completing />}
    </Stack>
  );
}

export default function ChatPage(): ReactElement {
  const params = useParams();
  const id = params.id;

  const settingsStore = useSettingsStore();
  const chatStore = useChatStore();
  const chat = chatStore.chat(id ?? "");

  if (chat == null) {
    return <></>;
  }

  const [prompt, setPrompt] = React.useState("");
  const [completing, setCompleting] = React.useState(false);

  const complete = (): void => {
    if (completing) return;
    setCompleting(true);

    const newChat = chat.newMessage("user", prompt);
    chatStore.setChat(newChat);

    setPrompt("");

    completeChat(newChat, settingsStore.azureApiKey, settingsStore.azureApiUrl)
      .then(
        (chat) => chatStore.setChat(chat),
        (error) => console.error(error),
      )
      .then(() => setCompleting(false));
  };

  const { tokens, price } = useTokenizer(DeploymentMap[chat.deployment], prompt);

  // confirm if user wants to exit the webpage if completing
  useEffect(() => {
    if (completing) {
      window.onbeforeunload = (e) => {
        e.preventDefault();
      };
      return () => {
        window.onbeforeunload = null;
      };
    }
  }, [completing]);
  unstable_usePrompt({
    message: "The chat is not complete yet. Leave?",
    when: ({ currentLocation, nextLocation }) => completing && currentLocation.pathname !== nextLocation.pathname,
  });

  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      <Box sx={{ m: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ display: "inline" }}>
            {chat.name}{" "}
          </Typography>
          <Typography variant="subtitle1" sx={{ display: "inline" }}>
            {chat.hashtag()}
          </Typography>
        </Box>

        <Typography variant="overline" gutterBottom>
          {chat.deployment}
        </Typography>
        <ChatMarkdown base="body2" color="text.secondary" fontStyle="italic">
          {chat.systemPrompt}
        </ChatMarkdown>
      </Box>

      <Messages messages={chat.messages} completing={completing} maxMessages={chat.maxMessages} />

      <TextField
        sx={{ mt: 2 }}
        autoFocus
        label="User Prompt"
        placeholder={chat.userTemplatePrompt !== "" ? "[Tab] " + chat.userTemplatePrompt : ""}
        fullWidth
        multiline
        minRows={8}
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Tab" && prompt === "") {
            e.preventDefault();
            setPrompt(chat.userTemplatePrompt);
          }
          if (e.ctrlKey && e.key === "Enter") {
            e.preventDefault();
            complete();
          }
        }}
      />
      <Typography variant="caption">
        You have entered {prompt.length} characters for system prompt, which is {tokens} tokens and costs&nbsp;
        {formatUSD(price)}.
      </Typography>
      <Stack direction="row-reverse">
        <Tooltip title="Complete Chat (Control+Enter)" arrow>
          <Button variant="contained" size="large" color="secondary" onClick={complete} disabled={completing}>
            <SendIcon />
          </Button>
        </Tooltip>
      </Stack>
    </Container>
  );
}
