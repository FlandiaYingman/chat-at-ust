import { useChatStore, useSettingsStore } from "@/stores";
import { getBalance } from "@/chats/balance.ts";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import React, { type ReactElement } from "react";

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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Follow the instructions{" "}
          <a href="https://itsc.hkust.edu.hk/services/it-infrastructure/azure-openai-api-service">here</a> to retrieve
          your API key. You can enter either the primary or secondary API key.
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
