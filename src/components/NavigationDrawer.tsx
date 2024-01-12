import type { Chat } from "@/chats";
import ConfirmDialog from "@/components/ConfirmDialog.tsx";
import Logo from "@/components/Logo.tsx";
import { NewChatDialog } from "@/components/NewChat.tsx";
import { useChatStore } from "@/stores";
import { formatHKD } from "@/utils/currency.ts";
import { ContentCopyOutlined, FileCopyOutlined } from "@mui/icons-material";
import ChatIcon from "@mui/icons-material/Chat";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SendIcon from "@mui/icons-material/Send";
import {
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { ReactElement, useRef, useState } from "react";
import { useNavigate } from "react-router";

function ChatListItem(props: { chat: Chat }): ReactElement {
  const { chat } = props;

  const chatStore = useChatStore();
  const navigate = useNavigate();

  const anchorRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteChat = () => {
    chatStore.removeChat(props.chat.id);
    navigate(`/`);
  };

  const duplicateChatWithMessages = () => {
    const id = chatStore.newChat({ ...chat, createdAt: undefined, updatedAt: undefined });
    navigate(`/chats/${id}/edit`);
  };
  const duplicateChatWithoutMessages = () => {
    const id = chatStore.newChat({ ...chat, messages: undefined, createdAt: undefined, updatedAt: undefined });
    navigate(`/chats/${id}/edit`);
  };

  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          ref={anchorRef}
          onClick={() => {
            setMenuOpen(true);
          }}
        >
          <MoreHorizIcon />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton
        onClick={() => {
          navigate(`/chats/${props.chat.id}`);
        }}
      >
        <ListItemIcon>
          <ChatIcon />
        </ListItemIcon>
        <ListItemText primary={props.chat.name} secondary={props.chat.hashtag()} />
      </ListItemButton>
      <Menu anchorEl={anchorRef.current} open={menuOpen} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            duplicateChatWithMessages();
          }}
        >
          <ListItemIcon>
            <FileCopyOutlined />
          </ListItemIcon>
          <ListItemText>Duplicate Chat (with Messages)</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            duplicateChatWithoutMessages();
          }}
        >
          <ListItemIcon>
            <ContentCopyOutlined />
          </ListItemIcon>
          <ListItemText>Duplicate Chat (without Messages)</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate(`/chats/${props.chat.id}/edit`);
          }}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>Edit Chat</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setDeleteDialogOpen(true);
          }}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete Chat</ListItemText>
        </MenuItem>
      </Menu>
      <ConfirmDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        title={`Are you sure you want to delete this chat? `}
        text={`"${props.chat.name}${props.chat.hashtag()}" will be lost forever (a long time)... `}
        onConfirmed={deleteChat}
      />
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
  const chatStore = useChatStore();
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
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
            Balance: <b>{isNaN(chatStore.balance) ? "N/A" : formatHKD(chatStore.balance)}</b>
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
          <ChatList chats={Object.values(chatStore.chats())} />
        </Stack>
      </Drawer>
      <NewChatDialog open={newChatDialogOpen} onClose={() => setNewChatDialogOpen(false)} />
    </>
  );
}
