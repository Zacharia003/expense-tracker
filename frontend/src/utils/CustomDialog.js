import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";

const CustomDialog = ({
  open,
  onClose,
  title,
  content,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const dialogStyles =
    title === "Add Quick Note"
      ? {
          width: "80%", // Adjust the width as needed
          maxWidth: "700px", // Adjust the max-width as needed
          height: "350px", // Adjust the height as needed
          maxHeight: "80vh", // Adjust the max-height as needed
        }
      : { marginBottom: 0 };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        position: "fixed",
        bottom: "80px", // Adjust to match menu position
        right: "55px", // Adjust to match menu position
        "& .MuiDialog-paper": dialogStyles,
      }}
    >
      <DialogTitle style={{ textAlign: "center", color: "#1976d2" }}>
        {title}
      </DialogTitle>
      <DialogContent>
        {typeof content === "string" ? (
          <DialogContentText>{content}</DialogContentText>
        ) : (
          content
        )}
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        <Button onClick={onClose} variant="contained" color="secondary">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant="contained" color="secondary">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
