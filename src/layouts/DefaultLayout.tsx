import Logo from "../components/Logo";
import SettingsDialog from "../pages/SettingsDialog";
import { type Chat } from "@/chats";
import ConfirmDialog from "@/components/ConfirmDialog.tsx";
import { NewChatDialog } from "@/components/NewChat.tsx";
import { useChatStore } from "@/stores";
import { formatHKD } from "@/utils/currency.ts";
import ChatIcon from "@mui/icons-material/Chat";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SendIcon from "@mui/icons-material/Send";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Fab,
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
import { type ReactElement, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router";

function ChatListItem(props: { chat: Chat }): ReactElement {
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

function NavigationDrawer(): ReactElement {
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

function DefaultLayout(): ReactElement {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <NavigationDrawer />
      <Outlet />
      <Fab
        color="secondary"
        style={{
          position: "fixed",
          right: 32,
          bottom: 32,
        }}
        onClick={() => {
          setDialogOpen(!dialogOpen);
        }}
      >
        <SettingsIcon />
      </Fab>
      <SettingsDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
      />
    </Box>
  );
}

export default DefaultLayout;
