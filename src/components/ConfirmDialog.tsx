import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React, { PropsWithChildren, useState } from "react";

type ConfirmDialogProps = PropsWithChildren<{
  onClose?: () => void;
  onConfirmed?: () => void;
  onCancelled?: () => void;
  open?: boolean;

  title?: string;
}>;

export function ConfirmDialog(props: ConfirmDialogProps): React.ReactElement {
  const [open, setOpen] = useState(props.open ?? true);
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        props.onClose?.();
        props.onCancelled?.();
      }}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.children}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={() => {
            setOpen(false);
            props.onCancelled?.();
          }}
          variant="contained"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
            props.onClose?.();
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

type AlertDialogProps = PropsWithChildren<{
  onClose?: () => void;
  onConfirmed?: () => void;
  onCancelled?: () => void;
  open?: boolean;

  title?: string;
}>;

export function AlertDialog(props: AlertDialogProps): React.ReactElement {
  const [open, setOpen] = useState(props.open ?? true);
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        props.onClose?.();
        props.onCancelled?.();
      }}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>{props.children}</DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={() => {
            setOpen(false);
            props.onClose?.();
            props.onConfirmed?.();
          }}
          variant="contained"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
