import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

type ConfirmDialogParams = {
  onConfirmed?: () => void;
  onCancelled?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;

  title: string;
  text: string;
};

export default function ConfirmDialog(props: ConfirmDialogParams): React.ReactElement {
  const closeDialog = () => props.setOpen(false);
  return (
    <Dialog
      open={props.open}
      onClose={() => {
        closeDialog();
        props.onCancelled?.();
      }}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.text}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={() => {
            closeDialog();
            props.onCancelled?.();
          }}
          variant="contained"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            closeDialog();
            props.onConfirmed?.();
          }}
          color="error"
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
