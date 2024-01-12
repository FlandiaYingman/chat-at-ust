import { completeChat } from "../chats/azure";
import "./styles/ChatPage.css";
import { type Message } from "@/chats";
import { getBalance } from "@/chats/balance.ts";
import { ChatMarkdown } from "@/components/ChatMarkdown.tsx";
import { DeploymentMap } from "@/deployments";
import { useTokenizer } from "@/deployments/tokenizer.ts";
import { useChatStore, useSettingsStore } from "@/stores";
import { formatUSD } from "@/utils/currency.ts";
import { isMarkdown } from "@/utils/markdown.ts";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import React, { type ReactElement } from "react";
import { useParams } from "react-router";

function ChatBalloon(props: { message: Message; onDelete: () => void }): ReactElement {
  const theme = useTheme();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [markdown, setMarkdown] = React.useState(isMarkdown(props.message.content));

  const content = () => {
    if (props.message.content === "") {
      return (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          (The prompt is empty.)
        </Typography>
      );
    }
    if (props.message.role === "error") {
      return (
        <ChatMarkdown variant="body2" color="text.secondary" fontStyle="italic">
          {props.message.content}
        </ChatMarkdown>
      );
    }

    if (markdown) {
      return <ChatMarkdown>{props.message.content}</ChatMarkdown>;
    } else {
      return <Typography sx={{ whiteSpace: "break-spaces" }}>{props.message.content}</Typography>;
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
              bgcolor: props.message.role !== "error" ? theme.palette.primary.main : theme.palette.error.main,
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {(() => {
              switch (props.message.role) {
                case "user":
                  return <PersonIcon />;
                case "assistant":
                case "error":
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

      <Paper sx={{ p: 2, height: "fit-content", flexGrow: 1 }} variant="outlined">
        <Typography
          variant="body2"
          sx={{
            my: "auto !important",
            minWidth: "0", // prevent flexbox from overflowing
          }}
          component="div"
        >
          {content()}
        </Typography>
      </Paper>
    </Stack>
  );
}

function LoadingChatBalloon(): ReactElement {
  const theme = useTheme();

  return (
    <Stack sx={{ my: 2 }} spacing={0} direction="row">
      <IconButton
        sx={{
          p: 0,
          alignSelf: "start",
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: theme.palette.primary.main,
          }}
        >
          <AssistantIcon />
        </Avatar>
      </IconButton>
      <Box sx={{ width: "100%" }}>
        <Skeleton animation="wave" sx={{ mx: 2 }} />
      </Box>
    </Stack>
  );
}

export default function ChatPage(): ReactElement {
  const params = useParams();
  const id = params.id;

  const settingsStore = useSettingsStore();
  const chatStore = useChatStore();
  const chat = chatStore.chat(id ?? "");
  const [prompt, setPrompt] = React.useState("");

  const [completing, setCompleting] = React.useState(false);

  if (chat == null) {
    return (
      <Container
        maxWidth="md"
        sx={{
          my: 8,
          width: "100vw",
        }}
      >
        <Box sx={{ m: 2 }}>
          <Typography variant="h3">404 Not Found</Typography>
        </Box>
      </Container>
    );
  }

  const refreshBalance = () => {
    getBalance(settingsStore.azureApiKey, settingsStore.azureApiUrl).then((balance) => {
      chatStore.setBalance(balance);
    });
  };

  const complete = (): void => {
    if (completing) {
      return;
    } else {
      setCompleting(true);
    }

    const completingChat = chat.newMessage("user", prompt);

    chatStore.setChat(completingChat);
    setPrompt("");

    completeChat(completingChat, settingsStore.azureApiKey, settingsStore.azureApiUrl)
      .then(
        (chat) => {
          chatStore.setChat(chat);
          setCompleting(false);
        },
        (error) => {
          console.error("uncaught error", error);
          setCompleting(false);
        },
      )
      .then(() => refreshBalance());
  };
  const { tokens, price } = useTokenizer(DeploymentMap[chat.deployment], prompt);

  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      <Box sx={{ m: 2 }}>
        <Typography variant="h3">
          {chat.name}{" "}
          <Typography variant="subtitle1" sx={{ display: "inline" }}>
            {chat.hashtag()}
          </Typography>
        </Typography>

        <Typography variant="overline" gutterBottom>
          {chat.deployment}
        </Typography>
        <ChatMarkdown base="body2" color="text.secondary" fontStyle="italic">
          {chat.systemPrompt}
        </ChatMarkdown>
      </Box>

      <Stack sx={{ my: 2 }} spacing={2}>
        {chat.messages.map((message, i) => (
          <React.Fragment key={i}>
            <ChatBalloon message={message} onDelete={() => {}} />
          </React.Fragment>
        ))}
        {completing && (
          <React.Fragment>
            <LoadingChatBalloon />
          </React.Fragment>
        )}
      </Stack>

      <TextField
        sx={{ mt: 2 }}
        autoFocus
        label="User's Prompt"
        placeholder={chat.userPromptTemplate !== "" ? "[Tab] " + chat.userPromptTemplate : "What is HKUST? "}
        fullWidth
        multiline
        rows={8}
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Tab" && prompt === "") {
            e.preventDefault();
            setPrompt(chat.userPromptTemplate);
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
      <Stack direction="row-reverse" sx={{ m: 2 }}>
        <Tooltip title="Control+Enter" arrow>
          <Button variant="contained" size="large" color="secondary" onClick={complete} disabled={completing}>
            <SendIcon />
          </Button>
        </Tooltip>
      </Stack>
    </Container>
  );
}
