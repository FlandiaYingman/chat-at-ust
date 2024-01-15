import { Chat, ChatData } from "@/chats";
import { AlertDialog, ConfirmDialog } from "@/components/ConfirmDialog.tsx";
import { useChatStore } from "@/stores";
import { UploadFile } from "@mui/icons-material";
import { Box, Button, Container, styled, Typography } from "@mui/material";
import { ReactElement, useState } from "react";
import superjson from "superjson";

const VisuallyHiddenInput = styled("input")({
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function ImportStartPage(): ReactElement {
  const chatStore = useChatStore();

  const [data, setData] = useState<Record<string, Chat>>({});
  console.log("data", data);
  const importChat = (chat: Chat) => {
    console.log("save", chat);
    chatStore.setChat(chat);
    const newData = { ...data };
    delete newData[chat.id];
    setData(newData);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, width: "100vw" }}>
      <Typography variant="h3" gutterBottom>
        Create New Chat from Importing
      </Typography>
      <Typography variant="body1" gutterBottom>
        Choose exported chat file(s) to import it / them. The new chat(s) will be the copy of the exported chat(s). Note
        that importing a chat that the original chat is existing will override the existing chat.
      </Typography>
      <Box sx={{ mx: 12, my: 2 }}>
        <Button component="label" variant="contained" startIcon={<UploadFile />} fullWidth color="secondary">
          Import!
          <VisuallyHiddenInput
            type="file"
            accept=".json"
            multiple
            onChange={async (e) => {
              const texts = await Promise.all([...(e.target.files ?? [])].map((f) => f.text()));
              const jsons = texts.map((t) => superjson.parse(t) as ChatData);
              const chats = jsons.map((j) => new Chat(j));
              setData(Object.fromEntries(chats.map((c) => [c.id, c])));
              e.target.value = "";
            }}
          />
        </Button>
      </Box>
      {Object.values(data).map((newChat, i) => {
        const oldChat = chatStore.chat(newChat.id);
        if (oldChat) {
          return (
            <ConfirmDialog
              key={newChat.id + i}
              title="Replace Existing Chat? "
              open={i === 0}
              onConfirmed={() => importChat(newChat)}
            >
              The old chat <b>{oldChat?.fullName()}</b> will be replaced by the new chat <b>{newChat.fullName()}</b>{" "}
              forever (a long time)...
            </ConfirmDialog>
          );
        } else {
          return (
            <AlertDialog key={newChat.id + i} title="Chat Imported" open={i === 0} onClose={() => importChat(newChat)}>
              <b>{newChat.fullName()}</b> is imported.
            </AlertDialog>
          );
        }
      })}
    </Container>
  );
}
