import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React, { PropsWithChildren } from "react";


type ConfirmDialogProps = PropsWithChildren<{
  onClose?: () => void;
  onConfirmed?: () => void;
  onCancelled?: () => void;
  open?: boolean;

  title?: string;
}>;

export function ConfirmDialog(props: ConfirmDialogProps): React.ReactElement {
  return (
    <Dialog
      open={props.open ?? true}
      onClose={() => {
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
            props.onCancelled?.();
          }}
          variant="contained"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
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
  return (
    <Dialog
      open={props.open ?? true}
      onClose={() => {
        props.onClose?.();
        props.onCancelled?.();
      }}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>{props.children}</DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={() => {
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
