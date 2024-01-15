import { FileUpload } from "@mui/icons-material";
import CreateIcon from "@mui/icons-material/Create";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import {
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { ReactElement } from "react";
import { useNavigate } from "react-router";

export function NewChatPanel({ callback = () => {} }: { callback?: () => void }): ReactElement {
  const navigate = useNavigate();
  const action = (to: string) => {
    navigate(to);
    callback();
  };
  return (
    <Grid container spacing={2}>
      <Grid xs={4}>
        <Card>
          <CardActionArea onClick={() => action("/new-chat/presets")}>
            <CardContent>
              <Stack alignItems="center" spacing={1}>
                <ImportContactsIcon />
                <Typography variant="h5">Pre-sets</Typography>
                <Typography variant="body2" color="text.secondary">
                  Create a new chat from one of the delicate pre-sets.
                </Typography>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid xs={4}>
        <Card>
          <CardActionArea onClick={() => action("/new-chat/existing-chats")}>
            <CardContent>
              <Stack alignItems="center" spacing={1}>
                <FileUpload />
                <Typography variant="h5">Import</Typography>
                <Typography variant="body2" color="text.secondary">
                  Create a new chat from previously exported chats.
                </Typography>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid xs={4}>
        <Card>
          <CardActionArea onClick={() => action("/new-chat/customization")}>
            <CardContent>
              <Stack alignItems="center" spacing={1}>
                <CreateIcon />
                <Typography variant="h5">Customization</Typography>
                <Typography variant="body2" color="text.secondary">
                  Create a new chat from your customization.
                </Typography>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  );
}

export function NewChatDialog({ open, onClose }: { open: boolean; onClose: () => void }): ReactElement {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Create a New Chat from... </DialogTitle>
      <DialogContent>
        <NewChatPanel callback={onClose} />
      </DialogContent>
    </Dialog>
  );
}
