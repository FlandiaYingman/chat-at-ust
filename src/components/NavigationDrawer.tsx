import type { Chat } from "@/chats";
import { getBalance } from "@/chats/balance.ts";
import Logo from "@/components/Logo.tsx";
import { NewChatDialog } from "@/components/NewChat.tsx";
import { useChatStore, useSettingsStore } from "@/stores";
import { formatHKD } from "@/utils/currency.ts";
import ChatIcon from "@mui/icons-material/Chat";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import SendIcon from "@mui/icons-material/Send";
import {
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";


function ChatListItem(props: { chat: Chat }): ReactElement {
  const navigate = useNavigate();
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={() => navigate(`/chats/${props.chat.id}`)}>
        <ListItemIcon>
          <ChatIcon />
        </ListItemIcon>
        <ListItemText primary={props.chat.name} secondary={props.chat.hashtag()} />
      </ListItemButton>
    </ListItem>
  );
}

function ChatList(props: { chats: Chat[] }): ReactElement {
  return (
    <List sx={{ overflowY: "auto" }}>
      {props.chats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}
    </List>
  );
}

export function NavigationDrawer(): ReactElement {
  const [key, url] = useSettingsStore(useShallow((s) => [s.azureApiKey, s.azureApiUrl]));

  const data = useChatStore((s) => s.data);
  const chats = useChatStore((s) => s.chats());
  const [balance, setBalance] = useChatStore(useShallow((s) => [s.balance, s.setBalance]));

  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const updateBalance = async () => {
    setBalance(await getBalance(key, url));
  };

  // 1. Update Balance Periodically
  useEffect(() => {
    const interval = setInterval(() => updateBalance(), 60 * 1000);
    return () => clearInterval(interval);
  }, [key, url]);

  // 2. Update Balance on Chats Change
  useEffect(() => {
    updateBalance().then(() => {
    });
  }, [data]);

  return (
    <>
      <Drawer
        sx={{
          width: 340,
        }}
        variant="permanent"
        anchor="left"
        PaperProps={{
          sx: {
            width: 340,
            boxSizing: "border-box",
          },
        }}
      >
        <Stack pt={2} spacing={1} width="100%" height="100%" boxSizing="border-box" useFlexGap>
          <Logo sx={{ px: 2, flexShrink: 0, flexGrow: 0 }} ActionAreaProps={{ sx: { py: 2 } }} />
          <Divider sx={{ flexShrink: 0, flexGrow: 0 }} />
          <Typography sx={{ textAlign: "center" }} variant="overline">
            Balance: <b>{isNaN(balance) ? "N/A" : formatHKD(balance)}</b>
          </Typography>
          <Button
            sx={{ mx: 8, flexShrink: 0, flexGrow: 0 }}
            variant="outlined"
            endIcon={<CreditScoreIcon />}
            href="https://pmt2.ust.hk/openai/"
            target="_blank"
            color="secondary"
          >
            Top Up!
          </Button>
          <Divider sx={{ my: 1, flexShrink: 0, flexGrow: 0 }} />
          <Button
            sx={{ mx: 4, flexShrink: 0, flexGrow: 0 }}
            variant="contained"
            endIcon={<SendIcon />}
            onClick={() => setNewChatDialogOpen(true)}
          >
            New Chat!
          </Button>
          <ChatList chats={Object.values(chats)} />
        </Stack>
      </Drawer>
      <NewChatDialog open={newChatDialogOpen} onClose={() => setNewChatDialogOpen(false)} />
    </>
  );
}
