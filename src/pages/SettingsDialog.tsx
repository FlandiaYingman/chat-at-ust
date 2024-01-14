import { getBalance } from "@/chats/balance.ts";
import { useChatStore, useSettingsStore } from "@/stores";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import React, { PropsWithChildren, type ReactElement } from "react";

export default function SettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }): ReactElement {
  const settingsStore = useSettingsStore();
  const [azureApiKey, setAzureApiKey] = React.useState(settingsStore.azureApiKey);
  const [azureApiUrl, setAzureApiUrl] = React.useState(settingsStore.azureApiUrl);

  const chatStore = useChatStore();

  const saveSettings = (): void => {
    settingsStore.setAzureApiKey(azureApiKey);
    settingsStore.setAzureApiUrl(azureApiUrl);
    getBalance(settingsStore.azureApiKey, settingsStore.azureApiUrl).then((balance) => chatStore.setBalance(balance));
    onClose();
  };

  const InstructionLink = ({ children }: PropsWithChildren) => (
    <Link href="https://itsc.hkust.edu.hk/services/it-infrastructure/azure-openai-api-service#subscription">
      {children}
    </Link>
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>
          Follow <InstructionLink>the instruction</InstructionLink> to obtain your API key. Either the primary key or
          secondary key will work.
        </DialogContentText>
        <Stack>
          <TextField
            margin="dense"
            label="Azure API Key"
            value={azureApiKey}
            onChange={(e) => {
              setAzureApiKey(e.target.value);
            }}
            fullWidth
            autoFocus
            type="password"
          />
          <TextField
            margin="dense"
            label="Azure API URL"
            value={azureApiUrl}
            onChange={(e) => {
              setAzureApiUrl(e.target.value);
            }}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={saveSettings}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
