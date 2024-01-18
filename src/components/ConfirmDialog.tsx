import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from "@mui/material";
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
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          props.onClose?.();
          props.onConfirmed?.();
        }
      }}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.children}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Tooltip title="Esc">
          <Button
            onClick={() => {
              props.onCancelled?.();
            }}
            variant="contained"
          >
            Cancel
          </Button>
        </Tooltip>
        <Tooltip title="Enter">
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
        </Tooltip>
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
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          props.onClose?.();
          props.onConfirmed?.();
        }
      }}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>{props.children}</DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Tooltip title="Enter">
          <Button
            onClick={() => {
              props.onClose?.();
              props.onConfirmed?.();
            }}
            variant="contained"
          >
            OK
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
